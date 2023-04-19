import { useAppSelector } from 'src/stores/hooks';
import { hasTOTPSharedKey } from 'src/stores/auth';
import TOTPSetup from "./TOTPSetup";
import TOTPDisabler from './TOTPDisabler';

const TwoFactorAuth = () => {
  const isSetupped = useAppSelector(hasTOTPSharedKey);

  return isSetupped ? <TOTPDisabler /> : <TOTPSetup />;
};

export default TwoFactorAuth;
