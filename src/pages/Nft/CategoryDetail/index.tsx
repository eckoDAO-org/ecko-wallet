import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchLocal } from 'src/utils/chainweb';
import { DivFlex, SecondaryLabel } from 'src/components';
import { useHistory, useLocation } from 'react-router-dom';
import { hideLoading, showLoading } from 'src/stores/slices/extensions';
import { NavigationHeader } from 'src/components/NavigationHeader';
import nftList, { NFTTypes } from '../nft-data';
import { NftContainer, NftPageContainer } from '../style';
import ArkadeNFT from '../NftTypes/Arkade';
import KadenaMiningClub from '../NftTypes/KadenaMiningClub';
import KadenaMiningClubFoundersPass from '../NftTypes/KadenaMiningClubFoundersPass';
import WizardsArena from '../NftTypes/WizardsArena';
import MarmaladeV2 from '../NftTypes/MarmaladeV2';

const CategoryDetail = () => {
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  // const { account } = rootState?.wallet;
  const account = 'k:d0ecb992f042b2918f8116c841496553887c8d09e469f8d4ac4a6b17d61527c8';
  const history = useHistory();
  const { search } = useLocation();
  const [nftUUIDs, setNftUUIDs] = useState<string[]>([]);

  const params = new URLSearchParams(search);
  const category = params.get('category');
  const nftData = nftList.find((n) => n.pactAlias === category);

  useEffect(() => {
    if (account && category) {
      showLoading();
      fetchLocal(nftData?.getAccountBalance(account), selectedNetwork?.url, selectedNetwork?.networkId, nftData?.chainId)
        .then((res) => {
          console.log(`🚀 ~ res:`, res);
          if (res?.result?.status === 'success') {
            if (nftData?.type === NFTTypes.MARMALADE_V2) {
              const uris: string[] = [];
              Object.keys(res.result.data).forEach((tokenKey) => {
                if (res.result.data[tokenKey]?.accountBalance > 0) {
                  uris.push(res.result.data[tokenKey]?.uri);
                }
              });
              setNftUUIDs(uris);
            } else {
              const ids = res.result.data?.map((nft) => nft?.id);
              setNftUUIDs(ids);
            }
          } else {
            // eslint-disable-next-line no-console
            console.log('fetch error');
          }
          hideLoading();
        })
        .catch(() => {
          hideLoading();
        });
    }
  }, [category, account]);

  const renderNFT = (id: string) => {
    switch (nftData?.type) {
      case NFTTypes.ARKADE: {
        return <ArkadeNFT id={id} nftData={nftData} />;
      }
      case NFTTypes.KADENA_MINING_CLUB: {
        return <KadenaMiningClub id={id} nftData={nftData} />;
      }
      case NFTTypes.KADENA_MINING_CLUB_FOUNDER_PASS: {
        return <KadenaMiningClubFoundersPass id={id} />;
      }
      case NFTTypes.KITTY_KAD: {
        return <ArkadeNFT id={id} nftData={nftData} cardStyle={{ imageRendering: 'pixelated' }} />;
      }
      case NFTTypes.WIZ_ARENA: {
        return <WizardsArena id={id} nftData={nftData} cardStyle={{ imageRendering: 'pixelated' }} />;
      }
      case NFTTypes.MARMALADE_V2: {
        return <MarmaladeV2 uri={id} />;
      }
      default: {
        return null;
      }
    }
  };

  return (
    <NftPageContainer>
      <div style={{ padding: '0 24px' }}>
        <NavigationHeader title={nftData?.displayName ?? 'Go back'} onBack={() => history.push('/nft')} />
      </div>
      <NftContainer marginTop="40px">
        {nftUUIDs?.length ? (
          nftUUIDs?.map((id) => renderNFT(id))
        ) : (
          <DivFlex justifyContent="center" marginTop="80px" style={{ width: '100%' }}>
            <SecondaryLabel>No {nftData?.displayName ?? ''} NFT owned</SecondaryLabel>
          </DivFlex>
        )}
      </NftContainer>
    </NftPageContainer>
  );
};

export default CategoryDetail;
