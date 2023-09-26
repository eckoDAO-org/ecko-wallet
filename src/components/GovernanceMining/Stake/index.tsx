import React from 'react';
import { useGetAccountDetails } from '../api/kaddex.dao';
import StakeView from './UI';

const Stake = () => {
  const getStakeableKDX = useGetAccountDetails();
  const [balance, setBalance] = React.useState(0);

  React.useEffect(() => {
    getStakeableKDX().then((details) => {
      if (details.status === 'success') {
        setBalance(details.data.balance);
      }
    });
  }, []);

  const handleStake = (amount: number) => {
    console.log(`Staking ${amount}`);
  };

  return (
    <StakeView
      balance={balance}
      onStake={handleStake}
    />
  );
};

export default Stake;
