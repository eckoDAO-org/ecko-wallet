import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { DivFlex, SecondaryLabel } from 'src/components';

export const Container = styled(DivFlex)`
  flex-direction: column;
  gap: 12px;
  padding: 12px 0px;
  border-bottom: 1px solid #707070;
`;

export const AnalyticTile = styled(SecondaryLabel)`
  font-size: 12px;
  text-transform: uppercase;
  opacity: 0.75;
`;

export type LabeledContainerProps = React.PropsWithChildren<{
  label: React.ReactNode;
}>;

export const LabeledRow = ({ label, children }: LabeledContainerProps) => (
  <LabeledContainer label={label}>
    <DivFlex flexDirection="row" alignItems="center" gap="12px">
      {children}
    </DivFlex>
  </LabeledContainer>
);

export const LabeledContainer = forwardRef<HTMLDivElement, LabeledContainerProps>(({ label, children }, ref) => (
  <Container ref={ref}>
    <AnalyticTile>{label}</AnalyticTile>
    {children}
  </Container>
));

export const Label = styled(SecondaryLabel)`
  color: ${({ theme }) => theme.text.primary};
  font-size: 14px;
  flex: 1;
`;

export const SpinnerContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
