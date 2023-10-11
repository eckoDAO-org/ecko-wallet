const X_CHAIN_GAS_STATION = 'xwallet-xchain-gas';
const X_CHAIN_GAS_PRICE = 0.00000001;
const X_CHAIN_GAS_LIMIT = 1100;
const X_CHAIN_TTL = 28800;

const GAS_PRICE = 0.000001;
const GAS_LIMIT = 2500;

export const CONFIG = {
  X_CHAIN_GAS_PRICE,
  X_CHAIN_GAS_LIMIT,
  X_CHAIN_GAS_STATION,
  X_CHAIN_TTL,
  GAS_PRICE,
  GAS_LIMIT,
};
export const NUMBER_DECIMAL_AFTER_DOT = 12;
export const ESTIMATE_KDA_TO_USD_API = 'https://api.coingecko.com/api/v3/simple/price?vs_currencies=usd&ids=kadena,';
export const KADDEX_ANALYTICS_API = 'https://analytics-api.kaddex.com';
export const TELEGRAM_GROUP_LINK = 'https://t.me/kadena_io';
export const DISCORD_INVITATION_LINK = 'https://discord.com/invite/QSJpHRFDcv';
export const WEBSITE_LINK = 'https://wallet.ecko.finance/';
export const TERM_LINK = 'https://wallet.ecko.finance/terms-of-use';
export const PRIVACY_LINK = 'https://wallet.ecko.finance/privacy-policy';

export type GasType = {
  LABEL: string;
  GAS_PRICE: number;
  GAS_LIMIT: number;
};

export const GAS_CONFIGS: { [key: string]: GasType } = {
  ECONOMY: {
    LABEL: 'Economy',
    GAS_PRICE: 0.00000001,
    GAS_LIMIT,
  },
  NORMAL: {
    LABEL: 'Normal',
    GAS_PRICE,
    GAS_LIMIT,
  },
  FAST: {
    LABEL: 'Fast',
    GAS_PRICE: 0.0001,
    GAS_LIMIT,
  },
};
export const ECKO_WALLET_SEND_TX_NONCE = 'XE';
export const ECKO_WALLET_DAPP_SIGN_NONCE = 'XEDS';

export const autoLockOptions = [
  {
    value: 30 * 60,
    label: '30min',
  },
  {
    value: 60 * 60,
    label: '1h',
  },
  {
    value: 60 * 60 * 2,
    label: '2h',
  },
  {
    value: 60 * 60 * 4,
    label: '4h',
  },
  {
    value: null,
    label: 'Lock manually only',
  },
];

export const WALLET_CONNECT_SIGN_METHOD = 'kadena_sign_v1';
export const WALLET_CONNECT_QUICKSIGN_METHOD = 'kadena_quicksign_v1';
export const WALLET_CONNECT_GET_ACCOUNTS_METHOD = 'kadena_getAccounts_v1';
