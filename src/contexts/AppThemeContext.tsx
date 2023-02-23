import { createContext, useContext } from 'react';
import useLocalStorage from 'src/hooks/useLocalStorage';
import { ThemeProvider } from 'styled-components';

export enum AppThemeEnum {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

const themes = {
  [AppThemeEnum.LIGHT]: {
    mainColor: 'blue',
  },
  [AppThemeEnum.DARK]: {
    mainColor: 'red',
  },
};

interface AppThemeContextValue {
  theme: object;
  selectedTheme: AppThemeEnum | null;
  setTheme: (t: string) => any;
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

  const theme = selectedTheme ? themes[selectedTheme] : themes[AppThemeEnum.LIGHT];

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
