import React from 'react';
import moment from 'moment';
import { useAccountBalanceContext } from 'src/contexts/AccountBalanceContext';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import { useStakingConstants } from '../constants/staking';
import ConfirmAmountView from './ConfirmAmountView';

interface ConfirmAmountProps {
  amount: number;
  onConfirm: (withdrawRewards: boolean) => void;
}

const ConfirmAmount = ({ amount, onConfirm }: ConfirmAmountProps) => {
  const governanceMining = useGovernanceMining();
  const { usdPrices } = useAccountBalanceContext();
  const STAKING_CONSTANTS = useStakingConstants();
  const [isLoading, setIsLoading] = React.useState(false);

  const { stakeStatus } = governanceMining;
  const { rewards } = stakeStatus;
  const positionPenaltyHoursToWait = STAKING_CONSTANTS.percentagePenaltyHours - moment().diff(rewards.lastStakeDate, 'hours');
  const hasPositionPenalty = positionPenaltyHoursToWait > 0;
  const hasRewardPenalty = rewards.rewardPenaltyTokens > 0;
  const rewardPenaltyPercentage = (rewards.rewardPenaltyTokens / rewards.collectedTokens) * 100;
  const estimateUSDAmount = (usdPrices?.['kaddex.kdx'] || 0) * amount;

  const handleConfirm = (withdrawRewards: boolean) => {
    setIsLoading(true);
    onConfirm(withdrawRewards);
  };

  return (
    <ConfirmAmountView
      amount={amount}
      hasPositionPenalty={hasPositionPenalty}
      positionPenalty={stakeStatus.positionPenaltyTokens}
      positionPenaltyPercentage={STAKING_CONSTANTS.percentagePenalty}
      hasRewardPenalty={hasRewardPenalty}
      rewardPenalty={rewards.rewardPenaltyTokens}
      rewardPenaltyPercentage={rewardPenaltyPercentage}
      usdAmount={estimateUSDAmount}
      isLoading={isLoading}
      onConfirm={handleConfirm}
    />
  );
};

export default ConfirmAmount;
