import React from 'react';
import styled from 'styled-components';
import { DivFlex } from 'src/components';
import images from 'src/images';

const Icon = styled.img`
  width: 32px;
  height: 32px;
`;

const Toolbar = () => (
  <DivFlex flexDirection="row" gap="8px">
    <Icon src={images.analytics.valuechart} />
    <Icon src={images.analytics.heatmap} />
    <Icon src={images.analytics.piechart} />
    <Icon src={images.analytics.assetAllocation} />
    <Icon src={images.analytics.profitAndLoss} />
  </DivFlex>
);

export default Toolbar;
