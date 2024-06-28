import React from 'react';
import { BuyCryptoProvider } from 'src/utils/crypto-providers/types';
import { CheckoutCompletedViewProps, PaymentCheckoutViewProps, PaymentRequestorViewProps, QuoteRequestorViewProps, ViewProps } from '../views/types';
import { CheckoutCompletedLogicProps, LogicProps, PaymentCheckoutLogicProps, PaymentRequestorLogicProps, QuoteRequestorLogicProps } from '../logics/types';

export interface BaseStepProps<
  ViewPropsType extends ViewProps,
  LogicPropsType extends LogicProps<ViewPropsType>,
> {
  provider: BuyCryptoProvider;
  View: React.ComponentType<ViewPropsType>;
  Logic: React.ComponentType<LogicPropsType>;
  goToNextStep: () => void;
}

export interface QuoteRequestorStepProps extends BaseStepProps<
  QuoteRequestorViewProps,
  QuoteRequestorLogicProps
> {}

export interface PaymentRequestorStepProps extends BaseStepProps<
  PaymentRequestorViewProps,
  PaymentRequestorLogicProps
> {}

export interface PaymentCheckoutStepProps extends BaseStepProps<
  PaymentCheckoutViewProps,
  PaymentCheckoutLogicProps
> {}

export interface CheckoutcompletedStepProps extends BaseStepProps<
  CheckoutCompletedViewProps,
  CheckoutCompletedLogicProps
> {}
