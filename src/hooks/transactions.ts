import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from 'src/stores/hooks';
import { getCurrentWallet } from 'src/stores/slices/wallet';

const API_URL = 'https://api.dexscan.ecko.finance/api/';

export type IncomingTransactionsResponse = {
  amount: string;
  chainid: string;
  code: string;
  creationtime: string;
  direction: 'IN' | 'OUT';
  error: string;
  // eslint-disable-next-line camelcase
  from_acct: string;
  gas: string;
  gaslimit: string;
  gasprice: number;
  modulename: string;
  requestkey: string;
  status: 'SUCCESS' | 'ERROR';
  // eslint-disable-next-line camelcase
  to_acct: string;
  transactionType: 'TRANSFER' | 'SWAP';
}[];

export type IncomingTransaction = IncomingTransactionsResponse[number];

export const useIncomingTransactions = () => {
  const currentWallet = useAppSelector(getCurrentWallet);

  return useQuery({
    queryKey: ['incoming-transactions', { account: currentWallet?.account }] as const,
    queryFn: async ({ queryKey }) => {
      const [, { account }] = queryKey;
      if (!account) {
        throw new Error('No account provided');
      }

      const accountId = currentWallet?.account;
      const limit = 50;
      const skip = 0;
      const apiUrl = `${API_URL}account-transaction-history?account=${accountId}&limit=${limit}&skip=${skip}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data as IncomingTransaction[];
    },
    initialData: [],
  });
};
