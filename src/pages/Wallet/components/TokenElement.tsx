import { DivFlex, CommonLabel } from 'src/components';
import Spinner from 'src/components/Spinner';
import { humanReadableNumber } from 'src/utils';

export const TokenElement = ({ logo, name, balance, isLoadingBalances, usdBalance, onClick }: TokenElementProps) => (
  <DivFlex className="token-element" justifyContent="space-between" style={{ padding: '10px 0', cursor: 'pointer' }} onClick={onClick}>
    <DivFlex>
      <img style={{ width: 41, height: 41, marginRight: 12 }} src={logo} alt={name} />
      <CommonLabel fontSize="14px" fontWeight={700} lineHeight="40px">
        {humanReadableNumber(balance, 5)} {name}
      </CommonLabel>
    </DivFlex>
    <CommonLabel fontWeight={500} fontSize="12px" color="#787b8e" lineHeight="40px">
      {isLoadingBalances ? <Spinner size={10} color="#787b8e" weight={2} /> : `${humanReadableNumber(usdBalance, 2)} USD`}
    </CommonLabel>
  </DivFlex>
);

export interface TokenElementProps {
  name: string;
  contractAddress?: string;
  balance: number;
  usdBalance: number;
  logo?: string;
  isLoadingBalances?: boolean;
  isNonTransferable?: boolean;
  chainId?: number;
  onClick?: any;
}
