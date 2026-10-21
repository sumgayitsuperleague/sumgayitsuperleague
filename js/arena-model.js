// Public game settings and real-record season chapters. No DOM and no writes.
export const ARENA_PAGES=Object.freeze({'/penalti-arenasi':'penalty','/zaman-tuneli':'timeline'});
export const seasonKey=league=>String(league?.season||'')+':'+(league?.edition||1);
export function defaultArenaFeatures(){return {
 penalty:{enabled:true,showOnHome:true,title:'Penalti arenası',description:'Küncü seç. Topu sürüşdür. Seriyanı davam etdir.',difficulty:'normal',defaultMode:'streak',allowPractice:true,allowSound:true,allowReplay:true},
 timeline:{enabled:true,showOnHome:true,title:'Mövsümün zaman tuneli',description:'İlk fitdən finala. Bu mövsümün hekayəsini birlikdə yenidən yaşa.',autoMatches:true,cover:'/assets/editorial/ig-pitch.jpg',items:[],hiddenChapters:[]}
};}
export function arenaSettings(value){const d=defaultArenaFeatures();return {penalty:{...d.penalty,...value?.penalty},timeline:{...d.timeline,...value?.timeline}};}
export function validateArenaFeatures(value,{imagePath}={}){
 const errors=[],obj=x=>x&&typeof x==='object'&&!Array.isArray(x),txt=(x,n,required=false)=>typeof x==='string'&&x.length<=n&&(!required||!!x.trim())&&!/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(x),id=x=>typeof x==='string'&&/^[a-z0-9][a-z0-9_-]{0,79}$/.test(x),image=imagePath||((x)=>x===''||/^\/assets\/(?:logo\.png|(?:editorial|logos)\/[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp))$/.test(x)),check=(p,m)=>{if(!p&&errors.length<20)errors.push(m);},date=s=>s===''||/^\d{4}-\d\d-\d\d$/.test(s)&&Number.isFinite(Date.parse(s+'T12:00:00Z'))&&new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
 const d=defaultArenaFeatures();
 for(const section of ['penalty','timeline']){
  const c=value?.[section];if(c===undefined)continue;
  if(!obj(c)||Object.keys(c).some(k=>!Object.hasOwn(d[section],k))){check(false,'Oyun və zaman tuneli ayarlarının quruluşu düzgün deyil.');continue;}
  check(txt(c.title,160,true)&&txt(c.description,600),section+': başlıq və təqdimat düzgün deyil.');
  for(const k of Object.keys(d[section]).filter(k=>typeof d[section][k]==='boolean'))check(typeof c[k]==='boolean',section+': görünmə ayarı düzgün deyil.');
 }
 const p=value?.penalty;if(obj(p)){check(['easy','normal','hard'].includes(p.difficulty),'Penalti çətinliyini seç.');check(['streak','practice'].includes(p.defaultMode)&&!(p.defaultMode==='practice'&&!p.allowPractice),'Penalti oyun rejimi düzgün deyil.');}
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
export function publicArenaFeatures(value){const c=arenaSettings(value);c.timeline={...c.timeline,items:c.timeline.enabled?c.timeline.items.filter(x=>x.published).map(x=>({...x})):[]};return c;}
export function arenaLocaleTargets(value){
 const rows=[];for(const section of ['penalty','timeline'])for(const property of ['title','description'])if(value?.[section]?.[property])rows.push({parent:value[section],property,key:'fanZone.'+section+'.'+property,source:value[section][property],label:section+' · '+property,group:'community'});
 for(const item of value?.timeline?.items||[])for(const property of ['title','text','caption'])if(item[property])rows.push({parent:item,property,key:'fanZone.timeline.item.'+item.id+'.'+property,source:item[property],label:'Zaman tuneli · '+(item.title||item.anchor),group:'community'});
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
