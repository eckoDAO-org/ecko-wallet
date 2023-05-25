export type FiatCurrency = string;
export type FiatCurrencies = FiatCurrency[];
export type CryptoCurrency = string;
export type CryptoCurrencies = CryptoCurrency[];

export interface FiatCurrencyAvailability {
  symbol: FiatCurrency;
  minAmount: number;
  maxAmount: number;
};

export interface FiatCurrencyAvailabilities {
  [key: FiatCurrency]: FiatCurrencyAvailability;
}

export interface PurchaseQuoteRequest {
  account: string;
  fiatCurrency: FiatCurrency;
  amountToSpend: number;
  cryptoToBuy: CryptoCurrency;
};

export interface PurchaseQuote {
  id: string;
  account: string;
  fiatCurrency: FiatCurrency;
  fiatBaseAmount: number;
  fiatTotalAmount: number;
  cryptoCurrency: CryptoCurrency;
  cryptoAmount: number;
  validUntil: number;
};

export interface PurchasePayment {
  id: string;
  quote: PurchaseQuote;
};

export interface PurchaseCheckoutStatus {
  payment: PurchasePayment;
  success: boolean;
};

export interface BuyCryptoProvider {
  getQuote: () => PurchaseQuote|undefined;
  getPayment: () => PurchasePayment|undefined;
  getCheckoutStatus: () => PurchaseCheckoutStatus|undefined;

  getFiatCurrencyAvailabilities: () => Promise<FiatCurrencyAvailabilities>;
  getCryptoCurrencies: () => Promise<CryptoCurrencies>;

  requestQuote: (buyQuoteRequest: PurchaseQuoteRequest) => Promise<PurchaseQuote>;
  refreshQuote: () => Promise<PurchaseQuote>;
  requestPayment: () => Promise<PurchasePayment>;
  checkoutPayment: () => Promise<PurchaseCheckoutStatus>;
};