import React from 'react';
import { useGovernanceMining } from 'src/contexts/GovernanceMinigContext';
import PositionView from './UI';

const Position = () => {
  const governanceMining = useGovernanceMining();
  const { stakedTokens } = governanceMining.stakeStatus;

  return (
    <PositionView amount={stakedTokens} />
  );
};

export default Position;
