import React from 'react';
import styled from 'styled-components';
import { CommonLabel, DivFlex } from 'src/components';
import { Body, Header, Page } from 'src/components/Page';
import { PaymentCheckoutViewProps } from 'src/components/BaseCryptocurrenciesWizard/views/types';
import { useGoHome } from 'src/hooks/ui';
import { checkoutUrl } from 'src/utils/crypto-providers/topper';
import Button from 'src/components/Buttons';

const Link = styled.a`
  color: ${({ theme }) => theme.text.primary};
`;

const TopperPaymentCheckout = ({
  payment,
  checkoutPayment,
}: PaymentCheckoutViewProps) => {
  const goHome = useGoHome();

  const url = `${checkoutUrl}${payment.id}`;

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
        <DivFlex justifyContent="center" padding="80px">
          <CommonLabel fontSize={15}>
            Follow the instructions on the new page. If the page does not open, please click <Link href={url} target="_blank" rel="noreferrer">here</Link>.
          </CommonLabel>
        </DivFlex>
        <Button label="Go to wallet" size="full" variant="primary" onClick={goHome} />
      </Body>
    </Page>
  );
};

export default TopperPaymentCheckout;
