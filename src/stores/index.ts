import { Store } from '@reduxjs/toolkit';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { persistStore } from 'redux-persist';
import { composeWithDevTools } from 'redux-devtools-extension';
import { RootState } from './types';
import { setStoreWallet, storeWallet } from './wallet';
import { setStoreExtensions, storeExtensions } from './extensions';

let customStore: Store | undefined;

const setStore = (store: Store) => {
  customStore = store;
};

export const getStore = (): Store<RootState> => {
  if (!customStore) {
    throw new Error('Please implement setStore before using this function');
  }

  return customStore;
};

const appReducer = combineReducers({
  wallet: storeWallet.reducer,
  extensions: storeExtensions.reducer,
});

const rootReducer = (state: any, action: any) => appReducer(state, action);

const middlewares: any[] = [];

const enhancer = composeWithDevTools(applyMiddleware(...middlewares));

export const store = createStore(rootReducer, enhancer);

export const persistor = persistStore(store);

export default store;

setStore(store);
setStoreWallet(store);
setStoreExtensions(store);
