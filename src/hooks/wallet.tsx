import { hash as kadenaJSHash, sign as kadenaJSSign } from '@kadena/cryptography-utils';
import { toast } from 'react-toastify';
import { DEFAULT_BIP32_PATH, bufferToHex, useLedgerContext } from 'src/contexts/LedgerContext';
import { useAppSelector } from 'src/stores/hooks';
import { RawNetwork, getNetworks, getPasswordHash, getSelectedNetwork, setSelectedNetwork } from 'src/stores/slices/extensions';
import { AccountType, getWalletInfo, getWallets, setBalance, setCurrentWallet, setWallets } from 'src/stores/slices/wallet';
import { useCurrentWallet } from 'src/stores/slices/wallet/hooks';
import { getKeyPairsFromSeedPhrase, getSignatureFromHash } from 'src/utils/chainweb';
import { decryptKey, encryptKey } from 'src/utils/security';
import { getLocalSeedPhrase, getLocalWallets, setLocalSelectedNetwork, setLocalSelectedWallet, setLocalWallets } from 'src/utils/storage';
import Toast from 'src/components/Toast/Toast';

export const useCreateAccount = () => {
  const selectedNetwork = useAppSelector(getSelectedNetwork);
  const wallets = useAppSelector(getWallets);
  const passwordHash = useAppSelector(getPasswordHash);
  const stateWallet = useCurrentWallet();

  return (seedPhrase: string, index: number) => {
    const checkWallet = (publicKey: string) => {
      let result = true;
      if (wallets && wallets.length) {
        for (let i = 0; i < wallets.length; i += 1) {
          if (wallets[i].publicKey === publicKey) {
            result = false;
          }
        }
      }
      return result;
    };

    const keyPairs = getKeyPairsFromSeedPhrase(seedPhrase, index);
    const { publicKey, secretKey } = keyPairs;

    if (!checkWallet(publicKey)) {
      return false;
    }

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

    return true;
  };
};

export const useCreateFirstAccountAvailable = () => {
  const createAccount = useCreateAccount();
  const passwordHash = useAppSelector(getPasswordHash);

  return () => (
    new Promise<void>((resolve, reject) => {
      if (!passwordHash || passwordHash === '') {
        reject();
        return;
      }

      getLocalSeedPhrase(
        (hash) => {
          const seedPhrase = decryptKey(hash, passwordHash);

          if (!seedPhrase || seedPhrase === '') {
            reject();
            return;
          }

          for (
            let index = 0, created = false;
            created === false;
            index += 1
          ) {
            created = createAccount(seedPhrase, index);
          }

          resolve();
        },
        () => {
          reject();
        },
      );
    })
  );
};

export const useSelectNetwork = () => {
  const networks = useAppSelector(getNetworks);

  return (newNetworkOrId: RawNetwork | string) => {
    const id = typeof newNetworkOrId === 'string' ? newNetworkOrId : newNetworkOrId.id;
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
};

export const useSignMessage = () => {
  const { publicKey, secretKey, type } = useAppSelector(getWalletInfo);
  const { getLedger } = useLedgerContext();

  return async (message: string) => {
    const hash = kadenaJSHash(message);

    if (type === AccountType.LEDGER) {
      toast.info(
        <Toast type="info" content="Please, enable BLIND SIGNING and follow the instruction on your ledger first" />,
      );
      const ledger = await getLedger();
      const ledgerSignature = await ledger?.signHash(DEFAULT_BIP32_PATH, hash);
      return bufferToHex(ledgerSignature?.signature);
    }

    if (secretKey.length > 64) {
      return getSignatureFromHash(hash, secretKey) as string;
    }

    return kadenaJSSign(message, { secretKey, publicKey }).sig;
  };
};
