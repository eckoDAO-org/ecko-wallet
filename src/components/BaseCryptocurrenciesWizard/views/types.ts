import { CryptoCurrencies, FiatCurrencyAvailabilities, PurchaseCheckoutStatus, PurchasePayment, PurchaseQuote, PurchaseQuoteRequest } from 'src/utils/crypto-providers/types';

export interface ViewProps {}

export interface QuoteRequestorViewProps extends ViewProps {
  fiatCurrencyAvailabilities: FiatCurrencyAvailabilities;
  cryptoCurrencies: CryptoCurrencies;
  requestQuote: (requestQuote: PurchaseQuoteRequest) => void;
  providerName: string;
  providerEmail: string;
}

export interface PaymentRequestorViewProps extends ViewProps {
  quote: PurchaseQuote;
  requestPayment: () => void;
  refreshQuote: () => Promise<void>;
}

export interface PaymentCheckoutViewProps extends ViewProps {
  payment: PurchasePayment;
  checkoutPayment: () => void;
}

export interface CheckoutCompletedViewProps extends ViewProps {
  checkoutStatus: PurchaseCheckoutStatus;
}
