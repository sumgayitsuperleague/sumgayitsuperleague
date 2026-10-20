import * as UI from './i18n.js';
import {nextTrack,audioURL} from './stadium-source.js';

const PLAY='<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M8 5.8a1 1 0 0 1 1.5-.86l9 5.2a1 1 0 0 1 0 1.72l-9 5.2a1 1 0 0 1-1.5-.87Z"/></svg>';
const PAUSE='<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1"/><rect x="13.5" y="5" width="4" height="14" rx="1"/></svg>';

// Background music is native audio. YouTube links belong to the media pages.
export function installMusicPlayer(config){
 const tracks=config.tracks.filter(t=>t.enabled&&t.source==='url'&&audioURL(t.url));
 if(!tracks.length||document.querySelector('[data-stadium-player]'))return;
 const read=(name,scope)=>{try{return JSON.parse(scope?.getItem(name)||'null');}catch{return null;}};
 const local=typeof localStorage==='undefined'?null:localStorage,session=typeof sessionStorage==='undefined'?null:sessionStorage;
 const saved=read('ssl.music.session.v1',session)||{},preference=read('ssl.music.preference.v1',local)||{};
 let current=tracks.find(t=>t.id===saved.id)||tracks[config.shuffle?Math.floor(Math.random()*tracks.length):0];
 let playing=false,busy=false,wantsPlay=false,generation=0,audio=null;
 let position=saved.id===current.id&&Number.isFinite(saved.seconds)?Math.max(0,saved.seconds):0;
 const volume=config.volume/100;
 const player=document.createElement('aside');player.className='stadium-player';player.dataset.stadiumPlayer='';
 player.setAttribute('aria-label',UI.t('Musiqi'));
 player.innerHTML=`<button type="button" class="stadium-audio-toggle" data-audio="toggle" aria-label="${UI.t('Musiqini aç')}" aria-pressed="false" aria-describedby="ssl-music-status">${PLAY}</button><span id="ssl-music-status" class="stadium-audio-status" data-audio-status role="status" aria-live="polite"></span>`;
 document.body.append(player);document.body.classList.add('has-stadium-player');
 const control=player.querySelector('[data-audio=toggle]'),status=player.querySelector('[data-audio-status]');
 const seconds=()=>Number.isFinite(audio?.currentTime)?audio.currentTime:position;
 const persist=enabled=>{try{
  local?.setItem('ssl.music.preference.v1',JSON.stringify({enabled:enabled??wantsPlay}));
  session?.setItem('ssl.music.session.v1',JSON.stringify({id:current.id,seconds:seconds(),playing:wantsPlay}));
 }catch{}};
 const draw=()=>{
  control.innerHTML=playing?PAUSE:PLAY;
  control.setAttribute('aria-label',UI.t(playing?'Musiqini dayandır':'Musiqini aç'));
  control.setAttribute('aria-pressed',String(playing));control.setAttribute('aria-busy',String(busy));
  control.title=UI.t(playing?'Musiqini dayandır':'Musiqini aç');
  player.classList.toggle('is-playing',playing);player.classList.toggle('is-loading',busy);player.dataset.track=current.id;
 };
 const pause=(remember=true)=>{
  ++generation;wantsPlay=false;playing=false;busy=false;position=seconds();audio?.pause();
  status.textContent=UI.t('Musiqi dayandırıldı.');draw();if(remember)persist(false);
 };
 const release=()=>{if(!audio)return;const old=audio;audio=null;old.pause();old.removeAttribute?.('src');old.load?.();old.remove?.();};
 const failed=error=>{
  wantsPlay=false;playing=false;busy=false;
  status.textContent=UI.t(error?.name==='NotAllowedError'?'Musiqi üçün toxun':'Musiqi açılmadı. Yenidən play düyməsinə toxun.');draw();
 };
 const start=async()=>{
  if(busy){pause();return false;}
  const ticket=++generation;wantsPlay=true;busy=true;status.textContent=UI.t('Musiqi yüklənir…');draw();
  try{
   if(!audio){
    audio=new window.Audio(current.url);audio.preload='none';audio.volume=volume;
    const target=audio;
    if(target.nodeType===1){target.hidden=true;target.dataset.stadiumAudio='';player.append(target);}
    target.addEventListener('loadedmetadata',()=>{if(target===audio&&position&&Number.isFinite(target.duration))target.currentTime=Math.min(position,Math.max(0,target.duration-.2));},{once:true});
    target.addEventListener('ended',()=>{if(target===audio&&wantsPlay)advance();});
    target.addEventListener('error',()=>{if(target===audio)failed();});
    // Browsers may fire pause while firing ended. Keep the listener from clearing
    // playback intent before ended advances to the next enabled recording.
    target.addEventListener('pause',()=>{if(target===audio&&playing&&!target.ended){playing=false;wantsPlay=false;draw();persist(false);}});
   }
   const media=audio;await media.play();
   if(ticket!==generation||!wantsPlay){if(!wantsPlay||media!==audio)media.pause();return false;}
   playing=true;status.textContent=UI.t('Musiqi səslənir.')+' '+current.title;persist(true);return true;
  }catch(error){if(ticket===generation)failed(error);return false;}
  finally{if(ticket===generation){busy=false;draw();}}
 };
 const change=async id=>{pause(false);release();current=tracks.find(t=>t.id===id)||current;position=0;draw();return start();};
 const advance=()=>{const next=nextTrack(tracks,current.id,config.shuffle);if(next)return change(next.id);};
 // The button is the only visible music control; ending a track keeps playback intent.
 control.addEventListener('click',()=>{if(playing||busy)pause();else start();});
 document.addEventListener('click',e=>{if(e.target.closest('[data-watch-live],a[href*="youtube.com"],a[href*="youtu.be"]')&&(playing||busy))pause();});
 window.addEventListener('pagehide',()=>{persist();pause(false);});
 window.addEventListener('ssl-preferences-reset',()=>{pause();release();position=0;for(const scope of [local,session])try{scope?.removeItem('ssl.music.preference.v1');scope?.removeItem('ssl.music.session.v1');}catch{}});
 status.textContent=UI.t('Musiqi üçün toxun');draw();
 // A listener can opt in to resume; a first visit never starts unwanted sound.
 if(config.autoplay&&preference.enabled===true&&saved.playing!==false&&!document.hidden)start();
 return {pause,start,change};
}
