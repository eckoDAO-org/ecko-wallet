import { useEffect, useState } from 'react';
import { hasTOTPSharedKey } from "src/utils/storage";
import TOTPSetup from "./TOTPSetup";
import TOTPDisabler from './TOTPDisabler';

const TwoFactorAuth = () => {
  const [isSetupped, setIsSetupped] = useState<boolean|undefined>(undefined);

  useEffect(() => {
    if (isSetupped === undefined) {
      hasTOTPSharedKey().then(
        (_isSetupped) => setIsSetupped(_isSetupped),
      );
    }
  }, [isSetupped]);

  if (isSetupped === false) {
    return (
      <TOTPSetup />
    );
  }

  return (
    <TOTPDisabler />
  );
};

export default TwoFactorAuth;
