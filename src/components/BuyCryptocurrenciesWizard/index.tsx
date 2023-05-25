import React from 'react';
import { BuyCryptoProvider } from 'src/utils/crypto-providers/types';
import CryptoProvider from 'src/utils/crypto-providers/mock';
// import Step1 from './steps/SomeStep';
// import Step2 from './steps/OtherStep';
// import Logic1 from './logics/SomeLogic';
// import Logic2 from './logics/OtherLogic';
// import View1 from './views/SomeStep';
// import View2 from './views/OtherView';

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
    // <Step1 provider={provider.current} View={View1} Logic={Logic1} goToNextStep={goToStep(1)} />,
    // <Step2 provider={provider.current} View={View2} Logic={Logic2} goToNextStep={() => {}} />,
  ];

  if (step >= steps.length) {
    return <span>done.</span>;
  }

  return steps[step];
};

export default Wizard;
