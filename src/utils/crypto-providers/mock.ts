import { BuyCryptoProvider, CryptoCurrencies, FiatCurrencyAvailabilities, PurchaseCheckoutStatus, PurchasePayment, PurchaseQuote, PurchaseQuoteRequest } from './types';

class MockProvider implements BuyCryptoProvider {
  quote?: PurchaseQuote;
  payment?: PurchasePayment;
  quoteRequest?: PurchaseQuoteRequest;
  checkoutStatus?: PurchaseCheckoutStatus;

  getFiatCurrencyAvailabilities = () => (
    new Promise<FiatCurrencyAvailabilities>((resolve) => {
      setTimeout(() => {
        resolve({
          EUR: {
            symbol: 'EUR',
            minAmount: 1,
            maxAmount: 18545,
          },
          USD: {
            symbol: 'USD',
            minAmount: 1,
            maxAmount: 20000,
          },
          JPY: {
            symbol: 'JPY',
            minAmount: 139,
            maxAmount: 2768381,
          },
        });
      }, 1000);
    })
  )

  getCryptoCurrencies = () => (
    new Promise<CryptoCurrencies>((resolve) => {
      resolve(['KDA']);
    })
  )

  getQuote = () => this.quote

  getPayment = () => this.payment

  getCheckoutStatus = () => this.checkoutStatus;

  requestQuote = (buyQuoteRequest: PurchaseQuoteRequest) => (
    new Promise<PurchaseQuote>((resolve) => {
      this.quoteRequest = buyQuoteRequest;

      const quote: PurchaseQuote = {
        id: 'test',
        account: buyQuoteRequest.fiatCurrency,
        fiatCurrency: buyQuoteRequest.fiatCurrency,
        fiatBaseAmount: buyQuoteRequest.amountToSpend - 5,
        fiatTotalAmount: buyQuoteRequest.amountToSpend,
        cryptoCurrency: buyQuoteRequest.cryptoToBuy,
        cryptoAmount: buyQuoteRequest.amountToSpend + 100,
        validUntil: Date.now() + (10 * 1000),
      };

      this.payment = undefined;
      this.quote = quote;
      resolve(quote);
    })
  )

  refreshQuote = () => (
    new Promise<PurchaseQuote>((resolve, reject) => {
      if (this.quoteRequest === undefined) {
        reject(new Error('Missing quote'));
        return;
      }

      resolve(this.requestQuote(this.quoteRequest));
    })
  )

  requestPayment = () => (
    new Promise<PurchasePayment>((resolve, reject) => {
      setTimeout(() => {
        if (this.quote === undefined) {
          reject(new Error('Missing quote'));
          return;
        }

        const payment: PurchasePayment = {
          id: 'random-id',
          quote: this.quote,
        };

        this.payment = payment;
        resolve(payment);
      }, 2000);
    })
  )

  checkoutPayment: () => Promise<PurchaseCheckoutStatus> = () => (
    new Promise<PurchaseCheckoutStatus>((resolve, reject) => {
      if (this.payment === undefined) {
        reject(new Error('Missing payment'));
        return;
      }

      const checkout: PurchaseCheckoutStatus = {
        success: true,
        payment: this.payment,
      };

      this.checkoutStatus = checkout;
      resolve(checkout);
    })
  )
}

export default MockProvider;

/*
const get = (url) => {
  const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
    },
  };

  return fetch(url)
    .then((response) => response.json);
    // TODO: Handle errors
};
*/
