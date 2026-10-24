import {defaultFanExperiences,validateFanExperiences} from './fan-experience-model.js';
import {ARENA_PAGES,defaultArenaFeatures,arenaSettings,validateArenaFeatures,publicArenaFeatures,arenaLocaleTargets} from './arena-model.js';
// Final hub, lineup builder and team quiz. No league records are mutated.
export const FAN_LINEUP_SIZE=6;
export const FAN_FORMATIONS=Object.freeze({"2-2-1":[{"role":"gk","x":50,"y":86},{"role":"field","x":28,"y":65},{"role":"field","x":72,"y":65},{"role":"field","x":28,"y":41},{"role":"field","x":72,"y":41},{"role":"field","x":50,"y":17}],"2-1-2":[{"role":"gk","x":50,"y":86},{"role":"field","x":28,"y":65},{"role":"field","x":72,"y":65},{"role":"field","x":50,"y":41},{"role":"field","x":28,"y":17},{"role":"field","x":72,"y":17}],"1-3-1":[{"role":"gk","x":50,"y":86},{"role":"field","x":50,"y":65},{"role":"field","x":18,"y":41},{"role":"field","x":50,"y":41},{"role":"field","x":82,"y":41},{"role":"field","x":50,"y":17}]});
const LEGACY_FORMATIONS=Object.freeze({'1-2-1':'1-3-1','2-2':'2-2-1','1-1-2':'2-1-2'});
export const fanFormation=value=>LEGACY_FORMATIONS[value]||value;
export const FAN_PAGES=Object.freeze({'/final':'final','/ideal-altiliq':'lineup','/viktorina':'quiz','/liqa-zali':'hall','/birlikde-izle':'watch',...ARENA_PAGES});
export function defaultFanZone(){
 return {version:1,showLinks:true,...defaultArenaFeatures(),...defaultFanExperiences(),
  final:{enabled:true,showOnHome:true,title:'Final mərkəzi',description:'',archiveTitle:'Mövsümün finalı',recap:'',cover:'',state:'auto',matchId:'',thirdPlaceId:'',championTeam:'',showCountdown:true,showJourney:true,showStats:true,showThirdPlace:true,showSponsors:true,linkLabel:'',linkUrl:''},
  lineup:{enabled:true,title:'Öz ideal altılığını qur',description:'Heyətlərdən bir qapıçı və beş meydan oyunçusu seç.',defaultFormation:'2-2-1',formations:['2-2-1','2-1-2','1-3-1'],allowedTeams:[],hiddenPlayers:[],strictGoalkeeper:true,allowShare:true,allowDownload:true},
  quiz:{enabled:true,title:'Komandanı nə qədər tanıyırsan?',description:'Komandanı seç və liqanın həqiqi məlumatlarına əsaslanan sualları cavablandır.',autoQuestions:true,questionLimit:5,shuffle:true,allowTeamSelect:true,questions:[]}
 };
}

export function fanZoneSettings(value){
 const d=defaultFanZone(),v=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
 const lineup={...d.lineup,...v.lineup};
 // Upgrade only the shipped five-player defaults; keep all organizer edits.
 if(lineup.title==='Öz ideal beşliyini qur')lineup.title=d.lineup.title;
 if(lineup.description==='Heyətlərdən bir qapıçı və dörd meydan oyunçusu seç.')lineup.description=d.lineup.description;
 lineup.defaultFormation=fanFormation(lineup.defaultFormation);
 if(Array.isArray(lineup.formations))lineup.formations=[...new Set(lineup.formations.map(fanFormation))];
 return {...d,...v,...arenaSettings(v),...Object.fromEntries(['center','hall','watch'].map(k=>[k,{...d[k],...v[k]}])),final:{...d.final,...v.final},lineup,quiz:{...d.quiz,...v.quiz}};
}

export function validateFanZone(v,opts={}){
 const errors=[],obj=x=>x&&typeof x==='object'&&!Array.isArray(x),keys=(x,allowed)=>obj(x)&&Object.keys(x).every(k=>allowed.includes(k)),check=(yes,msg)=>{if(!yes&&errors.length<25)errors.push(msg);},
  text=(s,n=300,required=false)=>typeof s==='string'&&s.length<=n&&(!required||s.trim().length>0)&&!/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s),
  id=s=>typeof s==='string'&&/^[a-z0-9][a-z0-9_-]{0,79}$/.test(s),
  image=opts.imagePath||((s)=>s===''||/^\/assets\/(?:logo\.png|(?:logos|editorial)\/[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp))$/.test(s)),
  link=opts.safeLink||((s)=>s===''||/^\/(?!\/)[a-z0-9/?_=&%.#-]*$/i.test(s));
 if(!keys(v,['version','showLinks','final','lineup','quiz','penalty','timeline','center','hall','watch']))return ['Azarkeş bölmələrinin məlumat quruluşu düzgün deyil.'];
 const d=defaultFanZone();check(v.version===1&&typeof v.showLinks==='boolean','Azarkeş bölmələrinin versiyası və görünməsi düzgün deyil.');
 for(const name of ['final','lineup','quiz']){
  const c=v[name];
  if(!keys(c,Object.keys(d[name]))){check(false,name+': ayarlar düzgün deyil.');continue;}
  check(typeof c.enabled==='boolean'&&text(c.title,160,true)&&text(c.description,600),name+': başlıq və təqdimat düzgün deyil.');
  for(const k of Object.keys(d[name]).filter(k=>typeof d[name][k]==='boolean'))check(typeof c[k]==='boolean'||name==='final'&&k==='showOnHome'&&c[k]===undefined,name+': görünmə ayarı düzgün deyil.');
 }
 const f=v.final;if(obj(f)){check(text(f.archiveTitle,160,true)&&text(f.recap,6000)&&image(f.cover),'Finalın arxiv mətni və ya şəkli düzgün deyil.');check(['auto','upcoming','live','completed','archived'].includes(f.state),'Finalın vəziyyəti düzgün deyil.');for(const k of ['matchId','thirdPlaceId','championTeam'])check(f[k]===''||id(f[k]),'Finalın oyun və ya komanda seçimi düzgün deyil.');check(text(f.linkLabel,80)&&link(f.linkUrl)&&Boolean(f.linkLabel.trim())===Boolean(f.linkUrl),'Əlavə keçid üçün həm ad, həm ünvan daxil et.');}
 const l=v.lineup;if(obj(l)){
  check(Array.isArray(l.formations)&&l.formations.length>=1&&l.formations.length<=3&&new Set(l.formations).size===l.formations.length&&l.formations.every(x=>Object.hasOwn(FAN_FORMATIONS,fanFormation(x)))&&l.formations.includes(l.defaultFormation),'Altılığın düzülüşlərini və əsas düzülüşünü seç.');
  check(Array.isArray(l.allowedTeams)&&l.allowedTeams.length<=64&&new Set(l.allowedTeams).size===l.allowedTeams.length&&l.allowedTeams.every(id),'Altılığın komanda siyahısı düzgün deyil.');
  check(Array.isArray(l.hiddenPlayers)&&l.hiddenPlayers.length<=500&&new Set(l.hiddenPlayers).size===l.hiddenPlayers.length&&l.hiddenPlayers.every(x=>text(x,220,true)),'Altılıqda gizlədilən futbolçular düzgün deyil.');
 }
 const q=v.quiz;if(obj(q)){
  check(Number.isInteger(q.questionLimit)&&q.questionLimit>=1&&q.questionLimit<=20,'Testdə sual sayı 1–20 olmalıdır.');
  if(!Array.isArray(q.questions)||q.questions.length>80)check(false,'Viktorinada ən çox 80 sual ola bilər.');
  else{const ids=new Set();for(const r of q.questions){
   if(!keys(r,['id','team','title','choices','answer','note','published'])){check(false,'Test sualının quruluşu düzgün deyil.');continue;}
   check(id(r.id)&&!ids.has(r.id)&&(r.team===''||id(r.team))&&text(r.title,300,true)&&text(r.note,1000)&&typeof r.published==='boolean','Test sualının adı, komanda və ya statusu düzgün deyil.');ids.add(r.id);
   check(Array.isArray(r.choices)&&r.choices.length>=2&&r.choices.length<=4&&r.choices.every(x=>text(x,200,true))&&new Set(r.choices.map(x=>String(x).trim().toLocaleLowerCase('az'))).size===r.choices.length&&Number.isInteger(r.answer)&&r.answer>=0&&r.answer<r.choices.length,'Sualın fərqli cavablarını və düzgün cavabını seç.');
  }}
 }
 return [...errors,...validateArenaFeatures(v,opts),...validateFanExperiences(v)];
}

export function publicFanZone(value){
 const c={...fanZoneSettings(value),...publicArenaFeatures(value)};c.quiz={...c.quiz,questions:c.quiz.enabled?c.quiz.questions.filter(q=>q.published).map(q=>({...q,choices:[...q.choices]})):[]};return c;
}

export function fanStage(m){
 return m.stage||(/(?:3-cü|üçüncü)\s*(?:yer|lük)/i.test(m.leg||'')?'third-place':/yarım\s*final/i.test(m.leg||'')?'semifinal':/\bfinal\b/i.test(m.leg||'')?'final':'group');
}

export function finalContext(data,value){
 const c=fanZoneSettings(value).final,league=data.league||{},teams=new Map((league.teams||[]).map(t=>[t.id,t]));
 const matches=(league.matches||[]).filter(m=>!m.qualificationPending&&teams.has(m.home)&&teams.has(m.away));
 const choose=(id,stage)=>id?matches.find(m=>m.id===id&&fanStage(m)===stage):matches.filter(m=>fanStage(m)===stage).slice().sort((a,b)=>(b.date||'').localeCompare(a.date||''))[0];
 const match=choose(c.matchId,'final'),thirdPlace=choose(c.thirdPlaceId,'third-place');
 const state=c.state==='auto'?(match?.status==='done'?'completed':match?.status==='live'?'live':'upcoming'):c.state;
 let winner='';
 if(match?.status==='done'){
  if(match.hs!==match.as)winner=match.hs>match.as?match.home:match.away;
  else if(match.penalties&&match.penalties.home!==match.penalties.away)winner=match.penalties.home>match.penalties.away?match.home:match.away;
  else if([match.home,match.away].includes(c.championTeam))winner=c.championTeam;
 }
 const completed=['completed','archived'].includes(state),champion=completed&&winner?teams.get(winner):null;
 const kickoff=match?.date&&match?.time?Date.parse(match.date+'T'+match.time+':00+04:00'):NaN;
 const journey=id=>matches.filter(m=>m.id!==match?.id&&m.status==='done'&&(m.home===id||m.away===id)).slice().sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time));
 const stats=id=>{const a=journey(id);return {played:a.length,wins:a.filter(m=>(m.home===id?m.hs:m.as)>(m.home===id?m.as:m.hs)).length,goals:a.reduce((n,m)=>n+(m.home===id?m.hs:m.as),0),against:a.reduce((n,m)=>n+(m.home===id?m.as:m.hs),0)};};
 return {config:c,match,thirdPlace,state,champion,kickoff,teams,journey,stats};
}

export function fanPlayerKey(team,name){return team+':'+String(name).normalize('NFKC').toLocaleLowerCase('az').replace(/\s+/g,' ').trim();}

export function eligibleFanPlayers(league,value){
 const c=fanZoneSettings(value).lineup,allowed=new Set(c.allowedTeams),hidden=new Set(c.hiddenPlayers);
 return (league.teams||[]).filter(t=>!allowed.size||allowed.has(t.id)).flatMap(t=>(t.players||[]).map(p=>({...p,key:fanPlayerKey(t.id,p.name),team:t.id,teamName:t.name,teamLogo:t.logo,teamColor:t.color}))).filter(p=>!hidden.has(p.key));
}

export function normalizeFanLineup(league,value,selection){
 const c=fanZoneSettings(value).lineup,players=new Map(eligibleFanPlayers(league,value).map(p=>[p.key,p])),seen=new Set(),ids=Array.isArray(selection)?selection:[];
 return Array.from({length:FAN_LINEUP_SIZE},(_,i)=>{const p=players.get(ids[i]);if(!p||seen.has(p.key)||c.strictGoalkeeper&&(i===0?!p.gk:p.gk))return '';seen.add(p.key);return p.key;});
}

export function shuffleFanItems(items,rng=Math.random){
 const a=items.slice();for(let i=a.length-1;i>0;i--){const j=Math.min(i,Math.max(0,Math.floor(rng()*(i+1))));[a[i],a[j]]=[a[j],a[i]];}return a;
}

export function automaticFanQuestions(league,teamId='',lang='az'){
 const teams=league.teams||[],team=teams.find(t=>t.id===teamId),played=(league.matches||[]).filter(m=>m.status==='done'&&!m.qualificationPending&&(!team||m.home===team.id||m.away===team.id)),name=team?.name||'';
 const labels=lang==='en'?['How many clubs are in the league?','How many players are listed for '+name+'?','How many completed matches are recorded for '+name+'?','How many goals has '+name+' scored in completed matches?','What is the highest total score in a completed match involving '+name+'?','How many completed league matches are recorded?','How many goals were scored in completed league matches?','What is the highest total score in a completed league match?','Number of recorded wins for '+name+'?']:lang==='ru'?['Сколько команд участвует в лиге?','Сколько игроков в заявке '+name+'?','Сколько завершённых матчей записано у '+name+'?','Сколько голов забила команда '+name+'?','Сколько голов в самом результативном завершённом матче '+name+'?','Сколько завершённых матчей записано в лиге?','Сколько голов забито в завершённых матчах лиги?','Сколько голов в самом результативном матче лиги?','Сколько побед записано у '+name+'?']:['Liqada neçə komanda iştirak edir?',name+' heyətində neçə futbolçu qeyd olunub?',name+' üçün neçə tamamlanmış oyun qeyd olunub?',name+' tamamlanmış oyunlarda neçə qol vurub?',name+' komandasının ən məhsuldar bitmiş oyununda ümumilikdə neçə qol vurulub?','Liqada neçə tamamlanmış oyun qeyd olunub?','Liqanın tamamlanmış oyunlarında ümumilikdə neçə qol vurulub?','Liqanın ən məhsuldar bitmiş oyununda neçə qol vurulub?',name+' üçün neçə qələbə qeyd olunub?'];
 const numeric=(id,title,n)=>{const choices=[...new Set([n,Math.max(0,n-2),n+3,Math.max(0,n-1),n+1,n+4])].slice(0,4).map(String);return {id:'auto-'+id,team:teamId,title,choices,answer:0,note:'',published:true};};
 const result=[numeric('teams',labels[0],teams.length)];
 if(team){
  result.push(numeric('roster',labels[1],(team.players||[]).length));
  if(played.length)result.push(numeric('team-played',labels[2],played.length),numeric('team-goals',labels[3],played.reduce((n,m)=>n+(m.home===team.id?m.hs:m.as),0)),numeric('team-record',labels[4],Math.max(...played.map(m=>m.hs+m.as))),numeric('team-wins',labels[8],played.filter(m=>(m.home===team.id?m.hs:m.as)>(m.home===team.id?m.as:m.hs)).length));
 }else if(played.length)result.push(numeric('played',labels[5],played.length),numeric('goals',labels[6],played.reduce((n,m)=>n+m.hs+m.as,0)),numeric('record',labels[7],Math.max(...played.map(m=>m.hs+m.as))));
 return result;
}

export function fanQuizQuestions(league,value,teamId='',lang='az',rng=Math.random){
 const c=fanZoneSettings(value).quiz,teamExists=(league.teams||[]).some(t=>t.id===teamId),team=teamExists?teamId:'';
 let pool=c.questions.filter(q=>q.published&&(!q.team||q.team===team)).map(q=>({...q,choices:q.choices.slice()}));
 if(c.autoQuestions)pool=pool.concat(automaticFanQuestions(league,team,lang));
 if(c.shuffle)pool=shuffleFanItems(pool,rng);
 return pool.slice(0,c.questionLimit).map(q=>{const order=shuffleFanItems(q.choices.map((_,i)=>i),rng);return {...q,choices:order.map(i=>q.choices[i]),answer:order.indexOf(q.answer)};});
}

export function fanZoneTargets(value){
 const c=fanZoneSettings(value),rows=[];
 const add=(parent,property,key,label)=>{if(typeof parent[property]==='string'&&parent[property].trim())rows.push({parent,property,key,source:parent[property],label,group:'community'});};
 for(const [section,fields] of Object.entries({center:['title','description'],hall:['title','description'],watch:['title','description','notice'],final:['title','description','archiveTitle','recap','linkLabel'],lineup:['title','description'],quiz:['title','description']}))for(const k of fields)add(c[section],k,'fanZone.'+section+'.'+k,section+' · '+k);
 for(const q of c.quiz.questions){for(const k of ['title','note'])add(q,k,'fanZone.question.'+q.id+'.'+k,'Test · '+q.title);q.choices.forEach((_,i)=>add(q.choices,i,'fanZone.question.'+q.id+'.choice.'+i,'Cavab · '+q.title));}
 rows.push(...arenaLocaleTargets(c));
 return {config:c,rows};
}
export function localizedFanZone(value,locales,lang){
 const {config,rows}=fanZoneTargets(JSON.parse(JSON.stringify(fanZoneSettings(value))));
 if(lang==='az')return config;
 const map=new Map(rows.map(r=>[r.key,r]));
 for(const entry of locales?.[lang]||[]){const r=map.get(entry.key);if(r&&entry.source===r.source&&typeof entry.text==='string'&&entry.text.trim())r.parent[r.property]=entry.text;}
 return config;
}
