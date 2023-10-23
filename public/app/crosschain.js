/* eslint-disable no-await-in-loop */
import Pact from 'pact-lang-api';
import { getApiUrl, pollRequestKey, fetchSend } from '../../src/utils/chainweb';
import { delay } from '../../src/utils';

const getLocalStorageDataByKey = (key) =>
  new Promise((resolve, reject) => {
    chrome?.storage?.local?.get(key, (result) => {
      if (result) {
        resolve(result[key] || null);
      } else {
        reject();
      }
    });
  });

const getPendingCrossChainRequestKey = () => getLocalStorageDataByKey('pendingCrossChainRequestKeys');

let processingRequestKeys = [];

const checkForPendingCrossChainTx = async () => {
  try {
    const networks = await getLocalStorageDataByKey('networks');
    if (Array.isArray(Object.values(networks)) && Object.values(networks).length) {
      const pendingRequestKeys = await getPendingCrossChainRequestKey();
      for (let i = 0; i < pendingRequestKeys?.length; i += 1) {
        const { networkId, requestKey, targetChainId, sourceChainId } = pendingRequestKeys[i];
        const network = Object.values(networks).find((n) => n.networkId === networkId);
        if (network) {
          const nodeUrl = getApiUrl(network.url, networkId, sourceChainId);
          let spv = false;
          if (!processingRequestKeys.includes(requestKey)) {
            processingRequestKeys.push(requestKey);
            do {
              spv = await getTxSPV(requestKey, targetChainId, nodeUrl);
              await delay(10000);
            } while (!spv);
            // finish with spv
            await finishCrossChain(spv, targetChainId, requestKey, network);
          }
        }
      }
    }
  } catch (err) {
    console.log(`Error to check pending cross tx: ${err}`);
  }
};

const getTxSPV = (requestKey, targetChainId, url) =>
  new Promise((resolve, reject) => {
    const spvCmd = {
      requestKey,
      targetChainId,
    };
    Pact.fetch
      .spv(spvCmd, url)
      .then((res) => {
        if (res.includes('SPV target not reachable') || res.includes('Transaction hash not found')) {
          resolve(false);
        }
        if (res.includes(' ')) {
          resolve(false);
        }
        resolve(res);
      })
      .catch(() => {
        resolve(false);
      });
  });

const finishCrossChain = async (proof, targetChainId, requestKey, network) => {
  const finishRequestKey = await finishCrossChainWithProof(proof, requestKey, targetChainId, network);
  const nodeUrl = getApiUrl(network.url, network.networkId, targetChainId);
  const pollRes = await pollRequestKey(finishRequestKey, nodeUrl);
  if (pollRes) {
    const status = pollRes?.result?.status;
    if (status === 'success' || (pollRes?.result.error?.message && pollRes?.result.error?.message?.indexOf('resumePact: pact completed') > -1)) {
      removePendingCrossChain(requestKey);
    } else if (status === 'failure') {
      //   toast.error(<Toast type="fail" content="Finish cross transfer Fail" />);
    }
  } else {
    // toast.error(<Toast type="fail" content="Finish cross transfer Fail" />);
  }
};

const finishCrossChainWithProof = async (proof, requestKey, targetChainId, network) => {
  try {
    const settings = await getLocalStorageDataByKey('settingsV2');
    const pactId = requestKey.length === 44 ? requestKey.slice(0, 43) : requestKey;
    const host = getApiUrl(network.url, network.networkId, targetChainId);
    const gasStation = settings?.txSettings?.xChainGasStation || 'xwallet-xchain-gas';
    const m = Pact.lang.mkMeta(
      gasStation,
      targetChainId,
      settings?.txSettings?.xChainGasPrice ?? 1e-8,
      settings?.txSettings?.xChainGasLimit ?? 1100,
      Math.floor(new Date().getTime() / 1000) - 90,
      settings?.txSettings?.xChainTTL ?? 28800,
    );
    const cmd = {
      type: 'cont',
      keyPairs: [],
      pactId,
      rollback: false,
      step: 1,
      meta: m,
      proof,
      networkId: network.networkId,
    };
    const sendCommand = Pact.simple.cont.createCommand(
      cmd.keyPairs,
      undefined,
      cmd.step,
      cmd.pactId,
      cmd.rollback,
      undefined,
      cmd.meta,
      cmd.proof,
      cmd.networkId,
    );
    const data = await fetchSend(sendCommand, host);
    if (data.ok) {
      const res = await data.json();
      if (res && res.requestKeys) {
        return res.requestKeys[0];
      }
    }
    return false;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('finishCrossChainWithProof error', err);
    return false;
  }
};

const removePendingCrossChain = async (requestKey) => {
  const pendingRequestKeys = await getPendingCrossChainRequestKey();
  processingRequestKeys = processingRequestKeys.filter((rq) => rq !== requestKey);
  chrome?.storage?.local.set({
    pendingCrossChainRequestKeys: pendingRequestKeys?.filter((tx) => tx.requestKey !== requestKey),
  });
};

setInterval(() => {
  checkForPendingCrossChainTx();
}, 5000);
