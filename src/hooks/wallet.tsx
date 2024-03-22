import { useAppSelector } from 'src/stores/hooks';
import { getPasswordHash, getSelectedNetwork } from 'src/stores/slices/extensions';
import { getWallets, setCurrentWallet, setWallets } from 'src/stores/slices/wallet';
import { useCurrentWallet } from 'src/stores/slices/wallet/hooks';
import { getKeyPairsFromSeedPhrase } from 'src/utils/chainweb';
import { decryptKey, encryptKey } from 'src/utils/security';
import { getLocalSeedPhrase, getLocalWallets, setLocalSelectedWallet, setLocalWallets } from 'src/utils/storage';

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
      getLocalSeedPhrase(
        (hash) => {
          const seedPhrase = decryptKey(hash, passwordHash);

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
