import { get } from 'lodash';

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

export const setLocalSelectedWallet = (selectedWallet) => {
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
  (window as any)?.chrome?.storage?.local?.set({ accountPassword: passwordHash });
};

export const getLocalPassword = (successCallback, failCallback) => {
  (window as any)?.chrome?.storage?.local?.get('accountPassword', (result) => {
    if (result && result.accountPassword) {
      successCallback(result.accountPassword);
    } else {
      failCallback();
    }
  });
};

// Session
export const setLocalExpiredTime = (expiredTime) => {
  (window as any)?.chrome?.storage?.local?.set({ expiredTime });
};
export const getLocalExpiredTime = (successCallback, failCallback) => {
  (window as any)?.chrome?.storage?.local?.get('expiredTime', (result) => {
    if (result && result.expiredTime) {
      successCallback(result.expiredTime);
    } else {
      failCallback();
    }
  });
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

export const getLocalSignedCmd = (successCallback, failCallback) => {
  (window as any)?.chrome?.storage?.local?.get('signedCmd', (result) => {
    if (result && result.signedCmd) {
      successCallback(result.signedCmd);
    } else {
      failCallback();
    }
  });
};
