import React from 'react';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import PositionView from './UI';

const Position = () => {
  const governanceMining = useGovernanceMining();
  const { stakedTokens, pendingTokens } = governanceMining.stakeStatus;

  return (
    <PositionView amount={stakedTokens} pending={pendingTokens} />
  );
};

export default Position;
