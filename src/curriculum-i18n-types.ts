import type {Chapter, Topic} from './curriculum-types';

/** Translations retain canonical IDs, source anchors, references and quiz answers. */
export type ChapterTranslation = Pick<Chapter, 'title' | 'subtitle' | 'summary' | 'takeaways' | 'quiz' | 'sourceHeading'> & {
  topics: Pick<Topic, 'id' | 'title' | 'summary' | 'example'>[];
  referenceTitles?: string[];
};
