import React from 'react';
import styled from 'styled-components';
import { DivFlex } from 'src/components';

const Pill = styled.div`
  color: #E6E6E6;
  border-radius: 16px;
  padding: 4px 10px;
  text-align: center;
  cursor: pointer;
  font-size: 13px;
  
  ${({ active }) => (active && `
    background: #E6E6E633;
    font-weight: bold;
    outline: 1px solid #E6E6E6;
  `)}
`;

export const timeSteps = ['1W', '1M', 'ALL'] as const;
export type TimeStep = typeof timeSteps[number];

export const stepsInDays: Record<TimeStep, number> = {
  '1W': 7,
  '1M': 30,
  ALL: -1,
};

export const TIME_EPOCH = '2024-03-25';

interface TimeSelectorProps {
  defaultStep?: TimeStep;
  onTimeSelected?: (step: TimeStep) => void;
}

const TimeSelector = ({
  defaultStep = '1W',
  onTimeSelected,
}: TimeSelectorProps) => {
  const [currentStep, setCurrentStep] = React.useState<TimeStep>(defaultStep);

  const handleClick = (step: TimeStep) => () => {
    setCurrentStep(step);
    onTimeSelected?.(step);
  };

  return (
    <DivFlex justifyContent="space-between">
      {timeSteps.map((step) => (
        <Pill key={step} active={step === currentStep} onClick={handleClick(step)}>
          {step}
        </Pill>
      ))}
    </DivFlex>
  );
};

export default TimeSelector;
