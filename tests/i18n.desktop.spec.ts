import {test, expect} from './fixtures';
import {getChapters} from '../src/curriculum-localized';
import {topicSourceIndex} from '../src/source-index';
import type {Page} from '@playwright/test';

async function expectEnglishVisibleText(page: Page) {
  const untranslated = await page.evaluate(() => {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const matches: string[] = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      if (!parent || parent.closest('script, style, select[data-language]')) continue;
      const value = node.textContent?.trim() ?? '';
      if (!/\p{Script=Han}/u.test(value) || getComputedStyle(parent).visibility === 'hidden') continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      if (Array.from(range.getClientRects()).some(rect => rect.width > 0 && rect.height > 0)) matches.push(value);
    }
    return matches;
  });
  expect(untranslated, 'Only the language picker may display 中文 in English mode').toEqual([]);
}

test('an English shared link renders an English first screen even with a saved Chinese preference', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('ai-world-language', 'zh'));
  await page.goto('/?lang=en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.getByRole('heading', {level: 1})).toHaveText('From a model’s first steps to your first project.');
  await expect(page.locator('#atlas-map [data-chapter][role="button"]')).toHaveCount(13);
  await expect(page.locator('.atlas-stat')).toContainText('101');
  await expect(page.getByRole('combobox', {name: 'Language', exact: true})).toHaveValue('en');
  await expect(page.getByRole('button', {name: 'Search the atlas', exact: true})).toBeVisible();
  await expectEnglishVisibleText(page);
});

test('English search opens a translated topic and still accepts the original source title', async ({page}) => {
  const chapter = getChapters('en').find(chapter => chapter.id === 'c06')!;
  const topic = chapter.topics.find(topic => topic.id === '6.2')!;
  await page.goto('/?lang=en');
  await page.getByRole('button', {name: 'Search the atlas', exact: true}).click();
  const search = page.getByRole('searchbox', {name: 'Search chapters and topics'});
  await expect(search).toBeFocused();
  await expect(page.locator('[data-result-topic]')).toHaveCount(101);
  await search.fill(topicSourceIndex['6.2'].title);
  await expect(page.locator('[data-result-topic="6.2"]')).toBeVisible();
  await search.fill('semantic');
  await expect(page.locator('[data-result-topic="6.2"]')).toBeVisible();
  await expectEnglishVisibleText(page);
  await page.locator('[data-result-topic="6.2"]').click();
  await expect(page).toHaveURL(/#chapter\/c06\/6\.2$/);
  await expect(page.locator('#atlas-dialog-title')).toHaveText(chapter.title);
  await expect(page.locator('[data-topic="6.2"]')).toHaveAttribute('open', '');
  await expect(page.locator('[data-topic="6.2"] .topic-copy > p')).toHaveText(topic.summary);
  await expect(page.locator('[data-topic="6.2"] .topic-example > p')).toHaveText(topic.example);
  await expect(page.getByRole('button', {name: 'Close exploration window', exact: true})).toBeVisible();
  await expectEnglishVisibleText(page);
});

test('switching an open topic to Chinese preserves its route, hash, and both passport stores', async ({page}) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('ai-world-chapters-v1')) localStorage.setItem('ai-world-chapters-v1', JSON.stringify(['c01']));
    if (!localStorage.getItem('ai-world-passport-v1')) localStorage.setItem('ai-world-passport-v1', JSON.stringify(['token']));
  });
  await page.goto('/?lang=en&route=builder#chapter/c03/3.9');
  await expect(page.locator('[data-topic="3.9"]')).toHaveAttribute('open', '');
  await page.locator('[data-chapter-answer="2"]').click();
  await expect(page.locator('.reader-feedback')).toHaveClass(/success/);
  await expect(page.locator('#atlas-count')).toHaveText('2/13');
  await page.locator('#atlas-dialog select[data-language]').selectOption('zh');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page).toHaveURL(url => url.searchParams.get('lang') === 'zh' && url.searchParams.get('route') === 'builder' && url.hash === '#chapter/c03/3.9');
  await expect(page.locator('#atlas-dialog-title')).toHaveText('神经网络与表示');
  await expect(page.locator('[data-topic="3.9"]')).toHaveAttribute('open', '');
  await expect(page.locator('#learning-route')).toHaveValue('builder');
  await expect(page.locator('#atlas-count')).toHaveText('2/13');
  await expect(page.locator('.reader-completion')).toContainText('已完成');
  expect(await page.evaluate(() => ({
    chapters: JSON.parse(localStorage.getItem('ai-world-chapters-v1')!),
    labs: JSON.parse(localStorage.getItem('ai-world-passport-v1')!),
    language: localStorage.getItem('ai-world-language'),
  }))).toEqual({chapters: ['c01', 'c03'], labs: ['token'], language: 'zh'});
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
});

test('a live 4-bit, 32K, 48 GiB experiment keeps its calculation and stamp across languages', async ({page}) => {
  await page.goto('/?lang=en&view=labs&place=quantization');
  await page.locator('[data-bits="4"]').click();
  await page.getByLabel('Context length', {exact: true}).selectOption('32768');
  await page.getByLabel('Memory budget', {exact: true}).selectOption('48');
  await expect(page.locator('.memory-total strong')).toHaveText('45.6');
  const originalNumbers = (await page.locator('#memory-output').innerText()).match(/\d+(?:\.\d+)?/g);
  await page.locator('#run-budget').click();
  await expect(page.locator('#lab-result')).toHaveClass(/success/);
  await expect(page.locator('#header-count')).toHaveText('1/5');
  await expectEnglishVisibleText(page);
  await page.locator('header select[data-language]').selectOption('zh');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page).toHaveURL(url => url.searchParams.get('lang') === 'zh' && url.searchParams.get('place') === 'quantization' && url.searchParams.get('bits') === '4' && url.searchParams.get('context') === '32768' && url.searchParams.get('budget') === '48');
  await expect(page.locator('[data-bits="4"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#context-select')).toHaveValue('32768');
  await expect(page.locator('#budget-select')).toHaveValue('48');
  expect((await page.locator('#memory-output').innerText()).match(/\d+(?:\.\d+)?/g)).toEqual(originalNumbers);
  await expect(page.locator('#header-count')).toHaveText('1/5');
  await page.locator('header select[data-language]').selectOption('en');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  await expect(page.locator('.memory-total strong')).toHaveText('45.6');
  await page.locator('#assumptions-open').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expectEnglishVisibleText(page);
});

test('switching search to Chinese keeps the query instead of restoring the previous chapter hash', async ({page}) => {
  await page.goto('/?lang=en#chapter/c06/6.2');
  await expect(page.locator('[data-topic="6.2"]')).toHaveAttribute('open', '');
  await page.keyboard.press('Control+k');
  await page.getByRole('searchbox', {name: 'Search chapters and topics'}).fill('RAG');
  await expect(page.locator('[data-result-chapter="c06"]')).toHaveCount(6);
  await page.locator('#atlas-dialog').getByRole('combobox', {name: 'Language', exact: true}).selectOption('zh');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page).toHaveURL(url => url.searchParams.get('lang') === 'zh' && url.searchParams.get('dialog') === 'search' && url.searchParams.get('search') === 'RAG');
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('searchbox', {name: '搜索章节和知识点'})).toBeVisible();
  await expect(page.getByRole('searchbox', {name: '搜索章节和知识点'})).toHaveValue('RAG');
  await expect(page.locator('[data-result-chapter="c06"]')).toHaveCount(6);
  await expect(page.locator('.reader-layout')).not.toBeVisible();
});

test('switching the quantization assumptions to Chinese keeps the explanation open', async ({page}) => {
  await page.goto('/?lang=en&view=labs&place=quantization&bits=4&context=32768&budget=48');
  await expect(page.locator('.memory-total strong')).toHaveText('45.6');
  await page.locator('#assumptions-open').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('combobox', {name: 'Language', exact: true}).selectOption('zh');
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page).toHaveURL(url => url.searchParams.get('lang') === 'zh' && url.searchParams.get('view') === 'labs' && url.searchParams.get('place') === 'quantization' && url.searchParams.get('dialog') === 'assumptions');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('heading', {name: '把估算拆开看', exact: true})).toBeVisible();
  await expect(dialog.locator('.source-links')).toBeVisible();
  await expect(page.locator('#context-select')).toHaveValue('32768');
  await expect(page.locator('#budget-select')).toHaveValue('48');
  await expect(page.locator('.memory-total strong')).toHaveText('45.6');
});

test('atlas and lab logos preserve explicit English when the saved preference is Chinese', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('ai-world-language', 'zh'));
  for (const entry of ['/?lang=en', '/?lang=en&view=labs&place=token']) {
    await page.goto(entry);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    expect(await page.evaluate(() => localStorage.getItem('ai-world-language'))).toBe('zh');
    await page.getByRole('link', {name: 'AI World home', exact: true}).click();
    await expect(page).toHaveURL(url => url.pathname === '/' && url.searchParams.get('lang') === 'en' && !url.searchParams.has('view'));
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('#atlas-map')).toBeVisible();
    await expect(page.getByRole('heading', {level: 1})).toHaveText('From a model’s first steps to your first project.');
  }
});
