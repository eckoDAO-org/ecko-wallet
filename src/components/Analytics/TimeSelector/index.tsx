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

const steps = ['24H', '1W', '1M', '1Y', 'ALL'] as const;
type TimeStep = typeof steps[number];

interface TimeSelectorProps {
  onTimeSelected?: (step: TimeStep) => void;
}

const TimeSelector = ({ onTimeSelected }: TimeSelectorProps) => {
  const [currentStep, setCurrentStep] = React.useState<TimeStep>(steps[0]);

  const handleClick = (step: TimeStep) => () => {
    setCurrentStep(step);
    onTimeSelected?.(step);
  };

  return (
    <DivFlex justifyContent="space-between">
      {steps.map((step) => (
        <Pill key={step} active={step === currentStep} onClick={handleClick(step)}>
          {step}
        </Pill>
      ))}
    </DivFlex>
  );
};

export default TimeSelector;
