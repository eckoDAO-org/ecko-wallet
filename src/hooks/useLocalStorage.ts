import { useEffect, useState } from 'react';

function useLocalStorage<S>(key: string, initialValue: S): [S|null, (value: any) => void, () => void] {
  const [storedValue, setStoredValue] = useState<S|null>(initialValue);

  useEffect(() => {
    try {
      (window as any).chrome.storage.local.get(key, (item) => {
        if (!item[key]) {
          (window as any).chrome.storage.local.set({ [key]: initialValue }, () => {
            setStoredValue(initialValue);
          });
        } else {
          setStoredValue(item[key]);
        }
      });
    } catch (error) {
      console.log('useLocalStorageError', error);
    }
  }, []);

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      (window as any).chrome.storage.local.set({ [key]: valueToStore }, () => {});
    } catch (error) {
      console.log('setValue useLocalStorageError', error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(null);
      (window as any).chrome.storage.local.remove(key);
    } catch (error) {
      console.log('removeValue useLocalStorageError', error);
    }
  };

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
