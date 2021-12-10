import { useMemo, useState } from 'react';

/**
 * Return array of [value, setTrue, setFalse], you can call setTrue and setFalse without setup useCallback
 */
const useBoolean = (initialValue: boolean = false): [boolean, () => void, () => void] => {
  const [value, setValue] = useState(false);

  const { setTrue, setFalse } = useMemo(() => ({
    setTrue: () => setValue(true),
    setFalse: () => setValue(false),
  }), []);

  return [value, setTrue, setFalse];
};

export default useBoolean;
