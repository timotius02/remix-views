export default function getRandomNumber(max?: number, exception?: number) {
  if (max === undefined) return -1;

  let num = Math.floor(Math.random() * max);

  if (exception !== undefined) {
    while (num === exception) {
      num = Math.floor(Math.random() * max);
    }
  }

  return num;
}
