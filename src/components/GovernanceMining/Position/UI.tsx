import React from 'react';
import styled from 'styled-components';
import { DivFlex, PrimaryLabel, SecondaryLabel } from 'src/components';
import { reduceBalance } from '../helpers/numberUtils';

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

const Position = ({ amount, pending }: PositionProps) => {
  const position = amount >= 100000 ? amount.toFixed(0) : reduceBalance(amount);

  return (
    <FullWidthDivFlex flexDirection="column" alignItems="end">
      <DivFlex flexDirection="column">
        <SecondaryLabel>POSITION</SecondaryLabel>
        <PrimaryLabel>{position} KDX</PrimaryLabel>
      </DivFlex>
      {pending > 0 && (
        <PendingLabel>PENDING {reduceBalance(pending)} KDX</PendingLabel>
      )}
    </FullWidthDivFlex>
  );
};

export default Position;
