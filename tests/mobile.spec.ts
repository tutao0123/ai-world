import { test, expect, places } from './fixtures';

test('390px layout keeps routes and dialogs reachable without body overflow', async ({ page }, testInfo) => {
  await page.goto('/?view=labs');
  await expect(page.locator('#world-map')).toBeVisible();
  const expectNoBodyOverflow = async () => {
    const sizes = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    }));
    expect(sizes.document).toBeLessThanOrEqual(sizes.viewport + 1);
    expect(sizes.body).toBeLessThanOrEqual(sizes.viewport + 1);
  };
  await expectNoBodyOverflow();
  await page.screenshot({ path: testInfo.outputPath('mobile-map.png'), fullPage: true });

  // Dispatch native touch input through Chromium, exercising pointer capture.
  const landmark = await page.locator('[data-location="embedding"] .marker').boundingBox();
  expect(landmark).not.toBeNull();
  const startX = landmark!.x + landmark!.width / 2;
  const startY = landmark!.y + landmark!.height / 2;
  const session = await page.context().newCDPSession(page);
  await session.send('Input.dispatchTouchEvent', {
    type: 'touchStart', touchPoints: [{ x: startX, y: startY }],
  });
  for (let step = 1; step <= 5; step++) {
    await session.send('Input.dispatchTouchEvent', {
      type: 'touchMove', touchPoints: [{ x: startX - step * 9, y: startY + step * 4 }],
    });
  }
  await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await session.detach();
  await expect(page.locator('#world-map')).not.toHaveAttribute('viewBox', '0 0 1400 900');
  await expect(page.locator('#explorer-panel h2')).toHaveText('Token 村');
  await expect(page.locator('[data-location="embedding"]')).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('button', { name: '重置地图', exact: true }).click();
  await expect(page.locator('#world-map')).toHaveAttribute('viewBox', '0 0 1400 900');

  for (const place of places) {
    await page.locator(`[data-route="${place.id}"]`).click();
    await expect(page.locator('#explorer-panel h2')).toHaveText(place.title);
    await expect(page.locator('#explorer-panel h2')).toBeInViewport();
    await expectNoBodyOverflow();
  }
  await page.locator('#assumptions-open').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('#dialog-title')).toHaveText('把估算拆开看');
  await expectNoBodyOverflow();
  await page.getByRole('button', { name: '关闭弹窗', exact: true }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();

  await page.locator('#passport-open').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.locator('[data-passport="token"]').click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page.locator('#explorer-panel h2')).toHaveText('Token 村');
  await page.locator('#about-open').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
