import {playerKey,playerName,playerSummary} from './league-source.js';
import * as UI from './i18n.js';

export function installPlayerDuel({P,L,esc,ball,head,playerLink,$},teamPage,teamInit){
 const isPlayers=()=>new URLSearchParams(location.search).get('view')==='players';
 const roster=L.teams.flatMap(team=>team.players.map(player=>({team,player,key:team.id+':'+playerKey(player.name),stats:playerSummary(L,team.id,player.name)}))).sort((a,b)=>b.stats.goals-a.stats.goals||playerName(a.player.name).localeCompare(playerName(b.player.name),'az')||a.team.id.localeCompare(b.team.id));
 const tabs=players=>`<nav class="comparison-modes" aria-label="Müqayisə növü"><a href="muqayise.html"${players?'':' aria-current="page"'}>Komandalar</a><a href="muqayise.html?view=players"${players?' aria-current="page"':''}>Futbolçular</a></nav>`;
 const options=selected=>roster.map(row=>`<option value="${esc(row.key)}"${row.key===selected?' selected':''} translate="no">${esc(playerName(row.player.name))} · ${esc(row.team.name)}</option>`).join('');
 P.compare=()=>{
  if(!isPlayers())return teamPage().replace('<div class="compare-selectors">',tabs(false)+'<div class="compare-selectors">');
  return head('Futbolçular üz-üzə','İki futbolçu seç, mövsüm göstəricilərini müqayisə et.')+`<section class="sec"><div class="wrap player-duel">${tabs(true)}${roster.length<2?'<p class="empty">Müqayisə üçün ən azı iki futbolçu lazımdır.</p>':`<div class="duel-selectors"><label><span>Birinci futbolçu</span><select id="duel-first">${options(roster[0].key)}</select></label><button id="duel-swap" type="button" aria-label="Yerlərini dəyiş" title="Yerlərini dəyiş">⇄</button><label><span>İkinci futbolçu</span><select id="duel-second">${options(roster[1].key)}</select></label></div><div id="duel-content"></div><div class="duel-share"><button class="btn sec" id="duel-copy" type="button">Müqayisənin linkini kopyala</button><span id="duel-notice" role="status"></span><label class="duel-link" hidden><span>Müqayisənin linki</span><input id="duel-link" readonly type="url"></label></div>`}</div></section>`;
 };
 P.compare.init=()=>{
  if(!isPlayers())return teamInit();
  if(roster.length<2)return;
  const first=$('#duel-first'),second=$('#duel-second'),content=$('#duel-content'),notice=$('#duel-notice'),params=new URLSearchParams(location.search);
  const pick=n=>roster.find(r=>r.team.id===params.get('t'+n)&&playerKey(r.player.name)===playerKey(params.get('p'+n)));
  if(pick(1))first.value=pick(1).key;if(pick(2))second.value=pick(2).key;
  // A one-player link opens against a different player, even if it names the default rival.
  if(!pick(2)&&first.value===second.value)second.value=roster.find(r=>r.key!==first.value).key;
  let shareUrl='';
  const draw=()=>{
   const a=roster.find(r=>r.key===first.value),b=roster.find(r=>r.key===second.value);notice.textContent='';$('.duel-link').hidden=true;
   const same=!a||!b||a.key===b.key;$('#duel-copy').disabled=same;
   if(same){content.innerHTML='<p class="empty">'+esc(UI.t('Müqayisə üçün iki fərqli futbolçu seç.'))+'</p>';return;}
   const url=new URL('/muqayise',location.href);url.searchParams.set('view','players');if(UI.LANG!=='az')url.searchParams.set('lang',UI.LANG);
   for(const [i,row] of [[1,a],[2,b]]){url.searchParams.set('t'+i,row.team.id);url.searchParams.set('p'+i,row.player.name);}shareUrl=url.href;
   try{if(typeof history!=='undefined')history.replaceState(null,'',url.pathname+url.search);}catch{}
   const identity=row=>`<a class="duel-identity" href="${esc(playerLink(row.team.id,row.player.name))}"><span class="duel-shirt" aria-hidden="true">${esc(row.player.n||'—')}</span>${ball(row.team.id,'sm')}<h2 translate="no">${esc(playerName(row.player.name))}</h2><span translate="no">${esc(row.team.name)}</span></a>`;
   const stats=[['Qol','goals'],['Qol vurduğu matç','scoringGames'],['Matçın ən yaxşısı','mvp'],['Sarı kart','yellow'],['Qırmızı kart','red']];
   content.innerHTML=`<div class="duel-hero">${identity(a)}<div class="duel-versus"><span>${esc(L.season)}</span><b aria-hidden="true">VS</b></div>${identity(b)}</div><section class="duel-statistics" aria-label="${esc(UI.t('Mövsümün qeydə alınmış göstəriciləri'))}">${stats.map(([label,key])=>{const av=a.stats[key],bv=b.stats[key],total=av+bv;return `<div class="duel-stat" data-stat="${key}"><div><b${av>bv&&!['yellow','red'].includes(key)?' class="duel-leading"':''}>${av}</b><span>${esc(UI.t(label))}</span><b${bv>av&&!['yellow','red'].includes(key)?' class="duel-leading"':''}>${bv}</b></div><div class="duel-bars" aria-hidden="true"><span style="--portion:${total?av/total*100:0}%"></span><span style="--portion:${total?bv/total*100:0}%"></span></div></div>`;}).join('')}</section><p class="duel-footnote">${esc(UI.t('Yalnız tamamlanmış oyunların qeydləri. Avtoqollar qol sayına daxil deyil.'))}</p>`;
   UI.enhanceRoot(content);
  };
  first.onchange=draw;second.onchange=draw;$('#duel-swap').onclick=()=>{const value=first.value;first.value=second.value;second.value=value;draw();};
  $('#duel-copy').onclick=async()=>{try{await navigator.clipboard.writeText(shareUrl);notice.textContent=UI.t('Müqayisənin linki kopyalandı.');}catch{$('.duel-link').hidden=false;$('#duel-link').value=shareUrl;$('#duel-link').select();notice.textContent=UI.t('Linki seçib kopyalaya bilərsən.');}};
  draw();
 };
}
