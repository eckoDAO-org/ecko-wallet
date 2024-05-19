import React from 'react';
import styled from 'styled-components';
import { DivFlex } from 'src/components';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';

const Pill = styled.div`
  color: ${({ theme }) => theme.text.primary};
  border-radius: 16px;
  padding: 4px 10px;
  text-align: center;
  cursor: pointer;
  font-size: 13px;

  ${({ active }) =>
    active &&
    `
    background: #E6E6E633;
    font-weight: bold;
    outline: 1px solid #E6E6E6;
  `}
`;
export type TimeStep = '1D' | '1W' | '1M' | '1Y' | 'ALL';

export const stepsInDays: Record<TimeStep, number> = {
  '1D': 1,
  '1W': 7,
  '1M': 30,
  '1Y': 365,
  ALL: -1,
};

export const TIME_EPOCH = '2024-03-25';

interface TimeSelectorProps {
  timeSteps?: TimeStep[];
  defaultStep?: TimeStep;
  onTimeSelected?: (step: TimeStep) => void;
}

const TimeSelector = ({ timeSteps = ['1W', '1M', 'ALL'], defaultStep = '1W', onTimeSelected }: TimeSelectorProps) => {
  const { theme } = useAppThemeContext();
  const [currentStep, setCurrentStep] = React.useState<TimeStep>(defaultStep);

  const handleClick = (step: TimeStep) => () => {
    setCurrentStep(step);
    onTimeSelected?.(step);
  };

  return (
    <DivFlex justifyContent="space-between">
      {timeSteps.map((step) => (
        <Pill theme={theme} key={step} active={step === currentStep} onClick={handleClick(step)}>
          {step}
        </Pill>
      ))}
    </DivFlex>
  );
};

export default TimeSelector;
