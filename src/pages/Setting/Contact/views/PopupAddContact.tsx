/* eslint-disable no-console */
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { BaseSelect, BaseTextInput, InputError } from 'src/baseComponent';
import { get } from 'lodash';
import Button from 'src/components/Buttons';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { useModalContext } from 'src/contexts/ModalContext';
import useChainIdOptions from 'src/hooks/useChainIdOptions';
import images from 'src/images';
import { Footer } from 'src/pages/SendTransactions/styles';
import { shortenAddress, convertContacts } from 'src/utils';
import {
  ButtonAdd,
  ButtonWrapper,
  PageConfirm,
  TransactionInfo,
  InfoWrapper,
  DivChildLeft,
  DivChildRight,
  DivChildBreak,
  SelectChain,
} from 'src/pages/SendTransactions/views/style';
import { useHistory } from 'react-router-dom';
import { useWindowResizeMobile } from 'src/hooks/useWindowResizeMobile';
import { hideLoading, setContacts, showLoading } from 'src/stores/extensions';
import { fetchLocal } from 'src/utils/chainweb';
import { getLocalContacts, setLocalContacts } from 'src/utils/storage';
import { useSelector } from 'react-redux';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { ActionList } from 'src/components/ActionList';
import QrReader from 'react-qr-reader';
import { Icon, ReceiveSection, ReceiveTitle } from 'src/pages/Wallet/views/ReceiveModal';
import { CommonLabel, DivFlex } from 'src/components';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { BodyModal, TitleModal, DivChild, DivError, DivChildButton, ItemWrapperContact, SelectChainConatact } from './style';
import { ActionButton, DescriptionModal } from '../../Networks/style';

type Props = {
  contact: any;
  networkId: any;
  isEdit: boolean;
  handleRemoveContact: Function;
};

const PopupAddContact = (props: Props) => {
  const { contact, networkId, isEdit, handleRemoveContact } = props;
  const { closeModal } = useModalContext();
  const {
    register,
    handleSubmit,
    getValues,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();
  const [isMobile] = useWindowResizeMobile(420);
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const [isContactInfo, setIsContactInfo] = useState(isEdit);
  const [isScanAccountName, setIsScanAccountName] = useState(false);
  const [aliasState, setAliasState] = useState(isEdit ? contact.aliasName : '');
  const [isRemoveContactModal, setRemoveContactModal] = useState(false);
  const history = useHistory();
  const optionsChain = useChainIdOptions();
  const finishAddContact = (addContact) => {
    console.log(`🚀 !!! ~ addContact`, addContact);
    const aliasName = getValues('alias').trim();
    const newContact = {
      aliasName,
      accountName: addContact.accountName,
      chainId: addContact.chainId,
      pred: addContact.pred,
      keys: addContact.keys,
    };
    getLocalContacts(
      networkId,
      (data) => {
        const contacts = data;
        contacts[`${addContact.chainId}`] = contacts[`${addContact.chainId}`] || {};
        contacts[`${addContact.chainId}`][`${addContact.accountName}`] = newContact;
        setLocalContacts(networkId, contacts);
        setContacts(convertContacts(contacts));
        closeModal();
        toast.success(<Toast type="success" content="Add contact successfully" />);
      },
      () => {
        const contacts = {};
        contacts[`${addContact.chainId}`] = {};
        contacts[`${addContact.chainId}`][`${addContact.accountName}`] = newContact;
        setLocalContacts(networkId, contacts);
        setContacts(convertContacts(contacts));
        toast.success(<Toast type="success" content="Add contact successfully" />);
        setIsContactInfo(true);
        closeModal();
      },
    );
  };
  const checkAddContact = () => {
    if (isEdit) {
      finishAddContact(contact);
    } else {
      const { accountName, chainId } = getValues();
      const pactCode = `(coin.details "${accountName}")`;
      showLoading();
      fetchLocal(pactCode, selectedNetwork.url, selectedNetwork.networkId, chainId.value)
        .then((request) => {
          hideLoading();
          const newContact = {
            accountName,
            chainId: chainId.value,
            pred: get(request, 'result.data.guard.pred'),
            keys: get(request, 'result.data.guard.keys'),
          };
          finishAddContact(newContact);
        })
        .catch(() => {
          hideLoading();
          toast.error(<Toast type="fail" content="Network error." />);
        });
    }
  };

  const handleChangeAliasName = (e) => {
    clearErrors('alias');
    setAliasState(e.target.value);
    setValue('alias', e.target.value);
  };
  const handleScanAccountName = (data) => {
    if (data) {
      setValue('accountName', data, { shouldValidate: true });
      setIsScanAccountName(false);
    }
  };
  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
    toast.success(<Toast type="success" content="Copied!" />);
  };
  return (
    <PageConfirm>
      {isContactInfo ? (
        <>
          <div style={{ padding: 24 }}>
            <DivFlex justifyContent="space-between" alignItems="center" style={{ marginBottom: 20 }}>
              <ReceiveTitle fontWeight={700} fontSize={10}>
                ACCOUNT NAME
              </ReceiveTitle>
              <Icon src={images.wallet.copyGray} onClick={() => copyToClipboard(contact.accountName)} />
            </DivFlex>
            <DivFlex justifyContent="flex-start" alignItems="flex-start">
              <Jazzicon diameter={24} seed={jsNumberForAddress(contact.accountName)} paperStyles={{ marginRight: 5, minWidth: 24 }} />
              <CommonLabel wordBreak="break-word">{contact.accountName}</CommonLabel>
            </DivFlex>
          </div>
          <ReceiveSection>
            <DivFlex style={{ marginBottom: 20 }}>
              <ReceiveTitle fontSize={10} uppercase>
                chain id
              </ReceiveTitle>
            </DivFlex>
            <DivFlex justifyContent="flex-start" alignItems="flex-start">
              <CommonLabel>0</CommonLabel>
            </DivFlex>
          </ReceiveSection>
          {isContactInfo && (
            <ReceiveSection flexDirection="column" padding="0 24px">
              <ActionList
                actions={[
                  { label: 'Edit Contact', src: images.settings.iconEdit, onClick: () => setIsContactInfo(false) },
                  { label: 'Delete', src: images.settings.iconTrash, onClick: () => setRemoveContactModal(true) },
                ]}
              />
              {isRemoveContactModal && (
                <ModalCustom isOpen={isRemoveContactModal} showCloseIcon={false}>
                  <BodyModal>
                    <TitleModal>Remove Contact?</TitleModal>
                    <DescriptionModal>Are you sure you want to remove?</DescriptionModal>
                    <ActionButton>
                      <Button label="Cancel" variant="disabled" onClick={() => setRemoveContactModal(false)} />
                      <Button label="Remove" variant="remove" onClick={handleRemoveContact} />
                    </ActionButton>
                  </BodyModal>
                </ModalCustom>
              )}
            </ReceiveSection>
          )}
        </>
      ) : (
        <InfoWrapper>
          <form onSubmit={handleSubmit(checkAddContact)} id="contact-form">
            <ItemWrapperContact>
              <BaseTextInput
                inputProps={{
                  placeholder: 'e.g David',
                  ...register('alias', {
                    required: {
                      value: true,
                      message: 'This field is required.',
                    },
                    validate: {
                      required: (val) => val.trim().length > 0 || 'Invalid data',
                    },
                    maxLength: {
                      value: 256,
                      message: 'Enter an alias should be maximum 256 characters.',
                    },
                  }),
                  value: aliasState,
                }}
                onChange={handleChangeAliasName}
                title="Enter An Alias"
                height="auto"
                onBlur={(e) => {
                  setValue('alias', e.target.value.trim());
                  handleChangeAliasName(e);
                }}
              />
            </ItemWrapperContact>
            <DivError>{errors.alias && <InputError marginTop="0">{errors.alias.message}</InputError>}</DivError>
            <ItemWrapperContact>
              {isEdit ? (
                <>
                  <BaseTextInput
                    inputProps={{ readOnly: true, value: shortenAddress(contact.accountName) }}
                    title="Account name"
                    height="auto"
                    image={{
                      width: '15px',
                      height: '15px',
                      src: images.wallet.copyGray,
                      callback: () => copyToClipboard(contact.accountName),
                    }}
                  />
                  <SelectChain>
                    <BaseTextInput inputProps={{ readOnly: isEdit, value: contact.chainId }} title="Chain ID" height="auto" />
                  </SelectChain>
                </>
              ) : (
                <>
                  <BaseTextInput
                    inputProps={{
                      placeholder: 'Account name',
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
                          message: 'Acount name should be maximum 1000 characters.',
                        },
                      }),
                    }}
                    title="Account Name"
                    height="auto"
                    image={{
                      width: '20px',
                      height: '20px',
                      src: images.initPage.qrcode,
                      callback: () => setIsScanAccountName(true),
                    }}
                    onChange={(e) => {
                      clearErrors('accountName');
                      setValue('accountName', e.target.value);
                    }}
                  />
                  <DivError>{errors.accountName && <InputError marginTop="0">{errors.accountName.message}</InputError>}</DivError>
                  <SelectChainConatact>
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
                    <DivError>{errors.chainId && <InputError marginTop="0">{errors.chainId.message}</InputError>}</DivError>
                  </SelectChainConatact>
                </>
              )}
            </ItemWrapperContact>
          </form>
          {isScanAccountName && (
            <ModalCustom isOpen={isScanAccountName} onCloseModal={() => setIsScanAccountName(false)}>
              <BodyModal>
                <TitleModal>Scan QR Code</TitleModal>
                <QrReader
                  delay={1000}
                  onError={() => {
                    if (isMobile) {
                      (window as any)?.chrome?.tabs?.create({ url: `/index.html#${history?.location?.pathname}` });
                    }
                  }}
                  onScan={handleScanAccountName}
                  style={{ width: '100%' }}
                />
                <DivChild>Place the QR code in front of your camera</DivChild>
              </BodyModal>
            </ModalCustom>
          )}
        </InfoWrapper>
      )}
      <DivChildButton>
        {!isContactInfo && (
          <DivFlex justifyContent="space-between" alignItems="center" gap="10px" padding="10px">
            <Button
              label="Cancel"
              size="full"
              variant="disabled"
              onClick={() => {
                setIsContactInfo(true);
                closeModal();
              }}
            />
            <Button type="submit" label="Save" size="full" form="contact-form" />
          </DivFlex>
        )}
      </DivChildButton>
    </PageConfirm>
  );
};

export default PopupAddContact;
