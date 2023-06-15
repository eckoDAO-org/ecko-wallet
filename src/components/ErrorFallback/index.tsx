import { CommonLabel, DivFlex } from 'src/components';
import Button from 'src/components/Buttons';
import { Header, Page } from 'src/components/Page';

interface Props {
  error: string;
}

const ErrorFallback = ({ error }: Props) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Page>
      <Header>
        <CommonLabel fontSize={18} fontWeight={500}>
          Oops! Something went wrong...
        </CommonLabel>
      </Header>
      <DivFlex justifyContent="center" padding="80px">
        <CommonLabel fontSize={15}>{error}</CommonLabel>
      </DivFlex>
      <Button label="Refresh" size="full" variant="primary" onClick={handleRefresh} />
    </Page>
  );
};

export default ErrorFallback;
