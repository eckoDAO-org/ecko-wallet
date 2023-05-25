import React from 'react';
import { BuyCryptoProvider } from 'src/utils/crypto-providers/types';
import CryptoProvider from 'src/utils/crypto-providers/mock';
import Step1 from './steps/QuoteRequestor';
import Logic1 from './logics/QuoteRequestor';
import View1 from './views/QuoteRequestor';

const Wizard = () => {
  const provider = React.useRef<BuyCryptoProvider>();
  const [step, setStep] = React.useState(0);

  if (!provider.current) {
    provider.current = new CryptoProvider();
  }

  const goToStep = (newStep: number) => () => {
    setStep(newStep);
  };

  const steps = [
    <Step1 provider={provider.current} View={View1} Logic={Logic1} goToNextStep={() => {}} />,
  ];

  if (step >= steps.length) {
    return <span>done.</span>;
  }

  return steps[step];
};

export default Wizard;
