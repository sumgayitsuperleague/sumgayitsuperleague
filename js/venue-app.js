import {venueSettings,venueLinks,venueText,venueMatch,renderVenuePage,renderVenueTeaser} from './venue-source.js';
import {pageListen} from './page-lifecycle.js';
export function installVenue({P,L,CMS,lang='az'}){
 const data={league:L,cms:CMS},v=venueSettings(CMS.venue);P.venue=()=>renderVenuePage(data,lang);P.venue.init=()=>{
  const copy=document.querySelector('[data-copy-venue]');if(copy)pageListen(copy,'click',async()=>{const status=document.querySelector('.venue-copy-status');try{await navigator.clipboard.writeText(venueText(v.address,lang));status.textContent=venueText('Ünvan kopyalandı.',lang);}catch{status.textContent=venueText('Ünvanı seçərək kopyalaya bilərsən.',lang);}});
  const load=document.querySelector('[data-venue-map-load]');if(load)pageListen(load,'click',()=>{const src=venueLinks(v).embed;if(!src)return;const frame=document.createElement('iframe');frame.src=src;frame.title=venueText('Xəritə · Yandex Maps',lang);frame.loading='lazy';frame.setAttribute('referrerpolicy','no-referrer');frame.setAttribute('allowfullscreen','');document.querySelector('[data-venue-map-host]').replaceChildren(frame);});
 };
 for(const page of ['home','final','contact','match']){const original=P[page];if(!original)continue;const wrapped=()=>{const html=original(),match=L.matches.find(m=>m.id===new URLSearchParams(location.search).get('id')),show=v.enabled&&(page==='home'?v.showHome:page==='final'?v.showFinal:page==='match'?v.showMatches&&match&&venueMatch(match):true);return html+(show?renderVenueTeaser(data,lang):'');};wrapped.init=original.init;P[page]=wrapped;}
}
