import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveLocale, translate} from './i18n.ts';
import {chineseChapters, englishTranslations, getChapters} from './curriculum-localized.ts';

test('an explicit shared-link language overrides saved and browser preferences', () => {
  assert.equal(resolveLocale('?lang=en', 'zh', ['zh-CN']), 'en');
  assert.equal(resolveLocale('?view=labs&lang=zh&bits=4', 'en', ['en-US']), 'zh');
});

test('a valid saved choice wins when the URL language is absent or unsupported', () => {
  assert.equal(resolveLocale('', 'en', ['zh-TW']), 'en');
  assert.equal(resolveLocale('?lang=fr', 'zh', ['en-GB']), 'zh');
  assert.equal(resolveLocale('?lang=', 'zh', ['en-US']), 'zh');
});

test('without storage, the primary browser language selects Chinese or English', () => {
  // This pure function runs in Node with no window, navigator, or localStorage.
  assert.equal(resolveLocale('', null, ['zh-CN', 'en-US']), 'zh');
  assert.equal(resolveLocale('', null, ['ZH-Hant-TW']), 'zh');
  assert.equal(resolveLocale('', null, ['en-US', 'zh-CN']), 'en');
  assert.equal(resolveLocale('?lang=invalid', 'invalid', ['fr-FR']), 'en');
  assert.equal(resolveLocale('', null, []), 'en');
});

test('interface translation preserves Chinese mode, unknown text, and numerical content', () => {
  const source = '上下文长度';
  assert.equal(translate(source, 'zh'), source);
  assert.equal(translate(source, 'en'), 'Context length');
  const formula = '70 × 10⁹ × 4 ÷ 8 ÷ 2³⁰ ≈ 32.6 GiB';
  assert.equal(translate(formula, 'en'), formula);
  assert.equal(translate('A custom user query: order_123', 'en'), 'A custom user query: order_123');
});

test('English covers all thirteen chapters and all 101 source topics exactly once', () => {
  const english = getChapters('en');
  assert.equal(english.length, 13);
  assert.equal(english.flatMap(chapter => chapter.topics).length, 101);
  assert.deepEqual(Object.keys(englishTranslations).sort(), chineseChapters.map(chapter => chapter.id).sort());
  assert.deepEqual(english.map(chapter => chapter.id), chineseChapters.map(chapter => chapter.id));
  assert.equal(new Set(english.flatMap(chapter => chapter.topics.map(topic => topic.id))).size, 101);
  for (const source of chineseChapters) {
    const copy = englishTranslations[source.id];
    assert.deepEqual(copy.topics.map(topic => topic.id), source.topics.map(topic => topic.id), source.id);
    assert.equal(copy.takeaways.length, 3, source.id);
    assert.equal(copy.quiz.options.length, 3, source.id);
    assert.equal(new Set(copy.quiz.options).size, 3, source.id);
    if (copy.referenceTitles) assert.equal(copy.referenceTitles.length, source.references.length, source.id);
  }
});

test('localization preserves identifiers, source anchors, reference URLs, labs, and quiz answers', () => {
  const before = JSON.stringify(chineseChapters);
  const english = getChapters('en');
  assert.strictEqual(getChapters('zh'), chineseChapters);
  for (const [index, source] of chineseChapters.entries()) {
    const copy = english[index];
    assert.deepEqual(
      {id: copy.id, number: copy.number, region: copy.region, sourceIds: copy.sourceIds, labs: copy.labs},
      {id: source.id, number: source.number, region: source.region, sourceIds: source.sourceIds, labs: source.labs},
    );
    assert.deepEqual(copy.references.map(reference => reference.url), source.references.map(reference => reference.url));
    assert.equal(copy.quiz.answer, source.quiz.answer, source.id);
    assert.deepEqual(copy.topics.map(topic => ({id: topic.id, sourceIds: topic.sourceIds})), source.topics.map(topic => ({id: topic.id, sourceIds: topic.sourceIds})));
  }
  assert.equal(JSON.stringify(chineseChapters), before, 'Building English chapters must not mutate Chinese source content');
});

test('every English chapter, explanation, example, quiz, and reference title is present without Han text', () => {
  for (const chapter of getChapters('en')) {
    const visible = [
      chapter.title, chapter.subtitle, chapter.summary, chapter.sourceHeading, ...chapter.takeaways,
      chapter.quiz.question, ...chapter.quiz.options, chapter.quiz.explanation,
      ...chapter.references.map(reference => reference.title),
      ...chapter.topics.flatMap(topic => [topic.title, topic.summary, topic.example]),
    ];
    for (const text of visible) {
      assert.ok(text.trim().length > 0, `${chapter.id} has an empty visible field`);
      assert.doesNotMatch(text, /\p{Script=Han}/u, `${chapter.id} still contains Chinese display text`);
    }
  }
});
