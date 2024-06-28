import { PaymentCheckoutStepProps } from './types';

const PaymentCheckout = ({ provider, View, Logic, goToNextStep }: PaymentCheckoutStepProps) => (
  <Logic View={View} provider={provider} onPurchaseCompleted={goToNextStep} />
);

export default PaymentCheckout;
