/* Sumqayıt Super Liqa — nəticə mətni analizatoru (admin.html və build skripti üçün) */
(function(g){
const MONTHS={yanvar:1,fevral:2,mart:3,aprel:4,may:5,iyun:6,iyul:7,avqust:8,sentyabr:9,oktyabr:10,noyabr:11,dekabr:12};
const clean=s=>String(s||'').replace(/[\u200b-\u200f\u2060\ufeff]/g,'').replace(/\s+/g,' ').trim();
const norm=s=>clean(s).normalize('NFC').toLocaleUpperCase('az');
function parseResults(text,teams){
  const code2id={};teams.forEach(t=>code2id[norm(t.code)]=t.id);
  const isCode=s=>code2id[norm(s)]!==undefined;
  const lines=String(text||'').split(/\r?\n/).map(clean).filter(Boolean);
  const out=[],warn=[];let round=null,leg='',cur=null;
  const teamOf=s=>{const m=[...String(s).matchAll(/\(([^)]*)\)/g)].map(x=>x[1]).filter(isCode);return m.length?code2id[norm(m[m.length-1])]:null};
  const nameOf=s=>clean(String(s).replace(/\([^)]*\)/g,' ').replace(/[🟨🟥⚽★]/gu,' '));
  for(let i=0;i<lines.length;i++){
    const l=lines[i];let m;
    if((m=l.match(/^(\d+)\s*-\s*c[iıuü]\s*tur$/i))){round=+m[1];cur=null;continue}
    if(/d[öo]vr/i.test(l)&&l.length<40){leg=l;cur=null;continue}
    if(isCode(l)&&lines[i+2]&&isCode(lines[i+2])&&lines[i+4]&&(/^vs$/i.test(lines[i+4])||/^\d+\s*[—–-]\s*\d+$/.test(lines[i+4]))){
      const sc=lines[i+4].match(/^(\d+)\s*[—–-]\s*(\d+)$/),dm=(lines[i+5]||'').match(/^(\d{1,2})\s+(\S+)\s+(\d{4})$/);
      const mon=dm?MONTHS[dm[2].toLocaleLowerCase('az')]:0;
      if(!dm||!mon)warn.push('Tarix oxunmadı: '+lines[i+5]);
      cur={id:'',round:round||0,leg,date:dm&&mon?`${dm[3]}-${String(mon).padStart(2,'0')}-${String(dm[1]).padStart(2,'0')}`:'',time:lines[i+6]||'',home:code2id[norm(l)],away:code2id[norm(lines[i+2])],hs:sc?+sc[1]:null,as:sc?+sc[2]:null,venue:lines[i+7]||'',status:sc?'done':'planned',goals:[],cards:[],mvp:null};
      cur.id=`r${cur.round}-${cur.home}-${cur.away}`;out.push(cur);i+=8;continue}
    if(!cur)continue;
    if((m=l.match(/^Qollar\s*:\s*(.*)$/i))){m[1].split(/,\s+/).filter(Boolean).forEach(it=>{const t=teamOf(it);if(!t){warn.push('Qolun komandası tapılmadı: '+it);return}cur.goals.push({p:nameOf(it),t,og:/öz\s*qap/i.test(it)||undefined})})}
    else if((m=l.match(/^Kartlar\s*:\s*(.*)$/i))){m[1].split(/,\s+/).filter(Boolean).forEach(it=>{const t=teamOf(it);if(!t){warn.push('Kartın komandası tapılmadı: '+it);return}cur.cards.push({p:nameOf(it),t,c:/🟥/u.test(it)?'r':'y'})})}
    else if((m=l.match(/^Ən yaxşı oyunçu\s*:\s*(.*)$/i))){const t=teamOf(m[1]);if(t)cur.mvp={p:nameOf(m[1]),t}}
  }
  // yoxlama: qolların cəmi hesabla uyğun gəlirmi
  out.forEach(x=>{if(x.status!=='done')return;let h=0,a=0;x.goals.forEach(q=>{const credit=q.og?(q.t===x.home?x.away:x.home):q.t;credit===x.home?h++:a++});
    if(h<x.hs||a<x.as){const miss=(x.hs-h)+(x.as-a);for(let k=0;k<(x.hs-h);k++)x.goals.push({p:'',t:x.home,unk:true});for(let k=0;k<(x.as-a);k++)x.goals.push({p:'',t:x.away,unk:true});warn.push(`${x.id}: ${miss} qolun müəllifi yazılmayıb (hesab ${x.hs}-${x.as}, siyahıda ${h}-${a})`)}
    else if(h>x.hs||a>x.as)warn.push(`${x.id}: qolların sayı hesabdan çoxdur (hesab ${x.hs}-${x.as}, siyahıda ${h}-${a})`)});
  return{matches:out,warnings:warn}}
function mergeMatches(old,add){const map=new Map(old.map(m=>[m.id,m]));add.forEach(m=>map.set(m.id,m));return[...map.values()].sort((a,b)=>a.round-b.round||(a.date+a.time).localeCompare(b.date+b.time))}
g.LeagueParser={parseResults,mergeMatches,norm};
if(typeof module!=='undefined')module.exports=g.LeagueParser;
})(typeof window!=='undefined'?window:globalThis);
