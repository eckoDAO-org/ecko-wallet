import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { IFungibleToken } from 'src/pages/ImportToken';
import CryptoAmountSelector from 'src/components/CryptoAmountSelector';
import Button from 'src/components/Buttons';
import { DivFlex, SecondaryLabel } from 'src/components';

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
  hasPositionPenalty: boolean;
  positionPenaltyPercentage: number;
  waitingTime: number;
  onStake: (amount: number) => void,
}

interface FormValues {
  amount: string;
}

const AmountSelectorView = ({
  balance,
  hasPositionPenalty,
  positionPenaltyPercentage,
  waitingTime,
  onStake,
}: StakeViewProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm<FormValues>();

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

        {hasPositionPenalty && (
          <PenaltyContainer>
            <SecondaryLabel uppercase fontWeight={700} style={{ flex: 1 }}>
              Position Penalty
            </SecondaryLabel>

            <PenaltyLabel>
              {positionPenaltyPercentage}% - {waitingTime} left
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
