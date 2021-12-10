/* eslint-disable no-console */
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { BaseSelect, BaseTextInput, InputError } from 'src/baseComponent';
import { get } from 'lodash';
import Button from 'src/components/Buttons';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
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
import { BUTTON_SIZE, BUTTON_TYPE } from 'src/utils/constant';
import { getLocalContacts, setLocalContacts } from 'src/utils/storage';
import { useSelector } from 'react-redux';
import ModalCustom from 'src/components/Modal/ModalCustom';
import QrReader from 'react-qr-reader';
import {
  BodyModal, TitleModal, DivChild, DivError, DivChildButton, DivChildFlex, ItemWrapperContact, SelectChainConatact,
} from './style';
import { ActionButton, ButtonModal, DescriptionModal } from '../../Networks/style';

type Props = {
  onClose: any;
  contact: any;
  networkId: any;
  isEdit: boolean;
  handleRemoveContact: Function;
}

const PopupAddContact = (props: Props) => {
  const {
    onClose,
    contact,
    networkId,
    isEdit,
    handleRemoveContact,
  } = props;
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
    const aliasName = getValues('alias').trim();
    const newContact = {
      aliasName,
      accountName: addContact.accountName,
      chainId: addContact.chainId,
      pred: addContact.pred,
      keys: addContact.keys,
    };
    getLocalContacts(networkId, (data) => {
      const contacts = data;
      contacts[`${addContact.chainId}`] = contacts[`${addContact.chainId}`] || {};
      contacts[`${addContact.chainId}`][`${addContact.accountName}`] = newContact;
      setLocalContacts(networkId, contacts);
      setContacts(convertContacts(contacts));
      onClose(aliasName);
      toast.success(<Toast type="success" content="Add contact successfully" />);
    }, () => {
      const contacts = {};
      contacts[`${addContact.chainId}`] = {};
      contacts[`${addContact.chainId}`][`${addContact.accountName}`] = newContact;
      setLocalContacts(networkId, contacts);
      setContacts(convertContacts(contacts));
      toast.success(<Toast type="success" content="Add contact successfully" />);
      onClose(aliasName);
    });
  };
  const checkAddContact = () => {
    if (isEdit) {
      finishAddContact(contact);
    } else {
      const { accountName, chainId } = getValues();
      const pactCode = `(coin.details "${accountName}")`;
      showLoading();
      fetchLocal(pactCode, selectedNetwork.url, selectedNetwork.networkId, chainId.value).then((request) => {
        hideLoading();
        const status = get(request, 'result.status');
        if (status === 'success') {
          const newContact = {
            accountName,
            chainId: chainId.value,
            pred: get(request, 'result.data.guard.pred'),
            keys: get(request, 'result.data.guard.keys'),
          };
          finishAddContact(newContact);
        } else {
          toast.error(<Toast type="fail" content="Contact doesn't exist" />);
        }
      }).catch(() => {
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
        <InfoWrapper>
          <TransactionInfo>
            <DivChildLeft>Name</DivChildLeft>
            <DivChildRight>{(contact.aliasName)}</DivChildRight>
          </TransactionInfo>
          <TransactionInfo>
            <DivChildLeft>Account name</DivChildLeft>
            <DivChildRight>{contact.accountName}</DivChildRight>
          </TransactionInfo>
          <TransactionInfo>
            <DivChildLeft>Chain ID</DivChildLeft>
            <DivChildRight>{contact.chainId}</DivChildRight>
          </TransactionInfo>
          <TransactionInfo>
            <DivChildLeft>Receiver Keyset</DivChildLeft>
            <DivChildBreak>
              {'{'}
              <br />
              {`"pred": "${contact.pred}",`}
              <br />
              &quot;keys&quot;: [
              <br />
              {contact.keys.map((ct, key) => (
                <span key={ct}>
                  {`"${ct}"`}
                  {key !== contact.keys.length - 1 && (
                    <>
                      ,
                      <br />
                    </>
                  )}
                </span>
              ))}
              <br />
              ]
              <br />
              {'}'}
            </DivChildBreak>
          </TransactionInfo>
        </InfoWrapper>
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
            <DivError>
              {errors.alias && <InputError marginTop="0">{errors.alias.message}</InputError>}
            </DivError>
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
                    <BaseTextInput
                      inputProps={{ readOnly: isEdit, value: contact.chainId }}
                      title="Chain ID"
                      height="auto"
                    />
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
                    onChange={(e) => { clearErrors('accountName'); setValue('accountName', e.target.value); }}
                  />
                  <DivError>
                    {errors.accountName && <InputError marginTop="0">{errors.accountName.message}</InputError>}
                  </DivError>
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
                    <DivError>
                      {errors.chainId && <InputError marginTop="0">{errors.chainId.message}</InputError>}
                    </DivError>

                  </SelectChainConatact>
                </>
              )}
            </ItemWrapperContact>
          </form>
          {
            isScanAccountName && (
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
            )
          }
        </InfoWrapper>
      )}
      <DivChildButton>
        <Footer>
          {isContactInfo ? (
            <>
              <ButtonWrapper>
                <Button
                  label="Delete"
                  type={BUTTON_TYPE.DISABLE}
                  onClick={() => setRemoveContactModal(true)}
                  size={BUTTON_SIZE.FULL}
                />
                {
                  isRemoveContactModal && (
                    <ModalCustom isOpen={isRemoveContactModal} showCloseIcon={false}>
                      <BodyModal>
                        <TitleModal>Remove Contact?</TitleModal>
                        <DescriptionModal>Are you sure you want to remove?</DescriptionModal>
                        <ActionButton>
                          <ButtonModal
                            background="#ffffff"
                            color="#461A57"
                            border="1px solid #461A57"
                            onClick={() => setRemoveContactModal(false)}
                          >
                            Cancel
                          </ButtonModal>
                          <ButtonModal
                            background="#461A57"
                            color="#ffffff"
                            onClick={handleRemoveContact}
                          >
                            Remove
                          </ButtonModal>
                        </ActionButton>
                      </BodyModal>
                    </ModalCustom>
                  )
                }
              </ButtonWrapper>
              <ButtonWrapper>
                <Button
                  size={BUTTON_SIZE.FULL}
                  label="Edit"
                  onClick={() => { setIsContactInfo(false); }}
                />
              </ButtonWrapper>
            </>

          ) : (
            <DivChildFlex>
              <ButtonWrapper>
                <Button
                  label="Cancel"
                  type={BUTTON_TYPE.DISABLE}
                  onClick={() => onClose(false)}
                  size={BUTTON_SIZE.FULL}
                />
              </ButtonWrapper>
              <ButtonWrapper>
                <ButtonAdd form="contact-form">Save</ButtonAdd>
              </ButtonWrapper>
            </DivChildFlex>
          )}
        </Footer>
      </DivChildButton>

    </PageConfirm>
  );
};

export default PopupAddContact;
