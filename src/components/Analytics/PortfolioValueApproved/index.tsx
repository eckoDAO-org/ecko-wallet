import { useMemo } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { useAccountBalanceChart } from 'src/hooks/analytics';
import { DivFlex } from 'src/components';
import PortfolioValueChart from '../PortfolioValueChart';
import TimeSelector from '../TimeSelector';
import Trend from '../Trend';
import { Label, LabeledContainer } from '../UI';

const Container = styled.div`
  width: 100%;
  height: 240px;
`;

const PortfolioValueApproved = () => {
  const from = moment().subtract(1, 'month').format('YYYY-MM-DD');
  const to = moment().format('YYYY-MM-DD');
  const { data } = useAccountBalanceChart(from, to);

  const points = useMemo(() => (
    data.map((item) => [
      new Date(item.date).getTime(),
      item.totalUsdValue,
    ])
  ), [data]);

  if (points.length === 0) {
    return <span>No data available</span>;
  }

  const firstValue = points[0][1];
  const lastValue = points[points.length - 1][1];
  const value = Number((lastValue).toFixed(2)).toLocaleString();
  const growingFactor = ((lastValue / firstValue) - 1) * 100;
  const trendValue = points.length > 1 ? growingFactor : 0;

  return (
    <LabeledContainer label="PORTFOLIO VALUE CHART">
      <DivFlex flexDirection="row" alignItems="center" gap="12px">
        <Label>{`$ ${value}`}</Label>
        <Trend value={trendValue} isUp={lastValue > firstValue} />
      </DivFlex>
      <Container>
        <PortfolioValueChart points={points} />
      </Container>
      <TimeSelector />
    </LabeledContainer>
  );
};

export default PortfolioValueApproved;
