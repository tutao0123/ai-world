import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {coreChapters} from './curriculum-core.ts';
import {advancedChapters} from './curriculum-advanced.ts';
import {chapterPlaces,regionPlaces,atlasMapMarkup} from './atlas-map.ts';
import {topicSourceIndex} from './source-index.ts';

const chapters=[...coreChapters,...advancedChapters];
const source=JSON.parse(readFileSync(new URL('../docs/source-manifest.json',import.meta.url),'utf8')) as {
  version:string;identical:boolean;sourceHashes:Record<string,string>;paragraphCount:number;
  paragraphs:{id:string;style:string;text:string}[];
};
const paragraphIds=new Set(source.paragraphs.map(p=>p.id));
const subsectionHeadings=source.paragraphs.filter(p=>/heading 3/i.test(p.style)&&/^\d+\.\d+\s/.test(p.text));

test('the import manifest records matching source hashes and complete paragraph IDs',()=>{
  assert.equal(source.identical,true);
  assert.equal(Object.keys(source.sourceHashes).length,2);
  assert.equal(new Set(Object.values(source.sourceHashes)).size,1);
  assert.equal(source.version,'v1.0.4');
  assert.equal(source.paragraphCount,source.paragraphs.length);
  assert.equal(paragraphIds.size,source.paragraphs.length);
});
test('every numbered source subsection is represented exactly once',()=>{
  const topics=chapters.flatMap(c=>c.topics);
  const expected=subsectionHeadings.map(p=>p.text.match(/^(\d+\.\d+)/)![1]);
  assert.equal(chapters.length,13);
  assert.equal(topics.length,101);
  assert.deepEqual(new Set(topics.map(t=>t.id)),new Set(expected));
  assert.equal(new Set(topics.map(t=>t.id)).size,topics.length);
  assert.deepEqual(new Set(Object.keys(topicSourceIndex)),new Set(expected));
  for(const chapter of chapters){
    assert.equal(chapter.id,`c${String(chapter.number).padStart(2,'0')}`);
    assert.ok(source.paragraphs.some(p=>p.text===chapter.sourceHeading));
    for(const topic of chapter.topics){
      assert.ok(topic.id.startsWith(`${chapter.number}.`));
      const heading=subsectionHeadings.find(p=>p.text.startsWith(`${topic.id} `))!;
      assert.ok(topic.sourceIds.includes(heading.id),`Missing original heading for ${topic.id}`);
      for(const id of topic.sourceIds)assert.ok(paragraphIds.has(id),`${topic.id} unknown source ${id}`);
      assert.ok(topic.summary.length>35,`${topic.id} needs an explanation`);
      assert.ok(topic.example.length>12,`${topic.id} needs a concrete example`);
    }
  }
});
test('search preserves original English concept names even when display titles are shortened',()=>{
  for(const [topic,term] of [['8.9','LLMOps'],['8.9','AgentOps'],['12.7','Plan'],['12.7','Review'],['12.4','Context']]){
    const entry=topicSourceIndex[topic];
    assert.ok([entry.title,...entry.terms].some(t=>t.includes(term)),`Missing source search term ${term}`);
  }
});
test('map places, regions, and keyboard landmarks match the curriculum',()=>{
  const markup=atlasMapMarkup();
  assert.deepEqual(new Set(chapterPlaces.map(p=>p.id)),new Set(chapters.map(c=>c.id)));
  assert.deepEqual(new Set(regionPlaces.map(p=>p.id)),new Set(chapters.map(c=>c.region)));
  assert.equal(regionPlaces.length,4);
  for(const chapter of chapters){
    assert.equal(chapterPlaces.find(p=>p.id===chapter.id)!.region,chapter.region);
    assert.equal((markup.match(new RegExp(`data-chapter="${chapter.id}"`,'g'))??[]).length,1);
  }
  assert.equal((markup.match(/tabindex="0"/g)??[]).length,13);
});
test('each chapter has one valid challenge and reference URLs use safe protocols',()=>{
  for(const chapter of chapters){
    assert.equal(chapter.takeaways.length,3);
    assert.equal(chapter.quiz.options.length,3);
    assert.equal(new Set(chapter.quiz.options).size,3);
    assert.ok(Number.isInteger(chapter.quiz.answer)&&chapter.quiz.answer>=0&&chapter.quiz.answer<3);
    assert.ok(chapter.quiz.explanation.length>15);
    for(const ref of chapter.references)assert.equal(new URL(ref.url).protocol,'https:');
    for(const id of chapter.sourceIds)assert.ok(paragraphIds.has(id));
    for(const lab of chapter.labs)assert.ok(['token','embedding','transformer','llm','quantization'].includes(lab));
  }
});
