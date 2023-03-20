/* eslint-disable no-restricted-syntax */
import { useState, createContext, useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { useInterval } from 'src/hooks/useInterval';
import { IFungibleToken, LOCAL_KEY_FUNGIBLE_TOKENS } from 'src/pages/ImportToken';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { fetchListLocal, fetchTokenList, MAINNET_NETWORK_ID } from 'src/utils/chainweb';
import { KADDEX_ANALYTICS_API } from 'src/utils/config';
import { CHAIN_COUNT } from 'src/utils/constant';
import { SettingsContext } from './SettingsContext';

interface AccountContextProps {
  selectedAccountBalance?: any;
}

const SEPARATOR = '___';

export const AccountContext = createContext<AccountContextProps>({
  selectedAccountBalance: undefined,
});

export const AccountProvider = ({ children }: any) => {
  const {
    wallet: { wallets },
    extensions: { selectedNetwork },
  } = useSelector((state) => state);

  return <AccountContext.Provider value={{}}>{children}</AccountContext.Provider>;
};

export const AccountBalanceConsumer = AccountContext.Consumer;

export function useAccountBalanceContext() {
  return useContext(AccountContext);
}
