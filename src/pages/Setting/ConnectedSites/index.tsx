import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { decryptKey } from 'src/utils/security';
import Toast from 'src/components/Toast/Toast';
import { toast } from 'react-toastify';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';
import { RoundedArrow } from 'src/components/Activities/FinishTransferItem';
import { ConfirmModal } from 'src/components/ConfirmModal';
import { useCurrentWallet } from 'src/stores/slices/wallet/hooks';
import { CommonLabel, DivFlex } from 'src/components';
import { useModalContext } from 'src/contexts/ModalContext';
import { getLocalSelectedWallet, getLocalWallets, setLocalSelectedWallet, setLocalWallets } from 'src/utils/storage';
import { setCurrentWallet, setWallets } from 'src/stores/slices/wallet';
import { ReactComponent as IconNetwork } from 'src/images/icon-network.svg';
import { ReactComponent as TrashIcon } from 'src/images/trash-icon.svg';
import { NavigationHeader } from 'src/components/NavigationHeader';
import { ContactBody } from '../Contact/style';
import { SettingBody } from '../style';
import { Body } from '../../SendTransactions/styles';

const RightAction = styled(DivFlex)`
  svg {
    path {
      fill: ${({ theme }) => theme.text.secondary};
    }
  }
`;

const PageConnectedSites = () => {
  const history = useHistory();
  const { theme } = useAppThemeContext();
  const { openModal, closeModal } = useModalContext();
  const stateWallet = useCurrentWallet();
  const rootState = useSelector((state) => state);
  const { selectedNetwork, passwordHash } = rootState.extensions;
  const { connectedSites, wallets, account } = stateWallet;

  const goBack = () => {
    history.push('/setting');
  };

  const onDeleteSite = (site) => {
    const newConnectedSites = connectedSites.filter((s) => s !== site) || [];
    setCurrentWallet({ ...stateWallet, connectedSites: newConnectedSites });
    const newWallets = wallets.map((w) => {
      if (w.account === account) {
        return { ...w, connectedSites: newConnectedSites };
      }
      return w;
    });
    setWallets(newWallets);
    getLocalSelectedWallet(
      (selectedWallet) => {
        setLocalSelectedWallet({ ...selectedWallet, connectedSites: newConnectedSites });
        getLocalWallets(
          selectedNetwork.networkId,
          (localWallets) => {
            const newLocalWallets = localWallets.map((item) => {
              if (account === decryptKey(item.account, passwordHash)) {
                return { ...item, connectedSites: newConnectedSites };
              }
              return item;
            });
            setLocalWallets(selectedNetwork.networkId, newLocalWallets);
          },
          () => {},
        );
      },
      () => {},
    );
    closeModal();
    toast.success(<Toast type="success" content="Site removed successfully." />);
  };

  const renderConnectedSites = () =>
    connectedSites.map((item) => (
      <DivFlex key={item} justifyContent="space-between" alignItems="center" padding="10px 24px" style={{ cursor: 'pointer' }}>
        <DivFlex alignItems="center" gap="5px">
          <RoundedArrow margin="0px 5px 0px 0px" color={theme.footer?.primary}>
            <IconNetwork />
          </RoundedArrow>
          <CommonLabel>{item}</CommonLabel>
        </DivFlex>
        <RightAction>
          <TrashIcon
            onClick={() => {
              openModal({
                title: 'Remove site',
                content: (
                  <ConfirmModal
                    text={
                      <>
                        Are you sure you want remove <br />
                        <b>{item}</b> site?
                      </>
                    }
                    onClose={closeModal}
                    onConfirm={() => onDeleteSite(item)}
                  />
                ),
              });
            }}
          />
        </RightAction>
      </DivFlex>
    ));

  return (
    <SettingBody>
      <div style={{ padding: '0 24px' }}>
        <NavigationHeader title="Connected Sites" onBack={goBack} />
      </div>
      <Body>
        <ContactBody>{renderConnectedSites()}</ContactBody>
      </Body>
    </SettingBody>
  );
};
export default PageConnectedSites;
