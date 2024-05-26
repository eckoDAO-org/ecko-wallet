import styled from 'styled-components';
import { /* Header as PageHeader, */ PageFullScreen, BodyFullScreen } from 'src/components/Page';
// import Toolbar from 'src/components/Analytics/Toolbar';
import PnLChart from 'src/components/Analytics/DailyP&L';
// import TotalTransactions from 'src/components/Analytics/TotalTransactions';
import PortfolioValue from 'src/components/Analytics/PortfolioValue';
import { AssetAllocationChart } from 'src/components/Analytics/AssetAllocation';
import Heatmap from 'src/components/Analytics/Heatmap';
import TopTokens from './TopTokens';

/* const Header = styled(PageHeader)`
  padding: 24px 16px;
  margin: 0;
  border: 1px solid ${({ theme }) => theme.border};
`; */

const Body = styled(BodyFullScreen)`
  padding: 0 16px 24px;
  box-sizing: border-box;
`;

const Analytics = () => (
  <PageFullScreen addFooter>
    {/* <Header>
      <Toolbar />
    </Header> */}
    <Body>
      <TopTokens />
      {/* <TotalTransactions /> */}
      <PortfolioValue />
      <Heatmap />
      <PnLChart />
      <AssetAllocationChart />
    </Body>
  </PageFullScreen>
);

export default Analytics;
