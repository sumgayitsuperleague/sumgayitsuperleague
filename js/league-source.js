// Football calculations have one shared, deterministic source.
export const playerName=s=>String(s||'').normalize('NFC').replace(/\s*\((?:kapitan|qk|v\s*\/\s*k)\)\s*/gi,' ').replace(/\s+/g,' ').trim();
export const ordinal=value=>{const n=Number(value),last=n%10;const suffix=last?({1:'ci',2:'ci',3:'cü',4:'cü',5:'ci',6:'cı',7:'ci',8:'ci',9:'cu'})[last]:({10:'cu',20:'ci',30:'cu',40:'cı',50:'ci',60:'cı',70:'ci',80:'ci',90:'cı'})[n%100]||'cü';return n+'-'+suffix;};
export const playerKey=s=>playerName(s).toLocaleLowerCase('az').split(' ').sort().join(' ');
export function matchStage(m){return m.stage||(/yarımfinal/i.test(m.leg||'')?'semifinal':/\bfinal\b/i.test(m.leg||'')?'final':'group');}
export const creditedTeam=(m,g)=>g.og?(g.t===m.home?m.away:m.home):g.t;
export function standings(league,group) {
  const teams=league.teams.filter(t=>t.group===group),by=new Map(teams.map(t=>[t.id,{id:t.id,o:0,q:0,h:0,m:0,vq:0,bq:0}]));
  const matches=league.matches.filter(m=>m.status==='done'&&matchStage(m)==='group');
  for(const m of matches){const h=by.get(m.home),a=by.get(m.away);if(!h||!a)continue;h.o++;a.o++;h.vq+=m.hs;h.bq+=m.as;a.vq+=m.as;a.bq+=m.hs;if(m.hs>m.as){h.q++;a.m++;}else if(m.hs<m.as){a.q++;h.m++;}else{h.h++;a.h++;}}
  const rows=[...by.values()];rows.forEach(r=>{r.x=r.q*3+r.h;r.tf=r.vq-r.bq;});
  const key=r=>[r.x,r.tf,r.vq,-r.bq,r.q];
  rows.sort((a,b)=>{const ak=key(a),bk=key(b);for(let i=0;i<ak.length;i++)if(ak[i]!==bk[i])return bk[i]-ak[i];return 0;});
  for(let i=0;i<rows.length;){let j=i+1;while(j<rows.length&&key(rows[i]).join()===key(rows[j]).join())j++;if(j-i>1){const tied=rows.slice(i,j),ids=new Set(tied.map(r=>r.id)),h=new Map(tied.map(r=>[r.id,{x:0,tf:0,vq:0}]));for(const m of matches){if(!ids.has(m.home)||!ids.has(m.away))continue;const a=h.get(m.home),b=h.get(m.away);a.tf+=m.hs-m.as;b.tf+=m.as-m.hs;a.vq+=m.hs;b.vq+=m.as;if(m.hs>m.as)a.x+=3;else if(m.hs<m.as)b.x+=3;else{a.x++;b.x++;}}tied.sort((a,b)=>h.get(b.id).x-h.get(a.id).x||h.get(b.id).tf-h.get(a.id).tf||h.get(b.id).vq-h.get(a.id).vq||teams.find(t=>t.id===a.id).name.localeCompare(teams.find(t=>t.id===b.id).name,'az'));rows.splice(i,j-i,...tied);}i=j;}
  rows.forEach((r,i)=>r.rank=i+1);return rows;
}
export function scorers(league) {
  const names=new Map(league.teams.map(t=>[t.id,new Map(t.players.map(p=>[playerKey(p.name),playerName(p.name)]))])),by=new Map();
  for(const m of league.matches.filter(m=>m.status==='done'))for(const g of m.goals){if(g.og||g.unk||!g.p)continue;const key=playerKey(g.p)+'|'+g.t;let row=by.get(key);if(!row){row={p:playerName(g.p),t:g.t,g:0,games:new Set()};by.set(key,row);}row.g++;row.games.add(m.id);}
  const rows=[...by.values()].map(r=>({p:r.p,t:r.t,g:r.g,mp:r.games.size})).sort((a,b)=>b.g-a.g||a.mp-b.mp||a.p.localeCompare(b.p,'az'));rows.forEach(r=>r.rank=1+rows.filter(x=>x.g>r.g).length);return rows;
}
export function teamSummary(league,id) {
  const matches=league.matches.filter(m=>m.status==='done'&&(m.home===id||m.away===id)).sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)),result={played:0,wins:0,draws:0,losses:0,goalsFor:0,goalsAgainst:0,cleanSheets:0,yellow:0,red:0,form:[]};
  for(const m of matches){const own=m.home===id?m.hs:m.as,opp=m.home===id?m.as:m.hs;result.played++;result.goalsFor+=own;result.goalsAgainst+=opp;result.wins+=own>opp;result.draws+=own===opp;result.losses+=own<opp;result.cleanSheets+=opp===0;result.form.push(own>opp?'Q':own<opp?'M':'H');for(const card of m.cards)if(card.t===id)result[card.c==='r'?'red':'yellow']++;}
  result.form=result.form.slice(-5);result.average=result.played?result.goalsFor/result.played:0;return result;
}
export function headToHead(league,first,second) {
  const matches=league.matches.filter(m=>m.status==='done'&&(m.home===first&&m.away===second||m.home===second&&m.away===first)).sort((a,b)=>(b.date+b.time).localeCompare(a.date+a.time));
  let firstWins=0,secondWins=0,draws=0,firstGoals=0,secondGoals=0;
  for(const m of matches){const a=m.home===first?m.hs:m.as,b=m.home===second?m.hs:m.as;firstGoals+=a;secondGoals+=b;firstWins+=a>b;secondWins+=b>a;draws+=a===b;}
  return {matches,firstWins,secondWins,draws,firstGoals,secondGoals};
}
export function competition(league) {
  const state=league.competition||{phase:'group',qualified:[]};
  const group=league.matches.filter(m=>matchStage(m)==='group'),done=group.filter(m=>m.status==='done');
  return {...state,groupComplete:group.length>0&&group.length===done.length,groupPlayed:done.length,qualified:state.qualified.filter(id=>league.teams.some(t=>t.id===id)),semifinals:league.matches.filter(m=>matchStage(m)==='semifinal'),finals:league.matches.filter(m=>matchStage(m)==='final')};
}
