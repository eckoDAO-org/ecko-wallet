import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NftCard } from 'src/components';
import { fetchLocal } from 'src/utils/chainweb';

const KadenaMiningClub = ({ id }: { id: string }) => {
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const [src, setSrc] = useState('');

  useEffect(() => {
    fetchLocal(`(free.kadena-mining-club.get-miner-details "${id}")`, selectedNetwork?.url, selectedNetwork?.networkId, 8).then((res) => {
      setSrc(`https://farm.kdamining.club/assets/${res?.result?.data?.uri}.jpeg`);
    });
  }, [id]);
  return <NftCard src={src} style={{ width: 70 }} />;
};

export default KadenaMiningClub;
