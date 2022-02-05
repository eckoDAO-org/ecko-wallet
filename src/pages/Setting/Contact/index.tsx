/* eslint-disable no-console */
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import Back from 'src/components/Back';
import { useSelector } from 'react-redux';
import { convertContacts, shortenAddress } from 'src/utils';
import Button from 'src/components/Buttons';
import { BUTTON_SIZE } from 'src/utils/constant';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { getLocalContacts, setLocalContacts } from 'src/utils/storage';
import { setContacts } from 'src/stores/extensions';
import images from '../../../images';
import { TitleMessage } from './style';
import { ButtonBack, Descripton, FooterWrapper, SettingBody, TitleHeader, Wrapper } from '../style';
import { Arrow, Body, ContactItem, ContactTitle, ContactWrapper } from '../../SendTransactions/styles';
import PopupAddContact from './views/PopupAddContact';

type Props = {
  setRemoveContactModal: boolean;
};
const PageContact = (props: Props) => {
  const { setRemoveContactModal } = props;
  const [isOpenAddContact, setIsOpenAddContact] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>({});
  const { contacts, selectedNetwork } = useSelector((state) => state.extensions);
  const history = useHistory();
  const openContact = (edit) => {
    if (!edit) {
      setSelectedContact({});
    }
    setIsOpenAddContact(true);
    setIsEdit(edit);
  };
  const openEdit = (contact) => {
    setSelectedContact(contact);
    openContact(true);
  };
  const closeAdd = () => {
    setIsOpenAddContact(false);
  };
  const handleRemoveContact = () => {
    getLocalContacts(
      selectedNetwork.networkId,
      (data) => {
        const newContacts = data;
        delete newContacts[`${selectedContact.chainId}`][`${selectedContact.accountName}`];
        setLocalContacts(selectedNetwork.networkId, newContacts);
        setContacts(convertContacts(newContacts));
        setIsOpenAddContact(false);
        setRemoveContactModal;
        toast.success(<Toast type="success" content="Remove contact successfully" />);
      },
      () => {},
    );
  };

  const goBack = () => {
    history.push('/setting');
  };
  const getTabContent = () =>
    contacts.length ? (
      contacts.map((contact: any, key) => (
        <ContactWrapper onClick={() => openEdit(contact)} key={`${contact.accountName}-${contact.chainId}`}>
          <ContactItem isFirst={key === 0}>
            {contact.aliasName && <ContactTitle>{contact.aliasName}</ContactTitle>}
            <Descripton>
              {shortenAddress(contact.accountName)} - {`Chain ${contact.chainId}`}
            </Descripton>
          </ContactItem>
          <Arrow src={images.wallet.view} alt="view" />
        </ContactWrapper>
      ))
    ) : (
      <TitleMessage>No data</TitleMessage>
    );
  return (
    <SettingBody>
      <ButtonBack>
        <Back title="Back" onBack={goBack} />
      </ButtonBack>
      <Body>
        <TitleHeader>Contacts</TitleHeader>
        {isOpenAddContact && (
          <ModalCustom isOpen={isOpenAddContact} title="Contact" onCloseModal={() => setIsOpenAddContact(false)} closeOnOverlayClick={false}>
            <PopupAddContact
              onClose={closeAdd}
              isEdit={isEdit}
              networkId={selectedNetwork.networkId}
              contact={selectedContact}
              handleRemoveContact={handleRemoveContact}
            />
          </ModalCustom>
        )}
        <Wrapper>{getTabContent()}</Wrapper>
        <FooterWrapper>
          <Button size={BUTTON_SIZE.FULL} label="Add New Contact" onClick={() => openContact(false)} />
        </FooterWrapper>
      </Body>
    </SettingBody>
  );
};
export default PageContact;
