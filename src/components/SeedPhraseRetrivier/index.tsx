import styled from 'styled-components';
import { useEffect, useState } from "react";
import { hash as kadenaHash } from '@kadena/cryptography-utils';
import { decryptKey } from 'src/utils/security';
import { getLocalSeedPhrase } from "src/utils/storage";
import { BaseTextInput, InputError } from 'src/baseComponent';
import { DivFlex, SecondaryLabel } from 'src/components';
import Button from 'src/components/Buttons';
import images from 'src/images';
import { useSelector } from 'react-redux';

const Wrapper = styled.div`
  padding: 0 20px;

  font-size: 16px;
  word-break: break-word;
`;

const LockImage = styled.img`
  width: 28px;
  height: 35px;
`;

const CustomButton = styled.div`
  margin-top: 20px;
`;

const DivError = styled.div`
  margin-top: 10px;
`;

interface SeedPhraseRetrivierProps {
  onSuccess: (seedPhrase: string, password: string) => any,
  onFail?: () => any,
}

export const SeedPhraseRetrivier = ({ onSuccess, onFail }: SeedPhraseRetrivierProps) => {
  const rootState = useSelector((state) => state);
  const { passwordHash } = rootState.extensions;

  const [seedPhrase, setSeedPhrase] = useState('');
  const [seedPhraseHash, setSeedPhraseHash] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
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
      const hashInput = kadenaHash(passwordInput);
      const isValid = hashInput === passwordHash;

      if (isValid) {
        try {
          const plainSeedPhrase = decryptKey(seedPhraseHash, hashInput);
          setSeedPhrase(plainSeedPhrase);
          onSuccess(plainSeedPhrase, passwordInput);
        } catch (err) {
          console.error('Invalid hash');
          onFail?.();
        }
      } else {
        setErrorVerify(true);
      }
    }
  };

  return (
    <>
      {!seedPhrase && (
        <DivFlex flexDirection="column" justifyContent="center" alignItems="center" padding="50px 0px">
          <LockImage src={images.settings.iconLockOpen} alt="lock" />
          <SecondaryLabel fontWeight={500}>Enter your password to continue</SecondaryLabel>
        </DivFlex>
      )}
      <Wrapper>
        {!seedPhrase && (
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
        )}
        {seedPhrase && (
          <SecondaryLabel fontWeight={500}>Your password is correct, please wait...</SecondaryLabel>
        )}
      </Wrapper>
    </>
  );
};
