import React from 'react';
import { toast } from 'react-toastify';
import { ResponseWrapper } from 'src/hooks/pact';
import { useGoHome } from 'src/hooks/ui';
import Toast from 'src/components/Toast/Toast';

interface AmountSelectorProps {
  onAmountSelected: (selectedAmount: number) => void;
}

interface ConfirmAmountProps {
  amount: number;
  onConfirm: any;
}

interface WizardProps<ConfirmData = any> {
  handleConfirm: (amount: number, data: ConfirmData) => Promise<string|undefined>;
  poolRequest: (requestKey: string) => Promise<ResponseWrapper<any>>
  wizardCompleted?: () => void;
  requestTransactionFailedMessage: string,
  requestTransactionSuccededMessage: string,
  transactionFailedMessage: string;
  transactionSuccededMessage: string;
  AmountSelector: React.ComponentType<AmountSelectorProps>;
  ConfirmAmount: React.ComponentType<ConfirmAmountProps>;
}

const Wizard = <ConfirmData extends any = any>({
  handleConfirm,
  poolRequest,
  wizardCompleted,
  requestTransactionFailedMessage,
  requestTransactionSuccededMessage,
  transactionFailedMessage,
  transactionSuccededMessage,
  AmountSelector,
  ConfirmAmount,
}: WizardProps<ConfirmData>) => {
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

  const onAmountConfirmed = async (data?: any) => {
    const requestKey = await handleConfirm(state.amount, data);

    if (!requestKey) {
      toast.error(
        <Toast type="error" content={requestTransactionFailedMessage} />,
      );
      return;
    }

    goHome();
    wizardCompleted?.();

    toast.success(
      <Toast type="success" content={requestTransactionSuccededMessage} />,
    );

    const result = await poolRequest(requestKey);

    if (result.status === 'success') {
      toast.success(<Toast type="success" content={transactionSuccededMessage} />);
    } else {
      toast.error(<Toast type="fail" content={transactionFailedMessage} />);
    }
  };

  const steps = [
    <AmountSelector onAmountSelected={onAmountSelected} />,
    <ConfirmAmount amount={state.amount} onConfirm={onAmountConfirmed} />,
  ];

  return steps[state.step];
};

export default Wizard;
