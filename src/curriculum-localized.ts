import {coreChapters} from './curriculum-core.ts';
import {advancedChapters} from './curriculum-advanced.ts';
import {englishFoundations} from './curriculum-en-foundations.ts';
import {englishApplications} from './curriculum-en-applications.ts';
import {englishAdvanced} from './curriculum-en-advanced.ts';
import type {Chapter} from './curriculum-types';
import type {Locale} from './i18n';

export const chineseChapters: Chapter[] = [...coreChapters, ...advancedChapters].sort((a,b) => a.number-b.number);
export const englishTranslations = {...englishFoundations, ...englishApplications, ...englishAdvanced};

export function getChapters(language: Locale): Chapter[] {
  if (language === 'zh') return chineseChapters;
  return chineseChapters.map(chapter => {
    const translated = englishTranslations[chapter.id];
    if (!translated) throw new Error(`Missing English chapter: ${chapter.id}`);
    return {
      ...chapter,
      ...translated,
      topics: chapter.topics.map(topic => {
        const copy = translated.topics.find(item => item.id === topic.id);
        if (!copy) throw new Error(`Missing English topic: ${topic.id}`);
        return {...topic, ...copy};
      }),
      references: chapter.references.map((reference, index) => ({...reference, title: translated.referenceTitles?.[index] ?? reference.title})),
    };
  });
}
