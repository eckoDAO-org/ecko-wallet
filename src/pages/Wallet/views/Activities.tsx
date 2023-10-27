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
import { getLocalActivities } from 'src/utils/storage';
import PopupDetailTransaction from './PopupDetailTransaction';
import FinishTransferItem from './FinishTransferItem';

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
  const [isShowDetailTxPopup, setShowDetailTxPopup] = useState(false);
  const [activityDetails, setActivityDetails] = useState<any>({});
  const [accountActivities, setAccountActivities] = useState<LocalActivity[]>([]);
  console.log(`🚀 ~ accountActivities:`, accountActivities);

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
          .filter((a) => a.status === 'pending')
          .map((a) =>
            Pact.fetch.poll({ requestKeys: [a.reqKey] }, getApiUrl(selectedNetwork.url, selectedNetwork.networkId, a.senderChainId.toString())),
          );
        Promise.all(promises)
          .then((res) => {
            console.log(`🚀 ~ res:`, res);
          })
          .catch(() => {});
      },
      () => {
        setIsLoadData(false);
      },
    );
  }, [account, chainId, selectedNetwork.networkId]);
  if (isLoadData) return <Spinner size={10} color={theme.text?.primary} weight={2} />;

  const todayString = moment().format('DD/MM/YYYY');
  const yesterdayString = moment().subtract(1, 'days').format('DD/MM/YYYY');
  return (
    <Div>
      {Object.keys(grouped)?.length ? (
        <>
          <DivChild>
            <DivScroll>
              {grouped && grouped[todayString] && (
                <>
                  <DayLabel uppercase>Today</DayLabel>
                  {grouped[todayString].map((item) => {
                    if (!item || !item.receiverChainId) return null;
                    return (
                      <Div
                        style={{ padding: '0px 24px' }}
                        onClick={() => {
                          setShowDetailTxPopup(true);
                          setActivityDetails(item);
                        }}
                        key={item.createdTime}
                      >
                        <FinishTransferItem
                          requestKey={item.reqKey}
                          createdTime={item.createdTime}
                          value={item.amount}
                          tokenType={item.symbol?.toUpperCase() ?? 'KDA'}
                          receiver={item.receiver}
                          status={item.status}
                        />
                      </Div>
                    );
                  })}
                </>
              )}
              {grouped && grouped[yesterdayString] && (
                <>
                  <DayLabel uppercase>Yesterday</DayLabel>
                  {grouped[yesterdayString].map((item) => {
                    if (!item || !item.receiverChainId) return null;
                    return (
                      <Div
                        style={{ padding: '0px 24px' }}
                        onClick={() => {
                          setShowDetailTxPopup(true);
                          setActivityDetails(item);
                        }}
                        key={item.createdTime}
                      >
                        <FinishTransferItem
                          requestKey={item.reqKey}
                          createdTime={item.createdTime}
                          value={item.amount}
                          tokenType={item.symbol?.toUpperCase() ?? 'KDA'}
                          receiver={item.receiver}
                          status={item.status}
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
                    {grouped[date].map((item) => {
                      if (!item || !item.receiverChainId) return null;
                      return (
                        <Div
                          style={{ padding: '0px 24px' }}
                          onClick={() => {
                            setShowDetailTxPopup(true);
                            setActivityDetails(item);
                          }}
                          key={item.createdTime}
                        >
                          <FinishTransferItem
                            requestKey={item.reqKey}
                            createdTime={item.createdTime}
                            value={item.amount}
                            tokenType={item.symbol?.toUpperCase() ?? 'KDA'}
                            receiver={item.receiver}
                            status={item.status}
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
      {isShowDetailTxPopup && (
        <PopupDetailTransaction
          selectedNetwork={selectedNetwork}
          activityDetails={activityDetails}
          isOpen={isShowDetailTxPopup}
          title="Transaction Details"
          onCloseModal={() => setShowDetailTxPopup(false)}
        />
      )}
    </Div>
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
}
