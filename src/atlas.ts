import {t, localized, locale, languagePicker, registerLocaleState} from './i18n.ts';
import './atlas.css';
import {atlasMapMarkup,chapterPlaces} from './atlas-map';
import {chapters,regions,learningRoutes,topicCount,sourceVersion,sourceTitle,labTitles} from './curriculum';
import type {Chapter,ChapterId,LabId,RegionId} from './curriculum-types';
import {topicSourceIndex} from './source-index';

const escape=(value:string)=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]!));
const mapIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Z"/><path d="M9 3v16M15 5v16"/></svg>';
const arrow='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>';
const searchIcon='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg>';
const chapterById=(id:ChapterId)=>chapters.find(c=>c.id===id)!;
const number=(n:number)=>String(n).padStart(2,'0');

export function mountAtlas({onOpenLab}:{onOpenLab:(id:LabId)=>void}) {
  const app=document.querySelector<HTMLDivElement>('#app')!;
  document.title=t('AI World · 探索 AI 入行知识地图');
  const abort=new AbortController();
  let selected:ChapterId='c01';
  let filter:RegionId|'all'='all';
  let itinerary='all';
  let searchTerm='';
  let completed=new Set<ChapterId>();
  let visitedLabs=new Set<string>();
  const localeParams = new URLSearchParams(location.search);
  if(chapters.some(c=>c.id===localeParams.get('chapter')))selected=localeParams.get('chapter') as ChapterId;
  if(regions.some(r=>r.id===localeParams.get('region')))filter=localeParams.get('region') as RegionId;
  if(learningRoutes.some(r=>r.id===localeParams.get('route')))itinerary=localeParams.get('route')!;
  searchTerm=localeParams.get('search')??'';
  try {
    const parsed:unknown=JSON.parse(localStorage.getItem('ai-world-chapters-v1')??'[]');
    if(Array.isArray(parsed))completed=new Set(parsed.filter((id):id is ChapterId=>chapters.some(c=>c.id===id)));
    const labs:unknown=JSON.parse(localStorage.getItem('ai-world-passport-v1')??'[]');
    if(Array.isArray(labs))visitedLabs=new Set(labs.filter(id=>typeof id==='string'&&id in labTitles));
  }catch{/* Local persistence is optional. */}

  app.innerHTML=localized`<header class="site-header atlas-header"><a class="brand" href="/?lang=${locale}" aria-label="AI World 首页"><span class="brand-icon">${mapIcon}</span><span>AI WORLD<small>一张可以走进去的 AI 地图</small></span></a><nav aria-label="主导航"><button class="nav-current" id="atlas-home">世界全图</button><button id="atlas-labs">实验小径 <span class="nav-badge">5</span></button><button id="atlas-passport">探索护照 <span id="atlas-count">${completed.size}/13</span></button></nav>${languagePicker()}<span class="edition">KNOWLEDGE ATLAS <b>${sourceVersion.toUpperCase()}</b></span></header>
  <main class="atlas-main"><section class="intro atlas-intro"><div><p class="eyebrow"><span class="live-dot"></span> FROM UNDERSTANDING TO BUILDING</p><h1>从模型的诞生，走到你的第一份作品。</h1><p>沿着《${sourceTitle}》探索四片区域。每个概念，都有它解决的问题和使用的边界。</p></div><div class="atlas-stat"><strong>13<span>章</span></strong><i></i><strong>${topicCount}<span>知识点</span></strong></div></section>
  <div class="atlas-toolbar"><div class="region-tabs" role="group" aria-label="突出显示地图区域"><button class="active" data-region-filter="all" aria-pressed="true">全世界</button>${regions.map(r=>`<button data-region-filter="${r.id}" aria-pressed="false">${r.title}</button>`).join('')}</div><button id="atlas-search" aria-label="搜索知识地图" aria-keyshortcuts="Control+K Meta+K">${searchIcon}<span>搜索 Token、RAG、MCP…</span><kbd>⌘ / Ctrl K</kbd></button></div>
  <div class="workspace atlas-workspace"><section class="map-panel atlas-map-panel" aria-label="十三章 AI 世界地图"><div class="map-caption"><span>✥ AI 世界全图</span><small>FOLLOW A QUESTION. FIND YOUR WAY.</small></div><div id="atlas-viewport" class="map-viewport" tabindex="0" aria-label="世界地图。Tab 选择章节，Enter 打开；空白处方向键平移，滚轮或按钮缩放。">${atlasMapMarkup()}</div><div class="map-bottom"><span class="map-hint"><span class="desktop-map-hint">拖动探索 · 点击地标 · Enter 打开章节</span><span class="mobile-map-hint">放大查看地标 · 点击探索</span></span><div class="map-controls"><button id="atlas-zoom-out" aria-label="缩小世界地图">−</button><output id="atlas-zoom-level">100%</output><button id="atlas-zoom-in" aria-label="放大世界地图">＋</button><button id="atlas-reset" aria-label="重置世界地图">⌖</button></div></div></section><aside id="chapter-panel" class="explorer-panel chapter-panel" aria-label="章节介绍"></aside></div>
  <section class="atlas-itinerary" aria-label="学习路线"><div class="itinerary-header"><div><span class="eyebrow">CHOOSE YOUR EXPEDITION</span><h2>从你的目标，选择一条路线。</h2></div><label class="route-select-label" for="learning-route">学习方向 <select id="learning-route">${learningRoutes.map(r=>`<option value="${r.id}">${r.title}</option>`).join('')}</select></label></div><p id="itinerary-description"></p><div id="itinerary-stops"></div></section>
  <section class="atlas-source-strip"><span>内容依据 <b>《${sourceTitle}》${sourceVersion}</b></span><span>原文结构 → 地图探索 → 理解挑战 <button id="atlas-about">内容与版本说明 ↗</button></span></section></main>
  <footer class="site-footer"><span>Created by <b>Tao</b> <span class="footer-slash">/</span> 小淘带你探索</span><span>世界地图与实验小径 · 交互学习原型</span></footer>
  <dialog id="atlas-dialog" class="atlas-dialog" aria-labelledby="atlas-dialog-title"><div class="atlas-dialog-toolbar">${languagePicker()}<button id="atlas-dialog-close" class="dialog-close" aria-label="关闭探索窗口">×</button></div><div id="atlas-dialog-content"></div></dialog><div id="toast" role="status" aria-live="polite"></div>`;

  const panel=app.querySelector<HTMLElement>('#chapter-panel')!;
  const dialog=app.querySelector<HTMLDialogElement>('#atlas-dialog')!;
  const dialogContent=app.querySelector<HTMLElement>('#atlas-dialog-content')!;
  const viewport=app.querySelector<HTMLElement>('#atlas-viewport')!;
  const svg=viewport.querySelector<SVGSVGElement>('svg')!;
  function openDialog(content:string,kind:'reader'|'search'|'passport'|'about') {
    const url=new URL(location.href);
    if(url.searchParams.has('dialog'))url.searchParams.set('dialog',kind);
    if(kind!=='reader'&&url.hash.startsWith('#chapter/'))url.hash='';
    history.replaceState(null,'',url.pathname+url.search+url.hash);
    dialogContent.innerHTML=content;
    dialog.classList.toggle('reader-dialog',kind==='reader');
    dialog.classList.toggle('search-dialog',kind==='search');
    dialog.dataset.view=kind;
    if(!dialog.open)dialog.showModal();
    dialog.scrollTop=0;
  }
  function closeDialog(){
    const url=new URL(location.href);
    url.searchParams.delete('dialog');
    if(url.hash.startsWith('#chapter/'))url.hash='';
    history.replaceState(null,'',url.pathname+url.search+url.hash);
    dialog.close(); // Native dialog restores focus synchronously; do not steal the next Tab in a queued close event.
  }
  app.querySelector('#atlas-dialog-close')!.addEventListener('click',closeDialog);
  dialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();closeDialog();}},{capture:true});
  dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog();});
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeDialog();}});
  function goLab(id:LabId){if(dialog.open)closeDialog();abort.abort();onOpenLab(id);}
  function selectChapter(id:ChapterId,{scroll=false}={}) {
    selected=id;renderPanel();updateProgress();
    if(scroll&&innerWidth<900)panel.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  }
  function renderPanel(){
    const chapter=chapterById(selected);
    const place=chapterPlaces.find(p=>p.id===selected)!;
    const region=regions.find(r=>r.id===chapter.region)!;
    panel.innerHTML=localized`<div class="place-heading"><span class="eyebrow">CHAPTER ${number(chapter.number)} / 13</span><span class="place-stamp ${completed.has(selected)?'earned':''}">${completed.has(selected)?t('已盖章 ✓'):t('等待发现')}</span></div><p class="chapter-region">${region.title} · ${place.title}</p><h2>${escape(chapter.title)}</h2><p class="chapter-question">${escape(chapter.subtitle)}</p><div class="guide-note"><img src="/xiaotao.png" alt="向导小淘"/><p>${escape(chapter.summary)}</p></div><div class="chapter-discoveries"><span class="eyebrow">你将带走的三个发现</span><ol>${chapter.takeaways.map(t=>`<li>${escape(t)}</li>`).join('')}</ol></div><div class="chapter-meta"><span>${chapter.topics.length} 个知识点</span><span>1 个理解挑战</span>${chapter.labs.length?localized`<span>${chapter.labs.length} 处实验</span>`:''}</div><button class="primary-button" id="chapter-open">进入这一章 ${arrow}</button>${chapter.labs.length?localized`<button class="chapter-lab-link" data-open-lab="${chapter.labs[0]}">去${labTitles[chapter.labs[0]]}动手试试 ↗</button>`:''}<div class="field-note"><span>✧</span><p>先想一个你要解决的问题，再读概念。地图上的道路是学习路线，不是必须依次解锁的关卡。</p></div>`;
    panel.querySelector('#chapter-open')!.addEventListener('click',()=>openChapter(selected));
    panel.querySelector<HTMLButtonElement>('[data-open-lab]')?.addEventListener('click',event=>goLab((event.currentTarget as HTMLElement).dataset.openLab as LabId));
  }
  function updateProgress(){
    app.querySelector('#atlas-count')!.textContent=`${completed.size}/13`;
    app.querySelectorAll<SVGElement>('[data-chapter]').forEach(el=>{const id=el.dataset.chapter as ChapterId;el.classList.toggle('is-selected',id===selected);el.classList.toggle('is-complete',completed.has(id));el.setAttribute('aria-pressed',String(id===selected));});
    app.querySelectorAll<HTMLElement>('[data-itinerary]').forEach(el=>{el.classList.toggle('is-selected',el.dataset.itinerary===selected);el.classList.toggle('is-complete',completed.has(el.dataset.itinerary as ChapterId));});
  }
  function renderItinerary(){
    const route=learningRoutes.find(r=>r.id===itinerary)!;
    app.querySelector('#itinerary-description')!.textContent=route.description;
    const stops=app.querySelector('#itinerary-stops')!;
    stops.innerHTML=route.chapters.map(id=>{const c=chapterById(id);return `<button data-itinerary="${id}"><span>${number(c.number)}</span><b>${escape(c.title)}</b>${completed.has(id)?'<small>✓</small>':''}</button>`;}).join('<span class="itinerary-arrow" aria-hidden="true">→</span>');
    stops.querySelectorAll<HTMLElement>('[data-itinerary]').forEach(el=>el.addEventListener('click',()=>selectChapter(el.dataset.itinerary as ChapterId,{scroll:true})));
    updateProgress();
  }
  function markComplete(chapter:Chapter){
    const fresh=!completed.has(chapter.id);completed.add(chapter.id);
    try{localStorage.setItem('ai-world-chapters-v1',JSON.stringify([...completed]));}catch{/* Keep working without storage. */}
    renderPanel();renderItinerary();
    dialogContent.querySelector('.reader-completion')!.textContent=t('本章理解挑战已完成 ✓');
    if(fresh){const toast=app.querySelector<HTMLElement>('#toast')!;toast.textContent=completed.size===13?t('十三章挑战完成！带着地图，去做你的作品。'):localized`第 ${chapter.number} 章的发现，已收入探索护照。`;toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3200);}
  }
  function openChapter(id:ChapterId,topicId?:string){
    selectChapter(id);
    const c=chapterById(id);
    history.replaceState(null,'',`${location.pathname}${location.search}#chapter/${id}${topicId?'/'+encodeURIComponent(topicId):''}`);
    openDialog(localized`<div class="reader-heading"><span class="eyebrow">${regions.find(r=>r.id===c.region)!.title} / CHAPTER ${number(c.number)}</span><h2 id="atlas-dialog-title">${escape(c.title)}</h2><p>${escape(c.subtitle)}</p><span class="reader-source">原文第 ${c.number} 章 · ${c.topics.length} 个知识点 · ${sourceVersion}</span></div><div class="reader-layout"><nav class="reader-toc" aria-label="本章知识点目录"><span class="eyebrow">本章探索</span>${c.topics.map(t=>`<button data-jump-topic="${t.id}"><span>${t.id}</span>${escape(t.title)}</button>`).join('')}<button class="toc-challenge" data-jump-challenge>✧ 理解挑战</button></nav><article class="reader-body"><p class="reader-intro">${escape(c.summary)}</p>${c.topics.map((t,i)=>localized`<details class="topic-section" data-topic="${t.id}" ${t.id===topicId||(!topicId&&i===0)?'open':''}><summary><span>${t.id}</span><h3>${escape(t.title)}</h3><i aria-hidden="true">＋</i></summary><div class="topic-copy"><p>${escape(t.summary)}</p><div class="topic-example"><span>放进一个真实问题</span><p>${escape(t.example)}</p></div><small>依据原文 ${t.id} 节整理</small></div></details>`).join('')}<section class="reader-quiz" aria-label="本章理解挑战"><span class="eyebrow">TAKE ONE DISCOVERY WITH YOU</span><h3>${escape(c.quiz.question)}</h3><div class="reader-answers">${c.quiz.options.map((o,i)=>`<button data-chapter-answer="${i}"><span>${String.fromCharCode(65+i)}</span>${escape(o)}</button>`).join('')}</div><p class="reader-feedback" role="status"></p><small class="reader-completion">${completed.has(c.id)?t('本章理解挑战已完成 ✓'):t('回答正确后，为探索护照盖章。')}</small></section>${c.labs.length?localized`<section class="reader-labs"><span class="eyebrow">把概念放进实验</span>${c.labs.map(id=>`<button data-open-lab="${id}">${labTitles[id]} ${arrow}</button>`).join('')}</section>`:''}${c.references.length?localized`<section class="reader-references"><span class="eyebrow">继续阅读 · 原文所列资料</span>${c.references.filter(r=>/^https:\/\//.test(r.url)).map(r=>`<a href="${escape(r.url)}" target="_blank" rel="noopener noreferrer">${escape(r.title)} ↗</a>`).join('')}</section>`:''}<div class="reader-next"><span>探索可以自由跳转</span><button data-next-chapter="${c.number<13?chapters[c.number].id:'c01'}">${c.number<13?localized`下一章：${escape(chapters[c.number].title)}`:t('回到起点，重看全貌')} ${arrow}</button></div></article></div>`,'reader');
    dialogContent.querySelectorAll<HTMLButtonElement>('[data-jump-topic]').forEach(el=>el.addEventListener('click',()=>{
      const topic=dialogContent.querySelector<HTMLDetailsElement>(`[data-topic="${el.dataset.jumpTopic}"]`)!;
      topic.open=true;topic.scrollIntoView({block:'start',behavior:'instant'});
      history.replaceState(null,'',`${location.pathname}${location.search}#chapter/${id}/${el.dataset.jumpTopic}`);
    }));
    dialogContent.querySelector('[data-jump-challenge]')!.addEventListener('click',()=>dialogContent.querySelector('.reader-quiz')!.scrollIntoView({block:'start',behavior:'instant'}));
    dialogContent.querySelectorAll<HTMLButtonElement>('[data-chapter-answer]').forEach(el=>el.addEventListener('click',()=>{
      const right=Number(el.dataset.chapterAnswer)===c.quiz.answer;
      dialogContent.querySelectorAll('[data-chapter-answer]').forEach(b=>b.classList.remove('correct','incorrect'));
      el.classList.add(right?'correct':'incorrect');
      const feedback=dialogContent.querySelector<HTMLElement>('.reader-feedback')!;
      feedback.className=`reader-feedback ${right?'success':'retry'}`;
      feedback.textContent=right?c.quiz.explanation:t('再想一下：这个方案改变了什么，又没有保证什么？可以回到知识点再看看。');
      if(right)markComplete(c);
    }));
    dialogContent.querySelectorAll<HTMLElement>('[data-open-lab]').forEach(el=>el.addEventListener('click',()=>goLab(el.dataset.openLab as LabId)));
    dialogContent.querySelector<HTMLElement>('[data-next-chapter]')!.addEventListener('click',event=>openChapter((event.currentTarget as HTMLElement).dataset.nextChapter as ChapterId));
    if(topicId)dialogContent.querySelector<HTMLDetailsElement>(`[data-topic="${CSS.escape(topicId)}"]`)?.scrollIntoView({block:'start',behavior:'instant'});
  }
  function openSearch(){
    openDialog(localized`<span class="eyebrow">FIND YOUR NEXT DISCOVERY</span><h2 id="atlas-dialog-title">你想弄懂什么？</h2><label class="search-input-wrap">${searchIcon}<input id="knowledge-search" type="search" autocomplete="off" placeholder="试试 RAG、微调、MCP 或职业" aria-label="搜索章节和知识点" value="${escape(searchTerm)}"/></label><p class="search-summary" role="status"></p><div id="knowledge-results"></div>`,'search');
    const input=dialogContent.querySelector<HTMLInputElement>('#knowledge-search')!;
    input.addEventListener('input',()=>{searchTerm=input.value;renderResults();});
    renderResults();input.focus();
  }
  function renderResults(){
    const query=searchTerm.trim().toLocaleLowerCase();
    const matches=chapters.flatMap(c=>c.topics.map(t=>({chapter:c,topic:t}))).filter(({chapter:c,topic:t})=>!query||[c.title,c.summary,t.id,t.title,t.summary,t.example,topicSourceIndex[t.id]?.title??'',...(topicSourceIndex[t.id]?.terms??[])].some(s=>s.toLocaleLowerCase().includes(query)));
    dialogContent.querySelector('.search-summary')!.textContent=query?localized`找到 ${matches.length} 个相关知识点`:localized`全部 ${topicCount} 个知识点，输入关键词缩小范围。`;
    const container=dialogContent.querySelector('#knowledge-results')!;
    container.innerHTML=matches.length?matches.map(({chapter:c,topic:t})=>localized`<button data-result-chapter="${c.id}" data-result-topic="${t.id}"><span>第 ${c.number} 章 · ${escape(c.title)}</span><strong>${t.id} ${escape(t.title)}</strong><p>${escape(t.summary.slice(0,90))}${t.summary.length>90?'…':''}</p></button>`).join(''):t('<p class="search-empty">这张地图里暂时没有匹配项。试试更短的关键词，或回到全图选择章节。</p>');
    container.querySelectorAll<HTMLElement>('[data-result-chapter]').forEach(el=>el.addEventListener('click',()=>openChapter(el.dataset.resultChapter as ChapterId,el.dataset.resultTopic)));
  }
  function openPassport(){
    openDialog(localized`<span class="eyebrow">MY EXPLORER’S PASSPORT</span><h2 id="atlas-dialog-title">每个发现，都留下一个坐标。</h2><p>已完成 <b>${completed.size} / 13</b> 章理解挑战。实验小径另有 <b>${visitedLabs.size} / 5</b> 枚印章；原有进度已经保留。</p>${regions.map(r=>`<section class="passport-region"><h3>${r.title}</h3><div class="chapter-passport-grid">${chapters.filter(c=>c.region===r.id).map(c=>`<button data-passport-chapter="${c.id}" class="${completed.has(c.id)?'earned':''}"><span>${completed.has(c.id)?'✓':number(c.number)}</span><b>${escape(c.title)}</b><small>${completed.has(c.id)?t('已发现'):t('去探索 →')}</small></button>`).join('')}</div></section>`).join('')}<p class="dialog-note">印章表示完成了这里的理解挑战，不等于已经掌握全部知识。进度仅保存在当前浏览器。</p>`,'passport');
    dialogContent.querySelectorAll<HTMLElement>('[data-passport-chapter]').forEach(el=>el.addEventListener('click',()=>openChapter(el.dataset.passportChapter as ChapterId)));
  }
  function setRegion(next:typeof filter){
    filter=next;
    app.querySelectorAll<HTMLElement>('[data-region-filter]').forEach(el=>{const active=el.dataset.regionFilter===filter;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});
    svg.querySelectorAll<SVGElement>('[data-region]').forEach(el=>el.classList.toggle('is-faded',filter!=='all'&&el.dataset.region!==filter));
    if(filter!=='all')selectChapter(chapters.find(c=>c.region===filter)!.id);
  }
  app.querySelectorAll<HTMLElement>('[data-region-filter]').forEach(el=>el.addEventListener('click',()=>setRegion(el.dataset.regionFilter as typeof filter)));
  app.querySelector<HTMLSelectElement>('#learning-route')!.addEventListener('change',event=>{itinerary=(event.target as HTMLSelectElement).value;renderItinerary();selectChapter(learningRoutes.find(r=>r.id===itinerary)!.chapters[0]);});
  app.querySelector('#atlas-search')!.addEventListener('click',openSearch);
  app.querySelector('#atlas-passport')!.addEventListener('click',openPassport);
  app.querySelector('#atlas-labs')!.addEventListener('click',()=>goLab('token'));
  app.querySelector('#atlas-home')!.addEventListener('click',()=>{setRegion('all');resetView();viewport.scrollIntoView({block:'center',behavior:'instant'});});
  app.querySelector('#atlas-about')!.addEventListener('click',()=>openDialog(localized`<span class="eyebrow">ABOUT THIS EDITION</span><h2 id="atlas-dialog-title">一份知识地图，两种探索方式。</h2><p>内容依据《${sourceTitle}》${sourceVersion}，保留原文的四部分、十三章与 ${topicCount} 个编号小节。每节改写为问题、解释与具体例子，并增加一个章节理解挑战。</p><p>知识大陆帮助你建立全貌；实验小径保留了 Token、向量、注意力、续写与量化的五站互动。两种方式互相连接，可以自由跳转。</p><p>原文资料核查日期为 2026 年 8 月 31 日。此版是学习内容改编，未逐条重新核验所有外链及动态产品信息。产品能力、价格、许可和适用规则需要在使用时核实。</p><p>原文的图表没有作为图片粘贴进网页，当前地图与实验图解均由代码绘制。地貌表达学习关系，不是严格的 AI 架构依赖。</p><p class="dialog-note">Created by Tao · Guide: 小淘<br>进度保存在当前浏览器，无需登录。</p>`,'about'));
  window.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();openSearch();}},{signal:abort.signal});

  // Separate camera from the preserved five-stop experimental map.
  const camera={x:0,y:0,w:1400,h:900};let zoom=1;
  let pointer:{id:number;x:number;y:number;cx:number;cy:number;dragged:boolean}|null=null;
  let suppressClick=false;
  function updateCamera(){camera.x=Math.min(1400-camera.w+180,Math.max(-180,camera.x));camera.y=Math.min(900-camera.h+120,Math.max(-120,camera.y));svg.setAttribute('viewBox',`${camera.x} ${camera.y} ${camera.w} ${camera.h}`);app.querySelector('#atlas-zoom-level')!.textContent=`${Math.round(zoom*100)}%`;app.querySelector<HTMLButtonElement>('#atlas-zoom-out')!.disabled=zoom<=1;app.querySelector<HTMLButtonElement>('#atlas-zoom-in')!.disabled=zoom>=3;}
  function setZoom(next:number){const oldW=camera.w,oldH=camera.h;zoom=Math.max(1,Math.min(3,next));camera.w=1400/zoom;camera.h=900/zoom;camera.x+=(oldW-camera.w)/2;camera.y+=(oldH-camera.h)/2;updateCamera();}
  function resetView(){zoom=1;Object.assign(camera,{x:0,y:0,w:1400,h:900});updateCamera();}
  viewport.addEventListener('pointerdown',event=>{if(event.button!==0)return;pointer={id:event.pointerId,x:event.clientX,y:event.clientY,cx:camera.x,cy:camera.y,dragged:false};suppressClick=false;});
  viewport.addEventListener('pointermove',event=>{if(!pointer||event.pointerId!==pointer.id)return;const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;if(!pointer.dragged&&Math.hypot(dx,dy)>5){pointer.dragged=true;viewport.setPointerCapture(event.pointerId);viewport.classList.add('dragging');}if(pointer.dragged){const r=svg.getBoundingClientRect();const units=Math.max(camera.w/r.width,camera.h/r.height);camera.x=pointer.cx-dx*units;camera.y=pointer.cy-dy*units;updateCamera();}});
  function finishPointer(event:PointerEvent){
    if(pointer?.id!==event.pointerId)return;
    // Touch browsers can omit the synthetic click on SVG text. Handle a real tap
    // on pointerup, while preserving drag cancellation and keyboard activation.
    const tappedChapter=event.type==='pointerup'&&event.pointerType==='touch'&&!pointer.dragged
      ?(event.target as Element).closest<SVGElement>('[data-chapter]')?.dataset.chapter as ChapterId|undefined
      :undefined;
    suppressClick=pointer.dragged||Boolean(tappedChapter);
    if(viewport.hasPointerCapture(event.pointerId))viewport.releasePointerCapture(event.pointerId);
    pointer=null;viewport.classList.remove('dragging');
    if(tappedChapter)selectChapter(tappedChapter,{scroll:true});
  }
  viewport.addEventListener('pointerup',finishPointer);viewport.addEventListener('pointercancel',finishPointer);
  viewport.addEventListener('click',event=>{if(suppressClick){suppressClick=false;return;}const id=(event.target as Element).closest<SVGElement>('[data-chapter]')?.dataset.chapter as ChapterId|undefined;if(id)selectChapter(id,{scroll:true});});
  viewport.addEventListener('dblclick',event=>{const id=(event.target as Element).closest<SVGElement>('[data-chapter]')?.dataset.chapter as ChapterId|undefined;if(id)openChapter(id);});
  viewport.addEventListener('wheel',event=>{event.preventDefault();setZoom(zoom*(event.deltaY>0?.9:1.1));},{passive:false});
  viewport.addEventListener('keydown',event=>{const id=(event.target as Element).closest<SVGElement>('[data-chapter]')?.dataset.chapter as ChapterId|undefined;if(id&&(event.key==='Enter'||event.key===' ')){event.preventDefault();openChapter(id);return;}if(event.target!==viewport)return;const step=60/zoom;if(event.key==='ArrowLeft')camera.x-=step;else if(event.key==='ArrowRight')camera.x+=step;else if(event.key==='ArrowUp')camera.y-=step;else if(event.key==='ArrowDown')camera.y+=step;else if(event.key==='Home'){resetView();return;}else if(event.key==='+'||event.key==='='){setZoom(zoom+.25);return;}else if(event.key==='-'){setZoom(zoom-.25);return;}else return;event.preventDefault();updateCamera();});
  app.querySelector('#atlas-zoom-in')!.addEventListener('click',()=>setZoom(zoom+.25));app.querySelector('#atlas-zoom-out')!.addEventListener('click',()=>setZoom(zoom-.25));app.querySelector('#atlas-reset')!.addEventListener('click',resetView);
  const restoredSelection=selected;
  if(filter!=='all')setRegion(filter);
  selected=restoredSelection;
  app.querySelector<HTMLSelectElement>('#learning-route')!.value=itinerary;
  renderPanel();renderItinerary();updateCamera();
  const deepLink=location.hash.match(/^#chapter\/(c\d{2})(?:\/([\d.]+))?$/);
  if(localeParams.get('dialog')==='search')openSearch();
  else if(localeParams.get('dialog')==='passport')openPassport();
  else if(localeParams.get('dialog')==='about')app.querySelector<HTMLButtonElement>('#atlas-about')!.click();
  else if(deepLink&&chapters.some(c=>c.id===deepLink[1]))openChapter(deepLink[1] as ChapterId,deepLink[2]);
  registerLocaleState(() => ({chapter:selected, region:filter, route:itinerary, search:searchTerm, dialog:dialog.open?(dialog.dataset.view??''):''}));
}
