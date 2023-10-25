export type BlockchainTime = string | {
  time: string;
} | {
  timep: string;
};

export const getTimeByBlockchain = (timestamp: BlockchainTime) => {
  if (typeof timestamp === 'string') {
    return timestamp;
  }

  if ('time' in timestamp) {
    return timestamp.time;
  }

  return timestamp.timep;
};
