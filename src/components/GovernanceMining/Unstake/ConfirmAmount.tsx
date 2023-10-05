import React from 'react';
import { useAccountBalanceContext } from 'src/contexts/AccountBalanceContext';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import ConfirmAmountView from './ConfirmAmountView';

interface ConfirmAmountProps {
  amount: number;
  onConfirm: (withdrawRewards: boolean) => void;
}

const ConfirmAmount = ({ amount, onConfirm }: ConfirmAmountProps) => {
  const { stakeStatus } = useGovernanceMining();
  const { usdPrices } = useAccountBalanceContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirm = (withdrawRewards: boolean) => {
    setIsLoading(true);
    onConfirm(withdrawRewards);
  };

  const estimateUSDAmount = (usdPrices?.['kaddex.kdx'] || 0) * amount;

  return (
    <ConfirmAmountView
      amount={amount}
      onConfirm={handleConfirm}
      rewardPenalty={stakeStatus.rewards.penaltyTokens}
      usdAmount={estimateUSDAmount}
      isLoading={isLoading}
    />
  );
};

export default ConfirmAmount;
