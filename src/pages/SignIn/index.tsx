import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import bcrypt from 'bcryptjs';
import images from 'src/images';
import Button from 'src/components/Buttons';
import { CommonLabel, DivFlex } from 'src/components';
import { BaseTextInput, InputError } from 'src/baseComponent';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setActiveTab, setExpiredTime } from 'src/stores/extensions';
import { getLocalSelectedWallet, setLocalExpiredTime } from 'src/utils/storage';
import { ACTIVE_TAB } from 'src/utils/constant';
import { DivError } from '../Setting/Contact/views/style';
import { WelcomeBackground } from '../InitSeedPhrase';

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
  const extensions = useSelector((state) => state.extensions);

  const handleSignIn = () => {
    const password = getValues('password');
    bcrypt.compare(password, extensions.passwordHash, (_errors, isValid) => {
      if (isValid) {
        const now = new Date();
        const time = now.getTime();
        const expiredTime = time + 1000 * 1800;
        setExpiredTime(expiredTime);
        setLocalExpiredTime(expiredTime);
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
      } else {
        setError('password', { type: 'manual', message: 'Invalid Passwords' });
      }
    });
  };
  const history = useHistory();
  return (
    <WelcomeBackground>
      <DivFlex flexDirection="column" style={{ height: '100vh', padding: '0 24px' }} justifyContent="center" gap="45px">
        <DivImage marginBottom="30px" marginTop="30px">
          <Image src={images.xWalletLogoSquare} size={200} width={200} alt="logo" />
          <CommonLabel color="#fff" fontSize={24} fontWeight={500}>
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
