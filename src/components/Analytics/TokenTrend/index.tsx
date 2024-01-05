import React from 'react';
import styled from 'styled-components';
import { DivFlex } from 'src/components';
import Trend from '../Trend';
import { Label, LabeledRow } from '../UI';

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

export interface TokenTrendProps {
  title: string;
  iconPath: string;
  symbol: string;
  value: number;
  isUp: boolean;
}

const TokenTrend = ({ title, iconPath, symbol, value, isUp }: TokenTrendProps) => (
  <LabeledRow label={title}>
    <Icon src={iconPath} />
    <Label>{symbol}</Label>
    <Trend value={value} isUp={isUp} />
  </LabeledRow>
);

export default TokenTrend;
