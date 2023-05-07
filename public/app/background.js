/* eslint no-use-before-define: 0 */
import 'regenerator-runtime/runtime';
import { decryptKey } from '../../src/utils/security';
import { WALLET_CONNECT_SIGN_METHOD, WALLET_CONNECT_QUICKSIGN_METHOD, WALLET_CONNECT_GET_ACCOUNTS_METHOD } from '../../src/utils/config';
import { INTERNAL_MESSAGE_PREFIX } from '../../src/utils/message';
import { getAccountExistsChains } from '../../src/utils/chainweb';
import { WalletConnectProvider } from './wallet-connect';

let contentPort = null;
const portMap = new Map();

const walletConnect = new WalletConnectProvider();

function sendInternalMessage(action, data = null) {
  chrome.runtime.sendMessage({
    target: 'kda.extension',
    action,
    data,
  });
}

function setWalletConnectEvents(accounts) {
  const requestIds = [];
  walletConnect.wallet.on('session_proposal', async (proposal) => {
    let accountsToShare = [];
    for (let i = 0; i < accounts.length; i += 1) {
      accountsToShare = [
        ...accountsToShare,
        `kadena:mainnet01:${accounts[i]}`,
        `kadena:testnet04:${accounts[i]}`,
        `kadena:development:${accounts[i]}`,
      ];
    }
    const session = await walletConnect.wallet.approveSession({
      id: proposal.id,
      namespaces: {
        kadena: {
          chains: ['kadena:mainnet01', 'kadena:testnet04', 'kadena:development'],
          accounts: accountsToShare,
          methods: [WALLET_CONNECT_GET_ACCOUNTS_METHOD, WALLET_CONNECT_SIGN_METHOD, WALLET_CONNECT_QUICKSIGN_METHOD],
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
    walletConnect.wallet?.on('session_request', async (event) => {
      const { topic, params, id } = event;
      // check if REQUEST id is already processed
      if (requestIds.includes(id)) {
        return;
      }
      requestIds.push(id);
      const { request, chainId } = params;
      const networkId = chainId?.split('kadena:')[1];
      const isValidNetwork = await verifyNetwork(networkId);
      if (!isValidNetwork) {
        const error = 'Invalid Network';
        await walletConnect.respond(topic, id, { error }, error);
        return;
      }
      switch (request.method) {
        case WALLET_CONNECT_SIGN_METHOD: {
          const account = await getSelectedWalletAsync();
          if (account?.publicKey !== request?.params?.signingPubKey) {
            const error = 'Invalid account';
            await walletConnect.respond(topic, id, { error }, error);
            return;
          }
          showSignPopup({
            signingCmd: { ...request.params, pactCode: request.code },
            networkId: request.params.networkId,
            domain: session?.peer?.metadata.url,
            icon: session?.peer?.metadata?.icons[0],
            walletConnectAction: WALLET_CONNECT_SIGN_METHOD,
            topic,
            id,
          });
          break;
        }
        case WALLET_CONNECT_QUICKSIGN_METHOD: {
          const commandSigDatas = request?.params?.commandSigDatas;
          showQuickSignPopup({
            commandSigDatas,
            networkId: params.chainId?.split(':') && params.chainId?.split(':')[1],
            walletConnectAction: WALLET_CONNECT_QUICKSIGN_METHOD,
            topic,
            id,
          });
          break;
        }
        case WALLET_CONNECT_GET_ACCOUNTS_METHOD: {
          const sessions = walletConnect.getActiveSessions();
          const isActiveSession = sessions && sessions[topic];
          if (isActiveSession) {
            chrome.storage.local.get('selectedNetwork', async ({ selectedNetwork }) => {
              if (selectedNetwork) {
                const walletConnectAccounts = sessions[topic].namespaces?.kadena?.accounts?.filter((acc) => acc.includes(selectedNetwork.networkId));
                const activeAccountsChains = await getAccountExistsChains(
                  walletConnectAccounts.map((acc) => `k:${acc.split(':')[2]}`),
                  selectedNetwork.url,
                  selectedNetwork.networkId,
                );
                const sessionAccounts = walletConnectAccounts
                  ?.filter((acc) => acc.includes(chainId))
                  ?.map((account) => {
                    const publicKey = account.split(':')[2];
                    const cleanAccount = `k:${publicKey}`;
                    return {
                      account,
                      publicKey,
                      kadenaAccounts: [
                        {
                          name: cleanAccount,
                          contract: 'coin',
                          chains: activeAccountsChains[cleanAccount] ?? [],
                        },
                      ],
                    };
                  });
                walletConnect.respond(topic, id, { accounts: sessionAccounts });
              }
            });
          }
          break;
        }
        default: {
          break;
        }
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
    if (request.action.includes(INTERNAL_MESSAGE_PREFIX)) {
      const internalMethod = request.action?.split(INTERNAL_MESSAGE_PREFIX) && request.action?.split(INTERNAL_MESSAGE_PREFIX)[1];
      switch (internalMethod) {
        case 'walletConnect:init': {
          await walletConnect.init();
          await walletConnect.pair(request.uri);
          setWalletConnectEvents(request.accounts);
          return;
        }
        case 'walletConnect:response': {
          if (walletConnect.isInitialized()) {
            await walletConnect.respond(request.topic, request.id, request.response, request.error);
          }
          return;
        }
        case 'walletConnect:sessions': {
          if (walletConnect.isInitialized()) {
            const sessions = await walletConnect.getActiveSessions();
            sendInternalMessage('walletConnect:sessions', sessions);
          } else {
            sendInternalMessage('walletConnect:sessions', []);
          }
          return;
        }
        case 'walletConnect:disconnect': {
          if (walletConnect.isInitialized()) {
            await walletConnect.disconnectSession(request?.topic);
          }
          return;
        }
        default: {
          return;
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
      wcMethod: data.wcMethod || null,
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
      sendInternalMessage('sync_data');
    }
  }
});
