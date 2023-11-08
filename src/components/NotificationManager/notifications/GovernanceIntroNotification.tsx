import React from 'react';
import { useNotificationProvider } from 'src/contexts/NotificationsContext';

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
      content: 'Go check out the only stable coin on Kadena and enjoy a booster with our multiplier by becoming a liquidity provider on eckoDEX',
    });
  }, []);

  return null;
};

export default GovernanceIntroNotification;
