import * as UI from './i18n.js';
import {fanZoneSettings,finalContext} from './fan-zone-model.js';
import {pageInterval,pageListen} from './page-lifecycle.js';
import {HOME_FINALS_COPY,finalsCountdown,finalsDate,finalsKickoff} from './home-finals-model.js';
import {uiIcon} from './ui-icons.js';

const copy=()=>HOME_FINALS_COPY[UI.LANG]||HOME_FINALS_COPY.az;
const serverNow=()=>Date.now()+(Number(window.__sslServerOffset)||0);
const trophy=()=>`<svg class="hf-trophy" viewBox="0 0 220 252" fill="none" aria-hidden="true"><defs><linearGradient id="hf-cup-metal" x1="62" y1="70" x2="165" y2="76" gradientUnits="userSpaceOnUse"><stop stop-color="#7ba9ef"/><stop offset=".24" stop-color="#f7fbff"/><stop offset=".43" stop-color="#c1d8fc"/><stop offset=".65" stop-color="#fff"/><stop offset="1" stop-color="#86b4f5"/></linearGradient><linearGradient id="hf-cup-base" x1="67" y1="213" x2="156" y2="220" gradientUnits="userSpaceOnUse"><stop stop-color="#608dd7"/><stop offset=".45" stop-color="#edf5ff"/><stop offset="1" stop-color="#75a4e9"/></linearGradient></defs><ellipse cx="110" cy="237" rx="81" ry="10" fill="#071b63" opacity=".35"/><ellipse cx="110" cy="237" rx="48" ry="3" fill="#a6c9ff" opacity=".35"/><path d="M65 56H35v20c0 29 16 44 43 46M155 56h30v20c0 29-16 44-43 46" stroke="url(#hf-cup-metal)" stroke-width="13" stroke-linejoin="round"/><path d="M37 59h23M160 59h23" stroke="#fff" stroke-opacity=".8" stroke-width="2"/><path d="M61 38h98l-9 67c-4 28-18 45-40 45s-36-17-40-45L61 38Z" fill="url(#hf-cup-metal)"/><path d="m74 46 7 58c3 20 10 32 19 38" stroke="#fff" stroke-opacity=".85" stroke-width="3"/><path d="M149 48c0 48-10 72-20 85" stroke="#4779c3" stroke-opacity=".35" stroke-width="3"/><ellipse cx="110" cy="38" rx="49" ry="7" fill="#d4e7ff"/><ellipse cx="110" cy="37" rx="42" ry="3" fill="#88b4f2"/><path d="M100 148h20l-3 40c3 8 11 12 20 14v8H83v-8c9-2 17-6 20-14l-3-40Z" fill="url(#hf-cup-metal)"/><path d="M86 209h48l10 15H76l10-15Z" fill="url(#hf-cup-base)"/><path d="M69 223h82v11H69z" fill="url(#hf-cup-base)"/><path d="M70 224h80" stroke="#f3f8ff" stroke-width="2"/><circle cx="110" cy="91" r="17" stroke="#5b89c7" stroke-opacity=".55"/><path d="m110 76 4 8 9 1-6 7 2 9-9-4-9 4 2-9-6-7 9-1 4-8Z" fill="#356bb9" opacity=".55"/></svg>`;

function clockHTML(match,kind,showCountdown,esc,now){
 const c=copy(),clock=finalsCountdown(match,now),label=kind==='final'?c.finalCountdown:c.thirdCountdown;
 if(clock.state==='countdown')return showCountdown?`<span class="hf-clock-label">${esc(label)}</span><div class="hf-digits" role="timer" aria-live="off" aria-label="${esc(label)}">${clock.values.map((n,i)=>`<span><strong data-finals-unit="${i}">${String(n).padStart(2,'0')}</strong><small>${esc([c.days,c.hours,c.minutes,c.seconds][i])}</small></span>`).join('')}</div>`:`<p class="hf-state-note">${esc(c.scheduled)}</p>`;
 if(['live','done'].includes(clock.state))return `<div class="hf-result"><span>${clock.state==='live'?'<i class="hf-live-dot" aria-hidden="true"></i>':''}${esc(clock.state==='live'?c.liveScore:c.result)}</span><strong>${Number.isInteger(match.hs)?match.hs:'—'}<i>:</i>${Number.isInteger(match.as)?match.as:'—'}</strong>${match.penalties?`<small>${esc(c.penalties)}: ${match.penalties.home} : ${match.penalties.away}</small>`:''}</div>`;
 return `<p class="hf-state-note"><strong>${esc(clock.state==='waiting'?c.soon:c.unscheduled)}</strong>${clock.state==='waiting'?`<span>${esc(c.waiting)}</span>`:''}</p>`;
}
function matchCard(ctx,match,kind,config,now){
 const e=ctx.esc,c=copy(),main=kind==='final',state=finalsCountdown(match,now).state;
 const club=id=>`<a class="hf-club" href="komanda.html?t=${encodeURIComponent(id)}"><span class="hf-crest">${ctx.ball(id,'lg').replace('loading="lazy"','loading="eager"')}</span><b>${e(ctx.T[id].name)}</b></a>`;
 const status=['live','done'].includes(state)?c[state]:c.scheduled;
 return `<article class="hf-card hf-card--${kind}" data-finals-match="${e(match.id)}" data-finals-kind="${kind}" data-finals-state="${state}" data-finals-countdown="${config.showCountdown!==false}">${main&&config.cover?`<img class="hf-cover" src="${e(config.cover)}" alt="" decoding="async">`:''}<div class="hf-card-top"><h2>${main?uiIcon('trophy'):'<span class="hf-third-mark" aria-hidden="true">III</span>'}${e(main?c.final:c.third)}</h2><span class="hf-status" data-finals-status>${e(status)}</span></div><div class="hf-card-time"><time${Number.isFinite(finalsKickoff(match))?` datetime="${e(match.date)}T${e(match.time)}:00+04:00"`:''}><strong>${e(match.time||'—')}</strong><span>${e(finalsDate(match,UI.LANG))}</span></time><span>${e(match.venue||ctx.L.venue||'')}</span></div><div class="hf-teams">${club(match.home)}<div class="hf-versus" aria-hidden="true">${main?trophy():'<span class="hf-bronze-orbit">3</span>'}<span>VS</span></div>${club(match.away)}</div><div class="hf-card-bottom"><div class="hf-clock" data-finals-clock>${clockHTML(match,kind,config.showCountdown!==false,e,now)}</div><div class="hf-actions">${main?`<a class="hf-primary" href="final.html">${e(c.hub)}${uiIcon('arrow')}</a><a class="hf-secondary" href="matc.html?id=${encodeURIComponent(match.id)}">${e(c.match)}${uiIcon('arrow')}</a>`:`<a class="hf-primary" href="matc.html?id=${encodeURIComponent(match.id)}">${e(c.match)}${uiIcon('arrow')}</a>`}</div></div></article>`;
}

export function renderHomeFinals(ctx){
 const settings=fanZoneSettings(ctx.CMS.fanZone),config=settings.final;
 if(ctx.H.showFinalStage===false||!config.enabled||!config.showOnHome)return '';
 const f=finalContext({league:ctx.L},settings);if(!f.match)return '';
 const selected=ctx.H.matchCenter,finalPhase=['final','completed'].includes(ctx.L.competition?.phase)||selected?.mode==='stage'&&selected.stage==='final'||['live','done'].includes(f.match.status);
 if(!finalPhase)return '';
 const c=copy(),e=ctx.esc,now=Date.now()+(typeof window!=='undefined'?Number(window.__sslServerOffset)||0:0),third=config.showThirdPlace!==false?f.thirdPlace:null;
 const title=f.state==='archived'?config.archiveTitle:config.title&&config.title!=='Final mərkəzi'?config.title:c.heading;
 return `<section class="home-finals" aria-labelledby="home-finals-title" data-home-finals><div class="wrap"><header class="hf-heading"><div><span class="hf-eyebrow">${e(ctx.S.name)}<i aria-hidden="true"></i>${e(ctx.L.season)} ${e(c.season)}</span><h1 id="home-finals-title">${e(UI.t(title))}</h1></div><a class="hf-venue-link" href="elaqe.html#stadion">${uiIcon('pin')}<span>${e(f.match.venue||ctx.L.venue||'')}<small>${e(c.timezone)}</small></span>${uiIcon('arrow')}</a></header><div class="hf-grid${third?'':' hf-grid--single'}">${matchCard(ctx,f.match,'final',config,now)}${third?matchCard(ctx,third,'third',config,now):''}</div></div></section>`;
}

export function updateHomeFinals(root,matches,now,esc){
 if(!root)return;
 const c=copy();for(const card of root.querySelectorAll('[data-finals-match]')){
  const match=matches.find(m=>m.id===card.dataset.finalsMatch);if(!match)continue;
  const clock=finalsCountdown(match,now),box=card.querySelector('[data-finals-clock]'),showCountdown=card.dataset.finalsCountdown==='true';
  const signature=clock.state+':'+(match.hs??'')+':'+(match.as??'')+':'+(match.penalties?.home??'')+':'+(match.penalties?.away??'');
  if(box.dataset.signature!==signature){box.innerHTML=clockHTML(match,card.dataset.finalsKind,showCountdown,esc,now);box.dataset.signature=signature;}
  card.dataset.finalsState=clock.state;card.querySelector('[data-finals-status]').textContent=['live','done'].includes(clock.state)?c[clock.state]:c.scheduled;
  if(clock.values&&showCountdown){
   for(const unit of box.querySelectorAll('[data-finals-unit]')){const value=String(clock.values[Number(unit.dataset.finalsUnit)]).padStart(2,'0');if(unit.textContent!==value)unit.textContent=value;}
   box.querySelector('[role="timer"]').setAttribute('aria-label',(card.dataset.finalsKind==='final'?c.finalCountdown:c.thirdCountdown)+': '+clock.values.map((v,i)=>v+' '+[c.days,c.hours,c.minutes,c.seconds][i]).join(', '));
  }
 }
}
export function bindHomeFinals(ctx){
 const root=ctx.$('[data-home-finals]');if(!root)return;
 const draw=()=>{if(!document.hidden)updateHomeFinals(root,ctx.M||ctx.L.matches,serverNow(),ctx.esc);};
 draw();pageInterval(draw,1000);pageListen(document,'visibilitychange',draw);pageListen(window,'pageshow',draw);pageListen(window,'ssl-match-live-change',draw);
}
