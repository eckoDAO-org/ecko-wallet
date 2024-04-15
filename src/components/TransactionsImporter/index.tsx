import { useAppSelector } from 'src/stores/hooks';
import { getSelectedNetwork } from 'src/stores/slices/extensions';
import { getAccount } from 'src/stores/slices/wallet';
import MainnetTransactionsImporter from './Mainnet';

const TransactionsImporter = () => {
  const selectedNetwork = useAppSelector(getSelectedNetwork);
  const account = useAppSelector(getAccount);

  if (!account) {
    return null;
  }

  if (selectedNetwork.networkId === 'mainnet01') {
    return <MainnetTransactionsImporter />;
  }

  return null;
};

export default TransactionsImporter;
