/* eslint-disable no-console */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavigationHeader } from 'src/components/NavigationHeader';
import Button from 'src/components/Buttons';
import { useHistory } from 'react-router-dom';
import { DivFlex, PageWrapper, SecondaryLabel } from 'src/components';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { hideLoading, setActiveTab, showLoading } from 'src/stores/slices/extensions';
import { fetchLocal } from 'src/utils/chainweb';
import { getLocalPassword, getLocalWallets, setLocalSelectedWallet, setLocalWallets } from 'src/utils/storage';
import { find, isEmpty } from 'lodash';
import { encryptKey } from 'src/utils/security';
import { AccountType, setCurrentWallet, setWallets } from 'src/stores/slices/wallet';
import { ACTIVE_TAB } from 'src/utils/constant';
import { useLedgerContext } from 'src/contexts/LedgerContext';

const ImportLedger = () => {
  const history = useHistory();
  const rootState = useSelector((state) => state);
  const [ledgerPublicKey, setLedgerPublicKey] = useState<string>('');
  const { wallets } = rootState?.wallet;
  const { selectedNetwork } = rootState?.extensions;
  const { getPublicKey, error } = useLedgerContext();

  const getLedgerAccount = async () => {
    try {
      const publicKey = await getPublicKey();
      setLedgerPublicKey(publicKey ?? '');
      const accountName = `k:${ledgerPublicKey}`;
      const pactCode = `(coin.details "${accountName}")`;
      showLoading();
      fetchLocal(pactCode, selectedNetwork.url, selectedNetwork.networkId, 0)
        .then((response) => {
          console.log('🚀 !!! ~ response:', response);
          hideLoading();
          // if ()
        })
        .catch(() => {
          hideLoading();
          toast.error(<Toast type="fail" content="Network error fetching account data" />);
        });
      return publicKey;
    } catch (err: any) {
      console.log('Ledger ERROR:', err);
    }
    return null;
  };

  const importAccountFromLedger = () => {
    const accountName = `k:${ledgerPublicKey}`;
    try {
      const pactCode = `(coin.details "${accountName}")`;
      showLoading();
      fetchLocal(pactCode, selectedNetwork.url, selectedNetwork.networkId, 0)
        .then((response) => {
          console.log('🚀 !!! ~ response:', response);
          hideLoading();
          getLocalPassword(
            (accountPassword) => {
              const isWalletEmpty = isEmpty(find(wallets, (e) => Number(e.chainId) === 0 && e.account === accountName));
              if (isWalletEmpty) {
                const wallet = {
                  account: encryptKey(accountName, accountPassword),
                  publicKey: encryptKey(ledgerPublicKey, accountPassword),
                  secretKey: '',
                  chainId: '0',
                  connectedSites: [],
                  type: 'LEDGER',
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
                  chainId: 0,
                  account: accountName,
                  publicKey: ledgerPublicKey,
                  secretKey: '',
                  type: AccountType.LEDGER,
                  connectedSites: [],
                };
                const newWallets = [...wallets, newStateWallet];
                setWallets(newWallets);
                setLocalSelectedWallet(wallet);
                setCurrentWallet(newStateWallet);
                toast.success(<Toast type="success" content="Import account successfully." />);
                history.push('/');
                setActiveTab(ACTIVE_TAB.HOME);
              } else {
                toast.error(<Toast type="fail" content="The account you are trying to import is a duplicate." />);
              }
            },
            () => {},
          );
        })
        .catch(() => {
          hideLoading();
          toast.error(<Toast type="fail" content="Network error." />);
        });
    } catch (e) {
      toast.error(<Toast type="fail" content="Invalid data" />);
    }
  };

  const goBack = () => {
    history.push('/');
  };
  return (
    <PageWrapper>
      <NavigationHeader title="Import From Ledger" onBack={goBack} />
      <DivFlex>
        <SecondaryLabel>Plug your Ledger directly into your computer, then unlock it and open the Kadena app.</SecondaryLabel>
      </DivFlex>
      <DivFlex>
        <Button size="full" label="Continue" variant="disabled" onClick={getLedgerAccount} />
      </DivFlex>
      <DivFlex flexDirection="column">
        <SecondaryLabel>PUBLIC KEY</SecondaryLabel>
        <SecondaryLabel>{ledgerPublicKey}</SecondaryLabel>
      </DivFlex>
      <DivFlex flexDirection="column">
        <SecondaryLabel>ACCOUNT</SecondaryLabel>
        <SecondaryLabel>{`k:${ledgerPublicKey}`}</SecondaryLabel>
      </DivFlex>
      <DivFlex flexDirection="column">
        <SecondaryLabel color="red">{error}</SecondaryLabel>
      </DivFlex>
      {ledgerPublicKey && (
        <DivFlex>
          <Button size="full" label="Confirm import" variant="primary" onClick={importAccountFromLedger} />
        </DivFlex>
      )}
    </PageWrapper>
  );
};
export default ImportLedger;
