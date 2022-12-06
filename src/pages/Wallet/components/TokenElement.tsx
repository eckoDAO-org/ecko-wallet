import React from 'react';

import { DivFlex, CommonLabel } from 'src/components';
import { humanReadableNumber } from 'src/utils';

export const TokenElement = ({ logo, name, balance, usdBalance, onClick }: TokenElementProps) => (
  <DivFlex className="token-element" justifyContent="space-between" style={{ padding: '10px 0', cursor: 'pointer' }} onClick={onClick}>
    <DivFlex>
      <img style={{ width: 41, height: 41, marginRight: 12 }} src={logo} alt={name} />
      <CommonLabel fontSize="14px" fontWeight={700} lineHeight="40px">
        {humanReadableNumber(balance, 5)} {name}
      </CommonLabel>
    </DivFlex>
    <CommonLabel fontWeight={500} fontSize="12px" color="#787b8e" lineHeight="40px">
      {humanReadableNumber(usdBalance, 2)} USD
    </CommonLabel>
  </DivFlex>
);

export interface TokenElementProps {
  name: string;
  contractAddress?: string;
  balance: number;
  usdBalance: number;
  logo?: string;
  isNonTransferable?: boolean;
  chainId?: number;
  onClick?: any;
}
