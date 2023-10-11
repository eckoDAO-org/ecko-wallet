import React from 'react';
import styled from 'styled-components';
import { DivFlex } from 'src/components';
import Button from 'src/components/Buttons';
import images from 'src/images';
import { useModalContext } from 'src/contexts/ModalContext';
import Stake from './Stake';
import Unstake from './Unstake';

const LabelContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

const Icon = styled.img`
  height: 24px;
`;

const StakeButton = styled(Button)`
  width: 100%;
`;

const UnstakeButton = styled(StakeButton)`
  background: #E6E6E67F;
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

  const openUnstakeModal = () => {
    openModal({
      title: 'Unstake',
      content: <Unstake unstakeCompleted={closeModal} />,
    });
  };

  return (
    <DivFlex gap="16px" style={{ width: '100%' }}>
      <StakeButton
        label={
          <LabelContainer>
            <Icon src={images.governance.stake} />
            <span>Stake</span>
          </LabelContainer>
        }
        onClick={openStakeModal}
      />
      <UnstakeButton
        label={
          <LabelContainer>
            <Icon src={images.governance.unstake} />
            <UnstakeLabel>Unstake</UnstakeLabel>
          </LabelContainer>
        }
        onClick={openUnstakeModal}
      />
    </DivFlex>
  );
};

export default Staking;
