import styled from 'styled-components';
import React, {
  memo,
} from 'react';

interface Props {
  title: String;
}

const BaseButton = memo((props: Props) => (
  <SDivRoot>
    <SText>{props.title}</SText>
  </SDivRoot>
));

const SDivRoot = styled.div`
  display: block;
  height: 44px;
  border-radius: 10px;
  justify-content: center;
`;

const SText = styled.title`
  display: block;
  color: #fff;
`;

export default BaseButton;
