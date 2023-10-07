import React from 'react';
import moment from 'moment';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import AmountSelectorView from './AmountSelectorView';
import { useStakingConstants } from '../constants/staking';

interface AmountSelectorProps {
  onAmountSelected: (amount: number) => void;
}

const AmountSelector = ({ onAmountSelected }: AmountSelectorProps) => {
  const governanceMining = useGovernanceMining();
  const STAKING_CONSTANTS = useStakingConstants();

  const { rewards, stakedTokens: unstakeableKdx } = governanceMining.stakeStatus;
  const hoursToWait = STAKING_CONSTANTS.percentagePenaltyHours - moment().diff(rewards.lastStakeDate, 'hours');
  const hasPositionPenalty = hoursToWait > 0;

  return (
    <AmountSelectorView
      balance={unstakeableKdx}
      hasPositionPenalty={hasPositionPenalty}
      positionPenaltyPercentage={STAKING_CONSTANTS.percentagePenalty}
      waitingTime={hoursToWait}
      onStake={onAmountSelected}
    />
  );
};

export default AmountSelector;
