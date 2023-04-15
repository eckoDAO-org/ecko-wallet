import { get } from 'lodash';
import {
  RawNetwork,
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
import { RawWallet, setCurrentWallet, setWallets } from 'src/stores/wallet';
import { convertContacts, convertNetworks, convertRecent, revertNetworks } from '.';
import { getKeyPairsFromSeedPhrase } from './chainweb';
import { decryptKey, encryptKey } from './security';

type RawWalletsMap = {
  [key: string]: RawWallet[]
};

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

export type GetMultipleLocalWalletsCallback = (wallets: RawWalletsMap) => any;
export const getMultipleLocalWallets = (networks: string[], callback: GetMultipleLocalWalletsCallback) => {
  const keys = networks.map((network) => `${network}.wallets`);
  (window as any)?.chrome?.storage?.local?.get(keys, callback);
};

export const initLocalWallet = (seedPhrase: string, passwordHash: string) => {
  const keyPairs = getKeyPairsFromSeedPhrase(seedPhrase, 0);
  const { publicKey, secretKey } = keyPairs;
  const accountName = `k:${publicKey}`;
  const wallet = {
    account: encryptKey(accountName, passwordHash),
    publicKey: encryptKey(publicKey, passwordHash),
    secretKey: encryptKey(secretKey, passwordHash),
    chainId: '0',
    connectedSites: [],
  };
  setLocalWallets('mainnet01', [wallet]);
  setLocalWallets('testnet04', [wallet]);
  setLocalSelectedWallet(wallet);
  const seedPhraseHash = encryptKey(seedPhrase, passwordHash);
  setLocalSeedPhrase(seedPhraseHash);
};

const setMultipleObjects = (partialState: object) => (
  window.chrome.storage.local.set(partialState)
);

const getMultipleObjects = (keyorKeys: string|string[]) => (
  window.chrome.storage.local.get(keyorKeys)
);

export const updateLocalWallets = (
  newPasswordHash: string,
  oldPasswordHash: string,
  successCallback?: () => any,
  failCallback?: (error: Error) => any,
) => {
  const runUpdate = (networks: RawNetwork[]) => {
    // Step 1: retrieve and update wallets grouped by network
    const step1 = () => {
      retrieveAndUpdateNetworkedWallets(networks, newPasswordHash, oldPasswordHash, step2);
    };

    // Step 2: retrieve and update selected wallet
    const step2 = (updatedNetworkedWallets: RawWalletsMap) => {
      retrieveAndUpdateSelectedWallet(newPasswordHash, oldPasswordHash, (updatedSelectedWallet) => {
        step3(updatedNetworkedWallets, updatedSelectedWallet);
      });
    };

    // Step 3: retrieve and update seed phrase
    const step3 = (updatedNetworkedWallets: RawWalletsMap, updatedSelectedWallet?: RawWallet) => {
      // If selected wallet isn't retrieved, use mainnet wallet
      if (!updatedSelectedWallet) {
        updatedSelectedWallet = updatedNetworkedWallets.mainnet01?.[0];
      }

      // If mainnet wallet isn't found, use the first wallet found
      if (!updatedSelectedWallet) {
        updatedSelectedWallet = Object.values(updateNetworkedWallets).find((wallets) => wallets[0]);
      }

      // This should never happend
      if (updatedSelectedWallet === undefined) {
        throw new Error("No wallets found");
      }

      retrieveAndUpdateSeedPhrase(newPasswordHash, oldPasswordHash, (updatedSeedPhrase) => {
        const newState = {
          ...updatedNetworkedWallets,
          selectedWallet: updatedSelectedWallet,
          seedPhrase: updatedSeedPhrase,
        };

        setMultipleObjects(newState);
        setLocalPassword(newPasswordHash);
        successCallback?.();
      });
    };

    step1();
  };

  try {
    getLocalNetworks(runUpdate, () => {
      console.warn("failed to retrieve networks - using default");
      runUpdate(defaultNetworks);
    });
  } catch (error: any) {
    failCallback?.(error.message);
  }
};

// Retrieve and update all wallets grouped by network id
const retrieveAndUpdateNetworkedWallets = (
  networks: RawNetwork[],
  newPasswordHash: string,
  oldPasswordHash: string,
  callback: (wallets: RawWalletsMap) => any,
) => {
  const networkNames = Object.keys(networks).map((key) => networks[key].networkId);
  getMultipleLocalWallets(networkNames, (wallets) => {
    const updatedNetworkedWallets = updateNetworkedWallets(wallets, newPasswordHash, oldPasswordHash);
    callback(updatedNetworkedWallets);
  });
};

const retrieveAndUpdateSelectedWallet = (
  newPasswordHash: string,
  oldPasswordHash: string,
  callback: (wallet?: RawWallet) => any,
) => {
  getLocalSelectedWallet((selectedWallet) => {
    const updatedSelectedWallet = updateWallet(selectedWallet, newPasswordHash, oldPasswordHash);
    callback(updatedSelectedWallet);
  }, () => {
    console.warn("Failed to retrieve selected wallet");
    callback(undefined);
  });
};

const retrieveAndUpdateSeedPhrase = (
  newPasswordHash: string,
  oldPasswordHash: string,
  callback: (seedPhrase: string) => any,
) => {
  getLocalSeedPhrase((seedPhrase: string) => {
    const updatedSeedPhrase = updateSeedPhrase(seedPhrase, newPasswordHash, oldPasswordHash);
    callback(updatedSeedPhrase);
  }, () => {
    // TODO: handle errors
    console.error("Failed to retrieve seed phrase");
    throw new Error("Cannot update seed phrase");
  });
};

const updateNetworkedWallets = (
  oldNetworkedWallets: RawWalletsMap,
  passwordHash: string,
  oldPasswordHash: string,
) => {
  const newNetworkedWallets: RawWalletsMap = {};
  Object.keys(oldNetworkedWallets).forEach((key) => {
    const oldWallets = oldNetworkedWallets[key];
    const newWallets: RawWallet[] = [];

    oldWallets.forEach((wallet) => {
      newWallets.push(updateWallet(wallet, passwordHash, oldPasswordHash));
    });

    newNetworkedWallets[key] = newWallets;
  });

  return newNetworkedWallets;
};

const updateWallet = (wallet: RawWallet, newPasswordHash: string, oldPasswordHash: string) => {
  const decryptedWallet = decryptWallet(wallet, oldPasswordHash);
  const reencryptedWallet = encryptWallet(decryptedWallet, newPasswordHash);
  const redecryptedWallet = decryptWallet(reencryptedWallet, newPasswordHash);

  if (JSON.stringify(decryptedWallet) !== JSON.stringify(redecryptedWallet)) {
    throw new Error("New wallet doesn't match old wallet");
  }

  return reencryptedWallet;
};

const updateSeedPhrase = (seedPhrase: string, newPasswordHash: string, oldPasswordHash: string) => {
  const decryptedSeedPhrase = decryptKey(seedPhrase, oldPasswordHash);
  const reencryptedSeedPhrase = encryptKey(decryptedSeedPhrase, newPasswordHash);
  const redecryptedSeedPhrase = decryptKey(reencryptedSeedPhrase, newPasswordHash);

  if (JSON.stringify(decryptedSeedPhrase) !== JSON.stringify(redecryptedSeedPhrase)) {
    throw new Error("New seed phrase doesn't match old seed phrase");
  }

  return reencryptedSeedPhrase;
};

// For existing wallets
const encryptWallet = (wallet: RawWallet, passwordHash: string): RawWallet => ({
  ...wallet,
  account: encryptKey(wallet.account, passwordHash),
  publicKey: encryptKey(wallet.publicKey, passwordHash),
  secretKey: encryptKey(wallet.secretKey, passwordHash),
});

const decryptWallet = (wallet: RawWallet, passwordHash: string): RawWallet => ({
    ...wallet,
    account: decryptKey(wallet.account, passwordHash),
    publicKey: decryptKey(wallet.publicKey, passwordHash),
    secretKey: decryptKey(wallet.secretKey, passwordHash),
});

export const setTOTPSharedKey = (sharedKey: string, passwordHash: string) => {
  const encryptedSharedKey = encryptKey(sharedKey, passwordHash);
  return setMultipleObjects({
    totpSharedKey: encryptedSharedKey,
  });
};

export const hasTOTPSharedKey = () => (
  getMultipleObjects(['totpSharedKey']).then(
    ({ totpSharedKey }) => !!totpSharedKey,
  )
);

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
