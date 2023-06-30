import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { BaseTextInput } from 'src/baseComponent';
import { DivFlex, PrimaryLabel, SecondaryLabel } from 'src/components';
import { hideLoading, showLoading } from 'src/stores/extensions';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { useSelector } from 'react-redux';
import { groupBy } from 'lodash';
import { fetchLocal } from '../../utils/chainweb';
import nftList from './nft-data';
import { NftContainer, NftPageContainer } from './style';
import NftCard from './NftTypes/NftCard';

const Nft = () => {
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;

  const history = useHistory();

  const stateWallet = useCurrentWallet();
  // const account = stateWallet?.account;

  // TODO: set wallet account after testing
  const [account, setAccount] = useState('k:4496205014a34f909ce27dd6a7417477f1a5a2df9ac3fcb77feb9c23a7251e1a');
  const [nftAccount, setNftAccount] = useState({});

  useEffect(() => {
    if ((account && account.length === 66) || account.includes('bank')) {
      const groupedByChain = groupBy(nftList, 'chainId');

      Object.keys(groupedByChain).forEach((chainId) => {
        const pactCode = `(
          let*  (                
                  ${groupedByChain[chainId].map((nft) => `(${nft.pactAlias} ${nft.getAccountBalance(account)})`).join(' ')}
                )
                {
                  ${groupedByChain[chainId].map((nft) => `"${nft.pactAlias}": ${nft.pactAlias}`).join(',')}                
                }
          )`;
        showLoading();
        fetchLocal(pactCode, selectedNetwork?.url, selectedNetwork?.networkId, chainId)
          .then((res) => {
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
          })
          .catch(() => {
            hideLoading();
          });
      });

      // const { account, chainId } = stateWallet;
    }
  }, [account]);

  return (
    <NftPageContainer>
      <BaseTextInput
        inputProps={{
          value: account,
        }}
        title=""
        onChange={(e) => {
          setAccount(e.target.value);
        }}
      />
      <PrimaryLabel fontSize={18} uppercase>
        Your collectibles
      </PrimaryLabel>
      <NftContainer marginTop="40px">
        {Object.keys(nftAccount)?.length ? (
          Object.keys(nftAccount)?.map((nftPactAlias) => {
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
                  // TODO: remove account after testing
                  onClick={() => history.push(`/nft-details?category=${nftPactAlias}&account=${account}`)}
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
