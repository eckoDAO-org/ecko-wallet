import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { fetchTokenList } from 'src/utils/chainweb';

export const AssetsList = () => {
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  console.log('🚀 !!! ~ selectedNetwork', selectedNetwork);
  const { chainId } = useCurrentWallet();
  console.log('🚀 !!! ~ chainId', chainId);
  useEffect(() => {
    if (selectedNetwork && selectedNetwork.url) {
      fetchTokenList(selectedNetwork.url, selectedNetwork.networkId, chainId)
        .then((res) => {
          console.log('🚀 !!! ~ res', res);
        })
        .catch((err) => {
          console.log('🚀 !!! ~ err', err);
        });
    }
  }, [selectedNetwork, chainId]);
  return <div>assets</div>;
};
