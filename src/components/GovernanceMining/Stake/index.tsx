import React from 'react';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import { usePoolStakeRequest } from '../api/kaddex.staking';
import Wizard from './Wizard';
import AmountSelector from './AmountSelector';
import ConfirmAmount from './ConfirmAmount';

interface StakeWizardProps {
  stakeCompleted?: () => void;
}

const StakeWizard = ({ stakeCompleted }: StakeWizardProps) => {
  const governanceMining = useGovernanceMining();
  const poolUnstakeRequest = usePoolStakeRequest();

  return (
    <Wizard
      handleConfirm={governanceMining.requestStake}
      poolRequest={poolUnstakeRequest}
      wizardCompleted={stakeCompleted}
      transactionFailedMessage="KDX Stake Failed"
      transactionSuccededMessage="KDX Staked Successfully"
      requestTransactionFailedMessage="Stake transaction failed!"
      requestTransactionSuccededMessage="Transaction sent successfully! Please check the transaction status in the history tab"
      AmountSelector={AmountSelector}
      ConfirmAmount={ConfirmAmount}
    />
  );
};

export default StakeWizard;
