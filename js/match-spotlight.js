import {calendarEvent} from './calendar-source.js';
export {calendarEvent} from './calendar-source.js';
import * as UI from './i18n.js';
import {matchStage,ordinal} from './league-source.js';
import {stageTitle} from './home-source.js';
export function matchSpotlight(ctx,options={},large=false){
 const m=ctx.M.find(m=>m.id===options.match);if(!m)return `<div class="empty">Seçilmiş oyun hələ əlavə edilməyib.</div>`;
 const {esc,ball,T,fd}=ctx,done=m.status==='done',video=ctx.videoForMatch(m.id),stage=matchStage(m),label=stage==='group'?ordinal(m.round)+' tur':stageTitle(stage);
 return `<article class="selected-match ${large?'selected-match-large':''}" data-featured-match="${esc(m.id)}"><div class="selected-match-heading"><div><span class="eyebrow">REDAKSİYA SEÇİMİ</span><h2>${esc(options.title||'Turun oyunu')}</h2></div><span class="match-stage-label">${esc(label)}</span></div><a class="selected-match-score" href="matc.html?id=${encodeURIComponent(m.id)}"><span>${ball(m.home,large?'xl':'lg')}<b>${esc(T[m.home].name)}</b></span><strong>${done?`${m.hs}<i>:</i>${m.as}`:'VS'}<small>${done?'Tamamlandı':'Planlaşdırılıb'}</small></strong><span>${ball(m.away,large?'xl':'lg')}<b>${esc(T[m.away].name)}</b></span></a><div class="selected-match-meta"><time datetime="${m.date}T${m.time}:00+04:00">${fd(m.date)} · ${esc(m.time)}</time><span>${esc(m.venue||'')}</span></div>${options.text?`<p class="selected-match-text">${esc(options.text)}</p>`:''}<div class="selected-match-actions"><a href="matc.html?id=${encodeURIComponent(m.id)}">Oyuna bax ↗</a>${options.showVideo!==false&&video?`<a href="${esc(video.url)}" target="_blank" rel="noopener noreferrer">▶ Videonu izlə ↗</a>`:''}${!done?`<button type="button" data-calendar-match="${esc(m.id)}">Təqvimə əlavə et +</button>`:''}</div></article>`;
}

export function installMatchActions(ctx){
 document.addEventListener('click',async event=>{
  const calendar=event.target.closest('[data-calendar-match]');if(calendar){const m=ctx.M.find(m=>m.id===calendar.dataset.calendarMatch),content=calendarEvent(m,ctx.T,ctx.S.name);if(!content)return;const href=URL.createObjectURL(new Blob([content],{type:'text/calendar;charset=utf-8'})),a=document.createElement('a');a.href=href;a.download='ssl-'+m.id+'.ics';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(href),1000);}
  const share=event.target.closest('[data-share-match]');if(share){const link=new URL('/matc?id='+encodeURIComponent(share.dataset.shareMatch),'https://sumgayitsuperleague.com');if(UI.LANG!=='az')link.searchParams.set('lang',UI.LANG);try{await navigator.clipboard.writeText(link.href);ctx.$('#match-action-status').textContent=UI.t('Oyun linki kopyalandı.');}catch{ctx.$('#match-action-status').textContent=UI.t('Linki ünvan sətrindən kopyalaya bilərsən.');}}
 });
}
