import {venueText} from './venue-source.js';
// Five vector camera views share the same verified stadium point and recorded street geometry.
export function mountVenueMap(root){
 const lang=root.dataset.venueLang||'az',t=s=>venueText(s,lang),host=root.querySelector('[data-venue-map]'),controls=root.querySelector('[data-venue-map-controls]'),image=root.querySelector('[data-venue-atlas-image]'),listeners=[];
 const listen=(el,event,fn)=>{el.addEventListener(event,fn);listeners.push(()=>el.removeEventListener(event,fn));};
 if(!image){if(root.dataset.venueFallback){const frame=root.ownerDocument.createElement('iframe');frame.src=root.dataset.venueFallback;frame.title=t('Stadionun xəritəsi');frame.loading='lazy';frame.referrerPolicy='no-referrer';host.replaceChildren(frame);}return ()=>{};}
 let angle=0,mode='3d';const draw=()=>{
  const name=mode==='2d'?'azfar-2d.svg':'azfar-3d'+(angle?'-'+angle:'')+'.svg';
  image.src='/assets/maps/'+name+'?v=20261027map3d1';image.alt=t('Stadionun xəritəsi')+' · '+mode.toUpperCase();
  for(const button of root.querySelectorAll('[data-venue-view]'))button.setAttribute('aria-pressed',String(button.dataset.venueView===mode));
 };
 controls.hidden=false;root.classList.add('venue-map-ready');root.querySelector('[data-venue-map-status]').textContent=t('Stadion nöqtəsinə toxun, marşrutu aç.');
 for(const button of root.querySelectorAll('[data-venue-view]'))listen(button,'click',()=>{mode=button.dataset.venueView;draw();});
 listen(root.querySelector('[data-venue-rotate]'),'click',()=>{mode='3d';angle=(angle+90)%360;draw();});
 listen(root.querySelector('[data-venue-reset]'),'click',()=>{mode='3d';angle=0;draw();});
 return ()=>listeners.forEach(dispose=>dispose());
}
