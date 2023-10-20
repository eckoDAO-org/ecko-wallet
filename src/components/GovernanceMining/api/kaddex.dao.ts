import { useExecPactWithLocalAccount } from 'src/hooks/pact';
import { useStakingConstants } from '../constants/staking';

export interface AccountData {
  'staked-amount': number;
  multiplier: number;
  vp: number;
}

export const useGetAccountData = () => {
  const STAKING_CONSTANTS = useStakingConstants();
  return useExecPactWithLocalAccount<AccountData>('(kaddex.dao.get-account-data "{{ACCOUNT}}")', STAKING_CONSTANTS.chainId);
};

// TODO: move in a more appropriated file
export interface AccountGuard {
  pred: string;
  keys: string[];
}

export interface KdxDetails {
  account: string;
  balance: number;
  guard: AccountGuard;
}
