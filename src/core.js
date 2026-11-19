/**
 * src/core.js — Zero-Float Q16.16 Fixed-Point Arithmetic & Seeded PRNG
 *
 * Signed-off-by: Borealis Serenity Hedling <chguard-sentinel@vaked.dev>
 */

export const Q_SHIFT = 16n;
export const Q_ONE = 65536; // 1.0 in Q16.16

export function toQ16(num) {
  if (!Number.isFinite(num)) {
    throw new RangeError(`Non-finite input rejected at Q16.16 boundary: ${num}`);
  }
  return Math.round(num * Q_ONE) | 0;
}

export function fromQ16(q) {
  return (q | 0) / Q_ONE;
}

export function qAdd(a, b) {
  const sum = (a | 0) + (b | 0);
  if (sum > 2147483647) return 2147483647;
  if (sum < -2147483648) return -2147483648;
  return sum | 0;
}

export function qSub(a, b) {
  const diff = (a | 0) - (b | 0);
  if (diff > 2147483647) return 2147483647;
  if (diff < -2147483648) return -2147483648;
  return diff | 0;
}

export function qMul(a, b) {
  const prod = (BigInt(a | 0) * BigInt(b | 0)) >> Q_SHIFT;
  if (prod > 2147483647n) return 2147483647;
  if (prod < -2147483648n) return -2147483648;
  return Number(prod) | 0;
}

export function createSeededRng(seedUint32) {
  let state = seedUint32 >>> 0;
  return function nextUint32() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return (t ^ (t >>> 14)) >>> 0;
  };
}
