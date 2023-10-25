import { createSelector } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../types';
import { Wallet } from '.';

export const useCurrentWallet = (): Wallet => {
  const selector = useMemo(
    () =>
      createSelector(
        (state: RootState) => state.wallet,
        (value) => value,
      ),
    [],
  );

  return useSelector((state) => selector(state));
};
