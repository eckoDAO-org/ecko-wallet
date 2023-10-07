import React from 'react';
import styled from 'styled-components';
import { SecondaryLabel } from 'src/components';
import { Radio } from 'src/components/Radio';
import {
  Container as DetailsContainer,
  Key as DetailsKey,
  Value as DetailsValue,
  StatusValue as DetailsStatusValue,
} from '../Details/UI';
import BaseConfirmAmount from '../Stake/BaseConfirmAmount';

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

const Description = styled(SecondaryLabel)`
  font-weight: 300;
  font-size: 14px;
  margin-bottom: 8px;
`;

const ConfirmAmount = ({
  hasPositionPenalty,
  positionPenalty,
  positionPenaltyPercentage,
  hasRewardPenalty,
  rewardPenalty,
  rewardPenaltyPercentage,
  onConfirm,
  ...props
}: ConfirmAmountViewProps) => {
  const [withdraw, setWithdraw] = React.useState(false);

  const summaryTitle = `Closing your staking plan ${hasPositionPenalty ? 'early' : ''}`;
  const summaryDescription = (hasPositionPenalty) ? (
    'Removing KDX from your staking amount will incur a penalty of 3% of the unstaked amount.' +
    'All the KDX penalties are going to be burnt in order to reduce the overall supply.'
  ) : (
    'Are you sure you want to close your staking plan? Partially or completely removing your staking position ' +
    'will have a negative effect on your Voting power.'
  );

  const toggleWithdraw = () => {
    setWithdraw((value) => !value);
  };

  const handleConfirm = () => {
    onConfirm(withdraw);
  };

  const summaryDetails = (
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
      <DetailsValue>{props.amount} KDX</DetailsValue>
    </DetailsContainer>
  );

  const details = (
    <>
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
    </>
  );

  return (
    <BaseConfirmAmount
      {...props}
      summaryTitle={summaryTitle}
      summaryDescription={summaryDescription}
      summaryDetails={summaryDetails}
      title="Unstaked amount"
      details={details}
      onConfirm={handleConfirm}
    />
  );
};

export default ConfirmAmount;
