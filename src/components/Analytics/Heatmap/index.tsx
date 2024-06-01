import { useState, useMemo } from 'react';
import Spinner from 'src/components/Spinner';
import { Treemap, ResponsiveContainer } from 'recharts';
import { getNumberWithValidDecimals } from 'src/utils';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';
import { useDexTokensPerformance } from 'src/hooks/dexTokensPerformance';
import styled from 'styled-components';
import TimeSelector, { TimeStep } from '../TimeSelector';
import { LabeledContainer, SpinnerContainer } from '../UI';

const Container = styled.div`
  width: 100%;
  height: 450px;
  .recharts-treemap-depth-0 rect:not(.recharts-treemap-depth-1 rect) {
    fill: ${({ theme }) => theme.background} !important;
  }
`;

const CustomizedContent = (props: any) => {
  const { depth, x, y, width, height, diff, name, price } = props;

  const backgroundColor = diff >= 0 ? '#009b10' : '#e33a3c';
  const fontSize = Math.max(12, Math.min(14, width / 8, height / 8));

  return width < 20 || height < 20 ? null : (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={backgroundColor} strokeWidth={4} rx={10} ry={10} />
      {depth === 1 ? (
        <text x={x + width / 2} y={y + height / 2} textAnchor="middle" fill="white" fontSize={fontSize} fontWeight="bold" strokeWidth={0}>
          {name}
          {width > 70 && height > 70 ? (
            <tspan x={x + width / 2} dy="1.2em">
              ${getNumberWithValidDecimals(price)}
            </tspan>
          ) : null}

          <tspan x={x + width / 2} dy="1.2em">
            {diff >= 0 ? `+${diff.toFixed(2)}%` : `${diff.toFixed(2)}%`}
          </tspan>
        </text>
      ) : null}
    </g>
  );
};

const Heatmap = () => {
  const { theme } = useAppThemeContext();
  const [interval, setInterval] = useState<TimeStep>('1D');
  const { data: performanceData, isFetching } = useDexTokensPerformance(interval);
  const data = useMemo(
    () =>
      [
        ...performanceData?.tickers?.sort((tA, tB) => tB.volume - tA.volume)?.slice(0, 6),
        performanceData?.tickers.find((t) => t.ticker === 'KDA'),
      ]?.map((t) => ({ value: Math.abs(t?.diff ?? 0), name: t?.ticker, price: t?.close ?? 0, diff: t?.diff ?? 0 })),
    [performanceData],
  );
  return (
    <LabeledContainer label="HEATMAP">
      <Container>
        <ResponsiveContainer width="100%">
          {isFetching ? (
            <SpinnerContainer>
              <Spinner color={theme.text.secondary} />
            </SpinnerContainer>
          ) : (
            <Treemap
              data={data}
              dataKey="value"
              stroke={theme.background}
              fill={theme.background}
              aspectRatio={10 / 3}
              content={<CustomizedContent />}
            >
              {/* <Tooltip /> */}
            </Treemap>
          )}
        </ResponsiveContainer>
      </Container>
      <TimeSelector defaultStep="1D" timeSteps={['1D', '1M', '1Y']} onTimeSelected={(step: TimeStep) => setInterval(step)} />
    </LabeledContainer>
  );
};

export default Heatmap;
