import { useSelector } from 'react-redux';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { JazzAccount } from 'src/components/JazzAccount';

export const AccountList = ({ onSelectWallet }: { onSelectWallet: any }) => {
  const rootState = useSelector((state) => state);
  const { wallets } = rootState?.wallet;
  const { account: selectedAccount } = useCurrentWallet();

  const groupedAccountWallets = wallets.filter((value, index, self) => index === self.findIndex((t) => t.account === value.account));

  return (
    <div style={{ padding: '1rem' }}>
      {groupedAccountWallets.map((wallet) => (
        <JazzAccount
          key={wallet.account}
          isSelected={selectedAccount === wallet.account}
          account={wallet.account}
          onClick={() => {
            onSelectWallet(wallet);
          }}
        />
      ))}
    </div>
  );
};
