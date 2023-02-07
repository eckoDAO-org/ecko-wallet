const signing = require('./signing');
const derivation = require('./key-derivation');
const Module = require('../lib.js');

function kadenaMnemonicToRootKeypair(pwd, mnemonic) {
  const pwdBuf = Buffer.from(pwd);
  return derivation.mnemonicToRootKeypairV3(mnemonic, pwdBuf);
}

function kadenaChangePassword(key, oldPwd, newPwd) {
  const keyBuf = Buffer.from(key);
  const oldPwdBuf = Buffer.from(oldPwd);
  const newPwdBuf = Buffer.from(newPwd);
  const newPrv = derivation.changePassword(keyBuf, oldPwdBuf, newPwdBuf);
  return newPrv.buffer;
}

function kadenaGenMnemonic() {
  return derivation.genMnemonic();
}

function kadenaCheckMnemonic(mnem) {
  return derivation.checkMnemonic(mnem);
}

function kadenaGenKeypair(pwd, root, index) {
  const derivationScheme = 2;
  const rootBuffer = Buffer.from(root);
  const pwdBuf = Buffer.from(pwd);
  const xprv = derivation.derivePrivate(
    pwdBuf,
    rootBuffer,
    index,
    derivationScheme,
  );
  const xpub = new Buffer(xprv.slice(64, 96));
  return [xprv.buffer, xpub.buffer];
}

function kadenaSign(pwd, msg, xprv) {
  const xprvBuf = Buffer.from(xprv);
  const msgBuf = Buffer.from(msg);
  const pwdBuf = Buffer.from(pwd);
  return signing.sign(msgBuf, xprvBuf, pwdBuf).buffer;
}

function kadenaGetPublic(prvKey) {
  const prvBuffer = Buffer.from(prvKey);
  const xpub = new Buffer(prvBuffer.slice(64, 96));
  return xpub.buffer;
}

function kadenaVerify(msg, publicKey, sig) {
  const msgBuf = Buffer.from(msg);
  const pubKeyBuf = Buffer.from(publicKey);
  const sigBuf = Buffer.from(sig);
  return signing.verify(msgBuf, pubKeyBuf, sigBuf);
}

module.exports = {
  kadenaGenMnemonic,
  kadenaCheckMnemonic,
  kadenaMnemonicToRootKeypair,
  kadenaGenKeypair,
  kadenaGetPublic,
  kadenaSign,
  kadenaVerify,
  kadenaChangePassword,
};
