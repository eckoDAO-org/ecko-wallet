import React from 'react';
import GovernanceIntroNotification from './notifications/GovernanceIntroNotification';
import ZusdBridge from './notifications/ZusdBridge';

const NotificationProvider = () => (
  <>
    <GovernanceIntroNotification />
    <ZusdBridge />
  </>
);

export default NotificationProvider;
