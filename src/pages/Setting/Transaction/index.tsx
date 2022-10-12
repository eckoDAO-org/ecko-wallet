/* eslint-disable no-console */
import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ButtonAdd } from 'src/pages/SendTransactions/views/style';
import Button from 'src/components/Buttons';
import { TxSettingsContextData, TxSettingsContext } from 'src/contexts/TxSettingsContext';
import { BUTTON_SIZE, BUTTON_TYPE } from 'src/utils/constant';
import { BaseTextInput, InputError } from 'src/baseComponent';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import BigNumber from 'bignumber.js';
import Back from 'src/components/Back';
import Toast from 'src/components/Toast/Toast';
import { CONFIG } from 'src/utils/config';
import { ErrorWrapper } from 'src/pages/SendTransactions/styles';
import { ButtonBack, Content, SettingBody, TitleHeader } from '../style';
import { DivBodyNetwork } from '../Networks/views/style';
import { Body, DivError } from '../Contact/views/style';

const PageTransaction = () => {
  const history = useHistory();
  const { data, setTxSettings } = useContext(TxSettingsContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getDefaultData = (): any => {
    const gasPriceDecimals = new BigNumber(data?.gasPrice ?? CONFIG.GAS_PRICE).decimalPlaces();
    const xChainGasPriceDecimals = new BigNumber(data?.xChainGasPrice ?? CONFIG.X_CHAIN_GAS_PRICE).decimalPlaces();
    return { ...data, gasPrice: data?.gasPrice?.toFixed(gasPriceDecimals), xChainGasPrice: data?.xChainGasPrice?.toFixed(xChainGasPriceDecimals) };
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({ defaultValues: getDefaultData() });

  const onSave = (dataSubmit: TxSettingsContextData) => {
    const toSubmit = {
      ...dataSubmit,
      gasLimit: Number(dataSubmit.gasLimit),
      gasPrice: Number(dataSubmit.gasPrice),
      xChainGasLimit: Number(dataSubmit.xChainGasLimit),
      xChainGasPrice: Number(dataSubmit.xChainGasPrice),
    };
    setTxSettings(toSubmit);
    toast.success(<Toast type="success" content="Settings saved successfully" />);
    history.push('/setting');
  };

  const restoreDefault = () => {
    onSave({
      gasLimit: CONFIG.GAS_LIMIT,
      gasPrice: CONFIG.GAS_PRICE,
      xChainGasLimit: CONFIG.X_CHAIN_GAS_LIMIT,
      xChainGasPrice: CONFIG.X_CHAIN_GAS_PRICE,
      xChainGasStation: CONFIG.X_CHAIN_GAS_STATION,
      xChainTTL: CONFIG.X_CHAIN_TTL,
    });
  };

  const onErrors = () => {};
  return (
    <SettingBody>
      <ButtonBack>
        <Back title="Back" onBack={() => history.push('/setting')} />
      </ButtonBack>
      <Body>
        <TitleHeader>Transaction Settings</TitleHeader>
        <Content>
          <form onSubmit={handleSubmit(onSave, onErrors)} id="save-network">
            <DivBodyNetwork>
              <BaseTextInput
                title="Gas Limit"
                height="auto"
                onChange={(e) => setValue('gasLimit', e.target.value)}
                inputProps={{
                  type: 'number',
                  placeholder: 'Gas Limit',
                  ...register('gasLimit', {
                    required: true,
                  }),
                }}
              />
              {errors.gasLimit && (
                <ErrorWrapper>
                  <DivError>
                    <InputError marginTop="0">{errors.gasLimit.message}</InputError>
                  </DivError>
                </ErrorWrapper>
              )}
            </DivBodyNetwork>
            <DivBodyNetwork>
              <BaseTextInput
                title="Finish Crosschain Gas Station"
                height="auto"
                onChange={(e) => setValue('xChainGasStation', e.target.value)}
                inputProps={{
                  placeholder: 'Finish Crosschain Gas Station',
                  ...register('xChainGasStation', {
                    required: true,
                  }),
                }}
              />
              {errors.xChainGasStation && (
                <ErrorWrapper>
                  <DivError>
                    <InputError marginTop="0">{errors.xChainGasStation.message}</InputError>
                  </DivError>
                </ErrorWrapper>
              )}
            </DivBodyNetwork>
            <DivBodyNetwork>
              <BaseTextInput
                title="Crosschain Gas Limit"
                height="auto"
                onChange={(e) => setValue('xChainGasLimit', e.target.value)}
                inputProps={{
                  type: 'number',
                  placeholder: 'Crosschain Gas Limit',
                  ...register('xChainGasLimit', {
                    required: {
                      value: true,
                      message: 'This field is required.',
                    },
                  }),
                }}
              />
              {errors.xChainGasLimit && (
                <ErrorWrapper>
                  <DivError>
                    <InputError marginTop="0">{errors.xChainGasLimit.message}</InputError>
                  </DivError>
                </ErrorWrapper>
              )}
            </DivBodyNetwork>
            <DivBodyNetwork>
              <BaseTextInput
                title="Crosschain Gas Price"
                height="auto"
                onChange={(e) => setValue('xChainGasPrice', e.target.value)}
                inputProps={{
                  type: 'number',
                  step: 'any',
                  placeholder: 'Crosschain Gas Price',
                  ...register('xChainGasPrice', {
                    required: {
                      value: true,
                      message: 'This field is required.',
                    },
                    validate: {
                      required: (val) => !Number.isNaN(val) || 'Invalid value',
                    },
                  }),
                }}
              />
              {errors.xChainGasPrice && (
                <ErrorWrapper>
                  <DivError>
                    <InputError marginTop="0">{errors.xChainGasPrice.message}</InputError>
                  </DivError>
                </ErrorWrapper>
              )}
            </DivBodyNetwork>
          </form>
          <div>
            <Button label="Restore default" variant="disabled" onClick={restoreDefault} />
          </div>
          <div style={{ display: 'flex', margin: '10px 0', gap: 10 }}>
            <Button label="Cancel" variant="disabled" onClick={() => reset(getDefaultData())} />
            <ButtonAdd form="save-network" type="submit">
              Save
            </ButtonAdd>
          </div>
        </Content>
      </Body>
    </SettingBody>
  );
};

export default PageTransaction;
