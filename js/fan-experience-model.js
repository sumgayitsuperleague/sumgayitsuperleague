export const FAN_ACTIVITIES=Object.freeze(['penalty','lineup','watch','quiz','final']);
export function defaultFanExperiences(){return {
 center:{title:'Azarkeş mərkəzi',description:'Meydana çıx. Altılığını qur. Liqanı yaşa.',featured:'penalty',order:[...FAN_ACTIVITIES],showPoll:false,showRoundStats:false,showSocial:true,showIdentity:true,identityTitle:'Komanda kimliyini yarat',identityDescription:'Sənin adın. Sənin rənglərin. Sənin komandan.'},
 watch:{enabled:true,title:'Birlikdə izlə',description:'Yayım, hesab və tribuna bir ekranda.',matchId:'',showArchive:true,showEvents:true,showReactions:true,showMatchPicker:true,allowFullscreen:true,allowRooms:true,allowChat:true,allowCustomVideo:false,notice:''}
};}
export function validateFanExperiences(value){
 const errors=[],d=defaultFanExperiences(),obj=v=>v&&typeof v==='object'&&!Array.isArray(v),id=v=>typeof v==='string'&&/^[a-z0-9][a-z0-9_-]{0,79}$/.test(v),text=(v,n)=>typeof v==='string'&&v.length<=n&&!/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v),check=(ok,msg)=>{if(!ok)errors.push(msg);};
 for(const key of ['center','watch']){
  const v=value[key];if(v===undefined)continue;
  if(!obj(v)||Object.keys(v).some(k=>!Object.hasOwn(d[key],k))){errors.push(key+': bölmənin quruluşu düzgün deyil.');continue;}
  check(text(v.title,160)&&v.title.trim()&&text(v.description,600),key+': başlıq və təqdimat düzgün deyil.');
  for(const k of Object.keys(d[key]).filter(k=>typeof d[key][k]==='boolean'))check(typeof v[k]==='boolean'||['allowRooms','allowChat','allowCustomVideo','showIdentity'].includes(k)&&v[k]===undefined,key+': görünmə ayarı düzgün deyil.');
 }
 const c=value.center;if(obj(c))check((FAN_ACTIVITIES.includes(c.featured)||c.featured==='hall')&&Array.isArray(c.order)&&c.order.length>=FAN_ACTIVITIES.length&&c.order.length<=FAN_ACTIVITIES.length+1&&new Set(c.order).size===c.order.length&&new Set(c.order.filter(k=>k!=='hall')).size===FAN_ACTIVITIES.length&&c.order.every(k=>k==='hall'||FAN_ACTIVITIES.includes(k)),'Azarkeş mərkəzinin əsas oyunu və sırası düzgün deyil.');
 if(obj(c))for(const [key,max] of [['identityTitle',160],['identityDescription',600]])check(c[key]===undefined||text(c[key],max),'Azarkeş studiyasının mətni düzgün deyil.');
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
 const video=(data.videos||[]).find(v=>v.published&&v.kind==='match'&&v.match===match.id&&youtubeEmbedId(v.url));return video?{id:youtubeEmbedId(video.url),url:video.url,live:false}:null;
}
export function broadcastRoundLabel(match,lang='az'){
 const stage=match.stage||(/yarım\s*final/i.test(match.leg||'')?'semifinal':/3-cü|üçüncü/i.test(match.leg||'')?'third-place':/final/i.test(match.leg||'')?'final':'group');
 const names={semifinal:['Yarımfinal','Semi-final','Полуфинал'],final:['Final','Final','Финал'],'third-place':['3-cü yer uğrunda','Third-place match','Матч за третье место']},i=lang==='en'?1:lang==='ru'?2:0;
 if(names[stage])return names[stage][i];const n=Number(match.round)||1;if(lang==='en')return 'Round '+n;if(lang==='ru')return n+'-й тур';
 const last=n%10,suffix=last?({1:'ci',2:'ci',3:'cü',4:'cü',5:'ci',6:'cı',7:'ci',8:'ci',9:'cu'})[last]:({10:'cu',20:'ci',30:'cu',40:'cı',50:'ci',60:'cı',70:'ci',80:'ci',90:'cı'})[n%100]||'cü';return n+'-'+suffix+' tur';
}
export function watchSources(data,config={showArchive:true},lang='az'){
 const teams=Object.fromEntries((data.league?.teams||[]).map(t=>[t.id,t]));
 return (data.league?.matches||[]).filter(m=>!m.qualificationPending&&(config.showArchive!==false||m.status!=='done')).flatMap(m=>{
  const v=matchBroadcast(data,m);if(!v)return [];const roundLabel=broadcastRoundLabel(m,lang),home=teams[m.home],away=teams[m.away];if(!home||!away)return [];
  return [{key:'match:'+m.id,matchId:m.id,id:v.id,url:v.url,title:roundLabel+' · '+home.name+' — '+away.name,teamsTitle:home.name+' — '+away.name,roundLabel,round:m.round,stage:m.stage||'group',date:m.date||'',time:m.time||'',live:m.status==='live',status:m.status,homeLogo:'/assets/logos/'+home.logo,awayLogo:'/assets/logos/'+away.logo}];
 }).sort((a,b)=>{const rank=s=>s.live?0:s.status==='planned'?1:2;return rank(a)-rank(b)||(a.status==='planned'?a.date.localeCompare(b.date):b.date.localeCompare(a.date))||(Number(b.round)||0)-(Number(a.round)||0)||(a.time||'').localeCompare(b.time||'')||a.matchId.localeCompare(b.matchId);});
}
