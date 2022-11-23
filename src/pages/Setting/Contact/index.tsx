import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { shortenAddress } from 'src/utils';
import { useModalContext } from 'src/contexts/ModalContext';
import Button from 'src/components/Buttons';
import { NavigationHeader } from 'src/components/NavigationHeader';
import { JazzAccount } from 'src/components/JazzAccount';
import { CommonLabel, DivFlex, SecondaryLabel, StickyFooter } from 'src/components';
import { TitleMessage } from './style';
import { Body } from '../../SendTransactions/styles';
import ContactForm from './views/ContactForm';
import { ContactInfo } from './views/ContactInfo';

const Wrapper = styled.div`
  padding: 0 20px;
`;

const AccountRow = styled.div`
  border-bottom: 1px solid #dfdfed;
  cursor: pointer;
`;

const PageContact = () => {
  const { contacts, selectedNetwork } = useSelector((state) => state.extensions);
  const history = useHistory();

  const { openModal } = useModalContext();

  const onClickAccount = (contact) =>
    openModal({
      title: (
        <CommonLabel fontWeight={500} fontSize={24}>
          {contact.aliasName}
        </CommonLabel>
      ),
      content: <ContactInfo contact={contact} />,
      roundIcon: <Jazzicon diameter={80} seed={jsNumberForAddress(contact.accountName)} paperStyles={{ border: '6px solid white' }} />,
    });

  const onAddAccount = () =>
    openModal({
      title: 'New account',
      content: <ContactForm networkId={selectedNetwork.networkId} />,
    });

  const goBack = () => {
    history.push('/setting');
  };

  const getTabContent = () =>
    contacts.length ? (
      contacts
        .filter((value, index, self) => index === self.findIndex((t) => t?.accountName === value?.accountName))
        .map(
          (contact: any) =>
            contact?.accountName && (
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
            ),
        )
    ) : (
      <TitleMessage>No data</TitleMessage>
    );
  return (
    <Wrapper>
      <NavigationHeader title="Contacts" onBack={goBack} />
      <Body style={{ marginBottom: 50 }}>
        {getTabContent()}
        <StickyFooter>
          <Button size="full" label="Add New Contact" onClick={onAddAccount} style={{ width: '90%', maxWidth: 890 }} />
        </StickyFooter>
      </Body>
    </Wrapper>
  );
};
export default PageContact;
