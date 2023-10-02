import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useCurrentWallet } from 'src/stores/wallet/hooks';
import { JazzAccount } from 'src/components/JazzAccount';
import { shortenAddress } from 'src/utils';
import { DivFlex, SecondaryLabel } from 'src/components';

const AccountLabel = styled.span`
  font-weight: ${(props) => (props.isSelected ? 'bold' : 500)};
  font-size: 16px;
  color: ${($props) => $props.theme?.text?.primary || '#000000'};
`;

export const AccountList = ({ onSelectWallet }: { onSelectWallet: any }) => {
  const rootState = useSelector((state) => state);
  const { wallets } = rootState?.wallet;
  const { account: selectedAccount } = useCurrentWallet();

  const groupedAccountWallets = wallets.filter((value, index, self) => index === self.findIndex((t) => t.account === value.account));

  return (
    <div style={{ padding: '1rem' }}>
      {groupedAccountWallets.map((wallet, i) => (
        <JazzAccount
          key={wallet.account}
          type={wallet.type}
          isSelected={selectedAccount === wallet.account}
          renderAccount={(account) => (
            <DivFlex flexDirection="column">
              <AccountLabel isSelected={selectedAccount === wallet.account}>{wallet.alias || `Account ${i + 1}`}</AccountLabel>
              <SecondaryLabel>{shortenAddress(account)}</SecondaryLabel>
            </DivFlex>
          )}
          account={wallet.account}
          onClick={() => {
            onSelectWallet(wallet);
          }}
        />
      ))}
    </div>
  );
};
