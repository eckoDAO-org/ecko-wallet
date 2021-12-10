import { createSelector } from '@reduxjs/toolkit';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../types';

export const useCurrentWallet = (): any => {
  const selector = useMemo(
    () => createSelector(
      (state: RootState) => state.wallet,
      (value) => value,
    ),
    [],
  );

  return useSelector((state) => selector(state));
};
