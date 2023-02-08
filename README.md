# eckoWallet - by Kaddex

## Installation instructions

### Install [emscripten](http://kripken.github.io/emscripten-site/docs/getting_started/downloads.html#installation-instructions) first (required for cardano-crypto.js lib, used by eckoWallet).

###

### Emscripten build example

```
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install 1.39.19
./emsdk activate 1.39.19
source ./emsdk_env.sh
```

### ecko-Wallet build

```
cp .env.example .env
npm install
npm run build
```

## Install extension

Go to chrome://extensions/ and check the box for Developer mode in the top right. Click the Load unpacked extension button and select the build folder
