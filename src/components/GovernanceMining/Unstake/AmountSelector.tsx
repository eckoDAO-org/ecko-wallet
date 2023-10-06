import React from 'react';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import AmountSelectorView from './AmountSelectorView';

interface AmountSelectorProps {
  onAmountSelected: (amount: number) => void;
}

const AmountSelector = ({ onAmountSelected }: AmountSelectorProps) => {
  const governanceMining = useGovernanceMining();
  const { rewards, stakedTokens: unstakeableKdx } = governanceMining.stakeStatus;

  return (
    <AmountSelectorView
      balance={unstakeableKdx}
      effectiveStartDate={rewards.effectiveStartDate}
      onStake={onAmountSelected}
      rewardsPenalty={rewards.penaltyTokens}
    />
  );
};

export default AmountSelector;
