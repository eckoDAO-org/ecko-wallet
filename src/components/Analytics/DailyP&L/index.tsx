import moment from 'moment';
import { useState } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, YAxis } from 'recharts';
import Spinner from 'src/components/Spinner';
import { useAppSelector } from 'src/stores/hooks';
import { getTrackedAddresses } from 'src/stores/slices/analytics';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';
import { useAccountsBalanceChart } from 'src/hooks/analytics';
import { DivFlex, SecondaryLabel } from 'src/components';
import TimeSelector, { stepsInDays, TimeStep } from '../TimeSelector';
import { LabeledContainer, SpinnerContainer } from '../UI';

const CustomTooltip = (props: any) => {
  const { active, payload, label } = props;
  if (active && payload && payload.length) {
    return (
      <div
        className="custom-tooltip"
        style={{ backgroundColor: '#000', opacity: 0.8, padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
      >
        <p className="label" style={{ margin: 0, color: 'white' }}>{`${label}`}</p>
        <p className="pnl" style={{ margin: 0, color: 'white' }}>{`$ ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const convertDataToPnL = (data) =>
  data.map((item, index) => {
    if (index === 0) {
      return { date: moment(item.date).format('D MMM'), pnl: 0 };
    }
    const pnl = item.totalUsdValue - data[index - 1].totalUsdValue;
    return { date: moment(item.date).format('D MMM'), pnl: Number(pnl.toFixed(2)) };
  });

const PnLChart = () => {
  const [interval, setInterval] = useState<TimeStep>('2W');
  const trackedAddresses = useAppSelector(getTrackedAddresses());
  const { theme } = useAppThemeContext();
  const from = moment().subtract(stepsInDays[interval], 'days').format('YYYY-MM-DD');
  const to = moment().format('YYYY-MM-DD');
  const { data: analyticsData, isFetching } = useAccountsBalanceChart(trackedAddresses, from, to);
  const data = convertDataToPnL(analyticsData ?? []);
  const firstAvailableData = data.slice(1);
  const minPnl = Math.min(...firstAvailableData.map((d) => d.pnl));
  const maxPnl = Math.max(...firstAvailableData.map((d) => d.pnl));
  return isFetching ? (
    <SpinnerContainer style={{ height: 400 }}>
      <Spinner color={theme.text.secondary} />
    </SpinnerContainer>
  ) : (
    <LabeledContainer label="DAILY P&L">
      {analyticsData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={firstAvailableData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis
              domain={[minPnl * 1.1, maxPnl * 1.1]}
              tickFormatter={(tick) => `${tick < 0 ? '-' : ''}$${Math.abs(tick.toFixed(2))}`}
              tick={{ fontSize: 12 }}
            />

            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="pnl" radius={[10, 10, 0, 0]} isAnimationActive={false}>
              {firstAvailableData.map((entry) => (
                <Cell key={`cell-${entry.date}`} fill={entry.pnl >= 0 ? '#009b10' : '#e33a3c'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <DivFlex justifyContent="center" alignItems="center" style={{ height: 200 }}>
          <SecondaryLabel>No data yet</SecondaryLabel>
        </DivFlex>
      )}
      <TimeSelector defaultStep={interval} timeSteps={['1W', '2W', '1M']} onTimeSelected={(step: TimeStep) => setInterval(step)} />
    </LabeledContainer>
  );
};

export default PnLChart;
