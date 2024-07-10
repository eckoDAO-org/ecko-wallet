/* eslint-disable camelcase */
import {
  BuyCryptoProvider,
  CryptoCurrencies,
  FiatCurrencyAvailabilities,
  FiatCurrencyAvailability,
  PurchaseCheckoutStatus,
  PurchasePayment,
  PurchaseQuote,
  PurchaseQuoteRequest,
} from './types';

const baseUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_TOPPER_API_URL_PROD : process.env.REACT_APP_TOPPER_API_URL_DEV;
export const checkoutUrl = process.env.NODE_ENV === 'production' ? process.env.REACT_APP_TOPPER_CHECKOUT_URL_PROD : process.env.REACT_APP_TOPPER_CHECKOUT_URL_DEV;

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

type TopperFiatCurrenciesResponse = {
  currencies: {
    code: string;
    name: string;
    symbol: string;
    maximum: string;
    minimum: string;
  }[];
};

type TopperQuoteRequest = {
  account: string;
  fiatCurrency: string;
  amountToSpend: number;
  provider: 'topper';
};

type TopperQuoteResponse = {
  account: string;
  fiatCurrency: string;
  fiatBaseAmount: string;
  fiatTotalAmount: string;
  totalFees: string;
  cryptoAmount: string;
  bootstrapToken: string;
};

class TopperProvider implements BuyCryptoProvider {
  private quote?: PurchaseQuote;
  private payment?: PurchasePayment;
  private quoteRequest?: PurchaseQuoteRequest;
  private checkoutStatus?: PurchaseCheckoutStatus;

  getName = () => 'Topper';
  getEmail = () => 'data.privacy@uphold.com';

  getQuote = () => this.quote;

  getPayment = () => this.payment;

  getCheckoutStatus = () => this.checkoutStatus;

  getFiatCurrencyAvailabilities = async () => {
    const options = { method: 'GET', headers };
    const response = await fetch(`${baseUrl}fiat-on-ramp/currencies?provider=topper`, options);
    this.assertOk(response);

    const json = (await response.json()) as TopperFiatCurrenciesResponse;
    const fiatCurrencyAvailabilities: FiatCurrencyAvailabilities = json.currencies.reduce((accumulator, element) => {
      const minAmount = parseFloat(element.minimum);
      const maxAmount = parseFloat(element.maximum);

      if (!Number.isNaN(minAmount) && !Number.isNaN(maxAmount)) {
        accumulator[element.code] = {
          symbol: element.code,
          minAmount,
          maxAmount,
        } as FiatCurrencyAvailability;
      }

      return accumulator;
    }, {});

    return fiatCurrencyAvailabilities;
  };

  getCryptoCurrencies = () =>
    new Promise<CryptoCurrencies>((resolve) => {
      resolve(['KDA']);
    });

  requestQuote = async (buyQuoteRequest: PurchaseQuoteRequest) => {
    this.quoteRequest = buyQuoteRequest;
    this.quote = undefined;
    this.payment = undefined;

    const data: TopperQuoteRequest = {
      account: buyQuoteRequest.account,
      fiatCurrency: buyQuoteRequest.fiatCurrency,
      amountToSpend: buyQuoteRequest.amountToSpend,
      provider: 'topper',
    };

    const options = { method: 'POST', headers, body: JSON.stringify(data) };
    const response = await fetch(`${baseUrl}fiat-on-ramp/quote`, options);
    this.assertOk(response);

    const json = (await response.json()) as TopperQuoteResponse;
    const quote: PurchaseQuote = {
      id: json.bootstrapToken,
      account: json.account,
      fiatCurrency: json.fiatCurrency,
      fiatBaseAmount: +json.fiatBaseAmount,
      fiatTotalAmount: +json.fiatTotalAmount,
      cryptoCurrency: buyQuoteRequest.cryptoToBuy,
      cryptoAmount: +json.cryptoAmount,
      validUntil: Date.now() + 86_400_000,
    };

    this.quote = quote;
    return quote;
  };

  refreshQuote = () =>
    new Promise<PurchaseQuote>((resolve, reject) => {
      if (this.quoteRequest === undefined) {
        reject(new Error('Missing quote'));
        return;
      }

      resolve(this.requestQuote(this.quoteRequest));
    });

  requestPayment = async () => {
    if (this.quote === undefined) {
      throw new Error('Missing quote');
    }

    const payment: PurchasePayment = {
      id: this.quote.id,
      quote: { ...this.quote },
    };

    this.payment = payment;
    return payment;
  };

  checkoutPayment = () =>
    new Promise<PurchaseCheckoutStatus>((resolve, reject) => {
      const { payment } = this;
      if (payment === undefined) {
        reject(new Error('Missing payment'));
        return;
      }

      const url = `${checkoutUrl}${payment.id}`;
      window.open(url, '_blank');

      const checkoutStatus: PurchaseCheckoutStatus = {
        payment,
        success: true,
      };

      this.checkoutStatus = checkoutStatus;
      resolve(checkoutStatus);
    });

  assertOk = (response: Response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  };
}

export default TopperProvider;
