/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import images from 'src/images';
import { useHistory } from 'react-router-dom';
import { idToPascalCase } from 'src/utils';
import { useCurrentWallet } from 'src/stores/slices/wallet/hooks';
import { fetchLocal } from 'src/utils/chainweb';
import {
  MARMALADE_NG_CHAINS,
  MARMALADE_NG_CONTRACT,
  getCollectionsAndTokens,
  getGatewayUrlByIPFS,
  MARMALADE_NG_WHITELISTED_COLLECTIONS,
} from '../../nft-data';
import NftCard from '../NftCard';

export interface NgCollection {
  id: string;
  name: string;
  src: string;
  chainId: string | number;
  ownedCount: number;
}

const MarmaladeNGCollectionList = () => {
  const [ngCollections, setNgCollections] = useState<NgCollection[]>([]);
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const history = useHistory();

  const stateWallet = useCurrentWallet();
  const account = stateWallet?.account;
  useEffect(() => {
    const fetchNGNftAsync = async () => {
      const ownedTokens: string[] = [];
      const promises: any[] = [];
      if (account) {
        try {
          for (const chainId of MARMALADE_NG_CHAINS) {
            const ngNfts = await fetchLocal(
              `(${MARMALADE_NG_CONTRACT}.ledger.list-balances "${account}")`,
              selectedNetwork?.url,
              selectedNetwork?.networkId,
              chainId,
            );
            if (ngNfts?.result?.status === 'success') {
              ownedTokens.push(...(ngNfts?.result?.data?.map((t) => t.id) ?? []));
            }

            const collectionListResponse = await fetchLocal(
              `(${MARMALADE_NG_CONTRACT}.policy-collection.get-all-collections)`,
              selectedNetwork?.url,
              selectedNetwork?.networkId,
              chainId,
            );
            if (collectionListResponse?.result?.status === 'success') {
              const collectionList = collectionListResponse?.result?.data;
              const pactCode = getCollectionsAndTokens(collectionList.length);
              promises.push(fetchLocal(pactCode, selectedNetwork?.url, selectedNetwork?.networkId, chainId));
            }
          }
        } catch (err) {
          console.error('Error fetching NG NFTs', err);
        }

        Promise.all(promises)
          .then(async (resArray: any[]) => {
            for (const res of resArray) {
              if (res?.result?.status === 'success' && Object.values(res?.result?.data)?.length) {
                const collections: {
                  firstToken: string;
                  firstTokenURI: string;
                  id: string;
                  name: string;
                }[] = Object.values(res?.result?.data);
                const prepareNgCollections: NgCollection[] = [];
                for (const collection of collections) {
                  if (MARMALADE_NG_WHITELISTED_COLLECTIONS.includes(collection.id)) {
                    try {
                      let ownedCount = 0;
                      const allCollectionTokensResponse = await fetchLocal(
                        `(${MARMALADE_NG_CONTRACT}.policy-collection.list-tokens-of-collection "${collection.id}")`,
                        selectedNetwork?.url,
                        selectedNetwork?.networkId,
                        res?.metaData?.publicMeta?.chainId,
                      );
                      if (allCollectionTokensResponse?.result?.status === 'success') {
                        ownedCount = allCollectionTokensResponse?.result?.data?.filter((t) => ownedTokens.includes(t))?.length;
                      }
                      const uriDataResponse = await fetch(getGatewayUrlByIPFS(collection?.firstTokenURI, res?.metaData?.publicMeta?.chainId));
                      const uriData = await uriDataResponse.json();
                      const src = uriData?.image;

                      prepareNgCollections.push({
                        id: collection.id,
                        name: collection?.name,
                        src,
                        chainId: res?.metaData?.publicMeta?.chainId,
                        ownedCount,
                      });
                    } catch (err) {
                      console.error('Error fetching IPFS', err);
                    }
                  }
                }
                setNgCollections(prepareNgCollections);
                // eslint-disable-next-line no-console
                console.log('SUCCESS GET NG NFT DATA');
              } else {
                // eslint-disable-next-line no-console
                console.log('fetch error');
              }
            }
          })
          .catch((err) => {
            // eslint-disable-next-line no-console
            console.error('Error fetching NG NFTs', err);
          });
      }
    };
    fetchNGNftAsync();
  }, [account]);

  return (
    <>
      {ngCollections?.map((c) => (
        <NftCard
          key={c.name}
          src={getGatewayUrlByIPFS(c.src, c.chainId)}
          srcFallback={images.iconMarmaladeNG}
          label={`${idToPascalCase(c.name)} (${c.ownedCount})`}
          onClick={() => history.push(`/ng-details?id=${c.id}&name=${c.name}&chainId=${c.chainId}`)}
        />
      ))}
    </>
  );
};

export default MarmaladeNGCollectionList;
