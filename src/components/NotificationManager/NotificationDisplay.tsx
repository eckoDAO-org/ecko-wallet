import React from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'src/stores/hooks';
import { getNotifications, markAsRead, Notification } from 'src/stores/slices/notifications';
import SimpleToast from 'src/components/Toast/SimpleToast';

const NotificationDisplay = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(getNotifications);

  const showNotification = (notification: Notification) => {
    if (notification.readTimestamp) {
      return;
    }

    toast.success(
      <SimpleToast content={notification.content} />,
      {
        autoClose: false,
        toastId: notification.id,
        onClose: () => readNotification(notification),
      },
    );
  };

  const readNotification = (notification: Notification) => {
    dispatch(markAsRead(notification.id));
  };

  React.useEffect(() => {
    Object
      .values(notifications)
      .filter((notification): notification is Notification => !!notification)
      .forEach(showNotification);
  }, [notifications]);

  return null;
};

export default NotificationDisplay;
