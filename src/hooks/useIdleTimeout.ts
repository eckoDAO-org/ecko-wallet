/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import { useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

const useIdleTimeout = () => {
  const [lastActivity, setLastActivity] = useLocalStorage<number>('lastActivityTime', 0);

  const onSetLastActivity = () => {
    setLastActivity(new Date().getTime());
  };

  useEffect(() => {
    const events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];
    for (const i in events) {
      window.addEventListener(events[i], onSetLastActivity);
    }
    return () => {
      for (const i in events) {
        window.removeEventListener(events[i], onSetLastActivity);
      }
    };
  });

  return lastActivity;
};

export default useIdleTimeout;
