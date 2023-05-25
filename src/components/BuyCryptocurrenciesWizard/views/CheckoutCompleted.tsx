import styled from 'styled-components';
import { CommonLabel } from 'src/components';
import Button from 'src/components/Buttons';
import { CheckoutCompletedViewProps } from './types';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  height: 75px;
  text-align: center;
`;

const Body = styled.div`
  margin: 20px 0;
`;

const SimplexPaymentCheckout = ({
  checkoutStatus,
}: CheckoutCompletedViewProps) => {
  const title = checkoutStatus.success
    ? 'Payment completed successfully'
    : 'Something went wrong';
  const description = checkoutStatus.success
    ? 'You can now close this page safely.'
    : 'Unfortunately your payment ended unsuccessfully.';

  const handleClose = () => {
    window.close();
  };

  return (
    <Container>
      <Header>
        <CommonLabel fontSize={18} fontWeight={500}>{title}</CommonLabel>
      </Header>
      <Body>
        <CommonLabel fontSize={16}>{description}</CommonLabel>
      </Body>
      <Button label="Close" size="full" variant="primary" onClick={handleClose} />
    </Container>
  );
};

export default SimplexPaymentCheckout;
