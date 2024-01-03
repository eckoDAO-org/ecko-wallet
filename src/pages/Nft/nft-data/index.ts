export enum NFTTypes {
  ARKADE = 'ARKADE',
  KADENA_MINING_CLUB = 'KADENA_MINING_CLUB',
  KADENA_MINING_CLUB_FOUNDER_PASS = 'KADENA_MINING_CLUB_FOUNDER_PASS',
  KITTY_KAD = 'KITTY_KAD',
  WIZ_ARENA = 'WIZ_ARENA',
  MARMALADE_V2 = 'MARMALADE_V2',
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
  getDetailLinkById?: (id: string | number) => string;
  type?: NFTTypes;
}

const nftList: NFTData[] = [
  {
    chainId: 8,
    displayName: 'Immutable Records',
    moduleName: 'n_2cf9d750a8ec510cb925d897b82069850b0a0bea.imr-auction-policy',
    pactAlias: 'immutable_records',
    pic: 'https://c2a4iuck3xz4ezcdprp7wcmlhno7okvz5yhdo7mjuv5aed5kkpha.arweave.net/FoHEUErd88JkQ3xf-wmLO133KrnuDjd9iaV6Ag-qU84/NFT-series-1/19920112/19920112-art.png',
    getPicById: (id) => `#`,
    getDetailLinkById: (auctionId) => `https://nft.immutablerecord.com/?auctionId=${auctionId}`,
    getAccountBalance: (account) => getImmutableRecordsAccountList(25, account),
    type: NFTTypes.MARMALADE_V2,
  },
  {
    chainId: 1,
    displayName: 'Brawler Bears',
    moduleName: 'free.brawler-bears',
    pactAlias: 'brawler_bears',
    pic: 'https://arkade-prod.s3.amazonaws.com/brawler-bears/880.png',
    getPicById: (id) => `https://arkade-prod.s3.amazonaws.com/brawler-bears/${id}.png`,
    getDetailLinkById: (id) => `https://www.arkade.fun/marketplace/brawler-bears/${id}`,
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
    getDetailLinkById: (id) => `https://www.arkade.fun/marketplace/looney-bulls/${id}`,
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
    getDetailLinkById: (id) => `https://www.arkade.fun/marketplace/sphynxxx-cats/${id}`,
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
    getDetailLinkById: (id) => `https://www.arkade.fun/marketplace/eighties-bulls/${id}`,
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
    getDetailLinkById: (id) => `https://www.arkade.fun/marketplace/90s-bulls/${id}`,
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
    getDetailLinkById: (id) => `https://www.arkade.fun/marketplace/lazy-penguins/${id}`,
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
    getDetailLinkById: (id) => `https://www.arkade.fun/marketplace/kadena-skellies/${id}`,
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
    getDetailLinkById: (id) => `https://www.arkade.fun/marketplace/variation-apes/${id}`,
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
    getDetailLinkById: (id) => `https://www.arkade.fun/marketplace/pact-rats/${id}`,
    getAccountBalance: (account) => `(free.pact-rats.ids-owned-by "${account}")`,
    type: NFTTypes.ARKADE,
  },
  {
    chainId: 1,
    displayName: 'Secret Garden',
    moduleName: 'free.secret-garden-of-kadena',
    pactAlias: 'secret_garden_of_kadena',
    pic: 'https://arkade-prod.s3.us-east-1.amazonaws.com/secret-garden-of-kadena/853.png',
    getDetailLinkById: (id) => `https://www.arkade.fun/marketplace/secret-garden-of-kadena/${id}`,
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
    getDetailLinkById: (id) => `https://www.arkade.fun/marketplace/kda-punks/${id}`,
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
    getDetailLinkById: (id) => `https://farm.kdamining.club/view?id=${id}&type=miner`,
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
    getDetailLinkById: (id) => `https://farm.kdamining.club/view?id=${id}&type=founders`,
    getAccountBalance: (account) => `(free.kadena-mining-club.get-user-founders "${account}")`,
    type: NFTTypes.KADENA_MINING_CLUB_FOUNDER_PASS,
  },
  {
    chainId: 1,
    displayName: 'Wizards Arena',
    moduleName: 'free.wiz-arena',
    pactAlias: 'wiz_arena',
    pic: 'https://storage.googleapis.com/wizarena/generated_imgs/612.png',
    getPicById: (id) => `https://storage.googleapis.com/wizarena/generated_imgs/${id}.png`,
    getDetailLinkById: (id) => `https://www.wizardsarena.net/nft/${id}`,
    getAccountBalance: (account) => `(free.wiz-arena.wizard-owned-by "${account}")`,
    type: NFTTypes.WIZ_ARENA,
  },
];

export default nftList;

function getImmutableRecordsAccountList(numAuctions, account) {
  let pactCode = '(let* (';
  pactCode += '(total-balance 0.0)';

  for (let i = 1; i <= numAuctions; i += 1) {
    pactCode += `
      (auction-details${i} (try {"token-id": "0"} (n_2cf9d750a8ec510cb925d897b82069850b0a0bea.imr-auction-policy.retrieve-auction ${i})))
      (token-id${i} (at "token-id" auction-details${i}))
      (token-info${i} (try {"uri": "0"} (marmalade-v2.ledger.get-token-info token-id${i})))
      (account-balance${i} (try 0.0 (marmalade-v2.ledger.get-balance token-id${i} "${account}")))
      (total-balance (+ total-balance account-balance${i}))`;
  }

  pactCode += '\n)\n{';

  for (let i = 1; i <= numAuctions; i += 1) {
    pactCode += `
      "token${i}": {"token-id": token-id${i}, "uri": (at "uri" token-info${i}), "accountBalance": account-balance${i}}`;
    if (i < numAuctions) {
      pactCode += ',';
    }
  }

  pactCode += `,
    "totalBalance": total-balance
    })`;

  return pactCode;
}

// const account = 'k:d0ecb992f042b2918f8116c841496553887c8d09e469f8d4ac4a6b17d61527c8';
// const pactCode = getImmutableRecordsAccountList(5, account);
// console.log(pactCode);
