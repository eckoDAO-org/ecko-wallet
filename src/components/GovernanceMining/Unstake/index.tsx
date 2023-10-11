import React from 'react';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import { usePoolUnstakeRequest } from '../api/kaddex.staking';
import Wizard from '../Stake/Wizard';
import AmountSelector from './AmountSelector';
import ConfirmAmount from './ConfirmAmount';

interface UnstakeWizardProps {
  unstakeCompleted?: () => void;
}

const UnstakeWizard = ({ unstakeCompleted }: UnstakeWizardProps) => {
  const governanceMining = useGovernanceMining();
  const poolUnstakeRequest = usePoolUnstakeRequest();

  const handleConfirm = (amount: number, withdrawRewards: boolean) => (
    governanceMining.requestUnstake(amount, withdrawRewards)
  );

  return (
    <Wizard
      handleConfirm={handleConfirm}
      poolRequest={poolUnstakeRequest}
      wizardCompleted={unstakeCompleted}
      transactionFailedMessage="KDX Unstake Failed"
      transactionSuccededMessage="KDX Unstaked Successfully"
      requestTransactionFailedMessage="Unstake transaction failed!"
      requestTransactionSuccededMessage="Transaction sent successfully! Please check the transaction status in the history tab"
      AmountSelector={AmountSelector}
      ConfirmAmount={ConfirmAmount}
    />
  );
};

export default UnstakeWizard;
