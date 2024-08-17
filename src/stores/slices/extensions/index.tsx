import { createSlice, PayloadAction, Store } from '@reduxjs/toolkit';
import { ACTIVE_TAB } from 'src/utils/constant';
import { RootState } from 'src/stores';

let customStore: Store | undefined;

export const setStoreExtensions = (store: Store) => {
  customStore = store;
};

const selectedNetwork: RawNetwork = {
  name: 'Mainnet',
  url: 'https://api.chainweb.com',
  explorer: 'https://explorer.chainweb.com/mainnet',
  networkId: 'mainnet01',
  isDefault: true,
  id: '0',
};
export const defaultNetworks: RawNetwork[] = [
  {
    name: 'Mainnet',
    url: 'https://api.chainweb.com',
    explorer: 'https://explorer.chainweb.com/mainnet',
    networkId: 'mainnet01',
    isDefault: true,
    id: '0',
  },
  {
    name: 'Testnet',
    url: 'https://api.testnet.chainweb.com',
    explorer: 'https://explorer.chainweb.com/testnet',
    networkId: 'testnet04',
    isDefault: true,
    id: '1',
  },
];

export interface RawNetwork {
  name: string;
  url: string;
  explorer: string;
  networkId: string;
  isDefault: boolean;
  id: string;
}
interface RawExtension {
  passwordHash: string;
  isFetching: boolean;
  isLoading: boolean;
  contacts: any[];
  recent: any[];
  selectedNetwork: RawNetwork;
  networks: RawNetwork[];
  isHaveSeedPhrase: boolean;
  isCreateSeedPhrase: boolean;
  activeTab: string;
}

const initialState: RawExtension = {
  passwordHash: '',
  isFetching: true,
  isLoading: false,
  contacts: [],
  recent: [],
  selectedNetwork,
  networks: defaultNetworks,
  isHaveSeedPhrase: false,
  isCreateSeedPhrase: false,
  activeTab: ACTIVE_TAB.HOME,
};

const storeExtensions = createSlice({
  name: 'storeExtensions',
  initialState,
  reducers: {
    setExtensionPassword: (state, action: PayloadAction<any>) => {
      const passwordHash = action.payload;
      return { ...state, passwordHash };
    },
    setIsHaveSeedPhrase: (state, action: PayloadAction<any>) => {
      const isHaveSeedPhrase = action.payload;
      return { ...state, isHaveSeedPhrase };
    },
    setIsCreateSeedPhrase: (state, action: PayloadAction<any>) => {
      const isCreateSeedPhrase = action.payload;
      return { ...state, isCreateSeedPhrase };
    },
    setActiveTab: (state, action: PayloadAction<any>) => {
      const activeTab = action.payload;
      return { ...state, activeTab };
    },
    setContacts: (state, action: PayloadAction<any>) => {
      const contacts = action.payload;
      return { ...state, contacts };
    },
    setNetworks: (state, action: PayloadAction<any>) => {
      const networks = action.payload;
      return { ...state, networks };
    },
    restoreNetworks: (state) => ({
      ...state,
      networks: [...state.networks?.filter((n) => !n.isDefault), ...defaultNetworks],
    }),
    setRecent: (state, action: PayloadAction<any>) => {
      const recent = action.payload;
      return { ...state, recent };
    },
    setSelectedNetwork: (state, action: PayloadAction<any>) => {
      const network = action.payload;
      return { ...state, selectedNetwork: network };
    },
    showLoading: (state) => ({ ...state, isLoading: true }),
    hideLoading: (state) => ({ ...state, isLoading: false }),
    hideFetching: (state) => ({ ...state, isFetching: false }),
    showFetching: (state) => ({ ...state, isFetching: true }),
  },
});

export const setExtensionPassword = (passwordHash: any) => {
  customStore && customStore.dispatch(storeExtensions.actions.setExtensionPassword(passwordHash));
};

export const setSelectedNetwork = (network: any) => {
  customStore && customStore.dispatch(storeExtensions.actions.setSelectedNetwork(network));
};

export const setContacts = (contacts: any) => {
  customStore && customStore.dispatch(storeExtensions.actions.setContacts(contacts));
};

export const setNetworks = (networks: any) => {
  customStore && customStore.dispatch(storeExtensions.actions.setNetworks(networks));
};

export const restoreNetworks = () => {
  customStore && customStore.dispatch(storeExtensions.actions.restoreNetworks());
};

export const setRecent = (recent: any) => {
  customStore && customStore.dispatch(storeExtensions.actions.setRecent(recent));
};

export const setIsHaveSeedPhrase = (isHaveSeedPhrase: any) => {
  customStore && customStore.dispatch(storeExtensions.actions.setIsHaveSeedPhrase(isHaveSeedPhrase));
};

export const setActiveTab = (activeTab: any) => {
  customStore && customStore.dispatch(storeExtensions.actions.setActiveTab(activeTab));
};

export const setIsCreateSeedPhrase = (isCreateSeedPhrase: any) => {
  customStore && customStore.dispatch(storeExtensions.actions.setIsCreateSeedPhrase(isCreateSeedPhrase));
};

export const showLoading = () => {
  customStore && customStore.dispatch(storeExtensions.actions.showLoading());
};

export const hideLoading = () => {
  customStore && customStore.dispatch(storeExtensions.actions.hideLoading());
};
export const showFetching = () => {
  customStore && customStore.dispatch(storeExtensions.actions.showFetching());
};

export const hideFetching = () => {
  customStore && customStore.dispatch(storeExtensions.actions.hideFetching());
};

export const getSelectedNetwork = (state: RootState) => state.extensions.selectedNetwork;
export const getPasswordHash = (state: RootState) => state.extensions.passwordHash;
export const getNetworks = (state: RootState) => state.extensions.networks;
export const getContacts = (state: RootState) => state.extensions.contacts;

export { storeExtensions };
