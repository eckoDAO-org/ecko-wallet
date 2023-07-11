import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getLocalPassword } from 'src/utils/storage';
import { decryptSharedKey, initTOTP } from 'src/utils/totp';
import { useAppSelector } from 'src/stores/hooks';
import { getTOTPSharedKey } from 'src/stores/auth';
import { InputError } from 'src/baseComponent';
import { SInput } from 'src/baseComponent/BaseTextInput';
import { CommonLabel } from 'src/components';
import Button from 'src/components/Buttons';
import { Body, Header, Page } from 'src/components/Page';

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
  handleVerified: () => any;
  handleFailed: () => any;
}

const TOTPSetup = ({ handleVerified, handleFailed }: TOTPSetupProps) => {
  const encryptedSharedKey = useAppSelector(getTOTPSharedKey);
  const [sharedKey, setSharedKey] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!sharedKey && encryptedSharedKey) {
      getLocalPassword(
        // Password retrieved - decrypt shared key
        (passwordHash) => {
          const decryptedSharedKey = decryptSharedKey(encryptedSharedKey, passwordHash);

          if (!decryptedSharedKey) {
            // This should never happen. If it happens, user won't be able to login anymore.
            // In that case, user must reinstall the wallet and reimport the seed phrase.
            handleFailed();
          } else {
            setSharedKey(decryptedSharedKey);
          }
        },
        // Password not retrieved
        handleFailed,
      );
    }
  }, [sharedKey, encryptedSharedKey]);

  if (!sharedKey) {
    return <>Loading...</>;
  }

  if (!encryptedSharedKey) {
    handleFailed();
    return <>Loading...</>;
  }

  const onChangeInput = (e) => {
    // Remove non-numeric characters
    setToken(e.target.value.replace(/\D/g, ''));
  };

  const totp = initTOTP(sharedKey);

  // Check if token is exactly 6 digits and validate it
  const is6Digits = token.match(/^\d{6}$/);
  const isValidToken = is6Digits ? totp.validate({ token, window: 0 }) !== null : false;

  const handleSave = () => {
    if (!isValidToken || isLoading) return;

    setIsLoading(true);
    handleVerified();
  };

  return (
    <Page>
      <Header>
        <CommonLabel fontSize={18} fontWeight={500}>
          Two-Factor Authentication Required
        </CommonLabel>
      </Header>
      <Body>
        <StepWrapper>
          <Label fontSize={18}>Enter the 6-digit code</Label>
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
          {is6Digits && !isValidToken && <InputError>The code is not valid.</InputError>}
        </StepWrapper>
      </Body>
      <Footer>
        <Button onClick={handleSave} isDisabled={!isValidToken || isLoading} label="Verify" size="full" variant="primary" />
      </Footer>
    </Page>
  );
};
export default TOTPSetup;
