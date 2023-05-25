import React from 'react';
import styled from 'styled-components';
import { CommonLabel } from 'src/components';
import { PaymentCheckoutViewProps } from './types';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  height: 75px;
  text-align: center;
`;

const Checkout = styled.div`
  min-width: 350px;
  height: 600px;
  border: 1px solid black;
`;

const SimplexPaymentCheckout = ({
  checkoutPayment,
}: PaymentCheckoutViewProps) => {
  React.useEffect(() => {
    checkoutPayment();
  }, []);

  return (
    <Container>
      <Header>
        <CommonLabel fontSize={18} fontWeight={500}>Checkout</CommonLabel>
      </Header>
      <form id="simplex-form">
        <Checkout id="checkout-element" />
      </form>
    </Container>
  );
};

export default SimplexPaymentCheckout;
