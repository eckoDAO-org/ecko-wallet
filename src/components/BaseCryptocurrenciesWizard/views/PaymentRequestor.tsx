import React from 'react';
import styled from 'styled-components';
import { CommonLabel } from 'src/components';
import Button from 'src/components/Buttons';
import { Body, Footer, Header, Page } from 'src/components/Page';
import { PaymentRequestorViewProps } from './types';

const Summary = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 80px;
  margin: 20px auto;
`;

const Details = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 40px;
`;

const Pair = styled.div`
  text-align: center;
`;

const SummaryKey = styled.div`
  font-size: 24px;
`;

const SummaryValue = styled.div`
  font-size: 40px;
  font-weight: bold;
`;

const Key = styled.div`
  font-size: 18px;
`;

const Value = styled.div`
  font-size: 24x;
  font-weight: bold;
`;

const PaymentRequestor = ({ quote, requestPayment }: PaymentRequestorViewProps) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRequestPayment = () => {
    requestPayment();
  };

  const handleClick = () => {
    setIsLoading(true);
    handleRequestPayment();
  };

  const actionText = 'Confirm';
  const confirmButtonText = isLoading ? '...' : actionText;

  return (
    <Page>
      <Header>
        <CommonLabel fontSize={18} fontWeight={500}>
          Confirm quote
        </CommonLabel>
      </Header>
      <Body>
        <Summary>
          <Pair>
            <SummaryKey>You send</SummaryKey>
            <SummaryValue>
              {quote.fiatTotalAmount} {quote.fiatCurrency}
            </SummaryValue>
          </Pair>
          <Pair>
            <SummaryKey>You get</SummaryKey>
            <SummaryValue>
              {quote.cryptoAmount} {quote.cryptoCurrency}
            </SummaryValue>
          </Pair>
        </Summary>

        <Details>
          <Pair>
            <Key>Price</Key>
            <Value>
              1 {quote.cryptoCurrency} = {quote.fiatBaseAmount / quote.cryptoAmount} {quote.fiatCurrency}
            </Value>
          </Pair>
          <Pair>
            <Key>Fee</Key>
            <Value>
              {(quote.fiatTotalAmount - quote.fiatBaseAmount).toFixed(2)} {quote.fiatCurrency}
            </Value>
          </Pair>
        </Details>
      </Body>

      <Footer>
        <Button isDisabled={isLoading} onClick={handleClick} label={confirmButtonText} size="full" variant="primary" />
      </Footer>
    </Page>
  );
};

export default PaymentRequestor;
