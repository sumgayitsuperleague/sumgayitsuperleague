import {animate,inView,hover,press,spring} from './motion-runtime.js';
const runtime={animate,inView,hover,press,spring};
const levels={subtle:{distance:10,duration:.42,lift:2,bounce:.03},balanced:{distance:20,duration:.62,lift:4,bounce:.12},expressive:{distance:30,duration:.78,lift:6,bounce:.2}};
export function motionProfile(options={}){return levels[options.level]||levels.balanced;}
export function motionAllowed(options={},win=typeof window==='undefined'?{}:window){return options.enabled!==false&&options.transition!=='none'&&!win.matchMedia?.('(prefers-reduced-motion: reduce)').matches;}
export function animateRail(rail,from,to,options={},reduced=false,engine=runtime){
 rail.style.transform=to;
 if(reduced||!motionAllowed(options)||typeof rail.animate!=='function'&&engine===runtime)return null;
 try{return engine.animate(rail,{transform:[from,to]},{duration:motionProfile(options).duration+.08,ease:[.22,.72,.2,1]});}catch{return null;}
}
export function installSiteMotion(options={},env={}){
 const doc=env.doc||document,win=env.win||window,engine=env.engine||runtime,body=doc.body;
 body.classList.add('ux-site');
 const allowed=motionAllowed(options,win)&&!body.dataset.previewPath&&(engine!==runtime||typeof doc.documentElement.animate==='function');
 body.dataset.motionEngine=allowed?'motion-14.2.0':'off';
 if(!allowed)return ()=>{};
 const profile=motionProfile(options),cleanups=[],seen=new WeakSet(),bound=new WeakSet(),active=new Map(),bases=new WeakMap(),keys=new Set();let observer=null,queued=false,disposed=false;
 const base=el=>{if(!bases.has(el))bases.set(el,{transform:el.style.transform||'',opacity:el.style.opacity||''});return bases.get(el);};
 const restore=(el,original)=>{for(const [key,value] of Object.entries(original)){if(value)el.style[key]=value;else el.style.removeProperty(key);}};
 const play=(el,frames,settings={},reset=false)=>{
  const original=base(el);active.get(el)?.stop?.();
  try{const control=engine.animate(el,frames,settings);active.set(el,control);control?.then?.(()=>{if(active.get(el)===control){active.delete(el);if(reset)restore(el,original);}});return control;}
  catch{restore(el,original);return null;}
 };
 const revealSelector='.league-front-heading,.stadium-viewport,.league-side-heading,.entry-match-wrap,.league-side-story,.video-card,.news-card,.partner-card,.about-story-grid>*,.about-journey>*,.about-contact-banner,.community-heading,.sec-head,.fan-centre-top,.about-hero-copy';
 const liftSelector='.entry-match,.league-side-story,.video-card,.news-card,.partner-card,.learn-promo,.league-entry-links>a';
 const scan=()=>{
  if(disposed)return;queued=false;
  if(options.reveal!==false){
   const items=[...doc.querySelectorAll(revealSelector)].filter(el=>{
    if(seen.has(el))return false;seen.add(el);base(el);
    const link=el.querySelector('a[href]'),key=(el.matches('.entry-match-wrap,.video-card,.news-card')?el.className+'|'+(link?.getAttribute('href')||''):'');
    if(key&&keys.has(key))return false;if(key)keys.add(key);return true;
   });
   if(items.length)cleanups.push(engine.inView(items,el=>{
    if(disposed)return;const index=items.indexOf(el)%4;
    play(el,{opacity:[0,1],transform:[`translate3d(0,${profile.distance}px,0)`,'translate3d(0,0,0)']},{duration:profile.duration,delay:index*.045,type:engine.spring,bounce:profile.bounce},true);
   },{amount:.12,margin:'0px 0px -20px 0px'}));
  }
  if(options.interactions!==false){
   for(const el of doc.querySelectorAll(liftSelector)){
    if(bound.has(el))continue;bound.add(el);const original=base(el);el.dataset.motionLift='';
    cleanups.push(engine.hover(el,()=>{
     play(el,{transform:`translate3d(0,-${profile.lift}px,0)`},{type:engine.spring,duration:.34,bounce:.08});
     return ()=>play(el,{transform:original.transform||'translate3d(0,0,0)'},{type:engine.spring,duration:.36,bounce:.08},true);
    }));
   }
  }
 };
 scan();
 if(options.interactions!==false){
  const buttons=[...doc.querySelectorAll('button:not(:disabled),a.button,a.btn,.ssl-tv-link')];
  cleanups.push(engine.press(buttons,el=>{
   const original=base(el);play(el,{transform:'scale(.95)'},{duration:.1});
   return ()=>play(el,{transform:original.transform||'scale(1)'},{type:engine.spring,duration:.32,bounce:.18},true);
  }));
 }
 if(options.progress!==false){
  const progress=doc.createElement('div');progress.className='ux-reading-progress';progress.setAttribute('aria-hidden','true');progress.innerHTML='<i></i>';body.append(progress);const bar=progress.firstElementChild;
  let pending=false;const draw=()=>{pending=false;const height=doc.documentElement.scrollHeight-win.innerHeight;bar.style.transform=`scaleX(${height>0?Math.min(1,Math.max(0,(win.scrollY||0)/height)):0})`;};
  const scroll=()=>{if(!pending){pending=true;(win.requestAnimationFrame||((fn)=>fn()))(draw);}};
  win.addEventListener('scroll',scroll,{passive:true});win.addEventListener('resize',scroll,{passive:true});draw();
  cleanups.push(()=>{win.removeEventListener('scroll',scroll);win.removeEventListener('resize',scroll);progress.remove();});
 }
 if(win.MutationObserver){observer=new win.MutationObserver(records=>{
  if(queued||disposed||!records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&(n.matches?.(revealSelector+','+liftSelector)||n.querySelector?.(revealSelector+','+liftSelector)))))return;
  queued=true;(win.requestAnimationFrame||((fn)=>fn()))(scan);
 });const app=doc.querySelector('#app');if(app)observer.observe(app,{childList:true,subtree:true});}
 const cleanup=()=>{if(disposed)return;disposed=true;observer?.disconnect();for(const stop of cleanups)stop?.();for(const [el,control] of active){control?.stop?.();restore(el,base(el));}active.clear();body.dataset.motionEngine='off';};
 const preference=win.matchMedia?.('(prefers-reduced-motion: reduce)');const changed=e=>{if(e.matches)cleanup();};preference?.addEventListener?.('change',changed);cleanups.push(()=>preference?.removeEventListener?.('change',changed));
 win.addEventListener('pagehide',cleanup,{once:true});return cleanup;
}
