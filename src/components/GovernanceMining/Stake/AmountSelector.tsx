import React from 'react';
import AmountSelectorView from './AmountSelectorView';
import { useGetAccountKdxDetails } from '../api/utils';

interface AmountSelectorProps {
  onAmountSelected: (amount: number) => void;
}

const AmountSelector = ({ onAmountSelected }: AmountSelectorProps) => {
  const getStakeableKDX = useGetAccountKdxDetails();
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
