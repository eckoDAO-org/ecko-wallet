import styled from 'styled-components';

export const BodyNetworks = styled.div`
  display: block;
`;

export const DivNetworks = styled.div`
  color: #461A57;
  padding: 18px 0;
`;

export const ButtonDeleteEdit = styled.div``;
export const DivBodyNetwork = styled.div`
  margin-bottom: 20px;
`;
export const InputNetworks = styled.input`
  width: 80%;
  height: 44px;
  background: #f2f2f2;
  box-sizing: border-box;
  border: none;
  pointer-events: none;
  font-size: 16px;
  color: #858585;
  padding: 0 15px;
  :focus-visible {
    outline: none;
  }
`;

export const InputEdit = styled.input`
  width: 80%;
  height: 44px;
  border: 1px solid #0000002e;
  box-sizing: border-box;
  padding: 0 15px;
  font-size: 16px;
  :focus-visible {
    outline: none;
  }
`;

export const LableNetworks = styled.p`
  font-weight: normal;
  font-size: 16px;
  line-height: 25px;
  color: #461A57;
  width: 25%;
`;

export const InputMessageError = styled.p`
  width: 43%;
  margin: 0 auto;
  letter-spacing: 1px;
  font-size: 12px;
  color: #f44336;
`;

export const BoxHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ImgDeleteAdd = styled.img`
  height: 20px;
  width: 20px;
  padding: 3px 40px 0 0;
  cursor: pointer;
`;

export const FormNetworks = styled.form`
  color: #461A57;
  position: relative;
  padding: 40px 0;
`;

export const FormItem = styled.div`
  display: flex;
  padding: 10px 40px;
  align-items: center;
  justify-content: space-between;
`;

export const RemoveNetworksContent = styled.div`
  padding: 20px 10px;
  text-align: center;
  font-weight: bold;
`;
export const RemoveNetworksText = styled.p`
  font-size: 25px;
  color: #461A57;
  margin-bottom: 20px;
`;

export const RemoveNetworksDes = styled.p`
  font-size: 16px;
  color: #461A57;
  margin-bottom: 100px;
`;

export const ActionButton = styled.div`
  justify-content: space-between;
  gap: 10px;
  display: flex;
  align-items: center;
`;
