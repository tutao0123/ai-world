import {t, localized} from './i18n.ts';
export type Precision = 4 | 8 | 16 | 32;
export type Budget = 24 | 48 | 80;
export type LessonId = 'token' | 'embedding' | 'transformer' | 'llm' | 'quantization';

export type MemoryEstimate = {
  weightsGiB: number;
  kvGiB: number;
  overheadGiB: number;
  totalGiB: number;
};

/**
 * Teaching estimate, not a deployment or performance prediction.
 * Rounded 70B parameters; Llama 3.1 70B-style GQA geometry; batch 1;
 * full-length FP16 KV cache; a deliberately assumed 3 GiB reserve.
 * Quantization metadata and actual activation/runtime peaks are not modeled.
 * See docs/learning-model.md for sources and assumptions.
 */
export function estimateMemory(bits: Precision, contextTokens: number): MemoryEstimate {
  if (![4, 8, 16, 32].includes(bits)) {
    throw new RangeError('Weight precision must be 4, 8, 16, or 32 bits.');
  }
  if (!Number.isSafeInteger(contextTokens) || contextTokens < 1 || contextTokens > 131_072) {
    throw new RangeError('Context must be an integer from 1 to 131072 tokens.');
  }

  const bytesPerGiB = 2 ** 30;
  const weightsGiB = (70e9 * bits) / 8 / bytesPerGiB;
  // Two tensors (K and V) × layers × KV heads × head dimension × FP16 bytes.
  const kvBytesPerToken = 2 * 80 * 8 * 128 * 2;
  const kvGiB = (kvBytesPerToken * contextTokens) / bytesPerGiB;
  const overheadGiB = 3;

  return { weightsGiB, kvGiB, overheadGiB, totalGiB: weightsGiB + kvGiB + overheadGiB };
}

type Lesson = {
  eyebrow: string;
  title: string;
  description: string;
  insight: string;
  challenge: string;
};

export const lessons: Record<LessonId, Lesson> = {
  token: {
    eyebrow: '01 · TOKEN VILLAGE',
    title: t('Token 村'),
    description: t('一句话从这里出发。分词器先把文字转换成一串 token ID，模型才能处理它。'),
    insight: t('Token 不一定是一个字或一个词。切法取决于分词器，标点和空格也可能参与其中。'),
    challenge: t('拆开一句话，看看它如何变成小块。'),
  },
  embedding: {
    eyebrow: '02 · EMBEDDING VALLEY',
    title: t('向量谷'),
    description: t('Token ID 在这里找到对应的向量：一组可以参与计算的数字。模型随后继续结合上下文更新表示。'),
    insight: t('这张二维小地图只是示意。真实向量通常有很多维，相似度也取决于模型和任务。'),
    challenge: t('看看词语在示意地图里如何靠近彼此。'),
  },
  transformer: {
    eyebrow: '03 · TRANSFORMER RIDGE',
    title: t('注意力山脉'),
    description: t('注意力让当前位置参考相关上下文；前馈网络等模块再继续加工这些信息，多层配合构成 Transformer。'),
    insight: t('注意力不是人的意识。在生成式语言模型中，当前位置通常只能参考自己和前面的 token。'),
    challenge: t('点亮一句话中的联系，找出有用的上下文。'),
  },
  llm: {
    eyebrow: '04 · LLM CITY',
    title: t('大模型城'),
    description: t('生成式语言模型根据已有上下文，计算下一个 token 的分布，再按生成策略选出一个，反复续写。'),
    insight: t('接得顺不等于说得对。语言模型会犯错，重要事实仍需要可靠来源来核实。'),
    challenge: t('试着续写一句话，观察多个可能的下一步。'),
  },
  quantization: {
    eyebrow: '05 · QUANTIZATION MINE',
    title: t('量化矿山'),
    description: t('70B 表示约 700 亿个参数。降低权重的存储位数可以缩小权重占用，但运行时还要给缓存等内容留位置。'),
    insight: t('4-bit 改变的是权重的表示精度，不是把 70B 变成更少的参数；量化也可能影响输出质量。'),
    challenge: t('调节精度、上下文和内存预算，让教学估算落入预算。'),
  },
};

export const sources = [
  {
    title: t('Meta · Llama 3.1 70B 架构参数'),
    url: 'https://github.com/meta-llama/llama-models/blob/main/models/sku_list.py',
  },
  {
    title: t('Hugging Face · KV Cache 的工作方式'),
    url: 'https://huggingface.co/docs/transformers/cache_explanation',
  },
  {
    title: t('Hugging Face · 权重量化与数据类型'),
    url: 'https://huggingface.co/docs/transformers/quantization/bitsandbytes',
  },
] as const;
