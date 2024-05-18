/* eslint-disable camelcase */

import { useQuery } from '@tanstack/react-query';

export type DexPairToken = {
  name: string;
  address: string;
  img: string;
};

export type DexPair = {
  id: string;
  symbol: string;
  token0: DexPairToken;
  token1: DexPairToken;
  pair: string;
  price: number;
  pricePercChange1h: number;
  pricePercChange24h: number;
  pricePercChange7d: number;
  volume24h: number;
  totalSupply: number;
  circulatingSupply: number;
  allTimeHigh: number;
  allTimeLow: number;
};

export const useDexPairs = () =>
  useQuery({
    queryKey: ['pairs'],
    queryFn: async () => {
      const apiUrl = `${process.env.REACT_APP_ECKO_DEXTOOLS_API_URL}api/pairs`;
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      return data as DexPair[];
    },
    initialData: [],
  });
