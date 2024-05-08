import { useMemo, useState } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { useAccountBalanceChart } from 'src/hooks/analytics';
import { DivFlex } from 'src/components';
import PortfolioValueChart from '../PortfolioValueChart';
import TimeSelector, { TIME_EPOCH, TimeStep, stepsInDays } from '../TimeSelector';
import Trend from '../Trend';
import { Label } from '../UI';

const Content = styled.div`
  width: 100%;
  height: 240px;
`;

const PortfolioValueApproved = () => {
  const [step, setStep] = useState<TimeStep>('1W');
  const stepInDays = stepsInDays[step];
  const to = moment().format('YYYY-MM-DD');
  const from = stepInDays === -1 ? TIME_EPOCH : moment().subtract(stepInDays, 'days').format('YYYY-MM-DD');
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

  const onTimeSelected = (newStep: TimeStep) => {
    setStep(newStep);
  };

  return (
    <>
      <DivFlex flexDirection="row" alignItems="center" gap="12px">
        <Label>{`$ ${value}`}</Label>
        <Trend value={trendValue} isUp={lastValue > firstValue} />
      </DivFlex>
      <Content>
        <PortfolioValueChart points={points} />
      </Content>
      <TimeSelector defaultStep={step} onTimeSelected={onTimeSelected} />
    </>
  );
};

export default PortfolioValueApproved;
