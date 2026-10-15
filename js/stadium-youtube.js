// Official visible YouTube embed. No audio extraction or hidden video playback.
let apiPromise;
export function loadYouTubeAPI(win,doc){
 if(win.YT?.Player)return Promise.resolve(win.YT);
 if(apiPromise)return apiPromise;
 apiPromise=new Promise((resolve,reject)=>{
  const previous=win.onYouTubeIframeAPIReady;
  const fail=()=>{apiPromise=null;reject(new Error('YouTube API unavailable'));};
  win.onYouTubeIframeAPIReady=()=>{try{previous?.();}finally{if(win.YT?.Player)resolve(win.YT);else fail();}};
  const script=doc.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;script.onerror=fail;doc.head.append(script);
  setTimeout(()=>{if(!win.YT?.Player)fail();},18000);
 });return apiPromise;
}
export function createYouTubeController({win=window,doc=document,mount,onState=()=>{},onError=()=>{},onBlocked=()=>{}}){
 let player=null,ready=null,video='',destroyed=false,request=0;
 return {
  async prepare(id,seconds=0){
   if(destroyed)throw new Error('Player closed');
   const ticket=++request;
   if(!ready)ready=(async()=>{const YT=await loadYouTubeAPI(win,doc);if(destroyed)throw new Error('Player closed');
    const frame=doc.createElement('iframe');const origin=win.location?.origin||location.origin;
    frame.src='https://www.youtube-nocookie.com/embed/'+id+'?enablejsapi=1&playsinline=1&controls=1&rel=0&origin='+encodeURIComponent(origin);
    frame.title='YouTube · '+id;frame.width='356';frame.height='200';frame.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';frame.referrerPolicy='strict-origin-when-cross-origin';frame.allowFullscreen=true;
    mount.replaceChildren(frame);video=id;
    return new Promise((resolve,reject)=>{let settled=false;player=new YT.Player(frame,{events:{
     onReady:e=>{if(destroyed)return;e.target.setVolume(25);settled=true;resolve();},
     onStateChange:e=>{if(!destroyed)onState(e.data);},
     onAutoplayBlocked:()=>{if(!destroyed)onBlocked();},
     onError:e=>{if(!settled){settled=true;reject(new Error('YouTube '+e.data));}if(!destroyed)onError(e.data);}
    }});setTimeout(()=>{if(!settled){settled=true;reject(new Error('YouTube timeout'));}},18000);});
   })();
   await ready;if(destroyed||ticket!==request)throw new Error('Player request replaced');
   if(video!==id){video=id;player.cueVideoById({videoId:id,startSeconds:seconds});}
   else if(seconds>0)player.seekTo(seconds,true);
  },
  play(){player?.playVideo();},pause(){player?.pauseVideo();},
  position(){try{return Number(player?.getCurrentTime())||0;}catch{return 0;}},
  volume(value){player?.setVolume(Math.round(value*100));},
  destroy(){destroyed=true;player?.destroy();player=null;mount.replaceChildren();}
 };
}
