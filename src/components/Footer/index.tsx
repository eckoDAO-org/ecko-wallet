import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import images from 'src/images';
import {
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
import { convertContacts, convertNetworks, convertRecent, revertNetworks } from 'src/utils';
import { ACTIVE_TAB } from 'src/utils/constant';

const WrapHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 15px;
`;
const DivFooter = styled.div`
  font-size: 1.5em;
  position: relative;
  position: sticky;
  bottom: 0;
  z-index: 2;
  background: #ffffff;
`;
const ImgSetting = styled.img`
  width: 25px;
`;
const Logo = styled.img`
  cursor: pointer;
`;
const Wrapper = styled.div`
  display: ${(props) => (props.isFooter ? 'block' : 'none')};
  position: fixed;
  bottom: 0;
  width: inherit;
`;
const Hr = styled.div`
  background: linear-gradient(90deg, #d2ab72 0%, #b66e84 35.42%, #b2579b 64.06%, #9ee9e4 99.48%);
  height: 2px;
`;

const Image = styled.img<{ size: string; top: string; width: string }>`
  height: ${($props) => $props.size};
  width: ${($props) => ($props.width ? $props.width : $props.size)};
  margin: auto;
  cursor: pointer;
`;

const SettingWrapper = styled.div`
  display: flex;
  cursor: pointer;
  visibility: ${(props) => (props.isShow ? 'visible' : 'hidden')};
`;

const DivImage = styled.div`
  margin-left: ${(props) => props.marginLeft};
  margin: auto 0;
  display: flex;
`;

const OptionHeader = styled.div`
  display: flex;
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
        setNetworks(convertNetworks(localNetworks));
      },
      () => {
        const newNetworks = revertNetworks(networks);
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
      <DivFooter>
        <Hr />
        <WrapHeader>
          <DivImage onClick={setIconHomeActive}>
            <Logo alt="logo-home" src={activeTab === ACTIVE_TAB.HOME ? images.iconHomeActive : images.iconHome} />
          </DivImage>
          <DivImage>
            <DivImage onClick={setIconHistoryActive}>
              <Image alt="icon-history" src={activeTab === ACTIVE_TAB.HISTORY ? images.iconHistoryActive : images.iconHistory} />
            </DivImage>
          </DivImage>
          <OptionHeader>
            <SettingWrapper isShow={passwordHash && isLoggedIn && showSettingAndSelectNetworks} onClick={setIconSettingActive}>
              <ImgSetting alt="icon-setting" src={activeTab === ACTIVE_TAB.SETTINGS ? images.iconSettingActive : images.setting} />
            </SettingWrapper>
          </OptionHeader>
        </WrapHeader>
      </DivFooter>
    </Wrapper>
  );
};

export default Footer;
