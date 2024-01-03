import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchLocal } from 'src/utils/chainweb';
import NftCard from '../NftCard';
import { NFTData } from '../../nft-data';
import MarmaladeV2ModalContent from './ModalContent';

const MarmaladeV2 = ({ uri }: { uri: string }) => {
  const [asyncData, setAsyncData] = useState<any>();
  console.log(`🚀 !!! ~ asyncData:`, asyncData);
  const [errorMessage, setErrorMessage] = useState<string>();

  useEffect(() => {
    if (uri) {
      setErrorMessage('');
      const options = { method: 'GET' };
      fetch(uri, options)
        .then(async (response) => {
          const json = await response.json();
          setAsyncData(json);
        })
        .catch((err: any) => {
          // eslint-disable-next-line no-console
          console.error('MarmaladeV2 json error', err);
          setErrorMessage('Unable to fetch NFT data, try again later');
        });
    }
    return () => {
      setAsyncData(undefined);
    };
  }, [uri]);

  return (
    <NftCard
      src={asyncData?.image}
      label={asyncData?.name}
      modalTitle={asyncData?.name}
      modalContent={<MarmaladeV2ModalContent uriData={asyncData} />}
    />
  );
};

export default MarmaladeV2;
