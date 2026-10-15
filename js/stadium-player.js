import * as UI from './i18n.js';
import {nextTrack,audioURL,youtubeVideoID} from './stadium-source.js';
import {createStadiumSynth} from './stadium-audio.js';
import {createYouTubeController} from './stadium-youtube.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function installMusicPlayer(config){
 const tracks=config.tracks.filter(t=>t.enabled);if(!tracks.length||document.querySelector('[data-stadium-player]'))return;
 const read=(name,scope)=>{try{return JSON.parse(scope?.getItem(name)||'null');}catch{return null;}},local=typeof localStorage==='undefined'?null:localStorage,session=typeof sessionStorage==='undefined'?null:sessionStorage,saved=read('ssl.music.session.v1',session)||{},preference=read('ssl.music.preference.v1',local)||{};
 let current=tracks.find(t=>t.id===saved.id)||tracks[0],volume=Number.isFinite(preference.volume)?Math.max(0,Math.min(1,preference.volume)):config.volume/100,shuffle=typeof preference.shuffle==='boolean'?preference.shuffle:config.shuffle,playing=false,expanded=false,busy=false,audio=null,synth=null,youtube=null,wantsPlay=false,generation=0,position=Number.isFinite(saved.seconds)&&saved.id===current.id?Math.max(0,saved.seconds):0;
 const player=document.createElement('aside');player.className='stadium-player';player.dataset.stadiumPlayer='';player.setAttribute('aria-label','SSL · '+UI.t('Futbol musiqiləri'));
 player.innerHTML=`<div class="stadium-player-main"><button type="button" data-audio="toggle" class="stadium-play" aria-label="${UI.t('Musiqini aç')}">▶</button><div class="stadium-now"><span>SSL / ${UI.t('Futbol musiqiləri')}</span><b data-audio-title></b><small data-audio-status>${UI.t('Musiqi üçün toxun')}</small></div><button type="button" data-audio="next" aria-label="${UI.t('Növbəti musiqi')}">↠</button><button type="button" data-audio="expand" aria-label="${UI.t('Musiqi ayarları')}" aria-expanded="false">⌃</button></div><div class="stadium-video-panel" hidden><div data-music-video></div><div class="stadium-video-footer"><a data-music-youtube target="_blank" rel="noopener noreferrer">${UI.t('YouTube-da aç')} ↗</a><button type="button" data-audio="minimise" aria-label="${UI.t('Pleyeri yığışdır')}">−</button></div></div><div class="stadium-player-settings" hidden><label>${UI.t('Mahnını seç')}<select data-audio-track>${tracks.map(t=>`<option value="${esc(t.id)}"${t.id===current.id?' selected':''}>${esc(UI.t(t.title))}</option>`).join('')}</select></label><label>${UI.t('Səs səviyyəsi')}<input data-audio-volume type="range" min="0" max="100" value="${Math.round(volume*100)}"></label><label class="stadium-shuffle"><input data-audio-shuffle type="checkbox"${shuffle?' checked':''}>${UI.t('Qarışıq sıra')}</label></div>`;
 document.body.append(player);document.body.classList.add('has-stadium-player');
 const control=player.querySelector('[data-audio=toggle]'),status=player.querySelector('[data-audio-status]'),trackSelect=player.querySelector('[data-audio-track]'),videoPanel=player.querySelector('.stadium-video-panel'),videoMount=player.querySelector('[data-music-video]');
 const seconds=()=>current.source==='youtube'?(youtube?youtube.position():position):current.source==='url'?(Number.isFinite(audio?.currentTime)?audio.currentTime:position):(synth?synth.position():position);
 const persist=enabled=>{try{local?.setItem('ssl.music.preference.v1',JSON.stringify({enabled:enabled??playing,volume,shuffle}));session?.setItem('ssl.music.session.v1',JSON.stringify({id:current.id,seconds:seconds(),playing}));}catch{}};
 const draw=()=>{
  control.textContent=playing?'Ⅱ':busy?'…':'▶';control.setAttribute('aria-label',UI.t(playing?'Musiqini dayandır':'Musiqini aç'));control.setAttribute('aria-pressed',String(playing));control.setAttribute('aria-busy',String(busy));
  // Pause and minimise always remain available while an embed is loading.
  player.classList.toggle('is-playing',playing);player.classList.toggle('has-video',!videoPanel.hidden);player.querySelector('[data-audio-title]').textContent=UI.t(current.title);trackSelect.value=current.id;
  player.querySelector('[data-music-youtube]').href=current.source==='youtube'?'https://www.youtube.com/watch?v='+youtubeVideoID(current.url):'#';
  if(playing)status.textContent=current.source==='youtube'?'YouTube · '+UI.t('Futbol musiqiləri'):'SSL · '+UI.t('Media');
 };
 const pause=(user=true)=>{generation++;wantsPlay=false;position=seconds();synth?.pause();audio?.pause();youtube?.pause();playing=false;busy=false;status.textContent=UI.t('Musiqi üçün toxun');draw();persist(user?false:preference.enabled);};
 const fail=()=>{youtube?.destroy();youtube=null;wantsPlay=false;playing=false;busy=false;status.textContent=UI.t('Video bu saytda açılmadı. YouTube-da dinlə və ya növbəti mahnını seç.');draw();};
 const makeYouTube=()=>createYouTubeController({mount:videoMount,onState:state=>{
  if(current.source!=='youtube')return;
  if(state===1){if(document.hidden||videoPanel.hidden){youtube?.pause();return;}wantsPlay=true;busy=false;playing=true;draw();persist(true);}
  else if(state===2){playing=false;busy=false;status.textContent=UI.t('Videoda ▶ düyməsinə toxun');draw();persist(false);}
  else if(state===0&&wantsPlay)advance();
 },onBlocked:()=>{busy=false;playing=false;wantsPlay=false;status.textContent=UI.t('Videoda ▶ düyməsinə toxun');draw();},onError:fail});
 const start=async(gesture=true)=>{
  if(busy){pause();return false;}const ticket=++generation;wantsPlay=true;busy=true;draw();
  try{
   if(current.source==='youtube'){
    const id=youtubeVideoID(current.url);if(!id)throw new Error('Invalid YouTube URL');
    videoPanel.hidden=false;status.textContent=UI.t('Video yüklənir…');draw();youtube=youtube||makeYouTube();await youtube.prepare(id,position);
    if(ticket!==generation||!wantsPlay)return false;youtube.volume(volume);youtube.play();
    // PLAYING, BLOCKED and ERROR events determine the real UI state.
    busy=false;status.textContent=UI.t('Videoda ▶ düyməsinə toxun');draw();return true;
   }
   videoPanel.hidden=true;youtube?.pause();let ok=false;
   if(current.source==='url'&&audioURL(current.url)){
    if(!audio){audio=new window.Audio(current.url);audio.preload='none';audio.onended=()=>advance();audio.addEventListener('loadedmetadata',()=>{if(position&&Number.isFinite(audio.duration))audio.currentTime=Math.min(position,audio.duration);},{once:true});}
    audio.volume=volume;await audio.play();ok=true;
   }else{const Ctor=window.AudioContext||window.webkitAudioContext;if(Ctor){synth=synth||createStadiumSynth({AudioContextCtor:Ctor,onEnded:()=>advance()});synth.setVolume(volume);ok=await synth.play(current.preset,{gesture,seconds:position});}}
   if(ticket!==generation){audio?.pause();synth?.pause();return false;}playing=ok;if(ok)persist(true);else status.textContent=UI.t('Musiqi üçün toxun');return ok;
  }catch(error){if(ticket!==generation)return false;if(current.source==='youtube'){youtube?.destroy();youtube=null;}playing=false;status.textContent=UI.t(error.name==='NotAllowedError'?'Musiqi üçün toxun':'Musiqi açılmadı. Başqa musiqi seç.');return false;}
  finally{if(ticket===generation){busy=false;draw();}}
 };
 const change=async id=>{pause(false);current=tracks.find(t=>t.id===id)||current;position=0;if(audio){audio.src='';audio=null;}draw();await start(true);};
 const advance=()=>{const next=nextTrack(tracks,current.id,shuffle);if(next)return change(next.id);};
 player.addEventListener('click',e=>{const button=e.target.closest('[data-audio]');if(!button)return;const action=button.dataset.audio;
  if(action==='toggle'){if(playing||busy)pause();else start();}
  else if(action==='next')advance();
  else if(action==='minimise'){pause();videoPanel.hidden=true;draw();}
  else{expanded=!expanded;player.querySelector('.stadium-player-settings').hidden=!expanded;button.setAttribute('aria-expanded',String(expanded));button.setAttribute('aria-label',UI.t(expanded?'Ayarları bağla':'Musiqi ayarları'));button.textContent=expanded?'⌄':'⌃';}
 });
 trackSelect.onchange=()=>change(trackSelect.value);
 player.querySelector('[data-audio-volume]').oninput=e=>{volume=Number(e.target.value)/100;if(audio)audio.volume=volume;synth?.setVolume(volume);youtube?.volume(volume);persist();};
 player.querySelector('[data-audio-shuffle]').onchange=e=>{shuffle=e.target.checked;persist();};
 window.addEventListener('pagehide',()=>{persist();wantsPlay=false;synth?.pause();audio?.pause();youtube?.pause();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden&&current.source==='youtube')pause(false);});
 document.addEventListener('click',e=>{if(e.target.closest('[data-watch-live],a[href*="youtube.com"],a[href*="youtu.be"]')&&(playing||busy))pause(false);});
 window.addEventListener('ssl-preferences-reset',()=>{pause();youtube?.destroy();youtube=null;videoPanel.hidden=true;draw();for(const scope of [local,session])try{scope?.removeItem('ssl.music.preference.v1');scope?.removeItem('ssl.music.session.v1');}catch{}});
 draw();if(config.autoplay&&preference.enabled!==false&&saved.playing!==false&&!document.hidden)start(false);
 return {pause,start,change};
}
