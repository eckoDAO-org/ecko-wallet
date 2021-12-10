import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Back from 'src/components/Back';
import { useForm } from 'react-hook-form';
import { BaseTextInput, InputError } from 'src/baseComponent';

const ImportTokenWrapper = styled.div`
  padding: 0 20px;
`;
const Title = styled.div`
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  display: flex;
  line-height: 25px;
  text-align: left;
  width: fit-content;
  padding-top: 22px;
`;
const Body = styled.div`
  height: auto;
  width: 100%;
`;
const DivBody = styled.div`
  width: 100%;
  text-align: left;
  font-size: 20px;
  display: flex;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
`;
const ButtonSubmit = styled.button`
  width: 100%;
  height: 44px;
  background: #461A57;
  border-radius: 10px;
  font-family: 'Play', sans-serif;
  border: none;
  font-weight: 700;
  color: #ffffff;
  font-size: 16px;
  margin: auto;
  cursor: pointer;
`;
const Footer = styled.div`
  width: 100%;
  text-align: center;
  margin-top: 50px;
  @media screen and (max-width: 480px){
    margin-top: 25px;
  }
`;
const ImportToken = () => {
  const history = useHistory();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm();
  const onImport = () => {};
  return (
    <ImportTokenWrapper>
      <Back title="Back" onBack={() => history.push('/')} />
      <Body>
        <form onSubmit={handleSubmit(onImport)} id="import-token-form">
          <Title>Import Tokens</Title>
          <DivBody>
            <BaseTextInput
              inputProps={{
                placeholder: 'Input Contract Address',
                ...register('contractAddress', {
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                  validate: {
                    required: (val) => val.trim().length > 0 || 'Invalid data',
                  },
                }),
              }}
              title="Token Contract Address"
              height="auto"
              onChange={(e) => { clearErrors('contractAddress'); setValue('contractAddress', e.target.value); }}
            />
            {errors.contractAddress && <InputError>{errors.contractAddress.message}</InputError>}
          </DivBody>
          <DivBody>
            <BaseTextInput
              inputProps={{
                placeholder: 'Input Symbol',
                ...register('symbol', {
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                  validate: {
                    required: (val) => val.trim().length > 0 || 'Invalid data',
                  },
                }),
              }}
              title="Token Symbol"
              height="auto"
              onChange={(e) => { clearErrors('symbol'); setValue('symbol', e.target.value); }}
            />
            {errors.symbol && <InputError>{errors.symbol.message}</InputError>}
          </DivBody>
          <DivBody>
            <BaseTextInput
              inputProps={{
                placeholder: 'Input Decimal',
                type: 'number',
                ...register('decimalToken', {
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                  validate: {
                    positive: (v) => {
                      const value = Number(v);
                      return value > 0;
                    },
                    isInteger: (v) => {
                      const reg = /^\d+$/;
                      return reg.test(v);
                    },
                  },
                }),
              }}
              title="Token Decimal"
              height="auto"
              onChange={(e) => { clearErrors('decimalToken'); setValue('decimalToken', e.target.value); }}
            />
            {errors.decimalToken && errors.decimalToken.type === 'required' && <InputError>{errors.decimalToken.message}</InputError>}
            {errors.decimalToken && errors.decimalToken.type === 'positive' && <InputError>Invalid Token Decimal</InputError>}
            {errors.decimalToken && errors.decimalToken.type === 'isInteger' && <InputError>Token Decimal must be integer</InputError>}
          </DivBody>
        </form>
      </Body>
      <Footer>
        <ButtonSubmit form="import-token-form">Add Custom Token</ButtonSubmit>
      </Footer>
    </ImportTokenWrapper>
  );
};

export default ImportToken;
