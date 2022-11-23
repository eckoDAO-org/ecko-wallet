import styled from 'styled-components';

export const ImageLock = styled.img`
  margin-right: 18px;
  width: 12px;
`;
export const DeleteImage = styled.img`
  margin-left: auto;
  width: 18px;
  height: 20px;
  cursor: pointer;
`;
export const BodyModal = styled.div`
  padding: 30px 0;
`;
export const TitleModal = styled.div`
  font-size: 20px;
  font-weight: 700;

  text-align: center;
  margin-bottom: 10px;
`;
export const DescriptionModal = styled.div`
  font-weight: normal;
  font-size: 16px;
  margin-top: 10px;
  text-align: center;
`;
export const ActionButton = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 5px;
  margin-top: 60px;
`;
export const ButtonModal = styled.button`
  height: 36px;
  width: 100%;
  background: ${(props) => props.background};
  border: ${(props) => (props.border ? props.border : 'none')};
  color: ${(props) => props.color};
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  :focus-visible {
    outline: none;
  }
`;
