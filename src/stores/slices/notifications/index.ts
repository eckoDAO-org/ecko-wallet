import { Dictionary, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/stores';

export interface Notification {
  id: string;
  content: string;
  readTimestamp?: number;
}

export type NotificationsState = Dictionary<Notification>;
export type AddNotificationPayload = Pick<Notification, 'id' | 'content'>;

const initialState: NotificationsState = {};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<AddNotificationPayload>) {
      const { id, content } = action.payload;

      if (state[id] !== undefined) {
        return;
      }

      state[id] = {
        id,
        content,
        readTimestamp: undefined,
      };
    },

    markAsRead(state, { payload: notificationId }: PayloadAction<string>) {
      const notification = state[notificationId];

      if (notification === undefined) {
        return;
      }

      notification.readTimestamp = Date.now();
    },
  },
});

export const {
  addNotification,
  markAsRead,
} = notificationsSlice.actions;

export const getNotifications = (state: RootState) => state.notifications;

export const getNotification = (notificationId: Notification['id']) => (
  (state: RootState) => state.notifications[notificationId]
);

export const isRead = (notificationId: Notification['id']) => (
  (state: RootState) => !!state.notifications[notificationId]?.readTimestamp
);

export { notificationsSlice };
