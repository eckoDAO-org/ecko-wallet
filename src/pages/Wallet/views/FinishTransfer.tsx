/* eslint-disable no-console */
import { useState, useContext } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import images from 'src/images';
import { SecondaryLabel } from 'src/components';
import { CrossChainContext } from 'src/contexts/CrossChainContext';
import ModalCustom from 'src/components/Modal/ModalCustom';
import BigNumber from 'bignumber.js';
import Button from 'src/components/Buttons';
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
  transform: matrix(1, 0, 0, -1, 0, 0);
  border: none;
`;
const FinishTransfer = () => {
  const [isOpenFinishTransferModal, setIsOpenFinishTransferModal] = useState(false);
  const [transferDetails, setTransferDetails] = useState<any>({});
  const rootState = useSelector((state) => state);
  const { account } = rootState.wallet;
  const openFinishModal = (request) => {
    setIsOpenFinishTransferModal(true);
    setTransferDetails(request);
  };

  const { crossChainRequests, pendingFinishRequestKeys } = useContext(CrossChainContext);

  const renderItem = (filterCrossChain) =>
    filterCrossChain.map((request: any) => (
      <Div
        style={{ padding: '0px 24px' }}
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

  const filterCrossChain = crossChainRequests?.filter((c: any) => c.sender === account);

  return (
    <Div>
      {filterCrossChain && filterCrossChain.length ? (
        <DivChild>
          <DivScroll>{renderItem(filterCrossChain)}</DivScroll>
        </DivChild>
      ) : (
        <DivFlex marginTop="200px">
          <SecondaryLabel textCenter style={{ flex: 1 }}>
            You have no transactions
          </SecondaryLabel>
        </DivFlex>
      )}
      {isOpenFinishTransferModal && (
        <ModalCustom
          isOpen={isOpenFinishTransferModal}
          title="Cross Chain Transfer"
          onCloseModal={() => setIsOpenFinishTransferModal(false)}
          closeOnOverlayClick={false}
        >
          <Div>
            <DivChild style={{ padding: '0 20px 20px 20px' }}>
              {renderTransactionInfo(transferDetails, { borderTop: ' none', margin: '0px -20px 20px', paddingBottom: 10 })}
              <TransactionInfo>
                <DivChild fontWeight="700">Amount</DivChild>
                <DivChild fontWeight="700">{`${transferDetails?.amount} ${transferDetails.symbol?.toUpperCase() || 'KDA'}`}</DivChild>
              </TransactionInfo>
            </DivChild>
            <Hr />
            {transferDetails.symbol === 'kda' && (
              <TransactionInfo style={{ padding: 24 }}>
                <DivChild fontWeight="700">Total</DivChild>
                <DivChild fontWeight="700">
                  {transferDetails.status !== 'pending'
                    ? `${new BigNumber(
                        parseFloat(transferDetails?.amount) + parseFloat(transferDetails?.gasFee || 0) * parseFloat(transferDetails?.gasPrice || 0),
                      )
                        .decimalPlaces(12)
                        .toString()} KDA`
                    : 'Pending'}
                </DivChild>
              </TransactionInfo>
            )}
            <DivChild style={{ padding: 24 }}>
              <ActionButton marginTop="100px">
                <Button size="full" label="Close" onClick={() => setIsOpenFinishTransferModal(false)} variant="disabled" />
                {/* <Button label="Finish" onClick={finishTransfer}  /> */}
              </ActionButton>
            </DivChild>
          </Div>
        </ModalCustom>
      )}
    </Div>
  );
};

export default FinishTransfer;
