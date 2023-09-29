import React from 'react';
import styled from 'styled-components';
import { DivFlex, PrimaryLabel, SecondaryLabel } from 'src/components';

const FullWidthDivFlex = styled(DivFlex)`
  width: 100%;
`;

const PendingLabel = styled.div`
  font-size: 12px;
  font-weight: bold;
  color: #57C2DBBF;
`;

interface PositionProps {
  amount: number;
  pending: number;
}

const Position = ({ amount, pending }: PositionProps) => (
  <FullWidthDivFlex justifyContent="center" flexDirection="column" alignItems="center">
    <SecondaryLabel>POSITION</SecondaryLabel>
    <PrimaryLabel>{amount} KDX</PrimaryLabel>
    {pending > 0 && (
      <FullWidthDivFlex justifyContent="space-between">
        <PendingLabel>PENDING</PendingLabel>
        <PendingLabel>{pending} KDX</PendingLabel>
      </FullWidthDivFlex>
    )}
  </FullWidthDivFlex>
);

export default Position;
