import React from 'react';
import { DivFlex } from 'src/components';
import { useNotificationProvider } from 'src/contexts/NotificationsContext';
import images from 'src/images';

const govIntroKey = 'governanceIntroduction';
const govIntroContent = 'Governance has  been integrated on the wallet! Click on "KDX" to interact with it.';

const GovernanceIntroNotification = () => {
  const notificationProvider = useNotificationProvider();

  React.useEffect(() => {
    notificationProvider.pushNotification({
      id: govIntroKey,
      content: govIntroContent,
    });
    notificationProvider.pushNotification({
      id: 'zUSDBridge',
      content: (
        <DivFlex alignItems="center" gap="10px">
          <img src={images.wallet.iconAlertModal} width={30} height={30} />
          Go check out the only stable coin on Kadena and enjoy a booster with our multiplier by becoming a liquidity provider on eckoDEX
        </DivFlex>
      ),
    });
  }, []);

  return null;
};

export default GovernanceIntroNotification;
