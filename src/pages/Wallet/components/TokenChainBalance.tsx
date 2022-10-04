import React from 'react';
import { useHistory } from 'react-router-dom';
import { IconButton } from 'src/components/IconButton';
import { ReactComponent as ArrowSendIcon } from 'src/images/arrow-send.svg';
import { DivFlex, CommonLabel } from 'src/components';
import { humanReadableNumber } from 'src/utils';
import { TokenElementProps } from './TokenElement';

export const TokenChainBalance = ({ name, balance, usdBalance, chainId }: TokenElementProps) => {
  const history = useHistory();
  return (
    <DivFlex justifyContent="space-between" style={{ padding: '10px 0', cursor: 'pointer' }} onClick={() => history.push(`/token-menu?coin=${name}`)}>
      <DivFlex flexDirection="column">
        <CommonLabel fontSize="14px" fontWeight={700}>
          {humanReadableNumber(balance, 5)} {name}
        </CommonLabel>
        <CommonLabel fontSize="14px">$ {humanReadableNumber(usdBalance, 2)}</CommonLabel>
      </DivFlex>
      <DivFlex justifyContent="flex-end" alignItems="center">
        <CommonLabel fontSize="14px" fontWeight={700}>
          CHAIN {chainId}
        </CommonLabel>
        <IconButton
          className="path-fill-white"
          onClick={() => {}}
          svgComponent={<ArrowSendIcon />}
          style={{ backgroundColor: '#20264E', marginLeft: 5 }}
        />
      </DivFlex>
    </DivFlex>
  );
};
