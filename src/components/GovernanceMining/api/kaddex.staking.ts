import Pact from 'pact-lang-api';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { ExecCommandResult, payGasCap, useExecCommand, useExecPactWithLocalAccount, usePoolRequestKey } from 'src/hooks/pact';
import { addLocalActivity } from 'src/utils/storage';
import { useStakingConstants } from '../constants/staking';
import { reduceBalance } from '../helpers/numberUtils';

export interface TimestampP {
  timep: string;
}

export interface Timestamp {
  time: string;
}

export interface StakeRecord {
  amount: number;
  'last-stake': TimestampP;
  'last-add-request': TimestampP;
  'start-cumulative': {
    decimal: string;
  };
  'effective-start': TimestampP;
  account: string;
  'last-claim': Timestamp;
  locks: any[];
  rollover: number;
  'pending-add': number;
}

export interface StakerInspection {
  'reward-accrued': number;
  'staked-unlocked': number;
  'reward-penalty': number;
  staked: number;
  'unstake-penalty': number;
  'stake-record': StakeRecord;
  'can-claim': boolean;
  'current-time': TimestampP;
}

export const useInspectStaker = () => {
  const { chainId } = useStakingConstants();
  return useExecPactWithLocalAccount<StakerInspection>('(kaddex.staking.inspect-staker "{{ACCOUNT}}")', chainId);
};

export const useStake = () => {
  const { account } = useCurrentWallet();
  const execCommand = useExecCommand();
  const { chainId } = useStakingConstants();

  return (amount: number) => {
    const parsedAmount = reduceBalance(amount);
    const pactCode = `(kaddex.staking.stake "${account}" (read-decimal 'amount))`;

    const wrapKdxCap = Pact.lang.mkCap('wrap capability', 'wrapping skdx', 'kaddex.kdx.WRAP', ['kaddex.skdx', account, account, parsedAmount]);
    const stakeCap = Pact.lang.mkCap('stake capability', 'staking', 'kaddex.staking.STAKE', [account, parsedAmount]);
    const caps = [payGasCap, wrapKdxCap, stakeCap];

    const envData = {
      amount: parsedAmount,
    };

    return execCommand(pactCode, chainId, caps, envData);
  };
};

export const usePoolStakeRequest = () => {
  const poolRequestKey = usePoolRequestKey<string>();
  const STAKING_CONSTANTS = useStakingConstants();

  return (requestKey: string) => poolRequestKey(requestKey, STAKING_CONSTANTS.chainId);
};

export const useCreatePendingStakeActivity = () => {
  const { chainId } = useStakingConstants();

  return (stakeResult: ExecCommandResult) => {
    const activity = {
      symbol: 'KDX',
      requestKey: stakeResult.response.requestKeys[0],
      senderChainId: chainId,
      receiverChainId: chainId,
      receiver: 'Stake KDX',
      createdTime: new Date(stakeResult.request.meta.creationTime * 1000).toString(),
      amount: stakeResult.request.payload.exec.data.amount,
      gasPrice: stakeResult.request.meta.gasPrice,
      sender: stakeResult.request.meta.sender,
      status: 'pending',
    };

    addLocalActivity(stakeResult.request.networkId, stakeResult.request.meta.sender, activity);
  };
};

export const useRollupAndUnstake = () => {
  const { account } = useCurrentWallet();
  const execCommand = useExecCommand();
  const { chainId } = useStakingConstants();

  return (amount: number, claimRewards: boolean) => {
    const parsedAmount = reduceBalance(amount);
    const pactCode = claimRewards
      ? `
      (kaddex.staking.rollup "${account}")
      (kaddex.staking.claim "${account}")
      (kaddex.staking.unstake "${account}" (read-decimal 'amount))
    `
      : `
      (kaddex.staking.rollup "${account}")
      (kaddex.staking.unstake "${account}" (read-decimal 'amount))
    `;

    const claimCap = Pact.lang.mkCap('claim capability', 'claim', 'kaddex.staking.CLAIM', [account]);
    const rollupCap = Pact.lang.mkCap('rollup capability', 'rollup', 'kaddex.staking.ROLLUP', [account]);
    const unwrapRewardsKdxCap = Pact.lang.mkCap('unwrap capability for rewards', 'unwrapping skdx for user', 'kaddex.kdx.UNWRAP', [
      'kaddex.skdx',
      account,
      account,
      parsedAmount,
    ]);
    const unwrapPenaltyKdxCap = Pact.lang.mkCap('unwrap capability for penalty', 'unwrapping skdx for penalty', 'kaddex.kdx.UNWRAP', [
      'kaddex.skdx',
      account,
      'kdx-staking',
      parsedAmount,
    ]);
    const unstakeCap = Pact.lang.mkCap('unstake capability', 'unstaking', 'kaddex.staking.UNSTAKE', [account]);

    const caps = [payGasCap, rollupCap, unwrapRewardsKdxCap, unwrapPenaltyKdxCap, unstakeCap];

    if (claimRewards) {
      caps.push(claimCap);
    }

    const envData = {
      amount: parsedAmount,
    };

    return execCommand(pactCode, chainId, caps, envData);
  };
};

export const usePoolUnstakeRequest = () => {
  const poolRequestKey = usePoolRequestKey<boolean>();
  const { chainId } = useStakingConstants();

  return (requestKey: string) => poolRequestKey(requestKey, chainId);
};

export const useCreatePendingUnstakeActivity = () => {
  const { chainId } = useStakingConstants();

  return (unstakeResult: ExecCommandResult) => {
    const activity = {
      symbol: 'KDX',
      requestKey: unstakeResult.response.requestKeys[0],
      senderChainId: chainId,
      receiverChainId: chainId,
      receiver: 'Unstake KDX',
      createdTime: new Date(unstakeResult.request.meta.creationTime * 1000).toString(),
      amount: unstakeResult.request.payload.exec.data.amount,
      gasPrice: unstakeResult.request.meta.gasPrice,
      sender: unstakeResult.request.meta.sender,
      status: 'pending',
    };

    addLocalActivity(unstakeResult.request.networkId, unstakeResult.request.meta.sender, activity);
  };
};

export const useClaim = () => {
  const { account } = useCurrentWallet();
  const execCommand = useExecCommand();
  const { chainId } = useStakingConstants();

  return () => {
    const pactCode = `
      (kaddex.staking.rollup "${account}")
      (kaddex.staking.claim "${account}")
    `;

    const claimCap = Pact.lang.mkCap('claim capability', 'claim', 'kaddex.staking.CLAIM', [account]);
    const rollupCap = Pact.lang.mkCap('rollup capability', 'rollup', 'kaddex.staking.ROLLUP', [account]);

    const caps = [payGasCap, rollupCap, claimCap];

    return execCommand(pactCode, chainId, caps);
  };
};

export const usePoolClaimRequest = () => {
  const poolRequestKey = usePoolRequestKey<boolean>();
  const { chainId } = useStakingConstants();

  return (requestKey: string) => poolRequestKey(requestKey, chainId);
};

export const useCreatePendingClaimActivity = () => {
  const { chainId } = useStakingConstants();

  return (claimResult: ExecCommandResult) => {
    const activity = {
      symbol: 'KDX',
      requestKey: claimResult.response.requestKeys[0],
      senderChainId: chainId,
      receiverChainId: chainId,
      receiver: 'Claim KDX',
      createdTime: new Date(claimResult.request.meta.creationTime * 1000).toString(),
      amount: 0,
      gasPrice: claimResult.request.meta.gasPrice,
      sender: claimResult.request.meta.sender,
      status: 'pending',
    };

    addLocalActivity(claimResult.request.networkId, claimResult.request.meta.sender, activity);
  };
};
