import {FAN_FORMATIONS,FAN_PAGES,localizedFanZone,finalContext,eligibleFanPlayers,normalizeFanLineup,fanQuizQuestions} from './fan-zone-model.js';
const FAN_COPY={"Final mərkəzi":["Final centre","Центр финала"],"Mövsümün finalı":["Season final","Финал сезона"],"Öz ideal beşliyini qur":["Build your ideal five","Собери свою пятёрку"],"Komandanı nə qədər tanıyırsan?":["How well do you know your club?","Насколько хорошо ты знаешь свою команду?"],"Heyətlərdən bir qapıçı və dörd meydan oyunçusu seç.":["Choose one goalkeeper and four outfield players from the squads.","Выбери одного вратаря и четырёх полевых игроков из составов."],"Komandanı seç və liqanın həqiqi məlumatlarına əsaslanan sualları cavablandır.":["Choose a club and answer questions based on real league records.","Выбери команду и отвечай на вопросы по реальным данным лиги."],"Azarkeş mərkəzi":["Fan centre","Центр болельщиков"],"Final":["Final","Финал"],"İdeal beşlik":["Ideal five","Идеальная пятёрка"],"Viktorina":["Quiz","Викторина"],"Planlaşdırılıb":["Upcoming","Предстоит"],"Canlı":["Live","В прямом эфире"],"Tamamlanıb":["Completed","Завершён"],"Arxiv":["Archive","Архив"],"Çempion":["Champion","Чемпион"],"Tarix və saat təyin edilməyib":["Date and time to be confirmed","Дата и время пока не назначены"],"Final qarşılaşması hələ təyin edilməyib.":["The final fixture has not been set yet.","Финальный матч пока не назначен."],"Matç mərkəzi":["Match centre","Центр матча"],"Penaltilər":["Penalties","Пенальти"],"Üçüncülük oyunu":["Third-place match","Матч за третье место"],"Finala gedən yol":["Road to the final","Путь к финалу"],"Finaldan əvvəlki göstəricilər":["Record before the final","Показатели до финала"],"Oyun":["Matches","Матчи"],"Qələbə":["Wins","Победы"],"Vurulan qol":["Goals scored","Забитые голы"],"Buraxılan qol":["Goals conceded","Пропущенные голы"],"Yekun":["Recap","Итоги"],"Tərəfdaşlar":["Partners","Партнёры"],"Gün":["Days","Дни"],"Saat":["Hours","Часы"],"Dəqiqə":["Minutes","Минуты"],"Saniyə":["Seconds","Секунды"],"Qapıçı":["Goalkeeper","Вратарь"],"Meydan oyunçusu":["Outfield player","Полевой игрок"],"Düzülüş":["Formation","Расстановка"],"Beşliyinin adı":["Lineup name","Название пятёрки"],"Mənim ideal beşliyim":["My ideal five","Моя идеальная пятёрка"],"Komanda":["Club","Команда"],"Bütün komandalar":["All clubs","Все команды"],"Futbolçu axtar":["Find a player","Найти игрока"],"Futbolçu seç":["Choose a player","Выбрать игрока"],"Seçilib":["Selected","Выбран"],"Başqa mövqedə seçilib":["Selected in another position","Выбран на другой позиции"],"Bu seçimə uyğun futbolçu yoxdur.":["No players match this selection.","Нет игроков для этого выбора."],"Seçimi sil":["Remove selection","Убрать выбор"],"Sıfırla":["Reset","Сбросить"],"Şəkli endir":["Download image","Скачать изображение"],"Keçidi kopyala":["Copy link","Копировать ссылку"],"Paylaş":["Share","Поделиться"],"Keçid kopyalandı.":["Link copied.","Ссылка скопирована."],"Keçidi bu sahədən kopyala.":["Copy the link from this field.","Скопируй ссылку из этого поля."],"Şəkil hazırlanır…":["Preparing image…","Создаём изображение…"],"Şəkil hazırdır.":["Image ready.","Изображение готово."],"Şəkil hazırlanmadı. Yenidən sına.":["Could not create the image. Try again.","Не удалось создать изображение. Попробуй ещё раз."],"Beş mövqenin hamısına futbolçu seç.":["Choose a player for all five positions.","Выбери игрока для каждой из пяти позиций."],"Seçimin yalnız bu brauzerdə saxlanılır.":["Your selection is saved only in this browser.","Выбор сохраняется только в этом браузере."],"Başla":["Start","Начать"],"Sual":["Question","Вопрос"],"Düzgün cavablar":["Correct answers","Правильные ответы"],"Düzgün cavab":["Correct answer","Правильный ответ"],"Növbəti sual":["Next question","Следующий вопрос"],"Nəticəyə bax":["View result","Посмотреть результат"],"Test tamamlandı":["Quiz completed","Тест завершён"],"Yenidən başla":["Play again","Начать заново"],"Komandanı dəyiş":["Change club","Сменить команду"],"Bu seçim üçün hələ sual yoxdur.":["No questions are available for this selection yet.","Для этого выбора пока нет вопросов."],"Cavabların serverdə saxlanmır.":["Your answers are not stored on the server.","Ответы не сохраняются на сервере."],"Bölmə hazırda bağlıdır.":["This section is currently closed.","Раздел сейчас закрыт."],"Azarkeş seçimi":["Fan selection","Выбор болельщика"],"Son nəticə":["Result","Результат"],"Qeyd olunmuş oyun yoxdur.":["No completed games are recorded.","Нет записанных завершённых матчей."],"Şəkildə beşliyin və liqanın adı göstəriləcək.":["The image includes your lineup and the league name.","На изображении будут название пятёрки и название лиги."]};
function fanText(key,lang='az'){return FAN_COPY[key]?.[lang==='en'?0:lang==='ru'?1:-1]||key;}

function fanEscape(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function fanHref(path,lang){const u=new URL(path,'https://ssl.invalid');if(lang==='en'||lang==='ru')u.searchParams.set('lang',lang);return u.pathname+u.search+u.hash;}

function fanLogo(team){
 const p=String(team?.logo||'');if(/^\/assets\/(?:logo\.png|logos\/[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp))$/.test(p))return p;
 return /^[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp)$/.test(p)?'/assets/logos/'+p:'/assets/logo.png';
}

function renderFanLinks(data,lang='az'){
 const c=localizedFanZone(data.cms?.fanZone,data.locales,lang);if(!c.showLinks)return '';
 const entries=[['final','/final','01'],['lineup','/ideal-beslik','02'],['quiz','/viktorina','03']].filter(([k])=>c[k].enabled);
 return entries.length?'<nav class="fz-hub" aria-label="'+fanEscape(fanText('Azarkeş mərkəzi',lang))+'">'+entries.map(([k,path,n])=>'<a href="'+fanHref(path,lang)+'"><span>'+n+'</span><strong>'+fanEscape(fanText(c[k].title,lang))+'</strong><b aria-hidden="true">↗</b></a>').join('')+'</nav>':'';
}

function renderFanPage(data,page,lang='az'){
 const c=localizedFanZone(data.cms?.fanZone,data.locales,lang),config=c[page],e=fanEscape,t=s=>fanText(s,lang);
 if(!config)return '';
 const links=renderFanLinks(data,lang);
 if(!config.enabled)return '<section class="sec fz-page"><div class="wrap"><h1>'+e(t(config.title))+'</h1><p>'+t('Bölmə hazırda bağlıdır.')+'</p><a class="btn sec" href="'+fanHref('/azarkes',lang)+'">'+t('Azarkeş mərkəzi')+'</a></div></section>';
 let body='';
 if(page==='final'){
  const f=finalContext(data,c),m=f.match,state=t({upcoming:'Planlaşdırılıb',live:'Canlı',completed:'Tamamlanıb',archived:'Arxiv'}[f.state]),teamCard=id=>{const a=f.teams.get(id);return '<a class="fz-final-club" href="'+fanHref('/komanda?t='+encodeURIComponent(id),lang)+'"><img src="'+e(fanLogo(a))+'" alt=""><strong>'+e(a.name)+'</strong></a>';};
  const game=(g,small=false)=>'<div class="fz-scoreboard'+(small?' fz-scoreboard-small':'')+'">'+teamCard(g.home)+'<div class="fz-score"><b>'+(g.status==='planned'?'VS':g.hs+' : '+g.as)+'</b>'+(g.penalties?'<span>'+t('Penaltilər')+': '+g.penalties.home+' : '+g.penalties.away+'</span>':'')+'<span>'+e(g.date?new Intl.DateTimeFormat(lang==='az'?'az-AZ':lang==='ru'?'ru-RU':'en-GB',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Baku'}).format(new Date(g.date+'T12:00:00+04:00'))+(g.time?' · '+g.time:''):t('Tarix və saat təyin edilməyib'))+'</span><small>'+e(g.venue||data.league?.venue||'')+'</small><a href="'+fanHref('/matc?id='+encodeURIComponent(g.id),lang)+'">'+t('Matç mərkəzi')+' ↗</a></div>'+teamCard(g.away)+'</div>';
  body='<section class="fz-final-hero'+(config.cover?' fz-with-cover':'')+'">'+(config.cover?'<img class="fz-hero-cover" src="'+e(config.cover)+'" alt="">':'')+'<div class="fz-hero-content"><span class="fz-eyebrow">'+e(data.league?.season||'')+' · '+e(state)+'</span><h1>'+e(t(f.state==='archived'?config.archiveTitle:config.title))+'</h1>'+(config.description?'<p>'+e(t(config.description))+'</p>':'')+(m?game(m):'<p class="fz-pending">'+t('Final qarşılaşması hələ təyin edilməyib.')+'</p>')+(config.showCountdown&&f.state==='upcoming'&&Number.isFinite(f.kickoff)&&f.kickoff>Date.now()?'<div class="fz-countdown" data-fan-countdown="'+f.kickoff+'" aria-label="'+t('Final')+'">'+['Gün','Saat','Dəqiqə','Saniyə'].map(x=>'<div><b>00</b><span>'+t(x)+'</span></div>').join('')+'</div>':'')+'</div></section>';
  if(f.champion)body+='<section class="fz-champion"><img src="'+e(fanLogo(f.champion))+'" alt=""><div><span class="fz-eyebrow">'+t('Çempion')+'</span><h2>'+e(f.champion.name)+'</h2></div><span aria-hidden="true">★</span></section>';
  if(config.recap&&['completed','archived'].includes(f.state))body+='<section class="fz-panel"><h2>'+t('Yekun')+'</h2><div class="fz-prose">'+e(config.recap).replace(/\n/g,'<br>')+'</div></section>';
  if(m&&config.showStats)body+='<section class="fz-panel"><h2>'+t('Finaldan əvvəlki göstəricilər')+'</h2><div class="fz-table-wrap"><table class="fz-stats"><thead><tr><th>'+t('Komanda')+'</th>'+['Oyun','Qələbə','Vurulan qol','Buraxılan qol'].map(x=>'<th scope="col">'+t(x)+'</th>').join('')+'</tr></thead><tbody>'+[m.home,m.away].map(id=>{const s=f.stats(id);return '<tr><th scope="row">'+e(f.teams.get(id).name)+'</th>'+[s.played,s.wins,s.goals,s.against].map(n=>'<td>'+n+'</td>').join('')+'</tr>';}).join('')+'</tbody></table></div></section>';
  if(m&&config.showJourney)body+='<section class="fz-panel"><h2>'+t('Finala gedən yol')+'</h2><div class="fz-journeys">'+[m.home,m.away].map(id=>'<div><h3>'+e(f.teams.get(id).name)+'</h3>'+f.journey(id).map(g=>'<a class="fz-journey" href="'+fanHref('/matc?id='+encodeURIComponent(g.id),lang)+'"><span>'+e(f.teams.get(g.home).name)+'<small>'+e(g.date)+'</small></span><b>'+g.hs+' : '+g.as+'</b><span>'+e(f.teams.get(g.away).name)+'</span></a>').join('')+(!f.journey(id).length?'<p>'+t('Qeyd olunmuş oyun yoxdur.')+'</p>':'')+'</div>').join('')+'</div></section>';
  if(config.showThirdPlace&&f.thirdPlace)body+='<section class="fz-panel"><h2>'+t('Üçüncülük oyunu')+'</h2>'+game(f.thirdPlace,true)+'</section>';
  if(config.showSponsors&&data.cms?.sponsors?.enabled)body+='<section class="fz-panel"><h2>'+t('Tərəfdaşlar')+'</h2><div class="fz-partners">'+data.cms.sponsors.items.filter(p=>p.visible).map(p=>'<a href="'+e(p.url||p.instagram||'/sponsorlar')+'" rel="noopener noreferrer"><img src="'+e(p.logo||p.image||'/assets/logo.png')+'" alt="'+e(p.name)+'" loading="lazy"></a>').join('')+'</div></section>';
  if(config.linkLabel&&config.linkUrl)body+='<p class="fz-extra-link"><a class="btn pri" href="'+e(config.linkUrl)+'" rel="noopener noreferrer">'+e(config.linkLabel)+' ↗</a></p>';
 }else if(page==='lineup'){
  body='<header class="fz-heading"><span class="fz-eyebrow">'+e(data.league?.season||'')+' · '+t('Azarkeş seçimi')+'</span><h1>'+e(t(config.title))+'</h1><p>'+e(t(config.description))+'</p></header><div id="fan-lineup"></div><noscript>'+t('Futbolçu seç')+'</noscript>';
 }else{
  body='<header class="fz-heading"><span class="fz-eyebrow">'+e(data.league?.season||'')+' · '+t('Viktorina')+'</span><h1>'+e(t(config.title))+'</h1><p>'+e(t(config.description))+'</p></header><div class="fz-panel" id="fan-quiz"></div>';
 }
 return '<section class="sec fz-page"><div class="wrap">'+body+links+'</div></section>';
}

function fanStorageGet(key){try{return JSON.parse(localStorage.getItem(key)||'null');}catch{return null;}}

function fanStorageSet(key,value){try{localStorage.setItem(key,JSON.stringify(value));}catch{}}

function fanRosterLabel(p){return p.name+' · '+p.teamName;}

function fanCopyLink(url,box,lang){
 return (async()=>{try{if(!navigator.clipboard?.writeText)throw Error('unavailable');await navigator.clipboard.writeText(url);box.textContent=fanText('Keçid kopyalandı.',lang);}
 catch{box.replaceChildren();const p=document.createElement('p');p.textContent=fanText('Keçidi bu sahədən kopyala.',lang);const input=document.createElement('input');input.type='text';input.readOnly=true;input.value=url;input.setAttribute('aria-label',fanText('Keçidi kopyala',lang));box.append(p,input);input.focus();input.select();}})();
}

async function fanLineupImage(data,settings,selected,formation,title){
 const c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d');if(!x)throw Error('Canvas unavailable');
 await document.fonts?.ready;
 const blue=data.site?.primary||'#1c44be';x.fillStyle='#f4f7fd';x.fillRect(0,0,1080,1350);x.fillStyle=blue;x.fillRect(0,0,1080,260);
 x.textAlign='left';x.fillStyle='#ffffff';x.font='600 24px "Source Sans 3",Arial';x.fillText(String(data.league.season)+' · '+String(data.league.edition||1),64,65);
 x.font='800 48px "Source Sans 3",Arial';const words=title.split(/\s+/);let line='',y=133;
 for(const word of words){const next=line?line+' '+word:word;if(x.measureText(next).width>930&&line){x.fillText(line,64,y);y+=54;line=word;}else line=next;}if(line)x.fillText(line,64,Math.min(y,220));
 const left=60,top=300,width=960,height=850;x.fillStyle=blue;x.fillRect(left,top,width,height);
 x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=3;x.strokeRect(left+28,top+28,width-56,height-56);x.beginPath();x.moveTo(left+28,top+height/2);x.lineTo(left+width-28,top+height/2);x.stroke();x.beginPath();x.arc(540,top+height/2,102,0,Math.PI*2);x.stroke();x.strokeRect(365,top+28,350,110);x.strokeRect(365,top+height-138,350,110);
 const slots=FAN_FORMATIONS[formation],map=new Map(eligibleFanPlayers(data.league,settings).map(p=>[p.key,p]));
 x.textAlign='center';
 for(let i=0;i<5;i++){
  const p=map.get(selected[i]);if(!p)continue;const px=left+slots[i].x/100*width,py=top+slots[i].y/100*height;
  x.save();x.translate(px,py-36);x.fillStyle=i===0?'#f9d36c':'#ffffff';x.beginPath();x.moveTo(-27,-36);x.lineTo(-62,-12);x.lineTo(-45,13);x.lineTo(-29,2);x.lineTo(-29,48);x.lineTo(29,48);x.lineTo(29,2);x.lineTo(45,13);x.lineTo(62,-12);x.lineTo(27,-36);x.lineTo(13,-24);x.lineTo(-13,-24);x.closePath();x.fill();x.fillStyle=blue;x.font='800 33px "Source Sans 3",Arial';x.fillText(String(p.n||i+1).slice(0,3),0,23);x.restore();
  x.fillStyle='#ffffff';x.font='700 25px "Source Sans 3",Arial';let label=p.name;while(x.measureText(label).width>320&&label.length>3)label=label.slice(0,-2);if(label!==p.name)label+='…';x.fillText(label,px,py+39);x.font='400 19px "Source Sans 3",Arial';x.fillText(p.teamName,px,py+66);
 }
 x.fillStyle='#172640';x.font='800 33px "Source Sans 3",Arial';x.fillText(data.site?.name||'Sumqayıt Super Liqası',540,1230);x.fillStyle='#627189';x.font='400 23px "Source Sans 3",Arial';x.fillText(location.host+' · '+formation,540,1274);
 return c;
}

function bindFanLineup(data,settings,lang){
 const box=document.querySelector('#fan-lineup');if(!box)return;const config=settings.lineup,e=fanEscape,t=s=>fanText(s,lang),all=eligibleFanPlayers(data.league,settings),map=new Map(all.map(p=>[p.key,p]));
 const key='ssl.fan.lineup.v1:'+data.league.season+':'+(data.league.edition||1),saved=fanStorageGet(key)||{},query=new URLSearchParams(location.search),hasQuery=Array.from({length:5},(_,i)=>query.has('p'+i)).some(Boolean);
 let selection=normalizeFanLineup(data.league,settings,hasQuery?Array.from({length:5},(_,i)=>query.get('p'+i)||''):saved.players),formation=config.formations.includes(query.get('formation'))?query.get('formation'):config.formations.includes(saved.formation)?saved.formation:config.defaultFormation,slot=0;
 const initialTitle=(query.get('name')||saved.title||t('Mənim ideal beşliyim')).slice(0,70);
 box.innerHTML='<div class="fz-lineup-tools"><label>'+t('Beşliyinin adı')+'<input id="fan-lineup-title" maxlength="70" value="'+e(initialTitle)+'"></label><label>'+t('Düzülüş')+'<select id="fan-formation">'+config.formations.map(f=>'<option'+(f===formation?' selected':'')+'>'+e(f)+'</option>').join('')+'</select></label></div><div class="fz-lineup-grid"><div><div class="fz-pitch" id="fan-pitch" aria-label="'+t('İdeal beşlik')+'"><span class="fz-pitch-circle" aria-hidden="true"></span><span class="fz-pitch-half" aria-hidden="true"></span></div><div class="fz-lineup-actions">'+(config.allowDownload?'<button class="btn pri" type="button" data-fan-download>'+t('Şəkli endir')+'</button>':'')+(config.allowShare?'<button class="btn sec" type="button" data-fan-copy>'+t('Keçidi kopyala')+'</button>':'')+'<button class="btn sec" type="button" data-fan-reset>'+t('Sıfırla')+'</button></div><p class="fz-muted">'+t('Seçimin yalnız bu brauzerdə saxlanılır.')+'</p><div id="fan-lineup-status" role="status" aria-live="polite"></div></div><section class="fz-panel fz-roster"><h2 id="fan-slot-heading"></h2><label>'+t('Komanda')+'<select id="fan-team-filter"><option value="">'+t('Bütün komandalar')+'</option>'+data.league.teams.filter(a=>all.some(p=>p.team===a.id)).map(a=>'<option value="'+e(a.id)+'">'+e(a.name)+'</option>').join('')+'</select></label><label>'+t('Futbolçu axtar')+'<input id="fan-player-search" type="search"></label><div id="fan-player-list" class="fz-player-list"></div><button type="button" class="btn sec" data-fan-clear>'+t('Seçimi sil')+'</button></section></div>';
 const pitch=box.querySelector('#fan-pitch'),list=box.querySelector('#fan-player-list'),title=box.querySelector('#fan-lineup-title'),status=box.querySelector('#fan-lineup-status');
 const save=()=>fanStorageSet(key,{players:selection,formation,title:title.value});
 const drawRoster=()=>{
  const team=box.querySelector('#fan-team-filter').value,q=box.querySelector('#fan-player-search').value.normalize('NFKC').toLocaleLowerCase('az');
  box.querySelector('#fan-slot-heading').textContent=t(slot===0?'Qapıçı':'Meydan oyunçusu')+' · '+(slot+1)+'/5';
  const players=all.filter(p=>(!team||p.team===team)&&(!q||fanRosterLabel(p).toLocaleLowerCase('az').includes(q))&&(!config.strictGoalkeeper||(slot===0?!!p.gk:!p.gk)));
  list.innerHTML=players.map(p=>{const used=selection.includes(p.key)&&selection[slot]!==p.key,chosen=selection[slot]===p.key;return '<button class="fz-player'+(chosen?' is-selected':'')+'" type="button" data-fan-player="'+e(p.key)+'" aria-pressed="'+chosen+'"'+(used?' disabled':'')+'><span class="fz-player-no">'+e(p.n||'—')+'</span><span><strong>'+e(p.name)+'</strong><small>'+e(p.teamName)+(used?' · '+t('Başqa mövqedə seçilib'):chosen?' · '+t('Seçilib'):'')+'</small></span></button>';}).join('')||'<p>'+t('Bu seçimə uyğun futbolçu yoxdur.')+'</p>';
 };
 const drawPitch=()=>{
  pitch.querySelectorAll('[data-fan-slot]').forEach(n=>n.remove());
  FAN_FORMATIONS[formation].forEach((pos,i)=>{const p=map.get(selection[i]),button=document.createElement('button');button.type='button';button.dataset.fanSlot=i;button.className='fz-slot'+(slot===i?' is-active':'');button.style.left=pos.x+'%';button.style.top=pos.y+'%';button.setAttribute('aria-pressed',String(slot===i));button.setAttribute('aria-label',t(i===0?'Qapıçı':'Meydan oyunçusu')+' '+(i+1)+(p?': '+fanRosterLabel(p):': '+t('Futbolçu seç')));button.innerHTML='<span class="fz-shirt">'+e(p?.n||'+')+'</span><strong>'+e(p?.name||t('Futbolçu seç'))+'</strong>'+(p?'<small>'+e(p.teamName)+'</small>':'');pitch.append(button);});
  for(const b of box.querySelectorAll('[data-fan-download],[data-fan-copy]'))b.disabled=!selection.every(Boolean);save();
 };
 box.addEventListener('click',async event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-fan-slot')){slot=Number(b.dataset.fanSlot);drawPitch();drawRoster();}
  if(b.hasAttribute('data-fan-player')){selection[slot]=b.dataset.fanPlayer;status.textContent='';drawPitch();drawRoster();}
  if(b.hasAttribute('data-fan-clear')){selection[slot]='';drawPitch();drawRoster();}
  if(b.hasAttribute('data-fan-reset')){selection=['','','','',''];slot=0;status.textContent='';drawPitch();drawRoster();}
  if(b.hasAttribute('data-fan-copy')){
   const url=new URL('/ideal-beslik',location.origin);if(lang!=='az')url.searchParams.set('lang',lang);url.searchParams.set('formation',formation);url.searchParams.set('name',title.value||t('Mənim ideal beşliyim'));selection.forEach((p,i)=>url.searchParams.set('p'+i,p));await fanCopyLink(url.href,status,lang);
  }
  if(b.hasAttribute('data-fan-download')){
   b.disabled=true;status.textContent=t('Şəkil hazırlanır…');
   try{const canvas=await fanLineupImage(data,settings,selection,formation,title.value||t('Mənim ideal beşliyim')),blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('Image failed');const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='sumqayit-ideal-beslik.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);status.textContent=t('Şəkil hazırdır.');}catch{status.textContent=t('Şəkil hazırlanmadı. Yenidən sına.');}finally{b.disabled=!selection.every(Boolean);}
  }
 });
 box.querySelector('#fan-formation').onchange=event=>{formation=event.target.value;drawPitch();};
 title.oninput=save;box.querySelector('#fan-team-filter').onchange=drawRoster;box.querySelector('#fan-player-search').oninput=drawRoster;drawPitch();drawRoster();
}

function bindFanQuiz(data,settings,lang){
 const box=document.querySelector('#fan-quiz');if(!box)return;const c=settings.quiz,t=s=>fanText(s,lang),e=fanEscape,params=new URLSearchParams(location.search);
 let team=c.allowTeamSelect&&data.league.teams.some(a=>a.id===params.get('team'))?params.get('team'):'',questions=[],index=0,score=0,answered=false;
 const teamOptions=()=>'<option value="">'+t('Bütün komandalar')+'</option>'+data.league.teams.map(a=>'<option value="'+e(a.id)+'"'+(team===a.id?' selected':'')+'>'+e(a.name)+'</option>').join('');
 const home=()=>{box.innerHTML=(c.allowTeamSelect?'<label>'+t('Komanda')+'<select id="fan-quiz-team">'+teamOptions()+'</select></label>':'')+'<button type="button" class="btn pri" data-fan-quiz-start>'+t('Başla')+'</button><p class="fz-muted">'+t('Cavabların serverdə saxlanmır.')+'</p>';};
 const draw=()=>{
  answered=false;
  if(index>=questions.length){box.innerHTML='<span class="fz-eyebrow">'+t('Test tamamlandı')+'</span><h2 tabindex="-1">'+score+' / '+questions.length+'</h2><p>'+t('Düzgün cavablar')+'</p><div class="fz-lineup-actions"><button type="button" class="btn pri" data-fan-quiz-restart>'+t('Yenidən başla')+'</button><button type="button" class="btn sec" data-fan-quiz-home>'+t('Komandanı dəyiş')+'</button></div>';return;}
  const q=questions[index];box.innerHTML='<div class="fz-quiz-progress"><span>'+t('Sual')+' '+(index+1)+' / '+questions.length+'</span><span>'+t('Düzgün cavablar')+': '+score+'</span></div><progress value="'+index+'" max="'+questions.length+'" aria-label="'+t('Sual')+'"></progress><h2 tabindex="-1">'+e(q.title)+'</h2><div class="fz-answers" role="group" aria-label="'+e(q.title)+'">'+q.choices.map((answer,i)=>'<button type="button" data-fan-answer="'+i+'"><b>'+String.fromCharCode(65+i)+'</b><span>'+e(answer)+'</span></button>').join('')+'</div><p class="fz-feedback" role="status" aria-live="polite"></p><button class="btn pri" type="button" data-fan-next hidden>'+t(index===questions.length-1?'Nəticəyə bax':'Növbəti sual')+'</button>';
 };
 const start=()=>{questions=fanQuizQuestions(data.league,settings,team,lang);index=0;score=0;if(!questions.length){home();const p=document.createElement('p');p.setAttribute('role','status');p.textContent=t('Bu seçim üçün hələ sual yoxdur.');box.append(p);return;}draw();box.querySelector('h2').focus();};
 box.addEventListener('change',event=>{if(event.target.id==='fan-quiz-team')team=event.target.value;});
 box.addEventListener('click',event=>{
  if(event.target.closest('[data-fan-quiz-start],[data-fan-quiz-restart]')){start();return;}
  if(event.target.closest('[data-fan-quiz-home]')){home();return;}
  if(event.target.closest('[data-fan-next]')&&answered){index++;draw();box.querySelector('h2').focus();return;}
  const b=event.target.closest('[data-fan-answer]');if(!b||answered||index>=questions.length)return;
  answered=true;const q=questions[index],choice=Number(b.dataset.fanAnswer);if(choice===q.answer)score++;
  for(const answer of box.querySelectorAll('[data-fan-answer]')){answer.disabled=true;answer.classList.toggle('is-correct',Number(answer.dataset.fanAnswer)===q.answer);answer.classList.toggle('is-wrong',answer===b&&choice!==q.answer);}
  box.querySelector('.fz-feedback').textContent=t('Düzgün cavab')+': '+q.choices[q.answer]+(q.note?' — '+q.note:'');box.querySelector('[data-fan-next]').hidden=false;box.querySelector('progress').value=index+1;
 });home();
}

function mountFanZone(){
 const source=window.CONTENT;if(!source?.league)return;
 const lang=['en','ru'].includes(new URLSearchParams(location.search).get('lang'))?new URLSearchParams(location.search).get('lang'):'az',settings=localizedFanZone(source.cms?.fanZone,source.locales,lang);
 const path=document.body.dataset.previewPath||location.pathname,page=FAN_PAGES[path]||({'final':'final','lineup':'lineup','quiz':'quiz'}[document.body.dataset.page]);
 if(page){
  const app=document.querySelector('#app');if(!app)return;app.innerHTML=renderFanPage(source,page,lang);document.title=fanText(settings[page].title,lang)+' · '+(source.site?.name||'Sumqayıt Super Liqası');
  if(!settings[page].enabled)return;
  if(page==='lineup')bindFanLineup(source,settings,lang);if(page==='quiz')bindFanQuiz(source,settings,lang);
  const countdown=document.querySelector('[data-fan-countdown]');if(countdown){const tick=()=>{let s=Math.max(0,Math.floor((Number(countdown.dataset.fanCountdown)-Date.now())/1000)),values=[Math.floor(s/86400),Math.floor(s%86400/3600),Math.floor(s%3600/60),s%60];countdown.querySelectorAll('b').forEach((el,i)=>el.textContent=String(values[i]).padStart(2,'0'));};tick();const interval=setInterval(tick,1000);window.addEventListener('pagehide',()=>clearInterval(interval),{once:true});}
 }else if(document.body.dataset.page==='fans'){
  const old=document.querySelector('.league-quiz'),links=renderFanLinks(source,lang);if(old){old.outerHTML=links;}else{const parent=document.querySelector('.fan-centre-top')?.parentElement;if(parent&&!parent.querySelector('.fz-hub'))parent.insertAdjacentHTML('beforeend',links);}
 }
 const footer=document.querySelector('footer .wrap')||document.querySelector('footer');
 if(footer&&settings.showLinks&&!footer.querySelector('.fz-footer-links')){const nav=document.createElement('nav');nav.className='fz-footer-links';nav.setAttribute('aria-label',fanText('Azarkeş mərkəzi',lang));nav.innerHTML=Object.entries(FAN_PAGES).filter(([,id])=>settings[id].enabled).map(([url,id])=>'<a href="'+fanHref(url,lang)+'">'+fanEscape(fanText(settings[id].title,lang))+'</a>').join('');footer.append(nav);}
 window.addEventListener('ssl-preferences-reset',()=>{try{for(let i=localStorage.length-1;i>=0;i--){const key=localStorage.key(i);if(key?.startsWith('ssl.fan.'))localStorage.removeItem(key);}}catch{}});
}
export {fanText,fanEscape,renderFanLinks,renderFanPage,mountFanZone};
if(typeof window!=='undefined'&&typeof document!=='undefined'){if(document.readyState==='complete')mountFanZone();else document.addEventListener('DOMContentLoaded',mountFanZone,{once:true});}
