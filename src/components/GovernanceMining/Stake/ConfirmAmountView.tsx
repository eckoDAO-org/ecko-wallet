import React from 'react';
import BaseConfirmAmount from './BaseConfirmAmount';

export interface ConfirmAmountViewProps {
  amount: number;
  usdAmount: number;
  isLoading: boolean;
  onConfirm: () => void;
}

const ConfirmAmount = (props: ConfirmAmountViewProps) => (
  <BaseConfirmAmount
    {...props}
    summaryTitle="Adding more KDX to your staking amount"
    summaryDescription={`
      Adding more KDX to your stake, will simply increase your waiting time proportionally,
      and it will also activate a 3% flat penalty fee on any unstaked amount for 72hours.
      Once the 72 hours have passed, you can unstake your tokens normally without paying this penalty.
    `}
    title="Stake"
  />
);

export default ConfirmAmount;
