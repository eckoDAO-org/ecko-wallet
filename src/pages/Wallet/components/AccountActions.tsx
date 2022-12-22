import { useContext, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import images from 'src/images';
import { ActionList } from 'src/components/ActionList';
import { DivFlex } from 'src/components';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { ModalContext } from 'src/contexts/ModalContext';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { BaseTextInput } from 'src/baseComponent';
import Button from 'src/components/Buttons';
import { getLocalWallets, setLocalWallets } from 'src/utils/storage';
import { decryptKey } from 'src/utils/security';
import { setWallets } from 'src/stores/wallet';
import { useSelector } from 'react-redux';

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
  const rootState = useSelector((state) => state);
  const [isOpenAliasModal, setIsOpenAliasModal] = useState(false);
  const [alias, setAlias] = useState('');
  const { closeModal } = useContext(ModalContext);
  const { wallets } = rootState?.wallet;
  const { selectedNetwork, passwordHash } = rootState.extensions;

  const onActionClick = (clb) => {
    closeModal();
    clb();
  };

  const setAccountAlias = () => {
    getLocalWallets(
      selectedNetwork.networkId,
      (items) => {
        const selectedIndex = items.findIndex((a) => decryptKey(a.account, passwordHash) === stateWallet?.account);
        if (selectedIndex > -1) {
          items[selectedIndex].alias = alias;
        }
        setLocalWallets(selectedNetwork.networkId, items);
        const newWallets = [...wallets.filter((a) => a.account !== stateWallet?.account)];
        const selectedWalletIndex = wallets.findIndex((a) => a.account === stateWallet?.account);
        newWallets.splice(selectedWalletIndex, 0, { ...wallets[selectedWalletIndex], alias });
        setWallets(newWallets);
        toast.success(<Toast type="success" content="Alias changed successfully" />);
        closeModal();
      },
      () => {},
    );
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
              { src: images.settings.iconShare, label: 'Export Recovery Phrase', onClick: () => onActionClick(history.push('/export-seed-phrase')) },
              {
                src: images.settings.iconEdit,
                label: 'Edit Account Alias',
                onClick: () => setIsOpenAliasModal(true),
                style: { marginLeft: -2, marginRight: 10, width: 22 },
              },
              { src: images.settings.iconTrash, label: 'Remove Selected Wallet', onClick: onRemoveWallet },
            ]}
          />
        </DivFlex>
      </DoubleFooter>
      <DoubleFooter style={{ borderTop: ' 1px solid #dfdfed' }}>
        <DivFlex flexDirection="column">
          <ActionList
            actions={[
              { label: 'Create Wallet', onClick: () => onActionClick(onCreateAccount) },
              { label: 'Import Wallet', onClick: () => onActionClick(onImportAccount) },
            ]}
          />
        </DivFlex>
      </DoubleFooter>
      {isOpenAliasModal && (
        <ModalCustom
          isOpen={isOpenAliasModal}
          title="Set Account Alias"
          onCloseModal={() => {
            setIsOpenAliasModal(false);
            setAlias('');
          }}
        >
          <div style={{ padding: 24 }}>
            <BaseTextInput
              inputProps={{ value: alias }}
              title="Account Alias"
              height="auto"
              onChange={(e) => {
                if (e.target?.value?.length < 20) {
                  setAlias(e.target.value);
                }
              }}
            />
            <DivFlex justifyContent="space-between" alignItems="center" gap="10px" padding="10px">
              <Button
                label="Cancel"
                size="full"
                variant="disabled"
                onClick={() => {
                  setAlias('');
                  setIsOpenAliasModal(false);
                }}
              />
              <Button
                type="submit"
                label="Save"
                size="full"
                onClick={() => {
                  setAccountAlias();
                  setIsOpenAliasModal(false);
                  setAlias('');
                }}
              />
            </DivFlex>
          </div>
        </ModalCustom>
      )}
    </>
  );
};
