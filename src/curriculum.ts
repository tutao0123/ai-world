import {t, locale} from './i18n.ts';
import {getChapters} from './curriculum-localized.ts';
import type {Chapter, ChapterId, RegionId} from './curriculum-types';

export const chapters: Chapter[] = getChapters(locale);
export const topicCount = chapters.reduce((sum, chapter)=>sum+chapter.topics.length,0);
export const regions: {id: RegionId;title:string;shortTitle:string;description:string}[] = [
  {id:'foundations',title:t('模型起源大陆'),shortTitle:t('模型从哪里来'),description:t('从 AI 的系统坐标，到学习、Transformer 与训练生命周期。')},
  {id:'applications',title:t('应用群岛'),shortTitle:t('能力怎样进入产品'),description:t('用上下文、检索、工具和评测，把模型接入真实任务。')},
  {id:'systems',title:t('技术与治理海岸'),shortTitle:t('重要专题'),description:t('多模态、算力、开源与安全，决定系统的能力和边界。')},
  {id:'practice',title:t('实践远航湾'),shortTitle:t('进入真实工作'),description:t('从管理编码智能体，到选择方向、完成作品与形成判断。')},
];
export const learningRoutes: {id:string;title:string;description:string;chapters:ChapterId[]}[] = [
  {id:'all',title:t('完整探索'),description:t('按原文顺序建立完整地图，再决定在哪个方向深入。'),chapters:chapters.map(c=>c.id)},
  {id:'product',title:t('产品与业务'),description:t('先把系统拆清楚，再看知识、行动、评测、治理和价值。'),chapters:['c01','c05','c06','c07','c08','c11','c13']},
  {id:'builder',title:t('应用开发'),description:t('从模型直觉出发，把 Prompt、RAG 和 Agent 接进一个真实项目。'),chapters:['c03','c04','c05','c06','c07','c08','c12']},
  {id:'research',title:t('算法与模型'),description:t('深入学习过程、模型架构、训练、多模态和计算资源。'),chapters:['c02','c03','c04','c09','c10']},
  {id:'systems',title:t('系统与基础设施'),description:t('先建立模型直觉，再关注生产化、资源和开发工作流。'),chapters:['c01','c02','c03','c04','c08','c10','c12']},
];
export const sourceVersion='v1.0.4';
export const sourceTitle=t('AI 入行知识地图');
export const labTitles={token:t('Token 村'),embedding:t('向量河谷'),transformer:t('注意力山脉'),llm:t('大模型之城'),quantization:t('量化矿岛')};
