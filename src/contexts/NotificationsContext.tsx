import React, { createContext, useContext } from 'react';
import { useAppDispatch } from 'src/stores/hooks';
import { addNotification, Notification } from 'src/stores/slices/notifications';

interface NotificationContextValue {
  pushNotification: (notification: Notification) => void;
  pushNotifications: (notifications: Notification[]) => void;
}

const defaultStateNotificationContextValue: NotificationContextValue = {
  pushNotification: () => {},
  pushNotifications: () => {},
};

const NotificationContext = createContext<NotificationContextValue>(defaultStateNotificationContextValue);

type Props = React.PropsWithChildren<{}>;

export const NotificationContextProvider = ({ children }: Props) => {
  const dispatch = useAppDispatch();

  const pushNotification = (notification: Notification) => {
    dispatch(addNotification(notification));
  };

  const pushNotifications = (notifications: Notification[]) => {
    notifications.forEach(pushNotification);
  };

  const context = {
    pushNotification,
    pushNotifications,
  };

  return (
    <NotificationContext.Provider value={context}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationProvider = () => {
  const context = useContext(NotificationContext);
  return context;
};
