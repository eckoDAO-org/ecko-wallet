// Send
export const updateSendDapp = (data) => {
  (window as any)?.chrome?.runtime?.sendMessage({
    data,
    target: 'kda.background',
    action: 'res_sendKadena',
  });
};

// Connect
export const updateConnectMessage = (result, tabId) => {
  (window as any)?.chrome?.runtime?.sendMessage({
    result,
    target: 'kda.background',
    action: 'res_checkStatus',
    tabId,
  });
};

// Sign cmd
export const updateSignedCmdMessage = (result, tabId) => {
  (window as any)?.chrome?.runtime?.sendMessage({
    result,
    target: 'kda.background',
    action: 'res_requestSign',
    tabId,
  });
};

// QuickSign cmd
export const updateQuickSignedCmdMessage = (result, tabId) => {
  (window as any)?.chrome?.runtime?.sendMessage({
    result,
    target: 'kda.background',
    action: 'res_requestQuickSign',
    tabId,
  });
};

// Account res
export const updateAccountMessage = (result, tabId) => {
  (window as any)?.chrome?.runtime?.sendMessage({
    result,
    target: 'kda.background',
    action: 'res_requestAccount',
    tabId,
  });
};

// Account res_checkStatus
export const updateCheckStatusMessage = (result, tabId) => {
  (window as any)?.chrome?.runtime?.sendMessage({
    result,
    target: 'kda.background',
    action: 'res_checkStatus',
    tabId,
  });
};

export const initWalletConnect = (uri: string, accounts: string[]) => {
  (window as any)?.chrome?.runtime?.sendMessage({
    uri,
    accounts,
    target: 'kda.background',
    action: 'walletConnect:init',
  });
};

export const sendWalletConnectMessage = (id, topic, message, error?) => {
  (window as any)?.chrome?.runtime?.sendMessage({
    id,
    topic,
    message,
    error,
    target: 'kda.background',
    action: 'walletConnect:response',
  });
};
