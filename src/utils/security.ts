import SHA3 from 'crypto-js/sha3';
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import bcrypt from 'bcryptjs';

export const encryptPassword = (password): string => SHA3(password).toString();

export const encryptKey = (message, secret): string => AES.encrypt(message, secret).toString();

export const decryptKey = (message, secret): string => AES.decrypt(message, secret).toString(Utf8);

export const checkIsValidOldPassword = (passwordInput, storedPasswordHash) => bcrypt.compareSync(passwordInput, storedPasswordHash);
