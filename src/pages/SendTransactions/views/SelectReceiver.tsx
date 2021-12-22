import { useEffect, useState } from 'react';
import { hideLoading, showLoading } from 'src/stores/extensions';
import { fetchListLocal } from 'src/utils/chainweb';
import { BaseSelect, BaseTextInput, InputError } from 'src/baseComponent';
import { useSelector } from 'react-redux';
import { Controller, useForm } from 'react-hook-form';
import {
  useHistory,
} from 'react-router-dom';
import QrReader from 'react-qr-reader';
import images from 'src/images';
import { toast } from 'react-toastify';
import { useWindowResizeMobile } from 'src/hooks/useWindowResizeMobile';
import Toast from 'src/components/Toast/Toast';
import Tabs from 'src/components/Tabs';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { shortenAddress } from 'src/utils';
import { get } from 'lodash';

import useChainIdOptions from 'src/hooks/useChainIdOptions';
import { BUTTON_SIZE, BUTTON_TYPE } from 'src/utils/constant';
import Button from 'src/components/Buttons';
import {
  ReceiverInput,
  Content,
  ContactWrapper,
  ContactItem,
  ContactTitle,
  Arrow,
  BodyModal,
  TitleModal,
  DivChild,
  ButtonWrapper,
  ButtonImport,
  InputWrapper,
  WarningText,
} from '../styles';
import {
  NoData,
  TransferButton,
  KeyWrapper,
  KeyItemWrapper,
  KeyRemove,
  KeyTitle,
} from './style';

type Props = {
  goToTransfer: any;
}

const predList = [
  {
    label: 'All keys',
    value: 'keys-all',
  },
  {
    label: 'Any single key',
    value: 'keys-any',
  },
];

const SelectReceiver = (props: Props) => {
  const { goToTransfer } = props;
  const [isMobile] = useWindowResizeMobile(420);
  const [isSearching, setIsSearching] = useState(false);
  const [isScanSearching, setIsScanSearching] = useState(false);
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [account, setAccount] = useState<any>({});
  const [pKeys, setPKeys] = useState<any>([]);
  const rootState = useSelector((state) => state);
  const { contacts, recent, selectedNetwork } = rootState.extensions;
  const { wallet } = rootState;
  const history = useHistory();
  const optionsChain = useChainIdOptions();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    clearErrors,
    getValues,
    setError,
  } = useForm();

  useEffect(() => {
    setValue('accountName', '');
    setValue('chainId', { value: null, label: null });
  }, []);

  const onNext = () => {
    const receiver = getValues('accountName');
    const chainId = getValues('chainId').value;
    const isDuplicated = receiver === wallet?.account && chainId.toString() === wallet?.chainId.toString();
    if (isDuplicated) {
      toast.error(<Toast type="fail" content="Can not send to yourself" />);
    } else {
      showLoading();
      const code = `(coin.details "${receiver}")`;
      fetchListLocal(code, selectedNetwork.url, selectedNetwork.networkId, chainId).then((res) => {
        hideLoading();
        setIsSearching(false);
        const status = get(res, 'result.status');
        const exist = status === 'success';
        const pred = get(res, 'result.data.guard.pred');
        const keys = get(res, 'result.data.guard.keys');
        if (exist) {
          const destinationAccount = {
            accountName: receiver,
            chainId,
            pred,
            keys,
          };
          goToTransferAccount(destinationAccount);
        } else {
          setAccount({
            accountName: receiver,
            chainId,
          });
          setIsOpenConfirmModal(true);
        }
      }).catch(() => {
        toast.error(<Toast type="fail" content="Network error" />);
        hideLoading();
        setIsSearching(false);
      });
    }
  };

  const goToTransferAccount = (data) => {
    goToTransfer(data);
    if (isOpenConfirmModal) {
      setIsOpenConfirmModal(false);
    }
  };

  const handleScanSearching = (data) => {
    if (data) {
      clearErrors('accountName');
      setValue('accountName', data);
      setIsScanSearching(false);
    }
  };

  const onAddPublicKey = () => {
    const publicKey = getValues('publicKey');
    if (publicKey.length === 64) {
      if (pKeys.includes(publicKey)) {
        setError('publicKey', { type: 'match', message: 'The public key already in list' });
      } else {
        const newPKeys = [...pKeys, publicKey];
        setPKeys(newPKeys);
        setValue('publicKey', '');
      }
    } else {
      setError('publicKey', { type: 'match', message: 'Key has unexpected length.' });
    }
  };

  const onRemoveKey = (key) => {
    const newKeys = pKeys.filter((k) => k !== key) || [];
    setPKeys(newKeys);
  };

  const checkAfterTransfer = (data) => {
    if (data?.accountName === wallet?.account && data?.chainId?.toString() === wallet?.chainId?.toString()) {
      toast.error(<Toast type="fail" content="Can not send to yourself" />);
    } else {
      goToTransfer(data);
    }
  };

  const renderKeys = () => (
    <KeyWrapper>
      <KeyTitle>Keys:</KeyTitle>
      {pKeys.map((key) => (
        <KeyItemWrapper key={key}>
          {key}
          <KeyRemove src={images.close} alt="remove" onClick={() => onRemoveKey(key)} />
        </KeyItemWrapper>
      ))}
    </KeyWrapper>
  );

  const getTabContent = (data) => (data.length
    ? data.map((contact: any, key) => (
      <ContactWrapper
        onClick={() => {
          setValue('accountName', contact.accountName);
          setValue('chainId', { value: contact.chainId, label: contact.chainId });
          if (contact.keys) {
            checkAfterTransfer({
              accountName: contact.accountName,
              chainId: contact.chainId,
              pred: contact.pred,
              keys: contact.keys,
            });
          }
        }}
        key={`${contact.accountName}-${contact.chainId}`}
      >
        <ContactItem isFirst={key === 0}>
          {contact.aliasName && (
            <ContactTitle>{(contact.aliasName)}</ContactTitle>
          )}
          {shortenAddress(contact.accountName)}
          <br />
          {`Chain ${contact.chainId}`}
        </ContactItem>
        <Arrow src={images.wallet.view} />
      </ContactWrapper>
    ))
    : (
      <NoData>No data</NoData>
    ));
  const tabs = [
    { title: 'Recent', id: 0, content: getTabContent(recent) },
    { title: 'Contact book', id: 1, content: getTabContent(contacts) },
  ];
  const onCreateAccount = () => {
    if (errors.publicKey) return;
    const pred = getValues('pred').value;
    const publicKey = getValues('publicKey');
    let keys:any = [];
    if (pKeys.length > 0) {
      keys = pKeys;
    } else if (publicKey) {
      if (publicKey.length === 64) {
        keys = [publicKey];
      } else {
        setError('publicKey', { type: 'match', message: 'Key has unexpected length.' });
        return;
      }
    } else {
      setError('publicKey', { type: 'match', message: 'This field is required.' });
      return;
    }
    const newAccount = { ...account, pred, keys };
    setValue('publicKey', '');
    setPKeys([]);
    goToTransferAccount(newAccount);
  };
  return (
    <>
      <ReceiverInput>
        <form onSubmit={handleSubmit(onNext)} id="input-account-form">
          <InputWrapper>
            <BaseTextInput
              inputProps={{
                placeholder: 'Input account name',
                ...register('accountName', {
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                  validate: {
                    required: (val) => val.trim().length > 0 || 'Invalid data',
                  },
                  maxLength: {
                    value: 1000,
                    message: 'Destination account should be maximum 1000 characters.',
                  },
                }),
              }}
              title="Destination Account"
              height="auto"
              image={{
                width: '20px',
                height: '20px',
                src: images.initPage.qrcode,
                callback: () => setIsScanSearching(true),
              }}
              onChange={(e) => { clearErrors('accountName'); setValue('accountName', e.target.value); }}
            />
            {errors.accountName && <InputError>{errors.accountName.message}</InputError>}
          </InputWrapper>
          <InputWrapper>
            <Controller
              control={control}
              name="chainId"
              rules={{
                required: {
                  value: true,
                  message: 'This field is required.',
                },
              }}
              render={({
                field: {
                  onChange, onBlur, value,
                },
              }) => (
                <BaseSelect
                  selectProps={{
                    onChange, onBlur, value,
                  }}
                  options={optionsChain}
                  title="Chain ID"
                  height="auto"
                />
              )}
            />
            {errors.chainId && !getValues('chainId') && <InputError>{errors.chainId.message}</InputError>}
          </InputWrapper>
        </form>
        <ButtonWrapper>
          <ButtonImport form="input-account-form">Continue</ButtonImport>
        </ButtonWrapper>
      </ReceiverInput>
      {
        isSearching ? <Content /> : (
          <Content>
            <Tabs>{tabs}</Tabs>
          </Content>
        )
      }
      {
        isScanSearching && (
          <ModalCustom isOpen={isScanSearching} onCloseModal={() => setIsScanSearching(false)}>
            <BodyModal>
              <TitleModal>Scan QR Code</TitleModal>
              <QrReader
                delay={1000}
                onError={() => {
                  if (isMobile) {
                    (window as any)?.chrome?.tabs?.create({ url: `/index.html#${history?.location?.pathname}` });
                  }
                }}
                onScan={handleScanSearching}
                style={{ width: '100%' }}
              />
              <DivChild>Place the QR code in front of your camera</DivChild>
            </BodyModal>
          </ModalCustom>
        )
      }
      {isOpenConfirmModal && (
        <ModalCustom
          isOpen={isOpenConfirmModal}
          title="Warning"
          onCloseModal={() => setIsOpenConfirmModal(false)}
          closeOnOverlayClick={false}
        >
          <WarningText>
            {account.accountName}
            <br />
            {`Chain ${account.chainId}`}
          </WarningText>
          <WarningText>
            Receiving account does not exist. You must specify a keyset to create this account.
          </WarningText>
          <form onSubmit={handleSubmit(onCreateAccount)} id="create-account-form">
            <InputWrapper>
              <BaseTextInput
                inputProps={{
                  placeholder: 'Input public key',
                  ...register('publicKey', {
                    required: false,
                  }),
                }}
                image={{
                  width: '20px',
                  height: '20px',
                  src: images.transfer.violetAdd,
                  callback: () => onAddPublicKey(),
                }}
                title="Public Key"
                height="auto"
                onChange={(e) => { clearErrors('publicKey'); setValue('publicKey', e.target.value); }}
              />
              {errors.publicKey && <InputError>{errors.publicKey.message}</InputError>}
            </InputWrapper>
            {
              pKeys.length > 0 && renderKeys()
            }
            <InputWrapper>
              <Controller
                control={control}
                name="pred"
                rules={{
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                }}
                render={({
                  field: {
                    onChange, onBlur, value,
                  },
                }) => (
                  <BaseSelect
                    selectProps={{
                      onChange, onBlur, value,
                    }}
                    options={predList}
                    title="Predicate"
                    height="auto"
                    placeholder="Predicate"
                  />
                )}
              />
              {errors.pred && !getValues('pred') && <InputError>{errors.pred.message}</InputError>}
            </InputWrapper>
          </form>
          <ButtonWrapper>
            <TransferButton>
              <Button type={BUTTON_TYPE.DISABLE} size={BUTTON_SIZE.FULL} label="Cancel" onClick={() => setIsOpenConfirmModal(false)} />
            </TransferButton>
            <TransferButton>
              <ButtonImport form="create-account-form">Continue</ButtonImport>
            </TransferButton>
          </ButtonWrapper>
        </ModalCustom>
      )}
    </>
  );
};

export default SelectReceiver;
