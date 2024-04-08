import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { NavigationHeader } from 'src/components/NavigationHeader';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { useGoHome } from 'src/hooks/ui';
import { Body, FormSend, SelectWrapper } from './styles';
import Transfer from './views/Transfer';
import SelectReceiver from './views/SelectReceiver';
import { IFungibleToken, IFungibleTokensByNetwork, LOCAL_DEFAULT_FUNGIBLE_TOKENS, LOCAL_KEY_FUNGIBLE_TOKENS } from '../ImportToken';

const Wrapper = styled.div`
  padding: 0 20px;
`;

const SendTransactions = () => {
  const goHome = useGoHome();
  const { search } = useLocation();
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const networkId = selectedNetwork?.networkId;
  const [fungibleTokens] = useLocalStorage<IFungibleTokensByNetwork>(LOCAL_KEY_FUNGIBLE_TOKENS, LOCAL_DEFAULT_FUNGIBLE_TOKENS);
  const fungibleTokensByNetwork = (fungibleTokens && fungibleTokens[networkId]) || [];
  const [step, setStep] = useState(0);
  const [destinationAccount, setDestinationAccount] = useState();
  const [sourceChainId, setSourceChainId] = useState('');

  const params = new URLSearchParams(search);
  const coin = params.get('coin');
  const chainId = params.get('chainId');

  const token: IFungibleToken = fungibleTokensByNetwork?.find((ft) => ft.contractAddress === coin) || { symbol: 'kda', contractAddress: 'coin' };

  const goBack = () => {
    if (step > 0) {
      setStep(0);
    } else {
      goHome();
    }
  };
  const goToTransfer = (account, sourceChainIdValue) => {
    setDestinationAccount(account);
    setSourceChainId(sourceChainIdValue);
    setStep(1);
  };
  return (
    <Wrapper>
      <NavigationHeader title={`Send ${token?.symbol?.toUpperCase()} Transaction`} onBack={goBack} />
      <Body>
        <FormSend>
          <SelectWrapper isHide={step !== 0}>
            <SelectReceiver sourceChainId={chainId} goToTransfer={goToTransfer} fungibleToken={token || { symbol: 'kda', contractAddress: 'coin' }} />
          </SelectWrapper>
          {step > 0 && (
            <Transfer
              sourceChainId={sourceChainId}
              destinationAccount={destinationAccount}
              fungibleToken={token || { symbol: 'kda', contractAddress: 'coin' }}
            />
          )}
        </FormSend>
      </Body>
    </Wrapper>
  );
};

export default SendTransactions;
