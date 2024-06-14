import { useMemo, useState } from 'react';
import moment from 'moment';
import styled from 'styled-components';
import { useAccountsBalanceChart } from 'src/hooks/analytics';
import { DivFlex } from 'src/components';
import { useAppSelector } from 'src/stores/hooks';
import { getTrackedAddresses } from 'src/stores/slices/analytics';
import PortfolioValueChart from '../PortfolioValueChart';
import TimeSelector, { TIME_EPOCH, TimeStep, stepsInDays } from '../TimeSelector';
import Trend from '../Trend';
import { Label } from '../UI';

const Content = styled.div`
  width: 100%;
  height: 240px;
`;

const PortfolioValueApproved = () => {
  const trackedAddresses = useAppSelector(getTrackedAddresses());
  const [step, setStep] = useState<TimeStep>('1W');
  const stepInDays = stepsInDays[step];
  const to = moment().format('YYYY-MM-DD');
  const from = stepInDays === -1 ? TIME_EPOCH : moment().subtract(stepInDays, 'days').format('YYYY-MM-DD');
  const { data } = useAccountsBalanceChart(trackedAddresses, from, to);

  const points = useMemo(() => data.map((item) => [new Date(item.date).getTime(), item.totalUsdValue]), [data]);

  if (points.length === 0) {
    return <span>No data available</span>;
  }

  const firstNonZeroValue = points.find(([, value]) => value > 0)?.[1];
  const lastValue = points[points.length - 1][1];
  const value = Number(lastValue.toFixed(2)).toLocaleString();

  let growingFactor = 0;
  let isUp = true;

  if (points.length > 1) {
    if (firstNonZeroValue === undefined) {
      growingFactor = 0;
      isUp = true;
    } else if (lastValue === 0) {
      growingFactor = 100;
      isUp = false;
    } else {
      growingFactor = (lastValue / firstNonZeroValue - 1) * 100;
      isUp = lastValue > firstNonZeroValue;
    }
  }

  const onTimeSelected = (newStep: TimeStep) => {
    setStep(newStep);
  };

  return (
    <>
      <DivFlex flexDirection="row" alignItems="center" gap="12px">
        <Label>{`$ ${value}`}</Label>
        <Trend value={growingFactor} isUp={isUp} />
      </DivFlex>
      <Content>
        <PortfolioValueChart points={points.sort((a, b) => b[0] - a[0])} />
      </Content>
      <TimeSelector defaultStep={step} onTimeSelected={onTimeSelected} />
    </>
  );
};

export default PortfolioValueApproved;
