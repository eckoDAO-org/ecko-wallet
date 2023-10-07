import React from 'react';
import styled from 'styled-components';
import { TokenElement } from 'src/pages/Wallet/components/TokenElement';
import { DivFlex, SecondaryLabel } from 'src/components';
import Button from 'src/components/Buttons';
import images from 'src/images';

interface ConfirmAmountViewProps {
  amount: number;
  usdAmount: number;
  isLoading: boolean;
  onConfirm: () => void;
}

const Subtitle = styled(SecondaryLabel)`
  text-transform: uppercase;
  color: #A0A6AA;
  font-weight: bold;
`;

const Description = styled(SecondaryLabel)`
  font-weight: 300;
  font-size: 14px;
  margin-bottom: 8px;
`;

const Separator = styled.div`
  margin: 8px 0px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const ConfirmAmount = ({ amount, usdAmount, isLoading, onConfirm }: ConfirmAmountViewProps) => (
  <DivFlex flexDirection="column" padding="24px" paddingTop="0px" gap="8px">
    <Subtitle>
      Adding more KDX to your staking amount
    </Subtitle>

    <Description>
      Adding more KDX to your stake, will simply increase your waiting time proportionally,
      and it will also activate a 3% flat penalty fee on any unstaked amount for 72hours.
      Once the 72 hours have passed, you can unstake your tokens normally without paying this penalty.
    </Description>

    <Separator />

    <Subtitle>
      Stake
    </Subtitle>

    <TokenElement
      name="KDX"
      balance={amount}
      usdBalance={usdAmount}
      logo={images.wallet.tokens['kaddex.kdx']}
    />

    <DivFlex justifyContent="center" padding="4px" paddingTop="8px">
      <Button isDisabled={isLoading} label={isLoading ? '...' : 'Confirm'} size="full" variant="primary" onClick={onConfirm} />
    </DivFlex>
  </DivFlex>
);

export default ConfirmAmount;
