/* eslint-disable no-console */
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { ButtonAdd, ButtonWrapper } from 'src/pages/SendTransactions/views/style';
import Button from 'src/components/Buttons';
import { TxSettingsContextData, TxSettingsContext } from 'src/contexts/TxSettingsContext';
import { BUTTON_SIZE, BUTTON_TYPE } from 'src/utils/constant';
import { BaseTextInput, InputError } from 'src/baseComponent';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Back from 'src/components/Back';
import Toast from 'src/components/Toast/Toast';
import { ErrorWrapper } from 'src/pages/SendTransactions/styles';
import { ButtonBack, Content, SettingBody, TitleHeader } from '../style';
import { DivBodyNetwork } from '../Networks/views/style';
import { Body, DivError, Footer } from '../Contact/views/style';

const PageTransaction = () => {
  const history = useHistory();
  const { data, setTxSettings } = useContext(TxSettingsContext);

  const getDefaultData = (): any => ({ ...data, gasPrice: data?.gasPrice?.toFixed(6), xChainGasPrice: data?.xChainGasPrice?.toFixed(8) });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({ defaultValues: getDefaultData() });

  const onSave = (dataSubmit: TxSettingsContextData) => {
    console.log('🚀 !!! ~ dataSubmit', dataSubmit);
    const toSubmit = {
      ...dataSubmit,
      gasLimit: Number(dataSubmit.gasLimit),
      gasPrice: Number(dataSubmit.gasPrice),
      xChainGasLimit: Number(dataSubmit.xChainGasLimit),
      xChainGasPrice: Number(dataSubmit.xChainGasPrice),
    };
    console.log('🚀 !!! ~ toSubmit', toSubmit);
    setTxSettings(toSubmit);
    toast.success(<Toast type="success" content="" />);
    history.push('/setting');
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
                title="Gas Price"
                height="auto"
                onChange={(e) => setValue('gasPrice', e.target.value)}
                inputProps={{
                  placeholder: 'Gas Price',
                  ...register('gasPrice', {
                    required: true,
                    // validate: {
                    //   required: (val) => !Number.isNaN(val) || 'Invalid value',
                    // },
                  }),
                }}
              />
              {errors.gasPrice && (
                <ErrorWrapper>
                  <DivError>
                    <InputError marginTop="0">{errors.gasPrice.message}</InputError>
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
                  placeholder: 'Crosschain Gas Price',
                  ...register('xChainGasPrice', {
                    required: {
                      value: true,
                      message: 'This field is required.',
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
          <Footer>
            <ButtonWrapper>
              <Button label="Cancel" type={BUTTON_TYPE.DISABLE} onClick={() => reset(getDefaultData())} size={BUTTON_SIZE.FULL} />
            </ButtonWrapper>
            <ButtonWrapper>
              <ButtonAdd form="save-network" type="submit">
                Save
              </ButtonAdd>
            </ButtonWrapper>
          </Footer>
        </Content>
      </Body>
    </SettingBody>
  );
};

export default PageTransaction;
