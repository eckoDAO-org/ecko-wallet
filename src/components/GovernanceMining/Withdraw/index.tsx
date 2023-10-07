import React from 'react';
import styled from 'styled-components';
import Button from 'src/components/Buttons';
import { useModalContext } from 'src/contexts/ModalContext';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import Confirm from './Confirm';

const WithdrawButton = styled(Button)`
  ${({ isDisabled }) => isDisabled && `
    background: transparent;
    border: 1px solid #9FA6ABB2;
    color: #9FA6AB;
  `}
`;

const Withdraw = () => {
  const governanceMining = useGovernanceMining();
  const { openModal, closeModal } = useModalContext();
  const openConfirmModal = () => {
    openModal({
      title: 'Withdraw your staking rewards',
      content: <Confirm withdrawCompleted={closeModal} />,
    });
  };

  const isDisabled = !(governanceMining.stakeStatus.rewards.canClaim && governanceMining.stakeStatus.rewards.collectedTokens);

  return (
    <WithdrawButton isDisabled={isDisabled} label="Withdraw" onClick={openConfirmModal} />
  );
};

export default Withdraw;
