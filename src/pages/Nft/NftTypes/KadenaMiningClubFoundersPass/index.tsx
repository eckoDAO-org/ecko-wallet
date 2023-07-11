import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchLocal } from 'src/utils/chainweb';
import NftCard from '../NftCard';
import KMCFPModalContent from './ModalContent';

const KadenaMiningClubFoundersPass = ({ id }: { id: string }) => {
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const [data, setData] = useState({ id: null });

  useEffect(() => {
    fetchLocal(`(free.kadena-mining-club.get-founders-details "${id}")`, selectedNetwork?.url, selectedNetwork?.networkId, 8).then((res) => {
      setData({ id: res?.result?.data['old-nft-id'] ?? '' });
    });
  }, [id]);
  return (
    <NftCard
      src="https://farm.kdamining.club/static/media/founders.b9d3a224b6ce8e690f53.webp"
      label={`#${data?.id}`}
      modalTitle={`#${data?.id}`}
      modalContent={<KMCFPModalContent id={data?.id} />}
    />
  );
};

export default KadenaMiningClubFoundersPass;
