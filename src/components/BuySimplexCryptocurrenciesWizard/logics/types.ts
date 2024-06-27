import React from 'react';
import { BuyCryptoProvider, PurchaseCheckoutStatus, PurchasePayment, PurchaseQuote } from 'src/utils/crypto-providers/types';
import { CheckoutCompletedViewProps, PaymentCheckoutViewProps, PaymentRequestorViewProps, QuoteRequestorViewProps, ViewProps } from '../views/types';

export interface LogicProps<ViewPropsType extends ViewProps> {
  provider: BuyCryptoProvider;
  View: React.ComponentType<ViewPropsType>;
}

export interface QuoteRequestorLogicProps extends LogicProps<QuoteRequestorViewProps> {
  onQuoteRetrieved: (purchaseQuote: PurchaseQuote) => void;
}

export interface PaymentRequestorLogicProps extends LogicProps<PaymentRequestorViewProps> {
  onPurchaseRetrieved: (purchasePayment: PurchasePayment) => void;
}

export interface PaymentCheckoutLogicProps extends LogicProps<PaymentCheckoutViewProps> {
  onPurchaseCompleted: (checkoutStatus: PurchaseCheckoutStatus) => void;
}

export interface CheckoutCompletedLogicProps extends LogicProps<CheckoutCompletedViewProps> {}
