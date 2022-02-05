/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Pact from 'pact-lang-api';
import { useSelector } from 'react-redux';
import images from 'src/images';
import useLocalStorage from 'src/hooks/useLocalStorage';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { toast } from 'react-toastify';
import BigNumber from 'bignumber.js';
import { get } from 'lodash';
import Toast from 'src/components/Toast/Toast';
import { BUTTON_SIZE, BUTTON_TYPE } from 'src/utils/constant';
import { fetchSend, getApiUrl } from 'src/utils/chainweb';
import Button from 'src/components/Buttons';
import { getTimestamp } from 'src/utils';
import { CONFIG } from 'src/utils/config';
import { hideLoading } from 'src/stores/extensions';
import { getLocalCrossRequests, setLocalCrossRequests } from 'src/utils/storage';
import { renderTransactionInfo } from 'src/pages/SendTransactions/views/Transfer';
import FinishTransferItem from './FinishTransferItem';

const Div = styled.div`
  cursor: pointer;
`;
const DivChild = styled.div`
  margin-right: ${(props) => props.marginRight};
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize};
  font-weight: ${(props) => props.fontWeight};
  margin-top: ${(props) => props.marginTop};
`;
const DivScroll = styled.div`
  display: block;
`;
// const HeaderTitle = styled.div`
//   padding: 14px;
//   display: flex;
//   justify-content: space-between;
//   background: #f2f2f2;
// `;
const DivFlex = styled.div`
  display: flex;
  margin-top: ${(props) => props.marginTop};
`;
const TransactionInfo = styled(DivFlex)`
  justify-content: space-between;
  margin-bottom: 20px;
`;
const ActionButton = styled(DivFlex)`
  justify-content: space-between;
  gap: 5px;
`;
const Hr = styled.hr`
  height: 2px;
  background: linear-gradient(90deg, #d2ab72 0%, #b66e84 35.42%, #b2579b 64.06%, #9ee9e4 99.48%);
  transform: matrix(1, 0, 0, -1, 0, 0);
  border: none;
`;
const NoData = styled.div`
  text-align: center;
  font-size: 13px;
  color: #a187ab;
  height: 47vh;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 1024px) {
    height: 21vh;
  }
`;
const FinishTransfer = () => {
  const [isOpenFinishTransferModal, setIsOpenFinishTransferModal] = useState(false);
  const [transferDetails, setTransferDetails] = useState<any>({});
  const [toFinishCrossChainTxs, setToFinishCrossChainTxs] = useLocalStorage<string[]>('toFinishCrossChainTxs', []);
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const { account, chainId } = rootState.wallet;
  const openFinishModal = (request) => {
    setIsOpenFinishTransferModal(true);
    setTransferDetails(request);
  };
  const [isLoadData, setIsLoadData] = useState(true);
  const [crossChainRequests, setCrossChainRequest] = useState<any[]>([]);
  const [pendingFinishRequestKeys, setPendingFinishRequestKeys] = useState<string[]>([]);

  useEffect(() => {
    getLocalCrossRequests(
      selectedNetwork.networkId,
      (activities) => {
        const newActivityList = [...activities];
        newActivityList.sort((a: any, b: any) => {
          const createdDateA = new Date(a.createdTime);
          const createdDateB = new Date(b.createdTime);
          return Number(createdDateB) - Number(createdDateA);
        });
        setCrossChainRequest(newActivityList);
        setIsLoadData(false);
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
                setLocalCrossRequests(selectedNetwork.networkId, newList);
              }
            })
            .catch(() => {});
        }
      },
      () => {
        setIsLoadData(false);
      },
    );
  }, [account, chainId, selectedNetwork.networkId]);

  useEffect(() => {
    if (crossChainRequests.filter((c: any) => c.sender === account)?.length) {
      crossChainRequests
        .filter((c: any) => c.sender === account)
        .forEach((crossChainTransaction) => {
          setPendingFinishRequestKeys(toFinishCrossChainTxs || []);
          if (crossChainTransaction.status === 'success') {
            const newTxToFinish = [...(toFinishCrossChainTxs || []), crossChainTransaction.requestKey];
            setToFinishCrossChainTxs(newTxToFinish);
            setPendingFinishRequestKeys(newTxToFinish);
            getSpv(crossChainTransaction);
          }
        });
    }
  }, [crossChainRequests]);

  const renderItem = (filterCrossChain) =>
    filterCrossChain.map((request: any) => (
      <Div
        onClick={() => {
          if (request.status !== 'pending') {
            openFinishModal(request);
          }
        }}
        key={request.createdTime}
      >
        <FinishTransferItem
          src={images.wallet.iconPending}
          createdTime={request.createdTime}
          chainId={request.receiverChainId}
          value={request.amount}
          tokenType={request.symbol?.toUpperCase() || 'KDA'}
          receiver={request.receiver}
          domain={request.domain}
          status={pendingFinishRequestKeys?.includes(request.requestKey) ? 'finishing' : request.status}
        />
      </Div>
    ));

  const getSpv = (request) => {
    const { requestKey, receiverChainId: targetChainId } = request;
    const spvCmd = {
      requestKey,
      targetChainId,
    };
    Pact.fetch
      .spv(spvCmd, getApiUrl(selectedNetwork.url, selectedNetwork.networkId, request.senderChainId))
      .then((res) => {
        if (res.includes('SPV target not reachable')) {
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
        const gasStation = 'free-x-chain-gas';
        const m = Pact.lang.mkMeta(gasStation, targetChainId, CONFIG.X_CHAIN_GAS_PRICE, CONFIG.X_CHAIN_GAS_LIMIT, getTimestamp(), CONFIG.X_CHAIN_TTL);
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
      .catch(() => {
        hideLoading();
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
              const requestKeySend = res.requestKeys[0];
              const listenCmd = {
                listen: requestKeySend,
              };
              hideLoading();
              setIsOpenFinishTransferModal(false);
              onListenFinishTransaction(listenCmd, targetChainId, requestFinished);
            } else {
              hideLoading();
              toast.error(<Toast type="fail" content="Network error." />);
            }
          });
        } else {
          hideLoading();
          toast.error(<Toast type="fail" content="Network error." />);
        }
      })
      .catch(() => {
        hideLoading();
        toast.error(<Toast type="fail" content="Network error." />);
      });
  };

  const onListenFinishTransaction = (listenCmd, targetChainId, requestFinished) => {
    Pact.fetch
      .listen(listenCmd, getApiUrl(selectedNetwork.url, selectedNetwork.networkId, targetChainId))
      .then(() => {
        const newRequests = crossChainRequests.filter((request: any) => requestFinished.createdTime !== request.createdTime) || [];
        setCrossChainRequest(newRequests);
        setLocalCrossRequests(selectedNetwork.networkId, newRequests);
        setToFinishCrossChainTxs([...(toFinishCrossChainTxs?.filter((requestKey) => requestKey !== requestFinished.requestKey) ?? [])]);
        // toast.success(<Toast type="success" content="Finish transfer successfully" />);
      })
      .catch(() => {
        // onListenFinishTransaction(listenCmd, targetChainId, requestFinished);
      });
  };

  if (isLoadData) return <div />;

  const filterCrossChain = crossChainRequests.filter((c: any) => c.sender === account);

  return (
    <Div>
      {filterCrossChain && filterCrossChain.length ? (
        <>
          {/* <HeaderTitle>
              <DivFlex>
                <DivChild color="#461A57" fontSize="16px" marginRight="15px">Date</DivChild>
              </DivFlex>
              <DivChild color="#461A57" fontSize="16px">Quantity</DivChild>
            </HeaderTitle> */}
          <DivChild>
            <DivScroll>{renderItem(filterCrossChain)}</DivScroll>
          </DivChild>
        </>
      ) : (
        <NoData>You have no transactions</NoData>
      )}
      {isOpenFinishTransferModal && (
        <ModalCustom
          isOpen={isOpenFinishTransferModal}
          title="Cross Chain Transfer"
          onCloseModal={() => setIsOpenFinishTransferModal(false)}
          closeOnOverlayClick={false}
        >
          <Div>
            <DivChild marginTop="20px" color="#461A57">
              {renderTransactionInfo(transferDetails)}
              <TransactionInfo>
                <DivChild fontWeight="700">Amount</DivChild>
                <DivChild fontWeight="700">{`${transferDetails?.amount} ${transferDetails.symbol?.toUpperCase() || 'KDA'}`}</DivChild>
              </TransactionInfo>
            </DivChild>
            <Hr />
            {transferDetails.symbol === 'kda' && (
              <TransactionInfo marginTop="20px">
                <DivChild fontWeight="700">Total</DivChild>
                <DivChild fontWeight="700">
                  {transferDetails.status !== 'pending'
                    ? `${new BigNumber(
                        parseFloat(transferDetails?.amount) + parseFloat(transferDetails?.gasFee) * parseFloat(transferDetails?.gasPrice),
                      )
                        .decimalPlaces(12)
                        .toString()} KDA`
                    : 'Pending'}
                </DivChild>
              </TransactionInfo>
            )}
            <DivChild>
              <ActionButton marginTop="200px">
                <Button label="Close" onClick={() => setIsOpenFinishTransferModal(false)} type={BUTTON_TYPE.DISABLE} size={BUTTON_SIZE.FULL} />
                {/* <Button label="Finish" onClick={finishTransfer} size={BUTTON_SIZE.FULL} /> */}
              </ActionButton>
            </DivChild>
          </Div>
        </ModalCustom>
      )}
    </Div>
  );
};

export default FinishTransfer;
