import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Back from 'src/components/Back';
import { setActiveTab } from 'src/stores/extensions';
import { ACTIVE_TAB } from 'src/utils/constant';
import {
  PageSendTransaction,
  Title,
  Body,
  TransactionWrapper,
  FormSend,
  SelectWrapper,
} from './styles';
import Transfer from './views/Transfer';
import SelectReceiver from './views/SelectReceiver';

const Wrapper = styled(TransactionWrapper)`
  padding: 0;
`;
const Header = styled.div`
  padding: 0 20px;
`;

const SendTransactions = () => {
  const history = useHistory();
  const [step, setStep] = useState(0);
  const [destinationAccount, setDestinationAccount] = useState();
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
            {step > 0 && <Transfer destinationAccount={destinationAccount} />}
          </FormSend>
        </Body>
      </Wrapper>
    </PageSendTransaction>
  );
};

export default SendTransactions;
