import React from 'react';
import { useNotificationProvider } from 'src/contexts/NotificationsContext';

const id = 'governanceIntroduction';
const content = 'Governance has  been integrated on the wallet! Click on "KDX" to interact with it.';

const GovernanceIntroNotification = () => {
  const notificationProvider = useNotificationProvider();

  React.useEffect(() => {
    notificationProvider.pushNotification({ id, content });
  }, []);

  return null;
};

export default GovernanceIntroNotification;
