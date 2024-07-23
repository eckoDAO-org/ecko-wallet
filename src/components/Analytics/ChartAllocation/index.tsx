import { forwardRef } from 'react';
import { useAccountBalanceContext } from 'src/contexts/AccountBalanceContext';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { IFungibleTokensByNetwork, LOCAL_DEFAULT_FUNGIBLE_TOKENS, LOCAL_KEY_FUNGIBLE_TOKENS } from 'src/pages/ImportToken';
import Chart from './Chart';

const ChartAllocation = forwardRef<HTMLDivElement>((_, ref) => {
  const accountBalance = useAccountBalanceContext();
  const [fungibleTokens] = useLocalStorage<IFungibleTokensByNetwork>(LOCAL_KEY_FUNGIBLE_TOKENS, LOCAL_DEFAULT_FUNGIBLE_TOKENS);

  if (!accountBalance.allAccountsBalanceUsd || !fungibleTokens) return null;

  return (
    <Chart
      allAccountsBalanceUsd={accountBalance.allAccountsBalanceUsd}
      fungibleTokens={fungibleTokens}
      ref={ref}
    />
  );
});

export default ChartAllocation;
