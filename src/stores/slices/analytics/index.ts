import { Dictionary, PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/stores';

export interface Analytics {
  trackPortfolio: boolean;
}

export type AnalyticsState = Dictionary<Analytics>;

const initialState: AnalyticsState = {};

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    startTrackPortfolio(state, action: PayloadAction<string>) {
      const address = action.payload;

      state[address] = {
        ...state[address],
        trackPortfolio: true,
      };
    },

    stopTrackPortfolio(state, action: PayloadAction<string>) {
      const address = action.payload;

      state[address] = {
        ...state[address],
        trackPortfolio: false,
      };
    },
  },
});

export const { startTrackPortfolio, stopTrackPortfolio } = analyticsSlice.actions;

export const canTrackPortfolio = (address: string) => (state: RootState) => !!state.analytics[address]?.trackPortfolio;

export { analyticsSlice };
