import styled from 'styled-components';
import BaseButton from './BaseButton';
import BaseTextInput from './BaseTextInput';
import BaseSelect from './BaseSelect';
import BaseModalSelect from './BaseModalSelect';

const InputError = styled.div<{ marginTop: string }>`
  color: red;
  font-size: 16px;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : '10px')};
  @media screen and (max-width: 480px) {
    font-size: 12px;
    margin-top: 5px;
  }
`;

// TODO: line-height should be in InputError in order to have the same style.
// However, all existing InputError should be tested to ensure to not break anything previously existing
const InputAlert = styled(InputError)`
  line-height: 20px;
  color: ${(props) => props.theme.alert.color};
  @media screen and (max-width: 480px) {
    line-height: 16px;
  }
`;

export { BaseButton, BaseTextInput, BaseSelect, BaseModalSelect, InputAlert, InputError };
