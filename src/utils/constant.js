import images from 'src/images';

export const OptionSelect = {
  ConnectedSite: 0,
  ViewExplorer: 1,
  ExportPrivateKey: 2,
  RemoveWallet: 3,
  FinishTransfer: 5,
  DetailTrans: 6,
  Close: 4,
};

export const BUTTON_SIZE = {
  NORMAL: 'normal',
  FULL: 'full',
};

export const BUTTON_TYPE = {
  ACTIVE: 'active',
  DISABLE: 'disable',
  TRANSPARENT: 'transparent',
  REMOVE: 'remove',
};

export const GAS_PAYER = [{ value: 0, label: 'Public Gas Station' }];

export const ACTIVE_TAB = {
  HOME: 'home',
  HISTORY: 'history',
  SETTINGS: 'settings',
};

export const CHAIN_COUNT = 20;

export const KNOWN_TOKENS = {
  'runonflux.flux': {
    symbol: 'flux',
    image: images.wallet.tokens.flux,
  },
  'kdlaunch.token': {
    symbol: 'kdl',
    image: images.wallet.tokens.kdl,
  },
  'free.anedak': {
    symbol: 'anedak',
    image: images.wallet.tokens.anedak,
  },
  'free.babena': {
    symbol: 'babena',
    image: images.wallet.tokens.babena,
  },
};
