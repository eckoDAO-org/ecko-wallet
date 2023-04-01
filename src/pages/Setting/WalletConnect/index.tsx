import { useHistory } from 'react-router-dom';
import images from 'src/images';
import styled from 'styled-components';
import Button from 'src/components/Buttons';
import { useState } from 'react';
import { initWalletConnect } from 'src/utils/message';
import { BaseTextInput } from 'src/baseComponent';
import { NavigationHeader } from 'src/components/NavigationHeader';
import { DivFlex, SecondaryLabel } from 'src/components';
import { useModalContext } from 'src/contexts/ModalContext';
import SelectAccount from './components/SelectAccount';

const Body = styled.div`
  height: 170px;
`;

const Wrapper = styled.div`
  padding: 0 20px;

  font-size: 16px;
  word-break: break-word;
`;

export const SPWrapper = styled.div`
  padding: 16px;
  font-size: 16px;
  position: relative;
  box-shadow: 0px 167px 67px rgba(36, 8, 43, 0.01), 0px 94px 57px rgba(36, 8, 43, 0.03), 0px 42px 42px rgba(36, 8, 43, 0.06),
    0px 10px 23px rgba(36, 8, 43, 0.06), 0px 0px 0px rgba(36, 8, 43, 0.07);
  border-radius: 25px;
  box-sizing: border-box;
  text-align: center;
`;

const LockImage = styled.img`
  width: 28px;
  height: 35px;
`;

const CustomButton = styled.div`
  margin-top: 20px;
`;

const PageWalletConnect = () => {
  const history = useHistory();
  const [code, setCode] = useState('');
  const { openModal, closeModal } = useModalContext();

  const goBack = () => {
    history.goBack();
  };

  const onChangeInput = (e) => {
    setCode(e.target.value);
  };

  const handleConfirmCode = async () => {
    openModal({
      title: 'Select accounts',
      content: (
        <SelectAccount
          onConfirmAccounts={(accounts) => {
            initWalletConnect(code, accounts);
            setTimeout(() => {
              closeModal();
              history.push('/');
            }, 2000);
          }}
        />
      ),
    });
  };

  return (
    <Wrapper>
      <NavigationHeader title="Wallet Connect" onBack={goBack} />
      <DivFlex flexDirection="column" justifyContent="center" alignItems="center" padding="50px 0px">
        <LockImage src={images.settings.iconNetwork} alt="network" />
        <SecondaryLabel fontWeight={500} margin="20px 0">
          Paste here DAPP Wallet Connect code
        </SecondaryLabel>
      </DivFlex>
      <Body>
        <BaseTextInput
          inputProps={{ placeholder: 'Input uri' }}
          title="Code"
          height="auto"
          onChange={onChangeInput}
          onKeyPress={(event) => {
            if (event.key === 'Enter') {
              handleConfirmCode();
            }
          }}
        />
        <CustomButton>
          <Button size="full" variant="primary" onClick={handleConfirmCode} isDisabled={!code} label="Continue" />
        </CustomButton>
      </Body>
    </Wrapper>
  );
};
export default PageWalletConnect;
