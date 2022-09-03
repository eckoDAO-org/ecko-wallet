export function getFloatPrecision(floatVal) {
  if (!floatVal || floatVal.toString().indexOf('.') < 0) {
    return 0;
  }
  return Math.abs(floatVal.toString().indexOf('.') - floatVal.toString().length + 1);
}
