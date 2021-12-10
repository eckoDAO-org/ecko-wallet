import SHA3 from 'crypto-js/sha3';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

export const encryptPassword = (password) : string => SHA3(password).toString();

export const encryptKey = (key, secret) : string => AES.encrypt(key, secret).toString();

export const decryptKey = (key, secret) :string => AES.decrypt(key, secret).toString(Utf8);
