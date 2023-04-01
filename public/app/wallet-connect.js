import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';

export class WalletConnectProvider {
  core;

  wallet;

  constructor() {
    this.core = new Core({
      projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID,
    });
    WebSocket.prototype.on = function (event, clb) {
      if (event === 'error') {
        this.onerror = clb;
      }
    };
  }

  async init(uri) {
    this.wallet = await Web3Wallet.init({
      core: this.core,
      metadata: {
        name: 'EckoWallet',
        description: 'EckoWallet Browser Extension',
        url: 'https://wallet.ecko.finance',
        icons: ['https://swap.ecko.finance/images/crypto/kaddex-crypto.svg'],
      },
    });

    await this.wallet.core.pairing.pair({ uri });
  }

  getActiveSessions() {
    return this.wallet.getActiveSessions();
  }

  async respond(topic, id, result, error) {
    const response = { id, result, jsonrpc: '2.0' };
    const sessionResponse = { topic, response, error };
    console.log(`🚀 !!! ~ WalletConnectProvider ~ sessionResponse:`, sessionResponse);
    await this.wallet.respondSessionRequest(sessionResponse);
  }
}
