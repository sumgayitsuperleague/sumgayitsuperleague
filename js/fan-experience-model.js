export const FAN_ACTIVITIES=Object.freeze(['penalty','lineup','hall','watch','quiz','final']);
export function defaultFanExperiences(){return {
 center:{title:'Azarkeş mərkəzi',description:'Meydana çıx. Altılığını qur. Liqanı yaşa.',featured:'penalty',order:[...FAN_ACTIVITIES],showPoll:false,showRoundStats:false,showSocial:true},
 hall:{enabled:true,title:'3D liqa zalı',description:'Komandanı seç, zalı çevir və liqanın iştirakçılarını yaxından tanı.',autoRotate:true,showStats:true,showSquad:true,featuredTeam:'',hiddenTeams:[]},
 watch:{enabled:true,title:'Birlikdə izlə',description:'Yayım, hesab və tribuna bir ekranda.',matchId:'',showArchive:true,showEvents:true,showReactions:true,showMatchPicker:true,allowFullscreen:true,notice:''}
};}
export function validateFanExperiences(value){
 const errors=[],d=defaultFanExperiences(),obj=v=>v&&typeof v==='object'&&!Array.isArray(v),id=v=>typeof v==='string'&&/^[a-z0-9][a-z0-9_-]{0,79}$/.test(v),text=(v,n)=>typeof v==='string'&&v.length<=n&&!/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v),check=(ok,msg)=>{if(!ok)errors.push(msg);};
 for(const key of ['center','hall','watch']){
  const v=value[key];if(v===undefined)continue;
  if(!obj(v)||Object.keys(v).some(k=>!Object.hasOwn(d[key],k))){errors.push(key+': bölmənin quruluşu düzgün deyil.');continue;}
  check(text(v.title,160)&&v.title.trim()&&text(v.description,600),key+': başlıq və təqdimat düzgün deyil.');
  for(const k of Object.keys(d[key]).filter(k=>typeof d[key][k]==='boolean'))check(typeof v[k]==='boolean',key+': görünmə ayarı düzgün deyil.');
 }
 const c=value.center;if(obj(c))check(FAN_ACTIVITIES.includes(c.featured)&&Array.isArray(c.order)&&c.order.length===FAN_ACTIVITIES.length&&new Set(c.order).size===FAN_ACTIVITIES.length&&c.order.every(k=>FAN_ACTIVITIES.includes(k)),'Azarkeş mərkəzinin əsas oyunu və sırası düzgün deyil.');
 const h=value.hall;if(obj(h))check((h.featuredTeam===''||id(h.featuredTeam))&&Array.isArray(h.hiddenTeams)&&h.hiddenTeams.length<=64&&new Set(h.hiddenTeams).size===h.hiddenTeams.length&&h.hiddenTeams.every(id),'Zalın komanda seçimi düzgün deyil.');
 const w=value.watch;if(obj(w))check((w.matchId===''||id(w.matchId))&&text(w.notice,600),'Yayım otağının oyunu və qeydi düzgün deyil.');
 return errors;
}
export function hallClubs(data,config){return (data.league?.teams||[]).filter(t=>!config.hiddenTeams.includes(t.id));}
export function clubRecord(league,id){
 const games=(league.matches||[]).filter(m=>m.status==='done'&&!m.qualificationPending&&(m.home===id||m.away===id));
 return {played:games.length,wins:games.filter(m=>(m.home===id?m.hs:m.as)>(m.home===id?m.as:m.hs)).length,goals:games.reduce((n,m)=>n+(m.home===id?m.hs:m.as),0),conceded:games.reduce((n,m)=>n+(m.home===id?m.as:m.hs),0)};
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
