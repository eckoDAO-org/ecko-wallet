import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Back from 'src/components/Back';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { useForm } from 'react-hook-form';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { BaseTextInput, InputError } from 'src/baseComponent';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { fetchListLocal } from 'src/utils/chainweb';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { KNOWN_TOKENS } from 'src/utils/constant';

export interface IFungibleToken {
  contractAddress: string;
  symbol: string;
}

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
  background: #461a57;
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
  @media screen and (max-width: 480px) {
    margin-top: 25px;
  }
`;
const ImportToken = () => {
  const stateWallet = useCurrentWallet();
  const { search } = useLocation();
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const history = useHistory();
  const [fungibleTokens, setFungibleTokens] = useLocalStorage<IFungibleToken[]>('fungibleTokens', []);

  const params = new URLSearchParams(search);
  const coin = params.get('coin');
  const token = fungibleTokens?.find((ft) => ft.symbol === coin);

  const checkTokenExists = (contractAddress: string): Promise<any> => {
    const { account } = stateWallet;
    const pactCode = `(${contractAddress}.details "${account}")`;
    return fetchListLocal(pactCode, selectedNetwork.url, selectedNetwork.networkId, '0');
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm();

  useEffect(() => {
    if (token) {
      setValue('contractAddress', token.contractAddress);
      setValue('symbol', token.symbol);
    }
  }, [token]);

  const onImport = async (fT: IFungibleToken) => {
    const alreadyExists = fungibleTokens?.find((fungToken) => fungToken.contractAddress === fT.contractAddress);
    if (!token && alreadyExists) {
      toast.error(<Toast type="error" content="Token already added" />);
    } else {
      checkTokenExists(fT.contractAddress)
        .then((res) => {
          if (res?.result?.error?.message === `Cannot resolve ${fT.contractAddress}.details`) {
            toast.error(<Toast type="error" content={`Cannot resolve ${fT.contractAddress}.details`} />);
          } else {
            let newFungibleTokens = fungibleTokens || [];
            if (token) {
              newFungibleTokens = fungibleTokens?.filter((ft) => ft.contractAddress !== token.contractAddress) ?? [];
            }
            setFungibleTokens([
              ...newFungibleTokens,
              {
                ...fT,
                symbol: fT.symbol?.toLowerCase(),
              },
            ]);
            toast.success(<Toast type="success" content="Token successfully saved" />);
            history.push('/');
          }
        })
        .catch(() => {
          toast.error(<Toast type="error" content="Unable to add token" />);
        });
    }
  };
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
              onChange={(e) => {
                clearErrors('contractAddress');
                setValue('contractAddress', e.target.value);
                if (KNOWN_TOKENS[e.target.value] && KNOWN_TOKENS[e.target.value]?.symbol) {
                  clearErrors('symbol');
                  setValue('symbol', KNOWN_TOKENS[e.target.value]?.symbol);
                } else {
                  clearErrors('symbol');
                  setValue('symbol', '');
                }
              }}
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
              onChange={(e) => {
                clearErrors('symbol');
                setValue('symbol', e.target.value);
              }}
            />
            {errors.symbol && <InputError>{errors.symbol.message}</InputError>}
          </DivBody>
        </form>
      </Body>
      <Footer>
        <ButtonSubmit form="import-token-form">{`${token ? 'Edit' : 'Add'} Custom Token`}</ButtonSubmit>
      </Footer>
    </ImportTokenWrapper>
  );
};

export default ImportToken;
