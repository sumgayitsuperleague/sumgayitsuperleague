// The public community model contains editorial configuration, never voter records.
import {defaultFeaturedMatch} from './home-source.js';
export const defaultCommunity=()=>({enabled:true,title:'Liqanın içindən',homeLimit:2,posts:[],homeFeature:'poll',featured:defaultFeaturedMatch(),poll:{enabled:false,round:1,question:'Turun ən yadda qalan oyunu hansıdır?'}});
export function instagramPostURL(value){
 try{const u=new URL(value);if(u.protocol!=='https:'||u.hostname!=='www.instagram.com'||u.username||u.password||u.search||u.hash)return false;return /^\/(?:sumqayitsuperliqa\/)?(?:p|reel)\/[A-Za-z0-9_-]{5,40}\/$/.test(u.pathname);}catch{return false;}
}
export function instagramEmbedURL(value){if(!instagramPostURL(value))return '';const u=new URL(value),parts=u.pathname.split('/').filter(Boolean);return 'https://www.instagram.com/'+parts.at(-2)+'/'+parts.at(-1)+'/embed/';}
export function fanPollDefinition(data){
 const p=data.cms?.community?.poll;if(!p?.enabled)return null;
 const choices=data.league.matches.filter(m=>m.status==='done'&&m.round===p.round).slice().sort((a,b)=>a.id.localeCompare(b.id));
 if(choices.length<2||choices.length>16)return null;
 return {id:String(data.league.season)+'-r'+p.round+'-'+choices.map(m=>m.id).join('.'),round:p.round,question:p.question,choices:choices.map(m=>m.id)};
}
