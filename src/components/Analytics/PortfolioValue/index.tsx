import React from 'react';
import styled from 'styled-components';
import { DivFlex } from 'src/components';
import PortfolioValueChart from '../PortfolioValueChart';
import TimeSelector from '../TimeSelector';
import Trend from '../Trend';
import { Label, LabeledContainer } from '../UI';

const Container = styled.div`
  width: 100%;
  height: 240px;
`;

const PortfolioValue = () => {
  const value = Number((233189.71).toFixed(2)).toLocaleString();

  return (
    <LabeledContainer label="PORTFOLIO VALUE CHART">
      <DivFlex flexDirection="row" alignItems="center" gap="12px">
        <Label>{`$ ${value}`}</Label>
        <Trend value={2.83} isUp />
      </DivFlex>
      <Container>
        <PortfolioValueChart />
      </Container>
      <TimeSelector />
    </LabeledContainer>
  );
};

export default PortfolioValue;
