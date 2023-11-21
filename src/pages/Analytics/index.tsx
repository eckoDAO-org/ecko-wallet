import React from 'react';
import styled from 'styled-components';
import { Header as PageHeader, PageFullScreen, BodyFullScreen } from 'src/components/Page';
import images from 'src/images';
import Toolbar from 'src/components/Analytics/Toolbar';
import TokenTrend from 'src/components/Analytics/TokenTrend';
import TotalTransactions from 'src/components/Analytics/TotalTransactions';
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
  <PageFullScreen>
    <Header>
      <Toolbar />
    </Header>
    <Body>
      <TopTokens />
      <TotalTransactions />
    </Body>
  </PageFullScreen>
);

export default Analytics;
