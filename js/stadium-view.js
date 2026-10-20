import * as UI from './i18n.js';
import {installOfficialGround} from './official-view.js';
import {installProjectedStadium} from './projected-stadium.js';
import {animateRail,animateHero,motionRuntime} from './site-motion.js';
import {stadiumSettings,featuredStadiumVideo} from './stadium-source.js';
import {videoCover} from './video-cover-source.js';
import {installMusicPlayer} from './stadium-player.js';
import {selectHomeMatches} from './home-source.js';
import {matchStageLabel} from './league-source.js';
export {installMusicPlayer} from './stadium-player.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pitchScene=()=>`<div class="stadium-scene" aria-hidden="true"><div class="stadium-webgl" data-stadium-canvas></div><div class="stadium-glow"></div><div class="stadium-pitch"><svg viewBox="0 0 640 400" fill="none"><path d="M24 24h592v352H24zM320 24v352M24 100h95v200H24m592-200h-95v200h95M24 148h34v104H24m592-104h-34v104h34"/><circle cx="320" cy="200" r="62"/><circle cx="320" cy="200" r="3"/></svg><i class="stadium-goal goal-left"></i><i class="stadium-goal goal-right"></i></div><div class="stadium-fallback-ball"><img src="/assets/football-cursor-large.svg" alt=""></div></div>`;
const matchCaption=m=>m.status==='live'?'Canlı hesab və vaxt':m.status==='done'?'Oyunun nəticəsi':'Növbəti oyun';
export function renderStadiumCarousel(ctx,lead){
 const options=stadiumSettings(ctx.CMS.stadium).motion;if(!options.carousel||!lead||ctx.H.leadType==='none')return lead;
 const selected=selectHomeMatches(ctx.L,ctx.H.matchCenter).matches;
 const m=selected.find(x=>x.status==='live')||selected.find(x=>x.status==='planned')||selected[0];
 const broadcast=options.presentation!=='classic',official=options.presentation==='official';
 const crest=id=>ctx.ball(id,'lg').replace('loading="lazy"',options.opening==='match'?'loading="eager" decoding="sync" fetchpriority="high"':'loading="lazy" decoding="async"');
 const slides=[{kind:'news',label:ctx.H.leadType==='news'?'Xəbər':'Liqadan',html:lead}];
 if(m)slides.push({kind:'match',label:'Matç',html:`<a class="stadium-slide-feature stadium-match-slide" data-carousel-match="${esc(m.id)}" href="matc.html?id=${esc(m.id)}">${official?'':pitchScene()}<div class="stadium-match-caption"><${broadcast?'h2':'span'} data-slide-caption>${esc(UI.t(matchCaption(m)))}</${broadcast?'h2':'span'}><span class="stadium-slide-stage">${esc(UI.t(matchStageLabel(m)))}</span></div><div class="stadium-slide-teams"><span>${crest(m.home)}<b>${esc(ctx.T[m.home].name)}</b></span><strong>${m.status==='planned'?'VS':m.hs+' : '+m.as}${m.penalties?`<small class="penalty-score">${esc(UI.t('Penaltilər'))}: ${m.penalties.home} : ${m.penalties.away}</small>`:''}</strong><span>${crest(m.away)}<b>${esc(ctx.T[m.away].name)}</b></span></div>${broadcast?`<div class="stadium-fixture-detail"><time${m.date?` datetime="${esc(m.date)}T${esc(m.time)}:00+04:00"`:''}><span>${ctx.fd(m.date)}</span>${m.time?`<strong>${esc(m.time)}</strong>`:''}</time><span class="stadium-fixture-venue">${esc(m.venue)}</span></div>`:`<p>${ctx.fd(m.date)} · ${esc(m.time)} · ${esc(m.venue)}</p>`}<span class="stadium-slide-link">${esc(UI.t('Matç mərkəzi'))}<svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.8"/></svg></span></a>`});
 else slides.push({kind:'match',label:'Matç',html:`<a class="stadium-slide-feature" href="haqqimizda.html">${pitchScene()}<h2>${esc(ctx.CMS.about.heading)}</h2><p>${esc(ctx.CMS.about.subtitle)}</p><span class="stadium-slide-link">${esc(UI.t('Liqa ilə tanış ol'))} ↗</span></a>`});
 const video=featuredStadiumVideo(ctx.VIDEOS,options.featuredVideo);
 const media=video?`<a class="stadium-slide-feature stadium-media-slide stadium-video-slide" href="${esc(video.url)}" target="_blank" rel="noopener noreferrer"><div class="stadium-video-art">${videoCover({...video,coverMode:'poster'},{league:ctx.L,site:ctx.S,logo:ctx.B.logo||'/assets/logo.png',translate:UI.t})}</div><div class="stadium-video-copy"><h2>${esc(video.title)}</h2><p>${ctx.fmtShort(video.date)}</p><span class="stadium-slide-link">${esc(UI.t('Videonu izlə'))} <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true"><path d="m9 5 10 7-10 7Z" stroke="currentColor" stroke-width="1.6"/></svg></span></div></a>`:`<a class="stadium-slide-feature stadium-media-slide" href="media.html">${pitchScene()}<h2>${esc(UI.t('Oyunu izlə. Liqanı yaşa.'))}</h2><p>${esc(UI.t('Matç arxivi və yayımlar'))}</p><span class="stadium-slide-link">SSL TV ↗</span></a>`;
 slides.push({kind:'media',label:'SSL TV',html:media});
 const first=slides.findIndex(s=>s.kind===options.opening);if(first>0)slides.unshift(slides.splice(first,1)[0]);
 return `<section class="stadium-carousel${options.navigationLabels?' stadium-carousel--labeled':''}" aria-label="${esc(UI.t('Liqa slaydları'))}" aria-roledescription="carousel"><div class="stadium-viewport"><div class="stadium-slides">${slides.map((s,i)=>`<div class="stadium-slide${i===0?' is-current':''}" data-stadium-slide="${i}" data-slide-kind="${s.kind}" role="group" aria-roledescription="slide" aria-label="${i+1} / ${slides.length}" aria-hidden="${i!==0}"${i?' inert':''}>${s.html}</div>`).join('')}</div></div><div class="stadium-carousel-controls"><div class="stadium-dots">${slides.map((s,i)=>`<button type="button" data-stadium-go="${i}" aria-label="${esc(UI.t('Slayd'))} ${i+1} / ${slides.length} · ${esc(UI.t(s.label))}" aria-pressed="${i===0}"><span></span>${options.navigationLabels?`<b>${esc(UI.t(s.label))}</b>`:''}</button>`).join('')}<span class="stadium-slide-count" data-stadium-count>01 / 0${slides.length}</span></div><div><button type="button" data-stadium-action="previous" aria-label="${esc(UI.t('Əvvəlki slayd'))}"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true"><path d="m14 6-6 6 6 6" stroke="currentColor" stroke-width="1.8"/></svg></button><button type="button" data-stadium-action="pause" aria-label="${esc(UI.t('Slaydları dayandır'))}" aria-pressed="false"></button><button type="button" data-stadium-action="next" aria-label="${esc(UI.t('Növbəti slayd'))}"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" aria-hidden="true"><path d="m10 6 6 6-6 6" stroke="currentColor" stroke-width="1.8"/></svg></button></div></div><div class="stadium-slide-progress" aria-hidden="true"><i></i></div></section>`;
}
export function bakuTime(now,{seconds=true}={}){return new Intl.DateTimeFormat('az-AZ',{timeZone:'Asia/Baku',hour:'2-digit',minute:'2-digit',...(seconds?{second:'2-digit'}:{}),hourCycle:'h23'}).format(new Date(now));}
export function supportsStadium3D(doc){try{const gl=doc.createElement('canvas').getContext('webgl2');if(!gl)return false;gl.getExtension('WEBGL_lose_context')?.loseContext();return true;}catch{return false;}}
export function installStadium(ctx){
 const settings=stadiumSettings(ctx.CMS.stadium),reduced=settings.motion.enabled===false||!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,preview=!!document.body.dataset.previewPath;
 document.body.classList.add('ssl-official');document.body.dataset.stadiumPresentation=settings.motion.presentation;document.body.dataset.stadiumScene=settings.motion.scene;
 document.body.dataset.stadiumMotion=reduced?'none':settings.motion.transition;
 if(settings.motion.presentation==='official')installOfficialGround(document.querySelector('.league-entry--official'));
 document.body.classList.toggle('stadium-depth',settings.motion.depth&&!reduced);
 document.body.classList.toggle('football-cursor',settings.cursor.mode==='football');document.body.dataset.footballSize=String(settings.cursor.size);
 if(settings.clock.enabled){const place=document.querySelector('.utility-season');if(place&&!place.querySelector('[data-baku-clock]')){
  place.insertAdjacentHTML('beforeend','<span class="baku-clock"><time data-baku-clock aria-live="off"></time><span aria-hidden="true">UTC+4</span></span>');
  const draw=()=>{const time=place.querySelector('[data-baku-clock]');if(time){const now=Date.now()+(Number(window.__sslServerOffset)||0);time.dateTime=new Date(now).toISOString();time.textContent=bakuTime(now,settings.clock);}};draw();setInterval(draw,1000);
 }}
 if(settings.cursor.touch&&!preview&&!reduced)document.addEventListener('pointerdown',event=>{
  if(!['touch','pen'].includes(event.pointerType)||event.target.closest('input,select,textarea,[data-stadium-player]'))return;
  const ball=document.createElement('span');ball.className='football-tap';ball.setAttribute('aria-hidden','true');ball.style.left=event.clientX+'px';ball.style.top=event.clientY+'px';ball.style.width=ball.style.height=settings.cursor.size+'px';document.body.append(ball);const all=document.querySelectorAll('.football-tap');if(all.length>5)all[0].remove();ball.addEventListener('animationend',()=>ball.remove(),{once:true});setTimeout(()=>ball.remove(),700);
 },{passive:true});
 if(!['official','arena'].includes(settings.motion.presentation)&&settings.motion.depth&&!reduced&&window.matchMedia?.('(hover: hover) and (pointer: fine)').matches){
  for(const card of document.querySelectorAll('.stadium-carousel,.about-identity')){
   card.classList.add('stadium-tilt');let pending=false,point;
   const draw=()=>{pending=false;const r=card.getBoundingClientRect();if(!r.width||!r.height)return;card.style.setProperty('--tilt-x',((.5-(point.y-r.top)/r.height)*5).toFixed(2)+'deg');card.style.setProperty('--tilt-y',(((point.x-r.left)/r.width-.5)*6).toFixed(2)+'deg');card.style.setProperty('--spot-x',((point.x-r.left)/r.width*100).toFixed(1)+'%');card.style.setProperty('--spot-y',((point.y-r.top)/r.height*100).toFixed(1)+'%');};
   card.addEventListener('pointermove',e=>{point={x:e.clientX,y:e.clientY};if(!pending){pending=true;(window.requestAnimationFrame||((fn)=>fn()))(draw);}},{passive:true});
   card.addEventListener('pointerleave',()=>{point={x:0,y:0};card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});
  }
 }
 const updateCarousel=()=>{for(const card of document.querySelectorAll('[data-carousel-match]')){const match=ctx.M?.find(m=>m.id===card.dataset.carouselMatch);if(!match)continue;card.querySelector('.stadium-slide-teams>strong').innerHTML=(match.status==='planned'?'VS':match.hs+' : '+match.as)+(match.penalties?`<small class="penalty-score">${esc(UI.t('Penaltilər'))}: ${match.penalties.home} : ${match.penalties.away}</small>`:'');card.querySelector('[data-slide-caption]').textContent=UI.t(matchCaption(match));}};window.addEventListener('ssl-match-live-change',updateCarousel);
 const carousel=document.querySelector('.stadium-carousel');if(carousel){
  installCarousel(carousel,settings.motion,reduced);
  if(settings.motion.presentation==='arena'){installProjectedStadium(carousel,settings.motion,{reduced});installSceneControls(carousel,settings.motion,reduced);}
  if(!['official','arena'].includes(settings.motion.presentation)&&settings.motion.depth&&!reduced&&!preview&&(settings.motion.mobile3d!==false||!window.matchMedia?.('(max-width: 760px)').matches)&&typeof window.requestAnimationFrame==='function'){
   const sceneURL=new URL('/js/stadium-scene-runtime.js?v=20261016a',location.origin);
   let sceneVisible=typeof window.IntersectionObserver!=='function',loaded=false,sceneTimer=null;
   const cleanup=()=>{clearTimeout(sceneTimer);sceneObserver?.disconnect();carousel.removeEventListener('ssl-slide-change',schedule);document.removeEventListener('visibilitychange',schedule);window.removeEventListener('pageshow',schedule);};
   const needed=()=>sceneVisible&&!document.hidden&&!!carousel.querySelector('.stadium-slide.is-current [data-stadium-canvas]');
   const schedule=()=>{if(loaded||sceneTimer||!needed())return;sceneTimer=setTimeout(()=>{sceneTimer=null;if(!needed())return;loaded=true;cleanup();
    if(window.navigator?.connection?.saveData||!supportsStadium3D(document)){carousel.dataset.sceneEngine='fallback';return;}
    import(sceneURL.href).then(module=>module.installStadiumScene(carousel,settings.motion,motionRuntime)).catch(()=>{carousel.dataset.sceneEngine='fallback';});
   },200);};
   const sceneObserver=typeof window.IntersectionObserver==='function'?new window.IntersectionObserver(entries=>{sceneVisible=entries[0].isIntersecting;schedule();},{threshold:.05}):null;sceneObserver?.observe(carousel);
   carousel.addEventListener('ssl-slide-change',schedule);document.addEventListener('visibilitychange',schedule);window.addEventListener('pageshow',schedule);
   window.addEventListener('pagehide',event=>{clearTimeout(sceneTimer);sceneTimer=null;if(!event.persisted)cleanup();});schedule();
  }
 }
 if(settings.music.enabled&&!preview)installMusicPlayer(settings.music);
}
function installSceneControls(carousel,options,reduced){
 const names=[['stand','Tribunadan'],['touchline','Yan xətdən'],['aerial','Yuxarıdan']];
 const controls=document.createElement('div');controls.className='arena-scene-controls';
 controls.innerHTML=`<div role="group" aria-label="${esc(UI.t('Meydana baxış'))}">${names.map(([id,name])=>`<button type="button" data-arena-camera="${id}" aria-pressed="${id===options.scene}">${esc(UI.t(name))}</button>`).join('')}</div><button type="button" data-arena-motion aria-pressed="${reduced}" aria-label="${esc(UI.t('Səhnəni dayandır'))}"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg></button>`;
 carousel.querySelector('.stadium-viewport').after(controls);controls.querySelector('[data-arena-motion]').disabled=reduced||options.depth===false;
 controls.addEventListener('click',event=>{const button=event.target.closest('button');if(!button)return;if(button.hasAttribute('data-arena-camera')){for(const b of controls.querySelectorAll('[data-arena-camera]'))b.setAttribute('aria-pressed',String(b===button));carousel.dispatchEvent(new CustomEvent('ssl-scene-camera',{detail:{scene:button.dataset.arenaCamera}}));}else{const paused=carousel.dataset.scenePaused!=='true';carousel.dataset.scenePaused=String(paused);button.setAttribute('aria-pressed',String(paused));button.setAttribute('aria-label',UI.t(paused?'Səhnəni davam etdir':'Səhnəni dayandır'));button.innerHTML=paused?'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg>':'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';carousel.dispatchEvent(new Event('ssl-scene-pause'));}});
 const show=()=>{controls.hidden=carousel.querySelector('.stadium-slide.is-current')?.dataset.slideKind!=='match';};carousel.addEventListener('ssl-slide-change',show);show();
}
export function installCarousel(carousel,options,reduced){
 const slides=[...carousel.querySelectorAll('[data-stadium-slide]')],rail=carousel.querySelector('.stadium-slides'),pauseButton=carousel.querySelector('[data-stadium-action=pause]');
 let current=0,paused=reduced||!options.autoplay,hover=false,start=null,suppressClick=false,timer=null,cycle=false,railAnimation=null,heroAnimation=null;
 carousel.style.setProperty('--slide-duration',options.interval+'s');
 const pauseUI=()=>{pauseButton.innerHTML=paused?'<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg>':'<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.setAttribute('aria-label',UI.t(paused?'Slaydları davam etdir':'Slaydları dayandır'));carousel.classList.toggle('is-paused',paused||hover);carousel.dispatchEvent(new window.Event('ssl-slide-pause'));};
 const show=(index,{initial=false,instant=false}={})=>{
  const from=window.getComputedStyle?.(rail).transform||rail.style.transform||'translate3d(0,0,0)';railAnimation?.stop?.();current=(index+slides.length)%slides.length;const to=`translate3d(-${current*100}%,0,0)`;railAnimation=animateRail(rail,from,to,options,reduced||instant||options.transition==='fade'||initial);carousel.dataset.activeSlide=String(current);
  heroAnimation?.stop?.();heroAnimation=animateHero(slides[current],options,initial,instant||reduced);
  slides.forEach((slide,i)=>{slide.inert=i!==current;slide.setAttribute('aria-hidden',String(i!==current));slide.classList.toggle('is-current',i===current);});
  for(const dot of carousel.querySelectorAll('[data-stadium-go]'))dot.setAttribute('aria-pressed',String(Number(dot.dataset.stadiumGo)===current));
  carousel.querySelector('[data-stadium-count]').textContent=String(current+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');cycle=!cycle;carousel.classList.toggle('is-cycle-even',cycle);carousel.dispatchEvent(new window.Event('ssl-slide-change'));
 };
 const restart=()=>{if(timer)clearInterval(timer);timer=setInterval(()=>{
  const focused=document.activeElement,reading=focused&&carousel.contains(focused)&&!focused.closest('[data-stadium-action],[data-stadium-go]');
  if(visible&&!paused&&!hover&&!document.hidden&&!reading)show(current+1);
 },options.interval*1000);};
 carousel.addEventListener('click',e=>{if(suppressClick){e.preventDefault();suppressClick=false;return;}const dot=e.target.closest('[data-stadium-go]'),button=e.target.closest('[data-stadium-action]');
  if(dot){show(Number(dot.dataset.stadiumGo));restart();return;}
  if(button){const action=button.dataset.stadiumAction;if(action==='pause'){paused=!paused;pauseUI();}else show(current+(action==='next'?1:-1));restart();}
 });
 carousel.addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea'))return;if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();show(current+(e.key==='ArrowRight'?1:-1),{instant:true});restart();}});
 carousel.addEventListener('pointerenter',e=>{if(e.pointerType==='touch')return;hover=true;pauseUI();});carousel.addEventListener('pointerleave',()=>{hover=false;pauseUI();restart();});
 carousel.addEventListener('pointerdown',e=>{suppressClick=false;if(e.pointerType==='touch'&&!e.target.closest('button,input,select,textarea'))start={x:e.clientX,y:e.clientY};},{passive:true});
 carousel.addEventListener('pointerup',e=>{if(start){const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)>45&&Math.abs(dy)<Math.abs(dx)*.65){show(current+(dx<0?1:-1));suppressClick=true;setTimeout(()=>{suppressClick=false;},400);restart();}start=null;}},{passive:true});
 carousel.addEventListener('pointercancel',()=>{start=null;});
 show(0,{initial:true});pauseUI();restart();
 let visible=true;const visibility=typeof window.IntersectionObserver==='function'?new window.IntersectionObserver(entries=>{visible=entries[0].isIntersecting;carousel.classList.toggle('is-offscreen',!visible);},{threshold:.01}):null;visibility?.observe(carousel);
 const hidden=()=>carousel.classList.toggle('is-page-hidden',document.hidden);document.addEventListener('visibilitychange',hidden);hidden();
 const stop=()=>{clearInterval(timer);railAnimation?.stop?.();heroAnimation?.stop?.();visibility?.disconnect();document.removeEventListener('visibilitychange',hidden);};
 window.addEventListener('pagehide',e=>{if(!e.persisted)stop();});
 return stop;
}
