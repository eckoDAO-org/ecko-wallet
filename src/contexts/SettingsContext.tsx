import { createContext, useContext, useState } from 'react';
import useLocalStorage from 'src/hooks/useLocalStorage';
import useIdleTimeout from 'src/hooks/useIdleTimeout';
import { CONFIG } from 'src/utils/config';
import { STORAGE_PASSWORD_KEY } from 'src/utils/storage';
import useSessionStorage from 'src/hooks/useSessionStorage';

export interface TxSettings {
  gasLimit?: number;
  gasPrice?: number;
  xChainGasStation?: string;
  xChainGasPrice?: number;
  xChainGasLimit?: number;
  xChainTTL?: number;
}

export interface SettingsContextData {
  txSettings: TxSettings;
  lockTime: number | null;
  isLocked: boolean | null;
}

interface SettingsContextValue {
  data: SettingsContextData | null;
  isLocked: boolean | null;
  setIsLocked: (isLocked: boolean) => any;
  setSettings: (value: any) => any;
  setTxSettings: (value: any) => any;
  getSettingsAsync: () => Promise<SettingsContextData>;
}

const defaultSettingsContextValue: SettingsContextData = {
  txSettings: {
    gasLimit: CONFIG.GAS_LIMIT,
    gasPrice: CONFIG.GAS_PRICE,
    xChainGasStation: CONFIG.X_CHAIN_GAS_STATION,
    xChainGasPrice: CONFIG.X_CHAIN_GAS_PRICE,
    xChainGasLimit: CONFIG.X_CHAIN_GAS_LIMIT,
    xChainTTL: CONFIG.X_CHAIN_TTL,
  },
  lockTime: null,
  isLocked: false,
};

export const SettingsContext = createContext<SettingsContextValue>({
  data: defaultSettingsContextValue,
  isLocked: false,
  setIsLocked: () => {},
  setSettings: () => {},
  setTxSettings: () => {},
  getSettingsAsync: async () => defaultSettingsContextValue,
});

export const SettingsProvider = ({ children }: any) => {
  const lastActivityTimeout = useIdleTimeout();
  const [isLocked, setIsLocked] = useState(false);
  const diff = lastActivityTimeout ? (new Date().getTime() - lastActivityTimeout) / 1000 : 0;

  const [settings, setSettings, getSettingsAsync] = useLocalStorage<SettingsContextData>('settingsV2', defaultSettingsContextValue);
  const [, , , removeAccountPassword] = useSessionStorage(STORAGE_PASSWORD_KEY, null);

  const lockWallet = () => {
    removeAccountPassword();
    setIsLocked(true);
  };

  if (settings?.lockTime && diff > settings?.lockTime && !isLocked) {
    lockWallet();
  }

  const setTxSettings = (txSettings) => {
    setSettings({
      ...settings,
      txSettings,
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        data: settings,
        isLocked: typeof isLocked === 'boolean' && isLocked,
        setIsLocked,
        setSettings,
        setTxSettings,
        getSettingsAsync,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const SettingsConsumer = SettingsContext.Consumer;

export function useSettingsContext() {
  return useContext(SettingsContext);
}
