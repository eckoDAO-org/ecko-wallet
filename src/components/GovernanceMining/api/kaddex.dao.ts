import { useExecPactWithLocalAccount } from 'src/hooks/pact';
import { CHAIN_ID } from '../constants';

export interface AccountData {
  // TODO
}

export const useGetAccountData = () => useExecPactWithLocalAccount('(kaddex.dao.get-account-data "{{ACCOUNT}}")', CHAIN_ID);
