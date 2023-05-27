import React from 'react';
import styled from 'styled-components';
import { CommonLabel } from 'src/components';
import Button from 'src/components/Buttons';
import { PaymentRequestorViewProps } from './types';

const Container = styled.div`
  padding: 20px;
  color: ${({ theme }) => theme.text.primary}
`;

const Header = styled.div`
  height: 75px;
  text-align: center;
`;

const Summary = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 80px;
  margin: 20px 0;
`;

const Details = styled.div`
  font-size: 16px;
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 40px;
  margin: 20px 0;
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

const PaymentRequestor = ({
  quote,
  requestPayment,
}: PaymentRequestorViewProps) => {
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
    <Container>
      <Header>
        <CommonLabel fontSize={18} fontWeight={500}>Confirm quote</CommonLabel>
      </Header>
      <div>
        <Summary>
          <Pair>
            <SummaryKey>You send</SummaryKey>
            <SummaryValue>{quote.fiatTotalAmount} {quote.fiatCurrency}</SummaryValue>
          </Pair>
          <Pair>
            <SummaryKey>You get</SummaryKey>
            <SummaryValue>{quote.cryptoAmount} {quote.cryptoCurrency}</SummaryValue>
          </Pair>
        </Summary>

        <Details>
          <Pair>
            <Key>Price</Key>
            <Value>1 {quote.cryptoCurrency} = {quote.fiatBaseAmount / quote.cryptoAmount} {quote.fiatCurrency}</Value>
          </Pair>
          <Pair>
            <Key>Fee</Key>
            <Value>{(quote.fiatTotalAmount - quote.fiatBaseAmount).toFixed(2)} {quote.fiatCurrency}</Value>
          </Pair>
        </Details>

        <Button isDisabled={isLoading} onClick={handleClick} label={confirmButtonText} size="full" variant="primary" />
      </div>
    </Container>
  );
};

export default PaymentRequestor;
