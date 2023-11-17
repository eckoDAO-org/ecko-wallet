import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import ModalCustom from 'src/components/Modal/ModalCustom';
import { hideLoading, showLoading } from 'src/stores/slices/extensions';
import { get } from 'lodash';
import { useCurrentWallet } from 'src/stores/slices/wallet/hooks';
import { useSelector } from 'react-redux';
import { setBalance } from 'src/stores/slices/wallet';
import { NavigationHeader } from 'src/components/NavigationHeader';
import { BodyFullScreen, PageFullScreen } from 'src/components/Page';
import { fetchLocal, getBalanceFromChainwebApiResponse } from '../../utils/chainweb';
import Activities from '../Wallet/views/Activities';

const Header = styled.div`
  padding: 0 20px;
`;

const History = () => {
  const rootState = useSelector((state) => state);
  const { selectedNetwork } = rootState.extensions;
  const stateWallet = useCurrentWallet();
  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };

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
    <PageFullScreen>
      <Header>
        <NavigationHeader title="History" onBack={goBack} />
      </Header>
      <BodyFullScreen>
        <Activities />
      </BodyFullScreen>
      <ModalCustom isOpen={false} title="Confirm Send Transaction" closeOnOverlayClick={false} />
    </PageFullScreen>
  );
};
export default History;
