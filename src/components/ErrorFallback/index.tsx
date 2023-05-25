import styled from 'styled-components';
import { CommonLabel } from 'src/components';
import Button from 'src/components/Buttons';

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

interface Props {
  error: string;
}

const ErrorFallback = ({ error }: Props) => {
  const handleRefresh = () => { window.location.reload(); };

  return (
    <Container>
      <Header>
        <CommonLabel fontSize={18} fontWeight={500}>Oops! Something went wrong...</CommonLabel>
      </Header>
      <Body>
        <CommonLabel fontSize={16}>{error}</CommonLabel>
      </Body>
      <Button label="Refresh" size="full" variant="primary" onClick={handleRefresh} />
    </Container>
  );
};

export default ErrorFallback;
