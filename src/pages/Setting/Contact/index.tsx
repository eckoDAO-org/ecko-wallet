import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { convertContacts, shortenAddress } from 'src/utils';
import { useModalContext } from 'src/contexts/ModalContext';
import Button from 'src/components/Buttons';
import { toast } from 'react-toastify';
import { NavigationHeader } from 'src/components/NavigationHeader';
import { JazzAccount } from 'src/components/JazzAccount';
import { CommonLabel, DivFlex, SecondaryLabel } from 'src/components';
import Toast from 'src/components/Toast/Toast';
import { getLocalContacts, setLocalContacts } from 'src/utils/storage';
import { setContacts } from 'src/stores/extensions';
import { TitleMessage } from './style';
import { FooterWrapper } from '../style';
import { Body } from '../../SendTransactions/styles';
import PopupAddContact from './views/PopupAddContact';

const Wrapper = styled.div`
  padding: 0 20px;
`;

const AccountRow = styled.div`
  border-bottom: 1px solid #dfdfed;
  cursor: pointer;
`;

type Props = {
  setRemoveContactModal: boolean;
};
const PageContact = (props: Props) => {
  const { setRemoveContactModal } = props;
  const { contacts, selectedNetwork } = useSelector((state) => state.extensions);
  const history = useHistory();

  const { openModal } = useModalContext();
  const handleRemoveContact = (contact) => {
    getLocalContacts(
      selectedNetwork.networkId,
      (data) => {
        const newContacts = data;
        // TODO: delete from all chain? loop?
        delete newContacts[`${contact.chainId}`][`${contact.accountName}`];
        setLocalContacts(selectedNetwork.networkId, newContacts);
        setContacts(convertContacts(newContacts));
        setRemoveContactModal;
        toast.success(<Toast type="success" content="Remove contact successfully" />);
      },
      () => {},
    );
  };

  const onClickAccount = (contact) =>
    openModal({
      title: (
        <CommonLabel fontWeight={500} fontSize={24}>
          {contact.aliasName}
        </CommonLabel>
      ),
      content: (
        <PopupAddContact isEdit networkId={selectedNetwork.networkId} contact={contact} handleRemoveContact={() => handleRemoveContact(contact)} />
      ),
      roundIcon: <Jazzicon diameter={80} seed={jsNumberForAddress(contact.accountName)} paperStyles={{ border: '6px solid white' }} />,
    });

  const onAddAccount = () =>
    openModal({
      title: 'New account',
      content: <PopupAddContact isEdit={false} networkId={selectedNetwork.networkId} contact={{}} handleRemoveContact={handleRemoveContact} />,
    });

  const goBack = () => {
    history.push('/setting');
  };

  const getTabContent = () =>
    contacts.length ? (
      contacts
        .filter((value, index, self) => index === self.findIndex((t) => t.accountName === value.accountName))
        .map((contact: any) => (
          <AccountRow onClick={() => onClickAccount(contact)}>
            <JazzAccount
              key={contact.aliasName}
              account={contact.accountName}
              renderAccount={(acc) => (
                <DivFlex flexDirection="column">
                  <CommonLabel color="#20264E" fontWeight={700} fontSize={14}>
                    {contact.aliasName}
                  </CommonLabel>
                  <SecondaryLabel fontWeight={500}>{shortenAddress(acc)}</SecondaryLabel>
                </DivFlex>
              )}
            />
          </AccountRow>
        ))
    ) : (
      <TitleMessage>No data</TitleMessage>
    );
  return (
    <Wrapper>
      <NavigationHeader title="Contacts" onBack={goBack} />
      <Body>
        {getTabContent()}
        <FooterWrapper>
          <Button size="full" label="Add New Contact" onClick={onAddAccount} />
        </FooterWrapper>
      </Body>
    </Wrapper>
  );
};
export default PageContact;
