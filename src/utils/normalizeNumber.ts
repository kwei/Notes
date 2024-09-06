export const normalizeNumber = (num: number) => {
  const res: string[] = [];
  const digitList = num.toString().split("").toReversed();
  let count = 0;
  digitList.forEach((digit) => {
    if (count !== 0 && count % 3 === 0 && isNumber(digit)) {
      res.push(",");
    }
    res.push(digit);
    count++;
  });
  return res.toReversed().join("");
};

function isNumber(val: string) {
  return /^\d+$/.test(val);
}
