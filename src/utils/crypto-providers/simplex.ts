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

const [baseUrl, publicKey] =
  process.env.NODE_ENV === 'production'
    ? [process.env.REACT_APP_SIMPLEX_API_URL_PROD, process.env.REACT_APP_SIMPLEX_PUBLIC_KEY_PROD]
    : [process.env.REACT_APP_SIMPLEX_API_URL_DEV, process.env.REACT_APP_SIMPLEX_PUBLIC_KEY_DEV];

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

declare global {
  // eslint-disable-next-line
  interface Window {
    simplexAsyncFunction: () => void;
    Simplex: any;
  }
}

type SimplexFiatCurrenciesResponse = {
  ticker_symbol: string;
  min_amount: string;
  max_amount: string;
}[];

type SimplexQuoteRequest = {
  account: string;
  fiat_currency: string;
  requested_amount: number;
};

type SimplexQuoteResponse = {
  user_id: string;
  quote_id: string;
  digital_money: {
    currency: string;
    amount: number;
  };
  fiat_money: {
    currency: string;
    base_amount: number;
    total_amount: number;
  };
  valid_until: string;
};

type SimplexCreatePaymentRequest = {
  account: string;
  quote_id: string;
};

type SimplexCreatePaymentResponse = {
  is_kyc_required: boolean;
  payment_id: string;
  account: string;
};

class SimplexProvider implements BuyCryptoProvider {
  private static isSdkInjected: boolean = false;
  private quote?: PurchaseQuote;
  private payment?: PurchasePayment;
  private quoteRequest?: PurchaseQuoteRequest;
  private checkoutStatus?: PurchaseCheckoutStatus;

  constructor() {
    this.initSdk();
  }

  initSdk = () => {
    this.prepareSdk();
    this.injectSdk();
  };

  prepareSdk = () => {
    window.simplexAsyncFunction = () => {
      window.Simplex.init({
        public_key: publicKey,
      });
    };
  };

  injectSdk = () => {
    if (SimplexProvider.isSdkInjected) {
      return;
    }
    if (process.env.NODE_ENV === 'production') {
      require('./simplex-sdk');
    } else {
      require('./simplex-sdk-stage');
    }
    SimplexProvider.isSdkInjected = true;
  };

  getQuote = () => this.quote;

  getPayment = () => this.payment;

  getCheckoutStatus = () => this.checkoutStatus;

  getFiatCurrencyAvailabilities = async () => {
    const options = { method: 'GET', headers };
    const response = await fetch(`${baseUrl}simplex/fiat-currencies`, options);
    this.assertOk(response);

    const json = (await response.json()) as SimplexFiatCurrenciesResponse;
    const fiatCurrencyAvailabilities: FiatCurrencyAvailabilities = json.reduce((accumulator, element) => {
      const minAmount = parseFloat(element.min_amount);
      const maxAmount = parseFloat(element.max_amount);

      if (!Number.isNaN(minAmount) && !Number.isNaN(maxAmount)) {
        accumulator[element.ticker_symbol] = {
          symbol: element.ticker_symbol,
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

    const data: SimplexQuoteRequest = {
      account: buyQuoteRequest.account,
      fiat_currency: buyQuoteRequest.fiatCurrency,
      requested_amount: buyQuoteRequest.amountToSpend,
    };

    const options = { method: 'POST', headers, body: JSON.stringify(data) };
    const response = await fetch(`${baseUrl}simplex/quote`, options);
    this.assertOk(response);

    const json = (await response.json()) as SimplexQuoteResponse;
    const quote: PurchaseQuote = {
      id: json.quote_id,
      account: json.user_id,
      fiatCurrency: json.fiat_money.currency,
      fiatBaseAmount: json.fiat_money.base_amount,
      fiatTotalAmount: json.fiat_money.total_amount,
      cryptoCurrency: json.digital_money.currency,
      cryptoAmount: json.digital_money.amount,
      validUntil: Date.parse(json.valid_until),
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

    const data: SimplexCreatePaymentRequest = {
      account: this.quote.account,
      quote_id: this.quote.id,
    };

    const options = { method: 'POST', headers, body: JSON.stringify(data) };
    const response = await fetch(`${baseUrl}simplex/create-payment`, options);
    this.assertOk(response);

    const json = (await response.json()) as SimplexCreatePaymentResponse;
    const payment: PurchasePayment = {
      id: json.payment_id,
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

      window.Simplex.load({ payment_id: payment.id });
      window.Simplex.subscribe('onlineFlowFinished', (event) => {
        const checkoutStatus: PurchaseCheckoutStatus = {
          payment,
          success: event?.payload?.result === 'success',
        };

        this.checkoutStatus = checkoutStatus;
        resolve(checkoutStatus);
      });
    });

  assertOk = (response: Response) => {
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  };
}

export default SimplexProvider;
