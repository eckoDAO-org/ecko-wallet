import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { NftCard } from 'src/components';
import { fetchLocal } from 'src/utils/chainweb';

const KadenaMiningClubFoundersPass = ({ id }: { id: string }) => {
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const [src, setSrc] = useState('');

  useEffect(() => {
    fetchLocal(`(free.kadena-mining-club.get-founders-details "${id}")`, selectedNetwork?.url, selectedNetwork?.networkId, 8).then((res) => {
      console.log(`🚀 !!! ~ res:`, res);
      setSrc(`https://farm.kdamining.club/assets/${res?.result?.data?.uri}.jpeg`);
    });
  }, [id]);
  return <NftCard src="https://farm.kdamining.club/static/media/founders.b9d3a224b6ce8e690f53.webp" style={{ width: 70 }} />;
};

export default KadenaMiningClubFoundersPass;
