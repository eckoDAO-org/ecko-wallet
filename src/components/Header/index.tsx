/* eslint-disable no-console */
import {
  useRef,
} from 'react';
import {
  useHistory, useLocation,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import images from 'src/images';
import {
  setActiveTab,
  setContacts,
  setRecent,
  setSelectedNetwork,
} from 'src/stores/extensions';
import {
  setCurrentWallet,
  setBalance,
} from 'src/stores/wallet';
import {
  setLocalSelectedNetwork,
  setLocalSelectedWallet,
} from 'src/utils/storage';
import { ACTIVE_TAB } from 'src/utils/constant';
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
const Logo = styled.img`
`;

const LogoImage = styled.img`
  height: 16px;
  width: auto;
  margin-left: 12px;
`;
const ImageWrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
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
  const location = useLocation().pathname;
  const showSettingAndSelectNetworks = !(
    location.includes('setting')
    || location.includes('networks')
    || location.includes('contact')
    || location.includes('about')
  );
  const showHeader = !(location.includes('sign-in') || location.includes('home-page'));
  const history = useHistory();
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

  const isLoggedIn = expiredTime;
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
          <ImageWrapper
            onClick={() => {
              history.push('/');
              setActiveTab(ACTIVE_TAB.HOME);
            }}
          >
            <Logo alt="logo" src={images.logoHome} />
            <LogoImage src={images.logoName} alt="logo" />
          </ImageWrapper>
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
