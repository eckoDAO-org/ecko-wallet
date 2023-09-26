import React from 'react';
import styled from 'styled-components';
import { useAccountBalanceContext } from 'src/contexts/AccountBalanceContext';
import { TokenElement } from 'src/pages/Wallet/components/TokenElement';
import { DivFlex, SecondaryLabel } from 'src/components';
import Button from 'src/components/Buttons';
import images from 'src/images';

interface ConfirmModalProps {
  amount: number;
  onConfirm: () => void;
}

const Subtitle = styled(SecondaryLabel)`
  text-transform: uppercase;
  color: #A0A6AA;
  fontWeight: bold;
`;

const Description = styled(SecondaryLabel)`
  fontWeight: 300;
  fontSize: 14px;
  padding-bottom: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const ConfirmAmount = ({ amount, onConfirm }: ConfirmModalProps) => {
  const { usdPrices } = useAccountBalanceContext();
  const estimateUSDAmount = (usdPrices?.['kaddex.kdx'] || 0) * amount;
  const handleConfirm = () => { onConfirm(); };

  return (
    <DivFlex flexDirection="column" padding="24px" gap="24px">
      <Subtitle>
        Adding more KDX to your staking amount
      </Subtitle>

      <Description>
        Adding more KDX to your stake, will simply increase your waiting time proportionally,
        and it will also activate a 3% flat penalty fee on any unstaked amount for 72hours.
        Once the 72 hours have passed, you can unstake your tokens normally without paying this penalty.
      </Description>

      <Subtitle>
        Stake
      </Subtitle>

      <TokenElement
        name="KDX"
        balance={amount}
        usdBalance={estimateUSDAmount}
        logo={images.wallet.tokens['kaddex.kdx']}
      />

      <DivFlex justifyContent="center" padding="4px" paddingTop="8px">
        <Button label="Confirm" size="full" variant="primary" onClick={handleConfirm} />
      </DivFlex>
    </DivFlex>
  );
};

export default ConfirmAmount;
