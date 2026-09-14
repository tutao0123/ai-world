import {t, localized} from './i18n.ts';
export const locations = [
  { id: 'token', title: t('Token 村'), subtitle: 'TOKEN VILLAGE', x: 330, y: 610 },
  { id: 'embedding', title: t('向量河谷'), subtitle: 'EMBEDDING VALLEY', x: 440, y: 400 },
  { id: 'transformer', title: t('注意力山脉'), subtitle: 'TRANSFORMER RANGE', x: 650, y: 285 },
  { id: 'llm', title: t('大模型之城'), subtitle: 'LLM CITY', x: 850, y: 470 },
  { id: 'quantization', title: t('量化矿岛'), subtitle: 'QUANTIZATION MINE', x: 1110, y: 630 },
] as const;

const tree = (x: number, y: number, scale = 1, shade = '#9CA98A') => `<g transform="translate(${x} ${y}) scale(${scale})" class="forest-tree"><path d="M0 6v16"/><path d="M-13 9 0-17 13 9Z" fill="${shade}"/><path d="M-11 0 0-22 11 0Z" fill="${shade}"/><path d="M0-15V7" opacity=".3"/></g>`;

const broadTree = (x: number, y: number, scale = 1) => `<g transform="translate(${x} ${y}) scale(${scale})" class="forest-tree"><path d="M0 0v26m0-8-7-7m7 1 7-9"/><path d="M-15 5C-26-3-13-13-9-12-17-26 4-31 10-21 26-23 29-5 17-1 24 12 4 17-2 9-8 15-19 12-15 5Z" fill="#B6B994"/><path d="M0-13V7m0-4 8-6m-8 3-7-5" opacity=".5"/></g>`;

const house = (x: number, y: number, scale = 1, roof = '#C98661') => `<g transform="translate(${x} ${y}) scale(${scale})" class="building"><path d="M-17-10h34v27h-34Z" fill="#F5E8CF"/><path d="M17-10 25-16v25l-8 8Z" fill="#D8C6A6"/><path d="M-22-10 0-30 23-10Z" fill="${roof}"/><path d="m0-30 9-6 21 20-7 6Z" fill="#A76F54"/><path d="M-4 17V3h8v14" fill="#756F59"/><path d="M-13-4h6v7h-6Zm21 0h6v7H8Z" fill="#A1B8AC"/><path d="M-23 20h51" opacity=".25"/></g>`;

const mountain = (x: number, y: number, scale = 1, fill = '#BCBEAA') => `<g transform="translate(${x} ${y}) scale(${scale})" class="mountain"><path d="M-55 49-5-54 17-26 25-30 68 49Z" fill="${fill}"/><path d="m-5-54 14 54 9 16 16 33H-11L1 14-14-20Z" fill="#8D9F92" stroke="none"/><path d="m-5-54-16 35 12-5 10 10 6-8 10-4Z" fill="#F5F1E5"/><path d="m-34 8 8-13m58 24 9 13m-52-20-8 17" opacity=".45"/></g>`;

const tuft = (x: number, y: number) => `<path d="m${x - 5} ${y} -3-5m8 5v-8m5 8 3-5" class="grass"/>`;

const mainLand = 'M218 407C192 365 224 326 251 299C242 267 266 228 300 223C315 184 358 186 396 192C421 172 443 155 477 166C507 140 538 152 562 131C590 99 634 117 657 136C684 128 726 143 728 170C780 163 800 202 825 211C870 202 883 240 878 268C905 285 919 315 911 344C949 369 932 407 960 436C985 464 975 499 950 514C959 545 935 582 912 580C900 616 868 620 840 609C820 629 780 625 763 657C747 685 710 703 677 687C660 718 624 728 605 703C575 720 553 739 520 730C499 748 471 762 447 744C417 766 382 745 367 726C334 742 306 724 301 701C268 702 247 683 257 659C222 646 223 613 236 591C210 573 214 547 223 528C192 508 201 478 222 462C207 446 205 423 218 407Z';
const mineLand = 'M1019 558C1006 536 1024 514 1047 518C1057 484 1089 483 1111 500C1137 481 1166 499 1171 521C1208 519 1226 548 1217 572C1242 588 1240 617 1221 634C1233 665 1207 686 1186 684C1171 712 1141 703 1127 722C1101 734 1071 720 1062 700C1028 714 1004 688 1014 666C980 653 982 624 1003 611C988 589 1001 569 1019 558Z';

function locationLabel(title: string, english: string, x: number, y: number, number: string) {
  return `<g transform="translate(${x} ${y})"><circle class="marker-shadow" cy="4" r="19"/><circle class="marker-ring" r="24"/><circle class="marker" r="17"/><text class="marker-number" y="5">${number}</text></g><text class="map-label" x="${x}" y="${y + 46}">${title}</text><text class="map-label-en" x="${x}" y="${y + 66}">${english}</text><g class="visited-check" transform="translate(${x + 20} ${y - 15})"><circle r="9"/><path d="m-4 0 3 3 5-6"/></g><title>${title} · ${english}</title>`;
}

export function worldMapMarkup(): string {
  return localized`<svg id="world-map" viewBox="0 0 1400 900" xmlns="http://www.w3.org/2000/svg" role="group" aria-label="AI World 交互探索地图：Token 村、向量河谷、注意力山脉、大模型之城与量化矿岛">
  <defs>
    <pattern id="map-sea-grid" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M80 0H0V80" fill="none" stroke="#6D8A83" stroke-width=".6" opacity=".12"/></pattern>
    <pattern id="map-sea-dots" width="17" height="17" patternUnits="userSpaceOnUse"><circle cx="3" cy="5" r=".65" fill="#71857B" opacity=".14"/></pattern>
    <pattern id="map-land-grain" width="11" height="13" patternUnits="userSpaceOnUse"><path d="M1 4h1m5 6h1" stroke="#9B957F" stroke-width=".7" opacity=".2"/></pattern>
    <filter id="map-paper-shadow" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="6" stdDeviation="3" flood-color="#656F5D" flood-opacity=".1"/></filter>
  </defs>
  <style>
    #world-map {display:block;width:100%;height:100%;user-select:none;touch-action:none;font-family:Inter,"PingFang SC","Microsoft YaHei",sans-serif}
    #world-map path,#world-map line,#world-map circle,#world-map rect,#world-map ellipse,#world-map polyline{stroke-linecap:round;stroke-linejoin:round}
    #world-map .building,#world-map .mountain{stroke:#586556;stroke-width:1.5}
    #world-map .forest-tree{stroke:#6D7A60;stroke-width:1.15}
    #world-map .grass{fill:none;stroke:#A3A787;stroke-width:1.3;opacity:.65}
    #world-map .landmark{cursor:pointer;outline:none}
    #world-map .map-label{font-size:25px;font-weight:700;fill:#303E35;text-anchor:middle;paint-order:stroke;stroke:#F7F2E5;stroke-width:8px;stroke-linejoin:round;letter-spacing:1px}
    #world-map .map-label-en{font-family:"SFMono-Regular",Consolas,monospace;font-size:10px;letter-spacing:1.8px;fill:#76806D;text-anchor:middle;paint-order:stroke;stroke:#F7F2E5;stroke-width:5px}
    #world-map .marker-shadow{fill:#888E70;opacity:.2}
    #world-map .marker-ring{fill:none;stroke:#2D7775;stroke-width:1.5;opacity:0;transition:opacity .2s,r .2s}
    #world-map .marker{fill:#F7F2E5;stroke:#4D6454;stroke-width:1.5;transition:fill .2s}
    #world-map .marker-number{fill:#4D6454;font-family:Consolas,monospace;font-size:13px;text-anchor:middle;font-weight:700;pointer-events:none}
    #world-map .landmark:hover .marker-ring,#world-map .landmark:focus-visible .marker-ring,#world-map .landmark.is-selected .marker-ring{opacity:1}
    #world-map .landmark:hover .marker,#world-map .landmark:focus-visible .marker,#world-map .landmark.is-selected .marker{fill:#2D7775;stroke:#2D7775}
    #world-map .landmark:hover .marker-number,#world-map .landmark:focus-visible .marker-number,#world-map .landmark.is-selected .marker-number{fill:#fff}
    #world-map .landmark.is-selected .map-label{fill:#2D7775}
    #world-map .visited-check{display:none;fill:#DCE7DA;stroke:#2D7775;stroke-width:1.5}
    #world-map .landmark.is-visited .visited-check{display:block}
    #world-map .visited-check path{fill:none}
    #world-map .sea-note{fill:#719087;font-size:12px;letter-spacing:3px;font-family:Consolas,monospace;text-anchor:middle;opacity:.7}
    #world-map .map-detail{pointer-events:none}
    @media(prefers-reduced-motion:reduce){#world-map *{transition:none!important}}
  </style>
  <rect width="1400" height="900" fill="#E7EBE1"/>
  <rect width="1400" height="900" fill="url(#map-sea-grid)"/>
  <rect width="1400" height="900" fill="url(#map-sea-dots)"/>

  <g class="map-detail" fill="none" stroke="#829D90">
    <path d="M138 390C123 326 175 241 228 223C260 150 336 132 391 150C467 93 538 82 594 80C678 84 722 108 768 131C840 130 933 211 936 263C1009 321 1023 415 1023 457C1034 507 1003 562 974 584C958 664 879 684 829 671C789 735 723 755 676 745C639 786 568 796 530 780C447 826 376 791 348 786C280 806 223 750 211 715C169 701 156 651 171 606C132 564 151 522 151 491C126 446 137 425 138 390Z" opacity=".18" stroke-width="1.3"/>
    <path d="${mainLand}" stroke-width="48" opacity=".08"/>
    <path d="${mainLand}" stroke-width="23" opacity=".16"/>
    <path d="${mineLand}" stroke-width="44" opacity=".08"/>
    <path d="${mineLand}" stroke-width="21" opacity=".16"/>
  </g>
  <g class="map-detail" filter="url(#map-paper-shadow)" fill="#F7F2E5" stroke="#7C8B70" stroke-width="2">
    <path d="${mainLand}"/>
    <path d="${mineLand}"/>
    <path d="M1078 399c-7-11 4-22 15-18 11-11 24-3 23 8 16 5 9 21-4 20-10 10-33 8-34-10Z"/>
    <path d="M1177 780c-9-10 3-22 13-16 12-8 26 3 19 13-8 9-24 12-32 3Z"/>
    <path d="M163 666c-13-8-6-22 7-23 6-14 26-12 28 1 9 14-15 31-35 22Z"/>
    <path d="M908 728c-8-9-2-22 10-21 6-10 23-4 19 8 6 12-21 22-29 13Z"/>
  </g>
  <g class="map-detail" fill="url(#map-land-grain)"><path d="${mainLand}"/><path d="${mineLand}"/></g>

  <g class="map-detail" fill="none">
    <path d="M258 363c59-33 108-42 157-37 70 11 95-26 126-48" stroke="#D6DABD" stroke-width="43" opacity=".5"/>
    <path d="M402 260c-43 24-63 73-62 123 0 58 43 93 24 153-10 30-21 29-43 47" stroke="#B4C9B8" stroke-width="14"/>
    <path d="M402 260c-43 24-63 73-62 123 0 58 43 93 24 153-10 30-21 29-43 47" stroke="#779F95" stroke-width="1.5"/>
    <path d="M540 328c-46 14-74 62-64 111 11 59 53 67 70 100 12 27 0 61-21 81-21 22-11 70 0 108" stroke="#A9C6BA" stroke-width="18"/>
    <path d="M540 328c-46 14-74 62-64 111 11 59 53 67 70 100 12 27 0 61-21 81-21 22-11 70 0 108" stroke="#789F94" stroke-width="1.5"/>
    <path d="M786 320c-35 28-42 72-29 102 16 38 37 55 25 86-10 29-22 57-1 87" stroke="#B4C9B8" stroke-width="11"/>
    <path d="M788 321c-35 28-42 72-29 102 16 38 37 55 25 86-10 29-22 57-1 87" stroke="#789F94" stroke-width="1.2"/>
  </g>

  <g class="map-detail">
    <path d="M264 470c-6-68 18-127 41-137 39 0 39 49 33 66-20 23-22 61-49 90Z" fill="#E2E3C8"/>
    ${[[268,367,.9],[299,347,1],[279,395,.85],[308,389,1.1],[260,421,.8],[307,427,.9],[288,453,.9]].map(([x,y,s]) => tree(x,y,s)).join('')}
    ${[[560,171,.9],[574,197,.85],[536,192,.75],[760,248,.8],[782,254,.65],[801,285,.95],[821,310,.7]].map(([x,y,s]) => tree(x,y,s)).join('')}
    <path d="M590 494c14-26 70-41 103-22 30 15 37 82 13 109-24 23-69 26-97 7-35-19-39-72-19-94Z" fill="#E1E2C8"/>
    ${[[619,492,.9],[650,480,1],[680,495,.75],[599,527,.85],[632,524,1.1],[665,520,.9],[695,530,.85],[615,559,.8],[650,560,1],[681,566,.9]].map(([x,y,s]) => tree(x,y,s,'#A8AF8A')).join('')}
    ${[[398,650,.8],[420,675,.75],[386,690,.9],[715,626,.8],[690,646,.6],[750,581,.6],[1172,642,.6],[1187,661,.75],[1050,566,.6]].map(([x,y,s]) => broadTree(x,y,s)).join('')}
    ${[[286,307],[325,261],[461,201],[479,259],[307,475],[277,517],[385,491],[415,536],[452,580],[453,664],[391,712],[591,649],[622,615],[718,429],[712,391],[874,564],[917,405],[899,325],[1070,666],[1155,692],[1203,583]].map(([x,y]) => tuft(x,y)).join('')}
    <g fill="none" stroke="#C0BE9A" stroke-width="1.2"><path d="m269 619 33-15m-29 24 32-14m-28 24 32-14m-26 23 31-13M425 602l39 13m-42-4 39 13m-42-4 39 13m-42-4 39 13"/><path d="M697 175q10-7 20 0m-1 31q10-7 20 0m-347 3q10-7 20 0m166 470q10-7 20 0"/></g>
  </g>

  <g class="map-detail" fill="none" stroke="#C3A777" stroke-width="3" stroke-dasharray="5 8">
    <path d="M330 610c39-32 96-44 105-98 10-54-28-71 5-112C480 348 574 346 650 285c57 11 49 68 101 87 30 16 50 37 99 98"/>
    <path d="M871 480c51 15 79 42 128 58 51 17 79 55 111 92" stroke="#879F95"/>
  </g>
  <g class="map-detail" transform="translate(481 384) rotate(-27)" fill="#DED1B5" stroke="#8C8165" stroke-width="1.5"><path d="M-20-9H20V9H-20Z"/><path d="M-14-9V9m7-18V9M0-9V9m7-18V9m7-18V9M-23-12H23m-46 24H23"/></g>
  <g class="map-detail" transform="translate(755 418) rotate(-18)" fill="#DED1B5" stroke="#8C8165" stroke-width="1.5"><path d="M-17-8H17V8H-17Z"/><path d="M-10-8V8M-3-8V8M4-8V8m7-16V8M-21-11H21m-42 22H21"/></g>

  <g class="landmark is-selected" data-location="token" tabindex="0" role="button" aria-label="探索 Token 村：文字如何变成模型的输入">
    <ellipse cx="327" cy="558" rx="86" ry="34" fill="#DEDFC2" opacity=".75"/>
    ${house(283,558,.9)}${house(330,538,1.15)}${house(373,564,.85,'#98A58B')}
    <g class="building" transform="translate(343 582)"><ellipse rx="13" ry="5" fill="#C1C6B0"/><path d="M-9-12v12c4 4 14 4 18 0v-12Z" fill="#D6DAC7"/><ellipse cy="-12" rx="9" ry="4" fill="#839D92"/><path d="M-11-12v-12h22v12m-25-12h28" fill="none"/></g>
    <path d="M252 582h30m-27-6v13m13-13v13m13-13v13m100-6h22m-19-6v12m15-12v12" fill="none" stroke="#AC9A73" stroke-width="1.4"/>
    ${locationLabel(t('Token 村'),'TOKEN VILLAGE',330,610,'01')}
  </g>

  <g class="landmark" data-location="embedding" tabindex="0" role="button" aria-label="探索向量河谷：词语如何拥有位置与含义">
    <path d="M373 355c19-24 43-16 67-22 30-10 50-3 61 16-35 19-52 25-76 26-31 1-42-8-52-20Z" fill="#DDE0C4"/>
    ${broadTree(383,328,.8)}${broadTree(486,314,.95)}${broadTree(418,312,.75)}
    <g fill="#EEE5CA" stroke="#788570" stroke-width="1.5"><path d="m426 335 14-13 15 13v23h-29Z"/><path d="m440 322 7-6 15 14-7 5m0 23 7-7v-21" fill="#C8CFB8"/><path d="M437 359v-17h7v17" fill="#889C8B"/></g>
    <g fill="none" stroke="#9AAB91" stroke-width="1.2"><path d="m398 349 29-1m30-7 19-4m-57 27 15-11"/><circle cx="398" cy="349" r="3" fill="#789B87"/><circle cx="476" cy="337" r="3" fill="#789B87"/><circle cx="419" cy="364" r="3" fill="#789B87"/></g>
    ${locationLabel(t('向量河谷'),'EMBEDDING VALLEY',440,400,'02')}
  </g>

  <g class="landmark" data-location="transformer" tabindex="0" role="button" aria-label="探索注意力山脉：Token 怎样彼此交换信息">
    <path d="M533 254c0-25 34-73 75-80 49-19 101-17 137 27l14 54c-73 15-151 17-226-1Z" fill="#D8DDC9" opacity=".7"/>
    ${mountain(564,220,.7,'#CBD0B9')}${mountain(708,215,.83,'#B8C0AA')}${mountain(608,202,1.07)}${mountain(654,188,1.13,'#BEC7B2')}
    <path d="m650 128 0-33 20 5-20 8" fill="#BD7954" stroke="#6F7B68" stroke-width="1.4"/>
    <path d="m611 245 16-21 10 5 11-17 14 10 17-15 18 18" fill="none" stroke="#E8E5D0" stroke-width="2" stroke-dasharray="3 4"/>
    ${locationLabel(t('注意力山脉'),'TRANSFORMER RANGE',650,285,'03')}
  </g>

  <g class="landmark" data-location="llm" tabindex="0" role="button" aria-label="探索大模型之城：从预测下一个 Token 到对话">
    <ellipse cx="850" cy="421" rx="82" ry="25" fill="#DDE0C8"/>
    <g class="building">
      <path d="M789 422v-56h24v56m68 0v-65h23v65" fill="#E7DEC4"/>
      <path d="m786 366 15-18 15 18Zm92-9 15-18 15 18Z" fill="#8FA292"/>
      <path d="M808 429v-57l42-20 38 20v57Z" fill="#F0E5CB"/>
      <path d="m803 374 47-30 44 30-7 7-37-24-35 20Z" fill="#9EAB93"/>
      <path d="M834 418v-75l16-15 16 15v75" fill="#E4D9BD"/>
      <path d="m829 344 21-26 21 26Z" fill="#6F9488"/>
      <path d="M850 319v-21l17 6-17 7" fill="#CB8A62"/>
      <circle cx="850" cy="360" r="8" fill="#F6F0DF"/><path d="M850 354v7l5 3" fill="none"/>
      <path d="M841 429v-26a9 9 0 0 1 18 0v26" fill="#788A76"/>
      <path d="M792 414h-10v16h136v-16h-11v7h-13v-7h-12v7h-17m-25 0h-15v-7h-13v7h-12v-7Z" fill="#DCD4B9"/>
      <path d="M797 379h7v9h-7Zm0 19h7v9h-7Zm22-10h6v9h-6Zm56 0h6v9h-6Zm15-18h7v9h-7Zm0 18h7v9h-7Z" fill="#8FA99B"/>
    </g>
    ${locationLabel(t('大模型之城'),'LLM CITY',850,470,'04')}
  </g>

  <g class="landmark" data-location="quantization" tabindex="0" role="button" aria-label="探索量化矿岛：让一个 70B 模型装进显存">
    <path d="M1045 591 1068 552 1087 558 1119 522 1142 552 1156 545 1186 591Z" fill="#CCBFA0" stroke="#8A8167" stroke-width="1.5"/>
    <path d="m1119 522 4 38 18 31m-54-33 12 22-2 11m45-39 16 25" fill="none" stroke="#AA9C7D" stroke-width="1.5"/>
    <path d="M1087 592v-23q17-23 34 0v23" fill="#6F7261" stroke="#626652" stroke-width="1.5"/>
    <path d="M1082 592v-26l23-17 22 17v26m-39-2v-22l17-12 17 12v22" fill="none" stroke="#B29366" stroke-width="5"/>
    <path d="m1095 583-21 29m41-29-7 29m-30-7 32 0m-25-9h28m-23-8h24" fill="none" stroke="#898773" stroke-width="1.5"/>
    <g transform="translate(1063 597)" stroke="#68735E" stroke-width="1.4"><path d="m-13-15 26 0-4 15h-18Z" fill="#A1AE92"/><circle cx="-7" cy="3" r="4" fill="#667663"/><circle cx="7" cy="3" r="4" fill="#667663"/><path d="m-10-15 6-9 6 6 7-5 3 8" fill="#C49568"/></g>
    <g transform="translate(1160 591)" class="building"><path d="M-19 8v-30h33V8Z" fill="#EADDC0"/><path d="M-23-22 0-41 19-22Z" fill="#B9825F"/><path d="M-7 8V-8h9V8m15 0V-53h8V8" fill="#A58D68"/><path d="M25-44 13-34m12-3-12 10" fill="none"/></g>
    ${locationLabel(t('量化矿岛'),'QUANTIZATION MINE',1110,630,'05')}
  </g>

  <g class="map-detail">
    <g transform="translate(996 474) rotate(13)" stroke="#697F71" stroke-width="1.4"><path d="M-22 10h43L9 22H-10Z" fill="#C1A077"/><path d="M0 10v-42" fill="none"/><path d="M-3-27-3 6H-25Z" fill="#F5F0DD"/><path d="m3-22 18 27H3Z" fill="#D1D9C4"/><path d="M-26 28q9-5 16 0t18 0 16 0" fill="none" opacity=".5"/></g>
    <g transform="translate(188 293) rotate(-18)" stroke="#819386" stroke-width="1.3"><path d="M-15 5h30L5 14H-6Z" fill="#C7B38D"/><path d="M0 5v-26M-2-18-2 3h-13Z" fill="#F7F2E5"/><path d="M-21 19q8-4 15 0t15 0" fill="none"/></g>
    <g fill="none" stroke="#82998C" stroke-width="1.2" opacity=".55"><path d="M88 540q10-5 20 0t20 0m-20 9q10-5 20 0M1147 350q10-5 20 0t20 0m-20 9q10-5 20 0M724 785q10-5 20 0t20 0m-20 9q10-5 20 0M1255 542q10-5 20 0t20 0M319 805q10-5 20 0t20 0"/><path d="m1047 191 8 5 8-5m14 12 7 4 7-4M144 447l7 4 7-4"/></g>
    <text x="1114" y="246" text-anchor="middle" font-size="25" letter-spacing="12" fill="#849C8C" opacity=".75">数 据 海</text>
    <text x="1110" y="269" class="sea-note">THE DATA SEA</text>
    <text x="527" y="799" class="sea-note" font-size="10">FOLLOW YOUR CURIOSITY</text>
    <path d="M472 812h110" stroke="#8B9D8C" opacity=".35"/>
    <g transform="translate(1189 134)" stroke="#708879" stroke-width="1.2" fill="none" opacity=".85"><circle r="31" stroke-dasharray="2 5"/><circle r="21"/><path d="M0-40V40M-40 0H40"/><path d="M0-33 7 0 0 33-7 0Z" fill="#799887"/><path d="M0-33V33l-7-33Z" fill="#E7EBE1"/><path d="M-28 0 0-5 28 0 0 5Z" fill="#C0CDB9"/><text y="-49" text-anchor="middle" fill="#637D6C" stroke="none" font-size="12" font-family="Consolas,monospace">N</text></g>
    <g transform="translate(144 751)" fill="none" stroke="#819681" stroke-width="1.2" opacity=".7"><path d="M0 0v7h90V0M0 7v7m45-7v7m45-7v7"/><text x="45" y="34" text-anchor="middle" fill="#819681" stroke="none" font-size="9" letter-spacing="1.5">A WORLD TO DISCOVER</text></g>
    <g transform="translate(753 131)" fill="none" stroke="#A4AF98" stroke-width="1.2" opacity=".55"><path d="M-28 2c-9-2-8-13 0-14 1-14 23-14 27-3 11-7 24 1 21 12 13-1 16 14 4 16h-48"/><path d="M-36 21H11m11 0h13"/></g>
  </g>
</svg>`;
}
