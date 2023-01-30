class Listener {
  constructor(name, handler) {
    this.name = name;
    this.handler = handler;
  }

  send(payload) {
    window.postMessage({ action: this.name, ...payload });
  }

  on(responseName) {
    return new Promise((resolve, reject) => {
      window.addEventListener('message', (event) => {
        if (event.data.action === responseName) {
          if (this.handler) {
            this.handler(event.data);
          }

          if (event.data.error) {
            return reject(event.data.error);
          }

          return resolve(event.data);
        }
      });
    });
  }
}

/**
 * Kadena instance
 *
 * Methods:
 * on: params(name: String, callback: Function)
 *
 * request: params(options: Object)
 */
window.kadena = {
  isKadena: true,

  on: async (name, callback) => {
    let listener = new Listener(name, (response) => {
      if (response.action === 'res_requestAccount' && response.target === 'kda.dapps') {
        const domain = window.location.hostname || window.window.location.href;
        if (response.account && response.account.connectedSites && response.account.connectedSites.includes(domain)) {
          callback(response);
        } else {
          callback({});
        }
      } else {
        callback(response);
      }
    });
    return await listener.on(name);
  },

  request: async (options) => {
    const domain = window.location.hostname || window.window.location.href;
    const icon = getFavicon() || 'no icon';

    const { method, networkId } = options;
    const info = { ...options, domain };

    switch (method) {
      case 'kda_connect':
        return openKadenaConnect(networkId, domain, icon);

      case 'kda_disconnect':
        return kadenaDisconnect(networkId, domain);

      case 'kda_checkStatus':
        return checkStatus(info);

      case 'kda_getNetwork':
        return getKadenaNetwork();

      case 'kda_getChain':
        return getKadenaChain();

      case 'kda_getSelectedAccount':
        return getSelectedAccount();

      case 'kda_requestAccount':
        return getAccountSelected(networkId, domain);

      case 'kda_requestSign':
        return kdaRequestSign({ ...options.data, domain });

      case 'kda_requestQuickSign':
        return kdaRequestQuickSign({ ...options.data, domain });

      case 'kda_sendKadena':
        return sendKadena({ ...options.data, domain });

      default:
        break;
    }
  },
};

const getFavicon = () => {
  let favicon;
  const nodeList = document.getElementsByTagName('link');
  for (let i = 0; i < nodeList.length; i += 1) {
    if (nodeList[i].getAttribute('rel') === 'icon' || nodeList[i].getAttribute('rel') === 'shortcut icon') {
      favicon = nodeList[i].getAttribute('href');
    }
  }
  if (favicon) {
    if (favicon.includes('http') || favicon.includes('www')) {
      return favicon;
    }
    return `${window.origin}${favicon}`;
  }
  return favicon;
};

const openKadenaConnect = async (networkId, domain, icon) => {
  const listener = new Listener('kda_connect');
  listener.send({
    target: 'kda.content',
    action: listener.name,
    data: {
      networkId,
      domain,
      icon,
    },
  });

  let data = await listener.on('res_checkStatus');

  return data.result;
};

const checkStatus = async (info) => {
  const { networkId, domain } = info;
  const listener = new Listener('kda_checkStatus');
  listener.send({
    target: 'kda.content',
    action: listener.name,
    data: {
      networkId,
      domain,
    },
  });

  let data = await listener.on('res_checkStatus');
  return data.result;
};

const kdaRequestSign = async (data) => {
  const listener = new Listener('kda_requestSign');
  listener.send({
    target: 'kda.content',
    action: listener.name,
    data,
  });

  const response = await listener.on('res_requestSign');
  return response.result;
};

const kdaRequestQuickSign = async (data) => {
  const listener = new Listener('kda_requestQuickSign');
  listener.send({
    target: 'kda.content',
    action: listener.name,
    data,
  });

  const response = await listener.on('res_requestQuickSign');
  return response.result;
};

const getKadenaNetwork = async () => {
  const listener = new Listener('kda_getNetwork');
  listener.send({
    target: 'kda.content',
    action: listener.name,
    data: {},
  });

  let data = await listener.on('res_getNetwork');

  return data.network;
};

const getKadenaChain = async () => {
  const listener = new Listener('kda_getChain');
  listener.send({
    target: 'kda.content',
    action: listener.name,
    data: {},
  });

  let data = await listener.on('res_getChain');

  return data.chainId;
};

const getSelectedAccount = async () => {
  const listener = new Listener('kda_getSelectedAccount');
  listener.send({
    target: 'kda.content',
    action: listener.name,
    data: {},
  });

  let data = await listener.on('res_getSelectedAccount');

  return data.selectedAccount;
};

const sendKadena = async (params) => {
  const listener = new Listener('kda_sendKadena');
  listener.send({
    target: 'kda.content',
    action: listener.name,
    data: params,
  });

  const { data } = await listener.on('res_sendKadena');
  return data;
};

const kadenaDisconnect = async (networkId, domain) => {
  const listener = new Listener('kda_disconnect');
  listener.send({
    target: 'kda.content',
    action: listener.name,
    data: {
      networkId,
      domain,
    },
  });

  return await listener.on('res_disconnect');
};

const getAccountSelected = async (networkId, domain) => {
  const listener = new Listener('kda_requestAccount');
  listener.send({
    target: 'kda.content',
    action: listener.name,
    data: {
      networkId,
      domain,
    },
  });

  const { result } = await listener.on('res_requestAccount');

  return result;
};
