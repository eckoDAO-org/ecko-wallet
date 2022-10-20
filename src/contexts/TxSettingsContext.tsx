import { createContext, useContext } from 'react';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { CONFIG } from 'src/utils/config';

export interface TxSettingsContextData {
  gasLimit?: number;
  gasPrice?: number;
  xChainGasStation?: string;
  xChainGasPrice?: number;
  xChainGasLimit?: number;
  xChainTTL?: number;
}

interface TxSettingsContextValue {
  data: TxSettingsContextData | null;
  // eslint-disable-next-line no-unused-vars
  setTxSettings: (value: any) => any;
  getTxSettingsAsync: () => Promise<TxSettingsContextData>;
}

const defaultSettingsContextValue: TxSettingsContextData = {
  gasLimit: CONFIG.GAS_LIMIT,
  gasPrice: CONFIG.GAS_PRICE,
  xChainGasStation: CONFIG.X_CHAIN_GAS_STATION,
  xChainGasPrice: CONFIG.X_CHAIN_GAS_PRICE,
  xChainGasLimit: CONFIG.X_CHAIN_GAS_LIMIT,
  xChainTTL: CONFIG.X_CHAIN_TTL,
};

export const TxSettingsContext = createContext<TxSettingsContextValue>({
  data: defaultSettingsContextValue,
  setTxSettings: () => {},
  getTxSettingsAsync: async () => defaultSettingsContextValue,
});

export const TxSettingsProvider = ({ children }: any) => {
  const [txSettings, setTxSettings, getTxSettingsAsync] = useLocalStorage<TxSettingsContextData>('txSettings', defaultSettingsContextValue);

  return (
    <TxSettingsContext.Provider
      value={{
        data: txSettings,
        setTxSettings,
        getTxSettingsAsync,
      }}
    >
      {children}
    </TxSettingsContext.Provider>
  );
};

export const TxSettingsConsumer = TxSettingsContext.Consumer;

export function useTxSettingsContext() {
  return useContext(TxSettingsContext);
}
