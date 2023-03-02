export enum AppThemeEnum {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export interface IPrimarySecondary {
  primary: string;
  secondary: string;
  disabled?: string;
}
export interface IAppTheme {
  isDark?: boolean;
  background?: string;
  border?: string;
  text?: IPrimarySecondary;
  button?: IPrimarySecondary;
  footer?: IPrimarySecondary;
  modalBackground?: string;
  input?: { color?: string; background?: string; placeholder?: string };
  selectMenu?: { color?: string; background?: string; selectedColor?: string; selectedBackground?: string };
  transferIcon?: { border: string; background: string };
  alert?: { color: string; background: string };
  boxShadow?: string;
  iconBackground?: string;
  iconSettingsBackground?: string;
}

export const appThemes = {
  [AppThemeEnum.LIGHT]: {
    isDark: false,
    background: '#FFFFFF',
    text: {
      primary: '#000000',
      secondary: '#787b8e',
      disabled: '#46484a',
    },
    button: {
      primary: '#24224c',
      secondary: '#ecebf4',
    },
    input: {
      color: '#000',
      background: '#f6f6fa',
      placeholder: '#898d90',
    },
    footer: {
      primary: '#24224c',
      secondary: '#787b8e',
      disabled: '#dadada',
    },
    selectMenu: {
      color: '#24224c',
      background: '#fff',
      selectedColor: '#fff',
      selectedBackground: '#898d90',
    },
    transferIcon: {
      border: '#dfdfed',
      background: '#fff',
    },
    alert: { color: '#ce8900', background: '#fff7e6' },
    modalBackground: '#fff',
    border: '#dfdfed',
    iconBackground: '#fff',
    iconSettingsBackground: '#24224c',
    boxShadow: `background: white;
    box-shadow: rgb(31 31 31 / 1%) 0px 167px 67px, rgb(31 31 31 / 3%) 0px 94px 57px, rgb(31 31 31 / 6%) 0px 42px 42px, rgb(31 31 31 / 6%) 0px 10px 23px, rgb(31 31 31 / 7%) 0px 0px 0px;`,
  },
  [AppThemeEnum.DARK]: {
    isDark: true,
    background: '#1f1f1f',
    text: {
      primary: '#f6f7f9',
      secondary: '#a1a6ab',
      disabled: '#46484a',
    },
    button: {
      primary: '#3d387f',
      secondary: '#606265',
    },
    input: {
      color: '#fff',
      background: '#5f6265',
      placeholder: '#969798',
    },
    footer: {
      primary: '#ffffff',
      secondary: '#7f8488',
      disabled: '#46484a',
    },
    selectMenu: {
      color: '#fff',
      background: '#5f6265',
      selectedColor: '#5f6265',
      selectedBackground: '#fff',
    },
    transferIcon: {
      border: '#363636',
      background: '#363636',
    },
    alert: { color: '#ffba33', background: '#362f21' },
    border: '#313232',
    modalBackground: '#1f1f1f',
    iconBackground: '#2a2a2a',
    iconSettingsBackground: '#2a2a2a',
    boxShadow: `background: rgba(31, 31, 31, 1) 0% 0% no-repeat padding-box;
    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.16);
    opacity: 1;`,
  },
};
