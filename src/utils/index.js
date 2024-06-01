import BigNumber from 'bignumber.js';
import { KNOWN_TOKENS } from './constant';

export const getTimestamp = () => Math.floor(new Date().getTime() / 1000) - 90;

export const createBlob = (str, mime) => {
  const string = typeof str === 'object' ? JSON.stringify(str) : str;
  if (string === null) return '';
  const blob = new Blob([string], {
    type: mime,
  });
  return window.URL.createObjectURL(blob);
};

export const convertContacts = (data) => {
  const contacts = [];
  const dataArr = Object.keys(data);
  for (let i = 0; i < dataArr.length; i += 1) {
    const chainContacts = data[dataArr[i]];
    const chainContactsArr = Object.keys(chainContacts);
    for (let j = 0; j < chainContactsArr.length; j += 1) {
      contacts.push(chainContacts[chainContactsArr[j]]);
    }
  }
  return contacts;
};

export const convertNetworks = (data) => {
  const networks = [];
  const dataArr = Object.keys(data);
  for (let i = 0; i < dataArr.length; i += 1) {
    networks.push(data[dataArr[i]]);
  }
  networks.sort((a, b) => {
    const idA = Number(a.id);
    const idB = Number(b.id);
    return idA - idB;
  });
  return networks;
};

export const revertNetworks = (data) => {
  const networks = {};
  for (let i = 0; i < data.length; i += 1) {
    networks[data[i].id] = data[i];
  }
  return networks;
};

export const convertRecent = (data) => {
  const recent = [];
  const dataArr = Object.keys(data);
  for (let i = 0; i < dataArr.length; i += 1) {
    const chainRecent = data[dataArr[i]];
    const chainRecentArr = Object.keys(chainRecent);
    for (let j = 0; j < chainRecentArr.length; j += 1) {
      recent.push(chainRecent[chainRecentArr[j]]);
    }
  }
  recent.sort((a, b) => {
    const createdDateA = new Date(a.createdTime);
    const createdDateB = new Date(b.createdTime);
    return createdDateB - createdDateA;
  });
  return recent;
};

export const shortenAddress = (address = '', start = 5, chars = 5) =>
  address.length > 14 ? `${address.substring(0, start)} ... ${address.substring(address.length - chars)}` : address;

export const shortenString = (string = '', limit = 20) => (string.length > limit ? `${string.substring(0, limit)}...` : string);

export const shortenPrivateKey = (address = '', start = 5, chars = 5) =>
  `${address.substring(0, start)}****************${address.substring(address.length - chars)}`;

export const convertTowCharacters = (character) => `0${character}`.slice(-2);

export const roundNumber = (price, params = 6) => {
  const numb = parseFloat(price);
  return +numb.toFixed(params);
};

export const countDecimalPlaces = (value) => {
  if (Math.floor(value) === value) return 0;
  return value?.toString().split('.')[1]?.length || 0;
};

export const humanReadableNumber = (num, minimumFractionDigits = 2) =>
  parseFloat(num).toLocaleString('en-GB', { minimumFractionDigits }).replace(/\.0+$/, '');

export const BigNumberConverter = (value) => {
  const valueConverter = parseFloat(value);
  const result = new BigNumber(valueConverter).decimalPlaces(12, BigNumber.ROUND_DOWN).toString();
  return parseFloat(result);
};

export const getNumberWithValidDecimals = (value) => {
  const bn = new BigNumber(value);
  if (bn.isZero()) {
    return '0';
  }
  const formatted = bn.toFixed();
  let nonZeroCount = 0;
  const decimalIndex = formatted.indexOf('.');

  if (decimalIndex === -1) {
    return formatted;
  }
  for (let i = decimalIndex + 1; i < formatted.length; i += 1) {
    if (formatted[i] !== '0') {
      nonZeroCount += 1;
    }

    if (nonZeroCount >= 2) {
      return formatted.slice(0, i + 1);
    }
  }

  return formatted;
};

export const getCoingeckoIdFromContractAddress = (contractAddress) =>
  KNOWN_TOKENS[contractAddress] && KNOWN_TOKENS[contractAddress]?.coingeckoId && KNOWN_TOKENS[contractAddress]?.coingeckoId;

export const wait = (ms) => new Promise((rs) => setTimeout(rs, ms));

export const toFixedDown = (num, fixed) => {
  const re = new RegExp(`^-?\\d+(?:.\\d{0,${fixed || -1}})?`);
  return num.toString().match(re)[0];
};

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const idToPascalCase = (string) => string.replace(/[-_]+/g, ' ').replace(/\b(\w)/g, (char) => char.toUpperCase());
