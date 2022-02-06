import styled from 'styled-components';
import { BUTTON_SIZE, BUTTON_TYPE } from 'src/utils/constant';

type Props = {
  size?: string;
  type?: string;
  label: string;
  onClick: any;
  isDisabled?: boolean;
};

const ButtonWrapper = styled.button`
  ${(props) => (props.size === BUTTON_SIZE.NORMAL ? 'padding: 0 30px' : 'width: 100%')};
  height: 44px;
  background: ${(props) => props.background};
  border: ${(props) => props.border};
  color: ${(props) => props.color};
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  font-family: 'Play', sans-serif;
  :focus-visible {
    outline: none;
  }
`;

const Button = (props: Props) => {
  const { size = BUTTON_SIZE.NORMAL, type = BUTTON_TYPE.ACTIVE, label, onClick, isDisabled } = props;
  let buttonType = { color: 'white', background: '#461A57', border: 'none' };
  if (isDisabled) {
    buttonType = {
      color: '#461A57',
      background: 'white',
      border: '1px solid #461A57',
    };
  } else if (type === BUTTON_TYPE.DISABLE) {
    buttonType = {
      color: '#461A57',
      background: 'white',
      border: '1px solid #461A57',
    };
  } else if (type === BUTTON_TYPE.TRANSPARENT) {
    buttonType = {
      color: '#461A57',
      background: 'none',
      border: '1px solid #461A57',
    };
  } else if (type === BUTTON_TYPE.REMOVE) {
    buttonType = {
      color: '#ffffff',
      background: '#FF9C9C',
      border: '1px solid #EEE6F3',
    };
  }
  return (
    <ButtonWrapper onClick={onClick} size={size} color={buttonType.color} background={buttonType.background} border={buttonType.border}>
      {label}
    </ButtonWrapper>
  );
};

export default Button;
