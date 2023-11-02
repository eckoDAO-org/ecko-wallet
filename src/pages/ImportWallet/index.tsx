/* eslint-disable no-console */
import { useState } from 'react';
import { BaseTextInput, BaseSelect, InputError } from 'src/baseComponent';
import { useSelector } from 'react-redux';
import QrReader from 'react-qr-reader';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { hideLoading, showLoading } from 'src/stores/slices/extensions';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import images from 'src/images';
import { ActionFooter, PageWrapper } from 'src/components';
import { setCurrentWallet, setWallets } from 'src/stores/slices/wallet';
import { NavigationHeader } from 'src/components/NavigationHeader';
import Button from 'src/components/Buttons';
import { useWindowResizeMobile } from 'src/hooks/useWindowResizeMobile';
import styled from 'styled-components';
import useChainIdOptions from 'src/hooks/useChainIdOptions';
import { useGoHome } from 'src/hooks/ui';
import { Controller, useForm } from 'react-hook-form';
import Pact from 'pact-lang-api';
import { encryptKey } from 'src/utils/security';
import { find, isEmpty, get } from 'lodash';
import { useHistory } from 'react-router-dom';
import { getLocalPassword, getLocalWallets, setLocalSelectedWallet, setLocalWallets } from 'src/utils/storage';
import { fetchLocal } from '../../utils/chainweb';

const DivBody = styled.div`
  width: 100%;
  text-align: left;
  font-size: 20px;
  display: flex;
  align-items: center;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const Body = styled.div`
  height: auto;
  width: 100%;
`;
const DivChild = styled.div`
  margin-top: 20px;

  text-align: center;
`;
const TitleModal = styled.div`
  text-align: center;
  font-size: 20px;
  font-weight: 700;

  margin-bottom: 15px;
`;
const ImportAccount = () => {
  const optionsChain = useChainIdOptions();
  const history = useHistory();
  const goHome = useGoHome();
  const [isMobile] = useWindowResizeMobile(420);
  const rootState = useSelector((state) => state);
  const { wallets, account } = rootState?.wallet;
  const { selectedNetwork, isLoading } = rootState?.extensions;
  const [isScanAccount, setScanAccount] = useState(false);
  const [isScanPrivateKey, setScanPrivateKey] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    clearErrors,
    getValues,
  } = useForm();

  const onImport = async (data) => {
    if (isLoading) return;
    const { chainId, accountName, secretKey } = data;
    try {
      const { publicKey } = Pact.crypto.restoreKeyPairFromSecretKey(data.secretKey);
      const pactCode = `(coin.details "${accountName}")`;
      showLoading();
      fetchLocal(pactCode, selectedNetwork.url, selectedNetwork.networkId, chainId.value)
        .then((request) => {
          hideLoading();
          const publicCodeFromRequest = get(request, 'result.data.guard.keys[0]');
          const keySets = get(request, 'result.data.guard.keys');
          const status = get(request, 'result.status');
          const doesNotExist = request?.result?.error?.message?.startsWith('with-read: row not found:');
          if ((keySets && keySets.length === 1) || doesNotExist) {
            if ((publicCodeFromRequest && publicCodeFromRequest === publicKey) || doesNotExist) {
              getLocalPassword(
                (accountPassword) => {
                  const isWalletEmpty = isEmpty(find(wallets, (e) => e.chainId === chainId.value && e.account === accountName));
                  if (isWalletEmpty) {
                    const wallet = {
                      account: encryptKey(accountName, accountPassword),
                      publicKey: encryptKey(publicKey, accountPassword),
                      secretKey: encryptKey(secretKey, accountPassword),
                      chainId: chainId.value,
                      connectedSites: [],
                    };
                    getLocalWallets(
                      selectedNetwork.networkId,
                      (item) => {
                        const newData = [...item, wallet];
                        setLocalWallets(selectedNetwork.networkId, newData);
                      },
                      () => {
                        setLocalWallets(selectedNetwork.networkId, [wallet]);
                      },
                    );
                    const newStateWallet = {
                      chainId: chainId.value,
                      account: accountName,
                      publicKey,
                      secretKey,
                      connectedSites: [],
                    };
                    const newWallets = [...wallets, newStateWallet];
                    setWallets(newWallets);
                    setLocalSelectedWallet(wallet);
                    setCurrentWallet(newStateWallet);
                    toast.success(<Toast type="success" content="Import account successfully." />);
                    goHome();
                  } else {
                    toast.error(<Toast type="fail" content="The account you are trying to import is a duplicate." />);
                  }
                },
                () => {},
              );
            } else {
              toast.error(<Toast type="fail" content="Invalid account data" />);
            }
          } else if (status === 'success') {
            toast.error(<Toast type="fail" content="Multiple key sets are not supported" />);
          } else {
            toast.error(<Toast type="fail" content="Invalid data" />);
          }
        })
        .catch(() => {
          hideLoading();
          toast.error(<Toast type="fail" content="Network error." />);
        });
    } catch (e) {
      toast.error(<Toast type="fail" content="Invalid data" />);
    }
  };

  const goBack = () => {
    if (account) {
      history.push(`${history?.location?.state?.from || '/'}`);
    } else {
      history.push('/init');
    }
  };
  const handleScanAccount = (data) => {
    if (data) {
      setValue('accountName', data, { shouldValidate: true });
      setScanAccount(false);
    }
  };
  const handleScanPrivateKey = (data) => {
    if (data) {
      setValue('secretKey', data, { shouldValidate: true });
      setScanPrivateKey(false);
    }
  };
  return (
    <PageWrapper>
      <NavigationHeader title="Import Wallet" onBack={goBack} />
      <Body>
        <form onSubmit={handleSubmit(onImport)} id="import-wallet-form">
          <DivBody>
            <BaseTextInput
              inputProps={{
                placeholder: 'Account Name',
                ...register('accountName', {
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                  validate: {
                    required: (val) => val.trim().length > 0 || 'Invalid data',
                    startsWithK: (val) => val.startsWith('k:') || 'Account name must start with "k:"',
                  },
                  maxLength: {
                    value: 1000,
                    message: 'Account name should be maximum 1000 characters.',
                  },
                }),
              }}
              title="Your Account Name"
              height="auto"
              image={{
                width: '20px',
                height: '20px',
                src: images.initPage.qrcode,
                callback: () => setScanAccount(true),
              }}
              onChange={(e) => {
                clearErrors('accountName');
                setValue('accountName', e.target.value);
              }}
            />
            {errors.accountName && <InputError>{errors.accountName.message}</InputError>}
          </DivBody>
          <DivBody>
            <Controller
              control={control}
              name="chainId"
              rules={{
                required: {
                  value: true,
                  message: 'This field is required.',
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <BaseSelect
                  selectProps={{
                    onChange,
                    onBlur,
                    value,
                  }}
                  options={optionsChain}
                  title="Chain ID"
                  height="auto"
                />
              )}
            />
            {errors.chainId && !getValues('chainId') && <InputError>{errors.chainId.message}</InputError>}
          </DivBody>
          <DivBody>
            <BaseTextInput
              inputProps={{
                placeholder: 'Private Key',
                ...register('secretKey', {
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                  validate: {
                    required: (val) => val.trim().length > 0 || 'Invalid data',
                  },
                  maxLength: {
                    value: 1000,
                    message: 'Private key should be maximum 1000 characters.',
                  },
                }),
              }}
              title="Your Private Key"
              height="auto"
              image={{
                width: '20px',
                height: '20px',
                src: images.initPage.qrcode,
                callback: () => setScanPrivateKey(true),
              }}
              onChange={(e) => {
                clearErrors('secretKey');
                setValue('secretKey', e.target.value);
              }}
              onBlur={(e) => setValue('secretKey', e.target.value.trim())}
            />
            {errors.secretKey && <InputError>{errors.secretKey.message}</InputError>}
          </DivBody>
        </form>
      </Body>
      {isScanAccount && (
        <ModalCustom isOpen={isScanAccount} onCloseModal={() => setScanAccount(false)}>
          <Body>
            <TitleModal>Scan QR Code</TitleModal>
            <QrReader
              delay={1000}
              onError={() => {
                if (isMobile) {
                  (window as any)?.chrome?.tabs?.create({ url: `/index.html#${history?.location?.pathname}` });
                }
              }}
              onScan={handleScanAccount}
              style={{ width: '100%' }}
            />
            <DivChild>Place the QR code in front of your camera</DivChild>
          </Body>
        </ModalCustom>
      )}
      {isScanPrivateKey && (
        <ModalCustom isOpen={isScanPrivateKey} onCloseModal={() => setScanPrivateKey(false)}>
          <Body>
            <TitleModal>Scan QR Code</TitleModal>
            <QrReader
              delay={1000}
              onError={() => {
                if (isMobile) {
                  (window as any)?.chrome?.tabs?.create({ url: `/index.html#${history?.location?.pathname}` });
                }
              }}
              onScan={handleScanPrivateKey}
              style={{ width: '100%' }}
            />
            <DivChild>Place the QR code in front of your camera</DivChild>
          </Body>
        </ModalCustom>
      )}
      <ActionFooter>
        <Button label="Import wallet" size="full" form="import-wallet-form" />
      </ActionFooter>
    </PageWrapper>
  );
};
export default ImportAccount;
