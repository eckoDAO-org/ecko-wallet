import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import Button from 'src/components/Buttons';
import { useModalContext } from 'src/contexts/ModalContext';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import { useStakingConstants } from '../constants/staking';
import Confirm from './Confirm';

const WithdrawButton = styled(Button)`
  ${({ isDisabled }) => isDisabled && `
    background: transparent;
    border: 1px solid #9FA6ABB2;
    color: #9FA6AB;
    margin-bottom: 16px;
  `}
`;

const Withdraw = () => {
  const governanceMining = useGovernanceMining();
  const STAKING_CONSTANTS = useStakingConstants();
  const { openModal, closeModal } = useModalContext();

  const { stakeStatus: { rewards } } = governanceMining;
  const isDisabled = !(rewards.canClaim && rewards.collectedTokens);
  const nextClaimTotalHours = (STAKING_CONSTANTS.withdrawDaysToWaitFromLastClaim * 24) - moment().diff(rewards.lastClaimDate, 'hours');
  const nextClaimDays = Math.trunc(nextClaimTotalHours / 24);
  const nextClaimHours = nextClaimTotalHours - (nextClaimDays * 24);
  const nextWithdrawLabel = nextClaimDays > 0
    ? `Withdraw in ${nextClaimDays} days and ${nextClaimHours} hours`
    : `Withdraw in ${nextClaimHours} hours`;
  const label = rewards.canClaim ? 'Withdraw' : nextWithdrawLabel;

  const openConfirmModal = () => {
    openModal({
      title: 'Withdraw your staking rewards',
      content: <Confirm withdrawCompleted={closeModal} />,
    });
  };

  return (
    <WithdrawButton
      isDisabled={isDisabled}
      label={label}
      onClick={openConfirmModal}
    />
  );
};

export default Withdraw;
