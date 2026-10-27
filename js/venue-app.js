import {venueSettings,venueText,venueMatch,renderVenuePage,renderVenueTeaser} from './venue-source.js';
import {pageListen,onPageCleanup} from './page-lifecycle.js';
export function installVenue({P,L,CMS,lang='az'}){P.venue=()=>renderVenuePage({league:L,cms:CMS},lang);}
export function mountVenue({PAGE,L,CMS,lang='az'}){
 const v=venueSettings(CMS.venue),match=PAGE==='match'&&L.matches.find(m=>m.id===new URLSearchParams(location.search).get('id'));
 const show=v.enabled&&(PAGE==='venue'||PAGE==='contact'||PAGE==='home'&&v.showHome||PAGE==='final'&&v.showFinal||PAGE==='match'&&v.showMatches&&match&&venueMatch(match));
 if(!show)return;
 let root=document.querySelector('[data-venue-widget]');
 if(!root){const footer=document.querySelector('footer');if(footer)footer.insertAdjacentHTML('beforebegin',renderVenueTeaser({league:L,cms:CMS},lang));else document.querySelector('#app').insertAdjacentHTML('beforeend',renderVenueTeaser({league:L,cms:CMS},lang));root=document.querySelector('[data-venue-widget]');}
 if(!root)return;
 if(location.hash==='#stadion')root.scrollIntoView?.({block:'start',behavior:'instant'});
 const status=root.querySelector('.venue-copy-status');pageListen(root.querySelector('[data-copy-venue]'),'click',async()=>{try{await navigator.clipboard.writeText(venueText(v.address,lang));status.textContent=venueText('Ünvan kopyalandı.',lang);}catch{status.textContent=venueText('Ünvanı seçərək kopyalaya bilərsən.',lang);}});
 let disposed=false,started=false,cleanup=()=>{};const load=async()=>{
  if(started||disposed)return;started=true;
  try{const path=(document.body.dataset.previewPath?'/preview-assets/js/':'/js/')+'venue-map-runtime.js?v=20261027map3d1';const module=await import(new URL(path,location.href).href);if(disposed)return;cleanup=module.mountVenueMap(root);}
  catch(error){console.warn('Stadium map module unavailable',error);if(disposed)return;root.querySelector('[data-venue-map-status]').textContent=venueText('Xəritəni açmaq alınmadı. Marşrut düymələrindən istifadə edə bilərsən.',lang);}
 };
 // Camera controls load near the map; the vector illustration is browser-lazy-loaded.
 const observer=new IntersectionObserver(entries=>{if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();load();}},{rootMargin:'160px',threshold:.01});observer.observe(root);
 onPageCleanup(()=>{disposed=true;observer.disconnect();cleanup();});
}
