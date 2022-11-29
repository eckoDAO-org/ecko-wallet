/* eslint no-use-before-define: 0 */
import Pact from 'pact-lang-api';
import 'regenerator-runtime/runtime';
import { get } from 'lodash';
import { decryptKey } from '../../src/utils/security';
import { fetchLocal, getSignatureFromHash } from '../../src/utils/chainweb';
import { getTimestamp } from '../../src/utils';
import { XWALLET_DAPP_SIGN_NONCE } from '../../src/utils/config';

let contentPort = null;
const portMap = new Map();

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.tabs.create({ url: '/index.html#/home-page' });
  }
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.local.set({ expiredTime: null });
  chrome.storage.local.set({ activeDapps: [] });
  chrome.storage.local.set({ dapps: null });
  chrome.storage.local.set({ signedCmd: null });
});

/**
 * One-time connection
 */
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const tabIdResponse = request?.tabId || sender?.tab?.id;
  if (request.target === 'kda.background') {
    let senderPort = null;
    for (const [tabId, port] of portMap.entries()) {
      if (tabId === tabIdResponse) {
        senderPort = portMap.get(tabId);
      }
    }
    if (senderPort) {
      try {
        if (request.tabId) {
          delete request.tabId;
        }
        senderPort.postMessage({
          ...request,
          target: 'kda.content',
        });
        sendResponse({
          status: 'ok',
        });
        return true;
      } catch (error) {
        return true;
      }
    }
    return true;
  }
});

function sendToConnectedPorts(msg) {
  if (msg.tabId) {
    const port = portMap.get(msg.tabId);
    if (port) {
      port.postMessage(msg);
    }
  } else {
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      for (const [tabId, port] of portMap.entries()) {
        if (tabs.find((tab) => tab.id === tabId)) {
          try {
            port.postMessage(msg);
            return true;
          } catch (err) {
            return true;
          }
        }
      }
    });
  }
}

/**
 * Long-time connection
 */
chrome.runtime.onConnect.addListener(async (port) => {
  if (port.name !== 'kda.extension') {
    return;
  }
  portMap.set(port.sender.tab.id, port);
  contentPort = port;

  contentPort.onMessage.addListener(async (payload, sender) => {
    const action = payload.action || '';
    const originTabId = sender?.sender?.tab?.id;

    switch (action) {
      case 'kda_connect':
        checkConnect(payload.data, originTabId);
        break;
      case 'kda_disconnect':
        disconnect(payload.data, originTabId);
        break;
      case 'kda_requestAccount':
        getAccountSelected(payload.data, originTabId);
        break;
      case 'kda_getNetwork':
        getNetwork(originTabId);
        break;
      case 'kda_getChain':
        getSelectedChain(originTabId);
        break;
      case 'kda_getSelectedAccount':
        getSelectedAccount(originTabId);
        break;
      case 'kda_sendKadena':
        sendKadena(payload.data, originTabId);
        break;
      case 'kda_requestSign':
        kdaRequestSign(payload.data, originTabId);
        break;
      case 'kda_checkStatus':
        checkStatus(payload.data, originTabId);
        break;
      default:
        break;
    }
    return true;
  });
  contentPort.onDisconnect.addListener(() => {
    contentPort = null;
  });
});

const checkConnect = async (data, tabId) => {
  const isValidNetwork = await verifyNetwork(data.networkId);
  if (isValidNetwork) {
    const account = await getSelectedWallet();
    const connectedSites = account.connectedSites || [];
    const activeDomains = await getActiveDomains();
    if (connectedSites.includes(data.domain)) {
      if (activeDomains.includes(data.domain)) {
        const msg = {
          result: {
            status: 'success',
            message: 'Connected successfully',
            account,
          },
          target: 'kda.content',
          action: 'res_checkStatus',
          tabId,
        };
        sendToConnectedPorts(msg);
      } else {
        showPopup({ ...data, tabId }, 'sign-dapps');
      }
    } else {
      showPopup({ ...data, tabId }, 'connected-dapps');
    }
  } else {
    const msg = {
      result: {
        status: 'fail',
        message: 'Network invalid',
      },
      target: 'kda.content',
      action: 'res_checkStatus',
      tabId,
    };
    sendToConnectedPorts(msg);
  }
};

const disconnect = async (data, tabId) => {
  const activeDomains = await getActiveDomains();
  const activeDapps = activeDomains.filter((a) => a !== data.domain);
  chrome.storage.local.set({ activeDapps });
  const msg = {
    result: {
      status: 'success',
      message: 'Disconnected',
    },
    target: 'kda.content',
    action: 'res_disconnect',
    tabId,
  };
  sendToConnectedPorts(msg);
};

const kdaRequestSign = async (data, tabId) => {
  const isValidNetwork = await verifyNetwork(data.networkId);
  if (isValidNetwork) {
    const isValid = await checkValid(data);
    if (isValid) {
      try {
        const account = await getSelectedWallet(true);
        const { signingCmd } = data;
        const meta = Pact.lang.mkMeta(
          signingCmd.sender,
          signingCmd.chainId.toString(),
          signingCmd.gasPrice,
          signingCmd.gasLimit,
          getTimestamp(),
          signingCmd.ttl,
        );
        const clist = signingCmd.caps ? signingCmd.caps.map((c) => c.cap) : [];
        const keyPairs = {
          publicKey: account.publicKey,
        };
        if (account.secretKey.length === 64) {
          keyPairs.secretKey = account.secretKey;
        }
        if (clist.length > 0) {
          keyPairs.clist = clist;
        }
        const signedCmd = Pact.api.prepareExecCmd(
          keyPairs,
          `${XWALLET_DAPP_SIGN_NONCE}-"${new Date().toISOString()}"`,
          signingCmd.pactCode,
          signingCmd.envData,
          meta,
          signingCmd.networkId,
        );

        if (account.secretKey.length > 64) {
          const signature = getSignatureFromHash(signedCmd.hash, account.secretKey);
          const sigs = [{ sig: signature }];
          signedCmd.sigs = sigs;
        }

        data.signedCmd = signedCmd;
        data.tabId = tabId;
        showSignPopup(data);
      } catch {
        sendToConnectedPorts({
          result: {
            status: 'fail',
            message: 'Fail to get signedCmd',
          },
          target: 'kda.content',
          action: 'res_requestSign',
        });
      }
    } else {
      checkStatus(data, tabId);
    }
  } else {
    checkStatus(data, tabId);
  }
};

const sendKadena = async (data, tabId) => {
  const isValidNetwork = await verifyNetwork(data.networkId);
  if (isValidNetwork) {
    const isValid = await checkValid(data);
    if (isValid) {
      showTransactionPopup(data, tabId);
    } else {
      checkStatus(data, tabId);
    }
  } else {
    checkStatus(data, tabId);
  }
};

const checkStatus = async (data, tabId) => {
  const isValidNetwork = await verifyNetwork(data.networkId);
  if (isValidNetwork) {
    const isValid = await checkValid(data);
    if (isValid) {
      const account = await getSelectedWallet();
      const msg = {
        result: {
          status: 'success',
          message: 'Connected successfully',
          account,
        },
        target: 'kda.content',
        action: 'res_checkStatus',
        tabId,
      };
      sendToConnectedPorts(msg);
    } else {
      const msg = {
        result: {
          status: 'fail',
          message: 'Not connected',
        },
        target: 'kda.content',
        action: 'res_checkStatus',
        tabId,
      };
      sendToConnectedPorts(msg);
    }
  } else {
    const msg = {
      result: {
        status: 'fail',
        message: 'Invalid network',
      },
      target: 'kda.content',
      action: 'res_checkStatus',
      tabId,
    };
    sendToConnectedPorts(msg);
  }
};

const verifyNetwork = async (networkId) => {
  const isValid = await new Promise((resolve) => {
    chrome.storage.local.get('selectedNetwork', (result) => {
      if (result && result.selectedNetwork && result.selectedNetwork.networkId) {
        resolve(result.selectedNetwork.networkId === networkId);
      } else {
        resolve(false);
      }
    });
  });
  return isValid;
};

const getActiveDomains = async () => {
  const domains = await new Promise((resolve) => {
    chrome.storage.local.get('activeDapps', (result) => {
      if (result && result.activeDapps && result.activeDapps.length > 0) {
        resolve(result.activeDapps);
      } else {
        resolve([]);
      }
    });
  });
  return domains;
};

const getSelectedWallet = async (isHaveSecret = false) => {
  const newSelectedWallet = await new Promise((resolve) => {
    chrome.storage.local.get('selectedWallet', (wallet) => {
      if (wallet && wallet.selectedWallet && wallet.selectedWallet.account) {
        const { selectedWallet } = wallet;
        chrome.storage.local.get('accountPassword', (password) => {
          const { accountPassword } = password;
          const newWallet = {
            account: decryptKey(selectedWallet.account, accountPassword),
            publicKey: decryptKey(selectedWallet.publicKey, accountPassword),
            connectedSites: selectedWallet.connectedSites,
          };
          if (isHaveSecret) {
            newWallet.secretKey = decryptKey(selectedWallet.secretKey, accountPassword);
          }
          resolve(newWallet);
        });
      } else {
        resolve({
          account: '',
          publicKey: '',
          connectedSites: [],
        });
      }
    });
  });
  return newSelectedWallet;
};

const checkValid = async (data) => {
  const account = await getSelectedWallet();
  const activeDomains = await getActiveDomains();
  const connectedSites = account.connectedSites || [];
  if (connectedSites.includes(data.domain)) {
    if (activeDomains.includes(data.domain)) {
      return true;
    }
  }
  return false;
};

/**
 * Show extension notify popup
 *
 * @param {Object} payload
 */
const showTransactionPopup = async (data, tabId) => {
  if (typeof data?.sourceChainId === 'undefined') {
    const msg = {
      result: {
        status: 'fail',
        message: 'Please set sourceChainId param',
      },
      target: 'kda.content',
      action: 'res_sendKadena',
      tabId,
    };
    sendToConnectedPorts(msg);
    return;
  }
  const lastFocused = await getLastFocusedWindow();

  const options = {
    url: 'index.html#/dapps-transfer',
    type: 'popup',
    top: lastFocused.top,
    left: lastFocused.left + (lastFocused.width - 360),
    width: 368,
    height: 610,
  };

  const dapps = {
    networkId: data.networkId,
    domain: data.domain,
    sourceChainId: data.sourceChainId,
    chainId: data.chainId,
    account: data.account,
    amount: data.amount,
  };

  chrome.storage.local.set({ dapps });

  chrome.windows.create(options);
};

/**
 * Get last window focus info
 *
 * @return {Object}
 */
const getLastFocusedWindow = async () =>
  new Promise((resolve, reject) => {
    chrome.windows.getLastFocused((windowObject) => resolve(windowObject));
  });

/**
 * Show extension notify popup
 *
 * @param {Object} data
 */
const showPopup = async (data = {}, popupUrl) => {
  const lastFocused = await getLastFocusedWindow();

  const options = {
    url: `index.html#/${popupUrl}`,
    type: 'popup',
    top: lastFocused.top,
    left: lastFocused.left + (lastFocused.width - 360),
    width: 368,
    height: 610,
  };

  const dapps = {
    networkId: data.networkId,
    domain: data.domain,
    icon: data.icon,
    tabId: data.tabId,
  };

  chrome.storage.local.set({ dapps });

  chrome.windows.create(options);
};

const showSignPopup = async (data = {}) => {
  const lastFocused = await getLastFocusedWindow();

  const options = {
    url: 'index.html#/signed-cmd',
    type: 'popup',
    top: lastFocused.top,
    left: lastFocused.left + (lastFocused.width - 360),
    width: 368,
    height: 610,
  };

  const signedCmd = {
    networkId: data.networkId,
    domain: data.domain,
    icon: data.icon,
    cmd: data.signedCmd,
    tabId: data.tabId,
  };

  chrome.storage.local.set({ signedCmd });

  chrome.windows.create(options);
};

const getNetwork = async (tabId) => {
  chrome.storage.local.get('selectedNetwork', (result) => {
    if (result && result.selectedNetwork) {
      sendToConnectedPorts({
        network: result.selectedNetwork,
        target: 'kda.content',
        action: 'res_getNetwork',
        tabId,
      });
    }
  });
};

const getSelectedChain = async (tabId) => {
  chrome.storage.local.get('selectedWallet', (result) => {
    sendToConnectedPorts({
      chainId: result?.selectedWallet?.chainId,
      target: 'kda.content',
      action: 'res_getChain',
      tabId,
    });
  });
};

const getSelectedAccount = async (tabId) => {
  chrome.storage.local.get('selectedWallet', (result) => {
    chrome.storage.local.get('accountPassword', (password) => {
      const { accountPassword } = password;
      sendToConnectedPorts({
        target: 'kda.content',
        action: 'res_getSelectedAccount',
        selectedAccount: {
          account: decryptKey(result?.selectedWallet?.account, accountPassword),
          publicKey: decryptKey(result?.selectedWallet.publicKey, accountPassword),
        },
        tabId,
      });
    });
  });
};

/**
 * Get current account selected
 *
 * @param {Object} port
 */
const getAccountSelected = async (data, tabId) => {
  const isValidNetwork = await verifyNetwork(data.networkId);
  if (isValidNetwork) {
    const isValid = await checkValid(data);
    if (isValid) {
      const account = await getSelectedWallet();
      sendToConnectedPorts({
        result: {
          status: 'success',
          message: 'Get account information successfully',
          wallet: account,
        },
        target: 'kda.content',
        action: 'res_requestAccount',
        tabId,
      });
    } else {
      sendToConnectedPorts({
        result: {
          status: 'fail',
          message: 'Please connect with a wallet',
        },
        target: 'kda.content',
        action: 'res_requestAccount',
        tabId,
      });
    }
  } else {
    sendToConnectedPorts({
      result: {
        status: 'fail',
        message: 'Please connect with a wallet',
      },
      target: 'kda.content',
      action: 'res_requestAccount',
      tabId,
    });
  }
};

chrome.storage.onChanged.addListener((changes, namespace) => {
  for (const [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === 'selectedWallet') {
      if (!newValue || (newValue && oldValue && newValue.account !== oldValue.account)) {
        chrome.storage.local.set({ activeDapps: [] });
      }
      const successMsg = {
        result: {
          status: 'success',
          message: 'Account changed',
        },
        target: 'kda.content',
        action: 'res_accountChange',
      };
      setTimeout(() => {
        sendToConnectedPorts(successMsg);
      }, 500);
      chrome.runtime.sendMessage({
        target: 'kda.extension',
        action: 'sync_data',
      });
    }
  }
});
