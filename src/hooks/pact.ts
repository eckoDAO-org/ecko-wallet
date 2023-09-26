import { getSelectedNetwork } from 'src/stores/extensions';
import { useAppSelector } from 'src/stores/hooks';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { fetchLocal } from 'src/utils/chainweb';

type ResponseWrapper <Response = any> = {
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
