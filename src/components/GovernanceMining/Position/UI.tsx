import React from 'react';
import styled from 'styled-components';
import { DivFlex, PrimaryLabel, SecondaryLabel } from 'src/components';

const FullWidthDivFlex = styled(DivFlex)`
  width: 100%;
  text-align: right;
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
  <FullWidthDivFlex flexDirection="column" alignItems="end">
    <DivFlex flexDirection="column">
      <SecondaryLabel>POSITION</SecondaryLabel>
      <PrimaryLabel>{amount} KDX</PrimaryLabel>
    </DivFlex>
    {pending > 0 && (
      <PendingLabel>PENDING {pending} KDX</PendingLabel>
    )}
  </FullWidthDivFlex>
);

export default Position;
