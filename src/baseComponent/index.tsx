import styled from 'styled-components';
import BaseButton from './BaseButton';
import BaseTextInput from './BaseTextInput';
import BaseSelect from './BaseSelect';
import BaseModalSelect from './BaseModalSelect';

const InputError = styled.div`
  color: red;
  font-size: 16px;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : '10px')};
  @media screen and (max-width: 480px) {
    font-size: 12px;
    margin-top: 5px;
  }
`;

export { BaseButton, BaseTextInput, BaseSelect, BaseModalSelect, InputError };
