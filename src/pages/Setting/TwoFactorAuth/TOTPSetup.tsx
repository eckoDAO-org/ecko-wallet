import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import QRCode from "react-qr-code";
import styled from 'styled-components';
import { hash } from '@kadena/cryptography-utils';
import { InputError } from 'src/baseComponent';
import { SInput } from 'src/baseComponent/BaseTextInput';
import { LabelWithLink } from 'src/components';
import Button from 'src/components/Buttons';
import { NavigationHeader } from 'src/components/NavigationHeader';
import { SeedPhraseRetrivier } from 'src/components/SeedPhraseRetrivier';
import Toast from 'src/components/Toast/Toast';
import { encryptSharedKey, generateSharedKey, initTOTP } from 'src/utils/totp';
import { useAppDispatch } from 'src/stores/hooks';
import { setTOTPSharedKey } from 'src/stores/auth';
import { Body, Footer, Page } from 'src/components/Page';

const GA_LINK = 'https://support.google.com/accounts/answer/1066447?hl=en';

const StepWrapper = styled.div`
  margin-bottom: 32px;
`;

const QRCodeWrapper = styled.div`
  background: white;
  padding: 16px;
  width: fit-content;
  margin: 0 auto;
`;

const TokenInput = styled(SInput)`
  width: 200px;
`;

const TokenInputWrapper = styled.div`
  width: 100%;
  text-align: center;
`;

const TOTPSetup = () => {
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [sharedKey, setSharedKey] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!sharedKey) {
      // This is not in the default state of useState in order to avoid to call the function at each render
      setSharedKey(generateSharedKey());
    }
  }, [sharedKey]);

  const goBack = () => {
    history.goBack();
  };

  const onSeedPhraseRetrivied = (_seedPhrase, _password) => setPassword(_password);

  const onChangeInput = (e) => {
    // Remove non-numeric characters
    setToken(e.target.value.replace(/\D/g, ''));
  };

  if (!password) {
    return (
      <SeedPhraseRetrivier onSuccess={onSeedPhraseRetrivied} />
    );
  }

  const totp = initTOTP(sharedKey);
  const uri = totp.toString();

  // Check if token is exactly 6 digits and validate it
  const is6Digits = token.match(/^\d{6}$/);
  const isValidToken = is6Digits ? (totp.validate({ token, window: 0 }) !== null) : false;

  const handleSave = () => {
    if (!isValidToken || isLoading) return;
    setIsLoading(true);

    const passwordHash = hash(password);
    const encryptedSharedKey = encryptSharedKey(sharedKey, passwordHash);
    dispatch(setTOTPSharedKey(encryptedSharedKey));
    goBack();
    toast.success(<Toast type="success" content="2FA setupped successfully" />);
  };

  return (
    <Page>
      <NavigationHeader title="Two-Factor Authentication" onBack={goBack} />
      <Body>
        <StepWrapper>
          <LabelWithLink fontSize={18}>
            1. Install <a href={GA_LINK} target="_blank" rel="noreferrer">Google Authenticator</a> or similiar apps
          </LabelWithLink>
        </StepWrapper>
        <StepWrapper>
          <LabelWithLink fontSize={18}>
            2. Scan the QR code below:
          </LabelWithLink>
          <QRCodeWrapper>
            <QRCode value={uri} />
          </QRCodeWrapper>
        </StepWrapper>
        <StepWrapper>
          <LabelWithLink fontSize={18}>
            3. Enter the 6-digit code
          </LabelWithLink>
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
        <Button onClick={handleSave} isDisabled={!isValidToken || isLoading} label="Save" size="full" variant="primary" />
      </Footer>
    </Page>
  );
};
export default TOTPSetup;
