import { CommonLabel } from 'src/components';
import Button from 'src/components/Buttons';
import { Body, Footer, Header, Page } from 'src/components/Page';
import { CheckoutCompletedViewProps } from './types';

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
    <Page>
      <Header>
        <CommonLabel fontSize={18} fontWeight={500}>{title}</CommonLabel>
      </Header>
      <Body>
        <CommonLabel>{description}</CommonLabel>
      </Body>
      <Footer>
        <Button label="Close" size="full" variant="primary" onClick={handleClose} />
      </Footer>
    </Page>
  );
};

export default SimplexPaymentCheckout;
