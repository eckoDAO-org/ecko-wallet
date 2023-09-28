import { getSelectedNetwork } from 'src/stores/extensions';
import { useAppSelector } from 'src/stores/hooks';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { fetchLocal, getApiUrl, pollRequestKey } from 'src/utils/chainweb';

export type ResponseWrapper <Response = any> = {
  status: 'success';
  data: Response;
} | {
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
