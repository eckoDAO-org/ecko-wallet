import { isNotValidASCIINumber, isPreventASCIICharacters } from '@Utils/input';

const InputCurrency = ({
  name, value, onChange, ...restProps
}) => (
  <input
    onKeyDown={(e) => isNotValidASCIINumber(e.keyCode, true) && e.preventDefault()}
    onKeyPress={(e) => isPreventASCIICharacters(e.key) && e.preventDefault()}
    name={name}
    type="number"
    maxLength={255}
    value={value}
    onChange={onChange}
    {...restProps}
  />
);

export default InputCurrency;
