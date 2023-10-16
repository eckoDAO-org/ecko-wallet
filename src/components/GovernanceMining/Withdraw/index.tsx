import React from 'react';
import moment from 'moment';
import styled from 'styled-components';
import Button from 'src/components/Buttons';
import { useModalContext } from 'src/contexts/ModalContext';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import { useStakingConstants } from '../constants/staking';
import Confirm from './Confirm';

const WithdrawButton = styled(Button)`
  background: transparent;
  border: 1px solid #9FA6ABB2;
  color: #9FA6AB;
  margin-bottom: 16px;
  ${({ disabled }) => disabled && `
    opacity: 0.2;
    cursor: default;
  `}
`;

const Withdraw = () => {
  const { hasGas, stakeStatus: { rewards } } = useGovernanceMining();
  const STAKING_CONSTANTS = useStakingConstants();
  const { openModal, closeModal } = useModalContext();

  const isDisabled = !hasGas || (!rewards.canClaim || (rewards.collectedTokens === 0));
  const nextClaimTotalHours = (STAKING_CONSTANTS.withdrawDaysToWaitFromLastClaim * 24) - moment().diff(rewards.lastClaimDate, 'hours');
  const nextClaimDays = Math.trunc(nextClaimTotalHours / 24);
  const nextClaimHours = nextClaimTotalHours - (nextClaimDays * 24);
  const nextWithdrawLabel = nextClaimDays > 0
    ? `Withdraw in ${nextClaimDays} days and ${nextClaimHours} hours`
    : `Withdraw in ${nextClaimHours} hours`;
  const label = (rewards.collectedTokens && !rewards.canClaim) ? nextWithdrawLabel : 'Withdraw';

  const openConfirmModal = () => {
    openModal({
      title: 'Withdraw your staking rewards',
      content: <Confirm withdrawCompleted={closeModal} />,
    });
  };

  return (
    <WithdrawButton
      disabled={isDisabled}
      label={label}
      onClick={openConfirmModal}
    />
  );
};

export default Withdraw;
