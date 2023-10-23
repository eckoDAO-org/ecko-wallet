import { Store } from '@reduxjs/toolkit';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import { setStoreWallet, storeWallet } from './slices/wallet';
import { setStoreExtensions, storeExtensions } from './slices/extensions';
import { authSlice } from './slices/auth';

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
  auth: authSlice.reducer,
});

const rootReducer = (state: any, action: any) => appReducer(state, action);

const middlewares: any[] = [];

const enhancer = composeWithDevTools(applyMiddleware(...middlewares));

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, enhancer);

export const persistor = persistStore(store);

export default store;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof appReducer>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

setStore(store);
setStoreWallet(store);
setStoreExtensions(store);
