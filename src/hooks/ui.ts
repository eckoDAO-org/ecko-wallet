import { useHistory } from 'react-router-dom';
import { setActiveTab } from 'src/stores/extensions';
import { ACTIVE_TAB } from 'src/utils/constant';

export const useGoHome = () => {
  const history = useHistory();

  return () => {
    history.push('/');
    setActiveTab(ACTIVE_TAB.HOME);
  };
};
