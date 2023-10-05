import React from 'react';
import { toast } from 'react-toastify';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import { useGoHome } from 'src/hooks/ui';
import Toast from 'src/components/Toast/Toast';
import { usePoolUnstakeRequest } from '../api/kaddex.staking';
import AmountSelector from './AmountSelector';
import ConfirmAmount from './ConfirmAmount';

interface UnstakeWizardProps {
  unstakeCompleted?: () => void;
}

const UnstakeWizard = ({ unstakeCompleted }: UnstakeWizardProps) => {
  const governanceMining = useGovernanceMining();
  const poolUnstakeRequest = usePoolUnstakeRequest();
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

  const onAmountConfirmed = async (withdrawRewards: boolean) => {
    const requestKey = await governanceMining.requestUnstake(state.amount, withdrawRewards);

    if (!requestKey) {
      toast.error(
        <Toast
          type="error"
          content="Unstake transaction failed!"
        />,
      );
      return;
    }

    goHome();
    unstakeCompleted?.();

    toast.success(
      <Toast
        type="success"
        content="Transaction sent successfully! Please check the transaction status in the history tab"
      />,
    );

    const result = await poolUnstakeRequest(requestKey);

    if (result.status === 'success') {
      toast.success(<Toast type="success" content="KDX Unstaked Successfully" />);
    } else {
      toast.error(<Toast type="fail" content="KDX Unstake Failed" />);
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

export default UnstakeWizard;
