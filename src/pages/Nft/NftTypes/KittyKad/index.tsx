import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchLocal } from 'src/utils/chainweb';
import NftCard from '../NftCard';
// import KMCModalContent from './ModalContent';

const KittyKad = ({ id }: { id: string }) => {
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  // const [data, setData] = useState<any>({});

  useEffect(() => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        imageIds: [id],
      }),
    };
    fetch('https://kitty-kads-nft-image-backend.herokuapp.com/getImagesForIds', options)
      .then(async (response) => {
        const json = await response.json();
        console.log(`🚀 ~ json:`, json);
        // setNftData(json);
      })
      .catch((err: any) => {
        console.log('KittyKad detail error', err);
        // setErrorMessage('Unable to fetch NFT data, try again later');
      });
  }, [id]);
  return <>kittykad</>;
  // return <NftCard src={data?.src} label={`#${data?.id}`} />;
};

export default KittyKad;
