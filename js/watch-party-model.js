export function projectedTime(video,serverNow){return Math.max(0,Math.min(86400,(Number(video?.position)||0)+(video?.playing?Math.max(0,serverNow-Number(video.updatedAt||serverNow))/1000:0)));}
export function syncCorrection(video,{now=Date.now(),offset=0,position=0,playing=false,live=false}={}){
 const target=projectedTime(video,now+offset),seek=!live&&Math.abs(position-target)>1.8;
 return {target,seek,play:!!video?.playing&&!playing,pause:!video?.playing&&playing};
}
export const roomCode=value=>/^[A-Za-z0-9_-]{22}$/.test(value||'')?value:'';
export const retryDelay=attempt=>Math.min(20000,1000*2**Math.min(attempt,5));
export const watchTime=value=>{const n=Math.max(0,Math.floor(Number(value)||0));return (n>=3600?Math.floor(n/3600)+':':'')+String(Math.floor(n/60)%60).padStart(2,'0')+':'+String(n%60).padStart(2,'0');};
