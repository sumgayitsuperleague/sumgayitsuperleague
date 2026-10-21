// Public game settings and real-record season chapters. No DOM and no writes.
export const ARENA_PAGES=Object.freeze({'/penalti-arenasi':'penalty'});
export const seasonKey=league=>String(league?.season||'')+':'+(league?.edition||1);
export function defaultArenaFeatures(){return {
 penalty:{enabled:true,showOnHome:true,title:'Penalti arenası',description:'Komandanı seç. SSL Kubokunu və Liqanı fəth et.',difficulty:'normal',defaultMode:'cup',allowPractice:false,allowSound:true,allowReplay:true,allowDuel:false,allowCup:true,allowLeague:true,showSponsors:true,sponsorMotion:true,defaultTeam:'',defaultOpponent:'',duelRounds:5},
 timeline:{enabled:false,showOnHome:false,title:'Mövsümün zaman tuneli',description:'İlk fitdən finala. Bu mövsümün hekayəsini birlikdə yenidən yaşa.',autoMatches:true,cover:'/assets/editorial/ig-pitch.jpg',items:[],hiddenChapters:[]}
};}
export function arenaSettings(value){const d=defaultArenaFeatures(),p={...d.penalty,...value?.penalty};p.defaultMode=p.defaultMode==='league'?'league':'cup';p.allowPractice=false;p.allowDuel=false;p.allowCup=true;p.allowLeague=true;if(p.description==='Küncü seç. Topu sürüşdür. Seriyanı davam etdir.')p.description=d.penalty.description;return {penalty:p,timeline:{...d.timeline,...value?.timeline,enabled:false,showOnHome:false}};}
export function validateArenaFeatures(value,{imagePath}={}){
 const errors=[],obj=x=>x&&typeof x==='object'&&!Array.isArray(x),txt=(x,n,required=false)=>typeof x==='string'&&x.length<=n&&(!required||!!x.trim())&&!/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(x),id=x=>typeof x==='string'&&/^[a-z0-9][a-z0-9_-]{0,79}$/.test(x),image=imagePath||((x)=>x===''||/^\/assets\/(?:logo\.png|(?:editorial|logos)\/[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp))$/.test(x)),check=(p,m)=>{if(!p&&errors.length<20)errors.push(m);},date=s=>s===''||/^\d{4}-\d\d-\d\d$/.test(s)&&Number.isFinite(Date.parse(s+'T12:00:00Z'))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
 const d=defaultArenaFeatures();
 for(const section of ['penalty','timeline']){
  const c=value?.[section];if(c===undefined)continue;
  if(!obj(c)||Object.keys(c).some(k=>!Object.hasOwn(d[section],k))){check(false,'Oyun və zaman tuneli ayarlarının quruluşu düzgün deyil.');continue;}
  check(txt(c.title,160,true)&&txt(c.description,600),section+': başlıq və təqdimat düzgün deyil.');
  for(const k of Object.keys(d[section]).filter(k=>typeof d[section][k]==='boolean'))check(typeof c[k]==='boolean'||section==='penalty'&&['allowDuel','allowCup','allowLeague','showSponsors','sponsorMotion'].includes(k)&&c[k]===undefined,section+': görünmə ayarı düzgün deyil.');
 }
 const p=value?.penalty;if(obj(p)){check(['easy','normal','hard'].includes(p.difficulty),'Penalti çətinliyini seç.');check(['duel','cup','league','streak','practice'].includes(p.defaultMode)&&!(p.defaultMode==='practice'&&!p.allowPractice)&&!(p.defaultMode==='duel'&&p.allowDuel===false)&&!(p.defaultMode==='cup'&&p.allowCup===false)&&!(p.defaultMode==='league'&&p.allowLeague===false),'Penalti oyun rejimi düzgün deyil.');}
 if(obj(p)){for(const k of ['defaultTeam','defaultOpponent'])check(p[k]===undefined||p[k]===''||id(p[k]),'Əsas komanda seçimi düzgün deyil.');check(!p.defaultTeam||!p.defaultOpponent||p.defaultTeam!==p.defaultOpponent,'Komanda və rəqib fərqli olmalıdır.');check(p.duelRounds===undefined||[3,5,7].includes(p.duelRounds),'Oyun üçün 3, 5 və ya 7 zərbə seç.');}
 const t=value?.timeline;if(obj(t)){
  check(image(t.cover),'Zaman tunelinin başlıq şəkli düzgün deyil.');
  check(Array.isArray(t.hiddenChapters)&&t.hiddenChapters.length<=160&&new Set(t.hiddenChapters).size===t.hiddenChapters.length&&t.hiddenChapters.every(x=>txt(x,160,true)),'Gizlədilən fəsillər düzgün deyil.');
  if(!Array.isArray(t.items)||t.items.length>100)check(false,'Zaman tunelində ən çox 100 redaksiya qeydi ola bilər.');
  else{const seen=new Set(),anchors=new Set();for(const q of t.items){
   if(!obj(q)||Object.keys(q).some(k=>!['id','season','anchor','date','title','text','image','caption','matchId','published'].includes(k))){check(false,'Zaman tuneli qeydinin quruluşu düzgün deyil.');continue;}
   check(id(q.id)&&!seen.has(q.id)&&txt(q.season,100,true)&&(q.anchor===''||id(q.anchor))&&date(q.date)&&txt(q.title,160)&&txt(q.text,6000)&&txt(q.caption,300)&&image(q.image)&&(q.matchId===''||id(q.matchId))&&typeof q.published==='boolean','Zaman tunelinin tarixi, mətni və ya şəkli düzgün deyil.');seen.add(q.id);
   if(q.anchor){const key=q.season+':'+q.anchor;check(!anchors.has(key),'Eyni fəsil üçün təkrarlanan qeyd var.');anchors.add(key);}
   check(!!q.anchor||!!q.date&&typeof q.title==='string'&&!!q.title.trim(),'Ayrıca hekayə üçün tarix və başlıq daxil et.');
  }}
 }
 return errors;
}
export function publicArenaFeatures(value){const c=arenaSettings(value);c.timeline={...c.timeline,items:[]};return c;}
export function arenaLocaleTargets(value){
 const rows=[];for(const section of ['penalty'])for(const property of ['title','description'])if(value?.[section]?.[property])rows.push({parent:value[section],property,key:'fanZone.'+section+'.'+property,source:value[section][property],label:section+' · '+property,group:'community'});
 return rows;
}
const ordinal=n=>n+'-'+({1:'ci',2:'ci',3:'cü',4:'cü',5:'ci',6:'cı',7:'ci',8:'ci',9:'cu'}[n%10]||'cu');
const stage=m=>m.stage||(/yarım\s*final/i.test(m.leg||'')?'semifinal':/(3-cü|üçüncü)/i.test(m.leg||'')?'third-place':/final/i.test(m.leg||'')?'final':'group');
export function timelineChapters(data,value,{includeHidden=false,includeDrafts=false}={}){
 const c=arenaSettings(value).timeline,league=data.league||{},key=seasonKey(league),clubs=new Set((league.teams||[]).map(t=>t.id)),matches=(league.matches||[]).filter(m=>!m.qualificationPending&&clubs.has(m.home)&&clubs.has(m.away)),chapters=[];
 const sorted=a=>a.slice().sort((a,b)=>(a.date||'9999').localeCompare(b.date||'9999')||(a.time||'').localeCompare(b.time||'')||a.id.localeCompare(b.id));
 if(c.autoMatches&&matches.length){
  const first=sorted(matches.filter(m=>m.date))[0];
  if(first)chapters.push({id:'opening',kind:'opening',title:'İlk fit',text:'',image:'',caption:'',date:first.date,matches:[first],sort:first.date+' 00'});
  const groups=new Map();for(const m of matches){const s=stage(m),id=s==='group'?'round-'+m.round:s;const row=groups.get(id)||{id,kind:s,title:s==='group'?ordinal(m.round)+' tur':s==='semifinal'?'Yarımfinal':s==='third-place'?'Üçüncülük oyunu':'Final',round:m.round,text:'',image:'',caption:'',matches:[],date:'',sort:''};row.matches.push(m);groups.set(id,row);}
  for(const row of groups.values()){row.matches=sorted(row.matches);row.date=row.matches.find(m=>m.date)?.date||'';row.sort=(row.date||'9999')+' '+({group:'30',semifinal:'50','third-place':'80',final:'90'}[row.kind]);chapters.push(row);}
 }
 for(const item of c.items.filter(x=>x.season===key&&(includeDrafts||x.published))){
  if(item.anchor){const row=chapters.find(x=>x.id===item.anchor);if(row){for(const k of ['title','text','image','caption'])if(item[k])row[k]=item[k];row.editorId=item.id;}}
  else{const linked=matches.find(m=>m.id===item.matchId);chapters.push({...item,kind:'story',matches:linked?[linked]:[],sort:item.date+' 40'});}
 }
 if(c.autoMatches)for(const ch of chapters){
  const article=(data.news||[]).find(n=>n.published&&(ch.kind==='group'?n.id==='ssl-round'+ch.round+'-'+league.season:ch.kind==='opening'?n.id==='ssl-season-'+league.season:false));
  if(article&&!ch.editorId){if(article.image&&/^\/assets\/(?:editorial|logos)\/[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp)$/.test(article.image))ch.image=article.image;ch.text=article.text||'';ch.caption=article.imageCredit||'';}
 }
 chapters.sort((a,b)=>a.sort.localeCompare(b.sort)||a.id.localeCompare(b.id));
 return chapters.map(ch=>({...ch,hidden:c.hiddenChapters.includes(key+':'+ch.id)})).filter(ch=>includeHidden||!ch.hidden);
}

// Club and sponsor choices always come from the current organizer data.
export function arenaTeams(data){
 const seen=new Set();return (data.league?.teams||[]).filter(q=>q&&typeof q.id==='string'&&/^[a-z0-9][a-z0-9_-]{0,79}$/.test(q.id)&&!seen.has(q.id)&&seen.add(q.id)).map(q=>({id:q.id,name:String(q.name||q.id),code:String(q.code||q.name||q.id).slice(0,8),color:/^#[a-f0-9]{6}$/i.test(q.color||'')?q.color:'#2455ba',logo:/^[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp)$/.test(q.logo||'')?'/assets/logos/'+q.logo:'/assets/logo.png'}));
}
export function chooseArenaClubs(data,home='',away=''){
 const teams=arenaTeams(data),a=teams.find(q=>q.id===home)||teams[0]||null,b=teams.find(q=>q.id===away&&q.id!==a?.id)||teams.find(q=>q.id!==a?.id)||null;return {teams,home:a,away:b};
}
export function arenaSponsors(data,value){
 const c=arenaSettings(value).penalty,s=data.cms?.sponsors;if(!c.showSponsors||!s?.enabled)return [];
 return (s.items||[]).filter(q=>q.visible&&/^\/assets\/(?:logos|editorial)\/[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp)$/.test(q.logo||'')).map(q=>({...q,url:/^https:\/\//.test(q.url||'')?q.url:'/sponsorlar'}));
}
export const createDuel=(rounds=5)=>({rounds:[3,5,7].includes(rounds)?rounds:5,home:[],away:[],winner:null});
export function duelStatus(s,{allowDraw=false}={}){
 const home=s.home.filter(q=>q==='goal').length,away=s.away.filter(q=>q==='goal').length,n=s.rounds,paired=s.home.length===s.away.length;
 let winner=null;if(s.home.length>=n&&s.away.length>=n){if(paired&&(home!==away||allowDraw))winner=home===away?'draw':home>away?'home':'away';}
 else if(home>away+Math.max(0,n-s.away.length))winner='home';else if(away>home+Math.max(0,n-s.home.length))winner='away';
 return {home,away,winner,turn:paired?'home':'away',suddenDeath:s.home.length>=n&&s.away.length>=n&&!winner,round:Math.min(s.home.length,s.away.length)+1};
}
export function recordDuelKick(s,side,result,options={}){
 const state=duelStatus(s,options);if(state.winner||state.turn!==side||!['goal','save','post','miss'].includes(result))return s;
 const next={...s,home:[...s.home],away:[...s.away]};next[side].push(result);next.winner=duelStatus(next,options).winner;return next;
}

// A local, seeded eight-club cup. Organizer fixtures and league results are untouched.
export function createArenaCup(teams,homeId,rivalId,seed=1){
 const ids=[...new Set(teams.map(q=>q.id))];if(ids.length<8||!ids.includes(homeId))return null;
 let state=seed>>>0||1;const rng=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
 const others=ids.filter(id=>id!==homeId&&id!==rivalId);for(let i=others.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[others[i],others[j]]=[others[j],others[i]];}
 const lineup=[homeId,...(ids.includes(rivalId)&&rivalId!==homeId?[rivalId]:[]),...others].slice(0,8);
 return {homeId,seed:seed>>>0,round:0,rounds:[Array.from({length:4},(_,i)=>({home:lineup[i*2],away:lineup[i*2+1],homeScore:null,awayScore:null,winner:null})),[],[]],eliminated:false,champion:null};
}
export function cupOpponent(cup){const m=cup?.rounds[cup.round]?.find(q=>q.home===cup.homeId||q.away===cup.homeId);return m?(m.home===cup.homeId?m.away:m.home):null;}
export function advanceArenaCup(cup,duel){
 const status=duelStatus(duel);if(!cup||cup.champion||cup.eliminated||!status.winner)return cup;
 const current=cup.rounds[cup.round],own=current.find(q=>q.home===cup.homeId||q.away===cup.homeId);if(!own||own.winner)return cup;
 let seed=(cup.seed+cup.round*7919)>>>0;const rng=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 const rounds=cup.rounds.map(r=>r.map(m=>({...m}))),matches=rounds[cup.round];
 for(const match of matches){if(match.home===cup.homeId||match.away===cup.homeId){const atHome=match.home===cup.homeId;match.homeScore=atHome?status.home:status.away;match.awayScore=atHome?status.away:status.home;match.winner=status.winner==='home'?cup.homeId:(atHome?match.away:match.home);}else{let s=createDuel(5);for(let i=0;!duelStatus(s).winner&&i<80;i++){const turn=duelStatus(s).turn;s=recordDuelKick(s,turn,i>60?(turn==='home'?'goal':'miss'):rng()<.76?'goal':'miss');}const result=duelStatus(s);match.homeScore=result.home;match.awayScore=result.away;match.winner=result.winner==='home'?match.home:match.away;}}
 const winners=matches.map(m=>m.winner),won=status.winner==='home',final=cup.round===2;
 if(!final)rounds[cup.round+1]=Array.from({length:winners.length/2},(_,i)=>({home:winners[i*2],away:winners[i*2+1],homeScore:null,awayScore:null,winner:null}));
 return {...cup,rounds,round:won&&!final?cup.round+1:cup.round,eliminated:!won,champion:final?winners[0]:null};
}

// Eight clubs, one match per pairing, seven rounds. This is an on-device game season.
export function createArenaLeague(teams,homeId,rivalId,seed=1){
 const cup=createArenaCup(teams,homeId,rivalId,seed);if(!cup)return null;
 const ids=cup.rounds[0].flatMap(m=>[m.home,m.away]),ring=[ids[0],...ids.slice(2),ids[1]],rounds=[];
 for(let r=0;r<7;r++){rounds.push(Array.from({length:4},(_,i)=>{const a=ring[i],b=ring[7-i];return {home:(r+i)%2?b:a,away:(r+i)%2?a:b,homeScore:null,awayScore:null,winner:null};}));ring.splice(1,0,ring.pop());}
 return {homeId,teamIds:ids,seed:seed>>>0,round:0,rounds,complete:false,champions:[]};
}
export function leagueOpponent(league){const m=league?.rounds[league.round]?.find(q=>q.home===league.homeId||q.away===league.homeId);return m?(m.home===league.homeId?m.away:m.home):null;}
export function arenaLeagueTable(league){
 const rows=new Map(league.teamIds.map(id=>[id,{id,played:0,won:0,drawn:0,lost:0,for:0,against:0,difference:0,points:0}]));
 for(const m of league.rounds.flat()){if(m.homeScore===null||m.awayScore===null)continue;const a=rows.get(m.home),b=rows.get(m.away);a.played++;b.played++;a.for+=m.homeScore;a.against+=m.awayScore;b.for+=m.awayScore;b.against+=m.homeScore;if(m.homeScore===m.awayScore){a.drawn++;b.drawn++;a.points++;b.points++;}else{const winner=m.homeScore>m.awayScore?a:b,loser=winner===a?b:a;winner.won++;winner.points+=3;loser.lost++;}}
 const compare=(a,b)=>b.points-a.points||b.difference-a.difference||b.for-a.for||b.won-a.won;
 const sorted=[...rows.values()].map(q=>({...q,difference:q.for-q.against})).sort((a,b)=>compare(a,b)||a.id.localeCompare(b.id));
 for(let i=0;i<sorted.length;i++)sorted[i].rank=i&&compare(sorted[i-1],sorted[i])===0?sorted[i-1].rank:i+1;return sorted;
}
export function advanceArenaLeague(league,duel){
 const status=duelStatus(duel,{allowDraw:true});if(!league||league.complete||!status.winner)return league;
 const own=league.rounds[league.round]?.find(q=>q.home===league.homeId||q.away===league.homeId);if(!own||own.winner)return league;
 let seed=(league.seed+league.round*7919)>>>0;const rng=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296),rounds=league.rounds.map(r=>r.map(m=>({...m})));
 for(const m of rounds[league.round]){if(m.home===league.homeId||m.away===league.homeId){const atHome=m.home===league.homeId;m.homeScore=atHome?status.home:status.away;m.awayScore=atHome?status.away:status.home;}else{m.homeScore=0;m.awayScore=0;for(let i=0;i<duel.rounds;i++){if(rng()<.75)m.homeScore++;if(rng()<.75)m.awayScore++;}}m.winner=m.homeScore===m.awayScore?'draw':m.homeScore>m.awayScore?m.home:m.away;}
 const complete=league.round===6,next={...league,rounds,round:complete?6:league.round+1,complete,champions:[]};if(complete)next.champions=arenaLeagueTable(next).filter(q=>q.rank===1).map(q=>q.id);return next;
}
// Only complete matchdays can be resumed; rebuild the schedule from current clubs.
export function restoreArenaLeague(value,teams,homeId){
 if(!value||value.homeId!==homeId||!Array.isArray(value.teamIds)||value.teamIds.length!==8||!Number.isInteger(value.seed)||value.seed<0||value.seed>4294967295)return null;
 const fresh=createArenaLeague(teams,homeId,value.teamIds[1],value.seed);if(!fresh||JSON.stringify(fresh.teamIds)!==JSON.stringify(value.teamIds)||!Array.isArray(value.rounds)||value.rounds.length!==7)return null;
 let completed=0,emptySeen=false;
 for(let r=0;r<7;r++){if(!Array.isArray(value.rounds[r])||value.rounds[r].length!==4)return null;let played=0;
  for(let i=0;i<4;i++){const raw=value.rounds[r][i],expected=fresh.rounds[r][i];if(!raw||raw.home!==expected.home||raw.away!==expected.away)return null;const a=raw.homeScore,b=raw.awayScore;if(a===null&&b===null)continue;if(![a,b].every(n=>Number.isInteger(n)&&n>=0&&n<=7))return null;played++;Object.assign(expected,{homeScore:a,awayScore:b,winner:a===b?'draw':a>b?expected.home:expected.away});}
  if(played!==0&&played!==4||played&&emptySeen)return null;if(played)completed++;else emptySeen=true;
 }
 fresh.round=Math.min(6,completed);fresh.complete=completed===7;if(fresh.complete)fresh.champions=arenaLeagueTable(fresh).filter(q=>q.rank===1).map(q=>q.id);return fresh;
}
