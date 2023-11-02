/* eslint-disable no-await-in-loop */
import Pact from 'pact-lang-api';
import lib from 'cardano-crypto.js/kadena-crypto';
import { CHAIN_AVAILABLE_TOKENS_FIXTURE, CHAIN_COUNT } from './constant';
import { CONFIG, KADDEX_ANALYTICS_API } from './config';
import { getTimestamp } from './index';
// import { getLocalStorageDataByKey, SETTINGS_STORAGE_KEY } from './storage';

export const MAINNET_NETWORK_ID = 'mainnet01';

export const getApiUrl = (url, networkId, chainId) => `${url}/chainweb/0.0/${networkId}/chain/${chainId}/pact`;

export const fetchLocal = (code, url, networkId, chainId) => {
  const localCmd = {
    keyPairs: [],
    pactCode: code,
    meta: Pact.lang.mkMeta('not-real', chainId.toString(), 0.00000001, 1500000, getTimestamp(), 600),
  };
  return Pact.fetch.local(localCmd, getApiUrl(url, networkId, chainId));
};

const mkReq = (cmd) => ({
  headers: {
    'Content-Type': 'application/json',
  },
  method: 'POST',
  body: JSON.stringify(cmd),
});

export const fetchSend = (cmd, customApiHost) => fetch(`${customApiHost}/api/v1/send`, mkReq(cmd));

export const fetchListLocal = (code, url, networkId, chainId, gasPrice = CONFIG.GAS_PRICE, gasLimit = CONFIG.GAS_LIMIT) => {
  const customHost = getApiUrl(url, networkId, chainId);
  const localCmd = {
    pactCode: code,
    envData: {},
    meta: Pact.lang.mkMeta('', '', gasPrice, gasLimit, 0, CONFIG.X_CHAIN_TTL),
    networkId,
  };
  return Pact.fetch.local(localCmd, customHost);
};

export const generateSeedPhrase = () => {
  const seedPhrase = lib.kadenaGenMnemonic();
  return seedPhrase;
};

export const getKeyPairsFromSeedPhrase = (seedPhrase, index) => {
  const root = lib.kadenaMnemonicToRootKeypair('', seedPhrase);
  const hardIndex = 0x80000000;
  const newIndex = hardIndex + index;
  const [privateRaw, pubRaw] = lib.kadenaGenKeypair('', root, newIndex);
  const axprv = new Uint8Array(privateRaw);
  const axpub = new Uint8Array(pubRaw);
  const pub = Pact.crypto.binToHex(axpub);
  const prv = Pact.crypto.binToHex(axprv);
  return {
    publicKey: pub,
    secretKey: prv,
  };
};

export const getSignatureFromHash = (hash, privateKey) => {
  const newHash = Buffer.from(hash, 'base64');
  const u8PrivateKey = Pact.crypto.hexToBin(privateKey);
  const signature = lib.kadenaSign('', newHash, u8PrivateKey);
  const s = new Uint8Array(signature);
  return Pact.crypto.binToHex(s);
};

export type BlockchainNumber =
  | number
  | {
      int: string;
    }
  | {
      decimal: string;
    };

export function extractDecimal(input: BlockchainNumber) {
  try {
    if (typeof input === 'number') {
      return Number(input);
    }

    if ('decimal' in input) {
      return Number(input.decimal);
    }

    return Number(input.int);
  } catch (error) {
    return 0;
  }
}

export const getBalanceFromChainwebApiResponse = (res) => {
  let balance = 0;
  if (typeof res?.result?.data?.balance === 'number') {
    balance = res?.result?.data?.balance;
  } else if (res?.result?.data?.balance?.decimal && !Number.isNaN(res?.result?.data?.balance?.decimal)) {
    balance = Number(res?.result?.data?.balance?.decimal);
  }
  return balance;
};

export const pollRequestKey = async (reqKey, network) => {
  let attempts = 100;
  do {
    const pollRes = await Pact.fetch.poll({ requestKeys: [reqKey] }, network);
    if (pollRes[reqKey]) {
      attempts = 0;
      return pollRes[reqKey];
    }
    attempts -= 1;
    await new Promise((rs) => setTimeout(rs, 5000));
  } while (attempts > 0);
  return { success: false };
};

export const fetchTokenList = async () => {
  try {
    const tokensResponse = await fetch(`${KADDEX_ANALYTICS_API}/chain-data/fungible-tokens`);
    const tokensData = await tokensResponse.json();
    if (tokensData && tokensData[0] && tokensData[0]?.fungibleTokens) {
      return tokensData[0]?.fungibleTokens;
    }
    return CHAIN_AVAILABLE_TOKENS_FIXTURE;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error fetching fungible tokens', err);
  }
  return CHAIN_AVAILABLE_TOKENS_FIXTURE;
};

export const getTokenList = async (chainId?: string) => {
  const allChainTokens = await fetchTokenList();
  let uniqueAllChainTokens: Set<[]>[] = [];
  allChainTokens.forEach((tokens) => {
    uniqueAllChainTokens = [...new Set([...tokens, ...uniqueAllChainTokens])];
  });
  return chainId ? allChainTokens[Number(chainId)] : uniqueAllChainTokens;
};

/**
 *
 * @param {string[]} accounts
 */
export const getAccountExistsChains = async (accounts, networkUrl, networkId) => {
  const code = `
  (
    let* (                
      ${accounts.map((account, j) => `(coin_balance_${j} (try "not-exists" (coin.get-balance "${account}")))`).join('')}

          )
          {${accounts.map((acc, j) => `"${acc}": coin_balance_${j}`)}}
  )
  `;
  const accountResponse = {};
  for (let chainId = 0; chainId < CHAIN_COUNT; chainId += 1) {
    try {
      const res = await fetchListLocal(code, networkUrl, networkId, chainId);
      if (res.result?.status === 'success') {
        const data = res.result?.data;
        Object.keys(data).forEach((acc) => {
          if (data[acc] !== 'not-exists') {
            accountResponse[acc] = [...(accountResponse[acc] ?? []), chainId.toString()];
          }
        });
      } else {
        // eslint-disable-next-line no-console
        console.error(`getAccountExistsChains error chainId ${chainId}:`, res);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`getAccountExistsChains error chainId ${chainId}:`, err);
    }
  }
  return accountResponse;
};
