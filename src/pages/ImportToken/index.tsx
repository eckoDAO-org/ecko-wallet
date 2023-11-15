import { useEffect, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { useForm } from 'react-hook-form';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { BaseTextInput, InputError } from 'src/baseComponent';
import { useCurrentWallet } from 'src/stores/slices/wallet/hooks';
import { fetchListLocal } from 'src/utils/chainweb';
import { hideLoading, showLoading } from 'src/stores/slices/extensions';
import { KNOWN_TOKENS } from 'src/utils/constant';
import { SettingsContext } from 'src/contexts/SettingsContext';
import { useGoHome } from 'src/hooks/ui';
import Button from 'src/components/Buttons';
import { NavigationHeader } from 'src/components/NavigationHeader';

export const LOCAL_KEY_FUNGIBLE_TOKENS = 'fungibleTokens';
export const LOCAL_DEFAULT_FUNGIBLE_TOKENS = [
  { contractAddress: 'kaddex.kdx', symbol: 'kdx' },
  { contractAddress: 'n_b742b4e9c600892af545afb408326e82a6c0c6ed.zUSD', symbol: 'zUSD' },
];

export interface IFungibleToken {
  contractAddress: string;
  symbol: string;
}

const ImportTokenWrapper = styled.div`
  padding: 0 20px;
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
const ButtonSubmit = styled(Button)``;
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
  const goHome = useGoHome();
  const [fungibleTokens, setFungibleTokens] = useLocalStorage<IFungibleToken[]>(LOCAL_KEY_FUNGIBLE_TOKENS, []);
  const { data: settings } = useContext(SettingsContext);
  const txSettings = settings?.txSettings;

  const params = new URLSearchParams(search);
  const coin = params.get('coin');
  const suggest = params.get('suggest');
  const token = fungibleTokens?.find((ft) => ft.contractAddress === coin);

  const checkTokenExists = async (contractAddress: string) => {
    showLoading();
    const { account } = stateWallet;
    const pactCode = `(${contractAddress}.details "${account}")`;
    for (let i = 0; i < 20; i += 1) {
      try {
        /* eslint-disable no-await-in-loop */
        const res = await fetchListLocal(pactCode, selectedNetwork.url, selectedNetwork.networkId, i, txSettings?.gasPrice, txSettings?.gasLimit);
        if (res?.result?.error?.message?.startsWith('with-read: row not found') || res?.result?.status === 'success') {
          hideLoading();
          return true;
        }
        // contractAddress not exists on chain i
      } catch (err) {
        // contractAddress not exists on chain i
      }
    }
    hideLoading();
    return false;
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

  useEffect(() => {
    if (suggest) {
      setValue('contractAddress', suggest);
    }
  }, []);

  const onImport = async (fT: IFungibleToken | any) => {
    const alreadyExists = fungibleTokens?.find((fungToken) => fungToken.contractAddress === fT.contractAddress);
    if (!token && alreadyExists) {
      toast.error(<Toast type="error" content="Token already added" />);
    } else {
      const tokenExists = await checkTokenExists(fT.contractAddress);
      if (!tokenExists) {
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
        goHome();
      }
    }
  };
  return (
    <ImportTokenWrapper>
      <NavigationHeader title="Import Tokens" />
      <Body>
        <form onSubmit={handleSubmit(onImport)} id="import-token-form">
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
        <ButtonSubmit variant="primary" size="full" form="import-token-form" label={`${token ? 'Edit' : 'Add'} Token`} />
      </Footer>
    </ImportTokenWrapper>
  );
};

export default ImportToken;
