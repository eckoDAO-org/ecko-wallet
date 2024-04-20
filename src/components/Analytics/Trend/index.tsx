import React from 'react';
import styled from 'styled-components';
import images from 'src/images';

const Container = styled.div`
  background-color: ${({ isUp }) => isUp ? '#41CC41' : '#CC4141'};
  height: 20px;
  border-radius: 24px;
  padding: 4px 8px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
  font-size: 12px;
`;

const Icon = styled.img`
  width: auto;
  height: 9px;
`;

interface TrendProps {
  value: number;
  isUp: boolean;
  precision?: number;
}

const Trend = ({
  value,
  isUp,
  precision = 2,
}: TrendProps) => {
  const image = isUp ? images.analytics.uptrend : images.analytics.downtrend;
  const formattedValue = value.toFixed(precision);

  return (
    <Container isUp={isUp}>
      <Icon src={image} />
      {formattedValue}%
    </Container>
  );
};

export default Trend;
