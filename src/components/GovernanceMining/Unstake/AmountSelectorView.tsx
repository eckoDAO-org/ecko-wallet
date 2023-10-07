import React from 'react';
import styled from 'styled-components';
import { DivFlex, SecondaryLabel } from 'src/components';
import StakeView, { StakeViewProps } from '../Stake/AmountSelectorView';

const PenaltyContainer = styled(DivFlex)`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.border};
  justify-content: space-between;
`;

const PenaltyLabel = styled(SecondaryLabel)`
  color: ${({ theme }) => theme.error.color};
`;

interface UnstakeViewProps extends StakeViewProps {
  hasPositionPenalty: boolean;
  positionPenaltyPercentage: number;
  waitingTime: number;
}

const AmountSelectorView = ({
  hasPositionPenalty,
  positionPenaltyPercentage,
  waitingTime,
  ...props
}: UnstakeViewProps) => (
  <StakeView {...props}>
    {hasPositionPenalty && (
      <PenaltyContainer>
        <SecondaryLabel uppercase fontWeight={700} style={{ flex: 1 }}>
          Position Penalty
        </SecondaryLabel>

        <PenaltyLabel>
          {positionPenaltyPercentage}% - {waitingTime} left
        </PenaltyLabel>
      </PenaltyContainer>
    )}
  </StakeView>
);

export default AmountSelectorView;
