import React from 'react';
import { useAccountBalanceContext } from 'src/contexts/AccountBalanceContext';
import ConfirmAmountView from './ConfirmAmountView';

interface ConfirmAmountProps {
  amount: number;
  onConfirm: () => void;
}

const ConfirmAmount = ({ amount, onConfirm }: ConfirmAmountProps) => {
  const { usdPrices } = useAccountBalanceContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const estimateUSDAmount = (usdPrices?.['kaddex.kdx'] || 0) * amount;

  const handleConfirm = () => {
    setIsLoading(true);
    onConfirm();
  };

  return (
    <ConfirmAmountView
      amount={amount}
      usdAmount={estimateUSDAmount}
      isLoading={isLoading}
      onConfirm={handleConfirm}
    />
  );
};

export default ConfirmAmount;
