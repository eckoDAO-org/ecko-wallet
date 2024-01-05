import styled from 'styled-components';

export const PageFullWidth = styled.div`
  color: ${({ theme }) => theme.text.primary};
`;

export const Page = styled(PageFullWidth)`
  padding: 0 20px;
`;

// TODO: replace addFooter with flex
// 70px is the height of the Footer
export const PageFullScreen = styled(PageFullWidth)`
  height: 100%;
  display: flex;
  flex-direction: column;
  ${({ addFooter }) => addFooter && 'padding-bottom: 70px'};
`;

export const Header = styled.div`
  text-align: center;
  margin: 20px 0;
`;

export const Body = styled.div`
  height: auto;
  width: 100%;
  font-size: 16px;
`;

export const BodyFullScreen = styled(Body)`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px auto;
`;

export const FooterFullScreen = styled.div`
  padding: 0 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: end;
`;
