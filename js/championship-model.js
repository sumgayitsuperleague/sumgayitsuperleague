import {matchStage,matchWinner,standings} from './league-source.js';

export const CHAMPIONSHIP_DEFAULTS=Object.freeze({enabled:true,title:'Komandam necə çempion olar?',description:'Hesabları dəyiş. Qrupları yenidən sırala. Komandanı kuboka apar.',allowShare:true});
export const championshipSettings=value=>({...CHAMPIONSHIP_DEFAULTS,...value});
const score=n=>Number.isInteger(n)&&n>=0&&n<=99;
const pair=p=>Array.isArray(p)&&p.length===2&&p.every(n=>n===null||score(n));
const obj=v=>v&&typeof v==='object'&&!Array.isArray(v);
const key=m=>[m.id,m.home,m.away,m.round].join(':');
export const groupGames=league=>league.matches.filter(m=>matchStage(m)==='group'&&league.teams.some(t=>t.id===m.home)&&league.teams.some(t=>t.id===m.away));
export function scenarioKey(league){let h=2166136261;for(const c of JSON.stringify([league.season,league.teams.map(t=>[t.id,t.group]),groupGames(league).map(key)])){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return (h>>>0).toString(36);}
export function newScenario(league){return {v:1,key:scenarioKey(league),team:league.teams[0]?.id||'',scores:{},knockout:{},ties:{},replay:false};}
export function normalizeScenario(league,value){
 const base=newScenario(league);if(!obj(value)||value.v!==1||value.key!==base.key)return base;
 if(league.teams.some(t=>t.id===value.team))base.team=value.team;
 const ids=new Set(groupGames(league).map(m=>m.id));
 if(obj(value.scores))for(const [id,p] of Object.entries(value.scores).slice(0,256))if(ids.has(id)&&pair(p))base.scores[id]=[...p];
 if(obj(value.knockout))for(const [id,p] of Object.entries(value.knockout).slice(0,64))if(/^(semi-[12]|final|third)\|[a-z0-9_-]+\|[a-z0-9_-]+$/.test(id)&&obj(p)&&pair(p.score)&&(!p.winner||league.teams.some(t=>t.id===p.winner)))base.knockout[id]={score:[...p.score],winner:p.winner||''};
 if(obj(value.ties))for(const [id,order] of Object.entries(value.ties).slice(0,64))if(/^[a-zA-Z0-9_-]{1,20}:[a-z0-9]+$/.test(id)&&Array.isArray(order)&&order.length<=64&&order.every(x=>league.teams.some(t=>t.id===x))&&new Set(order).size===order.length)base.ties[id]=[...order];
 base.replay=value.replay===true;return base;
}
export function groupScore(match,state){return state.scores[match.id]||(['done','live'].includes(match.status)&&score(match.hs)&&score(match.as)?[match.hs,match.as]:[null,null]);}
const complete=p=>p.every(score);
const hash=text=>{let n=5381;for(const c of text)n=Math.imul(n,33)^c.charCodeAt(0);return(n>>>0).toString(36);};
export function scenarioGroups(league,state){
 const games=groupGames(league).map(m=>{const p=groupScore(m,state);return {...m,hs:p[0],as:p[1],status:complete(p)?'done':'planned'};}),copy={...league,matches:games};
 return [...new Set(league.teams.map(t=>t.group))].sort().map(group=>{
  const rows=standings(copy,group),ids=new Set(rows.map(r=>r.id)),mine=games.filter(m=>ids.has(m.home)&&ids.has(m.away)),ties=[];
  const sporting=r=>[r.x,r.tf,r.vq,-r.bq,r.q].join('|');
  for(let i=0;i<rows.length;){let end=i+1;while(end<rows.length&&sporting(rows[i])===sporting(rows[end]))end++;
   const block=rows.slice(i,end),tiedIds=new Set(block.map(r=>r.id)),mini=new Map(block.map(r=>[r.id,[0,0,0]]));
   for(const m of mine.filter(m=>m.status==='done'&&tiedIds.has(m.home)&&tiedIds.has(m.away))){const a=mini.get(m.home),b=mini.get(m.away);a[0]+=m.hs>m.as?3:m.hs===m.as?1:0;b[0]+=m.as>m.hs?3:m.hs===m.as?1:0;a[1]+=m.hs-m.as;b[1]+=m.as-m.hs;a[2]+=m.hs;b[2]+=m.as;}
   for(let j=0;j<block.length;){let k=j+1;while(k<block.length&&mini.get(block[j].id).join()===mini.get(block[k].id).join())k++;
    if(k-j>1){const original=block.slice(j,k).map(r=>r.id),token=group+':'+hash(JSON.stringify([original.slice().sort(),sporting(block[j]),original.map(id=>mini.get(id))])),saved=state.ties[token],valid=Array.isArray(saved)&&saved.length===original.length&&saved.every(id=>original.includes(id));
     if(valid){const sorted=saved.map(id=>block.slice(j,k).find(r=>r.id===id));rows.splice(i+j,k-j,...sorted);}
     ties.push({token,ids:valid?[...saved]:original,confirmed:valid,ranks:Array.from({length:k-j},(_,n)=>i+j+n+1)});
    }j=k;
   }i=end;
  }
  rows.forEach((r,i)=>r.rank=i+1);const played=mine.filter(m=>m.status==='done').length,finished=mine.length>0&&played===mine.length;
  return {group,rows,games:mine,played,total:mine.length,complete:finished,ties,ready:finished&&!ties.some(t=>!t.confirmed&&t.ranks.some(rank=>rank<=2))};
 });
}
function knockoutGame(league,state,slot,home,away){
 const signature=slot+'|'+home+'|'+away,manual=state.knockout[signature],stage=slot.startsWith('semi')?'semifinal':slot==='third'?'third-place':'final';
 const original=!state.replay?league.matches.find(m=>!m.qualificationPending&&matchStage(m)===stage&&([m.home,m.away].includes(home)&&[m.home,m.away].includes(away))):null;
 let p=[null,null],winner='';
 if(manual){p=manual.score;winner=manual.winner;}
 else if(original&&['done','live'].includes(original.status)){p=original.home===home?[original.hs,original.as]:[original.as,original.hs];winner=matchWinner(original)||'';}
 if(!complete(p))winner='';else if(p[0]!==p[1])winner=p[0]>p[1]?home:away;else if(![home,away].includes(winner))winner='';
 return {slot,signature,home,away,score:[...p],winner,loser:winner?(winner===home?away:home):'',draw:complete(p)&&p[0]===p[1],original:original?{home:original.home===home?original.hs:original.as,away:original.home===home?original.as:original.hs,status:original.status}:null};
}
export function championship(league,raw){
 const state=normalizeScenario(league,raw),groups=scenarioGroups(league,state),groupsReady=groups.length===2&&groups.every(g=>g.ready);
 let semis=[],final=null,third=null;
 if(groupsReady){const [a,b]=groups;semis=[knockoutGame(league,state,'semi-1',a.rows[0].id,b.rows[1].id),knockoutGame(league,state,'semi-2',b.rows[0].id,a.rows[1].id)];
  if(semis.every(m=>m.winner)){final=knockoutGame(league,state,'final',semis[0].winner,semis[1].winner);third=knockoutGame(league,state,'third',semis[0].loser,semis[1].loser);}
 }
 const selected=groups.find(g=>g.rows.some(r=>r.id===state.team)),row=selected?.rows.find(r=>r.id===state.team),semi=semis.find(m=>[m.home,m.away].includes(state.team)),out=selected?.ready&&row.rank>2||semi?.winner&&semi.winner!==state.team||final?.winner&&final.winner!==state.team&&[final.home,final.away].includes(state.team);
 const official=league.teams.some(t=>t.id===state.team)?standings(league,league.teams.find(t=>t.id===state.team).group).find(r=>r.id===state.team):null;
 const changed=groupGames(league).filter(m=>{const p=groupScore(m,state),q=groupScore(m,{scores:{}});return p[0]!==q[0]||p[1]!==q[1];}).length;
 return {state,groups,groupsReady,semis,final,third,champion:final?.winner||'',selected:row?{...row,group:selected.group,remaining:selected.games.filter(m=>m.status!=='done'&&[m.home,m.away].includes(state.team)).length,maximum:row.x+selected.games.filter(m=>m.status!=='done'&&[m.home,m.away].includes(state.team)).length*3,rankDelta:(official?.rank||row.rank)-row.rank,pointDelta:row.x-(official?.x||0),out:!!out,qualified:groupsReady&&row.rank<=2,finalist:!!semi?.winner&&semi.winner===state.team}:null,changed,missing:groups.reduce((n,g)=>n+g.total-g.played,0)};
}
export function replayFrom(league,state,round){const next=normalizeScenario(league,state);next.scores={};next.knockout={};next.ties={};next.replay=true;for(const m of groupGames(league))if(m.round>round)next.scores[m.id]=[null,null];return next;}
export function championExample(league,raw){
 const next=normalizeScenario(league,raw);next.replay=true;next.knockout={};next.ties={};
 for(const m of groupGames(league)){const p=groupScore(m,next);if(m.home===next.team)next.scores[m.id]=[3,0];else if(m.away===next.team)next.scores[m.id]=[0,3];else if(!complete(p))next.scores[m.id]=[2,1];}
 let model=championship(league,next);
 // A deliberately constructed example, never a forecast. A final unresolved
 // sporting tie is explicitly recorded as a simulated draw order.
 for(const g of model.groups)for(const tie of g.ties)if(!tie.confirmed)next.ties[tie.token]=[...tie.ids];
 model=championship(league,next);for(const m of model.semis)next.knockout[m.signature]={score:m.home===next.team?[3,1]:m.away===next.team?[1,3]:[2,1],winner:''};
 model=championship(league,next);if(model.final)next.knockout[model.final.signature]={score:model.final.home===next.team?[3,1]:[1,3],winner:''};return next;
}
export function encodeScenario(league,state){
 const snapshot=normalizeScenario(league,state),model=championship(league,snapshot);
 for(const m of groupGames(league))snapshot.scores[m.id]=[...groupScore(m,snapshot)];
 for(const m of [...model.semis,model.final,model.third].filter(Boolean))snapshot.knockout[m.signature]={score:[...m.score],winner:m.winner};
 // A shared scenario is a snapshot: later official result edits cannot change it.
 snapshot.replay=true;return encodeURIComponent(JSON.stringify(snapshot));
}
export function decodeScenario(league,encoded){try{if(typeof encoded!=='string'||encoded.length>24000)return null;const raw=JSON.parse(decodeURIComponent(encoded));if(raw?.v!==1||raw.key!==scenarioKey(league))return null;return normalizeScenario(league,raw);}catch{return null;}}
