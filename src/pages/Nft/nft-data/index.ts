export enum NFTTypes {
  ARKADE = 'ARKADE',
  KADENA_MINING_CLUB = 'KADENA_MINING_CLUB',
  KADENA_MINING_CLUB_FOUNDER_PASS = 'KADENA_MINING_CLUB_FOUNDER_PASS',
  KITTY_KAD = 'KITTY_KAD',
}

export interface NFTData {
  chainId: number;
  moduleName: string;
  pactAlias: string;
  displayName: string;
  pic: string;
  // eslint-disable-next-line no-unused-vars
  getAccountBalance: (account: string) => string;
  getPicById: (id: string | number) => string;
  type?: NFTTypes;
}

const nftList: NFTData[] = [
  {
    chainId: 1,
    displayName: 'Brawler Bears',
    moduleName: 'free.brawler-bears',
    pactAlias: 'brawler_bears',
    pic: 'https://arkade-prod.s3.amazonaws.com/brawler-bears/880.png',
    getPicById: (id) => `https://arkade-prod.s3.amazonaws.com/brawler-bears/${id}.png`,
    getAccountBalance: (account) => `(free.brawler-bears.ids-owned-by "${account}")`,
    type: NFTTypes.ARKADE,
  },
  {
    chainId: 1,
    displayName: 'Looney Bulls',
    moduleName: 'free.looney-bulls-airdrop',
    pactAlias: 'looney_bulls_airdrop',
    pic: 'https://arkade-prod.s3.amazonaws.com/looney-bulls/130.png',
    getPicById: (id) => `https://arkade-prod.s3.amazonaws.com/looney-bulls/${id}.png`,
    getAccountBalance: (account) => `(free.looney-bulls-airdrop.ids-owned-by "${account}")`,
    type: NFTTypes.ARKADE,
  },
  {
    chainId: 1,
    displayName: 'SphynXXX Cats',
    moduleName: 'free.sphynxxx-cats',
    pactAlias: 'sphynxxx_cats',
    pic: 'https://storage.googleapis.com/sphynx/153.jpg',
    getPicById: (id) => `https://arkade-prod.s3.amazonaws.com/sphynx/${id}.png`,
    getAccountBalance: (account) => `(free.sphynxxx-cats.ids-owned-by "${account}")`,
    type: NFTTypes.ARKADE,
  },
  {
    chainId: 1,
    displayName: 'Arkade 80s Bulls',
    moduleName: 'free.eighties-bulls',
    pactAlias: 'eighties_bulls',
    pic: 'https://arkade-prod.s3.amazonaws.com/arkade-80s-bulls/104.png',
    getPicById: (id) => `https://arkade-prod.s3.amazonaws.com/arkade-80s-bulls/${id}.png`,
    getAccountBalance: (account) => `(free.eighties-bulls.ids-owned-by "${account}")`,
    type: NFTTypes.ARKADE,
  },
  {
    chainId: 1,
    displayName: 'Arkade 90s Bulls',
    moduleName: 'free.nineties-bulls',
    pactAlias: 'nineties_bulls',
    pic: 'https://arkade-prod.s3.amazonaws.com/arkade-90s-bulls/1307.png',
    getPicById: (id) => `https://arkade-prod.s3.amazonaws.com/arkade-90s-bulls/${id}.png`,
    getAccountBalance: (account) => `(free.nineties-bulls.ids-owned-by "${account}")`,
    type: NFTTypes.ARKADE,
  },
  {
    chainId: 1,
    displayName: 'Lazy Penguins',
    moduleName: 'free.lazy-penguins',
    pactAlias: 'lazy_penguins',
    pic: 'https://storage.googleapis.com/lazypenguins/131.png',
    getPicById: (id) => `https://storage.googleapis.com/lazypenguins/${id}.png`,
    getAccountBalance: (account) => `(free.lazy-penguins.ids-owned-by "${account}")`,
    type: NFTTypes.ARKADE,
  },
  {
    chainId: 1,
    displayName: 'Kadena Skellies',
    moduleName: 'free.kda-skellies',
    pactAlias: 'kda_skellies',
    pic: 'https://storage.googleapis.com/kadenaskellies/346.png',
    getPicById: (id) => `https://storage.googleapis.com/kadenaskellies/${id}.png`,
    getAccountBalance: (account) => `(free.kda-skellies.ids-owned-by "${account}")`,
    type: NFTTypes.ARKADE,
  },
  {
    chainId: 1,
    displayName: 'Variation Apes',
    moduleName: 'free.variation-apes',
    pactAlias: 'variation_apes',
    pic: 'https://arkade-prod.s3.amazonaws.com/variation-apes/108.png',
    getPicById: (id) => `https://arkade-prod.s3.amazonaws.com/variation-apes/${id}.png`,
    getAccountBalance: (account) => `(free.variation-apes.ids-owned-by "${account}")`,
    type: NFTTypes.ARKADE,
  },
  {
    chainId: 1,
    displayName: 'Pact Rats',
    moduleName: 'free.pact-rats',
    pactAlias: 'pact_rats',
    pic: 'https://arkade-prod.s3.amazonaws.com/pact-rats/108.png',
    getPicById: (id) => `https://arkade-prod.s3.amazonaws.com/pact-rats/${id}.png`,
    getAccountBalance: (account) => `(free.pact-rats.ids-owned-by "${account}")`,
    type: NFTTypes.ARKADE,
  },
  {
    chainId: 1,
    displayName: 'Secret Garden',
    moduleName: 'free.secret-garden-of-kadena',
    pactAlias: 'secret_garden_of_kadena',
    pic: 'https://arkade-prod.s3.us-east-1.amazonaws.com/secret-garden-of-kadena/853.png',
    getPicById: (id) => `https://arkade-prod.s3.us-east-1.amazonaws.com/secret-garden-of-kadena/${id}.png`,
    getAccountBalance: (account) => `(free.secret-garden-of-kadena.ids-owned-by "${account}")`,
    type: NFTTypes.ARKADE,
  },
  {
    chainId: 1,
    displayName: 'KDA Punks',
    moduleName: 'free.punks',
    pactAlias: 'punks',
    pic: 'https://arkade-prod.s3.us-east-1.amazonaws.com/punks/222.png',
    getPicById: (id) => `https://arkade-prod.s3.us-east-1.amazonaws.com/punks/${id}.png`,
    getAccountBalance: (account) => `(free.punks.ids-owned-by "${account}")`,
    type: NFTTypes.ARKADE,
  },
  {
    chainId: 1,
    displayName: 'Kitty Kad Gen 1',
    moduleName: 'free.gen-1-kitty-kad-kitties',
    pactAlias: 'gen_1_kitty_kad_kitties',
    pic: 'https://uploads-ssl.webflow.com/62672fcd3f94ea5b55290338/629084715da74ec954c0f5dc_Kitty%20Kad%20Big.png',
    getPicById: (id) => `https://storage.googleapis.com/kittykad/gen1/${id}.png`,
    getAccountBalance: (account) => `(free.gen-1-kitty-kad-kitties.ids-owned-by "${account}")`,
    type: NFTTypes.KITTY_KAD,
  },
  {
    chainId: 1,
    displayName: 'Kitty Kad Gen 0',
    moduleName: 'free.kitty-kad-kitties',
    pactAlias: 'gen_0_kitty_kad_kitties',
    pic: 'https://uploads-ssl.webflow.com/62672fcd3f94ea5b55290338/629084715da74ec954c0f5dc_Kitty%20Kad%20Big.png',
    getPicById: (id) => `https://dc7daf10.kitty-images-static.pages.dev/${id}.png`,
    getAccountBalance: (account) => `(free.kitty-kad-kitties.ids-owned-by "${account}")`,
    type: NFTTypes.KITTY_KAD,
  },
  {
    chainId: 8,
    displayName: 'KMC Miners',
    moduleName: 'free.kadena-mining-club',
    pactAlias: 'kadena_mining_club_miners',
    pic: 'https://farm.kdamining.club/assets/424ee438898f8da7ac2dc1a66b29b6c09bedc8399c032624994650533615df67.jpeg',
    getPicById: (id) => `https://farm.kdamining.club/assets/${id}.jpeg`,
    getAccountBalance: (account) => `(free.kadena-mining-club.get-user-miners "${account}")`,
    type: NFTTypes.KADENA_MINING_CLUB,
  },
  {
    chainId: 8,
    displayName: 'Founders Pass',
    moduleName: 'free.kadena-mining-club',
    pactAlias: 'kadena_mining_club_founder_pass',
    pic: 'https://farm.kdamining.club/static/media/founders.b9d3a224b6ce8e690f53.webp',
    getPicById: (id) => `https://farm.kdamining.club/assets/${id}.jpeg`,
    getAccountBalance: (account) => `(free.kadena-mining-club.get-user-founders "${account}")`,
    type: NFTTypes.KADENA_MINING_CLUB_FOUNDER_PASS,
  },
];

export default nftList;
