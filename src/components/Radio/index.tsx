import { CSSProperties } from 'react';
import images from 'src/images';
import styled from 'styled-components';
import { DivFlex } from '..';

const RadioSpan = styled.span`
  font-weight: 500;
  font-size: 16px;
`;

const RadioIcon = styled.img`
  margin-right: 10px;
`;

const RadioWrapper = styled(DivFlex)`
  cursor: pointer;
`;

export const Radio = ({ isChecked, label, style, onClick }: RadioProps) => (
  <RadioWrapper onClick={onClick} alignItems="center" style={style}>
    <RadioIcon src={isChecked ? images.radioChecked : images.radioUnchecked} style={{ marginRight: 10 }} /> <RadioSpan>{label}</RadioSpan>
  </RadioWrapper>
);

interface RadioProps {
  isChecked?: boolean;
  label: string;
  onClick?: any;
  style?: CSSProperties;
}
