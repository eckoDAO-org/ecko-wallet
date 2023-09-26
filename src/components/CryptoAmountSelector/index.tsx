import React from 'react';
import { FieldValues, UseFormClearErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';
import styled from 'styled-components';
import { useAccountBalanceContext } from 'src/contexts/AccountBalanceContext';
import { BigNumberConverter, humanReadableNumber, toFixedDown } from 'src/utils';
import { CommonLabel, DivFlex, PrimaryLabel, SecondaryLabel } from 'src/components';
import Button from 'src/components/Buttons';
import { SInput } from 'src/baseComponent/BaseTextInput';
import { IFungibleToken } from 'src/pages/ImportToken';
import { GasType, NUMBER_DECIMAL_AFTER_DOT } from 'src/utils/config';

export const AmountWrapper = styled(DivFlex)`
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    /* display: none; <- Crashes Chrome on hover */
    -webkit-appearance: none;
    margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
  }
  input[type='number'] {
    -moz-appearance: textfield; /* Firefox */
  }
`;

export const ErrorWrapper = styled.div`
  margin-top: 10px;
`;

export const Error = styled.span`
  color: ${(props) => props.theme.error.color};
  line-height: normal;
`;

export const AmountInput = styled(SInput)`
  flex: 1;
  fontSize: 45px;
  fontWeight: 500;
  background: ${({ theme }) => theme.background};
`;

export type TFieldValues = FieldValues & {
  amount: string;
};

type CryptoAmountSelectorProps = {
  fungibleToken: IFungibleToken;
  showPrefilledButtons?: boolean;
  showEstimatedUSD?: boolean;
  selectedGas?: GasType;
  tokenBalance: number;
  register: UseFormRegister<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  clearErrors: UseFormClearErrors<TFieldValues>;
  errors: { [x: string]: any };
  readOnly: boolean;
  amount?: string;
  onChangeAmount?: (amount: string) => void;
};

const CryptoAmountSelector = ({
  fungibleToken,
  showPrefilledButtons = true,
  showEstimatedUSD = true,
  selectedGas,
  tokenBalance,
  register,
  setValue,
  clearErrors,
  errors,
  readOnly,
  onChangeAmount,
  ...props
}: CryptoAmountSelectorProps) => {
  const test = useAccountBalanceContext();
  const { usdPrices } = test;

  const [amount, setAmount] = React.useState(props.amount || '0.0');

  const estimateUSDAmount =
    Object.prototype.hasOwnProperty.call(usdPrices, fungibleToken.contractAddress)
      ? (usdPrices[fungibleToken.contractAddress as any] || 0) * Number(amount)
      : null;

  const gasFee = selectedGas ? BigNumberConverter(Number(selectedGas.GAS_PRICE) * Number(selectedGas.GAS_LIMIT)) : 0;

  const changeAmount = (e) => {
    const { value } = e.target;
    clearErrors('amount');
    let number: string = value
      .toString()
      .replace(/[^0-9.]/g, '')
      .replace(/(\..*?)\..*/g, '$1');
    if (number.includes('.')) {
      const numString = number.toString().split('.');
      if (numString[1].length > NUMBER_DECIMAL_AFTER_DOT) {
        number = number.substring(0, number.length - 1);
      }
    }
    setAmount(number);
    setValue('amount', number);
    onChangeAmount?.(number);
  };

  const setPrefilledBalance = (type: 'max' | 'half') => {
    let amountValue = BigNumberConverter(tokenBalance);

    if (type === 'half') {
      amountValue /= 2;
    }

    if (fungibleToken.contractAddress === 'coin') {
      amountValue -= gasFee;
    }
    const amountCustom = amountValue > 0 ? toFixedDown(amountValue, 12) : '0';
    setAmount(amountCustom);
    setValue('amount', amountCustom);
    onChangeAmount?.(amountCustom);
  };

  const getInputFontSize = (length: number) => {
    if (length < 5) {
      return 40;
    }
    if (length < 12) {
      return 40 - amount.toString().length;
    }
    return 22;
  };

  return (
    <div>
      <DivFlex justifyContent="space-between" margin="10px 0" alignItems="center">
        <SecondaryLabel uppercase fontWeight={700} style={{ flex: 1 }}>
          Amount to send
        </SecondaryLabel>
        {showPrefilledButtons && (
          <DivFlex justifyContent="flex-end" style={{ flex: 1, gap: 5 }}>
            <Button
              type="button"
              onClick={() => setPrefilledBalance('half')}
              label="HALF"
              size="full"
              variant="grey"
              style={{ height: 28, fontSize: 10, maxWidth: 60 }}
            />
            <Button
              type="button"
              onClick={() => setPrefilledBalance('max')}
              label="MAX"
              size="full"
              variant="grey"
              style={{ height: 28, fontSize: 10, maxWidth: 60 }}
            />
          </DivFlex>
        )}
      </DivFlex>
      {/* amount */}
      <AmountWrapper alignItems="center" justifyContent="space-between">
        <AmountInput
          autoComplete="off"
          readOnly={readOnly}
          style={{
            fontSize: getInputFontSize(amount.toString().length || 40),
            padding: readOnly ? '0px 5px 0px 13px;' : '0px 5px 0px 0px',
          }}
          type="number"
          value={amount}
          height="auto"
          onWheel={(event) => event.currentTarget.blur()}
          {...register('amount', {
            required: {
              value: true,
              message: 'This field is required.',
            },
            validate: {
              isZero: (v) => {
                const value = Number(v);
                return value !== 0;
              },
              positive: (v) => {
                const value = Number(v);
                const balance = Number(tokenBalance);
                let amountValue = BigNumberConverter(balance);
                if (fungibleToken.contractAddress === 'coin') {
                  amountValue -= gasFee;
                }
                return value > 0 && value <= amountValue;
              },
            },
          })}
          onFocus={(event) => event.target.select()}
          onChange={changeAmount}
        />
        {/** TODO: make dynamic length text <TextScaling /> */}
        <PrimaryLabel fontSize={40} uppercase>
          {fungibleToken.symbol.substring(0, 3)}
        </PrimaryLabel>
      </AmountWrapper>
      {errors.amount && errors.amount.type === 'required' && (
        <ErrorWrapper>
          <DivFlex>
            <Error>This field is required</Error>
          </DivFlex>
        </ErrorWrapper>
      )}
      {errors.amount && errors.amount.type === 'positive' && (
        <ErrorWrapper>
          <DivFlex>
            <Error>Insufficient funds</Error>
          </DivFlex>
        </ErrorWrapper>
      )}
      {errors.amount && errors.amount.type === 'isZero' && (
        <ErrorWrapper>
          <DivFlex>
            <Error>Invalid amount</Error>
          </DivFlex>
        </ErrorWrapper>
      )}
      <DivFlex justifyContent="space-between" alignItems="center" margin="0px">
        {showEstimatedUSD && (
          <CommonLabel fontSize={12} fontWeight={600}>
            {estimateUSDAmount && `${humanReadableNumber(estimateUSDAmount)} USD`}
          </CommonLabel>
        )}
        <SecondaryLabel fontSize={12} fontWeight={600}>
          {`Balance: ${BigNumberConverter(tokenBalance)} ${fungibleToken.symbol.toUpperCase()}`}
        </SecondaryLabel>
      </DivFlex>
    </div>
  );
};

export default CryptoAmountSelector;
