import { createContext, useContext } from 'react';
import useLocalStorage from 'src/hooks/useLocalStorage';
import useIdleTimeout from 'src/hooks/useIdleTimeout';
import { CONFIG, XWALLET_AUTOLOCK_SECONDS } from 'src/utils/config';
import { setExpiredTime } from 'src/stores/extensions';
import { setLocalExpiredTime } from 'src/utils/storage';

export interface SettingsContextData {
  gasLimit?: number;
  gasPrice?: number;
  xChainGasStation?: string;
  xChainGasPrice?: number;
  xChainGasLimit?: number;
  xChainTTL?: number;
}

interface SettingsContextValue {
  data: SettingsContextData | null;
  // eslint-disable-next-line no-unused-vars
  setTxSettings: (value: any) => any;
  getTxSettingsAsync: () => Promise<SettingsContextData>;
}

const defaultSettingsContextValue: SettingsContextData = {
  gasLimit: CONFIG.GAS_LIMIT,
  gasPrice: CONFIG.GAS_PRICE,
  xChainGasStation: CONFIG.X_CHAIN_GAS_STATION,
  xChainGasPrice: CONFIG.X_CHAIN_GAS_PRICE,
  xChainGasLimit: CONFIG.X_CHAIN_GAS_LIMIT,
  xChainTTL: CONFIG.X_CHAIN_TTL,
};

export const SettingsContext = createContext<SettingsContextValue>({
  data: defaultSettingsContextValue,
  setTxSettings: () => {},
  getTxSettingsAsync: async () => defaultSettingsContextValue,
});

export const SettingsProvider = ({ children }: any) => {
  const lastActivityTimeout = useIdleTimeout();

  const lockWallet = () => {
    setExpiredTime(null);
    setLocalExpiredTime(null);
  };
  const diff = lastActivityTimeout ? (new Date().getTime() - lastActivityTimeout) / 1000 : 0;

  if (diff > XWALLET_AUTOLOCK_SECONDS) {
    lockWallet();
  }

  const [txSettings, setTxSettings, getTxSettingsAsync] = useLocalStorage<SettingsContextData>('txSettings', defaultSettingsContextValue);

  return (
    <SettingsContext.Provider
      value={{
        data: txSettings,
        setTxSettings,
        getTxSettingsAsync,
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
