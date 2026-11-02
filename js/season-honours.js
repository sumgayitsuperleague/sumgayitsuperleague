import {HOME_FINALS_COPY} from './home-finals-model.js';

function winner(match){
 if(match?.status!=='done')return null;
 if(match.hs!==match.as)return match.hs>match.as?match.home:match.away;
 if(match.penalties&&match.penalties.home!==match.penalties.away)return match.penalties.home>match.penalties.away?match.home:match.away;
 return null;
}
export function seasonPlacements(f){
 if(!f.champion||winner(f.match)!==f.champion.id)return [];
 const runner=f.match.home===f.champion.id?f.match.away:f.match.home;
 return [f.champion,f.teams.get(runner),f.config.showThirdPlace!==false?f.teams.get(winner(f.thirdPlace)):null].map((team,i)=>team?{team,place:i+1}:null).filter(Boolean);
}
export function renderSeasonHonours(f,{season='2026',lang='az',esc,href=path=>path}={}){
 const places=seasonPlacements(f);if(!places.length)return '';
 const c=HOME_FINALS_COPY[lang]||HOME_FINALS_COPY.az,e=esc,m=f.match;
 const logo=(team,extra='')=>`<span class="sh-crest${team.id==='fvs'?' sh-crest--dark':''} ${extra}"><img src="/assets/logos/${e(team.logo)}" alt="${e(team.name)}" width="160" height="160" decoding="async"></span>`;
 return `<section class="season-honours" data-season-honours aria-label="${e(c.honours)}"><div class="sh-hero"><div class="sh-copy"><span class="sh-eyebrow"><span aria-hidden="true">★</span> ${e(season)} · ${e(c.champion)}</span><h2>${e(f.champion.name)}</h2><p class="sh-declaration">${e(c.championship)}</p><div class="sh-decider"><span>${e(c.final)}</span><strong>${m.hs}<i>:</i>${m.as}</strong>${m.penalties?`<span class="sh-shootout">${e(c.penalties)} <b>${m.penalties.home}:${m.penalties.away}</b></span>`:''}</div><p class="sh-opponent">${e(f.teams.get(m.home).name)} — ${e(f.teams.get(m.away).name)}</p><a class="sh-link" href="${e(href('/matc.html?id='+encodeURIComponent(m.id)))}">${e(c.match)} <span aria-hidden="true">↗</span></a></div><div class="sh-art"><span class="sh-ring" aria-hidden="true"></span><span class="sh-year" aria-hidden="true">${e(season)}</span><a class="sh-winning-club" href="${e(href('/komanda.html?t='+encodeURIComponent(f.champion.id)))}" aria-label="${e(f.champion.name)}">${logo(f.champion,'sh-crest--hero')}</a>${f.config.trophy?`<img class="sh-cup" src="${e(f.config.trophy)}" alt="${e(c.cup)}" width="1024" height="1536" fetchpriority="high" decoding="async">`:''}<span class="sh-plinth" aria-hidden="true"></span></div></div><div class="sh-places" aria-label="${e(c.honours)}">${places.map(({team,place})=>`<a class="sh-place" data-season-place="${place}" href="${e(href('/komanda.html?t='+encodeURIComponent(team.id)))}"><span class="sh-rank" aria-hidden="true">0${place}</span>${logo(team)}<span class="sh-place-name"><small>${e([c.champion,c.runnerUp,c.bronze][place-1])}</small><strong>${e(team.name)}</strong></span></a>`).join('')}</div></section>`;
}
