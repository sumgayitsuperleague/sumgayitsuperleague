import {VENUE_COPY} from './venue-source.js';
import {experienceCopy} from './fan-experience.js';
import {pageListen,pageInterval,pageTimeout,pageFrame,onPageCleanup,pageScope} from './page-lifecycle.js';
import {READABILITY_COPY} from './readability-copy.js';
import {PLAYER_DUEL_COPY} from './player-duel-copy.js';
import {STADIUM_COPY} from './stadium-source.js';
import {MATCH_LIVE_COPY} from './match-live-copy.js';
import {EXPERIENCE_COPY} from './experience-copy.js';
import {SPONSOR_COPY} from './sponsors-source.js';
import {EDITORIAL_COPY} from './editorial-copy.js';
import {BASE_TRANSLATIONS} from './interface-base.js';
import {FAN_COPY} from './fan-copy.js';
import {REFINEMENT_COPY} from './refinement-copy.js';
import {GUIDE_TRANSLATIONS} from './guide-source.js';
import {localizedContent} from './localization-source.js';
import {canonicalPath,languageHref,siteAnchor} from './routes-source.js';
export const LANGUAGE_NAMES={az:'Azərbaycan dili',ru:'Русский',en:'English'};
export function languageFrom(search,storage){const q=new URLSearchParams(search).get('lang');if(['az','ru','en'].includes(q))return q;try{const saved=storage?.getItem('ssl.language.v1');if(['az','ru','en'].includes(saved))return saved;}catch{}return 'az';}
export let LANG=languageFrom(location.search,typeof localStorage==='undefined'?null:localStorage);
export function configureLanguage(){LANG=languageFrom(location.search,typeof localStorage==='undefined'?null:localStorage);}
export const searchKey=value=>String(value||'').normalize('NFKD').replace(/\p{M}/gu,'').toLocaleLowerCase('az').replace(/ı/g,'i').replace(/ə/g,'e');
export const localeContent=data=>localizedContent(data,LANG);
const rows=[...BASE_TRANSLATIONS,['Final mərkəzi','Final centre','Центр финала'],['Final səhifəsinə bax','Explore the final','Открыть финал'],['Final qarşılaşması hələ təyin edilməyib.','The final fixture has not been set yet.','Финальный матч пока не назначен.']];
rows.push(...VENUE_COPY,...READABILITY_COPY,...STADIUM_COPY,...REFINEMENT_COPY,...GUIDE_TRANSLATIONS,...FAN_COPY,...EDITORIAL_COPY,...EXPERIENCE_COPY,...SPONSOR_COPY,...MATCH_LIVE_COPY,...PLAYER_DUEL_COPY);
for(const row of experienceCopy)if(!rows.some(existing=>existing[0].toLocaleLowerCase('az')===row[0].toLocaleLowerCase('az')))rows.push(row);
const dictionaries={en:new Map(),ru:new Map()};
for(const [az,en,ru] of rows){dictionaries.en.set(az.toLocaleLowerCase('az'),en);dictionaries.ru.set(az.toLocaleLowerCase('az'),ru);}
const russianCount=(number,forms)=>{const n=Number(number);return forms[n%100>=11&&n%100<=14?2:n%10===1?0:n%10>=2&&n%10<=4?1:2];};
export const interfaceCopy=rows;
const textMemory=new WeakMap(),attributeMemory=new WeakMap(),copyKey=value=>String(value).trim().normalize('NFC').toLocaleLowerCase('az');
let copyOverrides=new Map(),copyAliases=new Map(),translatedDefaults=new Map();
export function configureEditorTexts(editor,source,path=location.pathname){
 const route=canonicalPath(path);copyOverrides=new Map();copyAliases=new Map();translatedDefaults=new Map();
 for(const [az,en,ru] of rows){if(LANG==='en')copyAliases.set(copyKey(en),az);if(LANG==='ru')copyAliases.set(copyKey(ru),az);}
 for(const row of source?.locales?.[LANG]||[]){copyAliases.set(copyKey(row.text),row.source);translatedDefaults.set(copyKey(row.source),row.text);}
 for(const row of (editor?.labels||[]).filter(r=>r.scope==='*'||r.scope===route).sort((a,b)=>(a.scope==='*'?-1:1)-(b.scope==='*'?-1:1)))copyOverrides.set(copyKey(row.source),row);
 for(const row of copyOverrides.values())for(const value of [row.az,row[LANG]])if(value?.trim()&&!copyOverrides.has(copyKey(value)))copyAliases.set(copyKey(value),row.source);
}
const originalCopy=value=>{const m=String(value).match(/^(\s*)(.*?)(\s*)$/s),alias=copyOverrides.has(copyKey(m[2]))?undefined:copyAliases.get(copyKey(m[2]));return alias===undefined?String(value):m[1]+alias+m[3];};
export const sourceText=node=>(textMemory.get(node)?.source||originalCopy(node?.nodeValue||'')).trim();
export function t(text,lang=LANG){
 const match=String(text).match(/^(\s*)(.*?)(\s*)$/s);let core=match[2],out=translatedDefaults.get(copyKey(core))??dictionaries[lang]?.get(core.toLocaleLowerCase('az'));
 const decorated=core.match(/^([☆★▶←]?\s*)(.*?)(\s*[↗→⌄▾:+]?)$/s),original=copyOverrides.has(copyKey(core))?core:copyAliases.get(copyKey(core))||core,middle=copyAliases.get(copyKey(decorated[2]))||decorated[2],direct=copyOverrides.get(copyKey(original)),row=direct||copyOverrides.get(copyKey(middle));
 if(row&&(lang==='az'||row[lang]?.trim()))return match[1]+(direct?'':decorated[1])+row[lang]+(direct?'':decorated[3])+match[3];
 if(lang==='az')return text;
 if(out===undefined){
  const ornament=core.match(/^([☆★▶←]?\s*)(.*?)(\s*[↗→⌄▾:+]?)$/s);const middle=dictionaries[lang]?.get(ornament[2].toLocaleLowerCase('az'));if(middle!==undefined)out=ornament[1]+middle+ornament[3];
 }
 if(out===undefined){
  const round=core.match(/^(\d+)-(?:ci|cı|cü|cu)\s+(tur(?: nəticələri)?|yer|sezon)(.*)$/i);
  if(round){const type=round[2].toLocaleLowerCase('az'),n=round[1];out=lang==='en'?(type.startsWith('tur')?'Matchweek '+n+(type.includes('nəticələri')?' results':''):type==='yer'?'Position '+n:'Season '+n):(type.startsWith('tur')?n+'-й тур'+(type.includes('nəticələri')?' · результаты':''):type==='yer'?n+'-е место':n+'-й сезон');out+=round[3];}
  const clubs=core.match(/^(\d+) komanda\. Bir şəhər\. Bir liqa\.$/);if(clubs)out=lang==='en'?clubs[1]+' clubs. One city. One league.':clubs[1]+' команд. Один город. Одна лига.';
  const group=core.match(/^QRUP\s+([A-Z0-9]+)$/i);if(group)out=(lang==='en'?'GROUP ':'ГРУППА ')+group[1];
  const season=core.match(/^(\d{4})\s+MÖVSÜMÜ$/i);if(season)out=lang==='en'?season[1]+' SEASON':'СЕЗОН '+season[1];
 }
 if(out===undefined)out=core;
 {
  out=out.replace(/(\d+) oyunda qol vurub/g,(_,n)=>lang==='en'?'Scored in '+n+(n==='1'?' match':' matches'):'Забивал в '+n+' матчах').replace(/(\d{4}) MÖVSÜMÜ/gi,lang==='en'?'$1 SEASON':'СЕЗОН $1').replace(/(\d+)-(?:ci|cı|cü|cu) sezon/gi,lang==='en'?'SEASON $1':'$1-Й СЕЗОН').replace(/LİQA FOTOLARI \/ (\d{4})/g,lang==='en'?'LEAGUE PHOTOS / $1':'ФОТО ЛИГИ / $1').replace(/Son yenilənmə:/g,lang==='en'?'Updated:':'Обновлено:').replace(/komandasını sevimli seç/g,lang==='en'?'— set as favourite club':'— выбрать любимой командой').replace(/ loqosu(?=$|[\s·])/g,lang==='en'?' logo':' · логотип').replace(/ videosunu YouTube-da izlə/g,lang==='en'?' — watch on YouTube':' — смотреть на YouTube').replace(/(\d+) liqa qeydiyyatı/g,lang==='en'?'$1 registered players':'$1 зарегистрированных игроков').replace(/(\d+) oyunçu(?=$|[\s·():,—–])/g,(_,n)=>lang==='en'?n+(n==='1'?' player':' players'):n+' игроков').replace(/(\d+) video(?=$|[\s·():,—–])/g,(_,n)=>lang==='en'?n+(n==='1'?' video':' videos'):n+' '+russianCount(n,['видео','видео','видео'])).replace(/(\d+) qələbə/g,(_,n)=>lang==='en'?n+(n==='1'?' win':' wins'):n+' '+russianCount(n,['победа','победы','побед'])).replace(/(\d+) heç-heçə/g,(_,n)=>lang==='en'?n+(n==='1'?' draw':' draws'):n+' '+russianCount(n,['ничья','ничьи','ничьих'])).replace(/(\d+) qol(?=$|[\s·():,—–])/g,(_,n)=>lang==='en'?n+(n==='1'?' goal':' goals'):n+' '+russianCount(n,['гол','гола','голов'])).replace(/(\d+) OYUN(?=$|[\s·():,—–])/g,(_,n)=>lang==='en'?n+' MATCHES':n+' МАТЧА').replace(/(\d+) oyun(?=$|[\s·():,—–])/g,(_,n)=>lang==='en'?n+(n==='1'?' match':' matches'):n+' '+russianCount(n,['матч','матча','матчей'])).replace(/(\d+) xal/g,(_,n)=>lang==='en'?n+(n==='1'?' point':' points'):n+' '+russianCount(n,['очко','очка','очков'])).replace(/öz qapısına/g,lang==='en'?'own goal':'автогол').replace(/Ən yaxşı oyunçu:/g,lang==='en'?'Player of the match:':'Лучший игрок матча:').replace(/QAPIÇI/g,lang==='en'?'GOALKEEPER':'ВРАТАРЬ').replace(/OYUNÇU/g,lang==='en'?'PLAYER':'ИГРОК').replace(/2-ci dövr \(səfər\)/g,lang==='en'?'Return fixtures':'Второй круг').replace(/1-ci dövr/g,lang==='en'?'First round of fixtures':'Первый круг').replace(/BÜTÜN FUTBOLÇULAR/g,lang==='en'?'ALL PLAYERS':'ВСЕ ИГРОКИ').replace(/(^|[\s(])Cəmi(?=$|[\s·:).,])/g,(_,prefix)=>prefix+(lang==='en'?'Total':'Всего')).replace(/\(own goal vurulanlar daxil deyil\)/g,'(own goals excluded)').replace(/\(автогол vurulanlar daxil deyil\)/g,'(без автоголов)').replace(/Baş məşqçi:/g,lang==='en'?'Head coach:':'Главный тренер:').replace(/Forma:/g,lang==='en'?'Form:':'Форма:');
 }
 if(core.length>2&&core===core.toLocaleUpperCase('az')&&/[A-Za-zƏəİıÖöÜüŞşÇçĞğ]/.test(core))out=out.toLocaleUpperCase(lang);
 return match[1]+out+match[3];
}
export function fullDate(date){if(!date)return '';if(LANG==='az'){const [y,m,d]=date.split('-'),months=['yanvar','fevral','mart','aprel','may','iyun','iyul','avqust','sentyabr','oktyabr','noyabr','dekabr'];return +d+' '+months[m-1]+' '+y;}return new Intl.DateTimeFormat(LANG==='ru'?'ru-RU':'en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(date+'T00:00:00Z'));}
export function languageSelector(){return `<div class="language-picker" role="group" aria-label="${t('Dil seçimi')}">${['az','ru','en'].map(code=>`<button type="button" class="language-option ${code===LANG?'active':''}" data-language="${code}" aria-pressed="${code===LANG}" title="${LANGUAGE_NAMES[code]}" aria-label="${LANGUAGE_NAMES[code]}"><img src="/assets/flags/${code}.svg" alt="" width="22" height="22"><span>${code.toUpperCase()}</span></button>`).join('')}</div>`;}
export function enhanceRoot(root=document.body,force=false){
 const walk=node=>{if(node.nodeType===3){if(node.parentElement?.closest('[contenteditable="true"],[contenteditable="plaintext-only"]'))return;const memory=textMemory.get(node),original=memory&&(force||node.nodeValue===memory.output)?memory.source:originalCopy(node.nodeValue),translated=t(original);textMemory.set(node,{source:original,output:translated});if(translated!==node.nodeValue)node.nodeValue=translated;return;}if(node.nodeType!==1||['SCRIPT','STYLE','TEXTAREA'].includes(node.tagName)||node.getAttribute('translate')==='no')return;let attrs=attributeMemory.get(node);if(!attrs){attrs={};attributeMemory.set(node,attrs);}for(const key of ['aria-label','placeholder','title','alt'])if(node.hasAttribute(key)){const current=node.getAttribute(key),old=attrs[key],original=old&&(force||current===old.output)?old.source:originalCopy(current),translated=t(original);attrs[key]={source:original,output:translated};if(translated!==current)node.setAttribute(key,translated);}for(const child of [...node.childNodes])walk(child);};walk(root);
 const base=new URL(location.href||'https://sumgayitsuperleague.com/');
 for(const anchor of root.querySelectorAll('a[href]')){const value=anchor.getAttribute('href');try{const href=siteAnchor(value,base.href,LANG,document.body.dataset.cleanRoutes==='1');if(value!==href)anchor.setAttribute('href',href);}catch{}}
}
export function installLanguage(){
 document.documentElement.lang=LANG;enhanceRoot();
 pageListen(document,'click',event=>{const button=event.target.closest('[data-language]');if(!button)return;const language=button.dataset.language;if(!['az','ru','en'].includes(language)||language===LANG)return;try{localStorage.setItem('ssl.language.v1',language);}catch{}const href=languageHref(location.href,language);if(window.SSL_SITE?.enabled)window.SSL_SITE.navigate(href);else location.href=href;});
 if(typeof MutationObserver!=='undefined'){let pending=false;const observer=new MutationObserver(records=>{if(pending||!records.some(r=>r.addedNodes.length||r.type==='characterData'))return;pending=true;queueMicrotask(()=>{pending=false;enhanceRoot();});});observer.observe(document.body,{childList:true,subtree:true,characterData:true});onPageCleanup(()=>observer.disconnect());}
 document.title=t(document.title);
}
