import {test, expect} from './fixtures';
import {getChapters} from '../src/curriculum-localized';
import type {Page} from '@playwright/test';

async function expectNoOverflow(page: Page) {
  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
    dialogWidth: document.querySelector('dialog[open]')?.getBoundingClientRect().width ?? 0,
  }));
  expect(sizes.viewport).toBe(390);
  expect(sizes.document).toBeLessThanOrEqual(sizes.viewport + 1);
  expect(sizes.body).toBeLessThanOrEqual(sizes.viewport + 1);
  expect(sizes.dialogWidth).toBeLessThanOrEqual(sizes.viewport);
}

test('390px English atlas, search, long reader, and passport keep named controls reachable', async ({page}) => {
  const chapter = getChapters('en').find(chapter => chapter.id === 'c12')!;
  await page.goto('/?lang=en');
  await expect(page.getByRole('combobox', {name: 'Language', exact: true})).toBeInViewport();
  await expect(page.getByRole('button', {name: 'Search the atlas', exact: true})).toBeVisible();
  await expectNoOverflow(page);
  await page.locator('[data-chapter="c12"] .atlas-label').tap();
  await expect(page.locator('#chapter-panel h2')).toHaveText(chapter.title);
  await expect(page.locator('#chapter-panel h2')).toBeInViewport();
  await page.getByRole('button', {name: 'Search the atlas', exact: true}).tap();
  await page.getByRole('searchbox', {name: 'Search chapters and topics'}).fill('MCP');
  await expect(page.locator('[data-result-topic="12.8"]')).toBeVisible();
  await expectNoOverflow(page);
  await page.locator('[data-result-topic="12.8"]').tap();
  await expect(page.locator('#atlas-dialog-title')).toHaveText(chapter.title);
  await expect(page.locator('[data-topic]')).toHaveCount(14);
  await page.locator('[data-jump-topic="12.14"]').tap();
  await expect(page.locator('[data-topic="12.14"] summary')).toBeInViewport();
  await expect(page.locator('#atlas-dialog select[data-language]')).toHaveAccessibleName('Language');
  await expect(page.locator('#atlas-dialog select[data-language]')).toBeInViewport();
  await expect(page.getByRole('button', {name: 'Close exploration window', exact: true})).toBeInViewport();
  expect(await page.locator('#atlas-dialog-content').innerText()).not.toMatch(/\p{Script=Han}/u);
  await expectNoOverflow(page);
  await page.getByRole('button', {name: 'Close exploration window', exact: true}).tap();
  await page.locator('#atlas-passport').tap();
  await expect(page.locator('[data-passport-chapter]')).toHaveCount(13);
  expect(await page.locator('#atlas-dialog-content').innerText()).not.toMatch(/\p{Script=Han}/u);
  await expectNoOverflow(page);
});

test('390px English quantization controls and assumptions remain usable', async ({page}) => {
  await page.goto('/?lang=en&view=labs&place=quantization');
  await page.locator('[data-bits="4"]').tap();
  await page.getByLabel('Context length', {exact: true}).selectOption('32768');
  await page.getByLabel('Memory budget', {exact: true}).selectOption('48');
  await expect(page.locator('.memory-total strong')).toHaveText('45.6');
  await page.locator('#run-budget').tap();
  await expect(page.locator('#lab-result')).toHaveClass(/success/);
  await expectNoOverflow(page);
  await page.locator('#assumptions-open').tap();
  await expect(page.getByRole('dialog').getByRole('combobox', {name: 'Language', exact: true})).toBeVisible();
  await expect(page.getByRole('button', {name: 'Close dialog', exact: true})).toBeVisible();
  expect(await page.locator('#dialog-content').innerText()).not.toMatch(/\p{Script=Han}/u);
  await expectNoOverflow(page);
  await page.getByRole('button', {name: 'Close dialog', exact: true}).tap();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
