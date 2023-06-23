import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { BaseTextInput } from 'src/baseComponent';
import { CommonLabel, DivFlex, PrimaryLabel, SecondaryLabel } from 'src/components';
import { hideLoading, showLoading } from 'src/stores/extensions';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { useSelector } from 'react-redux';
import { groupBy } from 'lodash';
import { setBalance } from 'src/stores/wallet';
import { fetchLocal, getBalanceFromChainwebApiResponse } from '../../utils/chainweb';
import nftList from './nft-data';

const Container = styled.div`
  padding: 24px;
  margin-bottom: 60px;
`;

const NftContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;
const NftCategoryCard = styled.div`
  flex-basis: 50%;
  flex-grow: 0;
  position: relative;
  display: flex;
  background: center url('${({ background }) => background}');
  img {
    width: 180px;
    height: 180px;
    border-radius: 10px;
  }
  span {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 0;
  }
`;

const Nft = () => {
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const stateWallet = useCurrentWallet();

  const [account, setAccount] = useState('k:cb5365b6cec5d8a056f4de8d1c280aaa01f8c3dadcff04e449fd5d1e8c7ced81');
  const [nftAccount, setNftAccount] = useState({});

  useEffect(() => {
    if ((account && account.length === 66) || account.includes('bank')) {
      const groupedByChain = groupBy(nftList, 'chainId');
      console.log(`🚀 !!! ~ groupedByChain:`, groupedByChain);

      Object.keys(groupedByChain).forEach((chainId) => {
        const pactCode = `(
          let*  (                
                  ${groupedByChain[chainId].map((nft) => `(${nft.pactAlias} ${nft.getAccountBalance(account)})`).join(' ')}
                )
                {
                  ${groupedByChain[chainId].map((nft) => `"${nft.pactAlias}": ${nft.pactAlias}`).join(',')}                
                }
          )`;
        console.log(`🚀 !!! ~ pactCode:`, pactCode);
        showLoading();
        fetchLocal(pactCode, selectedNetwork?.url, selectedNetwork?.networkId, chainId)
          .then((res) => {
            console.log(`🚀 !!! ~ res:`, res);
            if (res?.result?.status === 'success') {
              console.log(`SUCCESS`);
              setNftAccount((prev) => ({
                ...prev,
                ...res?.result?.data,
              }));
            } else {
              // eslint-disable-next-line no-console
              console.log('fetch error');
            }
            hideLoading();
          })
          .catch(() => {
            hideLoading();
          });
      });

      // const { account, chainId } = stateWallet;
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
      <PrimaryLabel>Your collectibles</PrimaryLabel>
      <NftContainer marginTop="40px">
        {Object.keys(nftAccount)?.length &&
          Object.keys(nftAccount)?.map((nftPactAlias) => {
            const nft = nftList?.find((n) => n.pactAlias === nftPactAlias);
            return (
              nft && (
                <NftCategoryCard>
                  <img src={nft.pic} />
                  <SecondaryLabel fontSize={12}>{nft.displayName}</SecondaryLabel>
                  {/* <DivFlex justifyContent="flex-start" gap="10px" flexFlow="wrap">
                    {nftAccount[nftPactAlias]?.length ? (
                      nftAccount[nftPactAlias]?.map((n) => React.createElement<any>(nft.component, { src: nft?.getPicById(n.id), id: n.id }))
                    ) : (
                      <CommonLabel>No {nft.displayName} NFT owned</CommonLabel>
                    )}
                  </DivFlex> */}
                </NftCategoryCard>
              )
            );
          })}
      </NftContainer>
    </Container>
  );
};
export default Nft;
