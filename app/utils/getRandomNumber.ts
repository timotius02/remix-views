export default function getRandomNumber(
  max: number,
  exceptions: number[] = []
) {
  if (max === exceptions.length) return -1;

  let num = Math.floor(Math.random() * max);
  let maxCount = 10;

  if (exceptions.length > 0) {
    while (exceptions.includes(num)) {
      num = Math.floor(Math.random() * max);
      console.log(num);
      maxCount--;
      if (!maxCount) {
        console.log(max, exceptions);
        break;
      }
    }
  }

  return num;
}
