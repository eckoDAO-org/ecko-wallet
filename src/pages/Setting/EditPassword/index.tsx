import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from 'src/stores/hooks';
import { getTOTPSharedKey, setTOTPSharedKey } from 'src/stores/auth';
import { reencryptSharedKey } from 'src/utils/totp';
import Button from 'src/components/Buttons';
import { NavigationHeader } from 'src/components/NavigationHeader';
import { PasswordForm } from 'src/components/PasswordForm';
import { SeedPhraseRetrivier } from 'src/components/SeedPhraseRetrivier';
import { STORAGE_PASSWORD_KEY, updateLocalWallets } from 'src/utils/storage';
import { hash } from '@kadena/cryptography-utils';
import useSessionStorage from 'src/hooks/useSessionStorage';
import { InputError } from 'src/baseComponent';
import { useSettingsContext } from 'src/contexts/SettingsContext';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';

const Container = styled.div`
padding: 0 20px;
`;

const Body = styled.div`
  height: auto;
  width: 100%;
  font-size: 16px;
`;

const Wrapper = styled.form`
  display: block;
`;

const Footer = styled.div`
  width: 100%;
  height: 3em;
  margin-top: 35px;
`;

const EditPassword = () => {
  const history = useHistory();
  const [oldPassword, setOldPassword] = useState('');
  const [, , , removeAccountPassword] = useSessionStorage(STORAGE_PASSWORD_KEY, null);
  const { setIsLocked } = useSettingsContext();
  const dispatch = useAppDispatch();
  const encryptedSharedKey = useAppSelector(getTOTPSharedKey);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    control,
  } = useForm();

  const goBack = () => {
    history.goBack();
  };

  const onSeedPhraseRetrivied = (_seedPhrase, password) => setOldPassword(password);

  const handle2FA = (oldKey: string, newKey: string) => {
    if (encryptedSharedKey) {
      const reencryptedSharedKey = reencryptSharedKey(encryptedSharedKey, oldKey, newKey);
      dispatch(setTOTPSharedKey(reencryptedSharedKey));
    }
  };

  const onSubmit = (data) => {
    const { password } = data;
    const oldPasswordHash = hash(oldPassword);
    const newPasswordHash = hash(password);
    updateLocalWallets(newPasswordHash, oldPasswordHash, () => {
      handle2FA(oldPasswordHash, newPasswordHash);
      removeAccountPassword();
      setIsLocked(true);
      toast.success(<Toast type="success" content="Password modified successfully" />);
    }, (error: Error) => {
      console.error(error);
      setError("updatePassword", {
        type: 'custom',
        message: 'Cannot update password',
      });
    });
  };

  if (!oldPassword) {
    return (
      <SeedPhraseRetrivier onSuccess={onSeedPhraseRetrivied} />
    );
  }

  return (
    <Container>
      <NavigationHeader title="Edit Password" onBack={goBack} />
      <Body>
        {errors.updatePassword && (
          <InputError>
            {errors.updatePassword.message}
          </InputError>
        )}
        <Wrapper onSubmit={handleSubmit(onSubmit)} id="edit-password-form">
          <PasswordForm
            clearErrors={clearErrors}
            control={control}
            errors={errors}
            getValues={getValues}
            register={register}
            setValue={setValue}
          />
        </Wrapper>
      </Body>
      <Footer>
        <Button label="Save" size="full" variant="primary" form="edit-password-form" />
      </Footer>
    </Container>
  );
};
export default EditPassword;
