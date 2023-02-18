import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ReactComponent as ContactsIcon } from 'src/images/settings-contacts.svg';
import { ReactComponent as NetworksIcon } from 'src/images/settings-networks.svg';
import { ReactComponent as KeyIcon } from 'src/images/settings-export-key.svg';
import { ReactComponent as DiscordIcon } from 'src/images/discord-icon.svg';
import { ReactComponent as GlobeIcon } from 'src/images/globe-icon.svg';
import { ReactComponent as Padlock } from 'src/images/padlock.svg';
import { ReactComponent as ExpandView } from 'src/images/expand-view.svg';
import { CommonLabel, DivFlex, SecondaryLabel } from 'src/components';
import { DISCORD_INVITATION_LINK, WEBSITE_LINK } from 'src/utils/config';
import { useSettingsContext } from 'src/contexts/SettingsContext';

interface ISettingsMenu {
  img: React.ReactNode;
  title: string;
  description: string;
  onClick: any;
  isHidden?: boolean;
}

const SettingsContainer = styled.div`
  padding: 24px;
  margin-bottom: 60px;
  .settingMenu {
    border-top: 1px solid #d3d3d3;
  }
  .settingMenu:first-child {
    border-top: none;
  }
`;

const SettingMenu = styled(DivFlex)`
  cursor: pointer;
  border-bottom: '1px solid #dfdfed';
`;

const AboutDiv = styled(DivFlex)`
  a {
    text-decoration: none;
    display: flex;
    align-items: center;
    svg {
      margin-right: 6px;
    }
  }
`;

const PageSetting = () => {
  const history = useHistory();
  const rootState = useSelector((state) => state);
  const { setIsLocked } = useSettingsContext();
  const { secretKey } = rootState?.wallet;

  const lockWallet = () => {
    setIsLocked(true);
  };

  const settingsMenu: ISettingsMenu[] = [
    { title: 'Contacts', img: <ContactsIcon />, description: 'Manage your contacts', onClick: () => history.push('/contact') },
    { title: 'Networks', img: <NetworksIcon />, description: 'Add or edit custom RPC networks', onClick: () => history.push('/networks') },
    {
      title: 'Connected Sites',
      img: <NetworksIcon />,
      description: 'View and manage connected sites',
      onClick: () => history.push('/connected-sites'),
    },
    {
      title: 'Transaction Settings',
      img: <NetworksIcon />,
      description: 'Set your gas preferences',
      onClick: () => history.push('/tx-settings'),
    },
    {
      title: 'Export Recovery Phrase',
      img: <KeyIcon />,
      description: 'Protect your wallet',
      onClick: () => history.push('/export-seed-phrase'),
      isHidden: secretKey?.length !== 256,
    },
    {
      title: 'Expand View',
      img: <ExpandView />,
      description: 'Open X Wallet in a new window',
      onClick: () => (window as any)?.chrome?.tabs?.create({ url: '/index.html#/' }),
    },
    {
      title: 'Lock Wallet',
      img: <Padlock />,
      description: 'Protect your wallet',
      onClick: lockWallet,
    },
    {
      title: 'Lock Wallet Settings',
      img: <Padlock />,
      description: 'Change security settings',
      onClick: () => history.push('/lock-settings'),
    },
  ];

  const getSettingsItem = ({ img, title, description, onClick }: ISettingsMenu) => (
    <SettingMenu className="settingMenu" justifyContent="flex-start" gap="10px" padding="15px 0" onClick={onClick}>
      {img}
      <DivFlex flexDirection="column" justifyContent="flex-start">
        <CommonLabel fontWeight={600} fontSize={16}>
          {title}
        </CommonLabel>
        <SecondaryLabel fontWeight={500} fontSize={12}>
          {description}
        </SecondaryLabel>
      </DivFlex>
    </SettingMenu>
  );

  return (
    <SettingsContainer>
      {settingsMenu.map((menuItem) => !menuItem.isHidden && getSettingsItem(menuItem))}
      <AboutDiv marginTop="48px" alignItems="center">
        <SecondaryLabel fontWeight={500}>
          X Wallet V. 2.1.1
          <br />
          <br />
          The evolution of DeFi on Kadena
        </SecondaryLabel>
      </AboutDiv>
      <AboutDiv marginTop="30px">
        <a href={DISCORD_INVITATION_LINK} target="_blank" rel="noreferrer">
          <DiscordIcon /> <SecondaryLabel>Join us on Discord</SecondaryLabel>
        </a>
      </AboutDiv>
      <AboutDiv marginTop="10px">
        <a href={WEBSITE_LINK} target="_blank" rel="noreferrer">
          <GlobeIcon /> <SecondaryLabel>Visit our website</SecondaryLabel>
        </a>
      </AboutDiv>
    </SettingsContainer>
  );
};
export default PageSetting;
