import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import bcrypt from 'bcryptjs';
import images from 'src/images';
import { BaseTextInput, InputError } from 'src/baseComponent';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setExpiredTime } from 'src/stores/extensions';
import { getLocalSelectedWallet, setLocalExpiredTime } from 'src/utils/storage';
import { DivError } from '../Setting/Contact/views/style';

const CreatePasswordWrapper = styled.div`
  padding: 0 20px;
`;
const Wrapper = styled.form`
  display: block;
`;
const Body = styled.div`
  height: auto;
  width: 100%;
  font-family: 'Play', sans-serif;
  font-size: 16px;
  margin-top: 40px;
`;
const DivBody = styled.div`
  width: 100%;
  text-align: left;
  font-size: 16px;
  line-height: 40px;
  display: flex;
  align-items: center;
`;
const Title = styled.div`
  font-weight: 700;
  font-size: 24px;
  line-height: 25px;
  color: #461A57;
  text-align: left;
  margin-bottom: 50px;
  text-align: center;
`;
const Footer = styled.div`
  width: 100%;
  height: 3em;
  margin-top: 50px;
`;

const SignInButton = styled.button`
  width: 100%;
  height: 44px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  border: none;
  background: #461A57;
  color: white;
  font-weight: 700;
  font-family: 'Play', sans-serif;
`;
const DivImage = styled.div`
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.color};
  display: flex;
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
        getLocalSelectedWallet(() => {
          history.push('/');
        }, () => {
          history.push('/init');
        });
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
    <CreatePasswordWrapper>
      <Body>
        <DivImage marginBottom="30px" marginTop="30px"><Image src={images.logoDapps} size={80} width={80} alt="logo" /></DivImage>
        <DivImage marginBottom="30px" marginTop="30px"><Image src={images.logoWallet} size={55} width={238} alt="logo-wallet" /></DivImage>
        <Title>Welcome</Title>
        <Wrapper onSubmit={handleSubmit(handleSignIn)} id="sign-in-form">
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
                }),
              }}
              typeInput="password"
              title="Password"
              height="auto"
              onChange={(e) => { clearErrors('password'); setValue('password', e.target.value); }}
            />
          </DivBody>
          <DivError>
            {errors.password && (
            <InputError marginTop="0">{errors.password.message}</InputError>
            )}
          </DivError>
        </Wrapper>
      </Body>
      <Footer>
        <SignInButton form="sign-in-form">
          Sign In
        </SignInButton>
      </Footer>
    </CreatePasswordWrapper>
  );
};

export default SignIn;
