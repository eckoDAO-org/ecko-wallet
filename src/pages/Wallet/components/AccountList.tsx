import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { DivFlex } from 'src/components';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { shortenAddress } from 'src/utils';

const AccountListWrapper = styled(DivFlex)`
  margin: 10px 0;
  cursor: pointer;
`;

export const AccountList = ({ onSelectWallet }: { onSelectWallet: any }) => {
  const rootState = useSelector((state) => state);
  const { wallets } = rootState?.wallet;
  const { account: selectedAccount } = useCurrentWallet();

  const groupedAccountWallets = wallets.filter((value, index, self) => index === self.findIndex((t) => t.account === value.account));

  return (
    <div style={{ padding: '1rem' }}>
      {groupedAccountWallets.map((wallet) => {
        const isSelected = selectedAccount === wallet.account;
        return (
          <AccountListWrapper
            key={wallet.account}
            justifyContent="flex-start"
            alignItems="center"
            onClick={() => {
              onSelectWallet(wallet);
            }}
          >
            <Jazzicon
              diameter={24}
              seed={jsNumberForAddress(wallet?.account)}
              paperStyles={{ marginRight: 10, border: isSelected ? '2px solid #20264e' : null, padding: !isSelected ? 1 : 0 }}
            />
            <span style={{ fontWeight: isSelected ? 'bold' : 500, fontSize: 16 }}>{shortenAddress(wallet.account)}</span>
          </AccountListWrapper>
        );
      })}
    </div>
  );
};
