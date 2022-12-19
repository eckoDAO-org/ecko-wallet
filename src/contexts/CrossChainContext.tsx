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
  setToFinishCrossChainTxs: (value: any) => void;
  setPendingFinishRequestKeys: (value: any) => void;
  setCrossChainRequest: (value: any) => void;
  getCrossChainRequestsAsync: () => Promise<any>;
}

const defaultCrossChainContextValue: CrossChainContextValue = {
  toFinishCrossChainTxs: [],
  crossChainRequests: [],
  pendingFinishRequestKeys: [],
  setToFinishCrossChainTxs: () => {},
  setPendingFinishRequestKeys: () => {},
  setCrossChainRequest: () => {},
  getCrossChainRequestsAsync: async () => {},
};

export const CrossChainContext = createContext<CrossChainContextValue>(defaultCrossChainContextValue);

export const CrossChainProvider = ({ children }: any) => {
  const rootState = useSelector((state) => state);

  const { data: settings } = useContext(SettingsContext);
  const txSettings = settings?.txSettings;
  const { selectedNetwork } = rootState.extensions;
  const { account, chainId } = rootState.wallet;

  const [toFinishCrossChainTxs, setToFinishCrossChainTxs, getTofinishTxhAsync] = useLocalStorage<any[]>('toFinishCrossChainTxs', []);
  const [pendingFinishRequestKeys, setPendingFinishRequestKeys] = useLocalStorage<any[]>('pendingFinishRequestKeys', []);
  const [crossChainRequests, setCrossChainRequest, getCrossChainRequestsAsync] = useLocalStorage<any[]>(
    `${selectedNetwork.networkId}.crossRequests`,
    [],
  );

  useEffect(() => {
    if (crossChainRequests?.filter((c: any) => c.sender === account)?.length) {
      crossChainRequests
        .filter((c: any) => c.sender === account)
        .forEach(async (crossChainTransaction) => {
          const toFinishTxs = await getTofinishTxhAsync();
          setPendingFinishRequestKeys(toFinishTxs);
          if (crossChainTransaction.status === 'success') {
            const newTxToFinish = [...(toFinishTxs || []), crossChainTransaction.requestKey];
            setToFinishCrossChainTxs(newTxToFinish);
            setPendingFinishRequestKeys(newTxToFinish);
            getSpv(crossChainTransaction);
          }
        });
    }
  }, [crossChainRequests]);

  useEffect(() => {
    if (crossChainRequests) {
      const newActivityList = [...crossChainRequests];
      newActivityList.sort((a: any, b: any) => {
        const createdDateA = new Date(a.createdTime);
        const createdDateB = new Date(b.createdTime);
        return Number(createdDateB) - Number(createdDateA);
      });
      setCrossChainRequest(newActivityList);
      const pendingActivities = newActivityList.filter((c: any) => c.status === 'pending' && c.sender === account);
      if (pendingActivities && pendingActivities.length > 0) {
        const chainRequest = {};
        for (let i = 0; i < pendingActivities.length; i += 1) {
          const newActivity: any = pendingActivities[i];
          if (!chainRequest[newActivity.senderChainId] || chainRequest[newActivity.senderChainId].length < 1) {
            chainRequest[newActivity.senderChainId] = [];
          }
          chainRequest[newActivity.senderChainId].push(newActivity.requestKey);
        }
        const promiseList: any[] = [];
        const dataArr = Object.keys(chainRequest);
        for (let i = 0; i < dataArr.length; i += 1) {
          const newChainId = dataArr[i];
          const cmd = {
            requestKeys: chainRequest[newChainId],
          };
          const item = Pact.fetch.poll(cmd, getApiUrl(selectedNetwork.url, selectedNetwork.networkId, newChainId.toString()));
          promiseList.push(item);
        }
        Promise.all(promiseList)
          .then((res) => {
            if (res && res.length > 0) {
              let result = res[0];
              if (res.length > 1) {
                for (let i = 1; i < res.length; i += 1) {
                  result = { ...result, ...res[i] };
                }
              }
              const newList = newActivityList.map((activity: any) => {
                if (result[activity.requestKey]) {
                  const status = get(result[activity.requestKey], 'result.status') || 'pending';
                  const gasFee = get(result[activity.requestKey], 'gas') || 0;
                  return {
                    ...result[activity.requestKey],
                    ...activity,
                    status,
                    gasFee,
                  };
                }
                return activity;
              });
              setCrossChainRequest(newList);
            }
          })
          .catch(() => {});
      }
    }
  }, [account, chainId, selectedNetwork.networkId]);

  const getSpv = (request) => {
    const { requestKey, receiverChainId: targetChainId } = request;
    const spvCmd = {
      requestKey,
      targetChainId,
    };
    Pact.fetch
      .spv(spvCmd, getApiUrl(selectedNetwork.url, selectedNetwork.networkId, request.senderChainId))
      .then((res) => {
        if (res.includes('SPV target not reachable') || res.includes('Transaction hash not found')) {
          console.log('SPV target not reachable');
          setTimeout(() => {
            getSpv(request);
          }, 10000);
          return;
        }
        if (res.includes(' ')) {
          toast.error(<Toast type="fail" content={res} />);
          return;
        }
        const proof = res;
        const pactId = requestKey.length === 44 ? requestKey.slice(0, 43) : requestKey;
        const host = getApiUrl(selectedNetwork.url, selectedNetwork.networkId, targetChainId);
        const gasStation = txSettings?.xChainGasStation;
        const m = Pact.lang.mkMeta(
          gasStation,
          targetChainId,
          txSettings?.xChainGasPrice,
          txSettings?.xChainGasLimit,
          getTimestamp(),
          txSettings?.xChainTTL,
        );
        const cmd = {
          type: 'cont',
          keyPairs: [],
          pactId,
          rollback: false,
          step: 1,
          meta: m,
          proof,
          networkId: selectedNetwork.networkId,
        };
        const c = Pact.simple.cont.createCommand(
          cmd.keyPairs,
          undefined,
          cmd.step,
          cmd.pactId,
          cmd.rollback,
          undefined,
          cmd.meta,
          cmd.proof,
          cmd.networkId,
        );
        finishCrossChain(c, host, targetChainId, request);
      })
      .catch((err) => {
        console.log('SPV err', err);
        setTimeout(() => {
          getSpv(request);
        }, 10000);
      });
  };

  const finishCrossChain = (cmd, host, targetChainId, requestFinished) => {
    fetchSend(cmd, host)
      .then((data) => {
        if (data.ok) {
          data.json().then((res) => {
            if (res && res.requestKeys) {
              onListenFinishTransaction(res.requestKeys[0], targetChainId, requestFinished);
            } else {
              toast.error(<Toast type="fail" content="Network error." />);
            }
          });
        } else {
          toast.error(<Toast type="fail" content="Network error." />);
        }
      })
      .catch(() => {
        toast.error(<Toast type="fail" content="Network error." />);
      });
  };

  const onListenFinishTransaction = async (reqKey, targetChainId, requestFinished) => {
    const pollRes = await pollRequestKey(reqKey, getApiUrl(selectedNetwork.url, selectedNetwork.networkId, targetChainId));
    if (pollRes) {
      const status = pollRes?.result?.status;
      if (status === 'success' || (pollRes?.result.error?.message && pollRes?.result.error?.message?.indexOf('resumePact: pact completed') > -1)) {
        const newRequests = crossChainRequests?.filter((request: any) => requestFinished.createdTime !== request.createdTime) || [];
        setCrossChainRequest(newRequests);
        const toFinishTxs = await getTofinishTxhAsync();
        setPendingFinishRequestKeys([...(pendingFinishRequestKeys?.filter((requestKey) => requestKey !== requestFinished.requestKey) ?? [])]);
        setToFinishCrossChainTxs([...(toFinishTxs?.filter((requestKey) => requestKey !== requestFinished.requestKey) ?? [])]);
      } else if (status === 'failure') {
        toast.error(<Toast type="fail" content="Finish cross transfer Fail" />);
      }
    } else {
      // toast.error(<Toast type="fail" content="Finish cross transfer Fail" />);
    }
  };

  return (
    <CrossChainContext.Provider
      value={{
        toFinishCrossChainTxs,
        setToFinishCrossChainTxs,
        pendingFinishRequestKeys,
        setPendingFinishRequestKeys,
        crossChainRequests,
        setCrossChainRequest,
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
