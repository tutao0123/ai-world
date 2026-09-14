import { test, expect, places } from './fixtures';

test.beforeEach(async ({ page }) => {
  await page.goto('/?view=labs');
  await expect(page.locator('#world-map')).toBeVisible();
});

test('all five map places work by pointer and actual keyboard tab order', async ({ page }, testInfo) => {
  await page.screenshot({ path: testInfo.outputPath('desktop-map.png'), fullPage: true });
  for (const place of places) {
    await page.locator(`[data-location="${place.id}"] .map-label`).click();
    await expect(page.locator('#explorer-panel h2')).toHaveText(place.title);
    await expect(page.locator(`[data-location="${place.id}"]`)).toHaveAttribute('aria-pressed', 'true');
  }
  await expect(page.locator('#header-count')).toHaveText('0/5');

  await page.locator('#map-viewport').focus();
  for (const [index, place] of places.entries()) {
    await page.keyboard.press('Tab');
    await expect(page.locator(`[data-location="${place.id}"]`)).toBeFocused();
    await page.keyboard.press(index % 2 === 0 ? 'Enter' : 'Space');
    await expect(page.locator('#explorer-panel h2')).toHaveText(place.title);
  }
});

test('map zoom and keyboard pan are bounded and resettable', async ({ page }) => {
  const map = page.locator('#world-map');
  await expect(page.locator('#zoom-level')).toHaveText('100%');
  await expect(page.getByRole('button', { name: '缩小地图', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: '放大地图', exact: true }).click();
  await expect(page.locator('#zoom-level')).toHaveText('125%');
  const beforePan = await map.getAttribute('viewBox');
  await page.locator('#map-viewport').focus();
  await page.keyboard.press('ArrowRight');
  await expect(map).not.toHaveAttribute('viewBox', beforePan!);
  await page.keyboard.press('Home');
  await expect(map).toHaveAttribute('viewBox', '0 0 1400 900');
  await expect(page.locator('#zoom-level')).toHaveText('100%');

  // Starting on a different landmark must pan, rather than open that place.
  await page.getByRole('button', { name: '放大地图', exact: true }).click();
  const landmark = await page.locator('[data-location="embedding"] .marker').boundingBox();
  expect(landmark).not.toBeNull();
  const beforeDrag = await map.getAttribute('viewBox');
  const startX = landmark!.x + landmark!.width / 2;
  const startY = landmark!.y + landmark!.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX - 80, startY + 30, { steps: 8 });
  await page.mouse.up();
  await expect(map).not.toHaveAttribute('viewBox', beforeDrag!);
  await expect(page.locator('#explorer-panel h2')).toHaveText('Token 村');
  await expect(page.locator('[data-location="embedding"]')).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: '重置地图', exact: true }).click();
  await expect(map).toHaveAttribute('viewBox', '0 0 1400 900');

  await page.locator('#map-viewport').hover();
  await page.mouse.wheel(0, -180);
  await expect(page.locator('#zoom-level')).toHaveText('110%');
  await expect(map).not.toHaveAttribute('viewBox', '0 0 1400 900');
  await page.getByRole('button', { name: '重置地图', exact: true }).click();
  await expect(map).toHaveAttribute('viewBox', '0 0 1400 900');

  for (let step = 0; step < 6; step++) {
    await page.getByRole('button', { name: '放大地图', exact: true }).click();
  }
  await expect(page.locator('#zoom-level')).toHaveText('250%');
  await expect(page.getByRole('button', { name: '放大地图', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: '重置地图', exact: true }).click();
  await expect(map).toHaveAttribute('viewBox', '0 0 1400 900');
  await expect(page.locator('#zoom-level')).toHaveText('100%');
});

test('only correct answers earn stamps, stamps persist and repeated answers are idempotent', async ({ page }) => {
  await page.locator('[data-answer="0"]').click();
  await expect(page.locator('#answer-feedback')).toContainText('再观察');
  await expect(page.locator('#header-count')).toHaveText('0/5');
  await page.locator('[data-answer="1"]').click();
  await expect(page.locator('#answer-feedback')).toHaveClass(/success/);
  await expect(page.locator('#header-count')).toHaveText('1/5');
  await page.locator('[data-answer="1"]').click();
  await expect(page.locator('#header-count')).toHaveText('1/5');

  for (const place of places.slice(1, 4)) {
    await page.locator(`[data-route="${place.id}"]`).click();
    await page.locator(`[data-answer="${place.correct}"]`).click();
    await expect(page.locator('#answer-feedback')).toHaveClass(/success/);
  }
  await expect(page.locator('#header-count')).toHaveText('4/5');
  await page.reload();
  await expect(page.locator('#header-count')).toHaveText('4/5');
  await expect(page.locator('[data-route].complete')).toHaveCount(4);
  await page.locator('#passport-open').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('.passport-stamp.earned')).toHaveCount(4);
  await page.locator('[data-passport="quantization"]').click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('#explorer-panel h2')).toHaveText('量化矿岛');
});

test('the mine awards only the exact 48 GiB and at-least-32K mission', async ({ page }, testInfo) => {
  await page.locator('#mission-shortcut').click();
  await page.locator('[data-bits="4"]').click();
  await page.getByLabel('上下文长度').selectOption('32768');
  await page.getByLabel('内存预算').selectOption('80');
  await page.locator('#run-budget').click();
  await expect(page.locator('#lab-result')).toContainText('本关还需要');
  await expect(page.locator('#header-count')).toHaveText('0/5');

  await page.getByLabel('内存预算').selectOption('48');
  await page.getByLabel('上下文长度').selectOption('131072');
  await page.locator('#run-budget').click();
  await expect(page.locator('#lab-result')).toHaveClass(/retry/);
  await expect(page.locator('#memory-output')).toContainText('超出预算');
  await expect(page.locator('#header-count')).toHaveText('0/5');

  await page.getByLabel('上下文长度').selectOption('8192');
  await page.locator('#run-budget').click();
  await expect(page.locator('#lab-result')).toContainText('本关还需要');
  await expect(page.locator('#header-count')).toHaveText('0/5');

  await page.getByLabel('上下文长度').selectOption('32768');
  await expect(page.locator('#lab-result')).toBeEmpty();
  await expect(page.locator('#memory-output')).toContainText('45.6');
  await page.locator('#run-budget').click();
  await expect(page.locator('#lab-result')).toHaveClass(/success/);
  await expect(page.locator('#lab-result')).toContainText('任务完成');
  await expect(page.locator('#header-count')).toHaveText('1/5');
  await page.screenshot({ path: testInfo.outputPath('desktop-mission.png'), fullPage: true });
  await page.reload();
  await expect(page.locator('#header-count')).toHaveText('1/5');
  await expect(page.locator('[data-route="quantization"]')).toHaveClass(/complete/);
});
