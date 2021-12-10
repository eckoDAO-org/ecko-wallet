// Send
export const updateSendDapp = (data) => {
  (window as any)?.chrome?.runtime?.sendMessage({
    data,
    target: 'kda.background',
    action: 'res_sendKadena',
  });
};

// Connect
export const updateConnectMessage = (result) => {
  (window as any)?.chrome?.runtime?.sendMessage({
    result,
    target: 'kda.background',
    action: 'res_checkStatus',
  });
};

// Sign cmd
export const updateSignedCmdMessage = (result) => {
  (window as any)?.chrome?.runtime?.sendMessage({
    result,
    target: 'kda.background',
    action: 'res_requestSign',
  });
};
