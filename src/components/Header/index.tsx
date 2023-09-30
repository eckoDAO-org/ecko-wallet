import { useContext } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { decryptKey, encryptKey } from 'src/utils/security';
import { setSelectedNetwork } from 'src/stores/extensions';
import { toast } from 'react-toastify';
import { ReactComponent as LedgerIcon } from 'src/images/ledger-logo.svg';
import { ModalContext } from 'src/contexts/ModalContext';
import { AccountList } from 'src/pages/Wallet/components/AccountList';
import { AccountActions } from 'src/pages/Wallet/components/AccountActions';
import { AccountType, setBalance, setCurrentWallet, setWallets } from 'src/stores/wallet';
import { getKeyPairsFromSeedPhrase } from 'src/utils/chainweb';
import { shortenAddress } from 'src/utils';
import images from 'src/images';
import {
  getLocalPassword,
  getLocalSeedPhrase,
  getLocalWallets,
  setLocalSelectedNetwork,
  setLocalSelectedWallet,
  setLocalWallets,
} from 'src/utils/storage';
import RemoveWalletPopup from 'src/pages/Wallet/views/RemoveWalletPopup';
import { DropdownModal } from '../DropdownModal';
import { DivFlex } from '..';
import Toast from '../Toast/Toast';
import { ActionList } from '../ActionList';
import { DropdownRadioModal } from '../DropdownRadioModal';

const HeaderWallet = styled(DivFlex)`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme?.border};
`;

export const Header = ({ hideAccounts }: { hideAccounts?: boolean }) => {
  const history = useHistory();
  const location = useLocation().pathname;
  const rootState = useSelector((state) => state);
  const stateWallet = useCurrentWallet();
  const { openModal, closeModal } = useContext(ModalContext);

  const { selectedNetwork, passwordHash, networks } = rootState.extensions;
  const { wallets, type } = rootState?.wallet;
  const selectedWallet = wallets?.find((a) => a.account === stateWallet?.account);

  const checkWallet = (pub) => {
    let result = true;
    if (wallets && wallets.length) {
      for (let i = 0; i < wallets.length; i += 1) {
        if (wallets[i].publicKey === pub) {
          result = false;
        }
      }
    }
    return result;
  };

  const createAccount = (seedPhrase, index) => {
    const keyPairs = getKeyPairsFromSeedPhrase(seedPhrase, index);
    const { publicKey, secretKey } = keyPairs;
    if (checkWallet(publicKey)) {
      const accountName = `k:${publicKey}`;
      const wallet = {
        account: encryptKey(accountName, passwordHash),
        publicKey: encryptKey(publicKey, passwordHash),
        secretKey: encryptKey(secretKey, passwordHash),
        chainId: '0',
        alias: '',
        connectedSites: [],
      };
      getLocalWallets(
        selectedNetwork.networkId,
        (item) => {
          const newData = [...item, wallet];
          setLocalWallets(selectedNetwork.networkId, newData);
        },
        () => {
          setLocalWallets(selectedNetwork.networkId, [wallet]);
        },
      );
      const newStateWallet = {
        chainId: '0',
        alias: '',
        account: accountName,
        publicKey,
        secretKey,
        connectedSites: [],
      };
      const newWallets = stateWallet.wallets ? [...stateWallet.wallets] : [];
      newWallets.push(newStateWallet);
      setWallets(newWallets);
      setLocalSelectedWallet(wallet);
      setCurrentWallet(newStateWallet);
      toast.success(<Toast type="success" content="Create account successfully!" />);
      closeModal();
    } else {
      createAccount(seedPhrase, index + 1);
      closeModal();
    }
  };

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
    getLocalSeedPhrase(
      (hash) => {
        const plainSeedPhrase = decryptKey(hash, passwordHash);
        createAccount(plainSeedPhrase, 0);
      },
      () => {},
    );
  };

  const handleSelectNetwork = (id) => {
    closeModal();
    const newSelectedNetwork = networks.find((network) => network.id.toString() === id);
    setSelectedNetwork(newSelectedNetwork);
    setCurrentWallet({
      chainId: 0,
      account: '',
      alias: '',
      publicKey: '',
      secretKey: '',
      connectedSites: [],
    });
    setLocalSelectedWallet({
      chainId: 0,
      account: '',
      alias: '',
      publicKey: '',
      secretKey: '',
      connectedSites: [],
    });
    setBalance(0);
    setLocalSelectedNetwork(newSelectedNetwork);
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
              <span style={{ color: '#787B8E', marginLeft: 5 }}>{selectedWallet?.alias || shortenAddress(stateWallet?.account)}</span>{' '}
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
