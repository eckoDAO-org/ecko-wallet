import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { setActiveTab, setExtensionPassword, setIsHaveSeedPhrase } from 'src/stores/extensions';
import { useSettingsContext } from 'src/contexts/SettingsContext';
import { setCurrentWallet, setWallets } from 'src/stores/wallet';
import { getLocalSeedPhrase, initDataFromLocal } from 'src/utils/storage';
import { ReactComponent as EckoWalletLogoBar } from 'src/images/ecko-wallet-icon.svg';
import { ReactComponent as HistoryIcon } from 'src/images/history-icon.svg';
import { ReactComponent as GearIcon } from 'src/images/gear-icon.svg';
import { ReactComponent as SWAPIcon } from 'src/images/swap-icon.svg';
import { ACTIVE_TAB } from 'src/utils/constant';
import { DivFlex, SecondaryLabel } from '..';

const Wrapper = styled.div`
  display: ${(props) => (props.isFooter ? 'block' : 'none')};
  position: fixed;
  bottom: 0;
  width: inherit;
  background: ${({ theme }) => theme.background};
`;

const ActionBarElement = styled.div`
  padding: 10px;
  cursor: pointer;
  display: flex;
  flex: 1;
  flex-direction: column;
  text-align: center;
  font-size: 8px;
  font-weight: 700;
  span {
    font-size: 10px;
    color: ${({ theme }) => theme?.footer?.secondary} !important;
  }
  span:first-child {
    margin-bottom: 3px;
  }
  svg {
    width: 20px;
    height: 20px;
  }
  &.active {
    border-top: 2px solid #ffa900;
    margin-top: -2px;
    span {
      color: ${({ theme }) => theme?.footer?.primary} !important;
    }
    &:not(.xLogo) {
      svg {
        path {
          fill: ${({ theme }) => theme?.footer?.primary};
        }
      }
    }
  }
  &.disabled {
    cursor: default;
    svg {
      path.toFill {
        fill: ${({ theme }) => theme?.footer?.disabled};
      }
    }
    span {
      color: ${({ theme }) => theme?.footer?.disabled} !important;
    }
  }
`;

const Footer = () => {
  const rootState = useSelector((state) => state);
  const { selectedNetwork, networks, activeTab } = rootState.extensions;
  const { account } = rootState.wallet;
  const location = useLocation().pathname;
  const locationExtension = window.location.hash;
  const showSettingAndSelectNetworks = !(location.includes('networks') || location.includes('contact') || location.includes('about'));
  const isFooterWeb = location === '/' || location === '/wallet' || location === '/history' || location === '/setting';
  const isFooterExtenstion =
    locationExtension.substr(1) === '/' ||
    locationExtension.substr(1) === '/wallet' ||
    locationExtension.substr(1) === '/popup' ||
    locationExtension.substr(1) === '/history' ||
    locationExtension.substr(1) === '/setting';
  const isFooter = (isFooterWeb || isFooterExtenstion) && account !== null && account !== '' && account !== undefined;
  const { isLocked } = useSettingsContext();

  const isDappUrl =
    location.includes('connected-dapps') || location.includes('dapps-transfer') || location.includes('sign-dapps') || location.includes('signed-cmd');
  const history = useHistory();
  useEffect(() => {
    // set up listener
    const setupListener = () => {
      (window as any)?.chrome?.runtime?.onMessage?.addListener(handleMessage);
    };

    setupListener();
    initDataFromLocal(selectedNetwork, networks);
    return () => {
      // Unbind the event listener on clean up
      (window as any)?.chrome?.runtime?.onMessage?.removeListener(handleMessage);
    };
  }, [selectedNetwork.networkId]);

  const handleMessage = async (request) => {
    if (request.action === 'sync_data') {
      const { hash } = window.location;
      const isSyncUrl =
        hash === '#/' ||
        hash.includes('connected-dapps') ||
        hash.includes('dapps-transfer') ||
        hash.includes('sign-dapps') ||
        hash.includes('signed-cmd');
      if (request.type === 'create_password') {
        setExtensionPassword(request.passwordHash);
        if (request.wallet) {
          const newWallets = [request.wallet];
          setWallets(newWallets);
          setCurrentWallet(request.wallet);
          setIsHaveSeedPhrase(true);
        }
        history.push(request.path);
      } else {
        getLocalSeedPhrase(
          () => {
            setIsHaveSeedPhrase(true);
            if (!isSyncUrl) {
              history.push('/');
              setActiveTab(ACTIVE_TAB.HOME);
            }
          },
          () => {},
        );
        // Account changed
        initDataFromLocal(selectedNetwork, networks);
      }
    }
  };

  const isLoggedIn = !isLocked;
  const setIconHomeActive = () => {
    history.push('/');
    setActiveTab(ACTIVE_TAB.HOME);
  };
  const setIconHistoryActive = () => {
    history.push('/history');
    setActiveTab(ACTIVE_TAB.HISTORY);
  };
  const setIconSettingActive = () => {
    history.push('/setting');
    setActiveTab(ACTIVE_TAB.SETTINGS);
  };

  return (
    <Wrapper isFooter={isFooter}>
      <DivFlex justifyContent="space-between" style={{ borderTop: '1px solid #DFDFED' }}>
        <ActionBarElement className={['xLogo', activeTab === ACTIVE_TAB.HOME && 'active']} onClick={setIconHomeActive}>
          <span>
            <EckoWalletLogoBar style={{ width: 24, height: 24 }} />
          </span>
          <SecondaryLabel fontWeight={700}>WALLET</SecondaryLabel>
        </ActionBarElement>
        <ActionBarElement className={activeTab === ACTIVE_TAB.HISTORY && 'active'} onClick={setIconHistoryActive}>
          <span>
            <HistoryIcon />
          </span>
          <SecondaryLabel fontWeight={700}>HISTORY</SecondaryLabel>
        </ActionBarElement>
        <ActionBarElement className="disabled">
          <span>
            <SWAPIcon />
          </span>
          <SecondaryLabel fontWeight={700}>CONVERT</SecondaryLabel>
        </ActionBarElement>
        <ActionBarElement
          className={activeTab === ACTIVE_TAB.SETTINGS && 'active'}
          isShow={isLoggedIn && showSettingAndSelectNetworks}
          onClick={setIconSettingActive}
        >
          <span>
            <GearIcon />
          </span>
          <SecondaryLabel fontWeight={700}>SETTINGS</SecondaryLabel>
        </ActionBarElement>
      </DivFlex>
    </Wrapper>
  );
};

export default Footer;
