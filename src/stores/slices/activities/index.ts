import { createSlice, createEntityAdapter, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { LocalActivity } from 'src/components/Activities/types';
import { RootState } from 'src/stores';

const activitiesAdapter = createEntityAdapter<LocalActivity>({
  sortComparer: (a, b) => +new Date(b.createdTime) - +new Date(a.createdTime),
});

const initialState = activitiesAdapter.getInitialState();

interface RemoveByAccountAndNetworkPayload {
  accountId: string;
  networkId: string;
}

const activitiesSlice = createSlice({
  name: 'activities',
  initialState,

  reducers: {
    addActivity: activitiesAdapter.addOne,
    upsertActivities: activitiesAdapter.upsertMany,
    setActivities: activitiesAdapter.setAll,
    removeByAccountAndNetwork: (state, action: PayloadAction<RemoveByAccountAndNetworkPayload>) => {
      const { accountId, networkId } = action.payload;
      const ids = state.ids.filter(
        (id) => state.entities[id]?.accountId === accountId && state.entities[id]?.networkId === networkId,
      );
      activitiesAdapter.removeMany(state, ids);
    },
  },
});

export const {
  addActivity,
  upsertActivities,
  setActivities,
  removeByAccountAndNetwork,
} = activitiesSlice.actions;

export const {
  selectAll: selectAllActivities,
  selectById: selectActivityById,
} = activitiesAdapter.getSelectors((state: RootState) => state.activities);

export const selectActivitiesByAccountAndNetwork = createSelector(
  [
    selectAllActivities,
    (_: RootState, accountId: string, networkId: string) => ({ accountId, networkId }),
  ],
  (activities, { accountId, networkId }) => (
    activities.filter((activity) => (activity.accountId === accountId) && (activity.networkId === networkId))
  ),
);

export const selectPendingCrossChainActivities = createSelector(
  [selectAllActivities],
  (activities) => activities.filter((activity) => activity.status === 'pending' && (activity.senderChainId !== activity.receiverChainId)),
);

export { activitiesSlice };
