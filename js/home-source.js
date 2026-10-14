import {matchStage,ordinal} from './league-source.js';

export const MATCH_STAGES=[['group','Qrup mərhələsi'],['semifinal','Yarımfinal'],['final','Final']];
export const defaultMatchCenter=()=>({title:'Matç mərkəzi',mode:'automatic',round:1,stage:'semifinal',matches:[],limit:4,showSelector:true,showCountdown:true});
export const defaultFeaturedMatch=()=>({match:'',title:'Turun oyunu',text:'',showVideo:true});
export const stageTitle=stage=>MATCH_STAGES.find(([id])=>id===stage)?.[1]||'Oyunlar';
const sorted=matches=>matches.slice().sort((a,b)=>(a.date+' '+a.time).localeCompare(b.date+' '+b.time)||a.id.localeCompare(b.id));

export function matchCenterChoices(league){
 const all=league.matches||[],rounds=[...new Set(all.filter(m=>matchStage(m)==='group').map(m=>m.round))].sort((a,b)=>a-b);
 return [...rounds.map(r=>({value:String(r),label:ordinal(r)+' tur'})),...MATCH_STAGES.filter(([s])=>s!=='group'&&all.some(m=>matchStage(m)===s)).map(([s,label])=>({value:'stage:'+s,label}))];
}
export function selectHomeMatches(league,options={},choice=''){
 const config={...defaultMatchCenter(),...options},all=league.matches||[],choices=matchCenterChoices(league);let selected;
 if(config.mode==='manual'){
  const byID=new Map(all.map(m=>[m.id,m]));return {matches:config.matches.map(id=>byID.get(id)).filter(Boolean).slice(0,config.limit),selected:'manual',label:'Seçilmiş oyunlar',choices:[]};
 }
 if(choice&&choices.some(c=>c.value===String(choice)))selected=String(choice);
 else if(config.mode==='stage')selected='stage:'+config.stage;
 else if(config.mode==='round')selected=String(config.round);
 else {
  const active=all.find(m=>m.status==='live'),phase=league.competition?.phase;
  if(active)selected=matchStage(active)==='group'?String(active.round):'stage:'+matchStage(active)
  else if(phase==='completed'&&all.some(m=>matchStage(m)==='final'))selected='stage:final';
  else if(['semifinal','final'].includes(phase)&&all.some(m=>matchStage(m)===phase))selected='stage:'+phase;
  else {const groups=sorted(all.filter(m=>matchStage(m)==='group')),done=groups.filter(m=>m.status==='done');selected=String((done.at(-1)||groups[0])?.round||1);}
 }
 const stage=selected.startsWith('stage:')?selected.slice(6):null;
 const matches=sorted(all.filter(m=>stage?matchStage(m)===stage:matchStage(m)==='group'&&m.round===Number(selected)));
 return {matches:matches.slice(0,config.limit),selected,label:stage?stageTitle(stage):ordinal(Number(selected))+' tur',choices};
}
