// A sharp, responsive cover generated from genuine league records. No upscaled thumbnails.
import {ordinal} from './league-source.js';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function youtubeCoverURL(v){return /^[A-Za-z0-9_-]{11}$/.test(v?.youtubeId||'')?'https://i.ytimg.com/vi/'+v.youtubeId+'/maxresdefault.jpg':'';}
export function videoCover(v,{league,site,logo='/assets/logo.png',imageURL=x=>x,translate=x=>x}={}){
 const home=league.teams.find(t=>t.id===v?.home),away=league.teams.find(t=>t.id===v?.away),m=league.matches.find(m=>m.id===v?.match);
 const team=t=>`<span class="cover-crest"><img src="${esc(imageURL('/assets/logos/'+t.logo))}" alt="${esc(t.name)}" loading="lazy"></span>`;
 const label=translate({match:'Tam oyun',highlights:'Oyun icmalı',shorts:'Qısa video',program:'Liqadan'}[v?.kind||'match']);
 const artwork=`<div class="media-cover-fallback crisp-cover" aria-hidden="true"><div class="cover-topline"><span>SSL TV</span><span>${esc(league.season)} · ${esc(label)}</span></div><svg class="cover-pitch" viewBox="0 0 600 340" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1"><path d="M30 25H570V315H30Z M300 25V315 M30 100H110V240H30 M570 100H490V240H570"/><circle cx="300" cy="170" r="53"/></g></svg>${home&&away?`<div class="fallback-teams">${team(home)}<b>${m?.status==='done'?m.hs+'<i>:</i>'+m.as:'VS'}</b>${team(away)}</div><div class="fallback-team-names"><span>${esc(home.name)}</span><span>${esc(away.name)}</span></div>`:`<img class="fallback-league-logo" src="${esc(imageURL(logo))}" alt=""><strong>${esc(v?.title||site.name)}</strong>`}<div class="cover-bottomline"><span>${m?translate(ordinal(m.round)+' tur'):translate('Rəsmi kanal')}</span><span>${esc(m?.venue||'Sumqayıt')} <i>↗</i></span></div></div>`;
 const mode=v?.coverMode||'poster',src=mode==='image'&&v.image?imageURL(v.image):mode==='youtube'?youtubeCoverURL(v):'';
 return artwork+(src?`<img class="remote-cover" src="${esc(src)}" alt="${esc(v.title||v.label||site.name)}" loading="lazy" decoding="async"${mode==='youtube'?' data-cover-quality="640" referrerpolicy="no-referrer"':''}>`:'');
}
