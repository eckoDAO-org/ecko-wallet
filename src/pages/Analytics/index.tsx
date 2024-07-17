import { RefObject, useRef } from 'react';
import styled from 'styled-components';
import { Header as PageHeader, PageFullScreen, BodyFullScreen } from 'src/components/Page';
import Toolbar, { AnalyticType } from 'src/components/Analytics/Toolbar';
import PnLChart from 'src/components/Analytics/DailyP&L';
// import TotalTransactions from 'src/components/Analytics/TotalTransactions';
import PortfolioValue from 'src/components/Analytics/PortfolioValue';
import { AssetAllocationChart } from 'src/components/Analytics/AssetAllocation';
import Heatmap from 'src/components/Analytics/Heatmap';
import ChartAllocation from 'src/components/Analytics/ChartAllocation';
import { AnalyticTile } from 'src/components/Analytics/UI';
import TopTokens from './TopTokens';

const Header = styled(PageHeader)`
  padding: 24px 16px;
  margin: 0;
  border: 1px solid ${({ theme }) => theme.border};
`;

const Body = styled(BodyFullScreen)`
  padding: 0 16px 24px;
  box-sizing: border-box;
`;

const Title = styled(AnalyticTile)`
  margin-top: 18px;
  font-size: 13px;
  opacity: 1;
`;

const Analytics = () => {
  const portfolioValueRef = useRef<HTMLDivElement>(null);
  const pnlChartRef = useRef<HTMLDivElement>(null);
  const chartAllocationRef = useRef<HTMLDivElement>(null);
  const assetAllocationRef = useRef<HTMLDivElement>(null);
  const heatmapRef = useRef<HTMLDivElement>(null);
  const allRefs: Record<AnalyticType, RefObject<HTMLDivElement>> = {
    [AnalyticType.portfolioValue]: portfolioValueRef,
    [AnalyticType.profitAndLoss]: pnlChartRef,
    [AnalyticType.chartAllocation]: chartAllocationRef,
    [AnalyticType.assetAllocation]: assetAllocationRef,
    [AnalyticType.heatMap]: heatmapRef,
  };

  const scrollToAnalytic = (analytic: AnalyticType) => {
    allRefs[analytic].current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <PageFullScreen addFooter>
      <Header>
        <Toolbar onLinkClick={scrollToAnalytic} />
      </Header>
      <Body>
        <Title>WALLET ANALYTICS</Title>
        <PortfolioValue ref={portfolioValueRef} />
        <PnLChart ref={pnlChartRef} />
        <ChartAllocation ref={chartAllocationRef} />
        <AssetAllocationChart ref={assetAllocationRef} />
        {/* <TotalTransactions /> */}
        <Title>DEX ANALYTICS</Title>
        <TopTokens />
        <Heatmap ref={heatmapRef} />
      </Body>
    </PageFullScreen>
  );
};

export default Analytics;
