/* eslint-disable no-console */
import {
  useRef,
  useEffect,
} from 'react';
import {
  useHistory, useLocation,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import images from 'src/images';
import {
  hideFetching,
  setContacts,
  setExpiredTime,
  setExtensionPassword,
  setIsHaveSeedPhrase,
  setNetworks,
  setRecent,
  setSelectedNetwork,
  showFetching,
} from 'src/stores/extensions';
import {
  setCurrentWallet,
  setWallets,
  setBalance,
} from 'src/stores/wallet';
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
import {
  convertContacts,
  convertNetworks,
  convertRecent,
  revertNetworks,
  // shortenAddress,
} from 'src/utils';
import Dropdown from '../Dropdown';

const WrapHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px 15px;
`;
const DivHeader = styled.div`
    font-size: 1.5em;
    position: relative;
    position: sticky;
    top: 0;
    z-index: 2;
    background: linear-gradient(90deg, #E6FEFE 0%, #FDF6E6 100%);
`;
// const ImgSetting = styled.img`
//   width: 29px;
// `;
const Logo = styled.img`
  cursor: pointer;
`;
const Hr = styled.div`
  background: linear-gradient(90deg, #D2AB72 0%, #B66E84 35.42%, #B2579B 64.06%, #9EE9E4 99.48%);
  height: 2px;
`;
const Div = styled.div`
  padding-bottom: ${(props) => props.paddingBottom};
  border-bottom: ${(props) => props.borderBottom};
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.color};
  padding-left: ${(props) => props.paddingLeft};
  padding-right: ${(props) => props.paddingRight};
  padding-top: ${(props) => props.paddingTop}; 
`;
// const ListWallet = styled(Div)`
//   max-height: 150px;
//   overflow-y: auto;
//   &::-webkit-scrollbar {
//     width: 5px;
//   }
//   &::-webkit-scrollbar-track {
//     background: #f1f1f1;
//   }
//   &::-webkit-scrollbar-thumb {
//     background: #7b7b7b9e;
//     border-radius: 2px;
//   }
// `;
const TitleSetting = styled.div`
  padding: 15px 15px;
  border-bottom: 1px solid #ffffff80;
  font-size: 20px;
  text-align: ${(props) => props.textAlign};
  font-weight: 700;
  margin-left: ${(props) => props.marginLeft};
  display: ${(props) => props.display};
`;
const DivChild = styled.div`
  font-size: ${(props) => props.fontSize};
  margin: auto 0;
  margin-right: ${(props) => props.marginRight};
  margin-left: ${(props) => props.marginLeft};
  line-height: 24px;
  color: ${(props) => props.color};
  width: ${(props) => props.Width};
  overflow: ${(props) => props.OverFlow};
  text-overflow: ${(props) => props.TextOverflow};
  white-space: ${(props) => props.WhiteSpace};
  font-weight: ${(props) => props.fontWeight};
  display: ${(props) => props.display};
`;
const DivChildImage = styled.div`
  width: 17%;
`;
// const Account = styled.div`
//   padding: 0 0 10px 0;
//   display: flex;
//   justify-content: ${(props) => props.justifyContent}
// `;
const DivFlex = styled.div`
  display: flex;
  padding-bottom: ${(props) => props.paddingBottom};
  cursor: pointer;
  width: ${(props) => (props.width ? props.width : '100%')};
  margin-bottom: ${(props) => props.marginBottom};
  justify-content: ${(props) => props.justifyContent};
  align-items: ${(props) => props.alignItems};
`;
const Image = styled.img<{ size: string; top: string; width: string }>`
  height: ${($props) => $props.size};
  width: ${($props) => ($props.width ? $props.width : $props.size)};
  margin: auto;
`;
// const WalletOption = styled.div`
//   padding: 20px 20px 10px 15px;
// `;
const NetWorkSelect = styled.div`
  display: flex;
  gap: 10px;
  padding: 5px 20px;
  border-radius: 20px;
  background: #E2D5E1;
  border: 1px solid #461A57;
`;
const DivImage = styled.div`
  margin-left: ${(props) => props.marginLeft};
  margin: auto 0;
  padding-bottom: ${(props) => props.paddingBottom}
`;
const NetWorkName = styled.div`
  padding-bottom: ${(props) => props.paddingBottom};
  border-bottom: ${(props) => props.borderBottom};
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.color};
  margin: auto 0;
  width: ${(props) => props.Width};
  overflow: ${(props) => props.OverFlow};
  text-overflow: ${(props) => props.TextOverflow};
  white-space: ${(props) => props.WhiteSpace};
`;
const OptionHeader = styled.div`
  display: flex;
`;
const NetworkOption = styled.div`
  padding: 20px 20px 10px 15px;
  max-height: 105px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  &::-webkit-scrollbar-thumb {
    background: #7b7b7b9e;
    border-radius: 2px;
  } 
`;

const Header = () => {
  const rootState = useSelector((state) => state);
  const {
    passwordHash,
    selectedNetwork,
    networks,
    expiredTime,
  } = rootState.extensions;
  // const { wallets, chainId, account } = rootState.wallet;
  const location = useLocation().pathname;
  const showSettingAndSelectNetworks = !(
    location.includes('setting')
    || location.includes('networks')
    || location.includes('contact')
    || location.includes('about')
  );
  const showHeader = !(location.includes('sign-in') || location.includes('home-page'));
  const isDappUrl = location.includes('connected-dapps') || location.includes('dapps-transfer') || location.includes('sign-dapps');
  const history = useHistory();
  // const childRef = useRef();
  const refSelectNetwork = useRef();
  const handleSelectNetwork = (id) => {
    const newSelectedNetwork = networks.find((network) => network.id.toString() === id.toString());
    setSelectedNetwork(newSelectedNetwork);
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
    setBalance(0);
    setLocalSelectedNetwork(newSelectedNetwork);
    setContacts([]);
    setRecent([]);
    (refSelectNetwork as any).current.hideDropdownContent();
  };

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
      const isSyncUrl = hash === '#/' || hash.includes('connected-dapps') || hash.includes('dapps-transfer') || hash.includes('sign-dapps');
      if (request.type === 'create_password' && !hash.includes('sign-in')) {
        setExtensionPassword(request.passwordHash);
        history.push('/sign-in');
      } else {
        // Account changed
        initDataFromLocal();
        if (!isSyncUrl) {
          history.push('/');
        }
      }
    }
  };
  const initDataFromLocal = () => {
    showFetching();
    getLocalSeedPhrase(() => {
      setIsHaveSeedPhrase(true);
    }, () => {
      setIsHaveSeedPhrase(false);
    });
    getLocalExpiredTime((newExpiredTime) => {
      setExpiredTime(newExpiredTime);
    }, () => {});
    getLocalPassword((accountPassword) => {
      setExtensionPassword(accountPassword);
    }, () => {});
    getLocalSelectedNetwork((network) => {
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
    }, () => {
      setLocalSelectedNetwork(selectedNetwork);
      updateRecent(selectedNetwork.networkId);
      updateContacts(selectedNetwork.networkId);
      updateWallets(selectedNetwork.networkId);
    });
    getLocalNetworks((localNetworks) => {
      setNetworks(convertNetworks(localNetworks));
    }, () => {
      const newNetworks = revertNetworks(networks);
      setLocalNetworks(newNetworks);
    });
  };

  const updateContacts = (networkId) => {
    getLocalContacts(networkId, (data) => {
      const contacts = convertContacts(data);
      setContacts(contacts);
    }, () => {});
  };

  const updateWallets = (networkId) => {
    getLocalPassword((accountPassword) => {
      getLocalWallets(networkId, (data) => {
        const newWallets = data.map((item) => ({
          chainId: item.chainId,
          account: decryptKey(item.account, accountPassword),
          publicKey: decryptKey(item.publicKey, accountPassword),
          secretKey: decryptKey(item.secretKey, accountPassword),
          connectedSites: item.connectedSites,
        }));
        setWallets(newWallets);
        const { hash } = window.location;
        getLocalSelectedWallet((selectedWallet) => {
          setCurrentWallet({
            chainId: selectedWallet.chainId,
            account: decryptKey(selectedWallet.account, accountPassword),
            publicKey: decryptKey(selectedWallet.publicKey, accountPassword),
            secretKey: decryptKey(selectedWallet.secretKey, accountPassword),
            connectedSites: selectedWallet.connectedSites,
          });
          if (hash.includes('init')) {
            history.push('/');
          }
        }, () => {
          const newWallet = newWallets[0];
          setCurrentWallet(newWallet);
          setLocalSelectedWallet(data[0]);
          if (hash.includes('init')) {
            history.push('/');
          }
        });
        hideFetching();
      }, () => {
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
      });
    }, () => {
      hideFetching();
    });
  };

  const updateRecent = (networkId) => {
    getLocalRecent(networkId, (data) => {
      const recent = convertRecent(data);
      setRecent(recent);
    }, () => {});
  };

  // const checkSelectedWallet = (wallet) => wallet.chainId.toString() === chainId.toString() && wallet.account === account;
  // const setSelectedLocalWallet = (wallet) => {
  //   getLocalPassword((accountPassword) => {
  //     const newWallet = {
  //       account: encryptKey(wallet.account, accountPassword),
  //       publicKey: encryptKey(wallet.publicKey, accountPassword),
  //       secretKey: encryptKey(wallet.secretKey, accountPassword),
  //       chainId: wallet.chainId,
  //       connectedSites: wallet.connectedSites,
  //     };
  //     setLocalSelectedWallet(newWallet);
  //   }, () => {});
  // };

  // const goImportAccount = () => {
  //   history.push({
  //     pathname: '/import-wallet',
  //     state: { from: location },
  //   });
  //   (childRef as any).current.hideDropdownContent();
  // };
  // const goSetting = () => {
  //   history.push('/setting');
  //   (childRef as any).current.hideDropdownContent();
  // };
  const isLoggedIn = expiredTime;
  // const overlayDropdownSetting = (
  //   <Div>
  //     <TitleSetting>Wallets</TitleSetting>
  //     {wallets.length > 0 && !location.includes('init') && (
  //       <ListWallet
  //         paddingBottom="10px"
  //         paddingLeft="15px"
  //         paddingRight="20px"
  //         paddingTop="20px"
  //         borderBottom="1px solid rgba(255, 255, 255, 0.5)"
  //       >
  //         {wallets.map((wallet: any) => {
  //           const isSelected = checkSelectedWallet(wallet);
  //           return (
  //             <Account
  //               justifyContent="space-between"
  //               key={`${wallet.account}-${wallet.chainId}`}
  //             >
  //               <DivFlex
  //                 onClick={() => {
  //                   if (!isSelected) {
  //                     setSelectedLocalWallet(wallet);
  //                     setCurrentWallet(wallet);
  //                     setBalance(0);
  //                     history.push('/');
  //                     (childRef as any).current.hideDropdownContent();
  //                   }
  //                 }}
  //                 justifyContent="space-between"
  //               >
  //                 <DivChild fontSize="13px">
  //                   <DivChild fontWeight="700">{shortenAddress(wallet.account)}</DivChild>
  //                   <DivChild>{`Chain ${wallet.chainId}`}</DivChild>
  //                 </DivChild>
  //                 <DivFlex alignItems="center" width="auto">
  //                   {isSelected && (
  //                   <Image src={images.checkbox} alt="check-box" />
  //                   )}
  //                 </DivFlex>
  //               </DivFlex>
  //             </Account>
  //           );
  //         })}
  //       </ListWallet>
  //     )}
  //     <WalletOption>
  //       <DivFlex paddingBottom="10px" onClick={goImportAccount}>
  //         <DivChild marginRight="20px"><Image src={images.received} alt="received" size={20} width={20} /></DivChild>
  //         <DivChild fontSize="16px" fontWeight="700">Import wallet</DivChild>
  //       </DivFlex>
  //       <DivFlex onClick={goSetting}>
  //         <DivChild marginRight="20px" display="flex"><Image src={images.settingWhite} alt="setting" size={20} width={20} /></DivChild>
  //         <DivChild fontSize="16px" fontWeight="700">Settings</DivChild>
  //       </DivFlex>
  //     </WalletOption>
  //   </Div>
  // );
  const overlayDropdownOptionNetwork = (
    <Div>
      <TitleSetting display="flex">
        <DivChildImage />
        <DivChild>Networks</DivChild>
      </TitleSetting>
      {
        networks.length > 0 && (
          <NetworkOption>
            {
              networks.map((network: any) => {
                const isSelected = selectedNetwork?.id?.toString() === network?.id?.toString();
                return (
                  <DivFlex
                    key={network.id}
                    marginBottom="10px"
                    onClick={() => {
                      if (!isSelected) {
                        handleSelectNetwork(network?.id);
                      }
                    }}
                  >
                    <DivChildImage>
                      {isSelected && (
                      <Image src={images.checkbox} alt="check-box" />
                      )}
                    </DivChildImage>
                    <DivChild
                      fontSize="16px"
                      color={isSelected ? '#ffffff' : '#c4c4c4'}
                      Width="150px"
                      OverFlow="hidden"
                      TextOverflow="ellipsis"
                      WhiteSpace="nowrap"
                    >
                      {network?.name}
                    </DivChild>
                  </DivFlex>
                );
              })
            }
          </NetworkOption>
        )
      }
    </Div>
  );

  return (
    <>
      { showHeader && (
      <DivHeader>
        <WrapHeader>
          <DivImage>
            <Logo alt="logo" src={images.logoHome} onClick={() => { history.push('/'); }} />
          </DivImage>
          <OptionHeader>
            {passwordHash && isLoggedIn && showSettingAndSelectNetworks && (
            <Dropdown ref={refSelectNetwork} placement="left" translate="-55%" trianglePosition="50px" overlayDropdown={overlayDropdownOptionNetwork}>
              <NetWorkSelect>
                <NetWorkName
                  Width="60px"
                  OverFlow="hidden"
                  TextOverflow="ellipsis"
                  WhiteSpace="nowrap"
                  fontSize="14px"
                  color="#461A57"
                >
                  {selectedNetwork?.name}
                </NetWorkName>
                <DivImage paddingBottom="2px"><Image src={images.wallet.arrayDropdownPurple} /></DivImage>
              </NetWorkSelect>
            </Dropdown>
            )}
            {/* {passwordHash && isLoggedIn && showSettingAndSelectNetworks && (
            <DivChild marginLeft="15px">
              <Dropdown
                overlayDropdown={overlayDropdownSetting}
                placement="left"
                ref={childRef}
              >
                <ImgSetting src={images.setting} />
              </Dropdown>
            </DivChild>
            )} */}
          </OptionHeader>
        </WrapHeader>
        <Hr />
      </DivHeader>
      )}
    </>
  );
};

export default Header;
