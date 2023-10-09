import React from 'react';
import moment from 'moment';
import { useAccountBalanceContext } from 'src/contexts/AccountBalanceContext';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import { useStakingConstants } from '../constants/staking';
import ConfirmAmountView from './ConfirmAmountView';
import { reduceBalance } from '../helpers/numberUtils';

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
  const positionPenalty = reduceBalance((amount * STAKING_CONSTANTS.percentagePenalty) / 100);

  const hasRewardPenalty = rewards.rewardPenaltyTokens > 0;
  const rewardPenaltyPercentage = +((rewards.rewardPenaltyTokens / rewards.collectedTokens) * 100).toFixed(2);
  const rewardPenalty = reduceBalance(rewards.rewardPenaltyTokens);

  const estimateUSDAmount = (usdPrices?.['kaddex.kdx'] || 0) * amount;

  const handleConfirm = (withdrawRewards: boolean) => {
    setIsLoading(true);
    onConfirm(withdrawRewards);
  };

  return (
    <ConfirmAmountView
      amount={amount}
      hasPositionPenalty={hasPositionPenalty}
      positionPenalty={positionPenalty}
      positionPenaltyPercentage={STAKING_CONSTANTS.percentagePenalty}
      hasRewardPenalty={hasRewardPenalty}
      rewardPenalty={rewardPenalty}
      rewardPenaltyPercentage={rewardPenaltyPercentage}
      usdAmount={estimateUSDAmount}
      isLoading={isLoading}
      onConfirm={handleConfirm}
    />
  );
};

export default ConfirmAmount;
