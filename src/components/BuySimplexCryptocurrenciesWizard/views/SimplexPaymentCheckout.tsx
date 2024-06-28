import React from 'react';
import styled from 'styled-components';
import { CommonLabel } from 'src/components';
import { Body, Header, Page } from 'src/components/Page';
import { PaymentCheckoutViewProps } from 'src/components/BaseCryptocurrenciesWizard/views/types';

const Checkout = styled.div`
  min-width: 350px;
  height: 600px;
  border: 1px solid black;
`;

const SimplexPaymentCheckout = ({ checkoutPayment }: PaymentCheckoutViewProps) => {
  React.useEffect(() => {
    checkoutPayment();
  }, []);

  return (
    <Page>
      <Header>
        <CommonLabel fontSize={18} fontWeight={500}>
          Checkout
        </CommonLabel>
      </Header>
      <Body>
        <form id="simplex-form">
          <Checkout id="checkout-element" />
        </form>
      </Body>
    </Page>
  );
};

export default SimplexPaymentCheckout;
