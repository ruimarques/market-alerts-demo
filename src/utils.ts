import moneyMath from 'money-math';

export const moneyDiv = (a: number, b: number) => {
  return moneyMath.div(moneyMath.floatToAmount(a), moneyMath.floatToAmount(b));
};

export const moneyMul = (a: number, b: number) => {
  return moneyMath.mul(moneyMath.floatToAmount(a), moneyMath.floatToAmount(b));
};

export const moneySub = (a: number, b: number) => {
  return moneyMath.subtract(
    moneyMath.floatToAmount(a),
    moneyMath.floatToAmount(b)
  );
};

export const percentDifference = (a: string, b: string) => {
  const difference = moneyMath.subtract(a, b);
  const aux = moneyMath.div(difference, b);
  const currentPercent = moneyMath.mul(aux, '100');
  return parseFloat(currentPercent) * 100;
};

// function financial(n: string, decimals: number) {
//   return Number.parseFloat(n).toFixed(2);
// }
