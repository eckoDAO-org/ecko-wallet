import { useMemo } from 'react';
import { CHAIN_COUNT } from 'src/utils/constant';

type options = {
  value: any;
  label: any;
};

const useChainIdOptions = (): options[] =>
  useMemo(() => {
    const chainNumber = CHAIN_COUNT;
    const chainsList: options[] = [];
    for (let i = 0; i < chainNumber; i += 1) {
      chainsList.push({ value: i, label: `Chain ${i}` });
    }
    return chainsList;
  }, []);

export default useChainIdOptions;
