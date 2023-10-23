import React from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'src/stores/hooks';
import { addNotification, getNotification, markAsRead } from 'src/stores/slices/notifications';
import SimpleToast from '../Toast/SimpleToast';

const govIntroKey = 'governanceIntroduction';
const govIntroContent = 'Governance has  been integrated on the wallet! Click on "KDX" to interact with it.';

// Currently this works for governanceIntroduction, but it should/will be decomposed and extended for general notifications
const NotificationManager = () => {
  const dispatch = useAppDispatch();
  const govIntroNotification = useAppSelector(getNotification(govIntroKey));

  React.useEffect(() => {
    if (govIntroNotification !== undefined) {
      return;
    }

    dispatch(addNotification({
      id: govIntroKey,
      content: govIntroContent,
    }));
  }, [govIntroNotification]);

  React.useEffect(() => {
    if (!govIntroNotification || govIntroNotification.readTimestamp) {
      return;
    }

    toast.success(
      <SimpleToast content={govIntroNotification.content} />,
      {
        autoClose: false,
        toastId: govIntroKey,
        onClose: () => dispatch(markAsRead(govIntroKey)),
      },
    );
  }, [govIntroNotification]);

  return null;
};

export default NotificationManager;
