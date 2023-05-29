import styled from 'styled-components';
import { CommonLabel } from 'src/components';
import Button from 'src/components/Buttons';
import { Header, Page, Body } from 'src/components/Page';

interface Props {
  error: string;
}

const ErrorFallback = ({ error }: Props) => {
  const handleRefresh = () => { window.location.reload(); };

  return (
    <Page>
      <Header>
        <CommonLabel fontSize={18} fontWeight={500}>Oops! Something went wrong...</CommonLabel>
      </Header>
      <Body>
        <CommonLabel>{error}</CommonLabel>
      </Body>
      <Button label="Refresh" size="full" variant="primary" onClick={handleRefresh} />
    </Page>
  );
};

export default ErrorFallback;
