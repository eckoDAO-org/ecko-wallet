import React from 'react';
import styled from 'styled-components';
import { BUTTON_SIZE, BUTTON_TYPE } from 'src/utils/constant';

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'normal' | 'full';
  variant?: 'primary' | 'secondary' | 'grey' | 'disabled' | 'transparent' | 'remove' | 'inverted';
  label: React.ReactNode;
  onClick?: any;
  isDisabled?: boolean;
}

const ButtonWrapper = styled.button`
  ${(props) => (props.size === BUTTON_SIZE.NORMAL ? 'padding: 0 30px' : 'width: 100%')};
  height: 50px;
  background: ${(props) => props.background};
  border: ${(props) => props.border};
  color: ${(props) => props.color};
  border-radius: 30px;
  cursor: pointer;
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
  const { size = BUTTON_SIZE.NORMAL, variant = 'primary', label, onClick, isDisabled } = props;
  let buttonType = { color: 'white', background: '#20264E', border: 'none' };
  if (isDisabled) {
    buttonType = {
      color: '#20264E',
      background: 'white',
      border: '1px solid #20264E',
    };
  } else if (variant === BUTTON_TYPE.DISABLE) {
    buttonType = {
      color: '#20264E',
      background: 'white',
      border: '1px solid #20264E',
    };
  } else if (variant === BUTTON_TYPE.TRANSPARENT) {
    buttonType = {
      color: '#20264E',
      background: 'none',
      border: '1px solid #20264E',
    };
  } else if (variant === BUTTON_TYPE.REMOVE) {
    buttonType = {
      color: '#ffffff',
      background: '#FF9C9C',
      border: '1px solid #EEE6F3',
    };
  } else if (variant === 'secondary') {
    buttonType = {
      color: '#20264E',
      background: '#ECECF5',
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
    <ButtonWrapper onClick={onClick} size={size} color={buttonType.color} background={buttonType.background} border={buttonType.border} {...props}>
      {label}
    </ButtonWrapper>
  );
};

export default Button;
