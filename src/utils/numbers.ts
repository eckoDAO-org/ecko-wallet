export function getFloatPrecision(floatVal: number) {
  if (!floatVal) return 0;

  const asString = floatVal.toString();
  const hasScientificNotation = asString.includes('e-');
  const separatorIndex = asString.indexOf('.');

  if (!hasScientificNotation && separatorIndex < 0) return 0;

  if (hasScientificNotation) {
    const exponent = asString.split('e-')[1];
    return +exponent;
  }

  return Math.abs(separatorIndex - asString.length + 1);
}
