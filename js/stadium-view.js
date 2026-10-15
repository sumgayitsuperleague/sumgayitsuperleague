import * as UI from './i18n.js';
import {animateRail} from './site-motion.js';
import {stadiumSettings} from './stadium-source.js';
import {installMusicPlayer} from './stadium-player.js';
import {selectHomeMatches} from './home-source.js';
import {matchStageLabel} from './league-source.js';
export {installMusicPlayer} from './stadium-player.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pitchScene=()=>`<div class="stadium-scene" aria-hidden="true"><div class="stadium-glow"></div><div class="stadium-pitch"><svg viewBox="0 0 640 400" fill="none"><path d="M24 24h592v352H24zM320 24v352M24 100h95v200H24m592-200h-95v200h95M24 148h34v104H24m592-104h-34v104h34"/><circle cx="320" cy="200" r="62"/><circle cx="320" cy="200" r="3"/></svg><i class="stadium-goal goal-left"></i><i class="stadium-goal goal-right"></i></div><img class="stadium-scene-ball" src="/assets/football-cursor-large.svg" alt=""><span class="stadium-scene-ring"></span></div>`;
export function renderStadiumCarousel(ctx,lead){
 const options=stadiumSettings(ctx.CMS.stadium).motion;if(!options.carousel||!lead||ctx.H.leadType==='none')return lead;
 const selected=selectHomeMatches(ctx.L,ctx.H.matchCenter).matches,m=selected.find(x=>x.status==='live')||selected.find(x=>x.status==='planned'),slides=[lead];
 if(m)slides.push(`<a class="stadium-slide-feature stadium-match-slide" data-carousel-match="${esc(m.id)}" href="matc.html?id=${esc(m.id)}">${pitchScene()}<span class="eyebrow">${esc(UI.t(m.status==='live'?'Canlı hesab və vaxt':'Meydanın növbəti görüşü'))}</span><span class="stadium-slide-stage">${esc(UI.t(matchStageLabel(m)))}</span><div class="stadium-slide-teams"><span>${ctx.ball(m.home,'lg')}<b>${esc(ctx.T[m.home].name)}</b></span><strong>${m.status==='planned'?'VS':m.hs+' : '+m.as}</strong><span>${ctx.ball(m.away,'lg')}<b>${esc(ctx.T[m.away].name)}</b></span></div><p>${ctx.fd(m.date)} · ${esc(m.time)} · ${esc(m.venue)}</p><span class="stadium-slide-link">${esc(UI.t('Matç mərkəzi'))} ↗</span></a>`);
 else slides.push(`<a class="stadium-slide-feature" href="haqqimizda.html">${pitchScene()}<span class="eyebrow">${esc(UI.t('Liqa haqqında'))}</span><h2>${esc(ctx.CMS.about.heading)}</h2><p>${esc(ctx.CMS.about.subtitle)}</p><span class="stadium-slide-link">${esc(UI.t('Liqa ilə tanış ol'))} ↗</span></a>`);
 slides.push(`<a class="stadium-slide-feature stadium-media-slide" href="media.html">${pitchScene()}<span class="eyebrow">SSL TV / ${esc(ctx.L.season)}</span><h2>${esc(UI.t('Oyunu izlə. Liqanı yaşa.'))}</h2><p>${esc(UI.t('Matç arxivi və yayımlar'))}</p><span class="stadium-slide-link">${esc(UI.t('Media'))} ↗</span></a>`);
 return `<section class="stadium-carousel" aria-label="${esc(UI.t('Liqa slaydları'))}" aria-roledescription="carousel"><div class="stadium-viewport"><div class="stadium-slides">${slides.map((html,i)=>`<div class="stadium-slide${i===0?' is-current':''}" data-stadium-slide="${i}" role="group" aria-roledescription="slide" aria-label="${i+1} / ${slides.length}" aria-hidden="${i!==0}"${i?' inert':''}>${html}</div>`).join('')}</div></div><div class="stadium-carousel-controls"><div class="stadium-dots">${slides.map((_,i)=>`<button type="button" data-stadium-go="${i}" aria-label="${esc(UI.t('Slayd'))} ${i+1} / ${slides.length}" aria-pressed="${i===0}"><span></span></button>`).join('')}<span class="stadium-slide-count" data-stadium-count>01 / 0${slides.length}</span></div><div><button type="button" data-stadium-action="previous" aria-label="${esc(UI.t('Əvvəlki slayd'))}">←</button><button type="button" data-stadium-action="pause" aria-label="${esc(UI.t('Slaydları dayandır'))}" aria-pressed="false">Ⅱ</button><button type="button" data-stadium-action="next" aria-label="${esc(UI.t('Növbəti slayd'))}">→</button></div></div><div class="stadium-slide-progress" aria-hidden="true"><i></i></div></section>`;
}
export function bakuTime(now,{seconds=true}={}){return new Intl.DateTimeFormat('az-AZ',{timeZone:'Asia/Baku',hour:'2-digit',minute:'2-digit',...(seconds?{second:'2-digit'}:{}),hourCycle:'h23'}).format(new Date(now));}
export function installStadium(ctx){
 const settings=stadiumSettings(ctx.CMS.stadium),reduced=settings.motion.enabled===false||!!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,preview=!!document.body.dataset.previewPath;
 document.body.dataset.stadiumMotion=reduced?'none':settings.motion.transition;
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
 if(settings.motion.depth&&!reduced&&window.matchMedia?.('(hover: hover) and (pointer: fine)').matches){
  for(const card of document.querySelectorAll('.stadium-carousel,.about-identity')){
   card.classList.add('stadium-tilt');let pending=false,point;
   const draw=()=>{pending=false;const r=card.getBoundingClientRect();if(!r.width||!r.height)return;card.style.setProperty('--tilt-x',((.5-(point.y-r.top)/r.height)*5).toFixed(2)+'deg');card.style.setProperty('--tilt-y',(((point.x-r.left)/r.width-.5)*6).toFixed(2)+'deg');card.style.setProperty('--spot-x',((point.x-r.left)/r.width*100).toFixed(1)+'%');card.style.setProperty('--spot-y',((point.y-r.top)/r.height*100).toFixed(1)+'%');};
   card.addEventListener('pointermove',e=>{point={x:e.clientX,y:e.clientY};if(!pending){pending=true;(window.requestAnimationFrame||((fn)=>fn()))(draw);}},{passive:true});
   card.addEventListener('pointerleave',()=>{point={x:0,y:0};card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});
  }
 }
 const updateCarousel=()=>{for(const card of document.querySelectorAll('[data-carousel-match]')){const match=ctx.M?.find(m=>m.id===card.dataset.carouselMatch);if(!match)continue;card.querySelector('.stadium-slide-teams>strong').textContent=match.status==='planned'?'VS':match.hs+' : '+match.as;card.querySelector('.eyebrow').textContent=UI.t(match.status==='live'?'Canlı hesab və vaxt':'Meydanın növbəti görüşü');}};window.addEventListener('ssl-match-live-change',updateCarousel);
 const carousel=document.querySelector('.stadium-carousel');if(carousel)installCarousel(carousel,settings.motion,reduced);
 if(settings.music.enabled&&!preview)installMusicPlayer(settings.music);
}
export function installCarousel(carousel,options,reduced){
 const slides=[...carousel.querySelectorAll('[data-stadium-slide]')],rail=carousel.querySelector('.stadium-slides'),pauseButton=carousel.querySelector('[data-stadium-action=pause]');
 let current=0,paused=reduced||!options.autoplay,hover=false,start=null,suppressClick=false,timer=null,cycle=false,railAnimation=null;
 carousel.style.setProperty('--slide-duration',options.interval+'s');
 const pauseUI=()=>{pauseButton.textContent=paused?'▶':'Ⅱ';pauseButton.setAttribute('aria-pressed',String(paused));pauseButton.setAttribute('aria-label',UI.t(paused?'Slaydları davam etdir':'Slaydları dayandır'));carousel.classList.toggle('is-paused',paused||hover);};
 const show=index=>{
  const from=window.getComputedStyle?.(rail).transform||rail.style.transform||'translate3d(0,0,0)';railAnimation?.stop?.();current=(index+slides.length)%slides.length;const to=`translate3d(-${current*100}%,0,0)`;railAnimation=animateRail(rail,from,to,options,reduced||options.transition==='fade');carousel.dataset.activeSlide=String(current);
  slides.forEach((slide,i)=>{slide.inert=i!==current;slide.setAttribute('aria-hidden',String(i!==current));slide.classList.toggle('is-current',i===current);});
  for(const dot of carousel.querySelectorAll('[data-stadium-go]'))dot.setAttribute('aria-pressed',String(Number(dot.dataset.stadiumGo)===current));
  carousel.querySelector('[data-stadium-count]').textContent=String(current+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');cycle=!cycle;carousel.classList.toggle('is-cycle-even',cycle);
 };
 const restart=()=>{if(timer)clearInterval(timer);timer=setInterval(()=>{
  const focused=document.activeElement,reading=focused&&carousel.contains(focused)&&!focused.closest('[data-stadium-action],[data-stadium-go]');
  if(!paused&&!hover&&!document.hidden&&!reading)show(current+1);
 },options.interval*1000);};
 carousel.addEventListener('click',e=>{if(suppressClick){e.preventDefault();suppressClick=false;return;}const dot=e.target.closest('[data-stadium-go]'),button=e.target.closest('[data-stadium-action]');
  if(dot){show(Number(dot.dataset.stadiumGo));restart();return;}
  if(button){const action=button.dataset.stadiumAction;if(action==='pause'){paused=!paused;pauseUI();}else show(current+(action==='next'?1:-1));restart();}
 });
 carousel.addEventListener('keydown',e=>{if(e.target.matches('input,select,textarea'))return;if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();show(current+(e.key==='ArrowRight'?1:-1));restart();}});
 carousel.addEventListener('pointerenter',e=>{if(e.pointerType==='touch')return;hover=true;pauseUI();});carousel.addEventListener('pointerleave',()=>{hover=false;pauseUI();restart();});
 carousel.addEventListener('pointerdown',e=>{suppressClick=false;if(e.pointerType==='touch'&&!e.target.closest('button,input,select,textarea'))start={x:e.clientX,y:e.clientY};},{passive:true});
 carousel.addEventListener('pointerup',e=>{if(start){const dx=e.clientX-start.x,dy=e.clientY-start.y;if(Math.abs(dx)>45&&Math.abs(dy)<Math.abs(dx)*.65){show(current+(dx<0?1:-1));suppressClick=true;setTimeout(()=>{suppressClick=false;},400);restart();}start=null;}},{passive:true});
 carousel.addEventListener('pointercancel',()=>{start=null;});
 show(0);pauseUI();restart();
}
