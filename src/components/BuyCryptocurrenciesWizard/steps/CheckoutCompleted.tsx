import { CheckoutcompletedStepProps } from './types';

const CheckoutCompleted = ({ provider, View, Logic }: CheckoutcompletedStepProps) => <Logic View={View} provider={provider} />;

export default CheckoutCompleted;
