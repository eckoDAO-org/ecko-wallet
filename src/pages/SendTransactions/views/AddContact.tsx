import { useForm } from 'react-hook-form';
import { BaseTextInput, InputError } from 'src/baseComponent';
import Button from 'src/components/Buttons';
import { setContacts } from 'src/stores/extensions';
import { convertContacts } from 'src/utils';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { getLocalContacts, setLocalContacts } from 'src/utils/storage';
import { useState } from 'react';
import images from 'src/images';
import { Footer } from '../styles';
import { PageConfirm, BodyContent, ButtonAdd, ButtonWrapper, ItemWrapper } from './style';

type Props = {
  onClose: any;
  contact: any;
  networkId: any;
};

const AddContact = (props: Props) => {
  const { onClose, contact, networkId } = props;
  const [isValue, setIsValue] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    clearErrors,
    setValue,
  } = useForm();
  const addContact = () => {
    const aliasName = getValues('alias');
    const newContact = {
      aliasName,
      accountName: contact.accountName,
      chainId: contact.chainId,
      pred: contact.pred,
      keys: contact.keys,
    };
    getLocalContacts(
      networkId,
      (data) => {
        const contacts = data;
        contacts[`${contact.chainId}`] = contacts[`${contact.chainId}`] || {};
        contacts[`${contact.chainId}`][`${contact.accountName}`] = newContact;
        setLocalContacts(networkId, contacts);
        setContacts(convertContacts(contacts));
        onClose(aliasName);
        toast.success(<Toast type="success" content="Add contact successfully" />);
      },
      () => {
        const contacts = {};
        contacts[`${contact.chainId}`] = {};
        contacts[`${contact.chainId}`][`${contact.accountName}`] = newContact;
        setLocalContacts(networkId, contacts);
        setContacts(convertContacts(contacts));
        onClose(aliasName);
        toast.success(<Toast type="success" content="Add contact successfully" />);
      },
    );
  };
  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
    toast.success(<Toast type="success" content="Copied!" />);
  };
  return (
    <PageConfirm>
      <BodyContent>
        <form onSubmit={handleSubmit(addContact)} id="contact-form">
          <ItemWrapper>
            <BaseTextInput
              inputProps={{
                maxLength: '1000',
                placeholder: 'e.g David',
                ...register('alias', {
                  required: {
                    value: true,
                    message: 'This field is required.',
                  },
                  maxLength: {
                    value: 256,
                    message: 'Enter an alias should be maximum 256 characters.',
                  },
                  validate: {
                    required: (val) => val.trim().length > 0 || 'Invalid data',
                  },
                }),
              }}
              title="Enter An Alias"
              height="auto"
              onChange={(e) => {
                clearErrors('alias');
                setIsValue(e.target.value);
                setValue('alias', e.target.value);
              }}
            />
          </ItemWrapper>
          {errors.alias && <InputError>{errors.alias.message}</InputError>}
          <ItemWrapper>
            <BaseTextInput
              inputProps={{ readOnly: true, value: contact.accountName }}
              title="Account Name"
              height="auto"
              image={{
                width: '12px',
                height: '12px',
                src: images.wallet.copyGray,
                callback: () => copyToClipboard(contact.accountName),
              }}
            />
          </ItemWrapper>
          <ItemWrapper>
            <BaseTextInput inputProps={{ readOnly: true, value: contact.chainId }} title="Chain ID" height="auto" />
          </ItemWrapper>
        </form>
      </BodyContent>
      <Footer>
        <ButtonWrapper>
          <Button label="Cancel" variant="disabled" onClick={() => onClose(false)} />
        </ButtonWrapper>
        <ButtonWrapper>
          <ButtonAdd disabled={!isValue} form="contact-form">
            Save
          </ButtonAdd>
        </ButtonWrapper>
      </Footer>
    </PageConfirm>
  );
};

export default AddContact;
