import styled from 'styled-components';

export const PageFullWidth = styled.div`
  color: ${({ theme }) => theme.text.primary};
`;

export const Page = styled(PageFullWidth)`
  padding: 0 20px;
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

export const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 20px auto;
`;
