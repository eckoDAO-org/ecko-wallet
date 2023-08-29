import React from 'react';
import styled from 'styled-components';
import { DivFlex } from '..';

const Container = styled.div`
  height: 31px;
`;

const Bar = styled.div`
  position: relative;
  width: 100%;
  height: 12px;
  background-color: #879BA826;
  border-radius: 10px;
  margin-top: 3px;
`;

const Value = styled(Bar)`
  position: absolute;
  width: ${({ value, maxValue }) => (value / maxValue) * 100}%;
  background: linear-gradient(90deg, #04C9E4 0%, #FA41A5 48%, #F3BD2F 100%);
  margin-top: 0px;
`;

const TickContainer = styled.div`
  position: absolute;
  left: ${({ value, maxValue }) => (value / maxValue) * 100}%;
`;

const TickLine = styled.div`
  width:  ${({ hide }) => hide ? 0 : 1}px;
  height: 18px;
  background-color: #81878F80;
  margin-top: -3px;
`;

// TODO: add Basier Square Mono font
const TickLabel = styled.div`
  margin-top: 3px;
  margin-left: ${({ align }) => {
    if (align === 'left') return 0;
    if (align === 'right') return -100;
    return -50;
  }}%;
  color: #81878F80;
  font-size: 8px;
  line-height: 10px;
`;

const Tick = ({ value, maxValue, line = true, align }: { value: number, maxValue: number, line?: boolean, align?: string }) => (
  <TickContainer value={value} maxValue={maxValue}>
    <TickLine hide={!line} />
    <TickLabel align={align}>{value}</TickLabel>
  </TickContainer>
);

const Ticks = ({ maxValue }: { maxValue: number }) => (
  <DivFlex justifyContent="space-between">
    <Tick value={0.0} maxValue={maxValue} align="left" line={false} />
    <Tick value={0.5} maxValue={maxValue} />
    <Tick value={1.0} maxValue={maxValue} />
    <Tick value={1.5} maxValue={maxValue} />
    <Tick value={2.0} maxValue={maxValue} />
    <Tick value={2.5} maxValue={maxValue} align="right" line={false} />
  </DivFlex>
);

interface VotingPowerBarProps {
  votingPower: number;
  maxValue?: number;
}

const VotingPowerBar = ({ votingPower, maxValue = 2.5 }: VotingPowerBarProps) => (
  <Container>
    <Bar>
      <Value value={votingPower} maxValue={maxValue} />
      <Ticks maxValue={maxValue} />
    </Bar>
  </Container>
);

export default VotingPowerBar;
