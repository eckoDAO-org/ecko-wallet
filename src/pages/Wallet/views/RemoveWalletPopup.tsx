/* eslint-disable no-console */
import { useState } from 'react';
import { BaseTextInput, InputError } from 'src/baseComponent';
import Button from 'src/components/Buttons';
import styled from 'styled-components';
import bcrypt from 'bcryptjs';
import { BUTTON_SIZE, BUTTON_TYPE } from 'src/utils/constant';
import { setCurrentWallet, setWallets } from 'src/stores/wallet';
import { getLocalCrossRequests, setLocalActivities, setLocalCrossRequests, setLocalSelectedWallet, setLocalWallets } from 'src/utils/storage';
import { encryptKey } from 'src/utils/security';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

const DivChild = styled.div`
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.color};
  margin-top: ${(props) => props.marginTop};
  margin-left: ${(props) => props.marginLeft};
  margin-right: ${(props) => props.marginRight};
  margin-bottom: ${(props) => props.marginBottom};
  font-weight: ${(props) => props.fontWeight};
`;
const DivFlex = styled.div`
  display: flex;
  justify-content: ${(props) => props.justifyContent};
  margin-bottom: ${(props) => props.marginBottom};
  cursor: ${(props) => props.cursor};
`;

const RemoveWalletContent = styled.div`
  padding: 40px 0 20px 0;
`;
const RemoveWalletText = styled(DivChild)`
  text-align: center;
`;
const DesRemoveWallet = styled.div`
  text-align: center;
  font-size: 16px;
  @media screen and (max-width: 480px) {
    font-size: 16px;
  }
`;
const ActionButton = styled(DivFlex)`
  justify-content: space-between;
  gap: 5px;
`;
const DivBody = styled.div`
  width: 100%;
  text-align: left;
  font-size: 16px;
  line-height: 40px;
  align-items: center;
  margin: 30px 0 40px 0;
`;
const RemoveButton = styled.button`
  width: 100%;
  height: 44px;
  border-radius: 10px;
  font-size: 16px;
  font-family: 'Play', sans-serif;
  background: ${(props) => (props.disabled ? 'white' : '#461A57')};
  color: ${(props) => (props.disabled ? '#461A57' : '#ffffff')};
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  border: 1px solid #461a57;
  border: none;
  font-weight: 700;
`;
const DivError = styled.div`
  margin-top: 10px;
  min-height: 50px;
`;
const RemoveWalletPopup = (props: Props) => {
  const { onClose } = props;
  const history = useHistory();
  const rootState = useSelector((state) => state);
  const { passwordHash, selectedNetwork } = rootState.extensions;
  const { wallets, chainId, account } = rootState.wallet;
  const [passwordInput, setPasswordInput] = useState('');

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm();
  const onChangeInput = (e) => {
    clearErrors('password');
    setPasswordInput(e.target.value);
    setValue('password', e.target.value);
  };
  const confirm = () => {
    bcrypt.compare(passwordInput, passwordHash, (_errors, isValid) => {
      if (isValid) {
        const newWallets = wallets.filter((w: any) => w.account !== account);
        const sameAccountWallet: any = newWallets.find((w: any) => w.account === account);
        if (sameAccountWallet && sameAccountWallet.account) {
          getLocalCrossRequests(
            selectedNetwork.networkId,
            (crossChainRequests) => {
              // Remove finish crosschain requests
              const requests = crossChainRequests.filter((r: any) => r.sender !== account);
              setLocalCrossRequests(selectedNetwork.networkId, requests);
            },
            () => {},
          );
        }
        if (newWallets.length === 0) {
          setCurrentWallet({
            chainId: '0',
            account: '',
            publicKey: '',
            secretKey: '',
            connectedSites: [],
          });
          setLocalSelectedWallet({
            chainId: '0',
            account: '',
            publicKey: '',
            secretKey: '',
            connectedSites: [],
          });
          setLocalWallets(selectedNetwork.networkId, []);
          setWallets([]);
          setLocalActivities(selectedNetwork.networkId, chainId, account, []);
          history.push('/init');
        } else {
          setWallets(newWallets);
          setCurrentWallet(newWallets[0]);
          const newLocalWallets = newWallets.map((w: any) => ({
            account: encryptKey(w.account, passwordHash),
            publicKey: encryptKey(w.publicKey, passwordHash),
            secretKey: encryptKey(w.secretKey, passwordHash),
            chainId: w.chainId,
            connectedSites: w.connectedSites,
          }));
          setLocalSelectedWallet(newLocalWallets[0]);
          setLocalWallets(selectedNetwork.networkId, newLocalWallets);
          setLocalActivities(selectedNetwork.networkId, chainId, account, []);
        }
        onClose();
      } else {
        setError('password', { type: 'manual', message: 'Invalid Passwords' });
      }
    });
  };
  const onError = (err) => {
    console.log('err', err);
  };
  return (
    <RemoveWalletContent>
      <RemoveWalletText fontSize="24px" fontWeight="700" marginBottom="20px">
        Remove Wallet?
      </RemoveWalletText>
      <DesRemoveWallet>Input password to remove this wallet</DesRemoveWallet>
      <form onSubmit={handleSubmit(confirm, onError)} id="validate-password-form">
        <DivBody>
          <BaseTextInput
            inputProps={{
              type: 'password',
              placeholder: 'Input password',
              maxLength: '1000',
              ...register('password', {
                required: {
                  value: true,
                  message: 'This field is required.',
                },
                minLength: {
                  value: 8,
                  message: 'Password should be minimum 8 characters.',
                },
                maxLength: {
                  value: 256,
                  message: 'Password should be maximum 256 characters.',
                },
              }),
            }}
            typeInput="password"
            title=""
            height="auto"
            onChange={onChangeInput}
          />
          <DivError>{errors.password && <InputError marginTop="0">{errors.password.message}</InputError>}</DivError>
        </DivBody>
      </form>
      <DivChild>
        <ActionButton>
          <Button label="Cancel" onClick={onClose} type={BUTTON_TYPE.DISABLE} size={BUTTON_SIZE.FULL} />
          <RemoveButton form="validate-password-form" disabled={!passwordInput}>
            Remove
          </RemoveButton>
        </ActionButton>
      </DivChild>
    </RemoveWalletContent>
  );
};
type Props = {
  onClose?: any;
};
export default RemoveWalletPopup;
