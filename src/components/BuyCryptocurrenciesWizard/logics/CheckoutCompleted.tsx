import ErrorFallback from 'src/components/ErrorFallback';
import { CheckoutCompletedLogicProps } from './types';

const CheckoutCompleted = ({ provider, View }: CheckoutCompletedLogicProps) => {
  const checkoutStatus = provider.getCheckoutStatus();

  if (!checkoutStatus) {
    return <ErrorFallback error="Cannot retrieve payment" />;
  }

  return <View checkoutStatus={checkoutStatus} />;
};

export default CheckoutCompleted;
