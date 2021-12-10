import { useRef, useState } from 'react';
import Dropdown from 'src/components/Dropdown';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { useWindowResizeMobile } from 'src/hooks/useWindowResizeMobile';
import images from 'src/images';
import { setCurrentWallet, setWallets } from 'src/stores/wallet';
import {
  ActionButton, BodyModal, ButtonModal, DescriptionModal, TitleModal,
} from 'src/pages/Setting/Networks/style';
import { shortenAddress } from 'src/utils';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import {
  getLocalSelectedWallet,
  getLocalWallets,
  setLocalSelectedWallet,
  setLocalWallets,
} from 'src/utils/storage';
import styled from 'styled-components';
import { decryptKey } from 'src/utils/security';
import ModalExportPrivateKey from './ModalExportPrivateKey';
import RemoveWalletPopup from './RemoveWalletPopup';

const Div = styled.div`
  margin: auto 0;
  font-size: ${(props) => props.fontSize};
  margin-right: ${(props) => props.marginRight};
  text-align: ${(props) => props.textAlign};
`;
const DivChild = styled.div`
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.color};
  margin-top: ${(props) => props.marginTop};
  margin-left: ${(props) => props.marginLeft};
  margin-right: ${(props) => props.marginRight};
  margin-bottom: ${(props) => props.marginBottom};
  font-weight: ${(props) => props.fontWeight};
`;
const DivFlex = styled.div`
  display: flex;
  justify-content: ${(props) => props.justifyContent};
  margin-bottom: ${(props) => props.marginBottom};
  cursor: ${(props) => props.cursor};
  align-items: center;
`;
const Image = styled.img<{ size: string; top: string; width: string }>`
  height: ${($props) => $props.size};
  width: ${($props) => ($props.width ? $props.width : $props.size)};
  margin: auto;
  cursor: pointer;
`;
const Title = styled.div`
  padding: 10px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.6);
`;
const LoadMoreContent = styled.div`
  padding: 20px;
`;
const LoadMoreOption = styled(DivFlex)`
  margin-bottom: 20px;
  cursor: pointer;
`;
const ConnectedSitesContent = styled.div`
`;
const NoData = styled.div`
  text-align: center;
`;
const ConnectedSitesItem = styled(DivFlex)`
  margin-bottom: 20px;
`;
const DivImage = styled(Div)`
  margin: 0;
  display: flex;
  align-items: center;
`;
type Props = {
  stateWallet: any;
  networkId: string;
  passwordHash: string;
  explorer: string;
}
const LoadMoreDropdown = (props: Props) => {
  const {
    stateWallet,
    networkId,
    passwordHash,
    explorer,
  } = props;
  const {
    account,
    chainId,
    connectedSites,
    wallets,
  } = stateWallet;
  const [isMobile] = useWindowResizeMobile(420);
  const [isShowConnectedSites, setShowConnectedSites] = useState(false);
  const [isShowRemoveWallet, setShowRemoveWallet] = useState(false);
  const [isShowExportPrivateKey, setShowExportPrivateKey] = useState(false);
  const [isShowRemoveConfirmConnectedSite, setShowRemoveConfirmConnectedSite] = useState(false);
  const [siteRemove, setSiteRemove] = useState('');
  const refDropdownLoadMore = useRef();
  const openNewTab = () => {
    (window as any)?.chrome?.tabs?.create({ url: '/index.html#/' });
  };
  const overlayDropdownLoadMore = (
    <Div textAlign="left" fontSize="16px">
      <Title>{shortenAddress(account)}</Title>
      <LoadMoreContent>
        {
          isMobile && (
            <LoadMoreOption onClick={openNewTab}>
              <DivImage><Image src={images.wallet.expandView} alt="copy-gray" size={16} width={16} /></DivImage>
              <DivChild marginLeft="20px">Expand view</DivChild>
            </LoadMoreOption>
          )
        }
        <LoadMoreOption onClick={() => { setShowConnectedSites(true); (refDropdownLoadMore as any).current.hideDropdownContent(); }}>
          <DivImage><Image src={images.wallet.connectedSites} alt="copy-gray" size={16} width={16} /></DivImage>
          <DivChild marginLeft="20px">Connected sites</DivChild>
        </LoadMoreOption>
        <LoadMoreOption onClick={() => window.open(explorer, '_blank')}>
          <DivImage><Image src={images.wallet.viewExplorer} alt="copy-gray" size={16} width={16} /></DivImage>
          <DivChild marginLeft="20px">View in Explorer</DivChild>
        </LoadMoreOption>
        <LoadMoreOption onClick={() => { setShowExportPrivateKey(true); (refDropdownLoadMore as any).current.hideDropdownContent(); }}>
          <DivImage><Image src={images.wallet.exportKey} alt="copy-gray" size={16} width={16} /></DivImage>
          <DivChild marginLeft="20px">Export private key</DivChild>
        </LoadMoreOption>
        <DivFlex cursor="pointer" onClick={() => { setShowRemoveWallet(true); (refDropdownLoadMore as any).current.hideDropdownContent(); }}>
          <DivImage><Image src={images.wallet.removeWallet} alt="copy-gray" size={16} width={16} /></DivImage>
          <DivChild marginLeft="20px">Remove wallet</DivChild>
        </DivFlex>
      </LoadMoreContent>
    </Div>
  );
  const onRemoveConnectedSite = (site) => {
    const newConnectedSites = connectedSites.filter((s) => s !== site) || [];
    setCurrentWallet({ ...stateWallet, connectedSites: newConnectedSites });
    const newWallets = wallets.map((w) => {
      if (w.chainId.toString() === chainId.toString() && w.account === account) {
        return { ...w, connectedSites: newConnectedSites };
      }
      return w;
    });
    setWallets(newWallets);
    getLocalSelectedWallet((selectedWallet) => {
      setLocalSelectedWallet({ ...selectedWallet, connectedSites: newConnectedSites });
      getLocalWallets(networkId, (localWallets) => {
        const newLocalWallets = localWallets.map((item) => {
          if (chainId.toString() === item.chainId.toString() && account === decryptKey(item.account, passwordHash)) {
            return { ...item, connectedSites: newConnectedSites };
          }
          return item;
        });
        setLocalWallets(networkId, newLocalWallets);
      }, () => {});
    }, () => {});
    toast.success(<Toast type="success" content="Remove connected site successfully." />);
    setShowConnectedSites(false);
    setShowRemoveConfirmConnectedSite(false);
  };
  const renderConnectedSites = (sites) => sites.map((site) => (
    <ConnectedSitesItem key={site} justifyContent="space-between">
      <DivFlex>
        <Image
          src={images.wallet.directionBlack}
          alt="trash"
          size={16}
          width={16}
        />
        <DivChild marginLeft="10px">{site}</DivChild>
      </DivFlex>
      <Div>
        <Image
          src={images.settings.trashViolet}
          alt="trash"
          size={16}
          width={16}
          onClick={() => {
            setSiteRemove(site);
            setShowRemoveConfirmConnectedSite(true);
          }}
        />
      </Div>
    </ConnectedSitesItem>
  ));
  const shortenString = (name) => (name.length > 13 ? `${name.substring(0, 10)}...` : name);
  return (
    <Div>
      <Dropdown ref={refDropdownLoadMore} placement="left" overlayDropdown={overlayDropdownLoadMore}>
        <Image src={images.wallet.iconMorePurple} alt="icon-dropdown" />
      </Dropdown>
      {
        isShowConnectedSites && (
          <ModalCustom isOpen={isShowConnectedSites} title="Connected sites" onCloseModal={() => setShowConnectedSites(false)}>
            <ConnectedSitesContent>
              {
                connectedSites && connectedSites.length > 0 ? renderConnectedSites(connectedSites) : <NoData>No data</NoData>
              }
            </ConnectedSitesContent>
          </ModalCustom>
        )
      }
      {
        isShowRemoveWallet && (
          <ModalCustom isOpen={isShowRemoveWallet} onCloseModal={() => setShowRemoveWallet(false)} showCloseIcon={false} closeOnOverlayClick={false}>
            <RemoveWalletPopup onClose={() => setShowRemoveWallet(false)} />
          </ModalCustom>
        )
      }
      {
        isShowExportPrivateKey && (
          <ModalExportPrivateKey
            isOpen={isShowExportPrivateKey}
            title="Export Private Key"
            onCloseModal={() => setShowExportPrivateKey(false)}
          />
        )
      }
      {
        isShowRemoveConfirmConnectedSite && (
          <ModalCustom isOpen={isShowRemoveConfirmConnectedSite} showCloseIcon={false}>
            <BodyModal>
              <TitleModal>{`Disconnect ${shortenString(siteRemove)}`}</TitleModal>
              <DescriptionModal>Are you sure you want to disconnect?</DescriptionModal>
              <ActionButton>
                <ButtonModal background="#f2f2f2" color="#606a73" onClick={() => setShowRemoveConfirmConnectedSite(false)}>Cancel</ButtonModal>
                <ButtonModal background="#461A57" color="#ffffff" onClick={() => onRemoveConnectedSite(siteRemove)}>Disconnect</ButtonModal>
              </ActionButton>
            </BodyModal>
          </ModalCustom>
        )
      }
    </Div>
  );
};
export default LoadMoreDropdown;
