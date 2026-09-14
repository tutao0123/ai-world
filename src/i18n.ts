import {englishUi} from './ui-en.ts';

export type Locale = 'zh' | 'en';
const isLocale = (value: unknown): value is Locale => value === 'zh' || value === 'en';

/** Shared links override saved preferences; a first visit follows the browser language. */
export function resolveLocale(search: string, saved: string | null, languages: readonly string[]): Locale {
  const requested = new URLSearchParams(search).get('lang');
  if (isLocale(requested)) return requested;
  if (isLocale(saved)) return saved;
  return languages[0]?.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

function initialLocale(): Locale {
  if (typeof window === 'undefined') return 'zh';
  let saved: string | null = null;
  try { saved = localStorage.getItem('ai-world-language'); } catch { /* Optional preference. */ }
  return resolveLocale(location.search, saved, navigator.languages);
}
export const locale = initialLocale();
const escapePattern = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const copyPattern = new RegExp(Object.keys(englishUi).sort((a, b) => b.length - a.length).map(escapePattern).join('|'), 'g');

/** Only explicitly authored, trusted interface strings are translated. No DOM mutation or online translation. */
export function translate(text: string, language: Locale): string {
  if (language === 'zh') return text;
  return englishUi[text] ?? text.replace(copyPattern, key => englishUi[key]);
}
export const t = (text: string): string => translate(text, locale);

/** Localize static template segments; dynamic curriculum content is translated by stable topic IDs. */
export function localized(strings: TemplateStringsArray, ...values: unknown[]): string {
  return strings.reduce((result, segment, index) => result + t(segment) + (index < values.length ? String(values[index]) : ''), '');
}

export function languagePicker(): string {
  return `<label class="language-picker"><span aria-hidden="true">◎</span><select data-language aria-label="${locale === 'en' ? 'Language' : '语言'}"><option value="zh" ${locale === 'zh' ? 'selected' : ''}>中文</option><option value="en" ${locale === 'en' ? 'selected' : ''}>English</option></select></label>`;
}

let snapshot: () => Record<string, string> = () => ({});
export function registerLocaleState(readState: () => Record<string, string>): void { snapshot = readState; }

export function initLanguageUI(): void {
  document.documentElement.lang = locale === 'en' ? 'en' : 'zh-CN';
  document.documentElement.dataset.locale = locale;
  document.title = locale === 'en' ? 'AI World · An interactive guide to AI' : 'AI World · 探索 AI 入行知识地图';
  const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (description && locale === 'en') description.content = 'Explore AI through four regions, thirteen chapters and 101 topics. Follow a learning route, try interactive labs and collect discoveries with Xiaotao.';
  document.addEventListener('change', event => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement) || !target.hasAttribute('data-language') || !isLocale(target.value)) return;
    const next = target.value;
    if (next === locale) return;
    try { localStorage.setItem('ai-world-language', next); } catch { /* URL carries the choice if storage is unavailable. */ }
    const url = new URL(location.href);
    url.searchParams.set('lang', next);
    for (const [key, value] of Object.entries(snapshot())) url.searchParams.set(key, value);
    location.assign(url.href);
  });
}
