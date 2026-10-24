import * as UI from './i18n.js';
import {nextTrack,audioURL} from './stadium-source.js';
import {musicPosition,musicBounds,musicCoordinates,musicPlacement} from './music-position.js';

const icon=path=>`<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">${path}</svg>`;
const PLAY=icon('<path d="m8 5 11 7-11 7Z"/>'),PAUSE=icon('<path d="M6 5h4v14H6zM14 5h4v14h-4z"/>');
const PREVIOUS=icon('<path d="M5 5h3v14H5zM19 5v14L9 12Z"/>'),NEXT=icon('<path d="M16 5h3v14h-3zM5 5l10 7-10 7Z"/>');
const MORE=icon('<path d="m7 9 5 5 5-5 1.4 1.4L12 16.8l-6.4-6.4Z"/>');
const GRIP=icon('<circle cx="8" cy="5" r="1.6"/><circle cx="16" cy="5" r="1.6"/><circle cx="8" cy="12" r="1.6"/><circle cx="16" cy="12" r="1.6"/><circle cx="8" cy="19" r="1.6"/><circle cx="16" cy="19" r="1.6"/>');
const time=value=>{const n=Math.max(0,Math.floor(Number(value)||0));return Math.floor(n/60)+':'+String(n%60).padStart(2,'0');};
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// One native media element belongs to the visit, rather than to a rendered page.
export function installMusicPlayer(config){
 if(window.SSL_MUSIC?.element?.ownerDocument===document){window.SSL_MUSIC.update(config);return window.SSL_MUSIC;}
 let tracks=config.tracks.filter(t=>t.enabled&&t.source==='url'&&audioURL(t.url));
 if(config.enabled===false||!tracks.length)return;
 const read=(name,scope)=>{try{return JSON.parse(scope?.getItem(name)||'null');}catch{return null;}};
 const local=typeof localStorage==='undefined'?null:localStorage,session=typeof sessionStorage==='undefined'?null:sessionStorage;
 const saved=read('ssl.music.session.v1',session)||{},preference=read('ssl.music.preference.v1',local)||{};
 let current=tracks.find(t=>t.id===saved.id)||tracks[config.shuffle?Math.floor(Math.random()*tracks.length):0];
 let playing=false,busy=false,wantsPlay=false,generation=0,audio=null,resumeOnShow=false,stamp=0;
 let position=saved.id===current.id&&Number.isFinite(saved.seconds)?Math.max(0,saved.seconds):0;
 let history=[current.id],index=0,placement=musicPosition(read('ssl.music.position.v1',local)),drag=null,layoutObserver=null,sizeObserver=null;
 const player=document.createElement('aside');player.className='stadium-player';player.dataset.stadiumPlayer='';
 player.innerHTML=`<div class="stadium-audio-bar"><button type="button" class="stadium-audio-grip" data-audio="move">${GRIP}</button><div class="stadium-audio-heading"><span>SSL / MUSIC</span><select data-audio="track"></select></div><div class="stadium-audio-controls"><button type="button" data-audio="previous">${PREVIOUS}</button><button type="button" class="stadium-audio-toggle" data-audio="toggle" aria-pressed="false" aria-describedby="ssl-music-status">${PLAY}</button><button type="button" data-audio="next">${NEXT}</button><button type="button" class="stadium-audio-more" data-audio="details" aria-expanded="false" aria-controls="ssl-music-details">${MORE}</button></div></div><div id="ssl-music-details" class="stadium-audio-details" hidden><div class="stadium-audio-progress"><time data-audio-elapsed>0:00</time><input data-audio="seek" type="range" min="0" max="0" value="0" step="0.1" disabled><time data-audio-duration>0:00</time></div><div class="stadium-audio-secondary"><button type="button" data-audio="rewind"><span aria-hidden="true">↶ 10</span></button><button type="button" data-audio="forward"><span aria-hidden="true">10 ↷</span></button><button type="button" class="stadium-audio-reset" data-audio="reset-position"></button></div></div><span id="ssl-music-status" class="stadium-audio-status" data-audio-status role="status" aria-live="polite"></span>`;
 document.body.append(player);document.body.classList.add('has-stadium-player');
 const el=name=>player.querySelector('[data-audio="'+name+'"]'),control=el('toggle'),status=player.querySelector('[data-audio-status]'),seek=el('seek'),selector=el('track');
 const bounds=()=>{
  const rect=player.getBoundingClientRect?.(),view=document.documentElement;
  if(!rect?.width||!rect?.height)return null;
  const dock=document.querySelector('.mobile-dock')?.getBoundingClientRect?.();
  const viewportWidth=view.clientWidth||window.innerWidth,viewportHeight=Math.min(window.innerHeight,window.visualViewport?.height||window.innerHeight);
  if(!viewportWidth||!viewportHeight)return null;
  return musicBounds({width:rect.width,height:rect.height,viewportWidth,viewportHeight,dockTop:dock?.height?dock.top:undefined});
 };
 const place=()=>{const area=bounds();if(!placement||!area)return;const point=musicCoordinates(placement,area);player.style.left=Math.round(point.left)+'px';player.style.top=Math.round(point.top)+'px';player.style.right='auto';player.style.bottom='auto';player.classList.add('is-positioned');};
 const savePlacement=()=>{try{if(placement)local?.setItem('ssl.music.position.v1',JSON.stringify(placement));else local?.removeItem('ssl.music.position.v1');}catch{}};
 const resetPlacement=()=>{placement=null;for(const key of ['left','top','right','bottom'])player.style.removeProperty(key);player.classList.remove('is-positioned');savePlacement();};
 const moveTo=(left,top)=>{const area=bounds();if(!area)return;placement=musicPlacement(left,top,area);place();};
 const finishDrag=event=>{if(!drag||event&&event.pointerId!==undefined&&event.pointerId!==drag.id)return;const previous=drag;drag=null;const moved=previous.moved;try{el('move').releasePointerCapture?.(previous.id);}catch{}player.classList.remove('is-dragging');if(moved)savePlacement();};
 el('move').addEventListener('pointerdown',event=>{if(drag||event.isPrimary===false||event.button!==undefined&&event.button!==0)return;const rect=player.getBoundingClientRect?.();if(!rect?.width)return;event.preventDefault();drag={id:event.pointerId,x:event.clientX,y:event.clientY,left:rect.left,top:rect.top,moved:false};try{el('move').setPointerCapture?.(event.pointerId);}catch{};});
 el('move').addEventListener('pointermove',event=>{if(!drag||drag.id!==event.pointerId)return;const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(!drag.moved&&Math.hypot(dx,dy)<4)return;drag.moved=true;event.preventDefault();player.classList.add('is-dragging');moveTo(drag.left+dx,drag.top+dy);});
 for(const name of ['pointerup','pointercancel','lostpointercapture'])el('move').addEventListener(name,finishDrag);
 el('move').addEventListener('keydown',event=>{if(event.key==='Home'){event.preventDefault();resetPlacement();return;}const step=event.shiftKey?32:12,delta={ArrowLeft:[-step,0],ArrowRight:[step,0],ArrowUp:[0,-step],ArrowDown:[0,step]}[event.key];if(!delta)return;const rect=player.getBoundingClientRect?.();if(!rect)return;event.preventDefault();moveTo(rect.left+delta[0],rect.top+delta[1]);savePlacement();});
 el('reset-position').addEventListener('click',resetPlacement);
 const seconds=()=>Number.isFinite(audio?.currentTime)?audio.currentTime:position;
 const duration=()=>Number.isFinite(audio?.duration)&&audio.duration>0?audio.duration:0;
 const persist=enabled=>{try{local?.setItem('ssl.music.preference.v1',JSON.stringify({enabled:enabled??wantsPlay}));session?.setItem('ssl.music.session.v1',JSON.stringify({id:current.id,seconds:seconds(),playing:wantsPlay}));}catch{}};
 const progress=()=>{
  const end=duration(),at=seconds();seek.disabled=!end;seek.max=String(end);seek.value=String(Math.min(at,end));seek.setAttribute('aria-valuetext',time(at)+' / '+time(end));
  for(const [selector,value] of [['[data-audio-elapsed]',time(at)],['[data-audio-duration]',time(end)]]){const node=player.querySelector(selector);if(node.textContent!==value)node.textContent=value;}
  el('rewind').disabled=el('forward').disabled=!end;
  if(navigator.mediaSession?.setPositionState&&end)try{navigator.mediaSession.setPositionState({duration:end,position:Math.max(0,Math.min(at,end)),playbackRate:1});}catch{}
 };
 const draw=()=>{
  control.innerHTML=playing?PAUSE:PLAY;control.setAttribute('aria-label',UI.t(playing?'Musiqini dayandır':'Musiqini aç'));control.setAttribute('aria-pressed',String(playing));control.setAttribute('aria-busy',String(busy));control.title=control.getAttribute('aria-label');
  for(const [name,label] of [['previous','Əvvəlki mahnı'],['next','Növbəti mahnı'],['rewind','10 saniyə geri'],['forward','10 saniyə irəli'],['seek','Mahnının vaxtı'],['track','Mahnını seç']]){el(name).setAttribute('aria-label',UI.t(label));el(name).title=UI.t(label);}
  el('details').setAttribute('aria-label',UI.t('Musiqi idarəetməsi'));el('details').title=UI.t('Musiqi idarəetməsi');
  el('move').setAttribute('aria-label',UI.t('Pleyeri sürüşdür'));el('move').title=UI.t('Pleyeri sürüşdür');el('reset-position').textContent=UI.t('Yeri qaytar');el('reset-position').setAttribute('aria-label',UI.t('Pleyeri yerinə qaytar'));
  player.setAttribute('aria-label',UI.t('Musiqi'));player.classList.toggle('is-playing',playing);player.classList.toggle('is-loading',busy);player.dataset.track=current.id;
  selector.innerHTML=tracks.map(t=>`<option value="${esc(t.id)}"${t.id===current.id?' selected':''}>${esc(t.title)}</option>`).join('');
  selector.value=current.id;el('previous').disabled=el('next').disabled=tracks.length<2;
  if(navigator.mediaSession){navigator.mediaSession.playbackState=playing?'playing':'paused';if(window.MediaMetadata)navigator.mediaSession.metadata=new window.MediaMetadata({title:current.title,artist:'Sumqayıt Super Liqası'});}
  progress();
 };
 const pause=(remember=true)=>{++generation;wantsPlay=false;playing=false;busy=false;position=seconds();audio?.pause();status.textContent=UI.t('Musiqi dayandırıldı.');draw();if(remember)persist(false);};
 const release=()=>{if(!audio)return;const old=audio;audio=null;old.pause();old.removeAttribute?.('src');old.load?.();old.remove?.();};
 const failed=error=>{wantsPlay=false;playing=false;busy=false;status.textContent=UI.t(error?.name==='NotAllowedError'?'Musiqi üçün toxun':'Musiqi açılmadı. Yenidən play düyməsinə toxun.');draw();persist(false);};
 const start=async()=>{
  if(busy)return false;
  const ticket=++generation;wantsPlay=true;busy=true;status.textContent=UI.t('Musiqi yüklənir…');draw();
  try{
   if(!audio){
    audio=new window.Audio(current.url);audio.preload='metadata';audio.volume=config.volume/100;const target=audio;
    if(target.nodeType===1){target.hidden=true;target.dataset.stadiumAudio='';player.append(target);}
    target.addEventListener('loadedmetadata',()=>{if(target!==audio)return;if(position&&duration())target.currentTime=Math.min(position,Math.max(0,duration()-.1));progress();},{once:true});
    target.addEventListener('durationchange',()=>{if(target===audio)progress();});
    target.addEventListener('timeupdate',()=>{if(target!==audio)return;position=seconds();progress();if(Date.now()-stamp>3000){stamp=Date.now();persist();}});
    target.addEventListener('ended',()=>{if(target===audio&&wantsPlay)step(1,true);});
    target.addEventListener('error',()=>{if(target===audio)failed();});
    target.addEventListener('pause',()=>{if(target===audio&&playing&&!target.ended){playing=false;wantsPlay=false;draw();persist(false);}});
   }
   const media=audio;await media.play();
   if(ticket!==generation||!wantsPlay){if(!wantsPlay||media!==audio)media.pause();return false;}
   playing=true;status.textContent=UI.t('Musiqi səslənir.')+' '+current.title;persist(true);return true;
  }catch(error){if(ticket===generation)failed(error);return false;}
  finally{if(ticket===generation){busy=false;draw();}}
 };
 const change=async(id,play=wantsPlay,remember=true)=>{
  const next=tracks.find(t=>t.id===id);if(!next)return false;
  pause(false);release();current=next;position=0;
  if(remember){history=history.slice(0,index+1);history.push(id);if(history.length>40)history.shift();index=history.length-1;}
  draw();persist(play);return play?start():true;
 };
 const step=(direction,play=wantsPlay)=>{
  if(direction<0){if(index>0)return change(history[--index],play,false);const at=tracks.findIndex(t=>t.id===current.id),id=tracks[(at-1+tracks.length)%tracks.length].id;history.unshift(id);return change(id,play,false);}
  if(index<history.length-1)return change(history[++index],play,false);
  const next=nextTrack(tracks,current.id,config.shuffle);return next?change(next.id,play):false;
 };
 const jump=value=>{if(!audio||!duration())return false;try{audio.currentTime=Math.max(0,Math.min(Number(value)||0,duration()));position=audio.currentTime;progress();persist();return true;}catch{return false;}};
 control.addEventListener('click',()=>{if(playing||busy)pause();else start();});
 el('details').addEventListener('click',()=>{const expanded=el('details').getAttribute('aria-expanded')!=='true';el('details').setAttribute('aria-expanded',String(expanded));player.querySelector('#ssl-music-details').hidden=!expanded;player.classList.toggle('is-expanded',expanded);place();});
 el('previous').addEventListener('click',()=>step(-1));el('next').addEventListener('click',()=>step(1));
 el('rewind').addEventListener('click',()=>jump(seconds()-10));el('forward').addEventListener('click',()=>jump(seconds()+10));
 seek.addEventListener('input',()=>jump(seek.value));selector.addEventListener('change',()=>change(selector.value));
 const onVideo=e=>{if(e.target.closest('[data-watch-live],a[href*="youtube.com"],a[href*="youtu.be"]')&&(playing||busy))pause();};
 const onHide=()=>{persist();resumeOnShow=wantsPlay;pause(false);};const onShow=e=>{if(e.persisted&&resumeOnShow){resumeOnShow=false;start();}};
 const onReset=()=>{pause();release();position=0;resetPlacement();for(const scope of [local,session])try{scope?.removeItem('ssl.music.preference.v1');scope?.removeItem('ssl.music.session.v1');}catch{}draw();};
 document.addEventListener('click',onVideo);window.addEventListener('pagehide',onHide);window.addEventListener('pageshow',onShow);window.addEventListener('ssl-preferences-reset',onReset);
 const actions={play:()=>start(),pause:()=>pause(),previoustrack:()=>step(-1),nexttrack:()=>step(1),seekbackward:e=>jump(seconds()-(e.seekOffset||10)),seekforward:e=>jump(seconds()+(e.seekOffset||10)),seekto:e=>jump(e.seekTime)};
 for(const [name,fn] of Object.entries(actions))try{navigator.mediaSession?.setActionHandler(name,fn);}catch{}
 const destroy=()=>{pause();release();finishDrag();layoutObserver?.disconnect();sizeObserver?.disconnect();window.removeEventListener('resize',place);window.visualViewport?.removeEventListener('resize',place);document.removeEventListener('click',onVideo);window.removeEventListener('pagehide',onHide);window.removeEventListener('pageshow',onShow);window.removeEventListener('ssl-preferences-reset',onReset);for(const name of Object.keys(actions))try{navigator.mediaSession?.setActionHandler(name,null);}catch{}player.remove();document.body.classList.remove('has-stadium-player');delete window.SSL_MUSIC;};
 const update=next=>{const available=next.tracks.filter(t=>t.enabled&&t.source==='url'&&audioURL(t.url));if(next.enabled===false||!available.length){destroy();return;}const previous=current;config=next;tracks=available;const retained=tracks.find(t=>t.id===previous.id);if(retained&&retained.url===previous.url){current=retained;if(audio)audio.volume=config.volume/100;history=history.filter(id=>tracks.some(t=>t.id===id));index=Math.max(0,history.indexOf(current.id));draw();}else{history=[];index=-1;change((retained||tracks[0]).id,wantsPlay);}};
 const api={element:player,pause,start,change,next:()=>step(1),previous:()=>step(-1),seek:jump,update,destroy};window.SSL_MUSIC=api;
 status.textContent=UI.t('Musiqi üçün toxun');draw();
 place();window.addEventListener('resize',place);window.visualViewport?.addEventListener('resize',place);
 if(typeof MutationObserver!=='undefined'){layoutObserver=new MutationObserver(place);layoutObserver.observe(document.body,{childList:true,attributes:true,attributeFilter:['style']});}
 if(typeof ResizeObserver!=='undefined'){sizeObserver=new ResizeObserver(place);sizeObserver.observe(player);}
 if(config.autoplay&&preference.enabled===true&&saved.playing!==false&&!document.hidden)start();
 return api;
}
