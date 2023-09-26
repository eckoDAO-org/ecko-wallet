import React from 'react';
import { useGetAccountDetails } from '../api/kaddex.dao';
import AmountSelectorView from './AmountSelectorView';

interface AmountSelectorProps {
  onAmountSelected: (amount: number) => void;
}

const AmountSelector = ({ onAmountSelected }: AmountSelectorProps) => {
  const getStakeableKDX = useGetAccountDetails();
  const [balance, setBalance] = React.useState(0);

  React.useEffect(() => {
    getStakeableKDX().then((details) => {
      if (details.status === 'success') {
        setBalance(details.data.balance);
      }
    });
  }, []);

  return (
    <AmountSelectorView
      balance={balance}
      onStake={onAmountSelected}
    />
  );
};

export default AmountSelector;
