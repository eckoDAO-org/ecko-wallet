import { useHistory } from 'react-router-dom';
import images from 'src/images';
import styled from 'styled-components';
import Back from 'src/components/Back';
import Button from 'src/components/Buttons';
import { BUTTON_SIZE, BUTTON_TYPE } from 'src/utils/constant';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import bcrypt from 'bcryptjs';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { getLocalSeedPhrase } from 'src/utils/storage';
import { BaseTextInput, InputError } from 'src/baseComponent';
import { decryptKey } from 'src/utils/security';

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ButtonWrapper = styled.div`
  width: 48%;
`;
const Body = styled.div`
  height: 170px;
`;
const Wrapper = styled.div`
  padding: 0 20px;
  color: #461a57;
  font-size: 16px;
  word-break: break-word;
`;
const SPWrapper = styled.div`
  padding: 16px;
  font-size: 16px;
  position: relative;
  border: 1px solid #461a57;
  border-radius: 8px;
  box-sizing: border-box;
  margin: 30px 0;
  text-align: center;
  background: linear-gradient(90deg, rgba(230, 254, 254, 0.9) 0%, rgba(253, 246, 230, 0.9) 100%);
`;
const SPBlackDrop = styled.div`
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, rgba(230, 254, 254, 0.9) 0%, rgba(253, 246, 230, 0.9) 100%);
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  align-items: center;
  position: absolute;
  cursor: pointer;
  justify-content: center;
`;
const Title = styled.div`
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  text-align: left;
  text-align: center;
  margin: 40px 0;
  color: #461a57;
`;
const Text = styled.div`
  margin-bottom: ${(props) => (props.isLast ? '0' : '30px')};
`;
const SPDropText = styled.div`
  text-align: center;
  margin-top: 12px;
  font-weight: 700;
  color: #461a57;
  padding: 0 15px;
  line-height: 19px;
`;
const LockImage = styled.img`
  width: 28px;
  height: 35px;
`;
const CustomButton = styled.div`
  margin-top: 20px;
`;
const SPContent = styled.div`
  text-align: center;
  background: #eee6f3;
  padding: 18px 15px;
  margin-top: 20px;
  color: #461a57;
  font-size: 16px;
  border: 1px solid #461a57;
  border-radius: 8px;
  align-items: center;
`;
const SPText = styled.div`
  ${(props) => (props.isBlur ? 'filter: blur(4px);' : '')};
  font-weight: 700;
  line-height: 40px;
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
      <Back title="Back" onBack={goBack} />
      <Title>Export Secret Recovery Phrase</Title>
      <SPWrapper>
        <SPText isBlur={isHiddenSP}>{sP ? encryptText(sP) : defaultText}</SPText>
        {isHiddenSP && (
          <SPBlackDrop>
            <LockImage src={images.settings.lockImg} alt="lock" />
            <SPDropText>Input password to show Secret Recovery Phrase</SPDropText>
          </SPBlackDrop>
        )}
      </SPWrapper>
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
              <Button onClick={handleVerifyPassword} isDisabled={!passwordInput} label="Verify" size={BUTTON_SIZE.FULL} />
            </CustomButton>
          </>
        ) : (
          <>
            <Footer>
              <ButtonWrapper>
                <Button onClick={onCopy} label="Copy" type={BUTTON_TYPE.DISABLE} size={BUTTON_SIZE.FULL} />
              </ButtonWrapper>
              <ButtonWrapper>
                <Button onClick={onDownload} label="Download" size={BUTTON_SIZE.FULL} />
              </ButtonWrapper>
            </Footer>
          </>
        )}
      </Body>
      <SPContent>
        <Text>Your Secret Recovery Phrase makes it easy to back up and restore your account.</Text>
        <Text isLast>Warning: Never disclose your Secret Recovery Phrase. Anyone with this phrase cane take your wallet forever.</Text>
      </SPContent>
    </Wrapper>
  );
};
export default ExportSeedPhrase;
