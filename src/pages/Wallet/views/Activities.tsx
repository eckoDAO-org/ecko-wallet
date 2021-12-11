import { useState, useEffect } from 'react';
import styled from 'styled-components';
import images from 'src/images';
import { get } from 'lodash';
import Pact from 'pact-lang-api';
import { useSelector } from 'react-redux';
import { getApiUrl } from 'src/utils/chainweb';
import { setLocalActivities, getLocalActivities } from 'src/utils/storage';
import PopupDetailTransaction from './PopupDetailTransaction';
import FinishTransferItem from './FinishTransferItem';

const Div = styled.div`
  cursor: pointer;
`;
const DivChild = styled.div`
  margin-right: ${(props) => props.marginRight};
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize}
`;

const DivScroll = styled.div`
  display:block;
`;
// const HeaderTitle = styled.div`
//   padding: 14px;
//   display: flex;
//   justify-content: space-between;
//   background: #f2f2f2;
// `;
// const DivFlex = styled.div`
//   display: flex;
// `;
const NoData = styled.div`
  text-align: center;
  font-size: 13px;
  color: #A187AB;
  height: 47vh;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 1024px){
    height: 21vh;
  }
`;

const Activities = () => {
  const [isShowDetailTxPopup, setShowDetailTxPopup] = useState(false);
  const [activityDetails, setActivityDetails] = useState<any>({});
  const rootState = useSelector((state) => state);
  const { account, chainId } = rootState.wallet;
  const { selectedNetwork } = rootState.extensions;
  const [list, setList] = useState<any[]>([]);
  const [isLoadData, setIsLoadData] = useState(true);

  useEffect(() => {
    getLocalActivities(selectedNetwork.networkId, chainId, account, (activities) => {
      const newActivityList = [...activities];
      newActivityList.sort((a: any, b: any) => {
        const createdDateA = new Date(a.createdTime);
        const createdDateB = new Date(b.createdTime);
        return Number(createdDateB) - Number(createdDateA);
      });
      setList(newActivityList);
      setIsLoadData(false);
      const pendingActivities = newActivityList.filter((c: any) => c.status === 'pending');
      if (pendingActivities && pendingActivities.length > 0) {
        const chainRequest = {};
        for (let i = 0; i < pendingActivities.length; i += 1) {
          const newActivity:any = pendingActivities[i];
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
        Promise.all(promiseList).then((res) => {
          if (res && res.length > 0) {
            let result = res[0];
            if (res.length > 1) {
              for (let i = 1; i < res.length; i += 1) {
                result = { ...result, ...res[i] };
              }
            }
            const newList = newActivityList.map((activity:any) => {
              if (result[activity.requestKey]) {
                const status = get(result[activity.requestKey], 'result.status') || 'pending';
                return { ...result[activity.requestKey], ...activity, status };
              }
              return activity;
            });
            setList(newList);
            setLocalActivities(selectedNetwork.networkId, chainId, account, newList);
          }
        }).catch(() => {});
      }
    }, () => {
      setList([]);
      setIsLoadData(false);
    });
  }, [account, chainId, selectedNetwork.networkId]);
  if (isLoadData) return <div />;
  return (
    <Div>
      {
      (list && list.length) ? (
        <>
          {/* <HeaderTitle>
            <DivFlex>
              <DivChild color="#461A57" fontSize="16px" marginRight="15px">Date</DivChild>
            </DivFlex>
            <DivChild color="#461A57" fontSize="16px">Quantity</DivChild>
          </HeaderTitle> */}
          <DivChild>
            <DivScroll>
              {list.map((item) => {
                if (!item || !item.receiverChainId) return null;
                const iconUrl = images.wallet.iconPending;
                return (
                  <Div
                    onClick={() => {
                      setShowDetailTxPopup(true);
                      setActivityDetails(item);
                    }}
                    key={item.createdTime}
                  >
                    <FinishTransferItem
                      src={iconUrl}
                      createdTime={item.createdTime}
                      chainId={item.receiverChainId}
                      value={item.amount}
                      tokenType="KDA"
                      receiver={item.receiver}
                      domain={item.domain}
                      status={item.status}
                    />
                  </Div>
                );
              })}
            </DivScroll>
          </DivChild>
        </>
      ) : (
        <NoData>You have no transactions</NoData>
      )
    }
      {
      isShowDetailTxPopup && <PopupDetailTransaction selectedNetwork={selectedNetwork} activityDetails={activityDetails} isOpen={isShowDetailTxPopup} title="Transaction Details" onCloseModal={() => setShowDetailTxPopup(false)} />
      }
    </Div>
  );
};

export default Activities;
