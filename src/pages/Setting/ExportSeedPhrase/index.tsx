import { useHistory } from 'react-router-dom';
import images from 'src/images';
import styled from 'styled-components';
import Button from 'src/components/Buttons';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import bcrypt from 'bcryptjs';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { getLocalSeedPhrase } from 'src/utils/storage';
import { BaseTextInput, InputError } from 'src/baseComponent';
import { decryptKey } from 'src/utils/security';
import { ReactComponent as AlertIcon } from 'src/images/icon-alert.svg';
import { NavigationHeader } from 'src/components/NavigationHeader';
import { DivFlex, SecondaryLabel } from 'src/components';
import { Warning } from 'src/pages/SendTransactions/styles';
import { ActionList } from 'src/components/ActionList';

const Body = styled.div`
  height: 170px;
`;

const Wrapper = styled.div`
  padding: 0 20px;

  font-size: 16px;
  word-break: break-word;
`;

const SPWrapper = styled.div`
  padding: 16px;
  font-size: 16px;
  position: relative;
  box-shadow: 0px 167px 67px rgba(36, 8, 43, 0.01), 0px 94px 57px rgba(36, 8, 43, 0.03), 0px 42px 42px rgba(36, 8, 43, 0.06),
    0px 10px 23px rgba(36, 8, 43, 0.06), 0px 0px 0px rgba(36, 8, 43, 0.07);
  border-radius: 25px;
  box-sizing: border-box;
  margin: 30px 0;
  text-align: center;
`;

const LockImage = styled.img`
  width: 28px;
  height: 35px;
`;

const CustomButton = styled.div`
  margin-top: 20px;
`;

const SPText = styled.div`
  ${(props) => (props.isBlur ? 'filter: blur(4px);' : '')};
  font-weight: 400;
  line-height: 48px;
  font-family: monospace;
  font-size: 24px;
`;

const DivError = styled.div`
  margin-top: 10px;
`;
const defaultText = '***** ***** ***** ***** ***** ***** ***** ***** ***** ***** ***** *****';

const ExportSeedPhrase = () => {
  const history = useHistory();
  const rootState = useSelector((state) => state);
  const { passwordHash } = rootState.extensions;
  const [seedPhraseHash, setSeedPhraseHash] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [isHiddenSP, setIsHiddenSP] = useState(true);
  const [sP, setSP] = useState('');
  const [isErrorEmpty, setErrorEmpty] = useState(false);
  const [isErrorVerify, setErrorVerify] = useState(false);

  useEffect(() => {
    getLocalSeedPhrase(
      (hash) => {
        setSeedPhraseHash(hash);
      },
      () => {},
    );
  }, []);

  const onCopy = () => {
    navigator.clipboard.writeText(sP);
    toast.success(<Toast type="success" content="Copied!" />);
  };

  const goBack = () => {
    history.goBack();
  };

  const encryptText = (text) => {
    const arr = text.split(' ');
    let result = '';
    for (let i = 0; i < arr.length; i += 1) {
      let t = arr[i];
      if (i !== 0 && i !== arr.length - 1) {
        t = '*****';
      }
      result = `${result} ${t}`;
    }
    return result;
  };

  const showSP = () => {
    setIsHiddenSP(false);
    const plainSeedPhrase = decryptKey(seedPhraseHash, passwordHash);
    setSP(plainSeedPhrase);
  };

  const onDownload = () => {
    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(sP)}`);
    element.setAttribute('download', 'secret-recovery-phrase');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const onChangeInput = (e) => {
    setPasswordInput(e.target.value);
    if (e.target.value) {
      setErrorEmpty(false);
      setErrorVerify(false);
    } else {
      setErrorVerify(false);
    }
  };
  const handleVerifyPassword = () => {
    if (!passwordInput) {
      setErrorEmpty(true);
    } else {
      bcrypt.compare(passwordInput, passwordHash, (_errors, isValid) => {
        if (isValid) {
          showSP();
        } else {
          setErrorVerify(true);
        }
      });
    }
  };
  return (
    <Wrapper>
      <NavigationHeader title="Export Recovery Phrase" onBack={goBack} />
      {!isHiddenSP && (
        <SPWrapper>
          <SPText>{sP ? encryptText(sP) : defaultText}</SPText>
          <DivFlex flexDirection="column" alignItems="center" marginTop="30px" paddingTop="30px" style={{ borderTop: '1px solid #DFDFED' }}>
            <SecondaryLabel fontWeight={500} fontSize={14}>
              Your Secret Recovery Phrase makes it easy to back up and restore your account.
            </SecondaryLabel>
            <Warning style={{ textAlign: 'start', marginTop: 30 }}>
              <AlertIcon style={{ minWidth: 22 }} />
              Never disclose your Secret Recovery Phrase. Anyone with this phrase cane take your wallet forever.
            </Warning>
          </DivFlex>
        </SPWrapper>
      )}
      {isHiddenSP && (
        <DivFlex flexDirection="column" justifyContent="center" alignItems="center" padding="50px 0px">
          <LockImage src={images.settings.iconLockOpen} alt="lock" />
          <SecondaryLabel fontWeight={500}>Enter your password to continue</SecondaryLabel>
        </DivFlex>
      )}
      <Body>
        {isHiddenSP ? (
          <>
            <BaseTextInput
              inputProps={{ placeholder: 'Input password', type: 'password' }}
              title="Password"
              height="auto"
              onChange={onChangeInput}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  handleVerifyPassword();
                }
              }}
              typeInput="password"
            />
            <DivError>
              {isErrorEmpty && <InputError marginTop="0">This field is required.</InputError>}
              {isErrorVerify && <InputError marginTop="0">Invalid Passwords.</InputError>}
            </DivError>
            <CustomButton>
              <Button size="full" variant="primary" onClick={handleVerifyPassword} isDisabled={!passwordInput} label="Continue" />
            </CustomButton>
          </>
        ) : (
          <div>
            <ActionList
              actions={[
                {
                  label: 'Copy Keyphrase',
                  src: images.wallet.copyGray,
                  onClick: onCopy,
                },
                { label: 'Download', src: images.settings.iconDownload, onClick: onDownload },
              ]}
            />
          </div>
        )}
      </Body>
    </Wrapper>
  );
};
export default ExportSeedPhrase;
