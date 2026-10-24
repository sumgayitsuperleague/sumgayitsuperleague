// An isolated, seeded football game. These scores never enter the league record.
export const CLUTCH_MISSIONS=Object.freeze(['equalise','winner','protect']);
export const defaultClutch=()=>({enabled:true,title:'Son 30 saniyə',description:'Bir an. Üç seçim. Oyunun taleyi sənin əlində.',defaultMission:'equalise',missions:[...CLUTCH_MISSIONS],difficulty:'normal',quality:'auto',allowReplay:true,allowShare:true,allowSound:true,showBest:true});
export function validateClutch(value){
 if(value===undefined)return [];
 const d=defaultClutch(),obj=value&&typeof value==='object'&&!Array.isArray(value);
 if(!obj||Object.keys(value).some(k=>!Object.hasOwn(d,k)))return ['Son 30 saniyə: ayarların quruluşu düzgün deyil.'];
 const errors=[],check=(ok,message)=>{if(!ok)errors.push('Son 30 saniyə: '+message);};
 for(const k of ['enabled','allowReplay','allowShare','allowSound','showBest'])check(typeof value[k]==='boolean','görünmə ayarını yoxla.');
 for(const [k,max]of [['title',160],['description',600]])check(typeof value[k]==='string'&&value[k].length<=max&&(k!=='title'||value[k].trim())&&!/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value[k]),'başlıq və təqdimatı yoxla.');
 check(Array.isArray(value.missions)&&value.missions.length>0&&value.missions.length<=3&&new Set(value.missions).size===value.missions.length&&value.missions.every(k=>CLUTCH_MISSIONS.includes(k))&&value.missions.includes(value.defaultMission),'ən azı bir ssenari və həmin siyahıdan əsas ssenari seç.');
 check(['normal','expert'].includes(value.difficulty),'çətinliyi yoxla.');check(['auto','cinematic'].includes(value.quality),'qrafika seçimini yoxla.');return errors;
}
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
const random=n=>{let x=n>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;return {seed:x>>>0,value:(x>>>0)/4294967296};};
const pt=(x,z,y=.19)=>({x,z,y});
const clone=v=>JSON.parse(JSON.stringify(v));
export function clutchSeed(value){const n=Number(value);return Number.isInteger(n)&&n>0&&n<=4294967295?n:1830427;}
export function clutchTeams(teams,home,away){const a=teams.find(t=>t.id===home)||teams[0]||null;return {home:a,away:teams.find(t=>t.id===away&&t.id!==a?.id)||teams.find(t=>t.id!==a?.id)||null};}
export function createClutch({mission='equalise',seed=1830427,difficulty='normal'}={}){
 mission=CLUTCH_MISSIONS.includes(mission)?mission:'equalise';seed=clutchSeed(seed);const r=random(seed),side=r.value<.5?-1:1,high=random(r.seed).value<.5;
 const players=[{id:'h0',side:'home',keeper:true,x:0,z:18},{id:'h1',side:'home',x:-side*3,z:2},{id:'h2',side:'home',x:side*9,z:-7},{id:'h3',side:'home',x:-side*2,z:-10},{id:'h4',side:'home',x:-side*8,z:-3},{id:'h5',side:'home',x:side*3,z:9},{id:'a0',side:'away',keeper:true,x:high?side*.8:0,z:high?-15.8:-18.4},{id:'a1',side:'away',x:high?-side*2:-side*4,z:high?-1:-4},{id:'a2',side:'away',x:side*(high?6.5:9),z:-10.5},{id:'a3',side:'away',x:side*2,z:-13.3},{id:'a4',side:'away',x:-side*7,z:-8},{id:'a5',side:'away',x:-side*1,z:7}];
 if(mission==='protect')for(const p of players)if(!p.keeper){p.z=-p.z;p.x=-p.x;}
 const owner=mission==='protect'?'a1':'h1',p=players.find(p=>p.id===owner);
 return {version:1,seed,rng:r.seed,mission,difficulty:difficulty==='expert'?'expert':'normal',side,high,phase:mission==='protect'?'defend':'build',time:30,score:mission==='equalise'?[0,1]:mission==='winner'?[1,1]:[2,1],players,owner,ball:pt(p.x,p.z-.5),steps:[],result:null,points:0};
}
export function clutchSituation(s){
 if(s.phase==='defend')return s.high?'Rəqib mərkəzdən gəlir. Ötürmə xətti açıqdır.':'Rəqib cinaha yönəlir. Mərkəzi bağlamaq olar.';
 if(s.phase==='contain')return 'Rəqib qapıya yaxınlaşır. Son müdafiə qərarın.';
 if(s.phase==='escape')return 'Topu qazandın. İndi üstünlüyü sona qədər qoru.';
 if(s.phase==='build')return s.high?'Müdafiəçi üstünə gəlir. Cinahda boşluq var.':'Müdafiə dərindədir. Topla irəliləmək üçün yer var.';
 if(s.phase==='create')return s.owner==='h2'?'Cinahdasan. Arxadan gələn yoldaşın cərimə meydançasındadır.':'Mərkəzi keçdin. Müdafiəçi son ötürməni gözləyir.';
 if(s.phase==='finish')return s.high?'Qapıçı irəli çıxıb. Qapının üst hissəsi açıqdır.':'Qapıçı xəttdədir. Uzaq küncü nişan almaq olar.';
 return '';
}
export function clutchChoices(s){
 if(s.result)return [];
 const row=(id,label,detail,risk,kind,cost)=>({id,label,detail,risk,kind,cost});
 if(s.phase==='build')return [row('pass','Cinaha ötür','Boş yoldaşını oyuna qoş.',s.high?'Aşağı':'Orta','pass',9),row('dribble','Rəqibi keç','Topla mərkəzə irəlilə.',s.high?'Yüksək':'Aşağı','carry',10),row('shoot','Uzaqdan vur','Hücumun taleyini bir zərbəyə bağla.','Yüksək','shot',8)];
 if(s.phase==='create')return [row('cutback','Arxaya ötür','Gələn yoldaşına zərbə mövqeyi yarat.',s.owner==='h2'?'Aşağı':'Orta','pass',8),row('carry','Qapıya yaxınlaş','Bucağı yaxşılaşdır, müdafiəçini üstündən at.','Orta','carry',10),row('shoot','İndi zərbə vur','Mövcud mövqedən qapını yoxla.','Yüksək','shot',7)];
 if(s.phase==='finish')return [row('place','Küncə yerləşdir','Dəqiqliklə uzaq küncü hədəflə.',s.high?'Orta':'Aşağı','shot',7),row('chip','Üstündən aşır','İrəli çıxan qapıçının arxasına at.',s.high?'Aşağı':'Yüksək','chip',8),row('power','Güclü vur','Qapıçını zərbənin gücü ilə keç.','Orta','shot',6)];
 if(s.phase==='defend')return [row('press','Pressinq et','Topu rəqibin ayağından almağa çalış.','Yüksək','tackle',10),row('cover','Ötürməni bağla','Topun gedəcəyi yolu qabaqcadan kəs.',s.high?'Aşağı':'Orta','cover',9),row('hold','Geri çəkil','Mərkəzdə kompakt qal.',s.high?'Orta':'Aşağı','cover',10)];
 if(s.phase==='contain')return [row('tackle','Topa müdaxilə et','Qapıya yaxınlaşan rəqibi dayandır.','Yüksək','tackle',10),row('block','Zərbəni bağla','Topla qapı arasına keç.','Orta','cover',9),row('keeper','Qapıçıya güvən','Müdafiə xəttini saxla.','Yüksək','save',10)];
 return [row('safe','Təhlükəsiz ötür','Boş yoldaşına ötür, vaxtı idarə et.','Aşağı','pass',s.time),row('clear','Topu uzaqlaşdır','Təhlükəni qapıdan uzaqlaşdır.','Orta','clear',s.time),row('escape','Topla çıx','Rəqibin pressinqindən topla çıx.','Yüksək','carry',s.time)];
}
export function clutchResolve(source,action){
 const choice=clutchChoices(source).find(c=>c.id===action);if(!choice)return null;
 const before=clone(source),s=clone(source),draw=random(s.rng);s.rng=draw.seed;
 const player=id=>s.players.find(p=>p.id===id),move=(id,x,z)=>Object.assign(player(id),{x,z}),penalty=s.difficulty==='expert'?.12:0;
 let chance=1,terminal='',message='',shot=false,success=true,receiver=s.owner;
 const spend=Math.min(s.time,choice.cost);s.time-=spend;
 if(s.phase==='build'){
  if(action==='pass'){chance=(s.high?.94:.8)-penalty;receiver='h2';move('h2',s.side*8,-8.5);s.phase='create';message='Ötürmə çatdı. Cinahda təhlükə yaratdın.';}
  if(action==='dribble'){chance=(s.high?.58:.91)-penalty;move('h1',-s.side*1,-8);s.phase='create';message='Müdafiəçini keçdin. Qapıya yol açılır.';}
  if(action==='shoot'){chance=(s.high?.34:.22)-penalty*.5;shot=true;}
 }else if(s.phase==='create'){
  if(action==='cutback'){chance=(s.owner==='h2'?.94:.75)-penalty;receiver='h3';move('h3',-s.side*1.8,-13.1);s.phase='finish';message='Son ötürmə yerinə çatdı. Qapı ilə üz-üzəsən.';}
  if(action==='carry'){chance=(s.owner==='h2'?.74:.84)-penalty;move(s.owner,s.side*(s.owner==='h2'?4.8:1),-13.6);s.phase='finish';message='Qapıya yaxınlaşdın. Həlledici zərbəni seç.';}
  if(action==='shoot'){chance=(s.owner==='h2'?.3:.48)-penalty*.5;shot=true;}
 }else if(s.phase==='finish'){
  chance=({place:s.high?.64:.87,chip:s.high?.9:.36,power:.7}[action])-penalty;shot=true;
 }else if(s.phase==='defend'){
  chance=({press:.52,cover:s.high?.91:.7,hold:s.high?.7:.91}[action])-penalty;
  success=draw.value<chance;
  if(success){s.phase='escape';receiver='h4';move('h4',-s.side*5,7);message='Topu qazandın. Son saniyələr sənin nəzarətindədir.';}
  else{s.phase='contain';receiver='a3';move('a3',s.side*1,12.3);message='Rəqib pressinqdən çıxdı. Son müdafiə xəttindəsən.';}
 }else if(s.phase==='contain'){
  chance=({tackle:.54,block:.79,keeper:.46}[action])-penalty;success=draw.value<chance;
  if(success){s.phase='escape';receiver=action==='keeper'?'h0':'h3';move(receiver,s.side*1,14);message=action==='keeper'?'Qapıçı topu saxladı. Üstünlük səndədir.':'Təhlükəni dayandırdın. Topu təhlükəsiz saxla.';}
  else{terminal='conceded';s.score[1]++;message='Rəqib bərabərlik qolunu vurdu.';shot=true;}
 }else{
  chance=({safe:.97,clear:.82,escape:.57}[action])-penalty*.6;success=draw.value<chance;terminal=success?'held':'conceded';
  if(success){receiver=action==='clear'?'h2':'h5';move(receiver,s.side*7,-3);message='Son fit! Üstünlüyü qorudun.';}
  else{s.score[1]++;message='Top itirildi və rəqib son anda hesabı bərabərləşdirdi.';shot=true;}
 }
 chance=clamp(chance,.04,.98);
 if(shot&&!terminal){success=draw.value<chance;terminal=success?'goal':draw.value<Math.min(.96,chance+.23)?'saved':'wide';if(success)s.score[0]++;message=success?'QOL! Həlledici anda düzgün qərar verdin.':terminal==='saved'?'Qapıçı zərbəni saxladı.':'Top qapının yanından keçdi.';}
 if(!shot&&['build','create','finish'].includes(before.phase)){
  success=draw.value<chance;
  if(!success){terminal='lost';message='Müdafiəçi topu aldı. Hücum başa çatdı.';receiver='a1';move('a1',player(before.owner).x,player(before.owner).z-1);}
 }
 if(!terminal&&s.time<=0){terminal=s.mission==='protect'?'held':'time';message='Son fit! Oyun başa çatdı.';}
 s.owner=receiver;
 const target=player(receiver);s.ball=pt(target.x,target.z-.45);
 // Replays keep the exact actor and ball positions that were resolved once here.
 const goalZ=s.mission==='protect'?19:-19,keeper=player(s.mission==='protect'?'h0':'a0');
 if(shot){const goalX=s.side*(terminal==='wide'?4.1:2.1);s.ball=pt(terminal==='saved'?keeper.x:goalX,terminal==='saved'?keeper.z:goalZ+(goalZ<0?-1:1),action==='chip'?1.6:.45);move(keeper.id,terminal==='saved'?s.ball.x:s.side*.7,keeper.z);}
 if(terminal==='held'&&action==='clear')s.ball=pt(s.side*8,-9,.4);
 const terminalSuccess=terminal==='goal'||terminal==='held';
 const awarded=terminal?terminalSuccess?Math.round(760+s.time*5+(before.steps.reduce((n,r)=>n+(r.risk==='Aşağı'?50:25),0))+(s.difficulty==='expert'?120:0)):Math.min(340,source.steps.length*95):0;
 s.points=awarded;if(terminal){s.result={type:terminal,success:terminalSuccess,score:s.score.slice(),points:awarded};s.phase='done';}
 const transition={action,kind:choice.kind,label:choice.label,risk:choice.risk,message,success,terminal,before:{players:before.players,ball:before.ball,owner:before.owner,time:before.time,score:before.score},after:{players:clone(s.players),ball:clone(s.ball),owner:s.owner,time:s.time,score:s.score.slice()},arc:choice.kind==='chip'?4:choice.kind==='clear'?5:shot?1.1:choice.kind==='pass'?.4:.2,duration:shot?2100:1800};
 s.steps.push(transition);return {state:s,transition};
}
export function clutchResultTitle(s){return s.result?.success?s.mission==='equalise'?'Əlavə vaxta apardın!':s.mission==='winner'?'Qələbə qolunu vurdun!':'Üstünlüyü qorudun!':s.result?.type==='conceded'?'Qələbə əldən çıxdı.':'Bu dəfə alınmadı.';}
