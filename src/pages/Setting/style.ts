import styled from 'styled-components';

export const SettingBody = styled.div`
  display: block;
  padding-top: ${(props) => props.paddingTop};
`;

export const ContentSetting = styled.div`
  padding: 20px 0 100px 0;
`;

export const Content = styled.div`
  padding: 0 20px;
  margin-top: 30px;
  display: ${(props) => (props.isHide ? 'none' : 'block')};
`;

export const TitleHeader = styled.div`
  padding: 0 20px;
  font-weight: 700;
  font-size: 24px;
  line-height: 25px;
`;
export const LockWrapper = styled.div`
  margin-left: auto;
  display: flex;
  align-items: center;
`;
export const FooterWrapper = styled.div`
  margin-top: 200px;
  padding: 0 20px;
  @media screen and (max-width: 480px) {
    margin-top: 50px;
  }
`;

export const Wrapper = styled.div`
  padding: 20px 0 15px 5px;
`;

export const ButtonBack = styled.div`
  padding: 0 20px;
`;

export const DivContent = styled.div`
  border-bottom: 1px solid #dfdfed;
  padding: 16px 20px 12px 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

export const Descripton = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 25px;
`;

export const ImageContact = styled.img`
  position: absolute;
  right: 0;
  top: 32%;
`;

export const ImageNetworks = styled.img`
  width: 9px;
  height: 16px;
`;

export const ImageAbout = styled.img`
  position: absolute;
  right: 0;
  top: 32%;
`;

export const TitleSetting = styled.div`
  font-weight: 700;
  font-size: 16px;
  line-height: 25px;

  cursor: pointer;
`;

export const BorderSetting = styled.div`
  background: #c4c4c4;
  height: 1px;
`;
