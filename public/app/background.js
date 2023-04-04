/* eslint no-use-before-define: 0 */
import 'regenerator-runtime/runtime';
import { decryptKey } from '../../src/utils/security';
import { WalletConnectProvider } from './wallet-connect';

let contentPort = null;
const portMap = new Map();

const walletConnect = new WalletConnectProvider();

function setWalletConnectEvents(accounts) {
  walletConnect.wallet.on('session_proposal', async (proposal) => {
    console.log(`🚀 !!! ~ proposal:`, proposal);
    let accountsToShare = [];
    for (let i = 0; i < accounts.length; i += 1) {
      accountsToShare = [
        ...accountsToShare,
        `kadena:mainnet01:${accounts[i]}`,
        `kadena:mainnet01:k**${accounts[i]}`,
        `kadena:testnet04:${accounts[i]}`,
        `kadena:testnet04:k**${accounts[i]}`,
        `kadena:development:${accounts[i]}`,
        `kadena:development:k**${accounts[i]}`,
      ];
    }
    const session = await walletConnect.wallet.approveSession({
      id: proposal.id,
      namespaces: {
        kadena: {
          chains: ['kadena:mainnet01', 'kadena:testnet04', 'kadena:development'],
          accounts: accountsToShare,
          methods: [
            'kadena_getAccounts_v1',
            'kadena_sign_v1',
            'kadena_quicksign_v1',
            // old sign method for swap.ecko.finance
            'kadena_sign',
            'kadena_quicksign',
          ],
          events: ['account_changed', 'kadena_transaction_updated'],
          extension: [
            {
              accounts: accountsToShare,
              methods: ['kaddex_sign', 'kaddex_send_transaction', 'kaddex_sign_transaction'],
              events: ['account_changed'],
            },
          ],
        },
      },
    });
    console.log(`🚀 !!! ~ session`, session);
    walletConnect.wallet?.on('session_request', (event) => {
      console.log('session_request', event);
      const { topic, params, id } = event;
      const { request } = params;
      switch (request.method) {
        // old ecko swap methods
        case 'kadena_sign': {
          showSignPopup({
            signingCmd: request.params,
            networkId: request.params.networkId,
            domain: session?.peer?.metadata.url,
            icon: session?.peer?.metadata?.icons[0],
            walletConnectAction: 'kadena_sign',
            topic,
            id,
          });
          break;
        }
        // new methods from https://github.com/kadena-io/KIPs/blob/master/kip-0017.m
        case 'kadena_sign_v1': {
          showSignPopup({
            signingCmd: request.params,
            networkId: request.params.networkId,
            domain: session?.peer?.metadata.url,
            icon: session?.peer?.metadata?.icons[0],
            walletConnectAction: 'kadena_sign_v1',
            topic,
            id,
          });
          break;
        }
        case 'kadena_quicksign_v1': {
          const { commandSigDatas } = params;
          showQuickSignPopup({
            commandSigDatas,
            walletConnectAction: 'kadena_quicksign_v1',
            topic,
            id,
          });
          break;
        }
        case 'kadena_getAccounts_v1': {
          const sessions = walletConnect.getActiveSessions();
          console.log(`🚀 ~ sessions:`, sessions);
          break;
        }
        default: {
          break;
        }
      }
      if (request.method === 'kadena_sign') {
        // old request method
      }
    });
  });
  walletConnect.wallet?.on('session_delete', (event) => console.log('session_delete', event));
  walletConnect.wallet?.on('session_event', (event) => console.log('session_event', event));
  walletConnect.wallet?.on('pairing_delete', (event) => console.log('pairing_delete', event));
  walletConnect.wallet?.on('pairing_expire', (event) => console.log('pairing_expire', event));
}

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
    if (request.action.includes('walletConnect')) {
      const wcMethod = request.action?.split(':') && request.action?.split(':')[1];
      switch (wcMethod) {
        case 'init': {
          await walletConnect.init(request.uri);
          setWalletConnectEvents(request.accounts);
          break;
        }
        case 'response': {
          console.log(request);
          console.log(`🚀 !!! ~ request:`, request);
          await walletConnect.respond(request.topic, request.id, request.message, request.error);
          break;
        }
        default: {
          break;
        }
      }
    }
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
      case 'kda_getSelectedAccount':
        getSelectedAccount(originTabId);
        break;
      case 'kda_sendKadena':
        sendKadena(payload.data, originTabId);
        break;
      case 'kda_requestSign':
        kdaRequestSign(payload.data, originTabId);
        break;
      case 'kda_requestQuickSign':
        kdaRequestQuickSign(payload.data, originTabId);
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

const getSelectedWalletAsync = async (isHaveSecret = false) => {
  const newSelectedWallet = await new Promise((resolve) => {
    chrome?.storage.local.get('selectedWallet', (wallet) => {
      if (wallet && wallet.selectedWallet && wallet.selectedWallet.account) {
        const { selectedWallet } = wallet;
        chrome?.storage.session.get('accountPassword', (password) => {
          const { accountPassword } = password;
          const newWallet = {
            account: accountPassword ? decryptKey(selectedWallet.account, accountPassword) : null,
            publicKey: accountPassword ? decryptKey(selectedWallet.publicKey, accountPassword) : null,
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

const checkConnect = async (data, tabId) => {
  const isValidNetwork = await verifyNetwork(data.networkId);
  if (isValidNetwork) {
    const account = await getSelectedWalletAsync();
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
      data.tabId = tabId;
      showSignPopup(data);
    } else {
      checkStatus(data, tabId);
    }
  } else {
    checkStatus(data, tabId);
  }
};

const kdaRequestQuickSign = async (data, tabId) => {
  const isValidNetwork = await verifyNetwork(data.networkId);
  if (isValidNetwork) {
    const isValid = await checkValid(data);
    if (isValid) {
      showQuickSignPopup({ ...data, tabId });
    } else {
      checkStatus(data, tabId);
    }
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
      const account = await getSelectedWalletAsync();
      if (!account.account) {
        showPopup({ tabId, message: 'res_checkStatus' }, 'login-dapps');
      } else {
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
      }
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

const getConnectedSites = async () => {
  const newSelectedWallet = await new Promise((resolve) => {
    chrome.storage.local.get('selectedWallet', (wallet) => {
      if (wallet && wallet.selectedWallet && wallet.selectedWallet.account) {
        const { selectedWallet } = wallet;
        resolve(selectedWallet.connectedSites);
      } else {
        resolve([]);
      }
    });
  });
  return newSelectedWallet;
};

const checkValid = async (data) => {
  const activeDomains = await getActiveDomains();
  const connectedSites = await getConnectedSites();
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
    message: data.message,
  };

  chrome.storage.local.set({ dapps });

  chrome.windows.create(options);
};

export const showSignPopup = async (data = {}) => {
  const lastFocused = await getLastFocusedWindow();

  const options = {
    url: 'index.html#/signed-cmd',
    type: 'popup',
    top: lastFocused.top,
    left: lastFocused.left + (lastFocused.width - 360),
    width: 368,
    height: 610,
  };

  const signingCmd = {
    signingCmd: {
      ...data.signingCmd,
      tabId: data.tabId,
      networkId: data.networkId,
      domain: data.domain,
      icon: data.icon,
      walletConnectAction: data.walletConnectAction || false,
      topic: data.topic || false,
      id: data.id || false,
    },
  };

  chrome.storage.local.set({ signingCmd });

  chrome.windows.create(options);
};

const showQuickSignPopup = async (data = {}) => {
  const lastFocused = await getLastFocusedWindow();

  const options = {
    url: 'index.html#/quick-signed-cmd',
    type: 'popup',
    top: lastFocused.top,
    left: lastFocused.left + (lastFocused.width - 360),
    width: 368,
    height: 610,
  };

  chrome.storage.local.set({ quickSignedCmd: data });

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

const getSelectedAccount = async (tabId) => {
  chrome.storage.local.get('selectedWallet', (result) => {
    chrome.storage.session.get('accountPassword', (password) => {
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
      const account = await getSelectedWalletAsync();
      if (account?.account) {
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
        showPopup({ tabId }, 'login-dapps');
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
