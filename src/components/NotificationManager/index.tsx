import React from 'react';
import NotificationDisplay from './NotificationDisplay';
import NotificationProvider from './NotificationProvider';

const NotificationManager = () => (
  <>
    <NotificationDisplay />
    <NotificationProvider />
  </>
);

export default NotificationManager;
