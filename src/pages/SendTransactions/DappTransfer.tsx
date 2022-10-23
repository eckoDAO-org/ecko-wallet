import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getLocalDapps } from 'src/utils/storage';
import { get } from 'lodash';
import { useSelector } from 'react-redux';
import { fetchLocal } from 'src/utils/chainweb';
import { hideLoading, showLoading } from 'src/stores/extensions';
import images from 'src/images';
import Button from 'src/components/Buttons';
import Transfer from './views/Transfer';
import { Body, TransactionWrapper, FormSend } from './styles';

const Wrapper = styled(TransactionWrapper)`
  padding: 0;
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 14px 20px;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.12);
`;
const HeaderWrapper = styled.div`
  font-size: 16px;
  margin-bottom: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
`;
const Logo = styled.img`
  width: 114px;
  height: 29px;
`;
const Domain = styled.div`
  word-break: break-word;
  padding: 16px 20px;
`;
const NotFound = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;
const Padding = styled.div`
  padding: 0 20px;
`;
const NotFoundImage = styled.img`
  width: 80px;
  height: 80px;
  margin: 110px auto 32px auto;
`;
const NotFoundDescription = styled.div`
  font-size: 18px;

  text-align: center;
  word-break: break-word;
  margin-bottom: 222px;
`;
const Title = styled.div`
  font-weight: 700;
  font-size: 24px;
  line-height: 25px;
  margin: 5px 0;
`;
const NetworkLabel = styled.div`
  padding: 10px 15px;
  text-align: center;
  background-color: #f2f2f2;
  border-radius: 20px;
  margin-left: auto;
  width: 70px;
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
        const { account, chainId } = dapps;
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
    <PageSendTransaction>
      {!loading && (
        <Wrapper>
          {destinationAccount && destinationAccount.domain && (
            <HeaderWrapper>
              <Header>
                <Logo alt="logo" src={images.logo} />
                <NetworkLabel>{selectedNetwork.name}</NetworkLabel>
              </Header>
              <Domain>{destinationAccount.domain}</Domain>
            </HeaderWrapper>
          )}
          <Body>
            <FormSend>
              {destinationAccount && destinationAccount.accountName ? (
                <>
                  <Padding>
                    <Title isSendTitle>Send Transaction</Title>
                  </Padding>
                  {/* TODO: check DAPP TRANSFER API (chainId param required) */}
                  <Transfer sourceChainId={0} destinationAccount={destinationAccount} fungibleToken={{ symbol: 'kda', contractAddress: 'coin' }} />
                </>
              ) : (
                <NotFound>
                  <NotFoundImage src={images.transfer.accountNotFound} />
                  <NotFoundDescription>Destination account not found</NotFoundDescription>
                  <Button label="Close" onClick={() => window.close()} />
                </NotFound>
              )}
            </FormSend>
          </Body>
        </Wrapper>
      )}
    </PageSendTransaction>
  );
};

export default DappTransfer;
