import { useEffect, useState } from 'react';

function useSessionStorage<S>(key: string, initialValue: S): [S | null, (value: any) => void, () => Promise<S>, () => void] {
  const [storedValue, setStoredValue] = useState<S | null>(initialValue);

  useEffect(() => {
    try {
      (window as any).chrome.storage.session.get(key, (item) => {
        if (!item[key]) {
          (window as any).chrome.storage.session.set({ [key]: initialValue }, () => {
            setStoredValue(initialValue);
          });
        } else {
          setStoredValue(item[key]);
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('useSessionStorageError', error);
    }
  }, []);

  const getValueAsync = async (): Promise<S> =>
    new Promise((resolve, reject) => {
      try {
        (window as any).chrome.storage.session.get([key], (result) => {
          if (result[key] === undefined) {
            reject();
          } else {
            resolve(result[key]);
          }
        });
      } catch (error) {
        reject();
      }
    });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      (window as any).chrome.storage.session.set({ [key]: valueToStore }, () => {});
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('setValue useSessionStorageError', error);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(null);
      (window as any).chrome.storage.session.remove(key);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('removeValue useSessionStorageError', error);
    }
  };

  useEffect(() => {
    const onChange = (changes) => {
      if (changes[key] && changes[key].newValue !== undefined) {
        setStoredValue(changes[key].newValue);
      }
    };
    (window as any).chrome.storage.onChanged.addListener(onChange);
    return () => {
      (window as any).chrome.storage.onChanged.removeListener(onChange);
    };
  }, []);

  return [storedValue, setValue, getValueAsync, removeValue];
}

export default useSessionStorage;
