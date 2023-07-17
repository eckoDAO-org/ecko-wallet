/* eslint-disable camelcase */
/* eslint-disable jsx-a11y/media-has-caption */
import { useEffect, useState } from 'react';
import { CommonLabel, DivFlex, SecondaryLabel } from 'src/components';
import { NftTableRow } from '../../style';

const KMCModalContent = ({ uri }: { uri: string }) => {
  const [nftData, setNftData] = useState<any>();
  const [errorMessage, setErrorMessage] = useState<string>();

  const src = `https://farm.kdamining.club/assets/${nftData?.imageName || `${uri}.mp4`}`;

  useEffect(() => {
    if (uri) {
      setErrorMessage('');
      const options = { method: 'GET' };
      fetch(`https://farm.kdamining.club/assets/${uri}.json`, options)
        .then(async (response) => {
          const json = await response.json();
          setNftData(json);
        })
        .catch((err: any) => {
          console.log('KMC Miners detail error', err);
          setErrorMessage('Unable to fetch NFT data, try again later');
        });
    }
    return () => {
      setNftData(undefined);
    };
  }, [uri]);

  return (
    <DivFlex flexDirection="column" alignItems="center" padding="20px">
      {src && nftData && (
        <video key={src} width="300" height="300" autoPlay loop style={{ borderRadius: 10 }}>
          <source src={src} type="video/mp4" />
        </video>
      )}
      {errorMessage ? (
        <SecondaryLabel>{errorMessage}</SecondaryLabel>
      ) : (
        nftData?.attributes?.map(({ trait_type, value }: any) => (
          <NftTableRow>
            <SecondaryLabel>{trait_type}</SecondaryLabel>
            <CommonLabel>{value}</CommonLabel>
          </NftTableRow>
        ))
      )}
    </DivFlex>
  );
};

export default KMCModalContent;
