const ARROW_LEFT_KEY_CODE = 37;
const ARROW_RIGHT_KEY_CODE = 39;
const DECIMAL_KEY_CODE = 190;
const DECIMAL_KEY_CODE_NUM_INPUT = 110;

const A_KEY_CODE = 65;
const V_KEY_CODE = 86;
const C_KEY_CODE = 67;

export const isNotValidASCIINumber = (keyCode, decimalRequired = false) => {
  const abnormalKeys = [
    ARROW_LEFT_KEY_CODE,
    ARROW_RIGHT_KEY_CODE,
    A_KEY_CODE,
    C_KEY_CODE,
    V_KEY_CODE,
  ];

  decimalRequired && abnormalKeys.push(...[DECIMAL_KEY_CODE, DECIMAL_KEY_CODE_NUM_INPUT]);

  if (abnormalKeys.indexOf(keyCode) >= 0) {
    return false;
  }

  if (keyCode === 229) {
    return true;
  }

  return keyCode > 31 && (keyCode < 48 || keyCode > 57) && (keyCode < 96 || keyCode > 105);
};

export const isPreventASCIICharacters = (key) => {
  const abnormalKeys = ['arrowleft', 'arrowright', 'control', 'a', 'c', 'v'];
  return abnormalKeys.indexOf(key.toLowerCase()) >= 0;
};
