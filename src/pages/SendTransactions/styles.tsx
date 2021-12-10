import styled from 'styled-components';

export const Body = styled.div`
  height: auto;
  width: 100%;
  font-family: 'Play', sans-serif;
  font-size: 16px;
  line-height: 25px;
`;

export const PageSendTransaction = styled.div`
  display: block;
`;

export const ButtonWrapper = styled.div`
  width: 100%;
  text-align: center;
  margin: 50px 0;
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 480px){
    margin: 25px 0;
  }
`;

export const InputWrapper = styled.div`
  margin-top: 22px;
`;

export const WarningText = styled.div`
  margin-top: 25px;
  text-align: center;
  font-weight: 700;
`;

export const ButtonImport = styled.button`
  width: 100%;
  height: 44px;
  font-family: 'Play', sans-serif;
  background: #461A57;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  color: #ffffff;
  font-size: 16px;
  margin: auto;
  cursor: pointer;
`;

export const Title = styled.div`
  font-weight: 700;
  font-size: ${(props) => (props.isSendTitle ? '24px' : '16px')};
  line-height: 25px;
  margin: 15px 0;
`;
export const TransactionTitle = styled.div`
  font-weight: 700;
  font-size: 20px;
  line-height: 25px;
  margin: 15px 0;
`;

export const TransactionWrapper = styled.div`
  padding: 10px 25px;
`;

export const Img = styled.img`
  height: 23px;
  width: 23px;
`;

export const ButtonScanner = styled.div`
  position: absolute;
  right: 50px;
  top: 37%;
  cursor: pointer;
`;
export const SelectLabel = styled.div`
  font-size: 15px;
  color: #461A57;
  margin: 10px 20px;
`;

export const ImgScanner = styled.img`
  height: 24px;
  width: 24px;
`;

export const ImgWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`;

export const ItemAvailable = styled.div`
  display: flex;
  /* justify-content: center; */
  margin: 10px 0 20px 31%;
`;

export const LabelMax = styled.div`
  font-weight: bold;
  color: #461A57;
  cursor: pointer;
`;

export const Label = styled.div`
  color: #461A57;
`;
export const Item = styled.div`
  display: flex;
  align-items: center;
`;
export const Error = styled.span`
  color: red;
  line-height: normal;
`;

export const FormSend = styled.div`
  color: #461A57;
  position: relative;
`;

export const LabelInputSend = styled.div`
  padding: 0px 38px 0 0;
`;
export const LabelInputChain = styled.div`
  padding: 0 78px 0 0;
`;
export const LabelInputAmount = styled.div`
  padding: 0px 84px 0 0;
`;
export const LabelInputDestination = styled.div`
  padding: 0px 10px 0 0;
`;
export const LabelInputMax = styled.div`
  padding: 0px 28px 0 0;
  width: 16%;
  text-align: initial;
`;
export const LabelInputPrice = styled.div`
  padding: 0 77px 0 0;
`;
export const LabelInputLimit = styled.div`
  padding: 0 79px 0 0;
`;
export const LabelInputPayer = styled.div`
  color: #461A57;
  width: 14%;
  text-align: initial;
  padding: 0 42px 0 0;
`;

export const FormItem = styled.div`
  display: flex;
  align-items: center;
`;
export const Warning = styled.div`
  margin-bottom: 24px;
  text-align: ${(props) => (props.isContact ? 'left' : 'center')};;
  background: #EEE6F3;;
  padding: ${(props) => (props.isContact ? '10px' : '20px 15px')};
  margin-top: ${(props) => (props.isContact ? '' : '50px')};
  cursor: ${(props) => (props.isContact ? 'pointer' : 'default')};
  color: #461A57;
  font-size: 14px;
  border: 1px solid #461A57;
  border-radius: 8px;
  display: flex;
  align-items: center;
`;
export const SelectWrapper = styled.div`
  display: ${(props) => (props.isHide ? 'none' : 'block')}
`;
export const ButtonSend = styled.button`
  width: 100%;
  height: 44px;
  background: #461A57;
  font-family: 'Play', sans-serif;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  color: #ffffff;
  font-size: 16px;
  margin: auto;
  cursor: pointer;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
  gap:10px;
`;

export const ReceiverInput = styled.div`
  position: relative;
  margin: 0 20px 20px 20px;
`;

export const Content = styled.div`
`;
export const ChainLeft = styled.div`
  width: 60px;
  text-align: center;
`;
export const ChainRight = styled.div`
  margin-left: auto;
  ${(props) => (props.isValid ? 'color: #461A57' : 'color: #c4c4c4')};
  ${(props) => (props.isValid ? 'cursor: pointer' : '')};
`;
export const TitleChain = styled.div`
  margin-left: auto;
`;
export const ContactWrapper = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid #c4c4c4;
  cursor: pointer;
`;
export const ContactItem = styled.div`
  width: 85%;
  padding: 8px 0 8px 19px;
  padding-top: ${(props) => (props.isFirst ? '18px' : '8px')};
`;
export const ContactTitle = styled.div`
  font-size: 16px;
  line-height: 25px;
  font-weight: 700;
  padding-bottom: 5px;
  @media screen and (max-width: 480px){
    width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
export const Arrow = styled.img`
  height: 16px;
  width: 9px;
  margin: 0 32px 0 auto;
`;
export const ListChainWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 20px;
`;

export const TransferWrapper = styled.div`
  padding: 5px 20px;
`;

export const GasOptions = styled.div`
  display: flex;
  justify-content: space-between;
`;
export const GasOptionsWrapper = styled.div`
  margin-top: 20px;
`;
export const ErrorWrapper = styled.div`
  margin-top: 10px;
`;
export const GasItem = styled.div`
  width: 31%;
  height: 30px;
  border-radius: 10px;
  border: 1px solid #461A57;
  background: ${(props) => (props.isActive ? '#461A57' : 'white')};
  color: ${(props) => (props.isActive ? 'white' : '#461A57')};
  font-weight: bold;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const TypeInputAccount = styled.input`
  width: 100%;
  height: 44px;
  background: #f2f2f2;
  box-sizing: border-box;
  border: none;
  :focus-visible {
    outline: none;
  }
`;
export const TypeInput = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border: 1px solid #0000002e;
  box-sizing: border-box;
  :focus-visible {
    outline: none;
  }
  font-size: 16px;
`;
export const Select = styled.select`
  width: 80%;
  height: 44px;
  left: 21px;
  top: 287px;
  border: 1px solid #0000002e;
  box-sizing: border-box;
`;
export const SelectGasPrice = styled.select`
  position: absolute;
  width: 80px;
  height: 30px;
  right: 45px;
  top: 17px;
  background: #461A57;
  border-radius: 15px;
  border: none;
  top: 53.4%;
  :focus-visible {
    outline: none;
  }
`;
export const BodyModal = styled.div`
  height: auto;
  width: 100%;
`;
export const TitleModal = styled.div`
text-align: center;
font-size: 20x;
font-weight: 700;
color: #461A57;
margin-bottom: 15px;
`;
export const DivChild = styled.div`
margin-top: 20px;
color: #461A57;
text-align: center;
`;
