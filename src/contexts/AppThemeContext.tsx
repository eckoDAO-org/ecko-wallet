import { createContext, useContext } from 'react';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { AppThemeEnum, appThemes, IAppTheme } from 'src/themes';
import { ThemeProvider } from 'styled-components';

interface AppThemeContextValue {
  theme: IAppTheme;
  selectedTheme: AppThemeEnum | null;
  setTheme: (t: string) => void;
}

const defaultAppThemeValue: AppThemeContextValue = {
  theme: {},
  selectedTheme: AppThemeEnum.LIGHT,
  setTheme: () => {},
};

export const AppThemeContext = createContext<AppThemeContextValue>(defaultAppThemeValue);

export const AppThemeProvider = ({ children }: any) => {
  const [selectedTheme, setSelectedTheme] = useLocalStorage<AppThemeEnum | null>('APP_THEME', AppThemeEnum.LIGHT);

  const setTheme = (theme: string) => setSelectedTheme(theme);

  const theme = selectedTheme ? appThemes[selectedTheme] : appThemes[AppThemeEnum.LIGHT];

  return (
    <AppThemeContext.Provider
      value={{
        selectedTheme,
        theme,
        setTheme,
      }}
    >
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppThemeContext.Provider>
  );
};

export const AppThemeConsumer = AppThemeContext.Consumer;

export function useAppThemeContext() {
  return useContext(AppThemeContext);
}
