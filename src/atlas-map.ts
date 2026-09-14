import {t, localized, locale} from './i18n.ts';
import type { ChapterId, RegionId } from './curriculum-types';

export const chapterPlaces: { id: ChapterId; title: string; region: RegionId; x: number; y: number }[] = [
  { id: 'c01', title: t('启程港'), region: 'foundations', x: 210, y: 248 },
  { id: 'c02', title: t('学习原野'), region: 'foundations', x: 460, y: 238 },
  { id: 'c03', title: t('注意力山脉'), region: 'foundations', x: 286, y: 410 },
  { id: 'c04', title: t('训练工坊'), region: 'foundations', x: 545, y: 389 },
  { id: 'c05', title: t('提示驿站'), region: 'applications', x: 848, y: 244 },
  { id: 'c06', title: t('检索森林'), region: 'applications', x: 1110, y: 240 },
  { id: 'c07', title: t('智能体城'), region: 'applications', x: 922, y: 421 },
  { id: 'c08', title: t('评测灯塔'), region: 'applications', x: 1204, y: 398 },
  { id: 'c09', title: t('多模态海岸'), region: 'systems', x: 851, y: 659 },
  { id: 'c10', title: t('算力矿山'), region: 'systems', x: 1162, y: 643 },
  { id: 'c11', title: t('守望堡垒'), region: 'systems', x: 1040, y: 801 },
  { id: 'c12', title: t('编码工坊'), region: 'practice', x: 248, y: 681 },
  { id: 'c13', title: t('职业远航港'), region: 'practice', x: 501, y: 773 },
];

export const regionPlaces: { id: RegionId; title: string; subtitle: string; x: number; y: number }[] = [
  { id: 'foundations', title: t('模型起源大陆'), subtitle: t('从 AI 基础到大模型训练'), x: 356, y: 114 },
  { id: 'applications', title: t('应用群岛'), subtitle: t('从提示到智能体与评测'), x: 1024, y: 114 },
  { id: 'systems', title: t('技术与治理海岸'), subtitle: t('多模态、算力与安全'), x: 1063, y: 546 },
  { id: 'practice', title: t('实践远航湾'), subtitle: t('从动手编码到职业探索'), x: 329, y: 559 },
];

const shores: Record<RegionId, string> = {
  foundations: 'M107 236C76 215 104 182 141 183C149 151 184 145 218 152C238 123 284 143 310 142C354 132 388 148 414 133C453 116 481 142 508 145C540 126 575 151 578 181C619 179 652 203 638 236C674 260 656 296 648 317C675 347 660 382 630 389C641 421 602 457 571 451C548 479 512 463 494 477C461 493 431 464 406 480C377 499 349 475 330 477C303 496 275 480 256 460C222 480 197 451 199 430C166 435 140 415 148 392C111 387 92 357 109 331C83 309 95 280 108 268C97 256 98 244 107 236Z',
  applications: 'M758 226C733 202 752 175 787 180C792 148 834 140 860 154C889 134 916 145 942 136C978 119 1004 145 1032 144C1066 127 1091 147 1111 137C1146 119 1174 143 1177 165C1214 150 1240 174 1240 198C1274 195 1298 220 1283 245C1319 261 1310 295 1294 309C1323 329 1339 356 1317 380C1337 410 1310 446 1277 441C1264 470 1228 468 1201 454C1177 478 1142 459 1123 475C1093 493 1062 469 1042 475C1010 496 982 473 959 481C932 496 906 479 889 462C859 483 825 461 825 439C789 445 766 426 775 402C745 389 745 357 765 339C737 314 749 290 763 272C746 258 748 242 758 226Z',
  systems: 'M770 635C750 610 778 584 807 590C820 565 854 564 878 579C905 558 932 575 954 568C985 550 1013 570 1038 567C1067 550 1101 571 1123 562C1156 550 1180 568 1188 589C1221 573 1253 593 1250 618C1285 619 1291 644 1275 668C1305 687 1297 714 1282 731C1307 754 1291 784 1263 792C1267 823 1236 843 1207 830C1186 857 1155 847 1138 854C1103 872 1077 851 1050 860C1013 875 990 853 968 857C933 864 912 842 913 821C881 837 851 813 861 790C829 794 806 776 810 754C777 754 759 728 772 707C750 690 757 662 770 635Z',
  practice: 'M112 643C93 622 113 596 142 602C148 577 184 574 208 588C239 568 268 588 291 580C324 564 352 590 374 584C407 568 435 591 434 615C467 603 489 622 492 644C525 639 544 665 535 685C569 686 598 714 586 739C619 750 617 780 597 796C601 829 568 848 540 839C518 866 486 850 462 857C428 870 407 847 385 850C349 860 328 833 325 812C290 828 267 807 269 787C235 802 206 781 210 757C177 768 144 746 153 723C116 728 93 699 109 677C94 664 101 650 112 643Z',
};

const colors: Record<RegionId, string> = {
  foundations: '#F4EDD6', applications: '#EDF0D9', systems: '#F0E6D2', practice: '#F2EBD9',
};

const pine = (x: number, y: number, s = 1, color = '#9BAF88') => `<g class="atlas-tree" transform="translate(${x} ${y}) scale(${s})"><path d="M0 6V22"/><path d="M-14 10 0-17 14 10Z" fill="${color}"/><path d="M-12 1 0-24 12 1Z" fill="${color}"/><path d="M0-16V9" opacity=".3"/></g>`;
const oak = (x: number, y: number, s = 1) => `<g class="atlas-tree" transform="translate(${x} ${y}) scale(${s})"><path d="M0-3V23m0-10-8-7m8 3 8-11"/><path d="M-15 6C-31-3-19-20-9-17-10-33 15-36 18-20 35-17 29 3 19 5 19 18 3 19-3 11-10 18-22 16-15 6Z" fill="#B6BE92"/><path d="M0-16V7m0-2 9-8m-9 4-7-6" fill="none" opacity=".4"/></g>`;
const house = (x: number, y: number, s = 1, roof = '#C38B65') => `<g class="atlas-building" transform="translate(${x} ${y}) scale(${s})"><path d="M-20-8h40v29h-40Z" fill="#FAF0D8"/><path d="m20-8 9-7v29l-9 7Z" fill="#D7C5A5"/><path d="M-25-8 0-31 25-8Z" fill="${roof}"/><path d="m0-31 9-7 24 23-8 7Z" fill="#AA795A"/><path d="M-5 21V4H6v17" fill="#758674"/><path d="M-15-1h7v8h-7Zm27 0h6v8h-6Z" fill="#AFC7AD"/></g>`;
const peak = (x: number, y: number, s = 1) => `<g class="atlas-mountain" transform="translate(${x} ${y}) scale(${s})"><path d="M-48 34-4-56 14-29 23-32 60 34Z" fill="#B7C1A6"/><path d="m-4-56 13 51 24 39H-8L-1 8-13-28Z" fill="#869C8A" stroke="none"/><path d="m-4-56-16 33 12-5 9 8 6-7 7-2Z" fill="#FBF5E5"/><path d="m-31 2 7-12m55 24 7 9" fill="none" opacity=".5"/></g>`;
const grass = (x: number, y: number) => `<path class="atlas-grass" d="m${x - 6} ${y} -3-5m9 5v-8m6 8 3-5"/>`;
const ship = (x: number, y: number, s = 1, angle = 0) => `<g class="atlas-ink" transform="translate(${x} ${y}) rotate(${angle}) scale(${s})"><path d="M-26 11H28L12 26H-12Z" fill="#BD986F"/><path d="M0 11v-49"/><path d="M-4-29V7h-24Z" fill="#FFF7E5"/><path d="m4-27 22 34H4Z" fill="#D4DCBF"/><path d="M-30 32q11-6 21 0t23 0 19 0" opacity=".4"/></g>`;
const dock = (x: number, y: number, angle = 0) => `<g class="atlas-ink" transform="translate(${x} ${y}) rotate(${angle})" fill="#D6BF98"><path d="M-8-20H8v65H-8Z"/><path d="M-8-13H8m-16 9H8m-16 9H8m-16 9H8m-16 9H8m-16 9H8m-16 9H8M-12-22v71M12-22v71"/></g>`;
const windowRows = (xs: number[], ys: number[]) => xs.flatMap(x => ys.map(y => `<path d="M${x} ${y}h6v8h-6Z" fill="#A1BCAA"/>`)).join('');

function landmarkArt(id: ChapterId): string {
  switch (id) {
    case 'c01': return `<ellipse cy="-4" rx="67" ry="19" fill="#DFDFC0"/>${house(-24, -17, 1.05)}${house(30, -8, .76, '#9AAB8A')}<path class="atlas-ink" d="M-52 8h103m-92-8v17m20-17v17m59-17v17"/>${dock(-42, 17, 70)}<path class="atlas-ink" d="M23-49v-41m0 4 24 8-24 8" fill="#D49A68"/><path class="atlas-ink" d="M40 8q11-8 20 0t20 0" stroke="#90ACA0"/>`;
    case 'c02': return `<ellipse cy="-2" rx="79" ry="23" fill="#E7DDAF"/><g fill="none" stroke="#BEAC71" stroke-width="1.5"><path d="M-69 4 54-18m-112 31 123-22m-101 25 104-19M-40-16-24 15M-14-22 1 11m12-38L28 7m15-40L55 0"/></g>${house(-2, -29, .95, '#9CA484')}${oak(-52, -34, .66)}<g class="atlas-ink" transform="translate(48 -40)"><path d="M-8 43 0-18 8 43Z" fill="#E7DAC0"/><path d="M0-14v-27m0 27H29m-29 0v28m0-28H-29"/><path d="M-4-39 4-43v24h-8Zm9 21h23l-3 8H5Zm-9 9h8v24l-8-4Zm-24-9h23v8h-27Z" fill="#D2C095"/><circle cy="-14" r="5" fill="#F7EDCF"/></g>`;
    case 'c03': return `<ellipse cy="-7" rx="96" ry="20" fill="#D6DEC2"/>${peak(-58, -22, .72)}${peak(49, -32, .88)}${peak(-6, -43, 1.13)}<path class="atlas-ink" d="M-10-105v-27m0 3 23 7-23 9" fill="#D69B6C"/><path d="M-42 3-25-18-9-12 4-34 18-25 36-42 54-16" fill="none" stroke="#FCF1D6" stroke-width="2.4" stroke-dasharray="3 4"/>`;
    case 'c04': return `<ellipse cy="-2" rx="72" ry="20" fill="#DFDDC0"/><g class="atlas-building"><path d="M-50 8v-50l28 12v-16L6-31v-18l30 17V8Z" fill="#ECD9B7"/><path d="M-50-42v12l28 12v-12L6-15v-16l30 17v-18" fill="#BB8661"/><path d="M38 8v-82h12V8Z" fill="#CEB997"/><path d="M34-75h20v7H34Z" fill="#B08D6A"/>${windowRows([-38,-10,17], [-16])}<path d="M-8 8V-8H8V8" fill="#7A8B77"/></g><g transform="translate(52 -21)" class="atlas-ink"><circle r="19" fill="#B6C2A3"/><circle r="9" fill="#F3E9CF"/><path d="M0-22v6m0 32v6M-22 0h6m32 0h6M-15-15l5 5m20 20 5 5m-30 0 5-5m20-20 5-5" stroke-width="4"/></g><path class="atlas-ink" d="M44-89q-18-10 0-17t0-16" opacity=".32"/>`;
    case 'c05': return `<ellipse cy="-1" rx="76" ry="20" fill="#DFE2C2"/>${house(-4, -18, 1.3)}${oak(-52, -24, .7)}<g class="atlas-ink" transform="translate(53 -20)"><path d="M0 32V-43"/><path d="M-22-37H16l8 9-8 9H-22Z" fill="#D8BB8D"/><path d="M21-12H-17l-8 8 8 9h38Z" fill="#EEE2C5"/><path d="M-12-29h21m-18 25H11" opacity=".6"/></g><path class="atlas-ink" d="M-13-45h22v17h-12l-7 6v-6h-3Z" fill="#FCF6E4"/>`;
    case 'c06': return `<path d="M-92-10c-17-39 3-71 38-72 27-23 80-12 92 9 42-9 65 34 52 65-55 28-129 31-182-2Z" fill="#D8DFC0"/>${pine(-65,-47,.9)}${pine(-33,-63,1.05)}${pine(6,-76,.94)}${pine(43,-62,1.15)}${pine(72,-28,.9)}${pine(-44,-17,.85)}${pine(34,-10,.88)}<g class="atlas-building"><path d="M-22 3v-34L0-45l22 14V3Z" fill="#F6EACF"/><path d="M-27-31 0-54 27-31Z" fill="#849D7F"/><path d="M-14-23h10v18h-10Zm17 0h10v18H3Z" fill="#D0BB8E"/><path d="M-8 3V-12H8V3" fill="#738E76"/></g><path d="M-5 9q-22 8-9 15" fill="none" stroke="#B99C6E" stroke-width="4"/>`;
    case 'c07': return `<ellipse cy="-5" rx="85" ry="24" fill="#DDE2C4"/><g class="atlas-building"><path d="M-62 2v-62h24V2m73 0v-72h25V2" fill="#E4DABF"/><path d="m-65-60 15-19 15 19Zm97-10 15-21 16 21Z" fill="#91A58C"/><path d="M-40 4v-48L0-66l39 22V4Z" fill="#F6EACD"/><path d="m-44-44 44-31 44 31-7 8L0-62-37-36Z" fill="#A5B293"/><path d="M-14-4v-74L0-93l16 15V-4" fill="#E9DCBF"/><path d="m-20-77 20-25 22 25Z" fill="#6D9584"/><path d="M0-103v-24l22 7-22 9" fill="#CC9367"/><circle cy="-60" r="9" fill="#FDF7E4"/><path d="M0-66v7l5 2" fill="none"/><path d="M-9 4V-16a9 9 0 0 1 18 0V4" fill="#748C76"/>${windowRows([-54,43],[-47,-26])}<path d="M-73 6V-8h11v7h14v-7h12v7h16v-7h12V7m30 0V-8h12v7h14v-7h12v7h14v-7h12V6Z" fill="#D8CFAD"/></g>`;
    case 'c08': return `<path d="M-66 8-47-18-7-25 38-13 64 13Z" fill="#C9CDB3" class="atlas-ink"/><g class="atlas-building"><path d="M-18 7-12-78H12L20 7Z" fill="#F7EBCF"/><path d="M-15-42h30l1 16h-32Z" fill="#BE7E5A"/><path d="M-19-78h38v-22h-38Z" fill="#D0DDC4"/><path d="m-24-100 24-20 24 20Z" fill="#718F7D"/><path d="M-23-76h46m-32 0v-24m17 24v-24"/><path d="M-5 7V-9H6V7" fill="#70856F"/><path d="M0-120v-12"/></g><path d="M-18-92-80-116v47Z" fill="#E8D5A3" opacity=".48"/><path d="M18-92 81-115v45Z" fill="#E8D5A3" opacity=".48"/><path class="atlas-ink" d="M-71 16q13-7 26 0m69 6q13-7 26 0" opacity=".4"/>`;
    case 'c09': return `<ellipse cy="1" rx="79" ry="22" fill="#E2D7B4"/><path d="M-79 13q38-22 69-4T77 2" fill="none" stroke="#AAC4B0" stroke-width="11"/>${house(-36,-28,.9,'#AA9E7F')}<g class="atlas-building"><path d="M-1-5v-58h39v58Z" fill="#F7EBCF"/><path d="m-7-63 26-23 27 23Z" fill="#BB8966"/><path d="M5-48h28v23H5Z" fill="#B4CABB"/><path d="m8-28 8-12 8 8 6-7 3 11Z" fill="#809B84"/><circle cx="25" cy="-42" r="4" fill="#F5E6BA"/><path d="M47-6v-46h23V-6Z" fill="#E8D6B3"/><path d="M58-47v26m-6-20v15m12-19v20" stroke="#839C84"/></g><path class="atlas-ink" d="M-72-70q18-8 38 0m-38-9q18-8 38 0" opacity=".32"/>`;
    case 'c10': return `<path class="atlas-ink" d="M-84 4-67-43-47-38-8-90 24-46 44-51 83 7Z" fill="#CFC0A0"/><path d="m-8-90 7 44L23 3m-70-41 15 28M44-51 57-7" fill="none" stroke="#AD9E7C" stroke-width="2"/><g class="atlas-ink"><path d="M-44 7v-25q19-27 38 0V7" fill="#667460"/><path d="M-49 7v-31l24-17L0-24V7" fill="none" stroke="#B08F61" stroke-width="7"/><path d="M-42-15-66 22m51-37-7 37m-35-9h36m-29-9h33m-26-9h29"/><path d="M20 6v-36h31V6Z" fill="#E5D5B3"/><path d="M25-24h21v23H25Z" fill="#8FA083"/><path d="M30-19v13m6-13v13m6-13v13"/><path d="M57 8v-71h9V8m0-61L53-42m13 0L53-31" fill="#C2A67A"/></g><g class="atlas-ink" transform="translate(-77 2)"><path d="M-14-16H14L10 0H-10Z" fill="#9BAA8A"/><circle cx="-7" cy="4" r="4" fill="#677762"/><circle cx="7" cy="4" r="4" fill="#677762"/><path d="m-11-16 6-10 8 5 6-4 4 9" fill="#C89865"/></g>`;
    case 'c11': return `<ellipse cy="-1" rx="83" ry="19" fill="#D7D5B7"/><g class="atlas-building"><path d="M-66 6v-61h26V6m79 0v-61h26V6" fill="#D1D0B2"/><path d="M-70-55v-15h9v7h11v-7h13v15Zm106 0v-15h11v7h11v-7h11v15Z" fill="#D3D3B5"/><path d="M-42 7v-42h84V7Z" fill="#E7DFC3"/><path d="M-44-35v-13h12v7h13v-7h12v7H7v-7h12v7h13v-7h12v13Z" fill="#DBD7B8"/><path d="M-12 7V-9a12 12 0 0 1 24 0V7" fill="#758672"/><path d="M-3 7V-9m6 16V-9"/><path d="M-3-47v-54l31 9-31 11" fill="#8BA488"/><path d="M-16-56v-25l16-9 16 9v25L0-44Z" fill="#F7EDD3"/><path d="m-8-68 6 7 11-15" fill="none" stroke="#6A8D76" stroke-width="3"/>${windowRows([-57,47],[-40])}</g>`;
    case 'c12': return `<ellipse cy="-2" rx="79" ry="21" fill="#DDE0C2"/>${house(-35,-24,.9,'#A1AA8A')}<g class="atlas-building"><path d="M-13 8v-61h64V8Z" fill="#F5E7C9"/><path d="m-18-53 36-28 38 28Z" fill="#BA8662"/><path d="M-3-39h44v28H-3Z" fill="#718B78"/><path d="m9-31-7 7 7 7m20-14 7 7-7 7m-7-17-6 21" fill="none" stroke="#F6E8BB" stroke-width="2"/><path d="M14 8V-5h13V8" fill="#92A487"/><path d="M56 8v-71h10V8" fill="#D1B997"/></g>${oak(-69,-34,.6)}<path class="atlas-ink" d="M-71 9h53m-46-6v13m18-13v13m18-13v13"/>`;
    case 'c13': return `<path d="M-78-1q44-25 79-17T77 10" fill="none" stroke="#C9D5BA" stroke-width="23"/>${house(-34,-32,.85)}${house(14,-35,1.05,'#91A58C')}${dock(40,2,-25)}<g class="atlas-ink"><path d="M-66 7v-40m-11 14h22l7 8-7 8h-22Z" fill="#D5BA8C"/><path d="M27-68v-35m0 2 22 8-22 9" fill="#D09969"/></g>${ship(78, 1, .77, -8)}`;
  }
}

function placeMarkup(place: typeof chapterPlaces[number]): string {
  const halfWidth = place.title.length * (locale === 'en' ? 5.3 : 11.5);
  return localized`<g class="atlas-landmark" data-chapter="${place.id}" tabindex="0" role="button" aria-label="探索第 ${Number(place.id.slice(1))} 章：${place.title}" aria-pressed="false" transform="translate(${place.x} ${place.y})">
    <title>第 ${Number(place.id.slice(1))} 章 · ${place.title}</title>
    <ellipse class="atlas-halo" cy="-31" rx="93" ry="65"/>
    <rect class="atlas-hit" x="-${Math.max(108, halfWidth + 36)}" y="-78" width="${Math.max(216, halfWidth * 2 + 72)}" height="131" rx="18"/>
    <g class="atlas-place-art" aria-hidden="true">${landmarkArt(place.id)}</g>
    <circle class="atlas-number-disc" cx="${-halfWidth - 19}" cy="29" r="11"/>
    <text class="atlas-number" x="${-halfWidth - 19}" y="33">${place.id.slice(1)}</text>
    <text class="atlas-label" y="37">${place.title}</text>
    <path class="atlas-selection-line" d="M-${halfWidth} 47H${halfWidth}"/>
    <g class="atlas-complete" transform="translate(${halfWidth + 18} 29)"><circle r="10"/><path d="m-4 0 3 3 5-6"/></g>
  </g>`;
}

function terrain(region: RegionId): string {
  switch (region) {
    case 'foundations': return `<path class="atlas-river" d="M365 148c-43 49 22 90-6 128s-15 60 13 76 20 69-5 130"/><path class="atlas-stream" d="M365 148c-43 49 22 90-6 128s-15 60 13 76 20 69-5 130"/><path d="M138 329q68-20 107-4t84-5" class="atlas-road"/><path d="M215 252c41 72 79 4 121 22s96-5 122-34m-111 39c-6 32-63 63-59 99m79-52c74-46 121-28 175 58" class="atlas-road"/>${[[139,277,.6],[159,294,.7],[581,189,.72],[601,211,.6],[457,404,.7],[437,431,.56]].map(([x,y,s])=>pine(x,y,s)).join('')}${[[251,166,.6],[590,299,.7],[180,357,.6]].map(([x,y,s])=>oak(x,y,s)).join('')}${[[268,264],[304,191],[484,314],[500,425],[399,437],[160,214],[607,364]].map(([x,y])=>grass(x,y)).join('')}<g class="atlas-ink" transform="translate(354 282) rotate(14)" fill="#D9C8A2"><path d="M-22-8h44V8h-44Z"/><path d="M-15-8V8M-7-8V8M1-8V8M9-8V8m8-16V8M-25-11h50m-50 22h50"/></g>`;
    case 'applications': return `<path class="atlas-river" d="M1039 143c-27 32-3 48-17 79s-2 52 26 74 17 37-2 57-30 43-9 73 30 35 19 53"/><path class="atlas-stream" d="M1039 143c-27 32-3 48-17 79s-2 52 26 74 17 37-2 57-30 43-9 73 30 35 19 53"/><path class="atlas-road" d="M847 246c49 31 74 1 109 18s110 27 148-23m-130 28c-12 52-50 68-54 118m87-72c58 37 123-10 195 79"/>${[[791,310,.76],[811,326,.8],[796,344,.66],[1247,206,.74],[1264,230,.6],[1136,384,.72],[1114,415,.63],[871,172,.5]].map(([x,y,s])=>pine(x,y,s)).join('')}${[[1156,300,.66],[825,390,.65]].map(([x,y,s])=>oak(x,y,s)).join('')}${[[946,195],[1147,170],[997,404],[1228,314],[849,296],[1108,455]].map(([x,y])=>grass(x,y)).join('')}<g class="atlas-ink" transform="translate(1040 305) rotate(-27)" fill="#D9C8A2"><path d="M-23-8h46V8h-46Z"/><path d="M-16-8V8M-8-8V8M0-8V8M8-8V8m8-16V8M-26-11h52m-52 22h52"/></g>`;
    case 'systems': return `<path d="M923 589c-28 27-21 66 7 88s34 46 25 86" class="atlas-river"/><path d="M923 589c-28 27-21 66 7 88s34 46 25 86" class="atlas-stream"/><path class="atlas-road" d="M853 660c56 43 62 7 118 12s123 49 188-28m-188 29c24 43 36 51 67 96"/>${[[1004,610,.61],[1025,629,.78],[1046,609,.58],[1184,757,.7],[1211,745,.58],[898,752,.52]].map(([x,y,s])=>pine(x,y,s,'#AFB28B')).join('')}${[[983,840],[1115,778],[804,615],[1255,710],[977,688],[875,708]].map(([x,y])=>grass(x,y)).join('')}<path d="m1215 689 27 10m-29-2 27 10m-29-2 27 10m-30-2 27 10" fill="none" stroke="#BDAD85" stroke-width="2"/><path d="M998 693q13-7 25 0m12 8q12-7 24 0" fill="none" stroke="#C1B690" stroke-width="1.4"/>`;
    case 'practice': return `<path class="atlas-road" d="M253 684c17 34 80-7 119 21s51 71 101 68"/><path class="atlas-river" d="M342 589c-25 22-45 42-28 68s31 45 12 77-10 47 6 64"/><path class="atlas-stream" d="M342 589c-25 22-45 42-28 68s31 45 12 77-10 47 6 64"/>${[[168,663,.6],[397,651,.85],[417,671,.65],[377,639,.62],[344,749,.66],[367,769,.8],[390,786,.62]].map(([x,y,s])=>pine(x,y,s)).join('')}${oak(192,730,.7)}${[[148,640],[269,614],[401,717],[527,806],[437,835],[294,754]].map(([x,y])=>grass(x,y)).join('')}<g class="atlas-ink" transform="translate(328 699) rotate(-18)" fill="#D9C8A2"><path d="M-21-8h42V8h-42Z"/><path d="M-14-8V8M-6-8V8M2-8V8M10-8V8M-24-11h48m-48 22h48"/></g>`;
  }
}

function regionMarkup(region: typeof regionPlaces[number]): string {
  const shore = shores[region.id];
  return `<g class="atlas-region" data-region="${region.id}" role="group" aria-label="${region.title}">
    <g class="atlas-geography" aria-hidden="true">
      <path d="${shore}" fill="none" stroke="#91AA97" stroke-width="32" opacity=".12"/>
      <path d="${shore}" fill="none" stroke="#86A38F" stroke-width="15" opacity=".2"/>
      <path d="${shore}" fill="${colors[region.id]}" stroke="#849174" stroke-width="1.9" filter="url(#atlas-shadow)"/>
      <path d="${shore}" fill="url(#atlas-grain)"/>
      <g clip-path="url(#atlas-clip-${region.id})">${terrain(region.id)}</g>
      <text class="atlas-region-title" x="${region.x}" y="${region.y}">${region.title}</text>
      <path d="M${region.x - 30} ${region.y + 14}h60" stroke="#84967E" stroke-width="1.2" opacity=".55"/>
    </g>
    ${chapterPlaces.filter(place => place.region === region.id).map(placeMarkup).join('')}
  </g>`;
}

export function atlasMapMarkup(): string {
  return localized`<svg id="atlas-map" viewBox="0 0 1400 900" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="AI World 知识世界：四片大陆、十三个可探索地点。使用 Tab 选择地点，回车打开。">
  <defs>
    <pattern id="atlas-sea-grid" width="100" height="100" patternUnits="userSpaceOnUse"><path d="M100 0H0V100" stroke="#779888" stroke-width=".6" fill="none" opacity=".12"/></pattern>
    <pattern id="atlas-grain" width="13" height="15" patternUnits="userSpaceOnUse"><path d="M2 5h1m6 7h1" stroke="#9B957C" stroke-width=".8" opacity=".16"/></pattern>
    <filter id="atlas-shadow" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="5" stdDeviation="3" flood-color="#677762" flood-opacity=".12"/></filter>
    ${regionPlaces.map(region => `<clipPath id="atlas-clip-${region.id}"><path d="${shores[region.id]}"/></clipPath>`).join('')}
  </defs>
  <style>
    #atlas-map{display:block;width:100%;height:100%;user-select:none;touch-action:none;font-family:Inter,"PingFang SC","Microsoft YaHei",sans-serif}
    #atlas-map path,#atlas-map line,#atlas-map circle,#atlas-map rect,#atlas-map ellipse{stroke-linecap:round;stroke-linejoin:round}
    #atlas-map .atlas-ink,#atlas-map .atlas-building{fill:none;stroke:#68765E;stroke-width:1.45}
    #atlas-map .atlas-mountain{stroke:#6D7D66;stroke-width:1.5}
    #atlas-map .atlas-tree{stroke:#778568;stroke-width:1.2;fill:none}
    #atlas-map .atlas-grass{stroke:#A5A679;stroke-width:1.35;fill:none;opacity:.75}
    #atlas-map .atlas-river{stroke:#A9C7B1;stroke-width:12;fill:none}
    #atlas-map .atlas-stream{stroke:#799E8F;stroke-width:1.2;fill:none;opacity:.65}
    #atlas-map .atlas-road{stroke:#BEA275;stroke-width:3;stroke-dasharray:4 7;fill:none;opacity:.82}
    #atlas-map .atlas-region{transition:opacity .22s}
    #atlas-map .atlas-region.is-faded,#atlas-map .atlas-region.is-muted,#atlas-map .atlas-region.is-dimmed{opacity:.25}
    #atlas-map .atlas-region.is-faded:focus-within,#atlas-map .atlas-region.is-muted:focus-within,#atlas-map .atlas-region.is-dimmed:focus-within{opacity:1}
    #atlas-map .atlas-geography{pointer-events:none}
    #atlas-map .atlas-region-title{fill:#5E735C;font-size:21px;font-weight:650;letter-spacing:3px;text-anchor:middle;paint-order:stroke;stroke:#E7EBDD;stroke-width:6px}
    #atlas-map .atlas-landmark{cursor:pointer;outline:none}
    #atlas-map .atlas-hit{fill:transparent;stroke:none}
    #atlas-map .atlas-halo{fill:#D4E4CA;stroke:#428277;stroke-width:2;opacity:0;transition:opacity .2s}
    #atlas-map .atlas-label{font-size:23px;font-weight:750;letter-spacing:.5px;fill:#344A38;text-anchor:middle;paint-order:stroke;stroke:#F8F1DE;stroke-width:7px;stroke-linejoin:round}
    #atlas-map .atlas-number-disc{fill:#F9F2DD;stroke:#A1A586;stroke-width:1.2}
    #atlas-map .atlas-number{font-family:Consolas,monospace;font-size:10px;font-weight:700;fill:#5F7155;text-anchor:middle;pointer-events:none}
    #atlas-map .atlas-selection-line{fill:none;stroke:#2D7970;stroke-width:2;opacity:0}
    #atlas-map .atlas-landmark:hover .atlas-halo,#atlas-map .atlas-landmark:focus-visible .atlas-halo,#atlas-map .atlas-landmark.is-selected .atlas-halo{opacity:.75}
    #atlas-map .atlas-landmark:hover .atlas-label,#atlas-map .atlas-landmark:focus-visible .atlas-label,#atlas-map .atlas-landmark.is-selected .atlas-label{fill:#1C7168}
    #atlas-map .atlas-landmark:focus-visible .atlas-selection-line,#atlas-map .atlas-landmark.is-selected .atlas-selection-line{opacity:1}
    #atlas-map .atlas-landmark.is-selected .atlas-number-disc{fill:#2D7970;stroke:#2D7970}
    #atlas-map .atlas-landmark.is-selected .atlas-number{fill:#FFF9E9}
    #atlas-map .atlas-complete{display:none;fill:#D8E9CC;stroke:#397A63;stroke-width:1.6}
    #atlas-map .atlas-complete path{fill:none}
    #atlas-map .atlas-landmark.is-complete .atlas-complete{display:block}
    #atlas-map .atlas-sea-label{font-size:16px;letter-spacing:6px;fill:#648777;text-anchor:middle;opacity:.9}
    #atlas-map .atlas-sea-caption{font-family:Consolas,monospace;font-size:9px;letter-spacing:2px;fill:#648777;text-anchor:middle}
    @media(prefers-reduced-motion:reduce){#atlas-map *{transition:none!important}}
  </style>
  <rect width="1400" height="900" fill="#E4EBDD"/>
  <rect width="1400" height="900" fill="url(#atlas-sea-grid)"/>
  <rect x="28" y="28" width="1344" height="844" rx="16" fill="none" stroke="#93A68A" stroke-width="1" opacity=".35" pointer-events="none"/>
  <g aria-hidden="true" pointer-events="none">
    <path d="M633 381C721 382 700 271 758 270M1125 478c-43 40-3 51 7 86M773 734c-86-24-113-17-180 28M217 459c-48 53-53 77-38 132" fill="none" stroke="#8DA693" stroke-width="2" stroke-dasharray="3 8" opacity=".7"/>
    <path d="M687 164c-31 21-7 43 15 36 21 14 37-8 22-24-2-21-25-27-37-12ZM707 644c-11-9-28 1-25 14-16 13-1 30 12 24 16 7 33-9 22-22 6-9 0-17-9-16ZM675 795c-19-10-36 11-20 23 14 14 38 1 34-12 0-8-7-15-14-11Z" fill="#F0ECD7" stroke="#8B997C" stroke-width="1.5"/>
    ${pine(702,181,.55)}${pine(696,654,.4)}
    ${ship(701,384,.77,18)}${ship(741,770,.64,-12)}${ship(175,521,.48,-15)}
    <g fill="none" stroke="#8BA792" stroke-width="1.4" opacity=".7"><path d="M60 472q12-6 24 0t24 0m-33 10q12-6 24 0M666 554q12-6 24 0t24 0m-23 10q12-6 24 0M1292 535q12-6 24 0t24 0M53 805q12-6 24 0t24 0M625 106q12-6 24 0t24 0m-22 10q12-6 24 0M656 732q12-6 24 0t24 0"/><path d="m1165 64 8 5 8-5m13 10 7 4 7-4M693 244l8 5 8-5M96 550l7 4 7-4"/></g>
    <text class="atlas-sea-label" x="650" y="505">数据海</text>
    <text class="atlas-sea-caption" x="650" y="525">THE DATA SEA</text>
    <g transform="translate(1310 98)" stroke="#69866F" stroke-width="1.2" fill="none" opacity=".82"><circle r="27" stroke-dasharray="2 5"/><circle r="18"/><path d="M0-37V37M-37 0H37"/><path d="M0-31 6 0 0 31-6 0Z" fill="#7C9A7E"/><path d="M0-31V31L-6 0Z" fill="#E4EBDD"/><path d="M-27 0 0-5 27 0 0 5Z" fill="#BCCCB0"/><text y="-44" text-anchor="middle" fill="#627C65" stroke="none" font-size="11" font-family="Consolas,monospace">N</text></g>
    <text class="atlas-map-edition" x="71" y="70" fill="#769079" font-family="Consolas,monospace" font-size="10" letter-spacing="2">AI WORLD · EXPLORER'S ATLAS</text>
  </g>
  ${regionPlaces.map(regionMarkup).join('')}
</svg>`;
}
