import { createContext, useEffect, useContext } from 'react';
import Pact from 'pact-lang-api';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { fetchSend, getApiUrl, pollRequestKey } from 'src/utils/chainweb';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { getTimestamp } from 'src/utils';
import { SettingsContext } from './SettingsContext';

interface CrossChainContextValue {
  crossChainRequests: any[] | null;
  toFinishCrossChainTxs: any[] | null;
  pendingFinishRequestKeys: any[] | null;
  // setToFinishCrossChainTxs: (value: any) => void;
  // setPendingFinishRequestKeys: (value: any) => void;
  // setCrossChainRequest: (value: any) => void;
  getCrossChainRequestsAsync: () => Promise<any>;
}

const defaultCrossChainContextValue: CrossChainContextValue = {
  toFinishCrossChainTxs: [],
  crossChainRequests: [],
  pendingFinishRequestKeys: [],
  // setToFinishCrossChainTxs: () => {},
  // setPendingFinishRequestKeys: () => {},
  // setCrossChainRequest: () => {},
  getCrossChainRequestsAsync: async () => {},
};

export const CrossChainContext = createContext<CrossChainContextValue>(defaultCrossChainContextValue);

export const CrossChainProvider = ({ children }: any) => {
  const rootState = useSelector((state) => state);

  const { selectedNetwork } = rootState.extensions;

  const [toFinishCrossChainTxs, setToFinishCrossChainTxs, getTofinishTxhAsync] = useLocalStorage<any[]>('toFinishCrossChainTxs', []);
  const [pendingFinishRequestKeys, setPendingFinishRequestKeys] = useLocalStorage<any[]>('pendingFinishRequestKeys', []);
  const [crossChainRequests, setCrossChainRequest, getCrossChainRequestsAsync] = useLocalStorage<any[]>(
    `${selectedNetwork.networkId}.crossRequests`,
    [],
  );

  return (
    <CrossChainContext.Provider
      value={{
        toFinishCrossChainTxs,
        // setToFinishCrossChainTxs,
        pendingFinishRequestKeys,
        // setPendingFinishRequestKeys,
        crossChainRequests,
        // setCrossChainRequest,
        getCrossChainRequestsAsync,
      }}
    >
      {children}
    </CrossChainContext.Provider>
  );
};

export const CrossChainConsumer = CrossChainContext.Consumer;

export function useCrossChainContext() {
  return useContext(CrossChainContext);
}
