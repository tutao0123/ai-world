import {test, expect} from './fixtures';
import {chapters} from '../src/curriculum';
import type {Page} from '@playwright/test';

async function expectNoOverflow(page: Page) {
  const sizes = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth,
    dialogWidth: document.querySelector('dialog[open]')?.getBoundingClientRect().width ?? 0,
  }));
  expect(sizes.document).toBeLessThanOrEqual(sizes.viewport + 1);
  expect(sizes.body).toBeLessThanOrEqual(sizes.viewport + 1);
  expect(sizes.dialogWidth).toBeLessThanOrEqual(sizes.viewport);
}

test('390px atlas touch, chapter 12 reader, search and passport stay usable without overflow', async ({page}, testInfo) => {
  test.setTimeout(60_000);
  await page.goto('/');
  await expect(page.locator('#atlas-map [data-chapter]')).toHaveCount(13);
  await expectNoOverflow(page);
  await page.screenshot({path: testInfo.outputPath('atlas-mobile-initial.png'), fullPage: true});
  const landmark = await page.locator('[data-chapter="c06"] .atlas-label').boundingBox();
  expect(landmark).not.toBeNull();
  const x = landmark!.x + landmark!.width / 2;
  const y = landmark!.y + landmark!.height / 2;
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x, y}]});
  for (let step = 1; step <= 5; step++) {
    await session.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x: x - step * 8, y: y + step * 3}]});
  }
  await session.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
  await session.detach();
  await expect(page.locator('#atlas-map')).not.toHaveAttribute('viewBox', '0 0 1400 900');
  await expect(page.locator('#chapter-panel h2')).toHaveText(chapters[0].title);
  await page.locator('#atlas-reset').click();
  await page.locator('[data-chapter="c12"] .atlas-label').tap();
  await expect(page.locator('#chapter-panel h2')).toHaveText(chapters[11].title);
  await expect(page.locator('#chapter-panel h2')).toBeInViewport();
  await page.getByRole('button', {name: '进入这一章'}).click();
  await expect(page.locator('[data-topic]')).toHaveCount(14);
  for (const topic of chapters[11].topics) {
    await page.locator(`[data-jump-topic="${topic.id}"]`).click();
    await expect(page.locator(`[data-topic="${topic.id}"]`)).toHaveAttribute('open', '');
    await expect(page.locator(`[data-topic="${topic.id}"] summary`)).toBeInViewport();
    await expectNoOverflow(page);
  }
  await expect(page.getByRole('button', {name: '关闭探索窗口'})).toBeInViewport();
  await page.screenshot({path: testInfo.outputPath('chapter-12-mobile-reader.png'), fullPage: true});
  await page.locator(`[data-chapter-answer="${chapters[11].quiz.answer}"]`).click();
  await expect(page.locator('.reader-feedback')).toHaveClass(/success/);
  await page.keyboard.press('Escape');
  await page.getByRole('button', {name: '搜索知识地图'}).tap();
  await page.getByRole('searchbox').fill('MCP');
  await expect(page.locator('[data-result-topic="12.8"]')).toBeVisible();
  await expectNoOverflow(page);
  await page.screenshot({path: testInfo.outputPath('atlas-mobile-search.png'), fullPage: true});
  await page.getByRole('button', {name: '关闭探索窗口'}).tap();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.locator('#atlas-passport').click();
  await expect(page.locator('[data-passport-chapter].earned')).toHaveCount(1);
  await expectNoOverflow(page);
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.locator('#atlas-count')).toHaveText('1/13');
});

test('tablet atlas, all region controls and reader retain their width', async ({page}) => {
  await page.setViewportSize({width: 820, height: 1180});
  await page.goto('/');
  await expectNoOverflow(page);
  for (const region of ['foundations', 'applications', 'systems', 'practice']) {
    await page.locator(`[data-region-filter="${region}"]`).click();
    await expect(page.locator(`[data-region-filter="${region}"]`)).toHaveAttribute('aria-pressed', 'true');
    await expectNoOverflow(page);
  }
  await page.getByRole('button', {name: '进入这一章'}).click();
  await expect(page.locator('#atlas-dialog-title')).toHaveText(chapters[11].title);
  await expectNoOverflow(page);
  await page.locator('[data-jump-topic="12.14"]').click();
  await expect(page.locator('[data-topic="12.14"] summary')).toBeInViewport();
  await expectNoOverflow(page);
});
