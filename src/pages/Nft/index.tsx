import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { BaseTextInput } from 'src/baseComponent';
import { DivFlex, PrimaryLabel, SecondaryLabel } from 'src/components';
import { hideLoading, showLoading } from 'src/stores/extensions';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { useSelector } from 'react-redux';
import { setBalance } from 'src/stores/wallet';
import { fetchLocal, getBalanceFromChainwebApiResponse } from '../../utils/chainweb';
import nftData from './nft-data';

const Container = styled.div`
  padding: 24px;
  margin-bottom: 60px;
`;

const Nft = () => {
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const stateWallet = useCurrentWallet();

  const [account, setAccount] = useState('k:ab27dcf2217761df3724f3e2c24bc1abbbd667a1204b8ea1166c406dbd65e190');
  const [nftAccount, setNftAccount] = useState({});

  useEffect(() => {
    if (account && account.length === 66) {
      // const { account, chainId } = stateWallet;
      const pactCode = `(
        let*  (                
                ${nftData.map((nft) => `(${nft.pactAlias} (${nft.moduleName}.ids-owned-by "${account}"))`).join(' ')}
              )
              {
                ${nftData.map((nft) => `"${nft.pactAlias}": ${nft.pactAlias}`).join(',')}                
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
      <PrimaryLabel>NFT</PrimaryLabel>
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
            const nft = nftData?.find((n) => n.pactAlias === nftPactAlias);
            console.log(`🚀 !!! ~ nft:`, nft);
            return (
              nft && (
                <div style={{ marginTop: 30 }}>
                  <DivFlex>
                    <img src={nft.pic} style={{ width: 30 }} />
                    <SecondaryLabel uppercase>{nft.displayName}</SecondaryLabel>
                  </DivFlex>
                  <DivFlex justifyContent="flex-start" gap="10px">
                    {nftAccount[nftPactAlias]?.map((n) => {
                      console.log(n);
                      console.log(nftAccount[nftPactAlias]);
                      // return '';
                      return <img src={nft?.getPicById(n.id)} style={{ width: 60 }} />;
                    })}
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
