import React from 'react';
import AmountSelector from './AmountSelector';
import ConfirmAmount from './ConfirmAmount';

const StakeWizard = () => {
  const [state, setState] = React.useState({
    amount: 0,
    step: 0,
  });

  const onAmountSelected = (selectedAmount: number) => {
    setState({
      amount: selectedAmount,
      step: 1,
    });
  };

  const onAmountConfirmed = () => {
    // Stake ${amount} KDX...
  };

  if (state.step === 0) {
    return <AmountSelector onAmountSelected={onAmountSelected} />;
  }

  const steps = [
    <AmountSelector onAmountSelected={onAmountSelected} />,
    <ConfirmAmount amount={state.amount} onConfirm={onAmountConfirmed} />,
  ];

  return steps[state.step];
};

export default StakeWizard;
