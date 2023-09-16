import { getSelectedNetwork } from 'src/stores/extensions';
import { useAppSelector } from 'src/stores/hooks';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { fetchLocal } from 'src/utils/chainweb';

export const useExecPact = <Response = any>(pactCode: string, chainId: string) => {
  const selectedNetwork = useAppSelector(getSelectedNetwork);

  return async () => {
    const response = await fetchLocal(pactCode, selectedNetwork.url, selectedNetwork.networkId, chainId);
    return response.result as Response;
  };
};

export const useExecPactWithLocalAccount = <Response = any>(pactCode: string, chainId: string) => {
  const { account } = useCurrentWallet();
  pactCode = pactCode.replace('{{ACCOUNT}}', account);

  return useExecPact<Response>(pactCode, chainId);
};
