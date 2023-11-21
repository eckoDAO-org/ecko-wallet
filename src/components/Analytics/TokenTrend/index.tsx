import React from 'react';
import styled from 'styled-components';
import { DivFlex, SecondaryLabel } from 'src/components';
import Trend from './Trend';

export const Container = styled(DivFlex)`
  flex-direction: column;
  gap: 12px;
  padding: 12px 0px;
  border-bottom: 1px solid #707070;
`;

export const Icon = styled.img`
  width: 24px;
  height: 24px;
`;

export const Symbol = styled(SecondaryLabel)`
  color: ${({ theme }) => theme.text.primary};
  font-size: 14px;
  flex: 1;
`;

export interface TokenTrendProps {
  title: string;
  iconPath: string;
  symbol: string;
  value: number;
  isUp: boolean;
}

const TokenTrend = ({ title, iconPath, symbol, value, isUp }: TokenTrendProps) => (
  <Container>
    <SecondaryLabel>{title}</SecondaryLabel>
    <DivFlex flexDirection="row" alignItems="center" gap="12px">
      <Icon src={iconPath} />
      <Symbol>{symbol}</Symbol>
      <Trend value={value} isUp={isUp} />
    </DivFlex>
  </Container>
);

export default TokenTrend;
