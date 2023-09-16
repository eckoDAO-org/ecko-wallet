import React from 'react';
import { DivFlex, PrimaryLabel, SecondaryLabel } from 'src/components';

interface PositionProps {
  amount: number;
}

const Position = ({ amount }: PositionProps) => (
  <DivFlex justifyContent="center" flexDirection="column" alignItems="center">
    <SecondaryLabel>POSITION</SecondaryLabel>
    <PrimaryLabel>{amount} KDX</PrimaryLabel>
  </DivFlex>
);

export default Position;
