import { DivFlex } from 'src/components';
import styled from 'styled-components';

export const Body = styled.div`
  height: auto;
  width: 100%;
  font-size: 16px;
`;

export const PageConfirm = styled.div`
  font-size: 16px;
`;
export const KeyItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  align-items: center;
`;
export const KeyWrapper = styled.div`
  margin-top: 15px;
  word-break: break-all;
`;
export const KeyTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
`;
export const KeyRemove = styled.img`
  width: 14px;
  height: 14px;
  margin-left: 15px;
`;
export const AccountDetails = styled.div`
  display: flex;
  align-items: center;
`;
export const NoData = styled.div`
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
export const ItemWrapper = styled.div`
  margin-top: 15px;
`;
export const InfoWrapper = styled.div`
  padding: 24px;
`;
export const DivChildLeft = styled.div`
  /* padding: 10px 0; */
  font-weight: 700;
`;
export const SelectChain = styled.div`
  margin-top: 10px;
`;
export const LoadingTitle = styled.div`
  text-align: center;
  font-weight: 700;
  line-height: 18.75px;
  margin: ${(props) => (props.isTop ? '60px 0 0 0' : '0 0 70px 0')};
`;
export const SpinnerWrapper = styled.div`
  display: flex;
  margin: 30px 0;
  align-items: center;
  justify-content: center;
`;
export const GasFeeText = styled.div`
  margin-left: auto;
`;
export const GasFee = styled.div`
  display: flex;
  font-size: 14px;
  font-weight: 400;
  line-height: 25px;
`;
export const DivChildBreak = styled.div`
  word-break: break-all;
  font-weight: normal;
  font-size: 16px;
  line-height: 25px;
`;

export const DivChildRight = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 25px;

  word-break: break-all;
`;

export const TransactionInfo = styled.div`
  margin-bottom: 16px;
`;

export const TitleConfirm = styled.div`
  text-align: center;
  padding: 40px 0;
  font-weight: 700;
`;

export const BodyContent = styled.div`
  padding: 10px 0;
`;
export const TransferButton = styled.div`
  width: 48%;
`;

export const ButtonClosed = styled.div`
  position: absolute;
  right: 35px;
  top: 40px;
  cursor: pointer;
`;

export const ImgClosed = styled.img`
  height: 15px;
  width: 15px;
`;

export const BodyConfirm = styled.div`
  width: 90%;
  margin: 0 auto;
`;

export const LabelConfirm = styled.div``;

export const LabelBold = styled.div`
  font-weight: bold;

  ${(props) => (props.isRight ? 'margin-left: auto' : '')}
`;

export const FormItemConfirm = styled.div`
  display: flex;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 700;
  align-items: center;
  line-height: 25px;
`;
export const ButtonWrapper = styled.div`
  width: 48%;
`;

export const Hr = styled.hr`
  background-color: rgba(0, 0, 0, 0.5);
  height: 1px;
`;

export const ButtonDiv = styled.button`
  width: 152px;
  height: 44px;
  background: #f2f2f2;
  border-radius: 20px;
  border: none;
  color: #606a73;
  font-size: 16px;
  margin: 0 20px 0 0;
`;

export const EstimateGas = styled.div`
  margin-bottom: 30px;
  margin-top: 20px;
`;
export const GasFeeTitle = styled.div`
  font-size: 16px;
  line-height: 25px;

  font-weight: 700;
  margin-bottom: 10px;
`;
export const GasFeeBox = styled.div`
  background: #f2f2f2;

  padding: 10px 13px;
`;
export const GasFeeValue = styled.div`
  font-size: ${(props) => props.fontSize};
`;
export const SendTransaction = styled.div`
  font-size: 16px;
  margin: 10px 0 28px 0;
  position: relative;
`;
export const TransactionImage = styled.img`
  height: 14px;
  width: 14px;
  margin: auto;
`;
export const AddImage = styled.img`
  height: 20px;
  width: 20px;
  margin-right: 15px;
`;
export const KadenaImage = styled.img`
  height: 20px;
  width: 20px;
  padding: 0 7px;
`;
export const TooltipImage = styled.img`
  height: 20px;
  width: 20px;
  margin-left: 10px;
`;
export const TransferImage = styled.img<{ size: string; top: string; width: string }>`
  padding: 4px;
  width: 25px;
  height: 25px;
  border: 1px solid #dfdfed;
  border-radius: 50px;
`;
export const TransferName = styled.div`
  font-weight: 700;
  line-height: 25px;
`;
export const SpaceDiv = styled.div`
  margin-bottom: 10px;
`;
export const TransferHr = styled.hr`
  height: 2px;
  transform: matrix(1, 0, 0, -1, 0, 0);
  border: none;
`;

export const TransferDetails = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ImageSpace = styled.span`
  margin-left: 10px;
  display: flex;
`;

export const ImageWrapper = styled.div`
  display: flex;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
`;

export const Balance = styled.div`
  margin-left: auto;
  font-weight: 400;
`;

export const AccountTransferDetail = styled(DivFlex)`
  border-bottom: 1px solid rgb(223, 223, 237);
  border-top: 1px solid rgb(223, 223, 237);
  margin: 0 -20px 20px -20px;
  padding: 0 20px;
`;

export const AmountWrapper = styled(DivFlex)`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
  input[type='number'] {
    -moz-appearance: textfield; /* Firefox */
  }
`;
