/* eslint-disable camelcase */

import { useQuery } from '@tanstack/react-query';

export type TickerPerformance = {
  ticker: string;
  open_time: number;
  close_time: number;
  open: number;
  close: number;
  low: number;
  high: number;
  volume: number;
  diff: number;
  transactionCount: number;
};

export type TokenPerformanceData = {
  tickers: TickerPerformance[];
};

export const useTokensPerformance = (interval: '1D' | '1W' | '1M' | '1Y' = '1D') =>
  useQuery({
    queryKey: ['performance-summary', interval],
    queryFn: async () => {
      const apiUrl = `${process.env.REACT_APP_ECKO_DEXTOOLS_API_URL}api/performance-summary?interval=${interval}`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data?.data as TokenPerformanceData;
    },
    initialData: { tickers: [] },
  });
