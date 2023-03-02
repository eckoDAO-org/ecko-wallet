import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { AppThemeEnum } from 'src/themes';
import { NavigationHeader } from 'src/components/NavigationHeader';
import { Radio } from 'src/components/Radio';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';
import { Body } from '../Contact/views/style';

const Wrapper = styled.div`
  padding: 0 20px;
`;

const PageSelectTheme = () => {
  const history = useHistory();
  const { setTheme, selectedTheme } = useAppThemeContext();

  const goBack = () => {
    history.push('/setting');
  };

  return (
    <Wrapper>
      <NavigationHeader title="Contacts" onBack={goBack} />
      <Body style={{ marginBottom: 100 }}>
        {Object.keys(AppThemeEnum).map((t) => (
          <Radio isChecked={t === selectedTheme} label={t} onClick={() => setTheme(t)} style={{ marginBottom: 20 }} />
        ))}
      </Body>
    </Wrapper>
  );
};
export default PageSelectTheme;
