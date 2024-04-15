import { useEffect } from 'react';
import { useCreateFirstAccountAvailable } from 'src/hooks/wallet';
import { useAppSelector } from 'src/stores/hooks';
import { getWallets } from 'src/stores/slices/wallet';

const Creator = () => {
  const wallets = useAppSelector(getWallets);
  const createAccount = useCreateFirstAccountAvailable();

  useEffect(() => {
    if (wallets.length > 0) {
      return;
    }

    createAccount();
  }, [wallets]);

  return null;
};

export default Creator;
