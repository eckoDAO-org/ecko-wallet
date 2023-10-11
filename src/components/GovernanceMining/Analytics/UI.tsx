import React from 'react';
import styled from 'styled-components';
import { SecondaryLabel } from 'src/components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  align-items: center;
  letter-spacing: 1.2px;
  margin: 24px;
`;

export const Key = styled(SecondaryLabel)`
  text-transform: uppercase;
  line-height: 15px;
  justify-self: start;
  grid-column: 1;
`;

export type ValueProps = {
  primaryLabel: string;
  secondaryLabel?: string;
};

export const Value = ({ primaryLabel, secondaryLabel = '' }: ValueProps) => (
  <ValueContainer>
    <PrimaryValue>{primaryLabel}</PrimaryValue>
    <SecondaryValue>{secondaryLabel}</SecondaryValue>
  </ValueContainer>
);

const ValueContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
`;

const PrimaryValue = styled(SecondaryLabel)`
  color: ${({ theme }) => theme.text.primary};
  line-height: 15px;
  grid-column: 2;
`;

const SecondaryValue = styled(SecondaryLabel)`
  font-size: 10px;
`;
