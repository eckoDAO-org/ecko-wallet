import { useEffect } from 'react';
import { hideLoading, showLoading } from 'src/stores/slices/extensions';
import { get } from 'lodash';
import { useCurrentWallet } from 'src/stores/slices/wallet/hooks';
import { useSelector } from 'react-redux';
import { setBalance } from 'src/stores/slices/wallet';
import Activities from 'src/components/Activities';
import { fetchLocal, getBalanceFromChainwebApiResponse } from '../../utils/chainweb';

const History = () => {
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const stateWallet = useCurrentWallet();

  useEffect(() => {
    if (stateWallet) {
      const { account, chainId } = stateWallet;
      const pactCode = `(coin.details "${account}")`;
      showLoading();
      fetchLocal(pactCode, selectedNetwork?.url, selectedNetwork?.networkId, chainId)
        .then((res) => {
          const status = get(res, 'result.status');
          if (status === 'success') {
            const newBalance = getBalanceFromChainwebApiResponse(res);
            setBalance(newBalance);
          } else {
            // eslint-disable-next-line no-console
            console.log('fetch error');
          }
          hideLoading();
        })
        .catch(() => {
          hideLoading();
        });
    }
  }, [stateWallet?.account, stateWallet?.chainId]);

  return (
    <Activities />
  );
};
export default History;
