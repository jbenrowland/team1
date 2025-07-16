// __tests__/math.integration.test.js

function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

// Integration: Add two numbers, then multiply the result
function addThenMultiply(a, b, c) {
  const sum = add(a, b);
  return multiply(sum, c);
}

describe('addThenMultiply', () => {
  it('correctly adds then multiplies', () => {
    expect(addThenMultiply(2, 3, 4)).toBe(20); // (2 + 3) * 4 = 20
  });

  it('handles negative numbers', () => {
    expect(addThenMultiply(-1, -2, 3)).toBe(-9); // (-1 + -2) * 3 = -9
  });

  it('returns 0 if one input is 0', () => {
    expect(addThenMultiply(0, 0, 5)).toBe(0);
  });
});
