import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useAppSelector } from 'src/stores/hooks';
import { getCurrentWallet, getWallets } from 'src/stores/wallet';
import { CryptoCurrency, FiatCurrency, PurchaseQuoteRequest } from 'src/utils/crypto-providers/types';
import { CommonLabel, LabelWithLink } from 'src/components';
import { BaseModalSelect, InputError } from 'src/baseComponent';
import { SInput, SLabel } from 'src/baseComponent/BaseTextInput';
import Button from 'src/components/Buttons';
import { Body, Footer, Header, Page } from 'src/components/Page';
import { Radio } from 'src/components/Radio';
import { QuoteRequestorViewProps } from './types';

const Form = styled.form`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 20px;
`;

const InputWrapper = styled.div``;

const DisclaimerLabel = styled.span`
  font-weight: bold;
  cursor: pointer;
  text-decoration: underline;
`;

interface FormData {
  walletAddress: string,
  fiatCurrency: FiatCurrency,
  cryptoCurrency: CryptoCurrency,
  amount: number,
  consent: boolean,
}

const optionify = (option: string) => ({ label: option, value: option });

const QuoteRequestor = ({
  fiatCurrencyAvailabilities,
  cryptoCurrencies,
  requestQuote,
}: QuoteRequestorViewProps) => {
  const [showDisclaimer, setShowDisclaimer] = React.useState(false);
  const wallets = useAppSelector(getWallets);
  const currentWallet = useAppSelector(getCurrentWallet);

  const walletAddresses = wallets.map((wallet, i) => ({
    value: wallet.account,
    label: (wallet.alias || `Account ${i + 1}`).concat(` (${wallet.account})`),
  }));
  const fiatCurrencies = Object.keys(fiatCurrencyAvailabilities);

  const { control, formState: { errors }, handleSubmit, clearErrors, getValues, setValue } = useForm<FormData>({
    defaultValues: {
      walletAddress: currentWallet?.account,
      fiatCurrency: fiatCurrencies[0],
      cryptoCurrency: cryptoCurrencies[0],
      amount: 100,
      consent: false,
    },
  });

  const handleRequestQuote = (data: FormData) => {
    const request: PurchaseQuoteRequest = {
      account: data.walletAddress,
      fiatCurrency: data.fiatCurrency,
      amountToSpend: data.amount,
      cryptoToBuy: data.cryptoCurrency,
    };
    requestQuote(request);
  };

  const handleClickDisclaimer = (event: MouseEvent) => {
    event.stopPropagation();
    setShowDisclaimer((show) => !show);
  };

  const fiatCurrenciesOptions = fiatCurrencies.map(optionify);
  const cryptoCurrenciesOptions = cryptoCurrencies.map(optionify);

  const fiatCurrency = getValues('fiatCurrency');
  const { minAmount, maxAmount } = fiatCurrencyAvailabilities[fiatCurrency];

  if (cryptoCurrencies.length === 0 || fiatCurrencies.length === 0) {
    return (
      <Page>
        <Header>
          <CommonLabel fontSize={18} fontWeight={500}>This service isn&apos;t available in your country.</CommonLabel>
        </Header>
      </Page>
    );
  }

  return (
    <Page>
      <Header>
        <CommonLabel fontSize={18} fontWeight={500}>Get quote</CommonLabel>
      </Header>
      <Body>
        <Form onSubmit={handleSubmit(handleRequestQuote)}>
          <InputWrapper>
            <Controller
              control={control}
              name="walletAddress"
              rules={{
                required: {
                  value: true,
                  message: 'This field is required.',
                },
              }}
              render={({ field }) => (
                <BaseModalSelect
                  title="Wallet"
                  options={walletAddresses}
                  value={walletAddresses.find((wallet) => wallet.value === field.value)}
                  onChange={(value) => { field.onChange(value?.value); }}
                />
              )}
            />
            {errors.walletAddress && <InputError>{errors.walletAddress.message}</InputError>}
          </InputWrapper>
          <InputWrapper>
            <Controller
              control={control}
              name="fiatCurrency"
              rules={{
                required: {
                  value: true,
                  message: 'This field is required.',
                },
              }}
              render={({ field }) => (
                <BaseModalSelect
                  title="Fiat currency"
                  options={fiatCurrenciesOptions}
                  value={optionify(field.value)}
                  onChange={(value) => {
                    clearErrors('amount');
                    field.onChange(value?.value);
                  }}
                />
              )}
            />
            {errors.fiatCurrency && <InputError>{errors.fiatCurrency.message}</InputError>}
          </InputWrapper>

          <InputWrapper>
            <Controller
              control={control}
              name="cryptoCurrency"
              rules={{
                required: {
                  value: true,
                  message: 'This field is required.',
                },
              }}
              render={({ field }) => (
                <BaseModalSelect
                  title="Crypto currency"
                  options={cryptoCurrenciesOptions}
                  value={optionify(field.value)}
                  onChange={(value) => { field.onChange(value?.value); }}
                />
              )}
            />
            {errors.cryptoCurrency && <InputError>{errors.cryptoCurrency.message}</InputError>}
          </InputWrapper>

          <InputWrapper>
            <SLabel>Amount ({minAmount} {fiatCurrency} minimum / {maxAmount} {fiatCurrency} maximum)</SLabel>
            <Controller
              control={control}
              name="amount"
              rules={{
                required: {
                  value: true,
                  message: 'This field is required.',
                },
                pattern: {
                  value: /^[0-9]+(\.[0-9]{1,2})?$/,
                  message: 'Invalid amount format. Must be a decimal with up to 2 decimal places.',
                },
                min: {
                  value: minAmount,
                  message: `Minimum amount is ${minAmount}.`,
                },
                max: {
                  value: maxAmount,
                  message: `Maximum amount is ${maxAmount}.`,
                },
              }}
              render={({ field }) => (
                <SInput
                  {...field}
                  type="number"
                  step="0.01"
                  label="Amount"
                  placeholder="Enter amount"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    let amount = event.currentTarget.value;
                    const isValid = /^\d+(\.\d{0,2})?$/.test(amount);

                    if (!isValid) {
                      const parsed = parseFloat(amount);

                      if (!Number.isNaN(parsed)) {
                        amount = parsed.toFixed(2);
                      }
                    }

                    field.onChange(parseFloat(amount));
                  }}
                />
              )}
            />
            {errors.amount && <InputError>{errors.amount.message}</InputError>}
          </InputWrapper>

          <InputWrapper>
            <Controller
              control={control}
              name="consent"
              rules={{
                required: {
                  value: true,
                  message: 'You must accept the consent.',
                },
              }}
              render={({
                field: { value, name },
              }) => (
                <Radio
                  onClick={() => setValue(name, !value)}
                  isChecked={value}
                  label={
                    <CommonLabel>
                      I have read the <DisclaimerLabel onClick={handleClickDisclaimer}>disclaimer</DisclaimerLabel>&nbsp;
                      and consent to eckoWALLET providing my deposit address and user name to Simplex.
                    </CommonLabel>
                  }
                />
              )}
            />
            {errors.consent && <InputError>{errors.consent.message}</InputError>}
            { showDisclaimer && (
              <LabelWithLink fontSize={12}>
                Please read and agree to the Terms of Use of Simplex before using this service. eckoWALLET does not currently support purchases of
                cryptocurrency using debit or credit cards. These transactions must be completed with a third-party. While eckoWALLET will direct you to
                Simplex to complete the transaction above, you are not required to purchase cryptocurrency through Simplex and there may be other ways
                to purchase cryptocurrency using your debit or credit card. Simplex is not owned or operated by eckoWALLET and as such we cannot guarantee
                that your transaction will process successfully. As a convenience to our customers, eckoWALLET will provide your deposit address and
                username to Simplex should you choose to complete this transaction. By checking the box below, you consent to eckoWALLET providing this
                information to Simplex on your behalf and acknowledge your agreement to this disclaimer. For any questions about your card payment,
                please contact <a href="mailto:support@simplex.com">support@simplex.com</a>. eckoWALLET does not assume responsibility for any loss or
                damage caused by the use of the service.
              </LabelWithLink>
            )}
          </InputWrapper>

          <Button type="submit" label="Get quote" size="full" variant="primary" />
        </Form>
      </Body>

      <Footer>
        <LabelWithLink>
          <a href="https://kaddex.com/privacy-policy" target="_blank" rel="noreferrer">Privacy Policy</a>
        </LabelWithLink>
        <LabelWithLink>
          <a href="https://kaddex.com/terms-of-use" target="_blank" rel="noreferrer">Terms Of Use</a>
        </LabelWithLink>
      </Footer>
    </Page>
  );
};

export default QuoteRequestor;
