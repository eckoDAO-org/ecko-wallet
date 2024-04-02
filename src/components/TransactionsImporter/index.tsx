import { useAppSelector } from 'src/stores/hooks';
import { getSelectedNetwork } from 'src/stores/slices/extensions';
import MainnetTransactionsImporter from './Mainnet';

const TransactionsImporter = () => {
  const selectedNetwork = useAppSelector(getSelectedNetwork);

  if (selectedNetwork.networkId === 'mainnet01') {
    return <MainnetTransactionsImporter />;
  }

  return null;
};

export default TransactionsImporter;
