import React from 'react';
import styled from 'styled-components';
import { DivFlex, SecondaryLabel } from 'src/components';

export const Container = styled(DivFlex)`
  flex-direction: column;
  gap: 12px;
  padding: 12px 0px;
  border-bottom: 1px solid #707070;
`;

export type LabeledRowProps = React.PropsWithChildren<{
  label: string;
}>;

export const LabeledRow = ({ label, children }: LabeledRowProps) => (
  <Container>
    <SecondaryLabel>{label}</SecondaryLabel>
    <DivFlex flexDirection="row" alignItems="center" gap="12px">
      {children}
    </DivFlex>
  </Container>
);

export const Label = styled(SecondaryLabel)`
  color: ${({ theme }) => theme.text.primary};
  font-size: 14px;
  flex: 1;
`;
