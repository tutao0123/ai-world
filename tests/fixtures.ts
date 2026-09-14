import { test as base, expect } from '@playwright/test';

export const test = base.extend<{ browserErrors: string[] }>({
  browserErrors: [async ({ page }, use) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await use(errors);
    expect(errors, 'The experience must run without uncaught browser errors').toEqual([]);
  }, { auto: true }],
});

export { expect };

export const places = [
  { id: 'token', title: 'Token 村', correct: '1' },
  { id: 'embedding', title: '向量河谷', correct: '0' },
  { id: 'transformer', title: '注意力山脉', correct: '0' },
  { id: 'llm', title: '大模型之城', correct: '1' },
  { id: 'quantization', title: '量化矿岛', correct: '' },
] as const;
