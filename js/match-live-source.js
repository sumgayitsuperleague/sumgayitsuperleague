import {matchStage} from './league-source.js';
// The clock stores a server timestamp, not a per-second database write.
export const LIVE_PERIODS=[1,2,3,4];
export const defaultMatchClock=()=>({period:1,state:'paused',elapsed:0,startedAt:null,periodMinutes:25,extraMinutes:10});
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const keys=(x,allowed)=>object(x)&&Object.keys(x).every(k=>allowed.includes(k));
const integer=(x,min,max)=>Number.isInteger(x)&&x>=min&&x<=max;
const timestamp=x=>Number.isSafeInteger(x)&&x>=0&&x<=8_640_000_000_000_000;
export function validateMatchClock(clock,status){
 const errors=[];
 if(!keys(clock,['period','state','elapsed','startedAt','periodMinutes','extraMinutes']))return ['Oyun saatının quruluşu düzgün deyil.'];
 if(!LIVE_PERIODS.includes(clock.period)||!['running','paused','interval'].includes(clock.state)||!integer(clock.elapsed,0,10800)||!integer(clock.periodMinutes,1,60)||!integer(clock.extraMinutes,1,30))errors.push('Oyun saatının hissəsi, müddəti və ya vəziyyəti düzgün deyil.');
 if(clock.state==='running'?!timestamp(clock.startedAt):clock.startedAt!==null)errors.push('Oyun saatının başlama anı düzgün deyil.');
 if(status!=='live'&&clock.state==='running')errors.push('Yalnız canlı oyunun saatı işləyə bilər.');
 return errors;
}
export function elapsedInPeriod(match,now=Date.now()){
 const clock=match.clock;if(!clock)return 0;
 return Math.min(10800,Math.max(0,clock.elapsed+(clock.state==='running'&&typeof clock.startedAt==='number'?Math.max(0,Math.floor((now-clock.startedAt)/1000)):0)));
}
export function periodOffset(clock){return clock.period===1?0:clock.period===2?clock.periodMinutes*60:clock.period===3?clock.periodMinutes*120:clock.periodMinutes*120+clock.extraMinutes*60;}
export const matchSeconds=(match,now=Date.now())=>match.clock?periodOffset(match.clock)+elapsedInPeriod(match,now):0;
export function clockText(match,now=Date.now()){
 if(!match.clock)return '00:00';
 const clock=match.clock,elapsed=elapsedInPeriod(match,now),duration=(clock.period<=2?clock.periodMinutes:clock.extraMinutes)*60,seconds=elapsed>duration?elapsed-duration:periodOffset(clock)+elapsed;
 const text=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
 return elapsed>duration?String((periodOffset(clock)+duration)/60)+'+'+text:text;
}
export function liveLabel(match){
 if(match.status==='planned')return 'Planlaşdırılıb';if(match.status==='done')return 'Tamamlandı';
 const clock=match.clock;if(clock?.state==='interval')return 'Fasilə';if(clock?.state==='paused')return 'Dayandırılıb';
 return ({1:'1-ci hissə',2:'2-ci hissə',3:'1-ci əlavə hissə',4:'2-ci əlavə hissə'})[clock?.period]||'Canlı';
}
export function eventTime(event){
 if(!Number.isInteger(event.at))return '';
 return String(Math.floor(event.at/60)).padStart(2,'0')+':'+String(event.at%60).padStart(2,'0');
}
export function liveStreamURL(value){
 if(value==='')return true;
 if(typeof value!=='string'||value.length>1000||/[<>\\\u0000-\u0020]/.test(value))return false;
 try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password&&['youtube.com','www.youtube.com','youtu.be'].includes(url.hostname);}catch{return false;}
}
export class MatchControlError extends Error{constructor(message,status=400){super(message);this.status=status;}}
const reject=message=>{throw new MatchControlError(message);};
const text=(value,required=false)=>typeof value==='string'&&value.length<=120&&(!required||value.trim())&&!/[<>\u0000-\u001f]/.test(value);
const checked=(command,allowed)=>{if(!keys(command,['action',...allowed]))reject('Canlı əməliyyatın məlumatları düzgün deyil.');};
export function controlMatch(source,command,now=Date.now(),eventID){
 if(!object(command)||typeof command.action!=='string'||!timestamp(now))reject('Canlı əməliyyat düzgün deyil.');
 const match=structuredClone(source),clock=match.clock?structuredClone(match.clock):defaultMatchClock();match.clock=clock;
 const live=()=>{if(match.status!=='live')throw new MatchControlError('Bu əməliyyat üçün oyunu canlı başlat.',409);};
 const stop=state=>{clock.elapsed=elapsedInPeriod(match,now);clock.state=state;clock.startedAt=null;};
 const run=()=>{clock.state='running';clock.startedAt=now;};
 const active=()=>{if(!['live','done'].includes(match.status))throw new MatchControlError('Əvvəl oyunu başlat.',409);};
 const credited=g=>g.og?(g.t===match.home?match.away:match.home):g.t;
 const bump=(team,delta)=>{const key=team===match.home?'hs':'as';match[key]=Math.max(0,match[key]+delta);if(!integer(match[key],0,200))reject('Hesab 0–200 aralığında olmalıdır.');};
 const makeEvent=kind=>{
  if(![match.home,match.away].includes(command.team)||!text(command.player,kind==='cards'||!command.unknown))reject('Oyunda iştirak edən komandanı və oyunçunu seç.');
  if(command.unknown!==undefined&&typeof command.unknown!=='boolean'||command.ownGoal!==undefined&&typeof command.ownGoal!=='boolean')reject('Qolun növü düzgün deyil.');
  const at=command.at===undefined?matchSeconds(match,now):command.at,period=command.period===undefined?clock.period:command.period;
  if(!integer(at,0,21600)||!LIVE_PERIODS.includes(period))reject('Hadisənin vaxtı düzgün deyil.');
  const result={p:command.unknown?'':command.player.trim(),t:command.team,at,period};
  if(kind==='goals'){if(command.ownGoal)result.og=true;if(command.unknown)result.unk=true;}
  else{if(!['y','r'].includes(command.card))reject('Kartın növü düzgün deyil.');result.c=command.card;}
  return result;
 };
 switch(command.action){
  case 'configure':
   checked(command,['periodMinutes','extraMinutes']);if(clock.state==='running')throw new MatchControlError('Müddəti dəyişmək üçün saatı dayandır.',409);
   if(!integer(command.periodMinutes,1,60)||!integer(command.extraMinutes,1,30))reject('Hissə 1–60, əlavə hissə 1–30 dəqiqə olmalıdır.');clock.periodMinutes=command.periodMinutes;clock.extraMinutes=command.extraMinutes;break;
  case 'start':
   checked(command,[]);if(match.qualificationPending)throw new MatchControlError('Yarımfinal iştirakçıları hələ təsdiqlənməyib.',409);if(!match.date||!match.time)throw new MatchControlError('Əvvəl oyunun tarix və saatını təyin et.',409);if(match.status!=='planned')throw new MatchControlError('Bu oyun artıq başladılıb. Saatı davam etdirmək üçün “Davam et” seç.',409);
   match.status='live';match.hs=0;match.as=0;clock.period=1;clock.elapsed=0;run();break;
  case 'pause':checked(command,[]);live();if(clock.state!=='running')throw new MatchControlError('Oyun saatı artıq dayandırılıb.',409);stop('paused');break;
  case 'resume':checked(command,[]);live();if(clock.state!=='paused')throw new MatchControlError('Davam etmək üçün dayandırılmış oyun saatı olmalıdır.',409);run();break;
  case 'interval':checked(command,[]);live();if(clock.state==='interval')throw new MatchControlError('Oyun artıq fasilədədir.',409);stop('interval');break;
  case 'next-period':
   checked(command,[]);live();if(clock.state==='running'||clock.period>=4)throw new MatchControlError('Növbəti hissə üçün əvvəl saatı dayandır və ya fasilə ver.',409);clock.period++;clock.elapsed=0;run();break;
  case 'set-clock':
   checked(command,['period','seconds']);
   if(!LIVE_PERIODS.includes(command.period)||!integer(command.seconds,0,10800))reject('Hissə və ya vaxt düzgün deyil.');clock.period=command.period;clock.elapsed=command.seconds;clock.state='paused';clock.startedAt=null;break;
  case 'reset-clock':
   checked(command,[]);clock.period=1;clock.elapsed=0;clock.state='paused';clock.startedAt=null;break;
  case 'reset-match':
   checked(command,[]);if(match.status!=='live')throw new MatchControlError('Sınağı ləğv etmək üçün oyun canlı vəziyyətdə olmalıdır.',409);
   delete match.penalties;match.status='planned';match.hs=null;match.as=null;match.goals=[];match.cards=[];match.mvp=null;clock.period=1;clock.elapsed=0;clock.state='paused';clock.startedAt=null;break;
  case 'fixture':{
   checked(command,['stage','round','leg','date','time','venue']);
   if(!['group','semifinal','final','third-place'].includes(command.stage)||command.stage==='group'&&!integer(command.round,1,200)||command.stage!=='group'&&command.round!==undefined)reject('Yarış mərhələsini və qrup turunu düzgün seç.');
   const unscheduled=command.stage!=='group'&&match.status==='planned'&&command.date===''&&command.time==='';
   if(!text(command.leg)||command.leg.length>80||typeof command.venue!=='string'||command.venue.length>160||/[<>\u0000-\u001f]/.test(command.venue)||(!unscheduled&&(typeof command.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(command.date)||Number.isNaN(Date.parse(command.date+'T00:00:00Z'))||new Date(command.date+'T00:00:00Z').toISOString().slice(0,10)!==command.date||typeof command.time!=='string'||!/^([01]\d|2[0-3]):[0-5]\d$/.test(command.time))))reject('Tarix, saat, məkan və ya mərhələ adı düzgün deyil.');
   Object.assign(match,{stage:command.stage,round:command.stage==='group'?command.round:match.round||1,leg:command.leg.trim(),date:command.date,time:command.time,venue:command.venue.trim()});break;
  }
  case 'finish':checked(command,[]);live();stop('paused');match.status='done';break;
  case 'penalties':
   checked(command,['home','away']);active();if(matchStage(match)==='group'||match.hs!==match.as||!integer(command.home,0,100)||!integer(command.away,0,100)||command.home===command.away)reject('Penalti seriyası üçün bərabərə bitən pley-off oyunu və fərqli hesab yaz.');match.penalties={home:command.home,away:command.away};break;
  case 'clear-penalties':checked(command,[]);active();delete match.penalties;break;
  case 'reopen':checked(command,[]);if(match.status!=='done')throw new MatchControlError('Yalnız tamamlanmış oyun yenidən açıla bilər.',409);match.status='live';clock.state='paused';clock.startedAt=null;break;
  case 'score':checked(command,['home','away']);active();if(!integer(command.home,0,200)||!integer(command.away,0,200))reject('Hesab 0–200 aralığında olmalıdır.');match.hs=command.home;match.as=command.away;break;
  case 'goal':case 'card':{
   const kind=command.action==='goal'?'goals':'cards';checked(command,kind==='goals'?['team','player','ownGoal','unknown','at','period']:['team','player','card','at','period']);live();
   if(match[kind].length>=(kind==='goals'?400:100))reject('Hadisə limiti dolub.');const event=makeEvent(kind);
   if(typeof eventID!=='string'||!/^event-[a-f0-9-]{36}$/.test(eventID))reject('Hadisənin identifikatoru düzgün deyil.');event.id=eventID;match[kind].push(event);if(kind==='goals')bump(credited(event),1);break;
  }
  case 'edit-event':{
   checked(command,['kind','index','team','player','ownGoal','unknown','card','at','period']);active();if(!['goals','cards'].includes(command.kind)||!integer(command.index,0,399)||!match[command.kind][command.index])reject('Hadisə tapılmadı.');
   const old=match[command.kind][command.index],event=makeEvent(command.kind);if(old.id)event.id=old.id;match[command.kind][command.index]=event;if(command.kind==='goals'&&credited(old)!==credited(event)){bump(credited(old),-1);bump(credited(event),1);}break;
  }
  case 'remove-event':{
   checked(command,['kind','index']);active();if(!['goals','cards'].includes(command.kind)||!integer(command.index,0,399)||!match[command.kind][command.index])reject('Hadisə tapılmadı.');const [removed]=match[command.kind].splice(command.index,1);if(command.kind==='goals')bump(credited(removed),-1);break;
  }
  case 'mvp':checked(command,['team','player']);active();if(![match.home,match.away].includes(command.team)||!text(command.player))reject('MVP məlumatları düzgün deyil.');match.mvp=command.player.trim()?{p:command.player.trim(),t:command.team}:null;break;
  case 'broadcast':checked(command,['url']);if(!liveStreamURL(command.url))reject('Yayım üçün düzgün YouTube HTTPS keçidi daxil et.');match.streamUrl=command.url;break;
  default:reject('Canlı əməliyyat tanınmadı.');
 }
 if(match.hs!==match.as||matchStage(match)==='group')delete match.penalties;
 const errors=validateMatchClock(clock,match.status);if(errors.length)reject(errors.join(' '));return match;
}
