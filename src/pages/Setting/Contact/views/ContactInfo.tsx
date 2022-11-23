import { useState } from 'react';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { CommonLabel, DivFlex, SecondaryLabel } from 'src/components';
import { ActionList } from 'src/components/ActionList';
import Button from 'src/components/Buttons';
import ModalCustom from 'src/components/Modal/ModalCustom';
import Toast from 'src/components/Toast/Toast';
import { useModalContext } from 'src/contexts/ModalContext';
import images from 'src/images';
import { Icon, ReceiveSection, ReceiveTitle } from 'src/pages/Wallet/views/ReceiveModal';
import { setContacts } from 'src/stores/extensions';
import { convertContacts } from 'src/utils';
import { getLocalContacts, setLocalContacts } from 'src/utils/storage';
import ContactForm from './ContactForm';

export const ContactInfo = ({ contact }: any) => {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const { selectedNetwork } = useSelector((state) => state.extensions);
  const { openModal, closeModal } = useModalContext();

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
    toast.success(<Toast type="success" content="Copied!" />);
  };

  const handleRemoveContact = () => {
    getLocalContacts(
      selectedNetwork.networkId,
      (data) => {
        const newContacts = data;
        delete newContacts[0][`${contact.accountName}`];
        setLocalContacts(selectedNetwork.networkId, newContacts);
        setContacts(convertContacts(newContacts));
        setIsDeleting(false);
        toast.success(<Toast type="success" content="Contact Removed" />);
        closeModal();
      },
      () => {},
    );
  };

  return (
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
      <ReceiveSection flexDirection="column" padding="0 24px">
        <ActionList
          actions={[
            {
              label: 'Edit Contact',
              src: images.settings.iconEdit,
              onClick: () =>
                openModal({
                  title: `Edit ${contact.aliasName} account`,
                  content: <ContactForm networkId={selectedNetwork.networkId} contact={contact} />,
                }),
            },
            { label: 'Delete', src: images.settings.iconTrash, onClick: () => setIsDeleting(true) },
          ]}
        />
        {isDeleting && (
          <ModalCustom isOpen={isDeleting} showCloseIcon={false} title="Delete contact">
            <div>
              <DivFlex flexDirection="column" justifyContent="center" alignItems="center" padding="24px">
                <CommonLabel fontSize={18} fontWeight={700}>
                  Remove Contact?
                </CommonLabel>
                <SecondaryLabel fontWeight={400} fontSize={14} style={{ textAlign: 'center', margin: '20px 0' }}>
                  Are you sure you want to remove this contact?
                </SecondaryLabel>
              </DivFlex>
              <DivFlex justifyContent="space-between" alignItems="center" gap="10px" padding="24px">
                <Button size="full" label="Cancel" variant="disabled" onClick={() => setIsDeleting(false)} />
                <Button size="full" label="Confirm" variant="primary" onClick={handleRemoveContact} />
              </DivFlex>
            </div>
          </ModalCustom>
        )}
      </ReceiveSection>
    </>
  );
};
