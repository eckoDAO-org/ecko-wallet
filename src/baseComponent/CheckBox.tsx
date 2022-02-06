import styled from 'styled-components';
import React, { useState } from 'react';

const LabelContainer = styled.label`
  position: relative;
  margin-bottom: 25px;
  cursor: pointer;
  display: flex;
  min-height: 44px;
  align-items: flex-start;
  line-height: 26px;
  font-size: 16px;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  @media screen and (max-width: 480px) {
    margin-bottom: 12px;
    font-size: 14px;
  }
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
`;

const CheckMark = styled.span`
  height: 24px;
  width: 24px;
  flex-shrink: 0;
  border: 1px solid #c2c2c2;
  background-color: ${(props) => (props.isChecked ? '#461A57' : 'none')};
  margin-right: 10px;
  &:after {
    margin-left: 8px;
    width: 6px;
    height: 15px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    content: '';
    display: ${(props) => (props.isChecked ? 'block' : 'none')};
  }
`;

interface Props {
  isChecked: boolean;
  onChange: any;
  label: React.ReactNode;
}

const CheckBox = ({ isChecked, onChange, label }: Props) => {
  const [isCbChecked, setIsCbChecked] = useState(isChecked);
  const onCheckboxClick = () => {
    onChange(!isCbChecked);
    setIsCbChecked(!isCbChecked);
  };

  return (
    <LabelContainer>
      <CheckMark isChecked={isCbChecked} />
      {label}
      <input defaultChecked={isCbChecked} type="checkbox" onClick={onCheckboxClick} />
    </LabelContainer>
  );
};
export default CheckBox;
