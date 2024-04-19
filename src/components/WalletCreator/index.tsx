import { useAppSelector } from 'src/stores/hooks';
import { getAccount } from 'src/stores/slices/wallet';
import Creator from './Creator';

const WalletCreator = () => {
  const account = useAppSelector(getAccount);

  if (!account) {
    return null;
  }

  return <Creator />;
};

export default WalletCreator;
