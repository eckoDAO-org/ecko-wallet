import { useExecPactWithLocalAccount } from 'src/hooks/pact';
import { useStakingConstants } from '../constants/staking';

export interface AccountData {
  // TODO
}

export const useGetAccountData = () => {
  const STAKING_CONSTANTS = useStakingConstants();
  return useExecPactWithLocalAccount('(kaddex.dao.get-account-data "{{ACCOUNT}}")', STAKING_CONSTANTS.chainId);
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

// This differs from total KDX balance because it is only the balance on the kaddex chain
export const useGetAccountDetails = () => {
  const STAKING_CONSTANTS = useStakingConstants();
  return useExecPactWithLocalAccount<KdxDetails>('(kaddex.kdx.details "{{ACCOUNT}}")', STAKING_CONSTANTS.chainId);
};
