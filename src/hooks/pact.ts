import Pact from 'pact-lang-api';
import { bufferToHex, useLedgerContext } from 'src/contexts/LedgerContext';
import { getSelectedNetwork } from 'src/stores/extensions';
import { useAppSelector } from 'src/stores/hooks';
import { AccountType } from 'src/stores/wallet';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { getTimestamp } from 'src/utils';
import { fetchLocal, getApiUrl, getSignatureFromHash, pollRequestKey } from 'src/utils/chainweb';
import { CONFIG, ECKO_WALLET_SEND_TX_NONCE } from 'src/utils/config';

export type ResponseWrapper<Response = any> =
  | {
      status: 'success';
      data: Response;
    }
  | {
      status: 'failure';
      error: {
        message: string;
      };
    };

export const useExecPact = <Response = any>(chainId: string) => {
  const selectedNetwork = useAppSelector(getSelectedNetwork);

  return async (pactCode: string) => {
    const response = await fetchLocal(pactCode, selectedNetwork.url, selectedNetwork.networkId, chainId);
    return response.result as ResponseWrapper<Response>;
  };
};

export const useExecPreparedPact = <Response = any>(pactCode: string, chainId: string) => {
  const execPact = useExecPact<Response>(chainId);
  return async () => execPact(pactCode);
};

export const useExecPactWithLocalAccount = <Response = any>(pactCode: string, chainId: string) => {
  const { account } = useCurrentWallet();
  pactCode = pactCode.replace('{{ACCOUNT}}', account);

  return useExecPreparedPact<Response>(pactCode, chainId);
};

export const usePoolRequestKey = <Response = any>() => {
  const selectedNetwork = useAppSelector(getSelectedNetwork);

  return async (requestKey: string, chainId: string) => {
    const url = getApiUrl(selectedNetwork.url, selectedNetwork.networkId, chainId);
    const response = await pollRequestKey(requestKey, url);
    const result = response?.result || response;

    return result as ResponseWrapper<Response>;
  };
};

export interface Capability {
  role: string;
  description: string;
  cap: {
    name: string;
    args: object;
  };
}

export type Signer = {
  pubKey: string;
  clist?: Capability[];
};

export interface Command {
  networkId: string;
  payload: {
    exec: {
      data: Record<string, any>;
      code: string;
    };
  };
  signers: Signer[];
  meta: {
    creationTime: number;
    ttl: number;
    gasLimit: number;
    chainId: string;
    gasPrice: number;
    sender: string;
  };
  nonce: string;
}

export interface ExecCommandResult {
  request: Command;
  response: {
    requestKeys: string[];
  };
}

export const payGasCap: Capability = Pact.lang.mkCap('gas', 'pay gas', 'coin.GAS');

export const useExecCommand = () => {
  const selectedNetwork = useAppSelector(getSelectedNetwork);
  const { account, publicKey, secretKey, type } = useCurrentWallet();
  const { signHash } = useLedgerContext();

  return async (pactCode: string, CHAIN_ID: string, capabilities: Capability[] = [], envData: object = {}) => {
    const gasLimit = 10000;
    const gasPrice = 0.000001;
    const caps = capabilities.map((cap) => cap.cap);
    const meta = Pact.lang.mkMeta(account, CHAIN_ID, gasPrice, gasLimit, getTimestamp(), CONFIG.X_CHAIN_TTL);
    const nonce = `"${ECKO_WALLET_SEND_TX_NONCE}-${new Date().toISOString()}"`;
    const keyPairs: Record<string, any> = {
      publicKey,
      clist: caps,
    };

    if (secretKey.length === 64) {
      keyPairs.secretKey = secretKey;
    }

    const cmd = Pact.api.prepareExecCmd(keyPairs, nonce, pactCode, envData, meta, selectedNetwork.networkId);

    if (secretKey.length > 64) {
      const signature = getSignatureFromHash(cmd.hash, secretKey);
      cmd.sigs = [{ sig: signature }];
    } else if (type === AccountType.LEDGER) {
      const signHashResult = await signHash(cmd.hash);
      const sigs = [{ sig: bufferToHex(signHashResult?.signature) }];
      cmd.sigs = sigs;
    }

    const url = getApiUrl(selectedNetwork.url, selectedNetwork.networkId, CHAIN_ID);

    const response = await Pact.wallet.sendSigned(cmd, url);
    const parsedCmd = JSON.parse(cmd.cmd);

    return {
      request: parsedCmd as Command,
      response,
    } as ExecCommandResult;
  };
};
