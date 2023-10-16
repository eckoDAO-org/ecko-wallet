export const getTimeByBlockchain = (timestamp) => {
  if (timestamp.time) return timestamp.time;
  if (timestamp.timep) return timestamp.timep;
  return timestamp;
};
