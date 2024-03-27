import { useEffect } from 'react';
import styled from 'styled-components';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { hideLoading, showLoading } from 'src/stores/slices/extensions';
import { get } from 'lodash';
import { useCurrentWallet } from 'src/stores/slices/wallet/hooks';
import { useSelector } from 'react-redux';
import { setBalance } from 'src/stores/slices/wallet';
import { useIncomingTransactions } from 'src/hooks/transactions';
import { fetchLocal, getBalanceFromChainwebApiResponse } from '../../utils/chainweb';
import Activities from '../Wallet/views/Activities';

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
  const { data: transactions } = useIncomingTransactions();
  console.log(transactions);

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
        <Activities />
      </DivChild>
      <ModalCustom isOpen={false} title="Confirm Send Transaction" closeOnOverlayClick={false} />
    </Div>
  );
};
export default History;
