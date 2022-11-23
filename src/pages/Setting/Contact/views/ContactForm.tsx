/* eslint-disable no-console */
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { BaseTextInput, InputError } from 'src/baseComponent';
import { get } from 'lodash';
import Button from 'src/components/Buttons';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { useModalContext } from 'src/contexts/ModalContext';
import images from 'src/images';
import { shortenAddress, convertContacts } from 'src/utils';
import { PageConfirm, InfoWrapper } from 'src/pages/SendTransactions/views/style';
import { useHistory } from 'react-router-dom';
import { useWindowResizeMobile } from 'src/hooks/useWindowResizeMobile';
import { hideLoading, setContacts, showLoading } from 'src/stores/extensions';
import { fetchLocal } from 'src/utils/chainweb';
import { getLocalContacts, setLocalContacts } from 'src/utils/storage';
import { useSelector } from 'react-redux';
import ModalCustom from 'src/components/Modal/ModalCustom';
import QrReader from 'react-qr-reader';
import { DivFlex } from 'src/components';
import { BodyModal, TitleModal, DivChild, DivError, DivChildButton, ItemWrapperContact } from './style';

type Props = {
  contact?: any;
  networkId: any;
};

const ContactForm = (props: Props) => {
  const { contact, networkId } = props;
  const { closeModal } = useModalContext();
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();
  const [isMobile] = useWindowResizeMobile(420);
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const [isScanAccountName, setIsScanAccountName] = useState(false);
  const [aliasState, setAliasState] = useState(contact?.aliasName ?? '');

  const history = useHistory();

  const finishAddContact = (addContact) => {
    const aliasName = getValues('alias').trim();
    const newContact = {
      aliasName,
      accountName: addContact.accountName,
      chainId: 0,
      pred: addContact.pred,
      keys: addContact.keys,
    };
    getLocalContacts(
      networkId,
      (data) => {
        const contacts = data;
        contacts[`${0}`] = contacts[`${0}`] || {};
        contacts[`${0}`][`${addContact.accountName}`] = newContact;
        setLocalContacts(networkId, contacts);
        setContacts(convertContacts(contacts));
        closeModal();
        toast.success(<Toast type="success" content="Contact Added" />);
      },
      () => {
        const contacts = {};
        contacts[`${0}`] = {};
        contacts[`${0}`][`${addContact.accountName}`] = newContact;
        setLocalContacts(networkId, contacts);
        setContacts(convertContacts(contacts));
        toast.success(<Toast type="success" content="Contact Added" />);
        closeModal();
      },
    );
  };
  const checkAddContact = () => {
    if (contact) {
      finishAddContact(contact);
    } else {
      const { accountName } = getValues();
      const pactCode = `(coin.details "${accountName}")`;
      showLoading();
      fetchLocal(pactCode, selectedNetwork.url, selectedNetwork.networkId, 0)
        .then((request) => {
          hideLoading();
          const newContact = {
            accountName,
            chainId: 0,
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
            {contact ? (
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

      <DivChildButton>
        <DivFlex justifyContent="space-between" alignItems="center" gap="10px" padding="10px">
          <Button label="Cancel" size="full" variant="disabled" onClick={() => closeModal()} />
          <Button type="submit" label="Save" size="full" form="contact-form" />
        </DivFlex>
      </DivChildButton>
    </PageConfirm>
  );
};

export default ContactForm;
