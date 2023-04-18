import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InputError } from 'src/baseComponent';
import { SInput } from 'src/baseComponent/BaseTextInput';
import { CommonLabel } from 'src/components';
import Button from 'src/components/Buttons';
import { getLocalPassword, getTOTPSharedKey, removeTOTPSharedKey } from 'src/utils/storage';
import { initTOTP } from 'src/utils/totp';

const Container = styled.div`
  padding: 20px;
`;

const Header = styled.div`
  height: 75px;
  text-align: center;
`;

const Body = styled.div`
  height: auto;
  width: 100%;
  font-size: 16px;
`;

const StepWrapper = styled.div`
  margin-bottom: 32px;
`;

const Label = styled(CommonLabel)`
  a {
    color: inherit;
  }
`;

const TokenInput = styled(SInput)`
  width: 200px;
`;

const TokenInputWrapper = styled.div`
  width: 100%;
  text-align: center;
`;

const Footer = styled.div`
  width: 100%;
  height: 3em;
  margin-top: 35px;
`;

interface TOTPSetupProps {
  handleVerified: () => any,
  handleFailed: () => any,
}

const TOTPSetup = ({ handleVerified, handleFailed }: TOTPSetupProps) => {
  const [sharedKey, setSharedKey] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!sharedKey) {
      getLocalPassword(
        // Password retrieved - decrypt shared key
        (passwordHash) => {
          getTOTPSharedKey(passwordHash).then((sharedKey) => {
            setSharedKey(sharedKey);
          });
        },
        // Password not retrieved
        handleFailed,
      );
    }
  }, [sharedKey]);

  if (!sharedKey) {
    return <>Loading...</>;
  }

  const onChangeInput = (e) => {
    // Remove non-numeric characters
    setToken(e.target.value.replace(/\D/g, ''));
  };

  const totp = initTOTP(sharedKey);

  // Check if token is exactly 6 digits and validate it
  const is6Digits = token.match(/^\d{6}$/);
  const isValidToken = is6Digits ? (totp.validate({ token, window: 0 }) !== null) : false;

  const handleSave = () => {
    if (!isValidToken || isLoading) return;

    setIsLoading(true);
    handleVerified();
  };

  return (
    <Container>
      <Header>
        <CommonLabel fontSize={18} fontWeight={500}>
          Two-Factor Authentication Required
        </CommonLabel>
      </Header>
      <Body>
        <StepWrapper>
          <Label fontSize={18}>
            Enter the 6-digit code
          </Label>
          <TokenInputWrapper>
            <TokenInput
              placeholder="000 000"
              onChange={onChangeInput}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  handleSave();
                }
              }}
            />
          </TokenInputWrapper>
          { is6Digits && !isValidToken && (
            <InputError>
              The code is not valid.
            </InputError>
          )}
        </StepWrapper>
      </Body>
      <Footer>
        <Button onClick={handleSave} isDisabled={!isValidToken || isLoading} label="Verify" size="full" variant="primary" />
      </Footer>
    </Container>
  );
};
export default TOTPSetup;
