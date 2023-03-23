import { get } from 'lodash';
import {
  defaultNetworks,
  hideFetching,
  setContacts,
  setExtensionPassword,
  setIsHaveSeedPhrase,
  setNetworks,
  setRecent,
  setSelectedNetwork,
  showFetching,
} from 'src/stores/extensions';
import { setCurrentWallet, setWallets } from 'src/stores/wallet';
import { convertContacts, convertNetworks, convertRecent, revertNetworks } from '.';
import { getKeyPairsFromSeedPhrase } from './chainweb';
import { decryptKey, encryptKey } from './security';

export const STORAGE_PASSWORD_KEY = 'accountPassword';

export const getLocalStorageData = (key, successCallback, failCallback?) => {
  (window as any)?.chrome?.storage?.local?.get(key, (result) => {
    if (result) {
      successCallback(result[key] || null);
    } else {
      failCallback ? failCallback() : null;
    }
  });
};

export const setLocalStorageData = (key, data) => {
  const obj = {};
  obj[key] = data;
  (window as any).chrome.storage.local.set(obj);
};

// Wallets
export const setLocalWallets = (network, wallets) => {
  const key = `${network}.wallets`;
  const obj = {};
  obj[key] = wallets;
  (window as any).chrome.storage.local.set(obj);
};

export const getLocalWallets = (network, successCallback, failCallback) => {
  const key = `${network}.wallets`;
  (window as any)?.chrome?.storage?.local?.get(`${key}`, (result) => {
    if (result && result[key] && result[key].length) {
      successCallback(result[key]);
    } else {
      failCallback();
    }
  });
};

export const initLocalWallet = (seedPhrase: string, passwordHash: string) => {
  const keyPairs = getKeyPairsFromSeedPhrase(seedPhrase, 0);
  console.log(`🚀 ~ keyPairs:`, keyPairs);
  const { publicKey, secretKey } = keyPairs;
  const accountName = `k:${publicKey}`;
  const wallet = {
    account: encryptKey(accountName, passwordHash),
    publicKey: encryptKey(publicKey, passwordHash),
    secretKey: encryptKey(secretKey, passwordHash),
    chainId: '0',
    connectedSites: [],
  };
  getLocalWallets(
    'mainnet01',
    (item) => {
      const newData = [...item, wallet];
      setLocalWallets('mainnet01', newData);
    },
    () => {
      setLocalWallets('mainnet01', [wallet]);
    },
  );
  getLocalWallets(
    'testnet04',
    (item) => {
      const newData = [...item, wallet];
      setLocalWallets('testnet04', newData);
    },
    () => {
      setLocalWallets('testnet04', [wallet]);
    },
  );
  const newStateWallet = {
    chainId: '0',
    account: accountName,
    publicKey,
    secretKey,
    connectedSites: [],
  };
  const newWallets = [newStateWallet];
  setWallets(newWallets);
  setLocalSelectedWallet(wallet);
  setCurrentWallet(newStateWallet);
  setIsHaveSeedPhrase(true);
  const seedPhraseHash = encryptKey(seedPhrase, passwordHash);
  setLocalSeedPhrase(seedPhraseHash);
  return newStateWallet;
};

export const setLocalSelectedWallet = (selectedWallet: {
  account: string;
  connectedSites?: string[];
  publicKey: string;
  secretKey: string;
  alias?: string;
  chainId?: string | number;
}) => {
  (window as any)?.chrome?.storage?.local?.set({ selectedWallet });
};

export const getLocalSelectedWallet = (successCallback, failCallback) => {
  (window as any)?.chrome?.storage?.local?.get('selectedWallet', (result) => {
    if (result && result?.selectedWallet && result?.selectedWallet?.account) {
      successCallback(result.selectedWallet);
    } else {
      failCallback();
    }
  });
};

// Activities
export const setLocalActivities = (network, account, activities) => {
  const key = `${network}.activities.${account}`;
  const obj = {};
  obj[key] = activities;
  (window as any)?.chrome?.storage?.local?.set(obj);
};

export const getLocalActivities = (network, account, successCallback, failCallback) => {
  const key = `${network}.activities.${account}`;
  (window as any)?.chrome?.storage?.local?.get(`${key}`, (result) => {
    if (result && result[key] && result[key].length) {
      successCallback(result[key]);
    } else {
      failCallback();
    }
  });
};

// Password
export const setLocalPassword = (passwordHash) => {
  (window as any)?.chrome?.storage?.session?.set({ accountPassword: passwordHash });
};

export const getLocalPassword = (successCallback, failCallback) => {
  (window as any)?.chrome?.storage?.session?.get(STORAGE_PASSWORD_KEY, (result) => {
    if (result && result.accountPassword) {
      successCallback(result.accountPassword);
    } else {
      failCallback();
    }
  });
};

export const getOldLocalPassword = (successCallback, failCallback) => {
  (window as any)?.chrome?.storage?.local?.get(STORAGE_PASSWORD_KEY, (result) => {
    if (result && result.accountPassword) {
      successCallback(result.accountPassword);
    } else {
      failCallback();
    }
  });
};
export const removeOldLocalPassword = () => {
  (window as any)?.chrome?.storage?.local?.remove(STORAGE_PASSWORD_KEY);
};

// Networks
export const setLocalSelectedNetwork = (selectedNetwork) => {
  (window as any)?.chrome?.storage?.local?.set({ selectedNetwork });
};

export const getLocalSelectedNetwork = (successCallback, failCallback) => {
  (window as any)?.chrome?.storage?.local?.get('selectedNetwork', (result) => {
    if (result && result.selectedNetwork) {
      successCallback(result.selectedNetwork);
    } else {
      failCallback();
    }
  });
};
export const setLocalNetworks = (networks) => {
  (window as any)?.chrome?.storage?.local?.set({ networks });
};

export const getLocalNetworks = (successCallback, failCallback) => {
  (window as any)?.chrome?.storage?.local?.get('networks', (result) => {
    if (result && result.networks) {
      successCallback(result.networks);
    } else {
      failCallback();
    }
  });
};

// Contact
export const setLocalContacts = (network, contacts) => {
  const key = `${network}.contacts`;
  const obj = {};
  obj[key] = contacts;
  (window as any)?.chrome?.storage?.local?.set(obj);
};

export const getLocalContacts = (network, successCallback, failCallback) => {
  const key = `${network}.contacts`;
  (window as any)?.chrome?.storage?.local?.get(`${key}`, (result) => {
    if (result && result[key]) {
      successCallback(result[key]);
    } else {
      failCallback();
    }
  });
};

export const getExistContacts = (accountName, contacts) => {
  const findName = get(contacts, `0.${accountName}`, {});
  return get(findName, 'aliasName', '');
};

// Recent
export const setLocalRecent = (network, requests) => {
  const key = `${network}.recent`;
  const obj = {};
  obj[key] = requests;
  (window as any)?.chrome?.storage?.local?.set(obj);
};

export const getLocalRecent = (network, successCallback, failCallback) => {
  const key = `${network}.recent`;
  (window as any)?.chrome?.storage?.local?.get(`${key}`, (result) => {
    if (result && result[key]) {
      successCallback(result[key]);
    } else {
      failCallback();
    }
  });
};

// Seed phrase
export const getLocalSeedPhrase = (successCallback, failCallback) => {
  (window as any)?.chrome?.storage?.local?.get('seedPhrase', (result) => {
    if (result && result.seedPhrase) {
      successCallback(result.seedPhrase);
    } else {
      failCallback();
    }
  });
};

export const setLocalSeedPhrase = (seedPhrase) => {
  (window as any)?.chrome?.storage?.local?.set({ seedPhrase });
};

// Dapps
export const getLocalDapps = (successCallback, failCallback) => {
  (window as any)?.chrome?.storage?.local?.get('dapps', (result) => {
    if (result && result.dapps) {
      successCallback(result.dapps);
    } else {
      failCallback();
    }
  });
};

export const setLocalActiveDapps = (activeDapps, callback) => {
  (window as any)?.chrome?.storage?.local?.set({ activeDapps }, callback);
};

export const getLocalActiveDapps = (successCallback, failCallback) => {
  (window as any)?.chrome?.storage?.local?.get('activeDapps', (result) => {
    if (result && result.activeDapps && result.activeDapps.length > 0) {
      successCallback(result.activeDapps);
    } else {
      failCallback();
    }
  });
};

export const getLocalSigningCmd = (successCallback, failCallback) => {
  (window as any)?.chrome?.storage?.local?.get('signingCmd', (result) => {
    if (result && result.signingCmd) {
      successCallback(result.signingCmd);
    } else {
      failCallback();
    }
  });
};

export const getLocalQuickSignedCmd = (successCallback, failCallback) => {
  (window as any)?.chrome?.storage?.local?.get('quickSignedCmd', (result) => {
    if (result && result.quickSignedCmd) {
      successCallback(result.quickSignedCmd);
    } else {
      failCallback();
    }
  });
};

export const initDataFromLocal = (selectedNetwork, networks) => {
  showFetching();
  getLocalSeedPhrase(
    () => {
      setIsHaveSeedPhrase(true);
    },
    () => {
      setIsHaveSeedPhrase(false);
    },
  );
  getLocalPassword(
    (accountPassword) => {
      setExtensionPassword(accountPassword);
    },
    () => {},
  );
  getLocalSelectedNetwork(
    (network) => {
      const defaultFounded = defaultNetworks.find((dfNet) => dfNet.id && dfNet.id === network?.id);
      if (defaultFounded) {
        network = defaultFounded;
      }
      setSelectedNetwork({
        name: network.name,
        url: network.url,
        explorer: network.explorer,
        networkId: network.networkId,
        id: network.id,
        isDefault: network.isDefault,
      });
      updateContacts(network.networkId);
      updateRecent(network.networkId);
      updateWallets(network.networkId);
    },
    () => {
      setLocalSelectedNetwork(selectedNetwork);
      updateRecent(selectedNetwork.networkId);
      updateContacts(selectedNetwork.networkId);
      updateWallets(selectedNetwork.networkId);
    },
  );
  getLocalNetworks(
    (localNetworks) => {
      const saveNetworks = [...convertNetworks(localNetworks ?? [])?.filter((n) => !n.isDefault), ...defaultNetworks];
      setNetworks(convertNetworks(saveNetworks));
    },
    () => {
      const newNetworks = revertNetworks([...networks, ...defaultNetworks]);
      setLocalNetworks(newNetworks);
    },
  );
};

export const updateContacts = (networkId) => {
  getLocalContacts(
    networkId,
    (data) => {
      const contacts = convertContacts(data);
      setContacts(contacts);
    },
    () => {},
  );
};

export const updateWallets = (networkId) => {
  getLocalPassword(
    (accountPassword) => {
      getLocalWallets(
        networkId,
        (data) => {
          const newWallets = data.map((item) => ({
            chainId: item.chainId,
            alias: item.alias,
            account: decryptKey(item.account, accountPassword),
            publicKey: decryptKey(item.publicKey, accountPassword),
            secretKey: decryptKey(item.secretKey, accountPassword),
            connectedSites: item.connectedSites,
          }));
          setWallets(newWallets);
          getLocalSelectedWallet(
            (selectedWallet) => {
              setCurrentWallet({
                chainId: selectedWallet.chainId,
                alias: selectedWallet.alias,
                account: decryptKey(selectedWallet.account, accountPassword),
                publicKey: decryptKey(selectedWallet.publicKey, accountPassword),
                secretKey: decryptKey(selectedWallet.secretKey, accountPassword),
                connectedSites: selectedWallet.connectedSites,
              });
            },
            () => {
              const newWallet = newWallets[0];
              setCurrentWallet(newWallet);
              setLocalSelectedWallet(data[0]);
            },
          );
          hideFetching();
        },
        () => {
          setWallets([]);
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
          // if (!isDappUrl) {
          //   history.push('/init');
          // }
          hideFetching();
        },
      );
    },
    () => {
      hideFetching();
    },
  );
};

export const updateRecent = (networkId) => {
  getLocalRecent(
    networkId,
    (data) => {
      const recent = convertRecent(data);
      setRecent(recent);
    },
    () => {},
  );
};
