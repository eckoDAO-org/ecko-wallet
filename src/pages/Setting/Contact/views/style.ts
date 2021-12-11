import styled from 'styled-components';

export const DivBody = styled.div`
  padding: 20px 0;
  position: relative;
  .css-1s2u09g-control {
    min-height: 44px;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100px 0 130px 0;
  justify-content: space-around;
`;

export const DivError = styled.div`
  margin-top: ${(props) => (props.marginTop ? props.marginTop : '5px')};
  min-height: 20px;
  @media screen and (max-width: 480px){
    min-height: 15px;
    margin-top: 5px;
  }
`;
export const ImgScaner = styled.img`
  position: absolute;
  right: 10px;
  top: 60px;
  cursor: pointer;
`;

export const ButtonImport = styled.button`
  width: 40%;
  height: 44px;
  background: #461A57;
  border-radius: 10px;
  border: none;
  font-family: 'Play', sans-serif;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  margin: 0 auto;
`;

export const DesContact = styled.div`
  word-break: break-all;
  text-align: right;
  padding-left: 40px;
`;

export const FormItemInfor = styled.div`
  display: flex;
  padding: 20px 0;
  align-items: center;
  justify-content: space-between;
`;

export const DesContactName = styled.div`
  display: block;
`;

export const LabelConatact = styled.div`
  min-width: fit-content;
`;

export const DescriptonAccountName = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 25px;
  padding: 10px 0 0 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 250px;
`;

export const ButtonEdit = styled.button`
  width: 40%;
  height: 44px;
  background: #461A57;
  border-radius: 10px;
  font-family: 'Play', sans-serif;
  border: none;
  font-weight: 700;
  color: #ffffff;
  font-size: 16px;
  margin: 0 auto;
  cursor: pointer;
`;

export const ButtonEditContact = styled.button`
  width: 70%;
  height: 44px;
  background: #f2f2f2;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  font-family: 'Play', sans-serif;
  color: #606a73;
  font-size: 16px;
  margin: 0 auto;
  cursor: pointer;
`;

export const ButtonCancel = styled.button`
  width: 40%;
  height: 44px;
  background: #f2f2f2;
  border-radius: 10px;
  border: none;
  color: #606a73;
  font-family: 'Play', sans-serif;
  font-size: 16px;
  cursor: pointer;
`;

export const ConditionWrapper = styled.div`
  position: relative;
`;

export const BodyInforConact = styled.div`
  display: block;
  color: #461A57
`;

export const BodyInfor = styled.div`
  width: 80%;
  border-radius: 15px;
  border: 1px solid #e7e7e7;
  margin: 0 auto;
  position: relative;
  top: 0;
  bottom: 0;
  left: 0;
  background: #fff;
  z-index: 100;
  overflow: hidden;
`;

export const ButtonClosedAdd = styled.div`
  position: absolute;
  right: 35px;
  top: 28px;
  cursor: pointer;
`;

export const ImgClosedAdd = styled.img`
  height: 15px;
  width: 15px;
`;

export const ButtonDelete = styled.button`
  position: absolute;
  right: 45px;
  top: 16px;
  cursor: pointer;
  border: none;
  background: none;
  font-family: 'Play', sans-serif;
`;

export const ImgDelete = styled.img`
  height: 20px;
  width: 20px;
`;

export const Body = styled.div`
  height: auto;
  font-size: 16px;
`;

export const ButtonClosedInfor = styled.div`
  position: absolute;
  top: 10px;
  right: 37px;
  cursor: pointer;
`;

export const LabelInputAmount = styled.div`
  padding: 0 0 10px 0;
`;

export const Wrapper = styled.form`
  display: block;
`;
export const TypeInput = styled.input`
  width: 100%;
  height: 44px;
  border: 1px solid #0000002e;
  box-sizing: border-box;
  padding: 0 5px;
  :focus-visible {
    outline: none;
  }
`;

export const Select = styled.select`
  width: 100%;
  height: 44px;
  border: 1px solid #0000002e;
  box-sizing: border-box;
`;
export const BodyModal = styled.div`
  height: auto;
  width: 100%;
  padding: 30px 0px;
`;
export const TitleModal = styled.div`
text-align: center;
font-size: 20px;
font-weight: 700;
color: #461A57;
margin-bottom: 10px;
`;
export const DivChild = styled.div`
margin-top: 20px;
color: #461A57;
text-align: center;
`;
export const DivChildButton = styled.div`
  margin-top: 50px;
  @media screen and (max-width: 480px){
    margin-top: 50px;
  }
`;
export const DivChildFlex = styled.div`
  margin-top: 170px;
  display: flex;
  width: 100%;
  justify-content: space-between;
  @media screen and (max-width: 480px){
    margin-top: 80px;
  }
`;
export const ItemWrapperContact = styled.div`
  margin-top: 5px;
`;
export const SelectChainConatact = styled.div`
  margin-top: 5px;
`;
