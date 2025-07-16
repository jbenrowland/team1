// __tests__/math.unit.test.js

function multiply(a, b) {
  return a * b;
}

describe('multiply', () => {
  it('multiplies two positive numbers', () => {
    expect(multiply(3, 4)).toBe(12);
  });

  it('returns 0 when multiplying by 0', () => {
    expect(multiply(5, 0)).toBe(0);
  });

  it('works with negative numbers', () => {
    expect(multiply(-2, 3)).toBe(-6);
  });
});
