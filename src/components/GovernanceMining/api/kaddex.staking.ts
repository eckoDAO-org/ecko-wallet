import Pact from 'pact-lang-api';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { useAppSelector } from 'src/stores/hooks';
import { getSelectedNetwork } from 'src/stores/extensions';
import { useExecPactWithLocalAccount, usePoolRequestKey } from 'src/hooks/pact';
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

export const useStake = () => {
  const selectedNetwork = useAppSelector(getSelectedNetwork);
  const { account, publicKey, secretKey } = useCurrentWallet();

  return async (amount: number) => {
    const gasLimit = 10000;
    const gasPrice = 0.000001;
    const parsedAmount = reduceBalance(amount);
    const pactCode = `(kaddex.staking.stake "${account}" (read-decimal 'amount))`;
    const payGasCap = Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS');
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
      payGasCap.cap,
      wrapKdxCap.cap,
      stakeCap.cap,
    ];
    const envData = {
      amount: parsedAmount,
    };
    const meta = Pact.lang.mkMeta(account, CHAIN_ID, gasPrice, gasLimit, getTimestamp(), CONFIG.X_CHAIN_TTL);
    const nonce = `"${ECKO_WALLET_SEND_TX_NONCE}-${new Date().toISOString()}"`;
    const keyPairs = {
      publicKey,
      secretKey,
      clist: caps,
    };

    const cmd = Pact.api.prepareExecCmd(
      keyPairs,
      nonce,
      pactCode,
      envData,
      meta,
      selectedNetwork.networkId,
    );

    const url = getApiUrl(selectedNetwork.url, selectedNetwork.networkId, CHAIN_ID);

    const response = await Pact.wallet.sendSigned(cmd, url);
    const parsedCmd = JSON.parse(cmd.cmd);

    return {
      request: parsedCmd,
      response,
    } as StakeResult;
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
