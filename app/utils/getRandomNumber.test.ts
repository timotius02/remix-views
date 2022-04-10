import getRandomNumber from "./getRandomNumber";

describe("getRandomNumber", () => {
  it("generates unique random numbers until max", () => {
    const exceptions: number[] = [];
    const max = 5;

    for (let i = 0; i < max; i++) {
      let value = getRandomNumber(max, exceptions);
      expect(value).toBeLessThan(max);
      expect(exceptions.includes(value)).toBe(false);
      exceptions.push(value);
    }
    expect(exceptions.sort()).toEqual([0, 1, 2, 3, 4]);
  });

  it("return -1s after exhausting all possibilities", () => {
    const exceptions: number[] = [];
    const max = 5;

    for (let i = 0; i < max; i++) {
      exceptions.push(getRandomNumber(max, exceptions));
    }

    let value = getRandomNumber(max, exceptions);
    expect(value).toBe(-1);
  });
});
