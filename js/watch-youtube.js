import {loadYouTubeAPI} from './stadium-youtube.js';
// Keep the official visible player independent of the synchronization API.
// Initial playback is always a click on YouTube's own Play control.
export function watchEmbedURL(id,origin){
 if(!/^[A-Za-z0-9_-]{11}$/.test(id))throw new Error('Invalid video');
 const base=new URL(origin);if(!['https:','http:'].includes(base.protocol))throw new Error('Invalid origin');
 const url=new URL('https://www.youtube.com/embed/'+id);
 for(const [key,value] of Object.entries({enablejsapi:'1',playsinline:'1',controls:'1',rel:'0',autoplay:'0',origin:base.origin,widget_referrer:base.origin+'/birlikde-izle'}))url.searchParams.set(key,value);
 return url.href;
}
export function createWatchPlayer({win=window,doc=document,mount,id,title,onReady=()=>{},onState=()=>{},onError=()=>{},onBlocked=()=>{},onBuffering=()=>{},loadAPI=loadYouTubeAPI}){
 let api=null,disposed=false,buffering=false,bufferTimer=0;
 const clearBuffer=()=>{clearTimeout(bufferTimer);bufferTimer=0;if(buffering){buffering=false;if(!disposed)onBuffering(false,false);}};
 const bufferState=value=>{if(value!==3){clearBuffer();return;}if(buffering)return;buffering=true;onBuffering(true,false);bufferTimer=setTimeout(()=>{if(!disposed&&buffering)onBuffering(true,true);},20000);};
 const frame=doc.createElement('iframe');frame.src=watchEmbedURL(id,win.location.origin);frame.title=title;frame.width='960';frame.height='540';frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.allowFullscreen=true;frame.referrerPolicy='strict-origin-when-cross-origin';
 mount.replaceChildren(frame);
 const controller={
  frame,get ready(){return !!api&&!disposed;},
  getCurrentTime(){try{return Number(api?.getCurrentTime())||0;}catch{return 0;}},
  getDuration(){try{return Number(api?.getDuration())||0;}catch{return 0;}},
  getPlayerState(){try{return api?.getPlayerState()??-1;}catch{return -1;}},
  playVideo(){if(!disposed)api?.playVideo();},pauseVideo(){if(!disposed)api?.pauseVideo();},seekTo(value,ahead=true){if(!disposed)api?.seekTo(value,ahead);},
  destroy(){disposed=true;clearBuffer();try{api?.destroy();}catch{}api=null;frame.remove();}
 };
 Promise.resolve().then(()=>loadAPI(win,doc)).then(YT=>{
  if(disposed)return;new YT.Player(frame,{events:{onReady:event=>{if(disposed)return;api=event.target;frame.dataset.sslSyncReady='true';onReady(controller);if(controller.getPlayerState()===3)bufferState(3);},onStateChange:event=>{if(!disposed){bufferState(event.data);onState(event.data);}},onError:event=>{if(!disposed){clearBuffer();onError(event.data);}},onAutoplayBlocked:()=>{if(!disposed){clearBuffer();onBlocked();}}}});
 }).catch(()=>{if(!disposed){clearBuffer();onError('api');}});
 return controller;
}
