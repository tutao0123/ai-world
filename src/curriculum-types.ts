export type RegionId = 'foundations' | 'applications' | 'systems' | 'practice';
export type ChapterId = 'c01' | 'c02' | 'c03' | 'c04' | 'c05' | 'c06' | 'c07' | 'c08' | 'c09' | 'c10' | 'c11' | 'c12' | 'c13';
export type LabId = 'token' | 'embedding' | 'transformer' | 'llm' | 'quantization';
export interface Topic {
  id: string; // Original subsection number, such as 3.2.
  title: string;
  summary: string; // Two to four approachable source-grounded sentences.
  example: string; // One concrete example or action, not a new performance claim.
  sourceIds: string[]; // Paragraph IDs from docs/sources/ai-entry-map-v1.0.4.json.
}
export interface Chapter {
  id: ChapterId;
  number: number;
  region: RegionId;
  title: string; // Short canonical chapter topic, not the geographic nickname.
  subtitle: string;
  summary: string;
  takeaways: string[]; // Exactly three.
  topics: Topic[];
  quiz: {question: string; options: [string,string,string]; answer: number; explanation: string};
  sourceHeading: string;
  sourceIds: string[];
  references: {title: string; url: string}[]; // Selected links already present in source.
  labs: LabId[];
}
