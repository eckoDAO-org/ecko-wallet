import { useAppSelector } from 'src/stores/hooks';
import { getSelectedNetwork } from 'src/stores/slices/extensions';
import MainnetIncomingTransactionsImporter from './Mainnet';

const IncomingTransactionsImporter = () => {
  const selectedNetwork = useAppSelector(getSelectedNetwork);

  if (selectedNetwork.networkId === 'mainnet01') {
    return <MainnetIncomingTransactionsImporter />;
  }

  return null;
};

export default IncomingTransactionsImporter;
