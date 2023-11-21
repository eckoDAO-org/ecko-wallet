import React from 'react';
import styled from 'styled-components';
import { DivFlex, SecondaryLabel } from 'src/components';
import { Container, Icon, Symbol, TokenTrendProps } from '../TokenTrend';
import Trend from '../TokenTrend/Trend';

export const SecondIcon = styled(Icon)`
  margin-left: -19px;
`;

export interface PairTrendProps {
  title: TokenTrendProps['title'];
  firstTokenIconPath: TokenTrendProps['iconPath'];
  secondTokenIconPath: TokenTrendProps['iconPath'];
  firstTokenSymbol: TokenTrendProps['symbol'];
  secondTokenSymbol: TokenTrendProps['symbol'];
  value: number;
  isUp: boolean;
}

const PairTrend = ({ title, firstTokenIconPath, secondTokenIconPath, firstTokenSymbol, secondTokenSymbol, value, isUp }: PairTrendProps) => (
  <Container>
    <SecondaryLabel>{title}</SecondaryLabel>
    <DivFlex flexDirection="row" alignItems="center" gap="12px">
      <Icon src={firstTokenIconPath} />
      <SecondIcon src={secondTokenIconPath} />
      <Symbol>{firstTokenSymbol}/{secondTokenSymbol}</Symbol>
      <Trend value={value} isUp={isUp} />
    </DivFlex>
  </Container>
);

export default PairTrend;
