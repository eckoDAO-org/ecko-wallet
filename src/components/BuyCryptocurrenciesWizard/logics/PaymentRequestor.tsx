import React from 'react';
import ErrorFallback from 'src/components/ErrorFallback';
import { PaymentRequestorLogicProps } from './types';

const PaymentRequestor = ({ provider, View, onPurchaseRetrieved }: PaymentRequestorLogicProps) => {
  const [quote, setQuote] = React.useState(provider.getQuote());
  const [error, setError] = React.useState('');

  const handleRequestPayment = async () => {
    try {
      const payment = await provider.requestPayment();
      onPurchaseRetrieved(payment);
    } catch (e) {
      setError('Cannot retrieve payment.');
    }
  };

  const handleRefreshQuote = async () => {
    try {
      await provider.refreshQuote();
      setQuote(provider.getQuote());
    } catch (e) {
      setError('Cannot retrieve quote.');
    }
  };

  if (error || !quote) {
    const errorMessage = !quote ? 'Cannot retrieve quote.' : error;
    return <ErrorFallback error={errorMessage} />;
  }

  return (
    <View
      quote={quote}
      requestPayment={handleRequestPayment}
      refreshQuote={handleRefreshQuote}
    />
  );
};

export default PaymentRequestor;
