import React from 'react';
import { toast } from 'react-toastify';
import { useAccountBalanceContext } from 'src/contexts/AccountBalanceContext';
import { useGovernanceMining } from 'src/contexts/GovernanceMiningContext';
import { useGoHome } from 'src/hooks/ui';
import Toast from 'src/components/Toast/Toast';
import ConfirmAmount from './ConfirmView';
import { usePoolClaimRequest } from '../api/kaddex.staking';

interface WithdrawProps {
  withdrawCompleted?: () => void;
}

const Withdraw = ({ withdrawCompleted }: WithdrawProps) => {
  const goHome = useGoHome();
  const governanceMining = useGovernanceMining();
  const poolClaim = usePoolClaimRequest();
  const { usdPrices } = useAccountBalanceContext();

  const amount = governanceMining.stakeStatus.rewards.collectedTokens;
  const estimateUSDAmount = (usdPrices?.['kaddex.kdx'] || 0) * amount;

  const onAmountConfirmed = async () => {
    const requestKey = await governanceMining.requestClaim();

    if (!requestKey) {
      toast.error(
        <Toast type="error" content="Withdraw transaction failed!" />,
      );
      return;
    }

    goHome();
    withdrawCompleted?.();

    toast.success(
      <Toast type="success" content="Transaction sent successfully! Please check the transaction status in the history tab" />,
    );

    const result = await poolClaim(requestKey);

    if (result.status === 'success') {
      toast.success(<Toast type="success" content="Rewards Claimed Successfully" />);
    } else {
      toast.error(<Toast type="fail" content="Rewards Claim Failed" />);
    }
  };

  return (
    <ConfirmAmount
      onConfirm={onAmountConfirmed}
      amount={amount}
      usdAmount={estimateUSDAmount}
    />
  );
};

export default Withdraw;
