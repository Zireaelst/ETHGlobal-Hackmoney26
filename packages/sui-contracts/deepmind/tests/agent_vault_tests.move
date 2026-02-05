/// Test module for agent_vault
#[test_only]
module deepmind::agent_vault_tests {
    use sui::test_scenario::{Self as ts, Scenario};
    use sui::clock::{Self, Clock};
    use deepmind::agent_vault::{Self, AgentVault, AdminCap};

    const OWNER: address = @0xCAFE;
    const OTHER: address = @0xBEEF;

    #[test]
    fun test_create_vault() {
        let mut scenario = ts::begin(OWNER);
        
        // Create vault
        ts::next_tx(&mut scenario, OWNER);
        {
            agent_vault::create_vault(
                1u256, // ERC-8004 NFT ID
                b"balanced",
                ts::ctx(&mut scenario)
            );
        };

        // Verify vault was created
        ts::next_tx(&mut scenario, OWNER);
        {
            let vault = ts::take_shared<AgentVault>(&scenario);
            
            assert!(agent_vault::get_nft_id(&vault) == 1u256, 0);
            assert!(agent_vault::get_owner(&vault) == OWNER, 1);
            assert!(!agent_vault::is_paused(&vault), 2);
            
            let (total, profitable, profit) = agent_vault::get_stats(&vault);
            assert!(total == 0, 3);
            assert!(profitable == 0, 4);
            assert!(profit == 0, 5);

            ts::return_shared(vault);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_deposit() {
        let mut scenario = ts::begin(OWNER);
        
        // Create vault
        ts::next_tx(&mut scenario, OWNER);
        {
            agent_vault::create_vault(1u256, b"balanced", ts::ctx(&mut scenario));
        };

        // Deposit USDC
        ts::next_tx(&mut scenario, OWNER);
        {
            let mut vault = ts::take_shared<AgentVault>(&scenario);
            
            agent_vault::deposit(&mut vault, 1000, true, ts::ctx(&mut scenario));
            
            let (usdc, sui) = agent_vault::get_balances(&vault);
            assert!(usdc == 1000, 0);
            assert!(sui == 0, 1);

            ts::return_shared(vault);
        };

        // Deposit SUI
        ts::next_tx(&mut scenario, OWNER);
        {
            let mut vault = ts::take_shared<AgentVault>(&scenario);
            
            agent_vault::deposit(&mut vault, 500, false, ts::ctx(&mut scenario));
            
            let (usdc, sui) = agent_vault::get_balances(&vault);
            assert!(usdc == 1000, 2);
            assert!(sui == 500, 3);

            ts::return_shared(vault);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_withdraw() {
        let mut scenario = ts::begin(OWNER);
        
        // Create and fund vault
        ts::next_tx(&mut scenario, OWNER);
        {
            agent_vault::create_vault(1u256, b"balanced", ts::ctx(&mut scenario));
        };

        ts::next_tx(&mut scenario, OWNER);
        {
            let mut vault = ts::take_shared<AgentVault>(&scenario);
            agent_vault::deposit(&mut vault, 1000, true, ts::ctx(&mut scenario));
            ts::return_shared(vault);
        };

        // Withdraw
        ts::next_tx(&mut scenario, OWNER);
        {
            let mut vault = ts::take_shared<AgentVault>(&scenario);
            
            agent_vault::withdraw(&mut vault, 400, true, ts::ctx(&mut scenario));
            
            let (usdc, _) = agent_vault::get_balances(&vault);
            assert!(usdc == 600, 0);

            ts::return_shared(vault);
        };

        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = agent_vault::E_NOT_OWNER)]
    fun test_withdraw_unauthorized() {
        let mut scenario = ts::begin(OWNER);
        
        // Create vault
        ts::next_tx(&mut scenario, OWNER);
        {
            agent_vault::create_vault(1u256, b"balanced", ts::ctx(&mut scenario));
        };

        // Try to withdraw as other user
        ts::next_tx(&mut scenario, OTHER);
        {
            let mut vault = ts::take_shared<AgentVault>(&scenario);
            agent_vault::withdraw(&mut vault, 100, true, ts::ctx(&mut scenario));
            ts::return_shared(vault);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_pause_resume() {
        let mut scenario = ts::begin(OWNER);
        
        // Create vault
        ts::next_tx(&mut scenario, OWNER);
        {
            agent_vault::create_vault(1u256, b"balanced", ts::ctx(&mut scenario));
        };

        // Pause
        ts::next_tx(&mut scenario, OWNER);
        {
            let mut vault = ts::take_shared<AgentVault>(&scenario);
            
            agent_vault::pause_vault(&mut vault, ts::ctx(&mut scenario));
            assert!(agent_vault::is_paused(&vault), 0);

            ts::return_shared(vault);
        };

        // Resume
        ts::next_tx(&mut scenario, OWNER);
        {
            let mut vault = ts::take_shared<AgentVault>(&scenario);
            
            agent_vault::resume_vault(&mut vault, ts::ctx(&mut scenario));
            assert!(!agent_vault::is_paused(&vault), 1);

            ts::return_shared(vault);
        };

        ts::end(scenario);
    }

    #[test]
    fun test_update_strategy() {
        let mut scenario = ts::begin(OWNER);
        
        // Create vault with balanced strategy
        ts::next_tx(&mut scenario, OWNER);
        {
            agent_vault::create_vault(1u256, b"balanced", ts::ctx(&mut scenario));
        };

        // Update to aggressive
        ts::next_tx(&mut scenario, OWNER);
        {
            let mut vault = ts::take_shared<AgentVault>(&scenario);
            agent_vault::update_strategy(&mut vault, b"aggressive", ts::ctx(&mut scenario));
            ts::return_shared(vault);
        };

        ts::end(scenario);
    }

    #[test]
    #[expected_failure(abort_code = agent_vault::E_NOT_OWNER)]
    fun test_pause_unauthorized() {
        let mut scenario = ts::begin(OWNER);
        
        ts::next_tx(&mut scenario, OWNER);
        {
            agent_vault::create_vault(1u256, b"balanced", ts::ctx(&mut scenario));
        };

        ts::next_tx(&mut scenario, OTHER);
        {
            let mut vault = ts::take_shared<AgentVault>(&scenario);
            agent_vault::pause_vault(&mut vault, ts::ctx(&mut scenario));
            ts::return_shared(vault);
        };

        ts::end(scenario);
    }
}
