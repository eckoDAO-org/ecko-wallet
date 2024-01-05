import React from 'react';
import styled from 'styled-components';
import { Header as PageHeader, PageFullScreen, BodyFullScreen } from 'src/components/Page';
import Toolbar from 'src/components/Analytics/Toolbar';
import TotalTransactions from 'src/components/Analytics/TotalTransactions';
import PortfolioValue from 'src/components/Analytics/PortfolioValue';
import TopTokens from './TopTokens';

const Header = styled(PageHeader)`
  padding: 24px 16px;
  margin: 0;
  border: 1px solid ${({ theme }) => theme.border};
`;

const Body = styled(BodyFullScreen)`
  padding: 24px 16px;
  box-sizing: border-box;
`;

const Analytics = () => (
  <PageFullScreen addFooter>
    <Header>
      <Toolbar />
    </Header>
    <Body>
      <TopTokens />
      <TotalTransactions />
      <PortfolioValue />
    </Body>
  </PageFullScreen>
);

export default Analytics;
