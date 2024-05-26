import { useQueries, useQuery } from '@tanstack/react-query';
import { useAppSelector } from 'src/stores/hooks';
import { getCurrentWallet } from 'src/stores/slices/wallet';
import { useSignMessage } from './wallet';

export type AccountBalanceChartResponse = {
  date: string;
  totalUsdValue: number;
}[];
export type AccountBalanceChartPoint = AccountBalanceChartResponse[number];

const accountBalanceChart = async (account: string, from: string, to: string) => {
  if (!account) {
    throw new Error('Account is not provided');
  }

  const apiUrl = `${process.env.REACT_APP_ECKO_DEXTOOLS_API_URL}api/account-balance-chart?account=${account}&from=${from}&to=${to}`;
  const response = await fetch(apiUrl);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  return data as AccountBalanceChartPoint[];
};

export const useCurrentAccountBalanceChart = (from: string, to: string) => {
  const currentWallet = useAppSelector(getCurrentWallet);

  return useAccountBalanceChart(currentWallet?.account || '', from, to);
};

export const useAccountBalanceChart = (account: string, from: string, to: string) =>
  useQuery({
    queryKey: ['account-balance-chart', { account, from, to }] as const,
    queryFn: () => accountBalanceChart(account, from, to),
    initialData: [],
  });

export const useAccountsBalanceChart = (accounts: string[], from: string, to: string): { data: AccountBalanceChartPoint[]; isFetching: boolean } => {
  const queries = useQueries({
    queries: accounts.map((account) => ({
      queryKey: ['account-balance-chart', { account, from, to }],
      queryFn: async () => accountBalanceChart(account, from, to),
      initialData: [],
    })),
  });

  const queriesData = queries.map((q) => q.data).filter((data) => Array.isArray(data)) as AccountBalanceChartResponse[];
  const mergedFlatData: AccountBalanceChartPoint[] = queriesData.flat();

  const summedData = mergedFlatData?.reduce<AccountBalanceChartPoint[]>((acc, item) => {
    const existingItem = acc.find((i) => i.date === item.date);
    if (existingItem) {
      existingItem.totalUsdValue += item.totalUsdValue;
    } else {
      acc.push({ date: item.date, totalUsdValue: item.totalUsdValue });
    }
    return acc;
  }, []);

  return { data: summedData, isFetching: queries.some((q) => q.isFetching) };
};

const ADD_ME_MESSAGE = 'please-add-me-to-ecko-balance-tracking';

export const useTrackAccountBalance = () => {
  const signMessage = useSignMessage();

  return async (accountId: string) => {
    const signature = await signMessage(ADD_ME_MESSAGE, accountId);

    if (!signature) {
      throw new Error('Cannot sign the track request');
    }

    const apiUrl = `${process.env.REACT_APP_ECKO_DEXTOOLS_API_URL}api/account-balance-chart?account=${accountId}&from=2024-04-01&to=2024-04-30`;
    const response = await fetch(apiUrl, {
      headers: {
        'x-signature': signature,
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return true;
  };
};
