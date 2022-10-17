import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Back from 'src/components/Back';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { setActiveTab } from 'src/stores/extensions';
import { ACTIVE_TAB } from 'src/utils/constant';
import { PageSendTransaction, Title, Body, TransactionWrapper, FormSend, SelectWrapper } from './styles';
import Transfer from './views/Transfer';
import SelectReceiver from './views/SelectReceiver';
import { IFungibleToken, LOCAL_KEY_FUNGIBLE_TOKENS } from '../ImportToken';

const Wrapper = styled(TransactionWrapper)`
  padding: 0;
`;
const Header = styled.div`
  padding: 0 20px;
`;

const SendTransactions = () => {
  const history = useHistory();
  const { search } = useLocation();
  const [fungibleTokens] = useLocalStorage<IFungibleToken[]>(LOCAL_KEY_FUNGIBLE_TOKENS, []);
  const [step, setStep] = useState(0);
  const [destinationAccount, setDestinationAccount] = useState();

  const params = new URLSearchParams(search);
  const coin = params.get('coin');
  const chainId = params.get('chainId');

  const token = fungibleTokens?.find((ft) => ft.symbol === coin);

  const goBack = () => {
    if (step > 0) {
      setStep(0);
    } else {
      history.push('/');
      setActiveTab(ACTIVE_TAB.HOME);
    }
  };
  const goToTransfer = (account) => {
    setDestinationAccount(account);
    setStep(1);
  };
  return (
    <PageSendTransaction>
      <Wrapper>
        <Header>
          <Back title="Back" onBack={goBack} />
          <Title isSendTitle>Send Transaction</Title>
        </Header>
        <Body>
          <FormSend>
            <SelectWrapper isHide={step !== 0}>
              <SelectReceiver goToTransfer={goToTransfer} />
            </SelectWrapper>
            {step > 0 && (
              <Transfer
                chainId={chainId}
                destinationAccount={destinationAccount}
                fungibleToken={token || { symbol: 'kda', contractAddress: 'coin' }}
              />
            )}
          </FormSend>
        </Body>
      </Wrapper>
    </PageSendTransaction>
  );
};

export default SendTransactions;
