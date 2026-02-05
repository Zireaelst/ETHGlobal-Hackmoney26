/// DeepMind Agent Vault - Sui Move implementation
/// 
/// Manages autonomous AI agent vaults with market making and arbitrage capabilities.
/// Integrates with ERC-8004 identity on Base chain.
module deepmind::agent_vault {
    use sui::object::{Self, UID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::coin::{Self, Coin};
    use sui::balance::{Self, Balance};
    use sui::event;
    use sui::clock::{Self, Clock};

    // ============ Error Codes ============
    
    /// Caller is not the vault owner
    const E_NOT_OWNER: u64 = 0;
    /// Vault is currently paused
    const E_VAULT_PAUSED: u64 = 1;
    /// Action is rate limited
    const E_RATE_LIMITED: u64 = 2;
    /// Insufficient balance for operation
    const E_INSUFFICIENT_BALANCE: u64 = 3;
    /// No arbitrage opportunity found
    const E_NO_ARBITRAGE_OPPORTUNITY: u64 = 4;
    /// Unauthorized caller
    const E_UNAUTHORIZED: u64 = 5;

    // ============ Placeholder Token Types ============
    
    /// Placeholder USDC type for testnet
    public struct USDC has drop {}
    
    /// Placeholder token for testing
    public struct TestToken has drop {}

    // ============ Core Structs ============

    /// Agent vault storing funds and tracking performance
    public struct AgentVault has key, store {
        id: UID,
        /// ERC-8004 NFT ID on Base chain
        erc8004_nft_id: u256,
        /// Vault owner address
        owner: address,
        /// Strategy configuration (IPFS hash as bytes)
        strategy: vector<u8>,
        /// USDC balance
        usdc_balance: u64,
        /// SUI balance  
        sui_balance: u64,
        /// Total trades executed
        total_trades: u64,
        /// Profitable trades count
        profitable_trades: u64,
        /// Total profit in USDC (scaled by 1e6)
        total_profit_usdc: u64,
        /// Last action timestamp (ms)
        last_action_timestamp: u64,
        /// Emergency pause flag
        is_paused: bool,
    }

    /// Admin capability for vault management
    public struct AdminCap has key, store {
        id: UID,
    }

    // ============ Events ============

    /// Emitted when agent makes a trading decision
    public struct AgentDecisionEvent has copy, drop {
        nft_id: u256,
        decision_type: vector<u8>,
        bid_price: u64,
        ask_price: u64,
        quantity: u64,
        timestamp: u64,
    }

    /// Emitted when trade is executed
    public struct TradeExecutedEvent has copy, drop {
        nft_id: u256,
        is_buy: bool,
        amount: u64,
        price: u64,
        timestamp: u64,
    }

    /// Emitted when arbitrage is executed
    public struct ArbitrageExecutedEvent has copy, drop {
        nft_id: u256,
        profit_usdc: u64,
        source_price: u64,
        target_price: u64,
        timestamp: u64,
    }

    /// Emitted when performance metrics are updated
    public struct PerformanceUpdateEvent has copy, drop {
        nft_id: u256,
        total_trades: u64,
        profitable_trades: u64,
        total_profit: u64,
    }

    /// Emitted when vault is created
    public struct VaultCreatedEvent has copy, drop {
        vault_id: address,
        nft_id: u256,
        owner: address,
    }

    // ============ Initialization ============

    /// Module initializer - creates admin capability
    fun init(ctx: &mut TxContext) {
        let admin = AdminCap {
            id: object::new(ctx),
        };
        transfer::transfer(admin, tx_context::sender(ctx));
    }

    // ============ Entry Functions ============

    /// Create a new agent vault
    public entry fun create_vault(
        erc8004_nft_id: u256,
        strategy: vector<u8>,
        ctx: &mut TxContext
    ) {
        let owner = tx_context::sender(ctx);
        let vault_uid = object::new(ctx);
        let vault_id = object::uid_to_address(&vault_uid);
        
        let vault = AgentVault {
            id: vault_uid,
            erc8004_nft_id,
            owner,
            strategy,
            usdc_balance: 0,
            sui_balance: 0,
            total_trades: 0,
            profitable_trades: 0,
            total_profit_usdc: 0,
            last_action_timestamp: 0,
            is_paused: false,
        };

        event::emit(VaultCreatedEvent {
            vault_id,
            nft_id: erc8004_nft_id,
            owner,
        });

        transfer::share_object(vault);
    }

    /// Deposit funds to vault (simplified - tracks balance internally)
    public entry fun deposit(
        vault: &mut AgentVault,
        amount: u64,
        is_usdc: bool,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == vault.owner, E_NOT_OWNER);
        
        if (is_usdc) {
            vault.usdc_balance = vault.usdc_balance + amount;
        } else {
            vault.sui_balance = vault.sui_balance + amount;
        };
    }

    /// Execute market making strategy
    public entry fun execute_market_making(
        vault: &mut AgentVault,
        bid_price: u64,
        ask_price: u64,
        quantity: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // Verify not paused
        assert!(!vault.is_paused, E_VAULT_PAUSED);
        
        let current_time = clock::timestamp_ms(clock);
        
        // Rate limiting: minimum 1 second between actions
        assert!(
            current_time >= vault.last_action_timestamp + 1000,
            E_RATE_LIMITED
        );

        // Calculate position sizes based on strategy
        let (bid_size, ask_size) = calculate_mm_sizes(
            &vault.strategy,
            bid_price,
            ask_price,
            quantity,
            vault.usdc_balance,
            vault.sui_balance
        );

        // Simulate order execution (in production, integrate with DeepBook)
        if (bid_size > 0) {
            // Place bid order
            vault.total_trades = vault.total_trades + 1;
        };
        
        if (ask_size > 0) {
            // Place ask order
            vault.total_trades = vault.total_trades + 1;
        };

        vault.last_action_timestamp = current_time;

        // Emit decision event
        event::emit(AgentDecisionEvent {
            nft_id: vault.erc8004_nft_id,
            decision_type: b"market_making",
            bid_price,
            ask_price,
            quantity,
            timestamp: current_time,
        });
    }

    /// Execute arbitrage between price discrepancies
    public entry fun execute_arbitrage(
        vault: &mut AgentVault,
        source_price: u64,
        target_price: u64,
        amount: u64,
        clock: &Clock,
        _ctx: &mut TxContext
    ) {
        assert!(!vault.is_paused, E_VAULT_PAUSED);
        
        let current_time = clock::timestamp_ms(clock);
        
        // Check price difference (minimum 0.5% = 50 bps)
        assert!(
            price_diff_exceeds_threshold(source_price, target_price, 50),
            E_NO_ARBITRAGE_OPPORTUNITY
        );

        // Calculate profit (simplified)
        let profit = if (source_price < target_price) {
            ((target_price - source_price) * amount) / source_price
        } else {
            ((source_price - target_price) * amount) / target_price
        };

        // Update stats
        vault.total_trades = vault.total_trades + 1;
        vault.profitable_trades = vault.profitable_trades + 1;
        vault.total_profit_usdc = vault.total_profit_usdc + profit;
        vault.last_action_timestamp = current_time;

        // Emit event
        event::emit(ArbitrageExecutedEvent {
            nft_id: vault.erc8004_nft_id,
            profit_usdc: profit,
            source_price,
            target_price,
            timestamp: current_time,
        });

        event::emit(PerformanceUpdateEvent {
            nft_id: vault.erc8004_nft_id,
            total_trades: vault.total_trades,
            profitable_trades: vault.profitable_trades,
            total_profit: vault.total_profit_usdc,
        });
    }

    /// Withdraw funds from vault
    public entry fun withdraw(
        vault: &mut AgentVault,
        amount: u64,
        is_usdc: bool,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == vault.owner, E_NOT_OWNER);
        
        if (is_usdc) {
            assert!(vault.usdc_balance >= amount, E_INSUFFICIENT_BALANCE);
            vault.usdc_balance = vault.usdc_balance - amount;
        } else {
            assert!(vault.sui_balance >= amount, E_INSUFFICIENT_BALANCE);
            vault.sui_balance = vault.sui_balance - amount;
        };
    }

    /// Update vault strategy
    public entry fun update_strategy(
        vault: &mut AgentVault,
        new_strategy: vector<u8>,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == vault.owner, E_NOT_OWNER);
        vault.strategy = new_strategy;
    }

    /// Pause vault (emergency stop)
    public entry fun pause_vault(
        vault: &mut AgentVault,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == vault.owner, E_NOT_OWNER);
        vault.is_paused = true;
    }

    /// Resume vault
    public entry fun resume_vault(
        vault: &mut AgentVault,
        ctx: &mut TxContext
    ) {
        assert!(tx_context::sender(ctx) == vault.owner, E_NOT_OWNER);
        vault.is_paused = false;
    }

    // ============ View Functions ============

    /// Get vault statistics
    public fun get_stats(vault: &AgentVault): (u64, u64, u64) {
        (vault.total_trades, vault.profitable_trades, vault.total_profit_usdc)
    }

    /// Get vault balances
    public fun get_balances(vault: &AgentVault): (u64, u64) {
        (vault.usdc_balance, vault.sui_balance)
    }

    /// Check if vault is paused
    public fun is_paused(vault: &AgentVault): bool {
        vault.is_paused
    }

    /// Get vault owner
    public fun get_owner(vault: &AgentVault): address {
        vault.owner
    }

    /// Get ERC-8004 NFT ID
    public fun get_nft_id(vault: &AgentVault): u256 {
        vault.erc8004_nft_id
    }

    // ============ Internal Functions ============

    /// Calculate market making position sizes based on strategy
    fun calculate_mm_sizes(
        strategy: &vector<u8>,
        _bid_price: u64,
        _ask_price: u64,
        _quantity: u64,
        available_usdc: u64,
        available_sui: u64
    ): (u64, u64) {
        // Determine allocation based on strategy type
        let allocation_pct = if (strategy == &b"aggressive") {
            80
        } else if (strategy == &b"balanced") {
            50
        } else {
            30 // conservative/safe
        };

        let bid_size = (available_usdc * allocation_pct) / 100;
        let ask_size = (available_sui * allocation_pct) / 100;

        (bid_size, ask_size)
    }

    /// Check if price difference exceeds threshold (in basis points)
    fun price_diff_exceeds_threshold(
        price_a: u64,
        price_b: u64,
        threshold_bps: u64
    ): bool {
        let diff = if (price_a > price_b) {
            price_a - price_b
        } else {
            price_b - price_a
        };

        let diff_bps = (diff * 10000) / price_a;
        diff_bps >= threshold_bps
    }

    // ============ Test Functions ============
    
    #[test_only]
    public fun init_for_testing(ctx: &mut TxContext) {
        init(ctx)
    }
}
