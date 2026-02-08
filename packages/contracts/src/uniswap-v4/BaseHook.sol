// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IPoolManager} from "v4-core/src/interfaces/IPoolManager.sol";
import {PoolKey} from "v4-core/src/types/PoolKey.sol";
import {Hooks} from "v4-core/src/libraries/Hooks.sol";
import {IHooks} from "v4-core/src/interfaces/IHooks.sol";
import {BeforeSwapDelta, BeforeSwapDeltaLibrary} from "v4-core/src/types/BeforeSwapDelta.sol";
import {BalanceDelta} from "v4-core/src/types/BalanceDelta.sol";

/// @title BaseHook - Abstract base class for Uniswap v4 hooks
/// @notice Provides default implementations for all hook callbacks
/// @dev For DeepMind Vaults hackathon - simplified BaseHook implementation
abstract contract BaseHook is IHooks {
    /// @notice Uniswap v4 PoolManager
    IPoolManager public immutable poolManager;

    error NotPoolManager();
    error NotSelf();
    error InvalidPool();
    error LockFailure();
    error HookNotImplemented();

    constructor(IPoolManager _poolManager) {
        poolManager = _poolManager;
    }

    /// @notice Returns hook permissions - override in child contracts
    function getHookPermissions() public pure virtual returns (Hooks.Permissions memory);

    /// @notice Modifier to ensure caller is pool manager
    modifier poolManagerOnly() {
        if (msg.sender != address(poolManager)) revert NotPoolManager();
        _;
    }

    /// @notice Modifier to ensure caller is this contract (for callbacks)
    modifier selfOnly() {
        if (msg.sender != address(this)) revert NotSelf();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                           HOOK CALLBACKS
    //////////////////////////////////////////////////////////////*/

    /// @inheritdoc IHooks
    function beforeInitialize(address, PoolKey calldata, uint160)
        external
        virtual
        returns (bytes4)
    {
        revert HookNotImplemented();
    }

    /// @inheritdoc IHooks
    function afterInitialize(address, PoolKey calldata, uint160, int24)
        external
        virtual
        returns (bytes4)
    {
        revert HookNotImplemented();
    }

    /// @inheritdoc IHooks
    function beforeAddLiquidity(
        address,
        PoolKey calldata,
        IPoolManager.ModifyLiquidityParams calldata,
        bytes calldata
    ) external virtual returns (bytes4) {
        revert HookNotImplemented();
    }

    /// @inheritdoc IHooks
    function afterAddLiquidity(
        address,
        PoolKey calldata,
        IPoolManager.ModifyLiquidityParams calldata,
        BalanceDelta,
        BalanceDelta,
        bytes calldata
    ) external virtual returns (bytes4, BalanceDelta) {
        revert HookNotImplemented();
    }

    /// @inheritdoc IHooks
    function beforeRemoveLiquidity(
        address,
        PoolKey calldata,
        IPoolManager.ModifyLiquidityParams calldata,
        bytes calldata
    ) external virtual returns (bytes4) {
        revert HookNotImplemented();
    }

    /// @inheritdoc IHooks
    function afterRemoveLiquidity(
        address,
        PoolKey calldata,
        IPoolManager.ModifyLiquidityParams calldata,
        BalanceDelta,
        BalanceDelta,
        bytes calldata
    ) external virtual returns (bytes4, BalanceDelta) {
        revert HookNotImplemented();
    }

    /// @inheritdoc IHooks
    function beforeSwap(
        address,
        PoolKey calldata,
        IPoolManager.SwapParams calldata,
        bytes calldata
    ) external virtual returns (bytes4, BeforeSwapDelta, uint24) {
        revert HookNotImplemented();
    }

    /// @inheritdoc IHooks
    function afterSwap(
        address,
        PoolKey calldata,
        IPoolManager.SwapParams calldata,
        BalanceDelta,
        bytes calldata
    ) external virtual returns (bytes4, int128) {
        revert HookNotImplemented();
    }

    /// @inheritdoc IHooks
    function beforeDonate(address, PoolKey calldata, uint256, uint256, bytes calldata)
        external
        virtual
        returns (bytes4)
    {
        revert HookNotImplemented();
    }

    /// @inheritdoc IHooks
    function afterDonate(
        address,
        PoolKey calldata,
        uint256,
        uint256,
        bytes calldata
    ) external virtual returns (bytes4) {
        revert HookNotImplemented();
    }
}
