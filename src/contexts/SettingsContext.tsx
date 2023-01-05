import { createContext, useContext } from 'react';
import useLocalStorage from 'src/hooks/useLocalStorage';
import useIdleTimeout from 'src/hooks/useIdleTimeout';
import { CONFIG } from 'src/utils/config';
import { setExpiredTime } from 'src/stores/extensions';
import { setLocalExpiredTime } from 'src/utils/storage';

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
}

interface SettingsContextValue {
  data: SettingsContextData | null;
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
};

export const SettingsContext = createContext<SettingsContextValue>({
  data: defaultSettingsContextValue,
  setSettings: () => {},
  setTxSettings: () => {},
  getSettingsAsync: async () => defaultSettingsContextValue,
});

export const SettingsProvider = ({ children }: any) => {
  const lastActivityTimeout = useIdleTimeout();

  const lockWallet = () => {
    setExpiredTime(null);
    setLocalExpiredTime(null);
  };
  const diff = lastActivityTimeout ? (new Date().getTime() - lastActivityTimeout) / 1000 : 0;

  const [settings, setSettings, getSettingsAsync] = useLocalStorage<SettingsContextData>('settingsV2', defaultSettingsContextValue);

  if (settings?.lockTime && diff > settings?.lockTime) {
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
