import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { CommonLabel } from 'src/components';
import { NavigationHeader } from 'src/components/NavigationHeader';
import { hasTOTPSharedKey } from "src/utils/storage";
import TOTPSetup from "./TOTPSetup";

const Container = styled.div`
padding: 0 20px;
`;

const Body = styled.div`
  height: auto;
  width: 100%;
  font-size: 16px;
`;

const TwoFactorAuth = () => {
  const history = useHistory();
  const [isSetupped, setIsSetupped] = useState<boolean|undefined>(undefined);

  useEffect(() => {
    if (isSetupped === undefined) {
      hasTOTPSharedKey().then(
        (_isSetupped) => setIsSetupped(_isSetupped),
      );
    }
  }, [isSetupped]);

  const goBack = () => {
    history.goBack();
  };

  if (isSetupped === false) {
    return (
      <TOTPSetup />
    );
  }

  return (
    <Container>
      <NavigationHeader title="Two-Factor Authentication" onBack={goBack} />
      <Body>
        <CommonLabel fontSize={18}>
          2FA already setupped.
        </CommonLabel>
      </Body>
    </Container>
  );
};

export default TwoFactorAuth;
