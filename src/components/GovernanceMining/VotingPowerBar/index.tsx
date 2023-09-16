import React from 'react';
import { useGovernanceMining } from 'src/contexts/GovernanceMinigContext';
import { useStakingConstants } from '../helpers/stakingConstants';
import VotingPowerBarUI from './UI';

const VotingPowerBar = () => {
  const { stakeStatus: { votingPower } } = useGovernanceMining();
  const STAKING_CONSTANTS = useStakingConstants();

  return (
    <VotingPowerBarUI votingPower={votingPower / 100} maxValue={STAKING_CONSTANTS.maxPowerVoting} />
  );
};

export default VotingPowerBar;
