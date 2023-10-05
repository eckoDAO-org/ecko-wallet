import React from 'react';
import styled from 'styled-components';
import { DivFlex } from 'src/components';
import Button from 'src/components/Buttons';
import images from 'src/images';
import { useModalContext } from 'src/contexts/ModalContext';
import Stake from './Stake';

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

const Staking = () => {
  const { openModal, closeModal } = useModalContext();
  const openStakeModal = () => {
    openModal({
      title: 'Stake',
      content: <Stake stakeCompleted={closeModal} />,
    });
  };

  return (
    <DivFlex gap="16px" style={{ width: '100%' }}>
      <Button
        label={
          <LabelContainer>
            <Icon src={images.governance.stake} />
            <span>Stake</span>
          </LabelContainer>
        }
        size="full"
        onClick={openStakeModal}
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
};

export default Staking;