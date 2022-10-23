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

export const DoubleFooter = styled.div`
  margin: -1rem;
  padding: 1rem;
`;

export const AccountActions = ({
  onCreateAccount,
  onImportAccount,
  onRemoveWallet,
}: {
  onCreateAccount: any;
  onImportAccount: any;
  onRemoveWallet: any;
}) => {
  const history = useHistory();
  const stateWallet = useCurrentWallet();
  const { closeModal } = useContext(ModalContext);

  const onActionClick = (clb) => {
    closeModal();
    clb();
  };
  return (
    <>
      <DoubleFooter style={{ padding: '1rem 1rem 2rem 1rem' }}>
        <DivFlex flexDirection="column">
          <ActionList
            actions={[
              {
                src: images.settings.iconShare,
                label: 'Share Wallet',
                onClick: () => {
                  closeModal();
                  navigator.clipboard.writeText(stateWallet?.account);
                  toast.success(<Toast type="success" content="Copied!" />);
                },
              },
              { src: images.settings.iconShare, label: 'Export recovery phrase', onClick: () => onActionClick(history.push('/export-seed-phrase')) },
              { src: images.settings.iconTrash, label: 'Remove selected wallet', onClick: onRemoveWallet },
            ]}
          />
        </DivFlex>
      </DoubleFooter>
      <DoubleFooter style={{ borderTop: ' 1px solid #dfdfed' }}>
        <DivFlex flexDirection="column">
          <ActionList
            actions={[
              { label: 'Create wallet', onClick: () => onActionClick(onCreateAccount) },
              { label: 'Import wallet', onClick: () => onActionClick(onImportAccount) },
            ]}
          />
        </DivFlex>
      </DoubleFooter>
    </>
  );
};
