import React from 'react';
import styled from 'styled-components';
import { Icon, TokenTrendProps } from '../TokenTrend';
import Trend from '../TokenTrend/Trend';
import { Label, LabeledRow } from '../UI';

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

const PairTrend = ({
  title,
  firstTokenIconPath,
  secondTokenIconPath,
  firstTokenSymbol,
  secondTokenSymbol,
  value,
  isUp,
}: PairTrendProps) => (
  <LabeledRow label={title}>
    <Icon src={firstTokenIconPath} />
    <SecondIcon src={secondTokenIconPath} />
    <Label>{firstTokenSymbol}/{secondTokenSymbol}</Label>
    <Trend value={value} isUp={isUp} />
  </LabeledRow>
);

export default PairTrend;
