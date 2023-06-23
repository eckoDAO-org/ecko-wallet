export enum NFTTypes {
  ARKADE = 'ARKADE',
  KADENA_MINING_CLUB = 'KADENA_MINING_CLUB',
  KADENA_MINING_CLUB_FOUNDER_PASS = 'KADENA_MINING_CLUB_FOUNDER_PASS',
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
    displayName: 'Looney Bulls Airdrop',
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
    chainId: 8,
    displayName: 'Kadena Mining Club',
    moduleName: 'free.kadena-mining-club',
    pactAlias: 'kadena_mining_club_miners',
    pic: 'https://farm.kdamining.club/assets/424ee438898f8da7ac2dc1a66b29b6c09bedc8399c032624994650533615df67.jpeg',
    getPicById: (id) => `https://farm.kdamining.club/assets/${id}.jpeg`,
    getAccountBalance: (account) => `(free.kadena-mining-club.get-user-miners "${account}")`,
    type: NFTTypes.KADENA_MINING_CLUB,
  },
  {
    chainId: 8,
    displayName: 'Kadena Mining Club Founder Pass',
    moduleName: 'free.kadena-mining-club',
    pactAlias: 'kadena_mining_club_founder_pass',
    pic: 'https://farm.kdamining.club/static/media/founders.b9d3a224b6ce8e690f53.webp',
    getPicById: (id) => `https://farm.kdamining.club/assets/${id}.jpeg`,
    getAccountBalance: (account) => `(free.kadena-mining-club.get-user-founders "${account}")`,
    type: NFTTypes.KADENA_MINING_CLUB_FOUNDER_PASS,
  },
];

export default nftList;
