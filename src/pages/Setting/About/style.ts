import styled from 'styled-components';

export const TitleAbout = styled.div`
  font-size: 16px;
  line-height: 19px;
  padding: 30px 0 0;
`;

export const TitleVersion = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  padding: 20px 0 ;
`;

export const AboutBody = styled.div`
  color: #461A57
`;

export const TitleHeaderAbout = styled.div`
  font-weight: 700;
  font-size: 24px;
  line-height: 25px;

`;

export const TitleDesVersion = styled.div`
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
`;

export const ContentAbout = styled.div``;
export const Div = styled.div`
  padding: 0 20px;
`;
export const TitleDes = styled.div`
  color: #461A57;
  padding-bottom: 15px;
  cursor: pointer;
  font-weight: ${(props) => props.fontWeight};
  a {
    color: #461A57;
    text-decoration: none;
    :hover {
      color: #1098fc;
    }
  }
`;
