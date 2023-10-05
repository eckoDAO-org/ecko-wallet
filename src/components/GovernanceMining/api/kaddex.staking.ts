import Pact from 'pact-lang-api';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { useAppSelector } from 'src/stores/hooks';
import { getSelectedNetwork } from 'src/stores/extensions';
import { payGasCap, useExecCommand, useExecPactWithLocalAccount, usePoolRequestKey } from 'src/hooks/pact';
import { getTimestamp } from 'src/utils';
import { getApiUrl } from 'src/utils/chainweb';
import { CONFIG, ECKO_WALLET_SEND_TX_NONCE } from 'src/utils/config';
import { addLocalActivity } from 'src/utils/storage';
import { CHAIN_ID } from '../constants';
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

export const useInspectStaker = () => useExecPactWithLocalAccount<StakerInspection>('(kaddex.staking.inspect-staker "{{ACCOUNT}}")', CHAIN_ID);

export interface StakeResult {
  request: any;
  response: any;
}

export type UnstakeResult = StakeResult;

export const useStake = () => {
  const { account } = useCurrentWallet();
  const execCommand = useExecCommand<StakeResult>();

  return (amount: number) => {
    const parsedAmount = reduceBalance(amount);
    const pactCode = `(kaddex.staking.stake "${account}" (read-decimal 'amount))`;

    const wrapKdxCap = Pact.lang.mkCap('wrap capability', 'wrapping skdx', 'kaddex.kdx.WRAP', [
      'kaddex.skdx',
      account,
      account,
      parsedAmount,
    ]);
    const stakeCap = Pact.lang.mkCap('stake capability', 'staking', 'kaddex.staking.STAKE', [
      account,
      parsedAmount,
    ]);
    const caps = [
      payGasCap,
      wrapKdxCap,
      stakeCap,
    ];

    const envData = {
      amount: parsedAmount,
    };

    return execCommand(pactCode, CHAIN_ID, caps, envData);
  };
};

export const usePoolStakeRequest = () => {
  const poolRequestKey = usePoolRequestKey<string>();

  return (requestKey: string) => (
    poolRequestKey(requestKey, CHAIN_ID)
  );
};

export const createPendingStakeActivity = (stakeResult: StakeResult) => {
  const activity = {
    symbol: 'KDX',
    requestKey: stakeResult.response.requestKeys[0],
    senderChainId: CHAIN_ID,
    receiverChainId: CHAIN_ID,
    receiver: 'Stake KDX',
    createdTime: (new Date(stakeResult.request.meta.creationTime * 1000)).toString(),
    amount: stakeResult.request.payload.exec.data.amount,
    gasPrice: stakeResult.request.meta.gasPrice,
    sender: stakeResult.request.meta.sender,
    status: 'pending',
  };

  addLocalActivity(stakeResult.request.networkId, stakeResult.request.meta.sender, activity);
};

export const useRollupAndUnstake = () => {
  const { account } = useCurrentWallet();
  const execCommand = useExecCommand<UnstakeResult>();

  return (amount: number) => {
    const parsedAmount = reduceBalance(amount);
    const pactCode = `
      (kaddex.staking.rollup "${account}")
      (kaddex.staking.unstake "${account}" (read-decimal 'amount))
    `;

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
    const unstakeCap = Pact.lang.mkCap('unstake capability', 'unstaking', 'kaddex.staking.UNSTAKE', [
      account,
    ]);
    const caps = [
      payGasCap,
      rollupCap,
      unwrapRewardsKdxCap,
      unwrapPenaltyKdxCap,
      unstakeCap,
    ];

    const envData = {
      amount: parsedAmount,
    };

    return execCommand(pactCode, CHAIN_ID, caps, envData);
  };
};

export const usePoolUnstakeRequest = () => {
  const poolRequestKey = usePoolRequestKey<boolean>();

  return (requestKey: string) => (
    poolRequestKey(requestKey, CHAIN_ID)
  );
};

export const createPendingUnstakeActivity = (unstakeResult: UnstakeResult) => {
  const activity = {
    symbol: 'KDX',
    requestKey: unstakeResult.response.requestKeys[0],
    senderChainId: CHAIN_ID,
    receiverChainId: CHAIN_ID,
    receiver: 'Unstake KDX',
    createdTime: (new Date(unstakeResult.request.meta.creationTime * 1000)).toString(),
    amount: unstakeResult.request.payload.exec.data.amount,
    gasPrice: unstakeResult.request.meta.gasPrice,
    sender: unstakeResult.request.meta.sender,
    status: 'pending',
  };

  addLocalActivity(unstakeResult.request.networkId, unstakeResult.request.meta.sender, activity);
};
