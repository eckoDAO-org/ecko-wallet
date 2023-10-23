/* eslint-disable no-restricted-syntax */
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DivFlex, PrimaryLabel, SecondaryLabel } from 'src/components';
import { hideLoading, showLoading } from 'src/stores/slices/extensions';
import { useCurrentWallet } from 'src/stores/slices/wallet/hooks';
import { useSelector } from 'react-redux';
import { groupBy, chunk } from 'lodash';
import { fetchLocal } from '../../utils/chainweb';
import nftList from './nft-data';
import { NftContainer, NftPageContainer } from './style';
import NftCard from './NftTypes/NftCard';

const Nft = () => {
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;

  const history = useHistory();

  const stateWallet = useCurrentWallet();
  const account = stateWallet?.account;

  const [nftAccount, setNftAccount] = useState({});

  useEffect(() => {
    const promises: any[] = [];
    if (account) {
      const groupedByChain = groupBy(nftList, 'chainId');

      Object.keys(groupedByChain).forEach((chainId) => {
        const chunked = chunk(groupedByChain[chainId], 2);
        chunked.forEach((chunkArray) => {
          const pactCode = `(
            let*  (                
                    ${chunkArray.map((nft) => `(${nft.pactAlias} ${nft.getAccountBalance(account)})`).join(' ')}
                  )
                  {
                    ${chunkArray.map((nft) => `"${nft.pactAlias}": ${nft.pactAlias}`).join(',')}                
                  }
            )`;
          showLoading();
          const promise = fetchLocal(pactCode, selectedNetwork?.url, selectedNetwork?.networkId, chainId);
          promises.push(promise);
        });
      });
      Promise.all(promises)
        .then((resArray: any[]) => {
          for (const res of resArray) {
            if (res?.result?.status === 'success') {
              // eslint-disable-next-line no-console
              console.log('SUCCESS GET NFT DATA');
              setNftAccount((prev) => ({
                ...prev,
                ...res?.result?.data,
              }));
            } else {
              // eslint-disable-next-line no-console
              console.log('fetch error');
            }
            hideLoading();
          }
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error('Error fetching NFTs', err);
          hideLoading();
        });
    }
  }, [account]);

  return (
    <NftPageContainer>
      <PrimaryLabel fontSize={18} uppercase>
        Your collectibles
      </PrimaryLabel>
      <NftContainer marginTop="40px">
        {Object.keys(nftAccount)?.length ? (
          Object.keys(nftAccount)
            ?.sort((a, b) => a.localeCompare(b))
            ?.map((nftPactAlias) => {
              const nft = nftList?.find((n) => n.pactAlias === nftPactAlias);
              return (
                nft && (
                  <NftCard
                    src={nft.pic}
                    label={
                      <>
                        {nft.displayName} <span>({nftAccount[nftPactAlias]?.length})</span>
                      </>
                    }
                    onClick={() => history.push(`/nft-details?category=${nftPactAlias}`)}
                  />
                )
              );
            })
        ) : (
          <DivFlex justifyContent="center" marginTop="80px" style={{ width: '100%' }}>
            <SecondaryLabel>No NFT owned</SecondaryLabel>
          </DivFlex>
        )}
      </NftContainer>
    </NftPageContainer>
  );
};
export default Nft;
