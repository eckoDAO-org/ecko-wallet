import ModalCustom from 'src/components/Modal/ModalCustom';
import { convertTowCharacters } from 'src/utils';
import images from 'src/images';
import { get } from 'lodash';
import styled from 'styled-components';
import BigNumber from 'bignumber.js';
import Button from 'src/components/Buttons';
import { BUTTON_SIZE } from 'src/utils/constant';
import { renderTransactionInfo } from 'src/pages/SendTransactions/views/Transfer';

const DetailTx = styled.div`
  padding: 15px 0 10px 0;
`;
const Item = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;
const DivChild = styled.div`
  color: #461a57;
  font-size: ${(props) => props.fontSize};
  font-weight: ${(props) => props.fontWeight};
  margin: ${(props) => props.margin};
  padding: ${(props) => props.padding};
`;
const CustomDiv = styled(DivChild)`
  color: #461a57;
  font-weight: bold;
`;
const Total = styled.div`
  display: flex;
  justify-content: space-between;
  color: #461a57;
  font-weight: 700;
  margin-top: 20px;
  margin-bottom: 50px;
`;
const Hr = styled.hr`
  height: 2px;
  background: linear-gradient(90deg, #d2ab72 0%, #b66e84 35.42%, #b2579b 64.06%, #9ee9e4 99.48%);
  transform: matrix(1, 0, 0, -1, 0, 0);
  border: none;
`;
const Image = styled.img<{ size: string; top: string; width: string }>`
  height: ${($props) => $props.size};
  width: ${($props) => ($props.width ? $props.width : $props.size)};
  margin: auto;
`;
const ActivityLog = styled.div`
  margin-top: 20px;
`;
const ActivityDetail = styled.div`
  margin-left: 10px;
`;
const DetailItem = styled.div`
  border-left: ${(props) => props.borderLeft && '1px solid #461A57'};
  position: relative;
`;
const TxStepText = styled(DivChild)``;
const ImageBox = styled.div`
  position: absolute;
  top: 0;
  left: -10px;
  display: flex;
  background-color: white;
  border-radius: 50%;
`;

const convertedDateString = (newTime) => {
  const year = newTime.getFullYear();
  const month = convertTowCharacters(newTime.getMonth() + 1);
  const day = convertTowCharacters(newTime.getDate());
  const hours = convertTowCharacters(newTime.getHours());
  const minutes = convertTowCharacters(newTime.getMinutes());
  const second = convertTowCharacters(newTime.getSeconds());
  return `${day}/${month}/${year} - ${hours}:${minutes}:${second}`;
};
const PopupDetailTransaction = (props: Props) => {
  const { isOpen, onCloseModal, closeOnOverlayClick, title, showCloseIcon, activityDetails, selectedNetwork } = props;
  const openTransactionDetails = () => {
    (window as any).chrome.tabs.create({ url: `${selectedNetwork.explorer}/tx/${activityDetails.requestKey}` });
  };
  const gasFee = Number(activityDetails.gas) * Number(activityDetails.gasPrice);
  const total = gasFee + Number(activityDetails.amount);
  const newTime = new Date(activityDetails.createdTime);
  const status = get(activityDetails, 'result.status');
  const finishDate = get(activityDetails, 'metaData.blockTime');
  const finishDateValue = new Date(finishDate / 1000);
  const isSameChain = activityDetails.receiverChainId.toString() === activityDetails.senderChainId.toString();
  const isPending = activityDetails.status === 'pending';
  let statusText = 'Pending';
  if (!isPending) {
    if (status === 'success') {
      statusText = isSameChain ? 'Completed' : 'Success - Cross chain transfer';
    } else {
      statusText = 'Failed';
    }
  }
  return (
    <ModalCustom isOpen={isOpen} onCloseModal={onCloseModal} closeOnOverlayClick={closeOnOverlayClick} title={title} showCloseIcon={showCloseIcon}>
      <DetailTx>
        {renderTransactionInfo(activityDetails)}
        <Item>
          <DivChild fontWeight="700">Status</DivChild>
          <CustomDiv fontSize="14px" fontWeight="700">
            {statusText}
          </CustomDiv>
        </Item>
        <Item>
          <DivChild fontWeight="700">Symbol</DivChild>
          <DivChild fontWeight="700">{activityDetails?.symbol?.toUpperCase() ?? 'KDA'}</DivChild>
        </Item>
        <Item>
          <DivChild fontWeight="700">Quantity</DivChild>
          <DivChild fontWeight="700">{new BigNumber(activityDetails?.amount).decimalPlaces(12).toString()}</DivChild>
        </Item>
        <Item>
          <DivChild>Gas Fee</DivChild>
          <DivChild>{isPending ? 'Pending' : new BigNumber(gasFee).decimalPlaces(12).toString()}</DivChild>
        </Item>
      </DetailTx>
      <Hr />
      {(activityDetails.symbol || 'kda') === 'kda' && (
        <Total>
          <DivChild>Total</DivChild>
          <DivChild>{isPending ? 'Pending' : `${new BigNumber(total).decimalPlaces(12).toString()} KDA`}</DivChild>
        </Total>
      )}
      <Item>
        <Button size={BUTTON_SIZE.FULL} onClick={openTransactionDetails} label="View Details" />
      </Item>
      <ActivityLog>
        <DivChild margin="0 0 10px 0" fontSize="16px" fontWeight={700}>
          Activity Log
        </DivChild>
        <ActivityDetail>
          <DetailItem borderLeft>
            <TxStepText padding={`0 0 ${isPending ? '0' : '20px'} 20px`}>
              {convertedDateString(newTime)}
              <br />
              {`Transaction created with a Value of ${activityDetails?.amount} ${activityDetails?.symbol?.toUpperCase() || 'KDA'}`}
            </TxStepText>
            <ImageBox>
              <Image src={images?.wallet?.addGray} alt="icon-add" />
            </ImageBox>
          </DetailItem>
        </ActivityDetail>
        {!isPending && (
          <ActivityDetail>
            <DetailItem>
              <TxStepText padding="0 0 20px 20px">
                {convertedDateString(finishDateValue)}
                <br />
                Transaction confirmed
              </TxStepText>
              <ImageBox>
                <Image src={images?.wallet?.checkedGray} alt="check-box" />
              </ImageBox>
            </DetailItem>
          </ActivityDetail>
        )}
      </ActivityLog>
    </ModalCustom>
  );
};
type Props = {
  isOpen: boolean;
  onCloseModal?: any;
  closeOnOverlayClick?: boolean;
  title?: string;
  showCloseIcon?: boolean;
  activityDetails: any;
  selectedNetwork: any;
};
export default PopupDetailTransaction;
