import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchLocal } from 'src/utils/chainweb';
import NftCard from '../NftCard';
import KMCModalContent from './ModalContent';
import { NFTData } from '../../nft-data';

const KadenaMiningClub = ({ id, nftData }: { id: string; nftData: NFTData }) => {
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const [data, setData] = useState<any>({});

  useEffect(() => {
    fetchLocal(`(free.kadena-mining-club.get-miner-details "${id}")`, selectedNetwork?.url, selectedNetwork?.networkId, 8).then((res) => {
      setData({
        id: res?.result?.data['old-nft-id'] ?? '',
        uri: res?.result?.data?.uri,
        src: `https://farm.kdamining.club/assets/${res?.result?.data?.uri}.jpeg`,
      });
    });
  }, [id]);
  return (
    <NftCard
      src={data?.src}
      label={`#${data?.id}`}
      modalTitle={`#${data?.id}`}
      modalContent={<KMCModalContent id={id} nftData={nftData} uri={data?.uri} />}
    />
  );
};

export default KadenaMiningClub;
