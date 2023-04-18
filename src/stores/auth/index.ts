import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '..';

interface AuthState {
    require2FA: boolean,
}

const initialState: AuthState = {
    require2FA: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    require2FA: (state) => { state.require2FA = true; },
    unrequire2FA: (state) => { state.require2FA = false; },
  },
});

export const {
    require2FA,
    unrequire2FA,
} = authSlice.actions;

export const is2FARequired = (state: RootState) => state.auth.require2FA;

export { authSlice };
