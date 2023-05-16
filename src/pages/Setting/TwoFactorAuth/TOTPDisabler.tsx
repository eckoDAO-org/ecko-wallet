import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { disable2FA } from 'src/stores/auth';
import { CommonLabel } from 'src/components';
import Button from 'src/components/Buttons';
import { NavigationHeader } from 'src/components/NavigationHeader';
import Toast from 'src/components/Toast/Toast';
import { useAppDispatch } from 'src/stores/hooks';

const Container = styled.div`
padding: 0 20px;
`;

const Body = styled.div`
  height: auto;
  width: 100%;
  font-size: 16px;
`;

const Footer = styled.div`
  width: 100%;
  height: 3em;
  margin-top: 35px;
`;

const TOTPDisabler = () => {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  const goBack = () => {
    history.goBack();
  };

  const handleDisable = () => {
    if (isLoading) return;
    setIsLoading(true);

    dispatch(disable2FA());
    goBack();
    toast.success(<Toast type="success" content="2FA removed successfully" />);
  };

  return (
    <Container>
      <NavigationHeader title="Two-Factor Authentication" onBack={goBack} />
      <Body>
        <CommonLabel fontSize={18}>
          Two-Factor Authentication is already setupped.
        </CommonLabel>
      </Body>
      <Footer>
        <Button onClick={handleDisable} isDisabled={isLoading} label="Disable" size="full" variant="primary" />
      </Footer>
    </Container>
  );
};
export default TOTPDisabler;
