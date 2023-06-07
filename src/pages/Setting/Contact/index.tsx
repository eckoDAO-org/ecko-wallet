import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { groupBy } from 'lodash';
import { shortenAddress } from 'src/utils';
import { useModalContext } from 'src/contexts/ModalContext';
import Button from 'src/components/Buttons';
import { NavigationHeader } from 'src/components/NavigationHeader';
import { JazzAccount } from 'src/components/JazzAccount';
import { CommonLabel, DivFlex, PrimaryLabel, SecondaryLabel, StickyFooter } from 'src/components';
import { Body } from '../../SendTransactions/styles';
import ContactForm from './views/ContactForm';
import { ContactInfo } from './views/ContactInfo';

const Wrapper = styled.div`
  padding: 0 20px;
`;

const AccountRow = styled.div`
  border-bottom: ${(props) => props.hasBorder && '1px solid #dfdfed'};
  cursor: pointer;
`;

const PageContact = () => {
  const { contacts, selectedNetwork } = useSelector((state) => state.extensions);
  const history = useHistory();
  const groupedContacts = groupBy(
    contacts?.filter((c) => c.accountName),
    (c) => c.aliasName[0].toLowerCase(),
  );
  const sortedKeys = Object.keys(groupedContacts).sort((a, b) => a.localeCompare(b));
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
      content: <ContactForm isNew contact={{ aliasName: null, accountName: null }} networkId={selectedNetwork.networkId} />,
    });

  const goBack = () => {
    history.push('/setting');
  };

  return (
    <Wrapper>
      <NavigationHeader title="Contacts" onBack={goBack} />
      <Body style={{ marginBottom: 100 }}>
        {sortedKeys?.length ? (
          sortedKeys.map((letter) => (
            <DivFlex alignItems="flex-start" style={{ borderTop: '1px solid #dfdfed' }}>
              <PrimaryLabel style={{ flex: 1 }}>{letter}</PrimaryLabel>
              <div style={{ flex: 3 }}>
                {groupedContacts[letter]
                  ?.sort((a, b) => a.aliasName.localeCompare(b.aliasName))
                  ?.map(
                    (contact, i) =>
                      (contact?.accountName || contact?.aliasName) && (
                        <AccountRow hasBorder={i < groupedContacts[letter].length - 1} onClick={() => onClickAccount(contact)}>
                          {contact.accountName && (
                            <JazzAccount
                              key={contact.aliasName}
                              account={contact.accountName}
                              renderAccount={(acc) => (
                                <DivFlex flexDirection="column">
                                  <CommonLabel fontWeight={700} fontSize={14}>
                                    {contact.aliasName}
                                  </CommonLabel>
                                  <SecondaryLabel fontWeight={500}>{shortenAddress(acc)}</SecondaryLabel>
                                </DivFlex>
                              )}
                            />
                          )}
                        </AccountRow>
                      ),
                  )}
              </div>
            </DivFlex>
          ))
        ) : (
          <DivFlex justifyContent="center" marginTop="40px">
            <SecondaryLabel fontSize={12} fontWeight={600} uppercase>
              No contacts
            </SecondaryLabel>
          </DivFlex>
        )}
        <StickyFooter>
          <Button size="full" label="Add New Contact" onClick={onAddAccount} style={{ width: '90%', maxWidth: 890 }} />
        </StickyFooter>
      </Body>
    </Wrapper>
  );
};
export default PageContact;
