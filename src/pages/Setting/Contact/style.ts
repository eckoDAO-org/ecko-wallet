import styled from 'styled-components';

export const ButtonAdd = styled.div`
  background: #461A57;
  border-radius: 10px;
  width: 30%;
  margin: 50px auto;
  padding: 5px 0;
  color: #ffffff;
  cursor: pointer;
  height: 44px;
`;
export const Hr = styled.hr`
  background: rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  height: 1px;
`;
export const ContactBody = styled.div`
  padding: 24px 0 40px 0;
`;

export const BoxContent = styled.div`
  margin-right: auto;
`;

export const InputMessageError = styled.p`
  margin: 0;
  letter-spacing: 1px;
  font-size: 12px;
  color: #f44336;
`;

export const TitleMessage = styled.p`
  text-align: center;
  font-size: 13px;
  color: #A187AB;
  height: 15vh;
  display: flex;
  justify-content: center;
  align-items: center;

`;

export const DeleteImageContact = styled.img`
  position: absolute;
  right: 50px;
  top: 17px;
  cursor: pointer;
`;

export const OverLay = styled.div`
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
z-index: 10;
background: rgba(0, 0, 0, 0.75);
`;
