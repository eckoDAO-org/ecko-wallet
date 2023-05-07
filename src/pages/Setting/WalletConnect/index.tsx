import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import images from 'src/images';
import styled from 'styled-components';
import Button from 'src/components/Buttons';
import { getWalletConnectActiveSessions, initWalletConnect, removeWalletConnectSession } from 'src/utils/message';
import { BaseTextInput, InputError } from 'src/baseComponent';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { ConfirmModal } from 'src/components/ConfirmModal';
import { ReactComponent as TrashIcon } from 'src/images/trash-icon.svg';
import { NavigationHeader } from 'src/components/NavigationHeader';
import { CommonLabel, DivFlex, SecondaryLabel, StickyFooter } from 'src/components';
import { useModalContext } from 'src/contexts/ModalContext';
import Toast from 'src/components/Toast/Toast';
import SelectAccount from './components/SelectAccount';

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

const CustomButton = styled.div`
  margin-top: 20px;
`;

const PageWalletConnect = () => {
  const history = useHistory();
  const [code, setCode] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [isCodeModalOpen, setIsOpenCodeModal] = useState(false);
  const [walletConnectSessions, setWalletConnectSessions] = useState<any[]>([]);
  const { openModal, closeModal } = useModalContext();

  const goBack = () => {
    history.goBack();
  };

  const onChangeInput = (e) => {
    setCode(e.target.value);
  };

  const receiveMessage = (message) => {
    if (message?.action === 'walletConnect:sessions' && message?.data) {
      const sessions = Object.keys(message?.data).map((topicId) => message?.data[topicId]);
      setWalletConnectSessions(sessions);
    }
  };

  useEffect(() => {
    const setupListener = () => {
      (window as any)?.chrome?.runtime?.onMessage?.addListener(receiveMessage);
    };

    setupListener();
    return () => {
      (window as any)?.chrome?.runtime?.onMessage?.removeListener(receiveMessage);
    };
  }, []);

  const requestWalletConnectSessions = async () => {
    await getWalletConnectActiveSessions();
  };

  useEffect(() => {
    requestWalletConnectSessions();
  }, []);

  const onSelectAccounts = (accounts) => {
    if (accounts.length) {
      initWalletConnect(code, accounts);
      setTimeout(() => {
        closeModal();
        history.push('/setting');
      }, 2000);
    }
  };

  const handleConfirmCode = async () => {
    setErrorCode('');
    if (code !== '') {
      openModal({
        title: 'Select accounts',
        content: <SelectAccount onConfirmAccounts={(accounts) => onSelectAccounts(accounts)} />,
      });
      setIsOpenCodeModal(false);
    } else {
      setErrorCode('Invalid URL');
    }
  };

  const onRemoveWalletConnectSession = (topic) => {
    removeWalletConnectSession(topic);
    toast.success(<Toast type="success" content="Disconnect request sent successfully" />);
    closeModal();
    history.push('/setting');
  };

  return (
    <Wrapper>
      <NavigationHeader title="Wallet Connect" onBack={goBack} />
      <DivFlex flexDirection="column">
        <SecondaryLabel textCenter fontWeight={500} margin="20px 0">
          {walletConnectSessions?.length === 0 ? 'NO ACTIVE SESSIONS' : 'ACTIVE SESSIONS'}
        </SecondaryLabel>
        {walletConnectSessions.map((s) => (
          <DivFlex padding="10px 0" alignItems="center" justifyContent="space-between">
            <DivFlex gap="15px" alignItems="center">
              <img style={{ height: 25 }} src={s?.peer?.metadata?.icons[0] || images.settings.iconNetwork} />
              <DivFlex flexDirection="column">
                <CommonLabel fontWeight={600}>{s?.peer?.metadata?.name}</CommonLabel>
                <CommonLabel fontSize={12}>{s?.peer?.metadata?.url}</CommonLabel>
                <CommonLabel fontWeight={600} style={{ marginTop: 10 }}>
                  Expiry:
                </CommonLabel>
                <CommonLabel fontSize={12}>{moment.unix(s.expiry).format('DD/MM/YYYY HH:mm')}</CommonLabel>
              </DivFlex>
            </DivFlex>
            <TrashIcon
              style={{ cursor: 'pointer' }}
              onClick={() => {
                openModal({
                  title: 'Remove Connection',
                  content: (
                    <ConfirmModal
                      text={
                        <>
                          Are you sure you want remove <br />
                          this WalletConnect instance?
                        </>
                      }
                      onClose={closeModal}
                      onConfirm={() => onRemoveWalletConnectSession(s.topic)}
                    />
                  ),
                });
              }}
            />
          </DivFlex>
        ))}
      </DivFlex>
      <StickyFooter>
        <DivFlex style={{ width: '90%' }}>
          <Button size="full" variant="primary" onClick={() => setIsOpenCodeModal(true)} label="New connection" />
        </DivFlex>
      </StickyFooter>
      <ModalCustom isOpen={isCodeModalOpen} title="Add new Wallet Connect" onCloseModal={() => setIsOpenCodeModal(false)}>
        <div style={{ padding: 24 }}>
          <BaseTextInput
            inputProps={{ placeholder: 'Input uri' }}
            title="Code"
            height="auto"
            onChange={(e) => onChangeInput(e)}
            onKeyPress={(event) => {
              if (event.key === 'Enter') {
                handleConfirmCode();
              }
            }}
          />
          {errorCode && <InputError>{errorCode}</InputError>}
          <CustomButton>
            <Button size="full" variant="primary" onClick={() => handleConfirmCode()} isDisabled={!code} label="Continue" />
          </CustomButton>
        </div>
      </ModalCustom>
    </Wrapper>
  );
};
export default PageWalletConnect;
