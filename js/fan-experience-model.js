import {defaultClutch} from './clutch-model.js';
export const FAN_ACTIVITIES=Object.freeze(['penalty','clutch','lineup','watch','quiz','final']);
export function defaultFanExperiences(){return {
 center:{title:'Azarkeş mərkəzi',description:'Meydana çıx. Altılığını qur. Liqanı yaşa.',featured:'penalty',order:[...FAN_ACTIVITIES],showPoll:false,showRoundStats:false,showSocial:true},clutch:defaultClutch(),
 watch:{enabled:true,title:'Birlikdə izlə',description:'Yayım, hesab və tribuna bir ekranda.',matchId:'',showArchive:true,showEvents:true,showReactions:true,showMatchPicker:true,allowFullscreen:true,notice:''}
};}
export function validateFanExperiences(value){
 const errors=[],d=defaultFanExperiences(),obj=v=>v&&typeof v==='object'&&!Array.isArray(v),id=v=>typeof v==='string'&&/^[a-z0-9][a-z0-9_-]{0,79}$/.test(v),text=(v,n)=>typeof v==='string'&&v.length<=n&&!/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v),check=(ok,msg)=>{if(!ok)errors.push(msg);};
 for(const key of ['center','watch']){
  const v=value[key];if(v===undefined)continue;
  if(!obj(v)||Object.keys(v).some(k=>!Object.hasOwn(d[key],k))){errors.push(key+': bölmənin quruluşu düzgün deyil.');continue;}
  check(text(v.title,160)&&v.title.trim()&&text(v.description,600),key+': başlıq və təqdimat düzgün deyil.');
  for(const k of Object.keys(d[key]).filter(k=>typeof d[key][k]==='boolean'))check(typeof v[k]==='boolean',key+': görünmə ayarı düzgün deyil.');
 }
 const c=value.center;if(obj(c))check((FAN_ACTIVITIES.includes(c.featured)||c.featured==='hall')&&Array.isArray(c.order)&&c.order.length>=5&&c.order.length<=7&&new Set(c.order).size===c.order.length&&FAN_ACTIVITIES.filter(k=>k!=='clutch').every(k=>c.order.includes(k))&&c.order.every(k=>k==='hall'||FAN_ACTIVITIES.includes(k)),'Azarkeş mərkəzinin əsas oyunu və sırası düzgün deyil.');
 const w=value.watch;if(obj(w))check((w.matchId===''||id(w.matchId))&&text(w.notice,600),'Yayım otağının oyunu və qeydi düzgün deyil.');
 return errors;
}
export function watchMatches(data,config){return (data.league?.matches||[]).filter(m=>!m.qualificationPending&&(config.showArchive||m.status!=='done')).slice().sort((a,b)=>{const rank=m=>m.status==='live'?0:m.status==='planned'?1:2;return rank(a)-rank(b)||(a.status==='planned'?(a.date||'9999').localeCompare(b.date||'9999'):(b.date||'').localeCompare(a.date||''))||(a.time||'').localeCompare(b.time||'');});}
export function selectWatchMatch(data,config,requested=''){
 const rows=watchMatches(data,config);return rows.find(m=>m.id===requested)||rows.find(m=>m.id===config.matchId)||rows.find(m=>m.status==='live')||rows.find(m=>m.status==='planned'&&m.stage==='final')||rows[0]||null;
}
export function youtubeEmbedId(value){
 try{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.port)return '';const host=u.hostname.toLowerCase();let id='';if(host==='youtu.be')id=u.pathname.slice(1);else if(['youtube.com','www.youtube.com','m.youtube.com','www.youtube-nocookie.com'].includes(host))id=u.pathname==='/watch'?u.searchParams.get('v')||'':u.pathname.match(/^\/(?:embed|live|shorts)\/([A-Za-z0-9_-]{11})\/?$/)?.[1]||'';return /^[A-Za-z0-9_-]{11}$/.test(id)?id:'';}catch{return '';}
}
export function matchBroadcast(data,match){
 if(!match)return null;
 if(match.streamUrl&&youtubeEmbedId(match.streamUrl))return {id:youtubeEmbedId(match.streamUrl),url:match.streamUrl,live:match.status==='live'};
 const video=(data.videos||[]).find(v=>v.published&&v.match===match.id&&youtubeEmbedId(v.url));return video?{id:youtubeEmbedId(video.url),url:video.url,live:false}:null;
}
