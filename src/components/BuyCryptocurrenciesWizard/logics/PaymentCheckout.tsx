import ErrorFallback from 'src/components/ErrorFallback';
import { PaymentCheckoutLogicProps } from './types';

const PaymentRequestor = ({ provider, View, onPurchaseCompleted }: PaymentCheckoutLogicProps) => {
  const payment = provider.getPayment();

  const handleCheckoutPayment = async () => {
    const checkoutStatus = await provider.checkoutPayment();
    onPurchaseCompleted(checkoutStatus);
  };

  if (!payment) {
    return <ErrorFallback error="Cannot retrieve payment" />;
  }

  return <View payment={payment} checkoutPayment={handleCheckoutPayment} />;
};

export default PaymentRequestor;
