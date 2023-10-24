import React from 'react';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import { useStakingConstants } from '../constants/staking';
import MultiplierUI from './UI';

const MultiplierBar = () => {
  const { stakeStatus: { multiplier } } = useGovernanceMining();
  const STAKING_CONSTANTS = useStakingConstants();

  return (
    <MultiplierUI multiplier={multiplier} maxValue={STAKING_CONSTANTS.maxMultiplier} />
  );
};

export default MultiplierBar;
