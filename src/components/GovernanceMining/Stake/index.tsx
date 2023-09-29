import React from 'react';
import { toast } from 'react-toastify';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import { useGoHome } from 'src/hooks/ui';
import Toast from 'src/components/Toast/Toast';
import { usePoolStakeRequest } from '../api/kaddex.staking';
import AmountSelector from './AmountSelector';
import ConfirmAmount from './ConfirmAmount';

interface StakeWizardProps {
  stakeCompleted?: () => void;
}

const StakeWizard = ({ stakeCompleted }: StakeWizardProps) => {
  const governanceMining = useGovernanceMining();
  const poolStakeRequest = usePoolStakeRequest();
  const goHome = useGoHome();
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

  const onAmountConfirmed = async () => {
    const requestKey = await governanceMining.requestStake(state.amount);

    if (!requestKey) {
      toast.error(
        <Toast
          type="error"
          content="Stake transaction failed!"
        />,
      );
      return;
    }

    goHome();
    stakeCompleted?.();

    toast.success(
      <Toast
        type="success"
        content="Transaction sent successfully! Please check the transaction status in the history tab"
      />,
    );

    const result = await poolStakeRequest(requestKey);

    if (result.status === 'success') {
      toast.success(<Toast type="success" content="KDX Staked Successfully" />);
    } else {
      toast.error(<Toast type="fail" content="KDX Stake Failed" />);
    }
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
