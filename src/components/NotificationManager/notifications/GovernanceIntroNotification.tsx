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
  }, []);

  return null;
};

export default GovernanceIntroNotification;
