/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { NavigationHeader } from 'src/components/NavigationHeader';
import { useCurrentWallet } from 'src/stores/slices/wallet/hooks';
import { fetchLocal } from 'src/utils/chainweb';
import images from 'src/images';
import { idToPascalCase } from 'src/utils';
import { DivFlex, SecondaryLabel } from 'src/components';
import { MARMALADE_NG_CONTRACT, getGatewayUrlByIPFS, getTokensUris } from '../../nft-data';
import NftCard from '../NftCard';
import { NftContainer, NftPageContainer } from '../../style';
import { NGModalContent } from './ModalContent';

export interface NgTokenData {
  tokenId: string;
  metadata: any;
  src: string;
  number: number;
}

const MarmaladeNGCollectionDetails = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const id = params.get('id');
  const chainId = params.get('chainId');
  const name = params.get('name');
  const [ngNFTs, setNgNFTs] = useState<NgTokenData[]>([]);
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const history = useHistory();

  const stateWallet = useCurrentWallet();
  const account = stateWallet?.account;
  useEffect(() => {
    const fetchNGNftAsync = async () => {
      const ngNftsResponse = await fetchLocal(
        `(${MARMALADE_NG_CONTRACT}.ledger.list-balances "${account}")`,
        selectedNetwork?.url,
        selectedNetwork?.networkId,
        chainId,
      );
      const ownedTokens: string[] = ngNftsResponse?.result?.data?.map((t) => t.id) ?? [];
      const uriResponse = await fetchLocal(getTokensUris(ownedTokens), selectedNetwork?.url, selectedNetwork?.networkId, chainId);
      const uris: { tokenId: string; uri: string }[] = uriResponse?.result?.data ?? [];
      const collectionTokensResponse = await fetchLocal(
        `(${MARMALADE_NG_CONTRACT}.policy-collection.list-tokens-of-collection "${id}")`,
        selectedNetwork?.url,
        selectedNetwork?.networkId,
        chainId,
      );
      const ownedNFT: { tokenId: string; uri: string; index: number }[] = [];
      collectionTokensResponse?.result?.data.forEach((t: string, index) => {
        if (uris.find((tokenUser) => tokenUser.tokenId === t)) {
          ownedNFT.push({ tokenId: t, index, uri: uris.find((tokenUser) => tokenUser.tokenId === t)?.uri ?? '#' });
        }
      });
      const prepareNFTData: NgTokenData[] = [];
      for (const token of ownedNFT) {
        const uriDataResponse = await fetch(getGatewayUrlByIPFS(token.uri, chainId));
        const metadata = await uriDataResponse.json();
        prepareNFTData.push({
          tokenId: token.tokenId,
          number: token.index + 1,
          metadata,
          src: getGatewayUrlByIPFS(metadata.image, chainId),
        });
      }
      setNgNFTs(prepareNFTData);
    };

    fetchNGNftAsync();
  }, [account]);

  return (
    <NftPageContainer>
      <div style={{ padding: '0 24px' }}>
        <NavigationHeader title={idToPascalCase(name) ?? 'Go back'} onBack={() => history.push('/nft')} />
      </div>
      <NftContainer marginTop="40px">
        {ngNFTs?.length ? (
          ngNFTs?.map((token) => (
            <NftCard
              key={token.tokenId}
              src={token.src}
              srcFallback={images.iconMarmaladeNG}
              label={`#${token.number}`}
              modalTitle={`${name} #${token.number}`}
              modalContent={<NGModalContent token={token} />}
            />
          ))
        ) : (
          <DivFlex justifyContent="center" marginTop="80px" style={{ width: '100%' }}>
            <SecondaryLabel>No {idToPascalCase(name) ?? ''} NFT owned</SecondaryLabel>
          </DivFlex>
        )}
      </NftContainer>
    </NftPageContainer>
  );
};

export default MarmaladeNGCollectionDetails;
