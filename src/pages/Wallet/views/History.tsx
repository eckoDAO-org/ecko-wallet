import { useState, useEffect } from 'react';
import styled from 'styled-components';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { hideLoading, showLoading } from 'src/stores/extensions';
import { get } from 'lodash';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { useSelector } from 'react-redux';
import { setBalance } from 'src/stores/wallet';
import { fetchLocal, getBalanceFromChainwebApiResponse } from '../../../utils/chainweb';
import TabWallet from './TabContent';

const Div = styled.div`
  margin: auto 0;
  font-size: ${(props) => props.fontSize};
  margin-right: ${(props) => props.marginRight};
  text-align: ${(props) => props.textAlign};
  color: ${(props) => props.color};
  margin-left: ${(props) => props.marginLeft};
  font-weight: ${(props) => props.fontWeight};
`;
const DivChild = styled.div`
  font-size: ${(props) => props.fontSize};
  color: ${(props) => props.color};
  margin-top: ${(props) => props.marginTop};
  margin-left: ${(props) => props.marginLeft};
  margin-right: ${(props) => props.marginRight};
  margin-bottom: ${(props) => props.marginBottom};
  font-weight: ${(props) => props.fontWeight};
`;

const History = () => {
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const stateWallet = useCurrentWallet();

  useEffect(() => {
    if (stateWallet) {
      const { account, chainId } = stateWallet;
      const pactCode = `(coin.details "${account}")`;
      showLoading();
      fetchLocal(pactCode, selectedNetwork?.url, selectedNetwork?.networkId, chainId)
        .then((res) => {
          const status = get(res, 'result.status');
          if (status === 'success') {
            const newBalance = getBalanceFromChainwebApiResponse(res);
            setBalance(newBalance);
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
  }, [stateWallet?.account, stateWallet?.chainId]);

  return (
    <Div>
      <DivChild marginTop="20px" marginBottom="200px">
        <TabWallet />
      </DivChild>
      <ModalCustom isOpen={false} title="Confirm Send Transaction" closeOnOverlayClick={false} />
    </Div>
  );
};
export default History;
