import * as UI from './i18n.js';
import {ordinal} from './league-source.js';
export function editorialArtwork(news,ctx){
 const {L,S,T,DONE,SC,B,esc,ball}=ctx,round=news.id==='tur3'?3:Number(news.id?.match(/^ssl-round(\d+)/)?.[1]),matches=round?DONE.filter(m=>m.round===round):[];
 if(matches.length)return `<div class="official-story-art official-story-results" aria-hidden="true"><div><strong>${esc(UI.t(ordinal(round)+' tur'))}</strong><span>${esc(L.season)}</span></div><section>${matches.map(m=>`<div>${ball(m.home,'sm')}<span>${esc(T[m.home].code)}</span><b>${m.hs}<i>:</i>${m.as}</b><span>${esc(T[m.away].code)}</span>${ball(m.away,'sm')}</div>`).join('')}</section></div>`;
 if(/scorers|bombardir/i.test(news.id||''))return `<div class="official-story-art official-story-scorers" aria-hidden="true"><strong>${esc(UI.t('Bombardirlər'))}</strong><section>${SC.slice(0,3).map(p=>`<div>${ball(p.t,'sm')}<span>${esc(p.p)}<small>${esc(T[p.t].name)}</small></span><b>${p.g}<small>${esc(UI.t('qol'))}</small></b></div>`).join('')}</section></div>`;
 return `<div class="official-story-art official-story-season" aria-hidden="true"><img class="official-story-mark" src="${esc(B.logo||'/assets/logo.png')}" alt="" loading="lazy"><strong>${esc(L.season)}</strong><section class="editorial-club-marks">${L.teams.map(t=>ball(t.id,'sm')).join('')}</section></div>`;
}
