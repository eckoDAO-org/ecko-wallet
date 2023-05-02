import React from 'react';
import styled from 'styled-components';
import { BUTTON_SIZE, BUTTON_TYPE } from 'src/utils/constant';
import { useAppThemeContext } from 'src/contexts/AppThemeContext';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'normal' | 'full';
  variant?: 'primary' | 'secondary' | 'grey' | 'disabled' | 'transparent' | 'remove' | 'inverted';
  label: React.ReactNode;
  onClick?: any;
  isDisabled?: boolean;
}

const ButtonWrapper = styled.button<{ size?: string; background?: string; border?: string; svgColor?: string; color?: string, cursor?: string }>`
  ${(props) => (props.size === BUTTON_SIZE.NORMAL ? 'padding: 0 30px' : 'width: 100%')};
  height: 50px;
  background: ${(props) => props.background};
  border: ${(props) => props.border};
  color: ${(props) => props.color};
  border-radius: 30px;
  cursor: ${(props) => props.cursor || 'pointer'};
  font-family: 'Montserrat';
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  :focus-visible {
    outline: none;
  }
  svg {
    path {
      fill: ${(props) => props.svgColor};
    }
  }
`;

const Button = (props: Props) => {
  const { theme } = useAppThemeContext();

  const { size = BUTTON_SIZE.NORMAL, variant = 'primary', label, onClick, isDisabled } = props;
  let buttonType: any = { color: 'white', background: theme.button?.primary, border: 'none' };
  if (isDisabled) {
    buttonType = {
      color: theme.button?.primary,
      background: 'white',
      border: `1px solid ${theme.button?.primary}`,
      cursor: 'default',
    };
  } else if (variant === BUTTON_TYPE.DISABLE) {
    buttonType = {
      color: theme.button?.primary,
      background: 'white',
      border: `1px solid ${theme.button?.primary}`,
      cursor: 'default',
    };
  } else if (variant === BUTTON_TYPE.TRANSPARENT) {
    buttonType = {
      color: theme.button?.primary,
      background: 'none',
      border: `1px solid ${theme.button?.primary}`,
    };
  } else if (variant === BUTTON_TYPE.REMOVE) {
    buttonType = {
      color: '#ffffff',
      background: '#FF9C9C',
      border: '1px solid #EEE6F3',
    };
  } else if (variant === 'secondary') {
    buttonType = {
      color: theme.text?.primary,
      background: theme.button?.secondary,
      border: 'none',
    };
  } else if (variant === 'grey') {
    buttonType = {
      color: '#787B8E',
      background: '#ECECF5',
      border: 'none',
    };
  }
  return (
    <ButtonWrapper disabled={isDisabled} onClick={onClick} size={size} color={buttonType.color} background={buttonType.background} border={buttonType.border} cursor={buttonType.cursor} {...props}>
      {label}
    </ButtonWrapper>
  );
};

export default Button;
