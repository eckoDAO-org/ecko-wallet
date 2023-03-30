import { Core } from '@walletconnect/core';
import { Web3Wallet } from '@walletconnect/web3wallet';

export const initWalletConnect = async (uri, accounts) => {
  console.log(`🚀 !!! ~ accounts:`, accounts);
  const core = new Core({
    projectId: process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID,
  });
  WebSocket.prototype.on = function (event, clb) {
    if (event === 'error') {
      this.onerror = clb;
    }
  };

  const web3wallet = await Web3Wallet.init({
    core,
    metadata: {
      name: 'EckoWallet',
      description: 'EckoWallet Browser Extension',
      url: 'https://wallet.ecko.finance',
      icons: ['https://swap.ecko.finance/images/crypto/kaddex-crypto.svg'],
    },
  });
  console.log(`🚀 !!! ~ web3wallet`, web3wallet);
  web3wallet.on('session_proposal', async (proposal) => {
    const connectStringAccount = accounts.account.replace(':', '**');
    const session = await web3wallet.approveSession({
      id: proposal.id,
      namespaces: {
        kadena: {
          chains: ['kadena:mainnet01', 'kadena:testnet04', 'kadena:development'],
          accounts: [
            `kadena:mainnet01:${connectStringAccount}`,
            `kadena:testnet04:${connectStringAccount}`,
            `kadena:development:${connectStringAccount}`,
          ],
          methods: ['kadena_getAccounts_v1', 'kadena_sign_v1', 'kadena_quicksign_v1'],
          events: [],
        },
      },
    });
    console.log(`🚀 !!! ~ session`, session);
  });
  web3wallet?.on('session_proposal', (event) => console.log('session_proposal', event));
  web3wallet?.on('session_request', (event) => console.log('session_request', event));
  web3wallet?.on('session_delete', (event) => console.log('session_delete', event));
  web3wallet?.on('session_event', (event) => console.log('session_event', event));
  web3wallet?.on('pairing_delete', (event) => console.log('pairing_delete', event));
  web3wallet?.on('pairing_expire', (event) => console.log('pairing_expire', event));
  await web3wallet.core.pairing.pair({ uri });
};
