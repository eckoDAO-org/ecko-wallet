import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/stores';

export type AnalyticsState = {
  trackPortfolio: boolean;
  trackedAddresses: string[];
}

const initialState: AnalyticsState = {
  trackPortfolio: false,
  trackedAddresses: [],
};

const analyticsSlice = createSlice({
  name: 'analytics_v1',
  initialState,
  reducers: {
    startTrackPortfolio(state) {
      state.trackPortfolio = true;
    },

    stopTrackPortfolio(state) {
      state.trackPortfolio = false;
    },

    addTrackedAddress(state, action: PayloadAction<string>) {
      const address = action.payload;
      state.trackedAddresses.push(address);
    },

    removeTrackedAddress(state, action: PayloadAction<string>) {
      const address = action.payload;
      state.trackedAddresses = state.trackedAddresses.filter((item) => item !== address);
    },
  },
});

export const { startTrackPortfolio, stopTrackPortfolio, addTrackedAddress, removeTrackedAddress } = analyticsSlice.actions;

export const canTrackPortfolio = () => (state: RootState) => state.analytics_v1.trackPortfolio;
export const getTrackedAddresses = () => (state: RootState) => state.analytics_v1.trackedAddresses;

export { analyticsSlice };
