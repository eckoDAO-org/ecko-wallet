import crypto from "crypto";
import { TOTP } from "otpauth";

export const generateSharedKey = (length = 64) => {
  let buffer = crypto.randomBytes(length * 2).toString('hex');
  buffer = buffer.replace(/[^a-z]/gi, '');
  return buffer.length >= 32 ? buffer.slice(0, length) : generateSharedKey();
};

export const initTOTP = (_secret?: string) => {
  const secret = _secret || generateSharedKey();

  const totp = new TOTP({
    issuer: "eckoWALLET",
    label: "eckoWALLET",
    algorithm: "SHA1",
    digits: 6,
    period: 30,
    secret,
  });

  return totp;
};
