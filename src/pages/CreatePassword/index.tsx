import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { BaseTextInput, InputError } from 'src/baseComponent';
import lib from 'cardano-crypto.js/kadena-crypto';
import { useSelector } from 'react-redux';
import { hash as kadenaHash } from '@kadena/cryptography-utils';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { initLocalWallet, setLocalPassword, updateWallets } from 'src/utils/storage';
import Toast from 'src/components/Toast/Toast';
import { NavigationHeader } from 'src/components/NavigationHeader';
import Button from 'src/components/Buttons';

const CreatePasswordWrapper = styled.div`
  padding: 0 20px;
`;
const Body = styled.div`
  height: auto;
  width: 100%;
  font-size: 16px;
`;
const DivBody = styled.div`
  width: 100%;
  text-align: left;
  font-size: 16px;
  line-height: 40px;
  display: flex;
  align-items: center;
  margin-top: 20px;
`;
const Footer = styled.div`
  width: 100%;
  height: 3em;
  margin-top: 35px;
`;
const Wrapper = styled.form`
  display: block;
`;

const CreatePassword = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm();
  const rootState = useSelector((state) => state);
  const { isCreateSeedPhrase, selectedNetwork } = rootState.extensions;

  const history = useHistory();

  const onStorePassword = (data, path) => {
    const hash = kadenaHash(data.password);
    setLocalPassword(hash);
    toast.success(<Toast type="success" content="Create new password successfully" />);
    if (isCreateSeedPhrase) {
      const newStateWallet = initLocalWallet(data.seedPhrase, hash);
      updateData(hash, path, newStateWallet);
      history.push('/sign-in');
    } else {
      updateWallets(selectedNetwork.networkId);
      history.push(path);
      updateData(hash, path, null);
    }
  };
  const updateData = (hash, path, wallet) => {
    setTimeout(() => {
      (window as any)?.chrome?.runtime?.sendMessage({
        target: 'kda.extension',
        action: 'sync_data',
        type: 'create_password',
        passwordHash: hash,
        path,
        wallet,
      });
    }, 300);
  };
  const onCheck = (data) => {
    const { seedPhrase } = data;
    if (isCreateSeedPhrase) {
      const isSeedPhraseValid = lib.kadenaCheckMnemonic(seedPhrase);
      if (!isSeedPhraseValid) {
        toast.error(<Toast type="fail" content="Invalid Secret Recovery Phrase!" />);
      } else {
        onStorePassword(data, '/sign-in');
      }
    } else {
      onStorePassword(data, '/seed-phrase');
    }
  };

  const goBack = () => {
    history.push('/init-seed-phrase');
  };

  const checkInValidPassword = (str) => {
    const pattern = new RegExp('^[À-úa-z0-9A-Z_+!?"-\'.#@,;-\\s]*$');
    return !!pattern.test(str);
  };

  return (
    <CreatePasswordWrapper>
      <NavigationHeader title={isCreateSeedPhrase ? 'Import From Recovery Phrase' : 'Create Password'} onBack={goBack} />
      <Body>
        <Wrapper onSubmit={handleSubmit(onCheck)} id="create-password-form">
          {isCreateSeedPhrase && (
            <>
              <DivBody>
                <BaseTextInput
                  inputProps={{
                    type: 'password',
                    placeholder: 'Paste Secret Recovery Phrase',
                    ...register('seedPhrase', {
                      required: {
                        value: true,
                        message: 'This field is required.',
                      },
                      maxLength: {
                        value: 256,
                        message: 'Secret Recovery Phrase too long.',
                      },
                    }),
                  }}
                  typeInput="password"
                  title="Secret Recovery Phrase"
                  height="auto"
                  onChange={(e) => {
                    clearErrors('seedPhrase');
                    setValue('seedPhrase', e.target.value);
                  }}
                />
              </DivBody>
              <>{errors.seedPhrase && <InputError>{errors.seedPhrase.message}</InputError>}</>
            </>
          )}
          <DivBody>
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
                  validate: {
                    match: (val) =>
                      checkInValidPassword(val) || 'Sorry, only letters(a-z), numbers(0-9), and special characters _!?"\'.#@,;- are allowed.',
                  },
                }),
              }}
              typeInput="password"
              title="New Password (min 8 chars)"
              height="auto"
              onChange={(e) => {
                clearErrors('password');
                setValue('password', e.target.value.trim());
              }}
            />
          </DivBody>
          <>{errors.password && <InputError>{errors.password.message}</InputError>}</>
          <DivBody>
            <BaseTextInput
              inputProps={{
                type: 'password',
                placeholder: 'Input Confirm Password',
                ...register('confirmPassword', {
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                  maxLength: {
                    value: 256,
                    message: 'Password should be maximum 256 characters.',
                  },
                  validate: {
                    match: (v) => v === getValues('password') || 'Password does not match',
                  },
                }),
              }}
              typeInput="password"
              title="Confirm Password"
              height="auto"
              onChange={(e) => {
                clearErrors('confirmPassword');
                setValue('confirmPassword', e.target.value);
              }}
            />
          </DivBody>
          <>{errors.confirmPassword && <InputError>{errors.confirmPassword.message}</InputError>}</>
        </Wrapper>
      </Body>
      <Footer>
        <Button label={isCreateSeedPhrase ? 'Import' : 'Create'} size="full" variant="primary" form="create-password-form" />
      </Footer>
    </CreatePasswordWrapper>
  );
};

export default CreatePassword;
