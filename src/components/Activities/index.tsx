import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { groupBy } from 'lodash';
import Pact from 'pact-lang-api';
import { getApiUrl } from 'src/utils/chainweb';
import { useSelector } from 'react-redux';
import Spinner from 'src/components/Spinner';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';
import { DivFlex, SecondaryLabel } from 'src/components';
import { getLocalActivities, getPendingCrossChainRequestKey, updateLocalActivity } from 'src/utils/storage';
import { Header } from 'src/components/Header';
import PopupDetailTransaction from '../../pages/Wallet/views/PopupDetailTransaction';
import FinishTransferItem from '../../pages/Wallet/views/FinishTransferItem';

const compareByCreatedTime = (a: LocalActivity, b: LocalActivity) => {
  const timeA = moment(a.createdTime, 'ddd MMM DD YYYY HH:mm:ss ZZ');
  const timeB = moment(b.createdTime, 'ddd MMM DD YYYY HH:mm:ss ZZ');
  return timeB.unix() - timeA.unix();
};

const Div = styled.div`
  cursor: pointer;
`;
const DivChild = styled.div`
  margin-right: ${(props) => props.marginRight};
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize};
`;

const DivScroll = styled.div`
  display: block;
`;

const DayLabel = styled(SecondaryLabel)`
  display: block;
  margin-top: 24px;
  padding: 0 24px;
  font-size: 12px;
  font-weight: 700;
`;

const Activities = () => {
  const [selectedActivity, setSelectedActivity] = useState<LocalActivity | null>(null);
  const [pendingCrossChainRequestKey, setPendingCrossChainRequestKey] = useState<string[]>([]);
  const [accountActivities, setAccountActivities] = useState<LocalActivity[]>([]);

  const rootState = useSelector((state) => state);
  const { account, chainId } = rootState.wallet;
  const { selectedNetwork } = rootState.extensions;
  const { theme } = useAppThemeContext();
  const grouped = groupBy(accountActivities, (activity) => moment(new Date(activity.createdTime)).format('DD/MM/YYYY'));

  const [isLoadData, setIsLoadData] = useState(true);

  useEffect(() => {
    getLocalActivities(
      selectedNetwork.networkId,
      account,
      (activities: LocalActivity[]) => {
        setIsLoadData(false);
        setAccountActivities(activities);
        const promises = activities
          .filter((a) => a.status === 'pending' && a.requestKey !== null)
          .map((a) =>
            Pact.fetch.poll({ requestKeys: [a.requestKey] }, getApiUrl(selectedNetwork.url, selectedNetwork.networkId, a.senderChainId.toString())),
          );
        Promise.all(promises)
          .then((pollResArray: any[]) => {
            pollResArray?.forEach((pollRes) => {
              const reqKey = Object.keys(pollRes)[0];
              if (pollRes[reqKey] && pollRes[reqKey]?.result?.status === 'success') {
                const activity = activities.find((a) => a.requestKey === reqKey);
                if (activity) {
                  updateLocalActivity(selectedNetwork.networkId, account, {
                    ...activity,
                    ...pollRes[reqKey],
                    status: 'success',
                  });
                }
              }
            });
          })
          .catch(() => {});
      },
      () => {
        setIsLoadData(false);
      },
    );
    getPendingCrossChainRequestKey().then((pendingTx) => {
      if (!pendingTx) return;
      setPendingCrossChainRequestKey(pendingTx.map((tx) => tx.requestKey));
    });
  }, [account, chainId, selectedNetwork.networkId]);
  if (isLoadData) return <Spinner size={10} color={theme.text?.primary} weight={2} />;

  const todayString = moment().format('DD/MM/YYYY');
  const yesterdayString = moment().subtract(1, 'days').format('DD/MM/YYYY');
  return (
    <div>
      <Header />
      <Div>
        {Object.keys(grouped)?.length ? (
          <>
            <DivChild>
              <DivScroll>
                {grouped && grouped[todayString] && (
                  <>
                    <DayLabel uppercase>Today</DayLabel>
                    {grouped[todayString].sort(compareByCreatedTime).map((item) => {
                      if (!item || !item.receiverChainId) return null;
                      return (
                        <Div key={item.txId} style={{ padding: '0px 24px' }} onClick={() => setSelectedActivity(item)}>
                          <FinishTransferItem
                            isFinishing={pendingCrossChainRequestKey.includes(item.requestKey)}
                            createdTime={item.createdTime}
                            value={item.amount}
                            symbol={item.symbol}
                            receiver={item.receiver}
                            status={item.status}
                            isIncoming={item.direction === 'IN'}
                            module={item.module}
                          />
                        </Div>
                      );
                    })}
                  </>
                )}
                {grouped && grouped[yesterdayString] && (
                  <>
                    <DayLabel uppercase>Yesterday</DayLabel>
                    {grouped[yesterdayString].sort(compareByCreatedTime).map((item) => {
                      if (!item || !item.receiverChainId) return null;
                      return (
                        <Div style={{ padding: '0px 24px' }} onClick={() => setSelectedActivity(item)} key={item.txId}>
                          <FinishTransferItem
                            isFinishing={pendingCrossChainRequestKey.includes(item.requestKey)}
                            createdTime={item.createdTime}
                            value={item.amount}
                            symbol={item.symbol}
                            receiver={item.receiver}
                            status={item.status}
                            isIncoming={item.direction === 'IN'}
                            module={item.module}
                          />
                        </Div>
                      );
                    })}
                  </>
                )}
                {Object.keys(grouped)
                  .filter((key) => key !== yesterdayString && key !== todayString)
                  .map((date) => (
                    <React.Fragment key={date}>
                      <DayLabel uppercase>{moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY')}</DayLabel>
                      {grouped[date].sort(compareByCreatedTime).map((item) => {
                        if (!item || !item.receiverChainId) return null;
                        return (
                          <Div style={{ padding: '0px 24px' }} onClick={() => setSelectedActivity(item)} key={item.txId}>
                            <FinishTransferItem
                              isFinishing={pendingCrossChainRequestKey.includes(item.requestKey)}
                              createdTime={item.createdTime}
                              value={item.amount}
                              symbol={item.symbol}
                              receiver={item.receiver}
                              status={item.status}
                              isIncoming={item.direction === 'IN'}
                              module={item.module}
                            />
                          </Div>
                        );
                      })}
                    </React.Fragment>
                  ))}
              </DivScroll>
            </DivChild>
          </>
        ) : (
          <DivFlex marginTop="200px">
            <SecondaryLabel textCenter style={{ flex: 1 }}>
              You have no transactions
            </SecondaryLabel>
          </DivFlex>
        )}
        {selectedActivity && (
          <PopupDetailTransaction
            isFinishing={pendingCrossChainRequestKey.includes(selectedActivity.requestKey)}
            selectedNetwork={selectedNetwork}
            activityDetails={selectedActivity}
            isOpen={selectedActivity !== null}
            title="Transaction Details"
            onCloseModal={() => setSelectedActivity(null)}
          />
        )}
      </Div>
    </div>
  );
};

export default Activities;

export interface LocalActivity {
  aliasName: null | string;
  amount: string;
  continuation: any;
  createdTime: string;
  events: Event[];
  gas: number;
  gasPrice: number;
  logs: string;
  metaData: any;
  receiver: string;
  receiverChainId: string;
  reqKey: string;
  requestKey: string;
  result: any;
  sender: string;
  senderChainId: string;
  status: string;
  domain?: string;
  symbol: string;
  txId: number;
  direction?: 'IN' | 'OUT';
  module?: string;
}
