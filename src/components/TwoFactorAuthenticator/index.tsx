import React from 'react';
import { is2FARequired, unrequire2FA } from 'src/stores/auth';
import { useAppDispatch, useAppSelector } from 'src/stores/hooks';
import { useSettingsContext } from 'src/contexts/SettingsContext';
import useSessionStorage from 'src/hooks/useSessionStorage';
import { STORAGE_PASSWORD_KEY } from 'src/utils/storage';
import UI from './UI';

interface Props {
  children: React.ReactNode;
}

const TwoFactorAuthenticator: React.FC<Props> = ({ children }) => {
  const dispatch = useAppDispatch();
  const required = useAppSelector(is2FARequired);
  const { setIsLocked } = useSettingsContext();
  const [, , , removeAccountPassword] = useSessionStorage(STORAGE_PASSWORD_KEY, null);

  // 2FA not required
  if (required === false) {
    return <>{children}</>;
  }

  const handleFailed = () => {
    // eslint-disable-next-line no-console
    console.warn('Failed to handle 2FA');
    dispatch(unrequire2FA());
    removeAccountPassword();
    setIsLocked(true);
  };

  const handleVerified = () => {
    dispatch(unrequire2FA());
  };

  // 2FA required
  return <UI handleFailed={handleFailed} handleVerified={handleVerified} />;
};

export default TwoFactorAuthenticator;
