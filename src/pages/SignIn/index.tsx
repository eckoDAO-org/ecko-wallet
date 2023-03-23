import { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { hash } from '@kadena/cryptography-utils';
import images from 'src/images';
import Button from 'src/components/Buttons';
import { delay } from 'src/utils';
import { CommonLabel, DivFlex } from 'src/components';
import { BaseTextInput, InputError } from 'src/baseComponent';
import { useSettingsContext } from 'src/contexts/SettingsContext';
import { useHistory } from 'react-router-dom';
import { checkIsValidOldPassword, decryptKey } from 'src/utils/security';
import { setActiveTab } from 'src/stores/extensions';
import {
  getLocalPassword,
  getLocalSeedPhrase,
  getLocalSelectedWallet,
  getOldLocalPassword,
  initDataFromLocal,
  initLocalWallet,
  removeOldLocalPassword,
  setLocalPassword,
} from 'src/utils/storage';
import { ACTIVE_TAB } from 'src/utils/constant';
import { DivError } from '../Setting/Contact/views/style';
import { WelcomeBackground } from '../InitSeedPhrase';

export const isValidPassword = async (password) => {
  const hashPassword = hash(password);
  return new Promise<Boolean>((resolve, reject) => {
    getLocalSelectedWallet(
      (w) => {
        try {
          const decryptedAccount = decryptKey(w.account, hashPassword);
          if (typeof decryptedAccount === 'string' && decryptedAccount?.length) {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch (err) {
          resolve(false);
        }
      },
      () => {
        resolve(false);
      },
    );
  });
};

const DivImage = styled.div`
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.color};
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-top: 30px;
  margin-bottom: 30px;
  font-weight: ${(props) => props.fontWeight};
`;
const Image = styled.img<{ size: string; top: string; width: string }>`
  height: ${($props) => $props.size};
  width: ${($props) => ($props.width ? $props.width : $props.size)};
  margin: auto;
  cursor: ${(props) => props.cursor};
  margin-top: ${(props) => props.marginTop};
`;

const SignIn = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setError,
    setValue,
    clearErrors,
  } = useForm();

  const rootState = useSelector((state) => state);
  const { selectedNetwork, networks } = rootState.extensions;
  const { setIsLocked } = useSettingsContext();

  useEffect(() => {
    getLocalPassword(
      (p) => {
        if (p) {
          history.push('/');
          setActiveTab(ACTIVE_TAB.HOME);
        }
      },
      () => {},
    );
  }, []);

  const saveSessionPassword = (password) => {
    const hashPassword = hash(password);
    setLocalPassword(hashPassword);
    initDataFromLocal(selectedNetwork, networks);
  };

  const unlockWallet = () => {
    setIsLocked(false);
    getLocalSelectedWallet(
      () => {
        history.push('/');
        setActiveTab(ACTIVE_TAB.HOME);
      },
      () => {
        history.push('/init');
      },
    );
    (window as any).chrome.runtime.sendMessage({
      target: 'kda.extension',
      action: 'sync_data',
    });
  };

  const handleSignIn = () => {
    const password = getValues('password');
    getOldLocalPassword(
      async (oldHashPassword) => {
        console.log(`🚀 ~ HAS oldHashPassword:`, oldHashPassword);
        // old password found
        // check if is correct
        const isValidOldPassword = checkIsValidOldPassword(password, oldHashPassword);
        if (isValidOldPassword) {
          // get seedphrase and store again
          getLocalSeedPhrase(
            async (secretKey) => {
              const plainSeedPhrase = decryptKey(secretKey, oldHashPassword);
              console.log(`🚀 ~ plainSeedPhrase:`, plainSeedPhrase);
              // save new hashed secretKey
              const hashPassword = hash(password);
              console.log(`🚀 ~ new hashPassword:`, hashPassword);
              initLocalWallet(plainSeedPhrase, hashPassword);
              removeOldLocalPassword();
              saveSessionPassword(password);
              unlockWallet();
            },
            () => {},
          );
        } else {
          setError('password', { type: 'manual', message: 'Invalid Password' });
        }
      },
      //
      async () => {
        const isValid = await isValidPassword(password);
        if (!isValid) {
          setError('password', { type: 'manual', message: 'Invalid Password' });
        } else {
          saveSessionPassword(password);
          unlockWallet();
        }
      },
    );
  };

  const history = useHistory();
  return (
    <WelcomeBackground>
      <DivFlex flexDirection="column" style={{ height: '100vh', padding: '0 24px' }} justifyContent="center" gap="45px">
        <DivImage marginBottom="30px" marginTop="30px">
          <Image src={images.eckoWalletLogo} size={200} width={200} alt="logo" />
          <CommonLabel color="#fff" fontSize={18} fontWeight={500} style={{ marginTop: 20 }}>
            Login to your account
          </CommonLabel>
        </DivImage>
        <form onSubmit={handleSubmit(handleSignIn)} id="sign-in-form">
          <DivFlex flexDirection="column">
            <BaseTextInput
              inputProps={{
                type: 'password',
                placeholder: 'Input Password',
                ...register('password', {
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                  minLength: {
                    value: 8,
                    message: 'Password should be minimum 8 characters.',
                  },
                  maxLength: {
                    value: 256,
                    message: 'Password should be maximum 256 characters.',
                  },
                }),
                style: { color: '#fff' },
              }}
              wrapperStyle={{
                background: 'linear-gradient(114.43deg, #293445 5.17%, #292A45 65.62%)',
                borderRadius: 25,
              }}
              typeInput="password"
              title="Password"
              height="auto"
              onChange={(e) => {
                clearErrors('password');
                setValue('password', e.target.value);
              }}
            />
            <DivError>{errors.password && <InputError marginTop="0">{errors.password.message}</InputError>}</DivError>
          </DivFlex>
          <Button type="submit" size="full" form="sign-in-form" label="Sign In" style={{ marginTop: 80 }} />
        </form>
      </DivFlex>
    </WelcomeBackground>
  );
};

export default SignIn;
