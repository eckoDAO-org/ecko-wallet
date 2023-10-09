import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { IFungibleToken } from 'src/pages/ImportToken';
import CryptoAmountSelector from 'src/components/CryptoAmountSelector';
import Button from 'src/components/Buttons';
import { DivFlex } from 'src/components';

const Container = styled.div`
  margin: 24px;
`;

const kda: IFungibleToken = {
  contractAddress: 'kaddex.kdx',
  symbol: 'KDX',
};

export interface StakeViewProps {
  balance: number;
  buttonLabel?: string;
  onStake: (amount: number) => void,
}

interface FormValues {
  amount: string;
}

const AmountSelectorView = ({ balance, buttonLabel = 'Stake', children, onStake }: React.PropsWithChildren<StakeViewProps>) => {
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
      <form onSubmit={onSubmit} noValidate>
        <CryptoAmountSelector
          fungibleToken={kda}
          tokenBalance={balance}
          register={register}
          setValue={setValue}
          clearErrors={clearErrors}
          errors={errors}
          readOnly={false}
        />

        {children}

        <DivFlex justifyContent="center" padding="4px" paddingTop="32px">
          <Button label={buttonLabel} size="full" />
        </DivFlex>
      </form>
    </Container>
  );
};

export default AmountSelectorView;
