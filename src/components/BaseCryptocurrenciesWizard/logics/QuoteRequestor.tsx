import React from 'react';
import { FiatCurrencyAvailabilities, PurchaseQuoteRequest } from 'src/utils/crypto-providers/types';
import ErrorFallback from 'src/components/ErrorFallback';
import Loading from 'src/components/Loading';
import { QuoteRequestorLogicProps } from './types';

const QuoteRequestor = ({ provider, View, onQuoteRetrieved }: QuoteRequestorLogicProps) => {
  const [fiatCurrencyAvailabilities, setFiatCurrencyAvailabilities] = React.useState<FiatCurrencyAvailabilities>({});
  const [cryptoCurrencies, setCryptoCurrencies] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    Promise.all([provider.getFiatCurrencyAvailabilities(), provider.getCryptoCurrencies()])
      .then(([fiatCurrenciesData, cryptoCurrenciesData]) => {
        setFiatCurrencyAvailabilities(fiatCurrenciesData);
        setCryptoCurrencies(cryptoCurrenciesData);
      })
      .catch(() => {
        setError('Cannot retrieve currencies.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleRequestQuote = async (requestQuote: PurchaseQuoteRequest) => {
    try {
      setIsLoading(true);
      const quote = await provider.requestQuote(requestQuote);
      onQuoteRetrieved(quote);
    } catch (_e) {
      setError('Cannot retrieve quote.');
    }
  };

  if (error) {
    return <ErrorFallback error={error} />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View
      fiatCurrencyAvailabilities={fiatCurrencyAvailabilities}
      cryptoCurrencies={cryptoCurrencies}
      requestQuote={handleRequestQuote}
      providerName={provider.getName()}
      providerEmail={provider.getEmail()}
    />
  );
};

export default QuoteRequestor;
