import { useExecPactWithLocalAccount } from 'src/hooks/pact';
import { KdxDetails } from './kaddex.dao';
import { useStakingConstants } from '../constants/staking';

// This differs from total KDX balance because it is only the balance on the kaddex chain
export const useGetAccountKdxDetails = () => {
  const STAKING_CONSTANTS = useStakingConstants();
  return useExecPactWithLocalAccount<KdxDetails>('(kaddex.kdx.details "{{ACCOUNT}}")', STAKING_CONSTANTS.chainId);
};

export const useGetAccountKdaDetails = () => {
  const STAKING_CONSTANTS = useStakingConstants();
  return useExecPactWithLocalAccount<KdxDetails>('(coin.details "{{ACCOUNT}}")', STAKING_CONSTANTS.chainId);
};
