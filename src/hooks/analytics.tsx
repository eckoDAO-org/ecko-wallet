import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from 'src/stores/hooks';
import { getCurrentWallet } from 'src/stores/slices/wallet';
import { useSignMessage } from './wallet';

const API_URL = 'https://api.dexscan.ecko.finance/api/';

export type AccountBalanceChartResponse = {
  date: string;
  totalUsdValue: number;
}[];
export type AccountBalancheChartPoint = AccountBalanceChartResponse[number];

export const useAccountBalanceChart = (from: string, to: string) => {
  const currentWallet = useAppSelector(getCurrentWallet);

  return useQuery({
    queryKey: ['account-balance-chart', { account: currentWallet?.account }] as const,
    queryFn: async ({ queryKey }) => {
      const [, { account }] = queryKey;
      if (!account) {
        throw new Error('No account provided');
      }

      const accountId = currentWallet?.account;
      const apiUrl = `${API_URL}account-balance-chart?account=${accountId}&from=${from}&to=${to}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data as AccountBalancheChartPoint[];
    },
    initialData: [],
  });
};

const ADD_ME_MESSAGE = 'please-add-me-to-ecko-balance-tracking';

export const useTrackAccountBalance = () => {
  const currentWallet = useAppSelector(getCurrentWallet);
  const signMessage = useSignMessage();

  return async () => {
    const signature = await signMessage(ADD_ME_MESSAGE);

    if (!signature) {
      throw new Error('Cannot sign the track request');
    }

    const accountId = currentWallet?.account;
    const apiUrl = `${API_URL}account-balance-chart?account=${accountId}&from=2024-04-01&to=2024-04-30`;
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
