import { useEffect, useState } from 'react';
import NftCard from '../NftCard';
import MarmaladeV2ModalContent from './ModalContent';

const MarmaladeV2 = ({ data: { uri, auctionNumber } }: { data: { uri: string; auctionNumber: string } }) => {
  const [asyncData, setAsyncData] = useState<any>();

  useEffect(() => {
    if (uri) {
      const options = { method: 'GET' };
      fetch(uri, options)
        .then(async (response) => {
          const json = await response.json();
          setAsyncData(json);
        })
        .catch((err: any) => {
          // eslint-disable-next-line no-console
          console.error('MarmaladeV2 json error', err);
        });
    }
    return () => {
      setAsyncData(undefined);
    };
  }, [uri]);

  return (
    <NftCard
      src={asyncData?.image}
      label={`#${auctionNumber}`}
      modalTitle={`#${auctionNumber}`}
      modalContent={<MarmaladeV2ModalContent uriData={asyncData} auctionNumber={auctionNumber} />}
    />
  );
};

export default MarmaladeV2;
