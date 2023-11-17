import React from 'react';
import { useNotificationProvider } from 'src/contexts/NotificationsContext';

const id = 'zUSDBridge';
const content = 'Go check out the only stable coin on Kadena and enjoy a booster with our multiplier by becoming a liquidity provider on eckoDEX';

const ZusdBridge = () => {
  const notificationProvider = useNotificationProvider();

  React.useEffect(() => {
    notificationProvider.pushNotification({ id, content });
  }, []);

  return null;
};

export default ZusdBridge;
