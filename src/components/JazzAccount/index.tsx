import Jazzicon, { jsNumberForAddress } from 'react-jazzicon';
import { shortenAddress } from 'src/utils';
import styled from 'styled-components';
import { DivFlex } from '..';

const AccountListWrapper = styled(DivFlex)`
  margin: 10px 0;
  cursor: pointer;
`;

export const JazzAccount = ({ account, isSelected, onClick }: { account: string; isSelected?: boolean; onClick: any }) => (
  <AccountListWrapper key={account} justifyContent="flex-start" alignItems="center" onClick={onClick}>
    <Jazzicon
      diameter={24}
      seed={jsNumberForAddress(account)}
      paperStyles={{ marginRight: 10, border: isSelected ? '2px solid #20264e' : null, padding: !isSelected ? 1 : 0 }}
    />
    <span style={{ fontWeight: isSelected ? 'bold' : 500, fontSize: 16 }}>{shortenAddress(account)}</span>
  </AccountListWrapper>
);
