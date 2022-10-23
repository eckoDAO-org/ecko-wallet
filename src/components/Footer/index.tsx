import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import {
  defaultNetworks,
  hideFetching,
  setActiveTab,
  setContacts,
  setExpiredTime,
  setExtensionPassword,
  setIsHaveSeedPhrase,
  setNetworks,
  setRecent,
  setSelectedNetwork,
  showFetching,
} from 'src/stores/extensions';
import { setCurrentWallet, setWallets } from 'src/stores/wallet';
import { decryptKey } from 'src/utils/security';
import {
  getLocalContacts,
  getLocalExpiredTime,
  getLocalNetworks,
  getLocalPassword,
  getLocalRecent,
  getLocalSeedPhrase,
  getLocalSelectedNetwork,
  getLocalSelectedWallet,
  getLocalWallets,
  setLocalNetworks,
  setLocalSelectedNetwork,
  setLocalSelectedWallet,
} from 'src/utils/storage';
import { ReactComponent as XWalletLogoBar } from 'src/images/x-wallet-icon.svg';
import { ReactComponent as HistoryIcon } from 'src/images/history-icon.svg';
import { ReactComponent as GearIcon } from 'src/images/gear-icon.svg';
import { ReactComponent as NFTIcon } from 'src/images/nft-icon.svg';
import { convertContacts, convertNetworks, convertRecent, revertNetworks } from 'src/utils';
import { ACTIVE_TAB } from 'src/utils/constant';
import { DivFlex, SecondaryLabel } from '..';

const Wrapper = styled.div`
  display: ${(props) => (props.isFooter ? 'block' : 'none')};
  position: fixed;
  bottom: 0;
  width: inherit;
  background: white;
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
      color: #404a8d !important;
    }
    &:not(.xLogo) {
      svg {
        path {
          fill: #404a8d;
        }
      }
    }
  }
  &.disabled {
    span {
      color: #dadada !important;
    }
    svg {
      path {
        fill: #dadada;
      }
    }
  }
`;

const Footer = () => {
  const rootState = useSelector((state) => state);
  const { passwordHash, selectedNetwork, networks, expiredTime, activeTab } = rootState.extensions;
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

  const isDappUrl =
    location.includes('connected-dapps') || location.includes('dapps-transfer') || location.includes('sign-dapps') || location.includes('signed-cmd');
  const history = useHistory();
  useEffect(() => {
    // set up listener
    const setupListener = () => {
      (window as any)?.chrome?.runtime?.onMessage?.addListener(handleMessage);
    };

    setupListener();
    initDataFromLocal();
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
        initDataFromLocal();
      }
    }
  };
  const initDataFromLocal = () => {
    showFetching();
    getLocalSeedPhrase(
      () => {
        setIsHaveSeedPhrase(true);
      },
      () => {
        setIsHaveSeedPhrase(false);
      },
    );
    getLocalExpiredTime(
      (newExpiredTime) => {
        setExpiredTime(newExpiredTime);
      },
      () => {},
    );
    getLocalPassword(
      (accountPassword) => {
        setExtensionPassword(accountPassword);
      },
      () => {},
    );
    getLocalSelectedNetwork(
      (network) => {
        const defaultFounded = defaultNetworks.find((dfNet) => dfNet.id && dfNet.id === network?.id);
        if (defaultFounded) {
          network = defaultFounded;
        }
        setSelectedNetwork({
          name: network.name,
          url: network.url,
          explorer: network.explorer,
          networkId: network.networkId,
          id: network.id,
          isDefault: network.isDefault,
        });
        updateContacts(network.networkId);
        updateRecent(network.networkId);
        updateWallets(network.networkId);
      },
      () => {
        setLocalSelectedNetwork(selectedNetwork);
        updateRecent(selectedNetwork.networkId);
        updateContacts(selectedNetwork.networkId);
        updateWallets(selectedNetwork.networkId);
      },
    );
    getLocalNetworks(
      (localNetworks) => {
        const saveNetworks = [...convertNetworks(localNetworks ?? [])?.filter((n) => !n.isDefault), ...defaultNetworks];
        setNetworks(convertNetworks(saveNetworks));
      },
      () => {
        const newNetworks = revertNetworks([...networks, ...defaultNetworks]);
        setLocalNetworks(newNetworks);
      },
    );
  };

  const updateContacts = (networkId) => {
    getLocalContacts(
      networkId,
      (data) => {
        const contacts = convertContacts(data);
        setContacts(contacts);
      },
      () => {},
    );
  };

  const updateWallets = (networkId) => {
    getLocalPassword(
      (accountPassword) => {
        getLocalWallets(
          networkId,
          (data) => {
            const newWallets = data.map((item) => ({
              chainId: item.chainId,
              account: decryptKey(item.account, accountPassword),
              publicKey: decryptKey(item.publicKey, accountPassword),
              secretKey: decryptKey(item.secretKey, accountPassword),
              connectedSites: item.connectedSites,
            }));
            setWallets(newWallets);
            const { hash } = window.location;
            getLocalSelectedWallet(
              (selectedWallet) => {
                setCurrentWallet({
                  chainId: selectedWallet.chainId,
                  account: decryptKey(selectedWallet.account, accountPassword),
                  publicKey: decryptKey(selectedWallet.publicKey, accountPassword),
                  secretKey: decryptKey(selectedWallet.secretKey, accountPassword),
                  connectedSites: selectedWallet.connectedSites,
                });
                getLocalExpiredTime(
                  () => {
                    if (!isDappUrl) {
                      history.push('/');
                      setActiveTab(ACTIVE_TAB.HOME);
                    }
                  },
                  () => {
                    if (hash.includes('init')) {
                      history.push('/');
                      setActiveTab(ACTIVE_TAB.HOME);
                    }
                  },
                );
              },
              () => {
                const newWallet = newWallets[0];
                setCurrentWallet(newWallet);
                setLocalSelectedWallet(data[0]);
                getLocalExpiredTime(
                  () => {
                    if (!isDappUrl) {
                      history.push('/');
                      setActiveTab(ACTIVE_TAB.HOME);
                    }
                  },
                  () => {
                    if (hash.includes('init')) {
                      history.push('/');
                      setActiveTab(ACTIVE_TAB.HOME);
                    }
                  },
                );
              },
            );
            hideFetching();
          },
          () => {
            setWallets([]);
            setCurrentWallet({
              chainId: 0,
              account: '',
              publicKey: '',
              secretKey: '',
              connectedSites: [],
            });
            setLocalSelectedWallet({
              chainId: 0,
              account: '',
              publicKey: '',
              secretKey: '',
              connectedSites: [],
            });
            if (!isDappUrl) {
              history.push('/init');
            }
            hideFetching();
          },
        );
      },
      () => {
        hideFetching();
      },
    );
  };

  const updateRecent = (networkId) => {
    getLocalRecent(
      networkId,
      (data) => {
        const recent = convertRecent(data);
        setRecent(recent);
      },
      () => {},
    );
  };

  const isLoggedIn = expiredTime;
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
            <XWalletLogoBar />
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
            <NFTIcon />
          </span>
          <SecondaryLabel fontWeight={700}>NFT</SecondaryLabel>
        </ActionBarElement>
        <ActionBarElement
          className={activeTab === ACTIVE_TAB.SETTINGS && 'active'}
          isShow={passwordHash && isLoggedIn && showSettingAndSelectNetworks}
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
