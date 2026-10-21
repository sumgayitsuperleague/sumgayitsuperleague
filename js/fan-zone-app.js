import {arenaText,renderArenaPage,bindTimeline,bindPenalty} from './arena-experience.js';
import {FAN_LINEUP_SIZE,fanFormation,FAN_FORMATIONS,FAN_PAGES,localizedFanZone,finalContext,eligibleFanPlayers,normalizeFanLineup,fanQuizQuestions} from './fan-zone-model.js';
const FAN_COPY={"Final mərkəzi":["Final centre","Центр финала"],"Mövsümün finalı":["Season final","Финал сезона"],"Öz ideal altılığını qur":["Build your ideal six","Собери свою шестёрку"],"Komandanı nə qədər tanıyırsan?":["How well do you know your club?","Насколько хорошо ты знаешь свою команду?"],"Heyətlərdən bir qapıçı və beş meydan oyunçusu seç.":["Choose one goalkeeper and five outfield players from the squads.","Выбери одного вратаря и пяти полевых игроков из составов."],"Komandanı seç və liqanın həqiqi məlumatlarına əsaslanan sualları cavablandır.":["Choose a club and answer questions based on real league records.","Выбери команду и отвечай на вопросы по реальным данным лиги."],"Azarkeş mərkəzi":["Fan centre","Центр болельщиков"],"Final":["Final","Финал"],"İdeal altılıq":["Ideal six","Идеальная шестёрка"],"Viktorina":["Quiz","Викторина"],"Planlaşdırılıb":["Upcoming","Предстоит"],"Canlı":["Live","В прямом эфире"],"Tamamlanıb":["Completed","Завершён"],"Arxiv":["Archive","Архив"],"Çempion":["Champion","Чемпион"],"Tarix və saat təyin edilməyib":["Date and time to be confirmed","Дата и время пока не назначены"],"Final qarşılaşması hələ təyin edilməyib.":["The final fixture has not been set yet.","Финальный матч пока не назначен."],"Matç mərkəzi":["Match centre","Центр матча"],"Penaltilər":["Penalties","Пенальти"],"Üçüncülük oyunu":["Third-place match","Матч за третье место"],"Finala gedən yol":["Road to the final","Путь к финалу"],"Finaldan əvvəlki göstəricilər":["Record before the final","Показатели до финала"],"Oyun":["Matches","Матчи"],"Qələbə":["Wins","Победы"],"Vurulan qol":["Goals scored","Забитые голы"],"Buraxılan qol":["Goals conceded","Пропущенные голы"],"Yekun":["Recap","Итоги"],"Tərəfdaşlar":["Partners","Партнёры"],"Gün":["Days","Дни"],"Saat":["Hours","Часы"],"Dəqiqə":["Minutes","Минуты"],"Saniyə":["Seconds","Секунды"],"Qapıçı":["Goalkeeper","Вратарь"],"Meydan oyunçusu":["Outfield player","Полевой игрок"],"Düzülüş":["Formation","Расстановка"],"Altılığının adı":["Lineup name","Название шестёрки"],"Mənim ideal altılığım":["My ideal six","Моя идеальная шестёрка"],"Komanda":["Club","Команда"],"Bütün komandalar":["All clubs","Все команды"],"Futbolçu axtar":["Find a player","Найти игрока"],"Futbolçu seç":["Choose a player","Выбрать игрока"],"Seçilib":["Selected","Выбран"],"Başqa mövqedə seçilib":["Selected in another position","Выбран на другой позиции"],"Bu seçimə uyğun futbolçu yoxdur.":["No players match this selection.","Нет игроков для этого выбора."],"Seçimi sil":["Remove selection","Убрать выбор"],"Sıfırla":["Reset","Сбросить"],"Şəkli endir":["Download image","Скачать изображение"],"Keçidi kopyala":["Copy link","Копировать ссылку"],"Paylaş":["Share","Поделиться"],"Keçid kopyalandı.":["Link copied.","Ссылка скопирована."],"Keçidi bu sahədən kopyala.":["Copy the link from this field.","Скопируй ссылку из этого поля."],"Şəkil hazırlanır…":["Preparing image…","Создаём изображение…"],"Şəkil hazırdır.":["Image ready.","Изображение готово."],"Şəkil hazırlanmadı. Yenidən sına.":["Could not create the image. Try again.","Не удалось создать изображение. Попробуй ещё раз."],"Altı mövqenin hamısına futbolçu seç.":["Choose a player for all six positions.","Выбери игрока для каждой из шести позиций."],"Seçimin yalnız bu brauzerdə saxlanılır.":["Your selection is saved only in this browser.","Выбор сохраняется только в этом браузере."],"Başla":["Start","Начать"],"Sual":["Question","Вопрос"],"Düzgün cavablar":["Correct answers","Правильные ответы"],"Düzgün cavab":["Correct answer","Правильный ответ"],"Növbəti sual":["Next question","Следующий вопрос"],"Nəticəyə bax":["View result","Посмотреть результат"],"Test tamamlandı":["Quiz completed","Тест завершён"],"Yenidən başla":["Play again","Начать заново"],"Komandanı dəyiş":["Change club","Сменить команду"],"Bu seçim üçün hələ sual yoxdur.":["No questions are available for this selection yet.","Для этого выбора пока нет вопросов."],"Cavabların serverdə saxlanmır.":["Your answers are not stored on the server.","Ответы не сохраняются на сервере."],"Bölmə hazırda bağlıdır.":["This section is currently closed.","Раздел сейчас закрыт."],"Azarkeş seçimi":["Fan selection","Выбор болельщика"],"Son nəticə":["Result","Результат"],"Qeyd olunmuş oyun yoxdur.":["No completed games are recorded.","Нет записанных завершённых матчей."],"Şəkildə altılığın və liqanın adı göstəriləcək.":["The image includes your lineup and the league name.","На изображении будут название шестёрки и название лиги."]};
Object.assign(FAN_COPY,{"Minifutbol":["Minifootball","Мини-футбол"],"Heyətini tamamla":["Complete your lineup","Собери состав"],"Mövqəni seç, futbolçunu əlavə et.":["Choose a position, then add a player.","Выбери позицию и добавь игрока."],"seçilib":["selected","выбрано"],"1 qapıçı · 5 meydan oyunçusu":["1 goalkeeper · 5 outfield players","1 вратарь · 5 полевых игроков"]});
function fanText(key,lang='az'){return FAN_COPY[key]?.[lang==='en'?0:lang==='ru'?1:-1]||arenaText(key,lang);}

function fanEscape(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function fanHref(path,lang){const u=new URL(path,'https://ssl.invalid');if(lang==='en'||lang==='ru')u.searchParams.set('lang',lang);return u.pathname+u.search+u.hash;}

function fanLogo(team){
 const p=String(team?.logo||'');if(/^\/assets\/(?:logo\.png|logos\/[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp))$/.test(p))return p;
 return /^[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp)$/.test(p)?'/assets/logos/'+p:'/assets/logo.png';
}

function renderFanLinks(data,lang='az'){
 const c=localizedFanZone(data.cms?.fanZone,data.locales,lang);if(!c.showLinks)return '';
 const entries=[['final','/final','01'],['lineup','/ideal-altiliq','02'],['quiz','/viktorina','03'],['penalty','/penalti-arenasi','04'],['timeline','/zaman-tuneli','05']].filter(([k])=>c[k].enabled);
 return entries.length?'<nav class="fz-hub" aria-label="'+fanEscape(fanText('Azarkeş mərkəzi',lang))+'">'+entries.map(([k,path,n])=>'<a href="'+fanHref(path,lang)+'"><span>'+n+'</span><strong>'+fanEscape(fanText(c[k].title,lang))+'</strong><b aria-hidden="true">↗</b></a>').join('')+'</nav>':'';
}

function renderFanPage(data,page,lang='az'){
 const c=localizedFanZone(data.cms?.fanZone,data.locales,lang),config=c[page],e=fanEscape,t=s=>fanText(s,lang);
 if(!config)return '';
 const links=renderFanLinks(data,lang);
 if(!config.enabled)return '<section class="sec fz-page"><div class="wrap"><h1>'+e(t(config.title))+'</h1><p>'+t('Bölmə hazırda bağlıdır.')+'</p><a class="btn sec" href="'+fanHref('/azarkes',lang)+'">'+t('Azarkeş mərkəzi')+'</a></div></section>';
 if(page==='penalty'||page==='timeline')return renderArenaPage(data,page,c,lang,links);
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

async function fanLineupImage(data,settings,selected,formation,title,lang='az'){
 const c=document.createElement('canvas');c.width=1080;c.height=1350;const x=c.getContext('2d');if(!x)throw Error('Canvas unavailable');
 await document.fonts?.ready;
 const blue='#1c44be',font='"Source Sans 3",Arial',round=(left,top,w,h,r,fill)=>{x.beginPath();x.roundRect(left,top,w,h,r);x.fillStyle=fill;x.fill();};
 const bg=x.createLinearGradient(0,0,1080,1350);bg.addColorStop(0,'#102a50');bg.addColorStop(.45,'#081b31');bg.addColorStop(1,'#061321');x.fillStyle=bg;x.fillRect(0,0,1080,1350);
 // Stadium light glow and a subtle technical grid behind the pitch.
 for(const lx of [50,1030]){const glow=x.createRadialGradient(lx,100,0,lx,100,620);glow.addColorStop(0,'rgba(162,209,255,.24)');glow.addColorStop(1,'rgba(162,209,255,0)');x.fillStyle=glow;x.fillRect(0,0,1080,1350);}
 x.strokeStyle='rgba(255,255,255,.035)';x.lineWidth=1;for(let n=0;n<1080;n+=48){x.beginPath();x.moveTo(n,0);x.lineTo(n,1350);x.stroke();}
 round(64,48,64,64,16,blue);
 try{const logo=await new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src='/assets/logo.png';});x.drawImage(logo,72,56,48,48);}catch{ x.fillStyle=blue;x.textAlign='center';x.font='900 24px '+font;x.fillText('SSL',96,88); }
 x.textAlign='left';x.fillStyle='#ffffff';x.font='800 26px '+font;x.fillText(data.site?.name||'Sumqayıt Super Liqası',146,76);x.fillStyle='#b1c3da';x.font='600 19px '+font;x.fillText(String(data.league.season)+' · '+fanText('Minifutbol',lang),146,104);
 round(864,53,152,45,22,'rgba(255,255,255,.09)');x.textAlign='center';x.fillStyle='#b6e6ce';x.font='800 22px '+font;x.fillText('1 + 5',940,83);
 x.textAlign='left';x.fillStyle='#ffffff';x.font='800 47px '+font;
 const words=title.split(/\s+/);let lines=[],line='';for(const word of words){const next=line?line+' '+word:word;if(x.measureText(next).width>930&&line){lines.push(line);line=word;}else line=next;}if(line)lines.push(line);
 if(lines.length>2){x.font='800 38px '+font;lines=[title];while(x.measureText(lines[0]).width>930&&lines[0].length>3)lines[0]=lines[0].slice(0,-2);if(lines[0]!==title)lines[0]+='…';}
 lines.forEach((row,i)=>x.fillText(row,64,184+i*54));
 const left=74,top=286,width=932,height=900;
 round(left-12,top-12,width+24,height+24,26,'#244b48');x.save();x.beginPath();x.roundRect(left,top,width,height,17);x.clip();
 const turf=x.createLinearGradient(left,top,left+width,top+height);turf.addColorStop(0,'#1c754f');turf.addColorStop(.5,'#185f42');turf.addColorStop(1,'#10472f');x.fillStyle=turf;x.fillRect(left,top,width,height);
 for(let i=0;i<12;i++){x.fillStyle=i%2?'rgba(0,0,0,.075)':'rgba(255,255,255,.035)';x.fillRect(left,top+i*height/12,width,height/12);}
 // Deterministic fine grass marks: the PNG stays sharp at sharing size.
 x.fillStyle='rgba(210,255,227,.07)';for(let i=0;i<3800;i++){const gx=(i*127.1)%width,gy=(i*53.7)%height;x.fillRect(left+gx,top+gy,1,3);}
 const l=left+35,r=left+width-35,t=top+35,b=top+height-35,cy=top+height/2;
 x.strokeStyle='rgba(234,255,243,.65)';x.lineWidth=3;x.strokeRect(l,t,r-l,b-t);x.beginPath();x.moveTo(l,cy);x.lineTo(r,cy);x.stroke();x.beginPath();x.arc(540,cy,110,0,Math.PI*2);x.stroke();
 for(const [gy,side] of [[t,1],[b,-1]]){x.beginPath();x.moveTo(381,gy);x.bezierCurveTo(381,gy+side*154,699,gy+side*154,699,gy);x.stroke();x.beginPath();x.arc(540,gy+side*104,4,0,Math.PI*2);x.fillStyle='#d1eadb';x.fill();x.strokeRect(482,gy-side*22,116,22);}
 x.beginPath();x.arc(540,cy,4,0,Math.PI*2);x.fillStyle='#d1eadb';x.fill();
 const shade=x.createRadialGradient(540,cy,200,540,cy,710);shade.addColorStop(0,'rgba(1,15,10,0)');shade.addColorStop(1,'rgba(1,15,10,.32)');x.fillStyle=shade;x.fillRect(left,top,width,height);x.restore();
 const slots=FAN_FORMATIONS[formation],map=new Map(eligibleFanPlayers(data.league,settings).map(p=>[p.key,p]));x.textAlign='center';
 for(let i=0;i<FAN_LINEUP_SIZE;i++){
  const p=map.get(selected[i]);if(!p)continue;const px=left+slots[i].x/100*width,py=top+slots[i].y/100*height;
  x.save();x.translate(px,py-33);x.shadowColor='rgba(0,0,0,.4)';x.shadowBlur=17;x.shadowOffsetY=9;
  const shirt=x.createLinearGradient(-40,-40,40,50);shirt.addColorStop(0,i===0?'#ffe9a2':'#ffffff');shirt.addColorStop(1,i===0?'#d6aa35':'#cdddf1');x.fillStyle=shirt;
  x.beginPath();x.moveTo(-25,-38);x.lineTo(-58,-15);x.lineTo(-44,10);x.lineTo(-27,1);x.lineTo(-27,48);x.lineTo(27,48);x.lineTo(27,1);x.lineTo(44,10);x.lineTo(58,-15);x.lineTo(25,-38);x.lineTo(12,-29);x.lineTo(-12,-29);x.closePath();x.fill();x.shadowColor='transparent';
  x.strokeStyle=i===0?'#8b641a':blue;x.lineWidth=4;x.beginPath();x.moveTo(-12,-32);x.quadraticCurveTo(0,-14,12,-32);x.stroke();
  x.fillStyle=blue;x.fillRect(-27,33,54,6);x.font='900 33px '+font;x.fillText(String(p.n??i+1).slice(0,3),0,23);x.restore();
  const max=formation==='1-3-1'&&[2,3,4].includes(i)?252:326;let name=p.name;x.font='800 24px '+font;while(x.measureText(name).width>max-24&&name.length>3)name=name.slice(0,-2);if(name!==p.name)name+='…';
  const pill=Math.min(max,Math.max(112,x.measureText(name).width+28));round(px-pill/2,py+24,pill,39,8,'rgba(4,22,27,.86)');x.fillStyle='#ffffff';x.fillText(name,px,py+51);
  x.fillStyle='#c3e3d3';x.font='600 18px '+font;let club=p.teamName;while(x.measureText(club).width>max&&club.length>3)club=club.slice(0,-2);if(club!==p.teamName)club+='…';x.fillText(club,px,py+77);
 }
 x.textAlign='left';x.fillStyle='#b1c3da';x.font='600 20px '+font;x.fillText('sumgayitsuperleague.com',64,1271);x.textAlign='right';x.fillStyle='#ffffff';x.font='800 25px '+font;x.fillText(formation,1016,1271);
 return c;
}

function bindFanLineup(data,settings,lang){
 const box=document.querySelector('#fan-lineup');if(!box)return;const config=settings.lineup,e=fanEscape,t=s=>fanText(s,lang),all=eligibleFanPlayers(data.league,settings),map=new Map(all.map(p=>[p.key,p]));
 const key='ssl.fan.lineup.v1:'+data.league.season+':'+(data.league.edition||1),saved=fanStorageGet(key)||{},query=new URLSearchParams(location.search),hasQuery=Array.from({length:FAN_LINEUP_SIZE},(_,i)=>query.has('p'+i)).some(Boolean);
 let selection=normalizeFanLineup(data.league,settings,hasQuery?Array.from({length:FAN_LINEUP_SIZE},(_,i)=>query.get('p'+i)||''):saved.players),formation=config.formations.includes(fanFormation(query.get('formation')))?fanFormation(query.get('formation')):config.formations.includes(fanFormation(saved.formation))?fanFormation(saved.formation):config.defaultFormation,slot=0;
 const previousTitle=query.get('name')||saved.title,initialTitle=(!previousTitle||['Mənim ideal beşliyim','My ideal five','Моя идеальная пятёрка'].includes(previousTitle)?t('Mənim ideal altılığım'):previousTitle).slice(0,70);
 box.innerHTML='<div class="fz-lineup-tools"><label>'+t('Altılığının adı')+'<input id="fan-lineup-title" maxlength="70" value="'+e(initialTitle)+'"></label><label>'+t('Düzülüş')+'<select id="fan-formation">'+config.formations.map(f=>'<option'+(f===formation?' selected':'')+'>'+e(f)+'</option>').join('')+'</select></label></div><div class="fz-lineup-grid"><div><div class="fz-pitch-frame"><div class="fz-board-top"><span><img src="/assets/logo.png" alt=""><b>SUMQAYIT<br>SUPER LİQASI</b></span><span>1 + 5 · '+t('Minifutbol')+'</span></div><div class="fz-board-heading"><strong id="fan-board-title">'+e(initialTitle)+'</strong><small>'+t('1 qapıçı · 5 meydan oyunçusu')+'</small></div><div class="fz-pitch" id="fan-pitch" aria-label="'+t('İdeal altılıq')+'"><svg class="fz-pitch-lines" viewBox="0 0 600 760" preserveAspectRatio="none" aria-hidden="true"><rect x="30" y="30" width="540" height="700" rx="1"/><path d="M30 380H570M190 30C190 160 410 160 410 30M190 730C190 600 410 600 410 730"/><circle cx="300" cy="380" r="76"/><path d="M260 30V14H340V30M260 730V746H340V730"/><g class="fz-pitch-spots"><circle cx="300" cy="380" r="3"/><circle cx="300" cy="112" r="3"/><circle cx="300" cy="648" r="3"/></g></svg></div><div class="fz-board-bottom"><span><b id="fan-selected-count">0 / 6</b> '+t('seçilib')+'</span><strong id="fan-board-formation">'+e(formation)+'</strong></div></div><div class="fz-lineup-actions">'+(config.allowDownload?'<button class="btn pri" type="button" data-fan-download>'+t('Şəkli endir')+'</button>':'')+(config.allowShare?'<button class="btn sec" type="button" data-fan-copy>'+t('Keçidi kopyala')+'</button>':'')+'<button class="btn sec" type="button" data-fan-reset>'+t('Sıfırla')+'</button></div><p class="fz-muted">'+t('Seçimin yalnız bu brauzerdə saxlanılır.')+'</p><div id="fan-lineup-status" role="status" aria-live="polite"></div></div><section class="fz-panel fz-roster"><span class="fz-eyebrow">'+t('Heyətini tamamla')+'</span><h2 id="fan-slot-heading"></h2><p class="fz-muted fz-roster-hint">'+t('Mövqəni seç, futbolçunu əlavə et.')+'</p><label>'+t('Komanda')+'<select id="fan-team-filter"><option value="">'+t('Bütün komandalar')+'</option>'+data.league.teams.filter(a=>all.some(p=>p.team===a.id)).map(a=>'<option value="'+e(a.id)+'">'+e(a.name)+'</option>').join('')+'</select></label><label>'+t('Futbolçu axtar')+'<input id="fan-player-search" type="search"></label><div id="fan-player-list" class="fz-player-list"></div><button type="button" class="btn sec" data-fan-clear>'+t('Seçimi sil')+'</button></section></div>';
 const pitch=box.querySelector('#fan-pitch'),list=box.querySelector('#fan-player-list'),title=box.querySelector('#fan-lineup-title'),status=box.querySelector('#fan-lineup-status');
 const save=()=>{fanStorageSet(key,{players:selection,formation,title:title.value});box.querySelector('#fan-board-title').textContent=title.value||t('Mənim ideal altılığım');};
 const drawRoster=()=>{
  const team=box.querySelector('#fan-team-filter').value,q=box.querySelector('#fan-player-search').value.normalize('NFKC').toLocaleLowerCase('az');
  box.querySelector('#fan-slot-heading').textContent=t(slot===0?'Qapıçı':'Meydan oyunçusu')+' · '+(slot+1)+'/'+FAN_LINEUP_SIZE;
  const players=all.filter(p=>(!team||p.team===team)&&(!q||fanRosterLabel(p).toLocaleLowerCase('az').includes(q))&&(!config.strictGoalkeeper||(slot===0?!!p.gk:!p.gk)));
  list.innerHTML=players.map(p=>{const used=selection.includes(p.key)&&selection[slot]!==p.key,chosen=selection[slot]===p.key;return '<button class="fz-player'+(chosen?' is-selected':'')+'" type="button" data-fan-player="'+e(p.key)+'" aria-pressed="'+chosen+'"'+(used?' disabled':'')+'><span class="fz-player-no">'+e(p.n||'—')+'</span><span><strong>'+e(p.name)+'</strong><small>'+e(p.teamName)+(used?' · '+t('Başqa mövqedə seçilib'):chosen?' · '+t('Seçilib'):'')+'</small></span></button>';}).join('')||'<p>'+t('Bu seçimə uyğun futbolçu yoxdur.')+'</p>';
 };
 const drawPitch=()=>{
  pitch.querySelectorAll('[data-fan-slot]').forEach(n=>n.remove());
  FAN_FORMATIONS[formation].forEach((pos,i)=>{const p=map.get(selection[i]),button=document.createElement('button');button.type='button';button.dataset.fanSlot=i;button.className='fz-slot'+(p?' is-filled':'')+(slot===i?' is-active':'');button.style.left=pos.x+'%';button.style.top=pos.y+'%';button.setAttribute('aria-pressed',String(slot===i));button.setAttribute('aria-label',t(i===0?'Qapıçı':'Meydan oyunçusu')+' '+(i+1)+(p?': '+fanRosterLabel(p):': '+t('Futbolçu seç')));button.innerHTML='<span class="fz-shirt"><span>'+e(p?.n??'+')+'</span></span><strong title="'+e(p?.name||t('Futbolçu seç'))+'">'+e(p?.name||t(i===0?'Qapıçı':'Futbolçu seç'))+'</strong>'+(p?'<small title="'+e(p.teamName)+'">'+e(p.teamName)+'</small>':'');pitch.append(button);});
  box.querySelector('#fan-selected-count').textContent=selection.filter(Boolean).length+' / '+FAN_LINEUP_SIZE;box.querySelector('#fan-board-formation').textContent=formation;
  for(const b of box.querySelectorAll('[data-fan-download],[data-fan-copy]'))b.disabled=!selection.every(Boolean);save();
 };
 box.addEventListener('click',async event=>{
  const b=event.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-fan-slot')){slot=Number(b.dataset.fanSlot);drawPitch();drawRoster();}
  if(b.hasAttribute('data-fan-player')){selection[slot]=b.dataset.fanPlayer;status.textContent='';drawPitch();drawRoster();}
  if(b.hasAttribute('data-fan-clear')){selection[slot]='';drawPitch();drawRoster();}
  if(b.hasAttribute('data-fan-reset')){selection=Array(FAN_LINEUP_SIZE).fill('');slot=0;status.textContent='';drawPitch();drawRoster();}
  if(b.hasAttribute('data-fan-copy')){
   const url=new URL('/ideal-altiliq',location.origin);if(lang!=='az')url.searchParams.set('lang',lang);url.searchParams.set('formation',formation);url.searchParams.set('name',title.value||t('Mənim ideal altılığım'));selection.forEach((p,i)=>url.searchParams.set('p'+i,p));await fanCopyLink(url.href,status,lang);
  }
  if(b.hasAttribute('data-fan-download')){
   b.disabled=true;status.textContent=t('Şəkil hazırlanır…');
   try{const canvas=await fanLineupImage(data,settings,selection,formation,title.value||t('Mənim ideal altılığım'),lang),blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('Image failed');const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='sumqayit-ideal-altiliq.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);status.textContent=t('Şəkil hazırdır.');}catch{status.textContent=t('Şəkil hazırlanmadı. Yenidən sına.');}finally{b.disabled=!selection.every(Boolean);}
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
 const path=document.body.dataset.previewPath||location.pathname,page=FAN_PAGES[path]||({'final':'final','lineup':'lineup','quiz':'quiz','penalty':'penalty','timeline':'timeline'}[document.body.dataset.page]);
 if(page){
  const app=document.querySelector('#app');if(!app)return;app.innerHTML=renderFanPage(source,page,lang);document.title=fanText(settings[page].title,lang)+' · '+(source.site?.name||'Sumqayıt Super Liqası');
  if(!settings[page].enabled)return;
  if(page==='penalty')bindPenalty(source,settings,lang);if(page==='timeline')bindTimeline();
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
