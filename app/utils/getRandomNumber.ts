export default function getRandomNumber(
  max?: number,
  exceptions: number[] = []
) {
  if (max === undefined) return -1;
  if (max - 1 === exceptions.length) return -1;

  let num = Math.floor(Math.random() * max);

  if (exceptions.length > 0) {
    while (exceptions.includes(num)) {
      num = Math.floor(Math.random() * max);
    }
  }

  return num;
}
