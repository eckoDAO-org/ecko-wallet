import { useHistory } from 'react-router-dom';
import { NavigationHeader } from 'src/components/NavigationHeader';
import { SettingBody } from 'src/pages/Setting/style';

export const CategoryList = ({ title }: { title: string }) => {
  const history = useHistory();
  return (
    <SettingBody>
      <div style={{ padding: '0 24px' }}>
        <NavigationHeader title={title} onBack={() => history.push('/nft')} />
      </div>
    </SettingBody>
  );
};
