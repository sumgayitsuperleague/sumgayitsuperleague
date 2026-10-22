import {pageListen,pageInterval,pageTimeout,pageFrame,onPageCleanup,pageScope} from './page-lifecycle.js';
import {animate,inView,hover,press,spring,scroll} from './motion-runtime.js';
export const motionRuntime={animate,inView,hover,press,spring,scroll};
export const EASE_OUT=[.23,1,.32,1];
const levels={subtle:{distance:14,duration:.4,lift:2,bounce:0},balanced:{distance:28,duration:.62,lift:3,bounce:0},expressive:{distance:42,duration:.78,lift:5,bounce:0}};
export const motionProfile=options=>levels[options?.level]||levels.balanced;
export function motionAllowed(options={},win=typeof window==='undefined'?{}:window){return options.enabled!==false&&options.transition!=='none'&&!win.matchMedia?.('(prefers-reduced-motion: reduce)').matches;}
export function animateRail(rail,from,to,options={},reduced=false,engine=motionRuntime){
 rail.style.transform=to;
 if(reduced||!motionAllowed(options)||typeof rail.animate!=='function'&&engine===motionRuntime)return null;
 try{return engine.animate(rail,{transform:[from,to]},{duration:.48,ease:EASE_OUT});}catch{return null;}
}

// The hero is the focal sequence. Information elsewhere stays readable and still.
export function animateHero(slide,options={},initial=false,instant=false,engine=motionRuntime){
 if(!slide||instant||!motionAllowed(options)||initial&&options.intro===false||typeof slide.animate!=='function'&&engine===motionRuntime)return null;
 const feature=slide.querySelector('.stadium-slide-feature,.league-main-news,.selected-match');if(!feature)return null;
 if(options.transition==='fade'){try{return engine.animate(feature,{opacity:[.15,1]},{duration:.28,ease:EASE_OUT});}catch{return null;}}
 const items=[...feature.querySelectorAll('.stadium-slide-stage,.stadium-match-caption,.stadium-slide-teams,.stadium-fixture-detail,h2,p,.stadium-slide-link,.league-main-copy>b')].filter(el=>!el.matches('.stadium-match-caption')||!el.querySelector('h2'));
 const duration=initial?motionProfile(options).duration:.42;
 const sequence=items.map((el,i)=>[el,{opacity:[.15,1],transform:[`translate3d(0,${Math.max(14,28-i*3)}px,0)`,'translate3d(0,0,0)']},{at:i*.055,duration,ease:EASE_OUT}]);
 if(options.slideDepth!==false)sequence.unshift([feature,{transform:['perspective(1400px) rotateY(7deg) scale(.97)','perspective(1400px) rotateY(0deg) scale(1)']},{at:0,duration,ease:EASE_OUT}]);
 try{return sequence.length?engine.animate(sequence):null;}catch{return null;}
}

export function installSiteMotion(options={},env={}){
 const doc=env.doc||document,win=env.win||window,engine=env.engine||motionRuntime,body=doc.body;
 body.classList.add('ux-site');
 const allowed=motionAllowed(options,win)&&!body.dataset.previewPath&&(engine!==motionRuntime||typeof doc.documentElement.animate==='function');
 body.dataset.motionEngine=allowed?'motion-14.2.0':'off';if(!allowed)return ()=>{};
 const profile=motionProfile(options),cleanups=[],seen=new WeakSet(),bound=new WeakSet(),active=new Map(),bases=new WeakMap(),keys=new Set();
 let observer=null,queued=false,disposed=false;
 const base=el=>{if(!bases.has(el))bases.set(el,{transform:el.style.transform||'',opacity:el.style.opacity||'',clipPath:el.style.clipPath||''});return bases.get(el);};
 const restore=(el,values)=>{for(const [key,value] of Object.entries(values)){if(value)el.style[key]=value;else el.style.removeProperty(key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase()));}};
 const play=(el,frames,settings={},reset=false)=>{
  const original=base(el);active.get(el)?.stop?.();
  try{const control=engine.animate(el,frames,settings);active.set(el,control);control?.then?.(()=>{if(active.get(el)===control){active.delete(el);if(reset)restore(el,original);}});return control;}
  catch{restore(el,original);body.dataset.motionError='animation';return null;}
 };
 const entrance=doc.querySelector('.league-entry--panorama .league-front-heading');
 if(entrance&&options.intro!==false){entrance.dataset.authoredEntrance='';const parts=[...entrance.querySelectorAll('.panorama-season,h1,.league-entry-title>p,.panorama-primary')];for(const [i,el] of parts.entries())play(el,{opacity:[.3,1],clipPath:['inset(0 0 100% 0)','inset(0 0 0% 0)'],transform:['translate3d(0,24px,0)','translate3d(0,0,0)']},{duration:profile.duration,delay:i*.08,ease:EASE_OUT});}
 const revealSelector='.league-front-heading:not([data-authored-entrance]),.league-side-heading,.video-card,.news-card,.partner-card,.about-hero-copy';
 const liftSelector='.entry-match,.league-side-story,.video-card,.news-card,.partner-card,.learn-promo,.league-entry-links>a';
 const scan=()=>{
  if(disposed)return;queued=false;
  if(options.reveal!==false){
   const items=[...doc.querySelectorAll(revealSelector)].filter(el=>{
    if(seen.has(el))return false;seen.add(el);base(el);
    const link=el.querySelector('a[href]'),key=el.matches('.video-card,.news-card')?el.className+'|'+(link?.getAttribute('href')||''):'';
    if(key&&keys.has(key))return false;if(key)keys.add(key);return true;
   });
   if(items.length)cleanups.push(engine.inView(items,el=>{
    if(disposed)return;
    play(el,{opacity:[.25,1],transform:[`translate3d(0,${Math.min(profile.distance,20)}px,0)`,'translate3d(0,0,0)']},{duration:.4,delay:items.indexOf(el)%3*.05,ease:EASE_OUT},true);
   },{amount:.12,margin:'0px 0px -12px 0px'}));
  }
  if(options.interactions!==false){for(const el of doc.querySelectorAll(liftSelector)){
   if(bound.has(el))continue;bound.add(el);const original=base(el);el.dataset.motionLift='';
   cleanups.push(engine.hover(el,()=>{play(el,{transform:`translate3d(0,-${profile.lift}px,0)`},{duration:.18,ease:EASE_OUT});return ()=>play(el,{transform:original.transform||'translate3d(0,0,0)'},{duration:.18,ease:EASE_OUT},true);}));
  }}
 };
 scan();
 if(options.interactions!==false){
  const buttons=[...doc.querySelectorAll('button:not(:disabled),a.button,a.btn,.ssl-tv-link')];
  cleanups.push(engine.press(buttons,(el,event)=>{if(event?.type?.startsWith('key'))return;const original=base(el);play(el,{transform:'scale(.97)'},{duration:.1});return ()=>play(el,{transform:original.transform||'scale(1)'},{duration:.16,ease:EASE_OUT},true);}));
 }
 if(options.progress!==false){
  const progress=doc.createElement('div');progress.className='ux-reading-progress';progress.setAttribute('aria-hidden','true');progress.innerHTML='<i></i>';body.append(progress);const bar=progress.firstElementChild;
  let pending=false;const draw=()=>{pending=false;const height=doc.documentElement.scrollHeight-win.innerHeight;bar.style.transform=`scaleX(${height>0?Math.min(1,Math.max(0,(win.scrollY||0)/height)):0})`;};
  const onScroll=()=>{if(!pending){pending=true;(win.requestAnimationFrame||((fn)=>fn()))(draw);}};
  pageListen(win,'scroll',onScroll,{passive:true});pageListen(win,'resize',onScroll,{passive:true});draw();
  cleanups.push(()=>{win.removeEventListener('scroll',onScroll);win.removeEventListener('resize',onScroll);progress.remove();});
 }
 if(win.MutationObserver){observer=new win.MutationObserver(records=>{
  if(queued||disposed||!records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches?.(revealSelector+','+liftSelector)||n.querySelector?.(revealSelector+','+liftSelector)))))return;
  queued=true;(win.requestAnimationFrame||((fn)=>fn()))(scan);
 });const app=doc.querySelector('#app');if(app)observer.observe(app,{childList:true,subtree:true});}
 const cleanup=()=>{if(disposed)return;disposed=true;observer?.disconnect();for(const stop of cleanups)stop?.();for(const [el,control] of active){control?.stop?.();restore(el,base(el));}active.clear();body.dataset.motionEngine='off';};
 const preference=win.matchMedia?.('(prefers-reduced-motion: reduce)'),changed=e=>{if(e.matches)cleanup();};
 preference?.addEventListener?.('change',changed);cleanups.push(()=>preference?.removeEventListener?.('change',changed));
 pageListen(win,'pagehide',e=>{if(e.persisted){for(const c of active.values())c.pause?.();}else cleanup();});
 pageListen(win,'pageshow',e=>{if(e.persisted)for(const c of active.values())c.play?.();});
 return cleanup;
}
