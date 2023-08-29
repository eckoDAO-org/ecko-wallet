import React from 'react';
import styled from 'styled-components';
import { DivFlex } from 'src/components';
import Button from 'src/components/Buttons';
import images from 'src/images';

const LabelContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const Icon = styled.img`
  height: 24px;
`;

const UnstakeLabel = styled.span`
  color: ${({ theme }) => theme.background}
`;

const Staking = () => (
  <DivFlex gap="16px" style={{ width: '100%' }}>
    <Button
      label={
        <LabelContainer>
          <Icon src={images.governance.stake} />
          <span>Stake</span>
        </LabelContainer>
      }
      size="full"
    />
    <Button
      label={
        <LabelContainer>
          <Icon src={images.governance.unstake} />
          <UnstakeLabel>Unstake</UnstakeLabel>
        </LabelContainer>
      }
      variant="secondary"
      size="full"
    />
  </DivFlex>
);

export default Staking;
