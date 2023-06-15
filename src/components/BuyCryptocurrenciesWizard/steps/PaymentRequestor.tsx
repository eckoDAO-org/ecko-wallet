import { PaymentRequestorStepProps } from './types';

const PaymentRequestor = ({ provider, View, Logic, goToNextStep }: PaymentRequestorStepProps) => (
  <Logic View={View} provider={provider} onPurchaseRetrieved={goToNextStep} />
);

export default PaymentRequestor;
