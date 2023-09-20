import React from 'react';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import EmptyDetailsView from './EmptyDetails';
import DetailsView from './Details';

const Details = () => {
  const governanceMining = useGovernanceMining();
  const { rewards, stakedTokens, votingPower } = governanceMining.stakeStatus;
  const hasPosition = stakedTokens > 0;

  if (!hasPosition) {
    return <EmptyDetailsView />;
  }

  return (
    <DetailsView
      collected={rewards.collectedTokens}
      effectiveStartDate={rewards.effectiveStartDate}
      rewardPenalty={rewards.penaltyTokens}
      votingPower={votingPower}
    />
  );
};

export default Details;
