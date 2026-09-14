import {t, localized, locale, languagePicker, initLanguageUI, registerLocaleState} from './i18n.ts';
import './style.css';
import {mountAtlas} from './atlas';
import {worldMapMarkup, locations} from './world-map';
import {estimateMemory, lessons, sources, type Precision, type Budget} from './learning';

type Place = 'token' | 'embedding' | 'transformer' | 'llm' | 'quantization';
initLanguageUI();
function mountLabDemo(initial: Place = 'token') {
const params = new URLSearchParams(location.search);
const route: Place[] = ['token', 'embedding', 'transformer', 'llm', 'quantization'];
const icons = {
  map: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Z"/><path d="M9 3v16M15 5v16"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
  compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="m16 8-3 5-5 3 3-5 5-3Z"/></svg>'
};
let selected: Place = initial;
let completed = new Set<Place>();
try {
  const saved: unknown = JSON.parse(localStorage.getItem('ai-world-passport-v1') ?? '[]');
  if (Array.isArray(saved)) completed = new Set(saved.filter((v): v is Place => route.includes(v)));
} catch { /* Storage is optional. */ }
let precision: Precision = ([4,8,16,32].includes(Number(params.get('bits'))) ? Number(params.get('bits')) : 16) as Precision;
let contextTokens = [2048,8192,32768,131072].includes(Number(params.get('context'))) ? Number(params.get('context')) : 8192;
let budget: Budget = ([24,48,80].includes(Number(params.get('budget'))) ? Number(params.get('budget')) : 24) as Budget;
registerLocaleState(() => ({view:'labs', place:selected, bits:String(precision), context:String(contextTokens), budget:String(budget), dialog:dialog.open?(dialog.dataset.view??''):''}));

document.querySelector<HTMLDivElement>('#app')!.innerHTML = localized`
  <header class="site-header">
    <a class="brand" href="/?lang=${locale}" aria-label="AI World 首页"><span class="brand-icon">${icons.map}</span><span>AI WORLD<small>一张可以走进去的 AI 地图</small></span></a>
    <nav aria-label="主导航"><button class="nav-current" id="map-home">世界地图</button><button id="passport-open">探索护照 <span id="header-count">${completed.size}/5</span></button></nav>
    <button class="back-to-atlas" id="back-to-atlas">← 世界全图</button>${languagePicker()}
  </header>
  <main>
    <section class="intro"><div><p class="eyebrow"><span class="live-dot"></span> A SMALL WORLD. A BIG IDEA.</p><h1>原来，AI 的世界是这样连起来的。</h1><p>从一个 Token 出发。穿过山谷，在动手探索中，把复杂的东西拆开看。</p></div><button class="outline-button" id="mission-shortcut">直达量化矿山 ${icons.arrow}</button></section>
    <div class="workspace">
      <section class="map-panel" aria-label="AI 大陆互动地图">
        <div class="map-caption"><span>${icons.compass} AI 大陆</span><small>THE EXPLORER'S ATLAS</small></div>
        <div class="map-viewport" id="map-viewport" tabindex="0" aria-label="可拖动地图。点击地点探索；使用缩放按钮或滚轮缩放；聚焦地图空白后用方向键移动。">${worldMapMarkup()}</div>
        <div class="map-bottom"><span class="map-hint"><span class="tiny-cross">✥</span> 拖动地图 · 滚轮缩放 · 点击地点</span><div class="map-controls" aria-label="地图视图控制"><button id="zoom-out" aria-label="缩小地图">−</button><output id="zoom-level" aria-live="polite">100%</output><button id="zoom-in" aria-label="放大地图">＋</button><button id="zoom-reset" aria-label="重置地图">⌖</button></div></div>
      </section>
      <aside class="explorer-panel" id="explorer-panel" aria-label="地点探索"></aside>
    </div>
    <section class="journey-strip" aria-label="探索路线"><div class="journey-title"><span class="eyebrow">YOUR FIRST EXPEDITION</span><strong>一条路，五个发现</strong></div><div class="route-stops">${route.map((id,i)=>`<button data-route="${id}" class="route-stop"><span class="stop-number">0${i+1}</span><span>${locations.find(l=>l.id===id)?.title ?? id}</span><small class="stop-status">${completed.has(id)?t('已发现'):t('待探索')}</small></button>`).join('')}</div></section>
  </main>
  <footer class="site-footer"><span>Created by <b>Tao</b> <span class="footer-slash">/</span> 小淘带你探索</span><span>AI WORLD · 可玩概念原型 <button id="about-open">关于这张地图 ↗</button></span></footer>
  <dialog id="info-dialog" aria-labelledby="dialog-title"><div class="locale-dialog-controls">${languagePicker()}</div><button class="dialog-close" aria-label="关闭弹窗">×</button><div id="dialog-content"></div></dialog>
  <div id="toast" role="status" aria-live="polite"></div>`;

const panel = document.querySelector<HTMLElement>('#explorer-panel')!;
const questions: Record<Exclude<Place,'quantization'>,{question:string;options:string[];correct:number;success:string}> = {
  token: {question:t('关于 Token，哪句话更准确？'),options:[t('一个 Token 永远等于一个汉字'),t('Token 是模型处理文本的单位')],correct:1,success:t('发现了！分词方式由具体 tokenizer 决定，一个字和一个 Token 并不总是一一对应。')},
  embedding: {question:t('哪一对表达，在语义上更接近？'),options:[t('“小猫”与“猫咪”'),t('“小猫”与“显卡”')],correct:0,success:t('发现了！在合适的语义嵌入空间里，意思相关的表达通常更接近；具体距离取决于模型。')},
  transformer: {question:t('注意力在这里帮助模型做什么？'),options:[t('根据上下文关联信息'),t('只看离它最近的一个字')],correct:0,success:t('发现了！注意力让当前位置能够结合上下文。图里的连线是机制示意，并非实测权重。')},
  llm: {question:t('模型接出“蓝”，说明了什么？'),options:[t('代表这句话必然是真的'),t('只是模型给出了下一步预测')],correct:1,success:t('发现了！续写得流畅，并不保证事实正确。重要结论仍然需要核实来源。')}
};
const demos: Record<Exclude<Place,'quantization'>,string> = {
  token: t(`<div class="token-demo"><span>今天</span><span>天气</span><span>很好</span><span>。</span></div><p class="demo-note">切块示意 · 不对应真实 tokenizer 输出</p>`),
  embedding: t(`<div class="embedding-demo" aria-label="语义空间示意，小猫和猫咪较近，显卡较远"><span class="point cat">小猫</span><span class="point kitten">猫咪</span><span class="point gpu">显卡</span><svg viewBox="0 0 280 120" aria-hidden="true"><path d="M59 68Q88 18 123 51"/><path class="distance-line" d="m70 70 155 18"/></svg></div><p class="demo-note">位置为教学示意 · 无实测向量值</p>`),
  transformer: t(`<div class="attention-demo"><p>小猫累了，因为<span>它</span>跑了很久。</p><svg viewBox="0 0 280 60" aria-hidden="true"><path d="M172 6Q90 82 30 6"/><path d="M172 6Q129 62 88 6"/><circle cx="30" cy="6" r="4"/></svg><small>“它”指向谁？把上下文连起来。</small></div>`),
  llm: t(`<div class="prediction-demo"><p>今天的天空很<span class="prediction-slot">蓝</span></p><span>上下文</span><span class="prediction-arrow">→</span><span>下一步预测</span></div><p class="demo-note">固定续写示例 · 未连接真实模型</p>`)
};

function renderPanel() {
  const lesson = lessons[selected];
  const index = route.indexOf(selected);
  const isLab = selected==='quantization';
  panel.classList.toggle('lab-panel',isLab);
  panel.innerHTML = localized`<div class="place-heading"><span class="eyebrow">${isLab?t('SIDE QUEST / 支线实验'):`DISCOVERY 0${index+1} / 05`}</span><span class="place-stamp ${completed.has(selected)?'earned':''}">${completed.has(selected)?t('已盖章 ✓'):t('探索中')}</span></div><h2>${locations.find(l=>l.id===selected)?.title}</h2><p class="place-subtitle">${lesson.eyebrow}</p><div class="guide-note"><img src="/xiaotao.png" alt="向导小淘"/><p>${isLab?t('带上 70B 模型去矿山。调整精度，看看内存预算发生了什么。'):lesson.description}</p></div>
    ${isLab?labMarkup():localized`<div class="lesson-demo">${demos[selected as Exclude<Place,'quantization'>]}</div><div class="challenge"><span class="eyebrow">想一想 · 带走一个发现</span><h3>${questions[selected as Exclude<Place,'quantization'>].question}</h3><div class="answer-options">${questions[selected as Exclude<Place,'quantization'>].options.map((text,i)=>`<button data-answer="${i}"><span>${i===0?'A':'B'}</span>${text}</button>`).join('')}</div><p class="answer-feedback" id="answer-feedback" role="status"></p></div><button class="primary-button" id="next-place">${completed.has(selected)?t('前往下一站'):t('先去下一站看看')} ${icons.arrow}</button>`}
    <div class="field-note"><span>✧</span><p>${isLab?t('教学估算只检查内存预算，不保证能部署，也不代表性能。'):lesson.insight}</p></div>`;
  panel.querySelectorAll<HTMLButtonElement>('[data-answer]').forEach(button=>button.addEventListener('click',()=>{
    const question = questions[selected as Exclude<Place,'quantization'>];
    const right = Number(button.dataset.answer)===question.correct;
    panel.querySelectorAll('[data-answer]').forEach(b=>b.classList.remove('correct','incorrect'));
    button.classList.add(right?'correct':'incorrect');
    const feedback=panel.querySelector<HTMLElement>('#answer-feedback')!;
    feedback.className=`answer-feedback ${right?'success':'retry'}`;
    feedback.textContent=right?question.success:t('再观察一下上面的示意，换一个答案试试。');
    if(right) {markComplete(selected); panel.querySelector('#next-place')!.innerHTML=localized`前往下一站 ${icons.arrow}`;}
  }));
  panel.querySelector('#next-place')?.addEventListener('click',()=>selectPlace(route[(index+1)%route.length]));
  if(isLab) bindLab();
  const sourceChapter = selected === 'quantization' ? 'c10' : selected === 'llm' ? 'c04' : 'c03';
  panel.insertAdjacentHTML('beforeend', t('<button class="lab-source-chapter" id="lab-source-open">在知识地图中继续读这一章 ↗</button>'));
  panel.querySelector('#lab-source-open')!.addEventListener('click',()=>openWorld(sourceChapter));
}

function labMarkup() {
  return localized`<div class="lab-goal"><b>任务：把 70B 装进预算</b><span>选择 48 GiB，保留至少 32K 上下文。</span></div><div class="lab-controls"><fieldset><legend>01 <span>每个参数，留几位？</span></legend><div class="precision-picker">${([32,16,8,4] as Precision[]).map(bit=>`<button data-bits="${bit}" aria-pressed="${bit===precision}" class="${bit===precision?'active':''}">${bit}<small>bit</small></button>`).join('')}</div></fieldset><div class="select-row"><label for="context-select">上下文长度</label><select id="context-select">${[2048,8192,32768,131072].map(n=>`<option value="${n}" ${n===contextTokens?'selected':''}>${n/1024}K tokens</option>`).join('')}</select></div><div class="select-row"><label for="budget-select">内存预算</label><select id="budget-select">${[24,48,80].map(n=>`<option value="${n}" ${n===budget?'selected':''}>${n} GiB</option>`).join('')}</select></div></div><div class="memory-output" aria-live="polite" id="memory-output"></div><button class="primary-button" id="run-budget">检查我的方案 ${icons.arrow}</button><p class="lab-result" id="lab-result" role="status"></p><button class="text-button" id="assumptions-open">估算怎么算？查看假设与来源 ↗</button>`;
}
function bindLab() {
  panel.querySelectorAll<HTMLButtonElement>('[data-bits]').forEach(b=>b.addEventListener('click',()=>{
    precision=Number(b.dataset.bits) as Precision;
    panel.querySelectorAll<HTMLButtonElement>('[data-bits]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});
    updateMemory();
  }));
  panel.querySelector<HTMLSelectElement>('#context-select')!.addEventListener('change',event=>{contextTokens=Number((event.target as HTMLSelectElement).value);updateMemory();});
  panel.querySelector<HTMLSelectElement>('#budget-select')!.addEventListener('change',event=>{budget=Number((event.target as HTMLSelectElement).value) as Budget;updateMemory();});
  panel.querySelector('#run-budget')!.addEventListener('click',()=>{
    const result=estimateMemory(precision,contextTokens);
    const feedback=panel.querySelector<HTMLElement>('#lab-result')!;
    if(result.totalGiB>budget){feedback.textContent=localized`还差 ${(result.totalGiB-budget).toFixed(1)} GiB。试试降低权重精度，或缩短上下文。`;feedback.className='lab-result retry';}
    else if(budget!==48||contextTokens<32768){feedback.textContent=t('估算在所选预算内！本关还需要：48 GiB 预算、至少 32K 上下文。');feedback.className='lab-result';}
    else {feedback.textContent=t('任务完成！你为权重、KV Cache 和额外开销留出了空间。真实部署仍要实测。');feedback.className='lab-result success';markComplete('quantization');}
  });
  panel.querySelector('#assumptions-open')!.addEventListener('click',openAssumptions);
  updateMemory();
}
function updateMemory() {
  const memory=estimateMemory(precision,contextTokens);
  const scale=Math.max(budget,memory.totalGiB)*1.04;
  const fits=memory.totalGiB<=budget;
  panel.querySelector('#memory-output')!.innerHTML=localized`<div class="memory-total"><span>预计占用 <strong>${memory.totalGiB.toFixed(1)}</strong> GiB</span><small class="${fits?'fits':'over'}">${fits?t('预算内'):t('超出预算')}</small></div><div class="memory-bar" role="img" aria-label="权重 ${memory.weightsGiB.toFixed(1)} GiB，KV Cache ${memory.kvGiB.toFixed(1)} GiB，额外开销 ${memory.overheadGiB} GiB，总预算 ${budget} GiB"><span class="weights" style="width:${memory.weightsGiB/scale*100}%"></span><span class="kv" style="width:${memory.kvGiB/scale*100}%"></span><span class="overhead" style="width:${memory.overheadGiB/scale*100}%"></span><i style="left:${budget/scale*100}%"></i></div><div class="memory-legend"><span><i class="weights"></i>权重 ${memory.weightsGiB.toFixed(1)}</span><span><i class="kv"></i>KV ${memory.kvGiB.toFixed(1)}</span><span><i class="overhead"></i>其他 ${memory.overheadGiB}</span></div><p class="memory-formula">70 × 10⁹ × ${precision} ÷ 8 ÷ 2³⁰ ≈ ${memory.weightsGiB.toFixed(1)} GiB 权重</p>`;
  panel.querySelector('#lab-result')!.textContent='';
}
function selectPlace(id: Place,scroll=false) {
  selected=id;
  renderPanel();updateProgress();
  if(scroll||window.innerWidth<900) panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
}
function markComplete(id: Place) {
  const fresh=!completed.has(id);
  completed.add(id);
  try{localStorage.setItem('ai-world-passport-v1',JSON.stringify([...completed]));}catch{/* Session still works. */}
  updateProgress();
  const stamp=panel.querySelector('.place-stamp');if(stamp){stamp.textContent=t('已盖章 ✓');stamp.classList.add('earned');}
  if(fresh){const toast=document.querySelector<HTMLElement>('#toast')!;toast.textContent=completed.size===5?t('探索护照集齐了！你已经连接起五个 AI 概念。'):t('新发现已收入探索护照');toast.classList.add('show');setTimeout(()=>toast.classList.remove('show'),3500);}
}
function updateProgress() {
  document.querySelector('#header-count')!.textContent=`${completed.size}/5`;
  document.querySelectorAll<HTMLElement>('[data-route]').forEach(el=>{el.classList.toggle('active',el.dataset.route===selected);el.classList.toggle('complete',completed.has(el.dataset.route as Place));el.querySelector('.stop-status')!.textContent=completed.has(el.dataset.route as Place)?t('已发现'):t('待探索');});
  document.querySelectorAll<SVGElement>('[data-location]').forEach(el=>{el.classList.toggle('is-selected',el.dataset.location===selected);el.classList.toggle('is-visited',completed.has(el.dataset.location as Place));el.setAttribute('aria-pressed',String(el.dataset.location===selected));});
}
function showDialog(kind:'assumptions'|'passport'|'about',content:string) {
  document.querySelector('#dialog-content')!.innerHTML=content;
  dialog.dataset.view=kind;
  const url=new URL(location.href);
  if(url.searchParams.has('dialog')){url.searchParams.set('dialog',kind);history.replaceState(null,'',url.pathname+url.search+url.hash);}
  if(!dialog.open)dialog.showModal();
}
function openAssumptions() {
  showDialog('assumptions',localized`<span class="eyebrow">THE MATH BEHIND THE MINE</span><h2 id="dialog-title">把估算拆开看</h2><p>这是一个 <b>70 × 10⁹ 参数的教学模型</b>。我们只做内存预算练习，未运行推理，也没有测量吞吐或速度。</p><dl><dt>权重内存</dt><dd>参数量 × 每参数位数 ÷ 8 ÷ 2³⁰。32 / 16 / 8 / 4 bit 表示示意存储位宽，不代表任意模型都支持这些格式。</dd><dt>KV Cache</dt><dd>2 × 80 层 × 8 个 KV 头 × 128 维 × 上下文 tokens × 2 bytes ÷ 2³⁰。采用 Llama 70B 系列的 GQA 维度，batch = 1，KV 为 FP16。上下文表示已填满的缓存长度。</dd><dt>额外开销：固定假设 3 GiB</dt><dd>只是课堂假设，不是测量结果。量化元数据、激活、临时缓冲区和框架预留在实际部署中都会变化；固定值不能保证覆盖它们。</dd><dt>单位与边界</dt><dd>1 GiB = 2³⁰ bytes；1 GB = 10⁹ bytes。70B 的 4-bit 理想权重为 35 GB ≈ 32.6 GiB。硬件标称容量、系统可用内存、质量损失和兼容性都需另行核对。</dd></dl><div class="source-links">${sources.map(s=>`<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.title} ↗</a>`).join('')}</div>`);
}
document.querySelector('#passport-open')!.addEventListener('click',()=>{
  showDialog('passport',localized`<span class="eyebrow">MY EXPLORER'S PASSPORT</span><h2 id="dialog-title">每个发现，都算数。</h2><p>你已经收集了 <b>${completed.size} / 5</b> 个发现。探索进度保存在当前浏览器。</p><div class="passport-grid">${route.map((id,i)=>`<button data-passport="${id}" class="passport-stamp ${completed.has(id)?'earned':''}"><span>${completed.has(id)?'✧':`0${i+1}`}</span><b>${locations.find(l=>l.id===id)?.title}</b><small>${completed.has(id)?t('已发现'):t('继续探索 →')}</small></button>`).join('')}</div><p class="dialog-note">解答每站的问题，或完成矿山的预算任务，就能盖章。所有地点都可以自由访问。</p>`);
  document.querySelectorAll<HTMLElement>('[data-passport]').forEach(el=>el.addEventListener('click',()=>{document.querySelector<HTMLDialogElement>('#info-dialog')!.close();selectPlace(el.dataset.passport as Place);}));
});
document.querySelector('#about-open')!.addEventListener('click',()=>showDialog('about',t(`<span class="eyebrow">WELCOME TO AI WORLD</span><h2 id="dialog-title">知识也可以是一片大陆。</h2><p>这是 Tao 创作的 AI World 小型概念原型，小淘是你的探索向导。第一版用五个地点，试着把“读懂一个概念”变成“亲手发现一件事”。</p><p>地理和路线是学习比喻，不是严格的架构依赖。五站都能自由探索；量化矿山用简化计算展示运行内存的组成。</p><p>地图支持拖动、滚轮缩放、触屏拖动；可使用 Tab 选择地点、Enter 打开，以及缩放按钮。聚焦地图空白后用方向键移动。</p><p class="dialog-note">本地 demo · 不需要账号 · 不调用 AI API<br>Created by Tao · Guide: 小淘</p>`)));
const dialog=document.querySelector<HTMLDialogElement>('#info-dialog')!;
dialog.addEventListener('close',()=>{const url=new URL(location.href);url.searchParams.delete('dialog');history.replaceState(null,'',url.pathname+url.search+url.hash);});
dialog.querySelector('.dialog-close')!.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
document.querySelectorAll<HTMLElement>('[data-route]').forEach(el=>el.addEventListener('click',()=>selectPlace(el.dataset.route as Place)));
document.querySelector('#mission-shortcut')!.addEventListener('click',()=>selectPlace('quantization'));
document.querySelector('#map-home')!.addEventListener('click',()=>{resetView();document.querySelector('.map-panel')!.scrollIntoView({behavior:'smooth',block:'center'});});

// Native SVG viewBox camera keeps labels sharp at every zoom level.
const viewport=document.querySelector<HTMLElement>('#map-viewport')!;
const map=viewport.querySelector<SVGSVGElement>('svg')!;
const camera={x:0,y:0,w:1400,h:900};
let zoom=1;
let pointer: {id:number;x:number;y:number;startX:number;startY:number;dragged:boolean}|null=null;
let suppressClick=false;
function updateCamera(){camera.x=Math.min(1400-camera.w+180,Math.max(-180,camera.x));camera.y=Math.min(900-camera.h+120,Math.max(-120,camera.y));map.setAttribute('viewBox',`${camera.x} ${camera.y} ${camera.w} ${camera.h}`);document.querySelector('#zoom-level')!.textContent=`${Math.round(zoom*100)}%`;document.querySelector<HTMLButtonElement>('#zoom-out')!.disabled=zoom<=1;document.querySelector<HTMLButtonElement>('#zoom-in')!.disabled=zoom>=2.5;}
function setZoom(next:number){const previousW=camera.w,previousH=camera.h;zoom=Math.min(2.5,Math.max(1,next));camera.w=1400/zoom;camera.h=900/zoom;camera.x+=(previousW-camera.w)/2;camera.y+=(previousH-camera.h)/2;updateCamera();}
function resetView(){zoom=1;Object.assign(camera,{x:0,y:0,w:1400,h:900});updateCamera();}
viewport.addEventListener('wheel',event=>{event.preventDefault();setZoom(zoom*(event.deltaY>0?.9:1.1));},{passive:false});
viewport.addEventListener('pointerdown',event=>{if(event.button!==0)return;pointer={id:event.pointerId,x:event.clientX,y:event.clientY,startX:camera.x,startY:camera.y,dragged:false};suppressClick=false;});
viewport.addEventListener('pointermove',event=>{
  if(!pointer||event.pointerId!==pointer.id)return;
  const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;
  if(!pointer.dragged&&Math.hypot(dx,dy)>5){pointer.dragged=true;viewport.setPointerCapture(event.pointerId);viewport.classList.add('dragging');}
  if(pointer.dragged){const r=map.getBoundingClientRect();const units=Math.max(camera.w/r.width,camera.h/r.height);camera.x=pointer.startX-dx*units;camera.y=pointer.startY-dy*units;updateCamera();}
});
function finishPointer(event:PointerEvent){if(pointer?.id!==event.pointerId)return;suppressClick=pointer.dragged;if(viewport.hasPointerCapture(event.pointerId))viewport.releasePointerCapture(event.pointerId);pointer=null;viewport.classList.remove('dragging');}
viewport.addEventListener('pointerup',finishPointer);viewport.addEventListener('pointercancel',finishPointer);
viewport.addEventListener('click',event=>{if(suppressClick){suppressClick=false;return;}const place=(event.target as Element).closest<SVGElement>('[data-location]')?.dataset.location;if(place&&route.includes(place as Place))selectPlace(place as Place);});
viewport.addEventListener('keydown',event=>{
  const place=(event.target as Element).closest<SVGElement>('[data-location]')?.dataset.location;
  if(place&&(event.key==='Enter'||event.key===' ')){event.preventDefault();selectPlace(place as Place);return;}
  if(event.target!==viewport)return;
  const step=60/zoom;
  if(event.key==='ArrowLeft')camera.x-=step;else if(event.key==='ArrowRight')camera.x+=step;else if(event.key==='ArrowUp')camera.y-=step;else if(event.key==='ArrowDown')camera.y+=step;else if(event.key==='+'||event.key==='='){setZoom(zoom+.25);return;}else if(event.key==='-'){setZoom(zoom-.25);return;}else if(event.key==='Home'){resetView();return;}else return;
  event.preventDefault();updateCamera();
});
document.querySelector('#zoom-in')!.addEventListener('click',()=>setZoom(zoom+.25));
document.querySelector('#zoom-out')!.addEventListener('click',()=>setZoom(zoom-.25));
document.querySelector('#zoom-reset')!.addEventListener('click',resetView);
renderPanel();updateProgress();updateCamera();
if(params.get('dialog')==='assumptions')openAssumptions();
else if(params.get('dialog')==='passport')document.querySelector<HTMLButtonElement>('#passport-open')!.click();
else if(params.get('dialog')==='about')document.querySelector<HTMLButtonElement>('#about-open')!.click();

document.querySelector('#back-to-atlas')!.addEventListener('click',()=>openWorld());
}

function openWorld(chapter?:string){
  history.replaceState(null,'',location.pathname+'?lang='+locale+(chapter?'#chapter/'+chapter:''));
  mountAtlas({onOpenLab:(id)=>{
    history.replaceState(null,'',location.pathname+'?lang='+locale+'&view=labs&place='+id);
    mountLabDemo(id);
    window.scrollTo({top:0,behavior:'instant'});
  }});
}
const initialParams=new URLSearchParams(location.search);
const requestedLab=initialParams.get('place') as Place|null;
if(initialParams.get('view')==='labs')mountLabDemo(requestedLab&&['token','embedding','transformer','llm','quantization'].includes(requestedLab)?requestedLab:'token');
else mountAtlas({onOpenLab:(id)=>{
  history.replaceState(null,'',location.pathname+'?lang='+locale+'&view=labs&place='+id);
  mountLabDemo(id);
  window.scrollTo({top:0,behavior:'instant'});
}});
