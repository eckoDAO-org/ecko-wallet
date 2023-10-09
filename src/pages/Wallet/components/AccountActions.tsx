import { useContext } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import images from 'src/images';
import { ActionList } from 'src/components/ActionList';
import { DivFlex } from 'src/components';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { ModalContext } from 'src/contexts/ModalContext';
import { useSelector } from 'react-redux';
import { AliasModal } from '../modals/AliasModal';
import { HashSignModal } from '../modals/HashSignModal';

export const DoubleFooter = styled.div`
  margin: -1rem;
  padding: 1rem;
`;

export const AccountActions = ({
  onCreateAccount,
  onImportAccount,
  onImportFromLedger,
  onRemoveWallet,
}: {
  onCreateAccount: any;
  onImportAccount: any;
  onImportFromLedger: any;
  onRemoveWallet: any;
}) => {
  const history = useHistory();
  const stateWallet = useCurrentWallet();
  const rootState = useSelector((state) => state);
  const { openModal } = useContext(ModalContext);
  const { wallets } = rootState?.wallet;

  const onActionClick = (clb) => {
    clb();
  };

  const actions = [
    {
      src: images.settings.iconShare,
      label: 'Share Wallet',
      onClick: () => {
        navigator.clipboard.writeText(stateWallet?.account);
        toast.success(<Toast type="success" content="Copied!" />);
      },
    },
    { src: images.settings.iconShare, label: 'Export Recovery Phrase', onClick: () => onActionClick(history.push('/export-seed-phrase')) },
    {
      src: images.settings.iconSignHash,
      label: 'Sign Hash Transaction',
      onClick: () => openModal({ title: 'Sign Hash Transaction', content: <HashSignModal /> }),
      style: { marginLeft: -2, marginRight: 10, width: 22 },
    },
    {
      src: images.settings.iconEdit,
      label: 'Edit Account Alias',
      onClick: () => openModal({ title: 'Set Account Alias', content: <AliasModal /> }),
      style: { marginLeft: -2, marginRight: 10, width: 22 },
    },
  ];
  if (wallets?.length > 1) {
    actions.push({ src: images.settings.iconTrash, label: 'Remove Selected Wallet', onClick: onRemoveWallet });
  }

  return (
    <>
      <DoubleFooter style={{ padding: '1rem 1rem 2rem 1rem' }}>
        <DivFlex flexDirection="column">
          <ActionList actions={actions} />
        </DivFlex>
      </DoubleFooter>
      <DoubleFooter style={{ borderTop: ' 1px solid #dfdfed' }}>
        <DivFlex flexDirection="column">
          <ActionList
            actions={[
              { label: 'Create Wallet', onClick: () => onActionClick(onCreateAccount) },
              { label: 'Import Wallet', onClick: () => onActionClick(onImportAccount) },
              { label: 'Import Hardware Wallet', onClick: () => onActionClick(onImportFromLedger) },
            ]}
          />
        </DivFlex>
      </DoubleFooter>
    </>
  );
};
