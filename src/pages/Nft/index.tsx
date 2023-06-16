import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { BaseTextInput } from 'src/baseComponent';
import { CommonLabel, DivFlex, PrimaryLabel, SecondaryLabel } from 'src/components';
import { hideLoading, showLoading } from 'src/stores/extensions';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { useSelector } from 'react-redux';
import { setBalance } from 'src/stores/wallet';
import { fetchLocal, getBalanceFromChainwebApiResponse } from '../../utils/chainweb';
import arkades from './nft-data';

const Container = styled.div`
  padding: 24px;
  margin-bottom: 60px;
`;

const NftCard = styled.img`
  border-radius: 14px;
`;

const Nft = () => {
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const stateWallet = useCurrentWallet();

  const [account, setAccount] = useState('k:3652c9b85f7f03b5af3caa664db3951ac3a7d91f7ce79a6cd7d2084abc700917');
  const [nftAccount, setNftAccount] = useState({});

  useEffect(() => {
    if (account && account.length === 66) {
      // const { account, chainId } = stateWallet;
      const pactCode = `(
        let*  (                
                ${arkades.map((nft) => `(${nft.pactAlias} (${nft.moduleName}.ids-owned-by "${account}"))`).join(' ')}
              )
              {
                ${arkades.map((nft) => `"${nft.pactAlias}": ${nft.pactAlias}`).join(',')}                
              }
        )`;
      console.log(`🚀 !!! ~ pactCode:`, pactCode);
      showLoading();
      fetchLocal(pactCode, selectedNetwork?.url, selectedNetwork?.networkId, 1)
        .then((res) => {
          console.log(`🚀 !!! ~ res:`, res);
          if (res?.result?.status === 'success') {
            console.log(`SUCCESS`);
            setNftAccount(res?.result?.data);
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
  }, [account]);

  return (
    <Container>
      <BaseTextInput
        inputProps={{
          value: account,
        }}
        title="Account"
        onChange={(e) => {
          setAccount(e.target.value);
        }}
      />
      <DivFlex marginTop="40px" flexDirection="column">
        {Object.keys(nftAccount)?.length &&
          Object.keys(nftAccount)?.map((nftPactAlias) => {
            const nft = arkades?.find((n) => n.pactAlias === nftPactAlias);
            console.log(`🚀 !!! ~ nft:`, nft);
            return (
              nft && (
                <div style={{ marginTop: 30 }}>
                  <DivFlex alignItems="center" margin="10px 0px">
                    <NftCard src={nft.pic} style={{ width: 40, marginRight: 10 }} />
                    <SecondaryLabel uppercase>{nft.displayName}</SecondaryLabel>
                  </DivFlex>
                  <DivFlex justifyContent="flex-start" gap="10px" flexFlow="wrap">
                    {nftAccount[nftPactAlias]?.length ? (
                      nftAccount[nftPactAlias]?.map((n) => <NftCard src={nft?.getPicById(n.id)} style={{ width: 70 }} />)
                    ) : (
                      <CommonLabel>No {nft.displayName} NFT owned</CommonLabel>
                    )}
                  </DivFlex>
                </div>
              )
            );
          })}
      </DivFlex>
    </Container>
  );
};
export default Nft;
