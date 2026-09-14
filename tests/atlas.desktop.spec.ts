import {test, expect, places} from './fixtures';
import {chapters, learningRoutes, topicCount} from '../src/curriculum';

test.beforeEach(async ({page}) => {
  await page.goto('/');
  await expect(page.locator('#atlas-map')).toBeVisible();
});

test('thirteen map landmarks select chapters by pointer and open by real keyboard tab order', async ({page}, testInfo) => {
  test.setTimeout(90_000);
  await expect(page.locator('#atlas-map [data-chapter][role="button"]')).toHaveCount(13);
  await expect(page.locator('.atlas-stat')).toContainText('101');
  for (const chapter of chapters) {
    await page.locator(`[data-chapter="${chapter.id}"] .atlas-label`).click();
    await expect(page.locator('#chapter-panel h2')).toHaveText(chapter.title);
    await expect(page.locator(`[data-chapter="${chapter.id}"]`)).toHaveAttribute('aria-pressed', 'true');
  }
  await page.locator('#atlas-viewport').focus();
  for (const [index, chapter] of chapters.entries()) {
    await page.keyboard.press('Tab');
    await expect(page.locator(`[data-chapter="${chapter.id}"]`)).toBeFocused();
    await page.keyboard.press(index % 2 ? 'Space' : 'Enter');
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.locator('#atlas-dialog-title')).toHaveText(chapter.title);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.locator(`[data-chapter="${chapter.id}"]`)).toBeFocused();
  }
  await page.locator('[data-chapter="c01"] .atlas-label').click();
  await page.screenshot({path: testInfo.outputPath('atlas-desktop-initial.png'), fullPage: true});
});

test('map drag, wheel and keyboard camera preserve selection and reset within bounds', async ({page}) => {
  const map = page.locator('#atlas-map');
  await expect(page.locator('#atlas-zoom-out')).toBeDisabled();
  await page.locator('#atlas-zoom-in').click();
  await expect(page.locator('#atlas-zoom-level')).toHaveText('125%');
  const beforePan = await map.getAttribute('viewBox');
  await page.locator('#atlas-viewport').focus();
  await page.keyboard.press('ArrowRight');
  await expect(map).not.toHaveAttribute('viewBox', beforePan!);
  await page.keyboard.press('Home');
  await expect(map).toHaveAttribute('viewBox', '0 0 1400 900');
  const landmark = await page.locator('[data-chapter="c06"] .atlas-label').boundingBox();
  expect(landmark).not.toBeNull();
  const x = landmark!.x + landmark!.width / 2;
  const y = landmark!.y + landmark!.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x - 65, y + 30, {steps: 7});
  await page.mouse.up();
  await expect(map).not.toHaveAttribute('viewBox', '0 0 1400 900');
  await expect(page.locator('#chapter-panel h2')).toHaveText(chapters[0].title);
  await page.locator('#atlas-reset').click();
  await page.locator('#atlas-viewport').hover();
  await page.mouse.wheel(0, -150);
  await expect(page.locator('#atlas-zoom-level')).toHaveText('110%');
  await page.locator('#atlas-reset').click();
  for (let step = 0; step < 8; step++) await page.locator('#atlas-zoom-in').click();
  await expect(page.locator('#atlas-zoom-level')).toHaveText('300%');
  await expect(page.locator('#atlas-zoom-in')).toBeDisabled();
  await page.locator('#atlas-reset').click();
  await expect(map).toHaveAttribute('viewBox', '0 0 1400 900');
});

test('all 101 topics are reachable and all 13 actual quizzes persist without awarding wrong answers', async ({page}, testInfo) => {
  // This full-curriculum traversal performs 101 topic clicks and hundreds of
  // assertions. Allow cumulative work while still bounding any stuck action.
  test.setTimeout(240_000);
  page.setDefaultTimeout(15_000);
  expect(topicCount).toBe(101);
  let renderedTopics = 0;
  for (const [index, chapter] of chapters.entries()) {
    await page.locator(`[data-itinerary="${chapter.id}"]`).click();
    await page.getByRole('button', {name: '进入这一章'}).click();
    await expect(page.locator('#atlas-dialog-title')).toHaveText(chapter.title);
    await expect(page.locator('[data-topic]')).toHaveCount(chapter.topics.length);
    await expect(page.locator('[data-jump-topic]')).toHaveCount(chapter.topics.length);
    for (const topic of chapter.topics) {
      await page.locator(`[data-jump-topic="${topic.id}"]`).click();
      await expect(page.locator(`[data-topic="${topic.id}"]`)).toHaveAttribute('open', '');
      await expect(page.locator(`[data-topic="${topic.id}"] summary`)).toBeInViewport();
      await expect(page.locator(`[data-topic="${topic.id}"] h3`)).toHaveText(topic.title);
      await expect(page.locator(`[data-topic="${topic.id}"] .topic-copy > p`)).toHaveText(topic.summary);
      await expect(page.locator(`[data-topic="${topic.id}"] .topic-example > p`)).toHaveText(topic.example);
    }
    renderedTopics += chapter.topics.length;
    if (chapter.id === 'c12') {
      await expect(page.getByRole('button', {name: '关闭探索窗口'})).toBeInViewport();
      await page.screenshot({path: testInfo.outputPath('chapter-12-reader.png'), fullPage: true});
    }
    const wrong = (chapter.quiz.answer + 1) % 3;
    await page.locator(`[data-chapter-answer="${wrong}"]`).click();
    await expect(page.locator('.reader-feedback')).toHaveClass(/retry/);
    await expect(page.locator('#atlas-count')).toHaveText(`${index}/13`);
    await page.locator(`[data-chapter-answer="${chapter.quiz.answer}"]`).click();
    await expect(page.locator('.reader-feedback')).toHaveText(chapter.quiz.explanation);
    await expect(page.locator('.reader-feedback')).toHaveClass(/success/);
    await expect(page.locator('#atlas-count')).toHaveText(`${index + 1}/13`);
    await page.locator(`[data-chapter-answer="${chapter.quiz.answer}"]`).click();
    await expect(page.locator('#atlas-count')).toHaveText(`${index + 1}/13`);
    await page.keyboard.press('Escape');
  }
  expect(renderedTopics).toBe(101);
  await page.reload();
  await expect(page.locator('#atlas-count')).toHaveText('13/13');
  await expect(page.locator('#atlas-map .is-complete')).toHaveCount(13);
  await page.locator('#atlas-passport').click();
  await expect(page.locator('[data-passport-chapter].earned')).toHaveCount(13);
  await page.locator('[data-passport-chapter="c12"]').click();
  await expect(page.locator('#atlas-dialog-title')).toHaveText(chapters[11].title);
  await expect(page.locator('.reader-completion')).toContainText('已完成');
});

test('search handles RAG, MCP, empty results and section deep links across reload and close', async ({page}, testInfo) => {
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog')).toBeVisible();
  const search = page.getByRole('searchbox', {name: '搜索章节和知识点'});
  await expect(search).toBeFocused();
  await expect(page.locator('[data-result-chapter]')).toHaveCount(101);
  await search.fill('RAG');
  await expect(page.locator('[data-result-chapter="c06"]')).toHaveCount(6);
  await page.screenshot({path: testInfo.outputPath('atlas-search-rag.png'), fullPage: true});
  await search.fill('MCP');
  await expect(page.locator('[data-result-topic="12.8"]')).toBeVisible();
  await search.fill('LLMOps');
  await expect(page.locator('[data-result-topic="8.9"]')).toBeVisible();
  await search.fill('Plan');
  await expect(page.locator('[data-result-topic="12.7"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button', {name: '搜索知识地图'}).click();
  await expect(search).toHaveValue('Plan');
  await search.fill('unfindableXYZ09014');
  await expect(page.locator('[data-result-chapter]')).toHaveCount(0);
  await expect(page.locator('.search-summary')).toHaveText('找到 0 个相关知识点');
  await expect(page.locator('.search-empty')).toBeVisible();
  await search.fill('6.2');
  await page.locator('[data-result-topic="6.2"]').click();
  await expect(page).toHaveURL(/#chapter\/c06\/6\.2$/);
  await expect(page.locator('[data-topic="6.2"]')).toHaveAttribute('open', '');
  await expect(page.locator('[data-topic="6.2"] summary')).toBeInViewport();
  await page.reload();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.locator('[data-topic="6.2"]')).toHaveAttribute('open', '');
  await expect(page.locator('[data-topic="6.2"] summary')).toBeInViewport();
  await page.getByRole('button', {name: '关闭探索窗口'}).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await expect(page).toHaveURL('http://127.0.0.1:5178/');
});

test('region emphasis, career routes and existing five lab stamps survive both views', async ({page}) => {
  await page.locator('[data-region-filter="systems"]').click();
  await expect(page.locator('[data-region-filter="systems"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.atlas-region.is-faded')).toHaveCount(3);
  await expect(page.locator('#chapter-panel h2')).toHaveText(chapters[8].title);
  await page.getByLabel('学习方向').selectOption('systems');
  const route = learningRoutes.find(route => route.id === 'systems')!;
  await expect(page.locator('[data-itinerary]')).toHaveCount(route.chapters.length);
  expect(await page.locator('[data-itinerary]').evaluateAll(elements => elements.map(element => element.getAttribute('data-itinerary')))).toEqual(route.chapters);
  await page.locator('[data-itinerary="c10"]').click();
  await expect(page.locator('#chapter-panel h2')).toHaveText(chapters[9].title);
  await page.locator('#atlas-home').click();
  await expect(page.locator('.atlas-region.is-faded')).toHaveCount(0);
  await expect(page.locator('[data-region-filter="all"]')).toHaveAttribute('aria-pressed', 'true');

  // Simulate the passport format from the earlier five-stop release.
  await page.evaluate(ids => localStorage.setItem('ai-world-passport-v1', JSON.stringify(ids)), places.map(place => place.id));
  await page.reload();
  await page.locator('#atlas-passport').click();
  await expect(page.locator('#atlas-dialog-content')).toContainText('5 / 5');
  await expect(page.locator('[data-passport-chapter].earned')).toHaveCount(0);
  await page.keyboard.press('Escape');
  await page.locator('#atlas-labs').click();
  await expect(page).toHaveURL(url => url.pathname === '/' && url.searchParams.get('lang') === 'zh' && url.searchParams.get('view') === 'labs' && url.searchParams.get('place') === 'token' && url.hash === '');
  await expect(page.locator('#world-map')).toBeVisible();
  await expect(page.locator('#header-count')).toHaveText('5/5');
  await expect(page.locator('[data-route].complete')).toHaveCount(5);
  await page.locator('#lab-source-open').click();
  await expect(page.locator('#atlas-dialog-title')).toHaveText(chapters[2].title);
  await page.keyboard.press('Escape');
  await page.locator('#atlas-labs').click();
  await expect(page.locator('#header-count')).toHaveText('5/5');
  await page.locator('#back-to-atlas').click();
  await expect(page.locator('#atlas-map')).toBeVisible();
  await expect(page.locator('#atlas-count')).toHaveText('0/13');
  await page.locator('#atlas-passport').click();
  await expect(page.locator('#atlas-dialog-content')).toContainText('5 / 5');
});
