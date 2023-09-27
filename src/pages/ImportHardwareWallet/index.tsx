/* eslint-disable no-console */
import { useState } from 'react';
import styled from 'styled-components';
import { NavigationHeader } from 'src/components/NavigationHeader';
import Button from 'src/components/Buttons';
import { useHistory } from 'react-router-dom';
import { DivFlex, PageWrapper, SecondaryLabel, StickyFooter } from 'src/components';
import { ReactComponent as LedgerLogo } from 'src/images/ledger-logo-long.svg';
import { ReactComponent as LedgerIcon } from 'src/images/ledger-logo.svg';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Toast from 'src/components/Toast/Toast';
import { hideLoading, setActiveTab, showLoading } from 'src/stores/extensions';
import { fetchLocal } from 'src/utils/chainweb';
import { getLocalPassword, getLocalWallets, setLocalSelectedWallet, setLocalWallets } from 'src/utils/storage';
import { find, isEmpty } from 'lodash';
import { encryptKey } from 'src/utils/security';
import { AccountType, setCurrentWallet, setWallets } from 'src/stores/wallet';
import { ACTIVE_TAB } from 'src/utils/constant';
import { DEFAULT_BIP32_PATH, useLedgerContext } from 'src/contexts/LedgerContext';
import { RadioSelection } from 'src/components/RadioSelection';
import { shortenAddress } from 'src/utils';

const HardwareButton = styled.div`
  border-radius: 10px;
  height: 50px;
  width: 380px;
  text-align: center;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.button.secondary};
  background-color: ${({ isSelected, theme }) => (isSelected ? theme.button.secondary : 'none')};
  svg {
    path {
      fill: ${({ isSelected, theme }) => (isSelected ? 'white' : theme.button.secondary)};
    }
  }
`;

const ImportHardwareWallet = () => {
  const [selectedHardwareWallet, setSelectdHardwareWallet] = useState<'ledger' | 'trezor' | null>(null);
  const history = useHistory();
  const rootState = useSelector((state) => state);
  const [ledgerPublicKey, setLedgerPublicKey] = useState<string>('');
  const [selectedPublicKey, setSelectedPublicKey] = useState<string>('');
  const { wallets } = rootState?.wallet;
  const { selectedNetwork } = rootState?.extensions;
  const { getLedger, getPublicKey, error } = useLedgerContext();

  const goBack = () => {
    history.push('/');
  };

  const getLedgerAccount = async () => {
    try {
      const publicKey = await getPublicKey();
      setLedgerPublicKey(publicKey ?? '');
      const accountName = `k:${publicKey}`;
      const pactCode = `(coin.details "${accountName}")`;
      showLoading();
      fetchLocal(pactCode, selectedNetwork.url, selectedNetwork.networkId, 0)
        .then((response) => {
          console.log(`🚀 !!! ~ response:`, response);
          hideLoading();
          // if ()
        })
        .catch(() => {
          hideLoading();
          toast.error(<Toast type="fail" content="Network error fetching account data" />);
        });
      return publicKey;
    } catch (err: any) {
      console.log(`Ledger ERROR:`, err);
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
          console.log(`🚀 !!! ~ response:`, response);
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

  const renderSelectHardwareWallet = () => (
    <>
      <DivFlex justifyContent="center" padding="22px 0">
        <SecondaryLabel>Please select an hardware wallet</SecondaryLabel>
      </DivFlex>
      <DivFlex flexDirection="column" gap="16px" alignItems="center">
        <HardwareButton isSelected={selectedHardwareWallet === 'ledger'} onClick={() => setSelectdHardwareWallet('ledger')}>
          <LedgerLogo style={{ marginTop: 13 }} />
        </HardwareButton>
        {/* <HardwareButton>
          <TrezorLogo />
        </HardwareButton> */}
      </DivFlex>
      {selectedHardwareWallet === 'ledger' && (
        <>
          <DivFlex justifyContent="center" padding="22px 0">
            <SecondaryLabel>Connect your Ledger directly into your computer. Then unlock it and open the Kadena app.</SecondaryLabel>
          </DivFlex>
          <StickyFooter style={{ background: 'transparent', padding: '20px 0px' }}>
            <Button onClick={getLedgerAccount} label="Connect" size="full" style={{ width: '90%', maxWidth: 890 }} />
          </StickyFooter>
        </>
      )}
    </>
  );

  const renderSelectAccount = () => (
    <>
      <DivFlex
        justifyContent="flex-start"
        padding="24x"
        flexDirection="column"
        alignItems="flex-start"
        style={{
          margin: '0 -22px 40px -22px',
          borderTop: '1px solid #81878F',
          borderBottom: '1px solid #81878F',
          padding: 16,
          gap: 10,
        }}
      >
        <SecondaryLabel>DEVICE</SecondaryLabel>
        <DivFlex justifyContent="flex-start" padding="24x" alignItems="center" gap="10px">
          <LedgerIcon />
          <SecondaryLabel>Ledger Nano S</SecondaryLabel>
        </DivFlex>
      </DivFlex>
      <RadioSelection
        value={selectedPublicKey}
        options={[{ label: `k:${shortenAddress(ledgerPublicKey)}`, value: ledgerPublicKey }]}
        onChange={(pk) => {
          setSelectedPublicKey(pk);
        }}
      />
      {selectedPublicKey && (
        <StickyFooter style={{ background: 'transparent', padding: '20px 0px' }}>
          <Button onClick={importAccountFromLedger} label="Import" size="full" style={{ width: '90%', maxWidth: 890 }} />
        </StickyFooter>
      )}
    </>
  );

  return (
    <PageWrapper>
      <NavigationHeader title="Import Hardware Wallet" onBack={goBack} />
      {!ledgerPublicKey && renderSelectHardwareWallet()}
      {ledgerPublicKey && renderSelectAccount()}
    </PageWrapper>
  );
};
export default ImportHardwareWallet;
