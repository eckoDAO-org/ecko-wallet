export const reduceBalance = (balance: number, prec = 6) => {
  if (balance % 1 === 0) {
    return balance;
  }

  const precision = 10 ** prec;
  return Math.trunc((balance * precision)) / precision;
};

export const getFloatPrecision = (floatVal: number) => {
  if (!floatVal || floatVal.toString().indexOf('.') < 0) {
    return 0;
  }

  return Math.abs(floatVal.toString().indexOf('.') - floatVal.toString().length + 1);
};
