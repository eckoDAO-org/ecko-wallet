import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { setActiveTab, setExtensionPassword, setIsHaveSeedPhrase } from 'src/stores/slices/extensions';
import { useSettingsContext } from 'src/contexts/SettingsContext';
import { useGoHome } from 'src/hooks/ui';
import { setCurrentWallet, setWallets } from 'src/stores/slices/wallet';
import { getLocalSeedPhrase, initDataFromLocal } from 'src/utils/storage';
import { ReactComponent as EckoWalletLogoBar } from 'src/images/ecko-wallet-icon.svg';
import { ReactComponent as AnalyticsIcon } from 'src/images/ic_analytics.svg';
import { ReactComponent as GearIcon } from 'src/images/gear-icon.svg';
import { ReactComponent as NFTIcon } from 'src/images/nft-icon.svg';
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
  const isFooterWeb = location === '/' || location === '/wallet' || location === '/analytics' || location === '/setting' || location === '/nft';
  const isFooterExtension =
    locationExtension.substring(1) === '/' ||
    locationExtension.substring(1) === '/wallet' ||
    locationExtension.substring(1) === '/popup' ||
    locationExtension.substring(1) === '/analytics' ||
    locationExtension.substring(1) === '/setting';
  const isFooter = (isFooterWeb || isFooterExtension) && account !== null && account !== '' && account !== undefined;
  const { isLocked } = useSettingsContext();

  const history = useHistory();
  const goHome = useGoHome();
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
              goHome();
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
    goHome();
  };
  const setIconAnalyticsActive = () => {
    history.push('/analytics');
    setActiveTab(ACTIVE_TAB.ANALYTICS);
  };
  const setIconSettingActive = () => {
    history.push('/setting');
    setActiveTab(ACTIVE_TAB.SETTINGS);
  };
  const setIconNftActive = () => {
    history.push('/nft');
    setActiveTab(ACTIVE_TAB.NFT);
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
        <ActionBarElement className={activeTab === ACTIVE_TAB.ANALYTICS && 'active'} onClick={setIconAnalyticsActive}>
          <span>
            <AnalyticsIcon />
          </span>
          <SecondaryLabel fontWeight={700}>ANALYTICS</SecondaryLabel>
        </ActionBarElement>
        <ActionBarElement className={activeTab === ACTIVE_TAB.NFT && 'active'} onClick={setIconNftActive}>
          <span>
            <NFTIcon />
          </span>
          <SecondaryLabel fontWeight={700}>NFT</SecondaryLabel>
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
