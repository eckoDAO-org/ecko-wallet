import { useMemo } from 'react';

type options = {
  value: any;
  label: any;
}

const useChainIdOptions = () :options[] => useMemo(() => {
  const chainNumber = 20;
  const chainsList: options[] = [];
  for (let i = 0; i < chainNumber; i += 1) {
    chainsList.push({ value: i, label: i });
  }
  return chainsList;
}, []);

export default useChainIdOptions;
