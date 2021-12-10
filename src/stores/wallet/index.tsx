import { createSlice, PayloadAction, Store } from '@reduxjs/toolkit';

interface RawWallet {
  chainId: string | number;
  account: string;
  publicKey: string;
  secretKey: string;
  connectedSites: string[];
}
interface Wallet {
  chainId: string | number;
  balance: number;
  account: string;
  publicKey: string;
  secretKey: string;
  wallets: RawWallet[];
  connectedSites: string[];
}

let customStore: Store | undefined;

export const setStoreWallet = (store: Store) => {
  customStore = store;
};

const initialState:Wallet = {
  chainId: '0',
  balance: 0,
  account: '',
  publicKey: '',
  secretKey: '',
  wallets: [],
  connectedSites: [],
};

const storeWallet = createSlice({
  name: 'storeWallet',
  initialState,
  reducers: {
    setCurrentWallet: (state, action: PayloadAction<any>) => ({
      ...state,
      chainId: action.payload.chainId,
      account: action.payload.account,
      publicKey: action.payload.publicKey,
      secretKey: action.payload.secretKey,
      connectedSites: action.payload.connectedSites,
    }),
    setWallets: (state, action: PayloadAction<any>) => ({
      ...state,
      wallets: action.payload,
    }),
    setBalance: (state, action: PayloadAction<any>) => ({
      ...state,
      balance: action.payload,
    }),
  },
});

export const setCurrentWallet = (wallet: any) => {
  customStore && customStore.dispatch(storeWallet.actions.setCurrentWallet(wallet));
};
export const setWallets = (wallets: any) => {
  customStore && customStore.dispatch(storeWallet.actions.setWallets(wallets));
};
export const setBalance = (balance: any) => {
  customStore && customStore.dispatch(storeWallet.actions.setBalance(balance));
};
export { storeWallet };
