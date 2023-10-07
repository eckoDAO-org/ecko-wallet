import React from 'react';
import styled from 'styled-components';
import { TokenElement } from 'src/pages/Wallet/components/TokenElement';
import { DivFlex, SecondaryLabel } from 'src/components';
import Button from 'src/components/Buttons';
import { Radio } from 'src/components/Radio';
import images from 'src/images';
import {
  Container as DetailsContainer,
  Key as DetailsKey,
  Value as DetailsValue,
  StatusValue as DetailsStatusValue,
} from '../Details/UI';

interface ConfirmAmountViewProps {
  amount: number;
  hasPositionPenalty: boolean;
  positionPenalty: number;
  positionPenaltyPercentage: number;
  hasRewardPenalty: boolean;
  rewardPenalty: number;
  rewardPenaltyPercentage: number;
  usdAmount: number;
  isLoading: boolean;
  onConfirm: (withdraw: boolean) => void;
}

const Subtitle = styled(SecondaryLabel)`
  text-transform: uppercase;
  color: #A0A6AA;
  fontWeight: bold;
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

const ConfirmAmount = ({
  amount,
  hasPositionPenalty,
  positionPenalty,
  positionPenaltyPercentage,
  hasRewardPenalty,
  rewardPenalty,
  rewardPenaltyPercentage,
  usdAmount,
  isLoading = false,
  onConfirm,
}: ConfirmAmountViewProps) => {
  const [withdraw, setWithdraw] = React.useState(false);
  const toggleWithdraw = () => {
    setWithdraw((value) => !value);
  };

  const handleConfirm = () => {
    onConfirm(withdraw);
  };

  return (

    <DivFlex flexDirection="column" padding="24px" paddingTop="0px" gap="8px">
      <Subtitle>
        Closing your staking plan {hasPositionPenalty ? 'early' : ''}
      </Subtitle>

      <Description>
        {(hasPositionPenalty) ? (
          'Removing KDX from your staking amount will incur a penalty of 3% of the unstaked amount.' +
          'All the KDX penalties are going to be burnt in order to reduce the overall supply.'
        ) : (
          'Are you sure you want to close your staking plan? Partially or completely removing your staking position ' +
          'will have a negative effect on your Voting power.'
        )}
      </Description>

      <DetailsContainer>
        {(hasPositionPenalty) && (
          <>
            <DetailsKey>Position penalty</DetailsKey>
            <DetailsValue>{positionPenaltyPercentage}%</DetailsValue>
          </>
        )}
        {(withdraw && hasRewardPenalty) && (
          <>
            <DetailsKey>Rewards penalty</DetailsKey>
            <DetailsValue>{rewardPenaltyPercentage}%</DetailsValue>
          </>
        )}
        <DetailsKey>Amount</DetailsKey>
        <DetailsValue>{amount} KDX</DetailsValue>
      </DetailsContainer>

      <Separator />

      <Subtitle>
        Unstaked amount
      </Subtitle>

      <TokenElement
        name="KDX"
        balance={amount}
        usdBalance={usdAmount}
        logo={images.wallet.tokens['kaddex.kdx']}
      />

      <DetailsContainer>
        {hasPositionPenalty && (
          <>
            <DetailsKey>Position penalty</DetailsKey>
            <DetailsStatusValue error>{positionPenalty} KDX</DetailsStatusValue>
          </>
        )}
        {(withdraw && hasRewardPenalty) && (
          <>
            <DetailsKey>Rewards penalty</DetailsKey>
            <DetailsStatusValue error>{rewardPenalty} KDX</DetailsStatusValue>
          </>
        )}
      </DetailsContainer>

      <Radio
        onClick={toggleWithdraw}
        isChecked={withdraw}
        label={
          <Description>
            Withdraw your KDX staking rewards
          </Description>
        }
      />

      <DivFlex justifyContent="center" padding="4px" paddingTop="8px">
        <Button isDisabled={isLoading} label={isLoading ? '...' : 'Confirm'} size="full" variant="primary" onClick={handleConfirm} />
      </DivFlex>
    </DivFlex>
  );
};

export default ConfirmAmount;
