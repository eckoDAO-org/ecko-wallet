import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getLocalDapps } from 'src/utils/storage';
import { CommonLabel, DivFlex, SecondaryLabel } from 'src/components';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { fetchLocal } from 'src/utils/chainweb';
import { hideLoading, showLoading } from 'src/stores/extensions';
import images from 'src/images';
import Button from 'src/components/Buttons';
import Transfer from './views/Transfer';
import { DappContentWrapper, DappLogo, DappWrapper } from '../Dapps/SignedCmd';

const NotFound = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

export const PageSendTransaction = styled.div`
  display: block;
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  bottom: 0;
  margin-bottom: 14px;
  overflow-y: scroll;
  overflow-x: hidden;
  &::-webkit-scrollbar {
    width: 2px;
  }

  &::-webkit-scrollbar-track {
    background: rgb(226, 226, 226);
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgb(54, 54, 54);
    border-radius: 2px;
  }
`;
const DappTransfer = () => {
  const [destinationAccount, setDestinationAccount] = useState<any>();
  const [loading, setLoading] = useState(true);
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  useEffect(() => {
    getLocalDapps(
      (dapps) => {
        const { account, chainId, sourceChainId } = dapps;
        const pactCode = `(coin.details "${account}")`;
        showLoading();
        fetchLocal(pactCode, selectedNetwork.url, selectedNetwork.networkId, chainId)
          .then((res) => {
            const status = get(res, 'result.status');
            const exist = status === 'success';
            const pred = get(res, 'result.data.guard.pred');
            const keys = get(res, 'result.data.guard.keys');
            const newDestinationAccount = exist
              ? {
                  accountName: account,
                  sourceChainId,
                  chainId,
                  pred,
                  keys,
                  domain: dapps.domain,
                  dappAmount: dapps.amount,
                }
              : {};
            setDestinationAccount(newDestinationAccount);
            hideLoading();
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
            hideLoading();
          });
      },
      () => {
        setLoading(false);
      },
    );
  }, []);
  return (
    <DappWrapper>
      {!loading && (
        <>
          <DappLogo src={images.eckoWalletLogoRounded} alt="logo" />
          <SecondaryLabel style={{ textAlign: 'center' }} uppercase>
            {selectedNetwork.networkId}
          </SecondaryLabel>
          <DappContentWrapper>
            {destinationAccount && destinationAccount.accountName ? (
              <>
                <DivFlex flexDirection="column" alignItems="center" justifyContent="center" margin="10px 0px">
                  <CommonLabel uppercase fontSize={24} fontWeight="bold" isSendCommonLabel>
                    Send Transaction
                  </CommonLabel>
                  <SecondaryLabel>{destinationAccount.domain}</SecondaryLabel>
                </DivFlex>
                <Transfer
                  isDappTransfer
                  sourceChainId={destinationAccount?.sourceChainId}
                  destinationAccount={destinationAccount}
                  fungibleToken={{ symbol: 'kda', contractAddress: 'coin' }}
                />
              </>
            ) : (
              <NotFound>
                <CommonLabel style={{ marginBottom: 20, marginTop: 40 }}>Destination account not found</CommonLabel>
                <Button variant="primary" size="full" label="Close" onClick={() => window.close()} />
              </NotFound>
            )}
          </DappContentWrapper>
        </>
      )}
    </DappWrapper>
  );
};

export default DappTransfer;
