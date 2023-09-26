import { useExecPactWithLocalAccount } from 'src/hooks/pact';
import { CHAIN_ID } from '../constants';

export interface AccountData {
  // TODO
}

export const useGetAccountData = () => useExecPactWithLocalAccount('(kaddex.dao.get-account-data "{{ACCOUNT}}")', CHAIN_ID);

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
export const useGetAccountDetails = () => useExecPactWithLocalAccount<KdxDetails>('(kaddex.kdx.details "{{ACCOUNT}}")', CHAIN_ID);
