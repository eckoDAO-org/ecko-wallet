import styled from 'styled-components';
import { DivFlex } from 'src/components';
import images from 'src/images';

const Icon = styled.img`
  cursor: pointer;
  width: 32px;
  height: 32px;
`;

export enum AnalyticType {
  portfolioValue,
  profitAndLoss,
  chartAllocation,
  assetAllocation,
  topTokens,
  heatMap,
}

interface ToolbarProps {
  onLinkClick?: (link: AnalyticType) => void;
}

const Toolbar = ({ onLinkClick }: ToolbarProps) => {
  const toggleFilterValue = (analytic: AnalyticType) => () => {
    onLinkClick?.(analytic);
  };

  return (
    <DivFlex flexDirection="row" gap="8px">
      <Icon src={images.analytics.valuechart} onClick={toggleFilterValue(AnalyticType.portfolioValue)} />
      <Icon src={images.analytics.profitAndLoss} onClick={toggleFilterValue(AnalyticType.profitAndLoss)} />
      <Icon src={images.analytics.piechart} onClick={toggleFilterValue(AnalyticType.chartAllocation)} />
      <Icon src={images.analytics.assetAllocation} onClick={toggleFilterValue(AnalyticType.assetAllocation)} />
      <Icon src={images.analytics.topTokens} onClick={toggleFilterValue(AnalyticType.topTokens)} />
      <Icon src={images.analytics.heatmap} onClick={toggleFilterValue(AnalyticType.heatMap)} />
    </DivFlex>
  );
};

export default Toolbar;
