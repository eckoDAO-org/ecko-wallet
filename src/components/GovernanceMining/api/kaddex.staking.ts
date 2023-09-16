import { useExecPactWithLocalAccount } from 'src/hooks/pact';
import { CHAIN_ID } from '../constants';

export const useInspectStaker = () => useExecPactWithLocalAccount('(kaddex.staking.inspect-staker "{{ACCOUNT}}")', CHAIN_ID);
