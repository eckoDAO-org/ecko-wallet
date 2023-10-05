import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { IFungibleToken } from 'src/pages/ImportToken';
import CryptoAmountSelector from 'src/components/CryptoAmountSelector';
import Button from 'src/components/Buttons';
import { DivFlex, SecondaryLabel } from 'src/components';
import { getWaitingTimeRewardsPenalty } from '../Details/Details';

const Container = styled.div`
  margin: 24px;
`;

const PenaltyContainer = styled(DivFlex)`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.border};
  justify-content: space-between;
`;

const PenaltyLabel = styled(SecondaryLabel)`
  color: ${({ theme }) => theme.error.color};
`;

const kda: IFungibleToken = {
  contractAddress: 'kaddex.kdx',
  symbol: 'KDX',
};

interface StakeViewProps {
  balance: number;
  effectiveStartDate: string;
  rewardsPenalty: number;
  onStake: (amount: number) => void,
}

interface FormValues {
  amount: string;
}

const AmountSelectorView = ({ balance, effectiveStartDate, rewardsPenalty, onStake }: StakeViewProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    clearErrors,
  } = useForm<FormValues>();

  const [hasPenalty, waitingTime] = getWaitingTimeRewardsPenalty(effectiveStartDate);
  const amount = parseFloat(getValues('amount')) || 0;
  const penaltyPercentual = amount ? (rewardsPenalty / amount) * 100 : 0;

  const onSubmit = handleSubmit((data) => {
    onStake(+data.amount);
  });

  return (
    <Container>
      <form onSubmit={onSubmit} id="unstake" noValidate>
        <CryptoAmountSelector
          fungibleToken={kda}
          tokenBalance={balance}
          register={register}
          setValue={setValue}
          clearErrors={clearErrors}
          errors={errors}
          readOnly={false}
        />

        {!hasPenalty && (
          <PenaltyContainer>
            <SecondaryLabel uppercase fontWeight={700} style={{ flex: 1 }}>
              Amount to send
            </SecondaryLabel>

            <PenaltyLabel>
              {penaltyPercentual}% - {waitingTime} left
            </PenaltyLabel>
          </PenaltyContainer>
        )}

        <DivFlex justifyContent="center" padding="4px" paddingTop="32px">
          <Button form="unstake" label="Unstake" size="full" />
        </DivFlex>
      </form>
    </Container>
  );
};

export default AmountSelectorView;
