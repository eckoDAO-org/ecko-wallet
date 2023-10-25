import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from 'src/stores';

interface AuthState {
    require2FA: boolean,
    totpSharedKey?: string,
}

const initialState: AuthState = {
    require2FA: false,
    totpSharedKey: undefined,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    require2FA: (state) => { state.require2FA = true; },
    unrequire2FA: (state) => { state.require2FA = false; },
    setTOTPSharedKey: (state, action: PayloadAction<string>) => { state.totpSharedKey = action.payload; },
    disable2FA: () => initialState,
  },
});

export const {
    require2FA,
    unrequire2FA,
    setTOTPSharedKey,
    disable2FA,
} = authSlice.actions;

export const is2FARequired = (state: RootState) => state.auth.totpSharedKey ? state.auth.require2FA : false;
export const hasTOTPSharedKey = (state: RootState) => !!state.auth.totpSharedKey;
export const getTOTPSharedKey = (state: RootState) => state.auth.totpSharedKey;

export { authSlice };
