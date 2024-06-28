import React from 'react';
import { BuyCryptoProvider } from 'src/utils/crypto-providers/types';
import TopperProvider from 'src/utils/crypto-providers/topper';
import MockProvider from 'src/utils/crypto-providers/mock';
import Step1 from 'src/components/BaseCryptocurrenciesWizard/steps/QuoteRequestor';
import Step2 from 'src/components/BaseCryptocurrenciesWizard/steps/PaymentRequestor';
import Step3 from 'src/components/BaseCryptocurrenciesWizard/steps/PaymentCheckout';
import Logic1 from 'src/components/BaseCryptocurrenciesWizard/logics/QuoteRequestor';
import Logic2 from 'src/components/BaseCryptocurrenciesWizard/logics/PaymentRequestor';
import Logic3 from 'src/components/BaseCryptocurrenciesWizard/logics/PaymentCheckout';
import View1 from 'src/components/BaseCryptocurrenciesWizard/views/QuoteRequestor';
import View2 from 'src/components/BaseCryptocurrenciesWizard/views/PaymentRequestor';
import View3 from './views/TopperPaymentCheckout';

const BuyTopperCryptocurrenciesWizard = () => {
  const provider = React.useRef<BuyCryptoProvider>();
  const [step, setStep] = React.useState(0);

  if (!provider.current) {
    provider.current = new MockProvider();
  }

  const goToStep = (newStep: number) => () => {
    setStep(newStep);
  };

  const steps = [
    <Step1 provider={provider.current} View={View1} Logic={Logic1} goToNextStep={goToStep(1)} />,
    <Step2 provider={provider.current} View={View2} Logic={Logic2} goToNextStep={goToStep(2)} />,
    <Step3 provider={provider.current} View={View3} Logic={Logic3} goToNextStep={() => {}} />,
  ];

  if (step >= steps.length) {
    return <span>done.</span>;
  }

  return steps[step];
};

export default BuyTopperCryptocurrenciesWizard;
