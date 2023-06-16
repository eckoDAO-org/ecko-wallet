// TODO: fetch NFT data from server

interface NFTData {
  moduleName: string;
  pactAlias: string;
  displayName: string;
  pic: string;
  // eslint-disable-next-line no-unused-vars
  getPicById: (id: string | number) => string;
}

const arkades: NFTData[] = [
  {
    displayName: 'Brawler Bears',
    moduleName: 'free.brawler-bears',
    pactAlias: 'brawler_bears',
    pic: 'https://arkade-prod.s3.amazonaws.com/brawler-bears/880.png',
    getPicById: (id) => `https://arkade-prod.s3.amazonaws.com/brawler-bears/${id}.png`,
  },
  {
    displayName: 'Looney Bulls Airdrop',
    moduleName: 'free.looney-bulls-airdrop',
    pactAlias: 'looney_bulls_airdrop',
    pic: 'https://arkade-prod.s3.amazonaws.com/looney-bulls/130.png',
    getPicById: (id) => `https://arkade-prod.s3.amazonaws.com/looney-bulls/${id}.png`,
  },
  {
    displayName: 'SphynXXX Cats',
    moduleName: 'free.sphynxxx-cats',
    pactAlias: 'sphynxxx_cats',
    pic: 'https://storage.googleapis.com/sphynx/153.jpg',
    getPicById: (id) => `https://arkade-prod.s3.amazonaws.com/sphynx/${id}.png`,
  },
  {
    displayName: 'Arkade 80s Bulls',
    moduleName: 'free.eighties-bulls',
    pactAlias: 'eighties_bulls',
    pic: 'https://arkade-prod.s3.amazonaws.com/arkade-80s-bulls/104.png',
    getPicById: (id) => `https://arkade-prod.s3.amazonaws.com/arkade-80s-bulls/${id}.png`,
  },
  {
    displayName: 'Arkade 90s Bulls',
    moduleName: 'free.nineties-bulls',
    pactAlias: 'nineties_bulls',
    pic: 'https://arkade-prod.s3.amazonaws.com/arkade-90s-bulls/1307.png',
    getPicById: (id) => `https://arkade-prod.s3.amazonaws.com/arkade-90s-bulls/${id}.png`,
  },
];

const nftCollectionGroups = [
  {
    chainId: 8,
    component: null,
    collections: arkades,
  },
];

export default arkades;
