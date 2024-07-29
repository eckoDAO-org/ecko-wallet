import { useContext } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useCurrentWallet } from 'src/stores/slices/wallet/hooks';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { encryptKey } from 'src/utils/security';
import { toast } from 'react-toastify';
import { ReactComponent as LedgerIcon } from 'src/images/ledger-logo.svg';
import { ModalContext } from 'src/contexts/ModalContext';
import { AccountList } from 'src/pages/Wallet/components/AccountList';
import { AccountActions } from 'src/pages/Wallet/components/AccountActions';
import { AccountType, setBalance, setCurrentWallet } from 'src/stores/slices/wallet';
import { shortenAddress } from 'src/utils';
import images from 'src/images';
import {
  getLocalPassword,
  setLocalSelectedWallet,
} from 'src/utils/storage';
import RemoveWalletPopup from 'src/pages/Wallet/views/RemoveWalletPopup';
import { useCreateFirstAccountAvailable, useSelectNetwork } from 'src/hooks/wallet';
import { DropdownModal } from '../DropdownModal';
import { DivFlex } from '..';
import Toast from '../Toast/Toast';
import { ActionList } from '../ActionList';
import { DropdownRadioModal } from '../DropdownRadioModal';

const HeaderWallet = styled(DivFlex)`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme?.border};
`;

const AccountLabel = styled.span`
  color: ${({ theme }) => theme.text.primary};
  margin-left: 5px;
`;

export const Header = ({ hideAccounts }: { hideAccounts?: boolean }) => {
  const history = useHistory();
  const location = useLocation().pathname;
  const rootState = useSelector((state) => state);
  const stateWallet = useCurrentWallet();
  const { openModal, closeModal } = useContext(ModalContext);
  const createFirstAccountAvailable = useCreateFirstAccountAvailable();
  const selectNetwork = useSelectNetwork();

  const { selectedNetwork, networks } = rootState.extensions;
  const { wallets, type } = rootState?.wallet;
  const selectedWallet = wallets?.find((a) => a.account === stateWallet?.account);

  const setSelectedLocalWallet = (wallet) => {
    getLocalPassword(
      (accountPassword) => {
        const newWallet = {
          account: encryptKey(wallet.account, accountPassword),
          publicKey: encryptKey(wallet.publicKey, accountPassword),
          secretKey: encryptKey(wallet.secretKey, accountPassword),
          chainId: wallet.chainId,
          type: wallet.type,
          connectedSites: wallet.connectedSites,
        };
        setLocalSelectedWallet(newWallet);
      },
      () => {},
    );
  };

  const goImportAccount = () => {
    history.push({
      pathname: '/import-wallet',
      state: { from: location },
    });
    closeModal();
  };

  const goImportFromLedger = () => {
    window.open('/index.html#/import-hardware-wallet', '_blank');
    closeModal();
  };

  const onRemoveWallet = () => {
    openModal({ title: 'Remove wallet', content: <RemoveWalletPopup onClose={() => closeModal()} /> });
  };

  const onCreateAccount = () => {
    createFirstAccountAvailable().then(() => {
      toast.success(<Toast type="success" content="Create account successfully!" />);
      closeModal();
    });
  };

  const handleSelectNetwork = (id) => {
    closeModal();
    selectNetwork(id);
  };

  return (
    <HeaderWallet justifyContent="space-between">
      <DropdownRadioModal
        modalTitle="Select Network"
        value={selectedNetwork && { value: selectedNetwork.id, label: selectedNetwork.name }}
        options={networks.map((n) => ({ label: n.name, value: n.id }))}
        onChange={(network) => handleSelectNetwork(network?.value)}
        modalFooter={
          <ActionList
            actions={[
              {
                src: images.settings.iconGear,
                label: 'Manage networks',
                onClick: () => {
                  closeModal();
                  history.push('/networks');
                },
              },
            ]}
          />
        }
      />
      {!hideAccounts && (
        <DropdownModal
          title={
            <DivFlex>
              {type === AccountType.LEDGER ? <LedgerIcon /> : <Jazzicon diameter={24} seed={jsNumberForAddress(stateWallet?.account)} />}{' '}
              <AccountLabel>{selectedWallet?.alias || shortenAddress(stateWallet?.account)}</AccountLabel>{' '}
            </DivFlex>
          }
          iconComponent={<img src={images.moreIcon} style={{ width: 14, marginTop: 10 }} />}
          iconContainerStyle={{ padding: 0 }}
          containerStyle={{ border: 'none', justifyContent: 'flex-end' }}
          modalTitle="My Wallets"
          modalContent={
            <AccountList
              onSelectWallet={(w) => {
                setSelectedLocalWallet(w);
                setCurrentWallet(w);
                setBalance(0);
              }}
            />
          }
          modalFooter={
            <AccountActions
              onCreateAccount={onCreateAccount}
              onImportAccount={goImportAccount}
              onImportFromLedger={goImportFromLedger}
              onRemoveWallet={onRemoveWallet}
            />
          }
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigator.clipboard.writeText(stateWallet?.account);
            toast.success(<Toast type="success" content="Copied!" />);
          }}
        />
      )}
    </HeaderWallet>
  );
};
