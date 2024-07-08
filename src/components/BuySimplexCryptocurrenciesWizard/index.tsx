import React from 'react';
import { BuyCryptoProvider } from 'src/utils/crypto-providers/types';
import SimplexProvider from 'src/utils/crypto-providers/simplex';
import FullPageWithPoweredByLayout from 'src/components/BaseCryptocurrenciesWizard/layouts/FullPageWithPoweredBy';
import Step1 from 'src/components/BaseCryptocurrenciesWizard/steps/QuoteRequestor';
import Step2 from 'src/components/BaseCryptocurrenciesWizard/steps/PaymentRequestor';
import Step3 from 'src/components/BaseCryptocurrenciesWizard/steps/PaymentCheckout';
import Step4 from 'src/components/BaseCryptocurrenciesWizard/steps/CheckoutCompleted';
import Logic1 from 'src/components/BaseCryptocurrenciesWizard/logics/QuoteRequestor';
import Logic2 from 'src/components/BaseCryptocurrenciesWizard/logics/PaymentRequestor';
import Logic3 from 'src/components/BaseCryptocurrenciesWizard/logics/PaymentCheckout';
import Logic4 from 'src/components/BaseCryptocurrenciesWizard/logics/CheckoutCompleted';
import View1 from 'src/components/BaseCryptocurrenciesWizard/views/QuoteRequestor';
import View2 from 'src/components/BaseCryptocurrenciesWizard/views/PaymentRequestor';
import View4 from 'src/components/BaseCryptocurrenciesWizard/views/CheckoutCompleted';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';
import { AppThemeEnum } from 'src/themes';
import images from 'src/images';
import View3 from './views/SimplexPaymentCheckout';

const BuySimplexCryptocurrenciesWizard = () => {
  const { selectedTheme } = useAppThemeContext();
  const provider = React.useRef<BuyCryptoProvider>();
  const [step, setStep] = React.useState(0);

  if (!provider.current) {
    provider.current = new SimplexProvider();
  }

  const goToStep = (newStep: number) => () => {
    setStep(newStep);
  };

  const steps = [
    <Step1 provider={provider.current} View={View1} Logic={Logic1} goToNextStep={goToStep(1)} />,
    <Step2 provider={provider.current} View={View2} Logic={Logic2} goToNextStep={goToStep(2)} />,
    <Step3 provider={provider.current} View={View3} Logic={Logic3} goToNextStep={goToStep(3)} />,
    <Step4 provider={provider.current} View={View4} Logic={Logic4} goToNextStep={() => {}} />,
  ];

  if (step >= steps.length) {
    return <span>done.</span>;
  }

  const key = selectedTheme === AppThemeEnum.LIGHT ? 'light' : 'dark';
  const simplexImage = images.cryptoProviders.simplex[key];

  return (
    <FullPageWithPoweredByLayout providerImage={simplexImage}>
      {steps[step]}
    </FullPageWithPoweredByLayout>
  );
};

export default BuySimplexCryptocurrenciesWizard;
