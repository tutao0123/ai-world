import assert from 'node:assert/strict';
import test from 'node:test';
import { estimateMemory, type Budget, type Precision } from './learning.ts';

test('16-bit, 8K reference scenario uses GiB and a separate reserve', () => {
  const result = estimateMemory(16, 8192);
  assert.equal(result.weightsGiB, 130.385160446167);
  assert.equal(result.kvGiB, 2.5);
  assert.equal(result.overheadGiB, 3);
  assert.equal(result.totalGiB, 135.885160446167);
});

test('4-bit weight payload is 35 decimal GB, not 35 GiB', () => {
  const result = estimateMemory(4, 2048);
  assert.equal(result.weightsGiB * 2 ** 30, 35_000_000_000);
  assert.ok(Math.abs(result.weightsGiB - 32.59629) < 0.00001);
  assert.equal(result.kvGiB, 0.625);
  assert.ok(result.totalGiB > result.weightsGiB);
});

test('halving weight precision halves only the weight payload', () => {
  for (const bits of [32, 16, 8] as const) {
    const high = estimateMemory(bits, 32768);
    const low = estimateMemory((bits / 2) as Precision, 32768);
    assert.equal(high.weightsGiB / 2, low.weightsGiB);
    assert.equal(high.kvGiB, low.kvGiB);
    assert.equal(high.overheadGiB, low.overheadGiB);
    assert.notEqual(high.totalGiB / 2, low.totalGiB);
  }
});

test('doubling cached context doubles KV, while weights remain constant', () => {
  for (const tokens of [1, 2048, 4096, 16384, 65536]) {
    const smaller = estimateMemory(4, tokens);
    const larger = estimateMemory(4, tokens * 2);
    assert.equal(larger.kvGiB, smaller.kvGiB * 2);
    assert.equal(larger.weightsGiB, smaller.weightsGiB);
    assert.equal(larger.overheadGiB, smaller.overheadGiB);
  }
  assert.equal(estimateMemory(4, 131072).kvGiB, 40);
});

test('all 48 playable precision/context/budget combinations have expected outcomes', () => {
  const precisions: Precision[] = [32, 16, 8, 4];
  const contexts = [2048, 8192, 32768, 131072];
  const budgets: Budget[] = [24, 48, 80];
  for (const bits of precisions) {
    for (const context of contexts) {
      for (const budget of budgets) {
        const expectedFits =
          (bits === 4 && budget === 80) ||
          (bits === 4 && budget === 48 && context <= 32768) ||
          (bits === 8 && budget === 80 && context <= 32768);
        const result = estimateMemory(bits, context);
        assert.equal(
          result.totalGiB <= budget,
          expectedFits,
          `${bits}-bit, ${context} tokens, ${budget} GiB`,
        );
        assert.ok(Object.values(result).every(Number.isFinite));
      }
    }
  }
});

test('runtime validation rejects invalid precision values', () => {
  for (const bits of [0, -4, 2, 3, 12, 64, 4.5, NaN, Infinity, '4', null, undefined]) {
    assert.throws(() => estimateMemory(bits as Precision, 8192), RangeError);
  }
});

test('runtime validation rejects invalid and unsupported context lengths', () => {
  for (const context of [0, -1, 1.5, 131073, NaN, Infinity, Number.MAX_SAFE_INTEGER, '8192', null, undefined]) {
    assert.throws(() => estimateMemory(4, context as number), RangeError);
  }
});
