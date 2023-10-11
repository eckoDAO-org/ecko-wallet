import React from 'react';
import styled from 'styled-components';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
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
  ${({ disabled }) => (disabled && `
    opacity: 0.2;
    cursor: default;
  `)}
`;

const UnstakeButton = styled(StakeButton)`
  background: #E6E6E6;
  color: #1A1E3E;
`;

const Staking = () => {
  const { hasGas } = useGovernanceMining();
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
        disabled={!hasGas}
      />
      <UnstakeButton
        label={
          <LabelContainer>
            <Icon src={images.governance.unstake} />
            <span>Unstake</span>
          </LabelContainer>
        }
        onClick={openUnstakeModal}
        disabled={!hasGas}
      />
    </DivFlex>
  );
};

export default Staking;
