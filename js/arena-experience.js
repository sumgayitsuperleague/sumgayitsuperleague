import {arenaSettings,arenaTeams,chooseArenaClubs,arenaSponsors,seasonKey,createDuel,duelStatus,recordDuelKick} from './arena-model.js';
import {makePenaltyShot,stepPenaltyShot,PHYSICS_STEP,gestureShot,clamp,randomSequence} from './penalty-physics.js';
const COPY={
 'Penalti arenası':['Penalty arena','Арена пенальти'],'Küncü seç. Topu sürüşdür. Seriyanı davam etdir.':['Pick a corner. Swipe the ball. Keep your streak alive.','Выбери угол. Проведи по мячу. Продолжай серию.'],
 'Mövsümün zaman tuneli':['Season time tunnel','Хроника сезона'],'İlk fitdən finala. Bu mövsümün hekayəsini birlikdə yenidən yaşa.':['From the first whistle to the final. Relive the season.','От первого свистка до финала. Проживи сезон заново.'],
 'Oyuna başla':['Enter the arena','Начать игру'],'Yüklənir…':['Loading…','Загрузка…'],'Oyun yüklənmədi. Yenidən sına.':['Could not load the game. Try again.','Не удалось загрузить игру. Попробуй ещё раз.'],
 'Seriya':['Streak','Серия'],'Məşq':['Practice','Тренировка'],'Rekord':['Best streak','Рекорд'],'Qol':['Goals','Голы'],'Zərbə':['Shots','Удары'],'Bu cihazda':['On this device','На этом устройстве'],
 'Asan':['Easy','Легко'],'Normal':['Normal','Обычно'],'Çətin':['Hard','Сложно'],'Çətinlik':['Difficulty','Сложность'],'Rejim':['Mode','Режим'],'Qrafika':['Graphics','Графика'],'Avtomatik':['Automatic','Автоматически'],'Yüngül':['Light','Лёгкая'],
 'Topdan qapıya doğru sürüşdür':['Swipe from the ball towards the goal','Проведи от мяча к воротам'],'Uzun və sürətli sürüşdürmə daha güclü zərbədir.':['A longer, faster swipe makes a stronger shot.','Длинный быстрый жест — более сильный удар.'],
 'Nişan al':['Aim','Прицелься'],'Sol yuxarı':['Top left','Левый верхний'],'Sağ yuxarı':['Top right','Правый верхний'],'Sol aşağı':['Bottom left','Левый нижний'],'Sağ aşağı':['Bottom right','Правый нижний'],'Mərkəz':['Centre','Центр'],'Zərbə vur':['Shoot','Ударить'],'Güc':['Power','Сила'],
 'QOOOL!':['GOOOAL!','ГОООЛ!'],'Qapıçı qurtardı':['Saved by the keeper','Вратарь спас'],'Dirək!':['Off the woodwork!','Штанга!'],'Çölə getdi':['Off target','Мимо ворот'],'Seriya bitdi':['Streak ended','Серия завершена'],
 'Növbəti zərbə':['Next shot','Следующий удар'],'Yenidən oyna':['Play again','Играть снова'],'Təkrar bax':['Replay','Повтор'],'Təkrar':['Replay','Повтор'],'Dayandır':['Pause','Пауза'],'Davam et':['Resume','Продолжить'],'Oyun dayandırılıb':['Game paused','Игра приостановлена'],
 'Səs':['Sound','Звук'],'Tam ekran':['Full screen','На весь экран'],'Ekranı kiçilt':['Exit full screen','Уменьшить экран'],'Təlimat':['How to play','Как играть'],'Oxlarla nişan al, boşluq düyməsi ilə vur.':['Aim with the arrow keys, shoot with Space.','Целься стрелками, бей пробелом.'],'Rekord yalnız bu brauzerdə saxlanır.':['Your record is stored only in this browser.','Рекорд хранится только в этом браузере.'],
 'Meydana çıx':['Play now','На поле'],'Tunelə daxil ol':['Explore the season','Открыть хронику'],'İlk fit':['First whistle','Первый свисток'],'Yarımfinal':['Semi-final','Полуфинал'],'Üçüncülük oyunu':['Third-place match','Матч за третье место'],'Final':['Final','Финал'],'Təşkilatçı qeydi':['Organizer’s note','Заметка организатора'],
 'İlk qeydə alınan oyun':['First recorded match','Первый записанный матч'],'Tamamlanmış oyun':['Completed matches','Завершённые матчи'],'Vurulan qol':['Goals scored','Забитые голы'],'Komanda':['Clubs','Команды'],'Hekayə':['Chapters','Главы'],'Əvvəlki fəsil':['Previous chapter','Предыдущая глава'],'Növbəti fəsil':['Next chapter','Следующая глава'],'Fəsil seç':['Choose a chapter','Выбрать главу'],
 'Tarix tezliklə':['Date to be confirmed','Дата будет объявлена'],'Planlaşdırılıb':['Upcoming','Предстоит'],'Canlı':['Live','Сейчас в игре'],'Tamamlanıb':['Completed','Завершён'],'Matç mərkəzi':['Match centre','Центр матча'],'Bu mövsümün hekayəsi tezliklə burada olacaq.':['This season’s story will appear here soon.','История этого сезона скоро появится здесь.'],'Mövsüm':['Season','Сезон'],'Oyuna qayıt':['Back to the game','Вернуться в игру'],
 'Öz komandanla':['With your club','Со своей командой'],'meydana çıx.':['take the pitch.','выходи на поле.'],'Komandanı seç. Rəqibini seç. Qələbəni qazan.':['Pick your club. Pick your rival. Earn the win.','Выбери команду. Выбери соперника. Победи.'],
 'Sənin komandan':['Your club','Твоя команда'],'Rəqib komanda':['Rival club','Команда соперника'],'Eyni komanda ilə qarşılaşmaq olmaz.':['Your club and rival must be different.','Команды должны быть разными.'],'Komandaları dəyiş':['Change clubs','Сменить команды'],'komanda':['clubs','команд'],
 'Penalti dueli':['Penalty duel','Дуэль пенальти'],'Oyun hesabı':['Match score','Счёт матча'],'zərbə':['kicks','ударов'],'Canlı stadion':['Stadium atmosphere','Атмосфера стадиона'],'Əlavə zərbələr':['Sudden death','Дополнительные удары'],
 'Sənin zərbən':['Your kick','Твой удар'],'Rəqibin zərbəsi':['Rival kick','Удар соперника'],'Rəqibin zərbəsinə bax':['Watch the rival kick','Смотреть удар соперника'],'Qələbə!':['Victory!','Победа!'],'Rəqib qalib gəldi':['Your rival wins','Соперник победил'],'Dueldə öz zərbəni vur, sonra rəqibin zərbəsinə bax. Bərabərlikdə əlavə zərbələr oynanır.':['Take your kick, then watch your rival. Ties go to sudden death.','Пробей, затем смотри удар соперника. При ничьей — дополнительные удары.'],
 'Arena tərəfdaşları':['Arena partners','Партнёры арены'],'Növbəti sponsor':['Next partner','Следующий партнёр'],'Reklamların hərəkətini dayandır':['Pause advertising rotation','Остановить смену рекламы'],'Reklamların hərəkətini davam etdir':['Resume advertising rotation','Продолжить смену рекламы']
};
export const arenaText=(s,lang='az')=>COPY[s]?.[lang==='en'?0:lang==='ru'?1:-1]||s;
export const penaltyInterfaceCopy=Object.entries(COPY).filter(([text])=>!['Mövsümün zaman tuneli','İlk fitdən finala. Bu mövsümün hekayəsini birlikdə yenidən yaşa.','Tunelə daxil ol','Əvvəlki fəsil','Növbəti fəsil','Fəsil seç','Hekayə','Bu mövsümün hekayəsi tezliklə burada olacaq.','Təşkilatçı qeydi','İlk qeydə alınan oyun','İlk fit'].includes(text)).map(([az,[en,ru]])=>[az,en,ru]);
const escapeHTML=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const e=escapeHTML;
const href=(path,lang)=>path+(['en','ru'].includes(lang)?'?lang='+lang:'');
export function renderArenaHome(data,lang='az'){
 const c=arenaSettings(data.cms?.fanZone).penalty,t=s=>arenaText(s,lang);if(!c.enabled||!c.showOnHome)return '';
 return `<section class="ax-home"><div class="wrap ax-home-grid"><a class="ax-home-card ax-home-penalty" href="${href('/penalti-arenasi',lang)}"><svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M6 33V9h36v24M6 13h36M12 9v24m8-24v16m8-16v16m8-16v24" stroke="currentColor" stroke-width="1.5"/><circle cx="24" cy="34" r="8" stroke="currentColor" stroke-width="1.5"/></svg><div><strong>${e(t(c.title))}</strong><span>${e(t('Meydana çıx'))} ↗ · ${arenaTeams(data).length} ${t('komanda')}</span></div><b aria-hidden="true">SSL</b></a></div></section>`;
}
export function renderArenaPage(data,page,settings,lang='az',links=''){
 if(page!=='penalty')return '';
 const c=arenaSettings(settings).penalty,t=s=>arenaText(s,lang),clubs=chooseArenaClubs(data,c.defaultTeam,c.defaultOpponent),sponsors=arenaSponsors(data,settings);
 const options=(selected,excluded='')=>clubs.teams.map(q=>`<option value="${e(q.id)}"${q.id===selected?' selected':''}${q.id===excluded?' disabled':''}>${e(q.name)}</option>`).join('');
 const teamField=(side,label,club,excluded='')=>`<label class="pa-club-pick"><span>${t(label)}</span><div><img id="pa-${side}-crest" src="${e(club?.logo||'/assets/logo.png')}" alt=""><select id="pa-${side}-team" aria-label="${t(label)}">${options(club?.id,excluded)}</select></div></label>`;
 const mode=c.defaultMode==='duel'&&c.allowDuel===false?'streak':c.defaultMode;
 return `<section class="sec fz-page ax-page"><div class="wrap"><header class="fz-heading ax-heading"><span class="fz-eyebrow">${e(data.league?.season||'')} · SUMQAYIT SUPER LİQASI</span><h1>${e(t(c.title))}</h1><p>${e(t(c.description))}</p></header>
 <section class="pa-shell" id="penalty-arena" data-home="${e(clubs.home?.id||'')}" data-away="${e(clubs.away?.id||'')}">
 <div class="pa-scorebar" aria-label="${t('Oyun hesabı')}"><div class="pa-score-club"><img id="pa-score-home-logo" src="${e(clubs.home?.logo||'/assets/logo.png')}" alt=""><div><strong id="pa-score-home-name">${e(clubs.home?.name||'')}</strong><span id="pa-home-kicks" class="pa-kick-dots"></span></div></div><div class="pa-score-centre"><small id="pa-match-label">${t(mode==='duel'?'Penalti dueli':'Seriya')}</small><b><span id="pa-home-score">0</span><i>:</i><span id="pa-away-score">0</span></b><span id="pa-round-label">${c.duelRounds} ${t('zərbə')}</span></div><div class="pa-score-club pa-score-away"><img id="pa-score-away-logo" src="${e(clubs.away?.logo||'/assets/logo.png')}" alt=""><div><strong id="pa-score-away-name">${e(clubs.away?.name||'')}</strong><span id="pa-away-kicks" class="pa-kick-dots"></span></div></div></div>
 <div class="pa-stage" id="penalty-stage" data-phase="menu"><div class="pa-scene" id="penalty-scene"></div><div class="pa-vignette" aria-hidden="true"></div>
 <div class="pa-hud" aria-label="${t('Seriya')}"><div><small>${t('Seriya')}</small><b id="pa-streak">0</b></div><span class="pa-hud-brand" id="pa-turn-label">SSL <i>ARENA</i></span><div><small>${t('Rekord')}</small><b id="pa-best">0</b></div></div>
 <div class="pa-menu" id="pa-menu"><div class="pa-menu-intro"><span class="pa-kicker">SSL ARENA · ${e(data.league?.season||'')}</span><strong>${t('Öz komandanla')}<br> <em>${t('meydana çıx.')}</em></strong><p>${t('Komandanı seç. Rəqibini seç. Qələbəni qazan.')}</p><span class="pa-menu-detail">${clubs.teams.length} ${t('komanda')} <i>·</i> ${t('Canlı stadion')} <i>·</i> ${t('Penalti dueli')}</span></div><div class="pa-menu-card"><div class="pa-club-selects">${teamField('home','Sənin komandan',clubs.home)}<span class="pa-vs">VS</span>${teamField('away','Rəqib komanda',clubs.away,clubs.home?.id)}</div><p class="pa-selection-hint">${t('Eyni komanda ilə qarşılaşmaq olmaz.')}</p><div class="pa-options"><label>${t('Rejim')}<select id="pa-mode">${c.allowDuel!==false?`<option value="duel"${mode==='duel'?' selected':''}>${t('Penalti dueli')}</option>`:''}<option value="streak"${mode==='streak'?' selected':''}>${t('Seriya')}</option>${c.allowPractice?`<option value="practice"${mode==='practice'?' selected':''}>${t('Məşq')}</option>`:''}</select></label><label>${t('Çətinlik')}<select id="pa-difficulty">${[['easy','Asan'],['normal','Normal'],['hard','Çətin']].map(([id,label])=>`<option value="${id}"${c.difficulty===id?' selected':''}>${t(label)}</option>`).join('')}</select></label><label>${t('Qrafika')}<select id="pa-quality"><option value="auto">${t('Avtomatik')}</option><option value="lite">${t('Yüngül')}</option></select></label></div><button class="pa-primary" type="button" id="pa-start"${!clubs.away?' disabled':''}>${t('Oyuna başla')} <span aria-hidden="true">↗</span></button><small>${t('Rekord yalnız bu brauzerdə saxlanır.')}</small></div></div>
 <div class="pa-result" id="pa-result" hidden><span id="pa-result-kicker"></span><strong id="pa-result-title"></strong><p id="pa-result-copy"></p><div><button type="button" class="pa-primary" id="pa-next">${t('Növbəti zərbə')}</button>${c.allowReplay?`<button type="button" class="pa-quiet" id="pa-replay">${t('Təkrar bax')}</button>`:''}</div></div><div class="pa-pause" id="pa-paused" hidden><strong>${t('Oyun dayandırılıb')}</strong><button type="button" class="pa-primary" id="pa-resume">${t('Davam et')}</button></div><div class="pa-bottom-hud"><span id="pa-hint">${t('Topdan qapıya doğru sürüşdür')}</span><div class="pa-power"><small>${t('Güc')}</small><meter id="pa-power" min="0" max="1" value=".75"></meter></div></div><div class="pa-status" id="pa-status" role="status" aria-live="polite"></div></div>
 <div class="pa-toolbar"><span><b id="pa-goals">0</b> ${t('Qol')} <i>·</i> <b id="pa-shots">0</b> ${t('Zərbə')}</span><div>${c.allowSound?`<button type="button" id="pa-sound" aria-pressed="false">${t('Səs')}</button>`:''}<button type="button" id="pa-fullscreen" aria-pressed="false">${t('Tam ekran')}</button><button type="button" id="pa-pause" disabled>${t('Dayandır')}</button><button type="button" id="pa-reset" disabled>${t('Yenidən oyna')}</button><button type="button" id="pa-clubs">${t('Komandaları dəyiş')}</button></div></div>
 ${sponsors.length?`<div class="pa-sponsor-ribbon" aria-label="${t('Arena tərəfdaşları')}"><span>${t('Arena tərəfdaşları')}</span><a id="pa-sponsor-link" href="${e(sponsors[0].url)}" target="_blank" rel="noopener noreferrer"><img id="pa-sponsor-logo" src="${e(sponsors[0].logo)}" alt="${e(sponsors[0].name)}"><b id="pa-sponsor-name">${e(sponsors[0].name)}</b></a><button type="button" id="pa-sponsor-next" aria-label="${t('Növbəti sponsor')}">→</button><button type="button" id="pa-sponsor-pause" aria-label="${t('Reklamların hərəkətini dayandır')}" aria-pressed="false">Ⅱ</button></div>`:''}</section>
 <details class="pa-assist"><summary>${t('Təlimat')} · ${t('Nişan al')}</summary><p>${t('Uzun və sürətli sürüşdürmə daha güclü zərbədir.')} ${t('Oxlarla nişan al, boşluq düyməsi ilə vur.')} ${t('Dueldə öz zərbəni vur, sonra rəqibin zərbəsinə bax. Bərabərlikdə əlavə zərbələr oynanır.')}</p><div class="pa-aim-buttons">${[['-1.65,1.65','Sol yuxarı'],['0,1','Mərkəz'],['1.65,1.65','Sağ yuxarı'],['-1.65,0.3','Sol aşağı'],['1.65,0.3','Sağ aşağı']].map(([aim,label])=>`<button type="button" data-pa-aim="${aim}" aria-pressed="false">${t(label)}</button>`).join('')}<button class="pa-primary" type="button" id="pa-shoot" disabled>${t('Zərbə vur')}</button></div></details>${links}</div></section>`;
}
// Start is the only operation that allocates a scene. All scores stay on device.
export function bindPenalty(data,settings,lang='az'){
 const root=document.querySelector('#penalty-arena');if(!root)return;
 const c=arenaSettings(settings).penalty,t=s=>arenaText(s,lang),get=id=>root.querySelector('#pa-'+id),stage=root.querySelector('#penalty-stage'),host=root.querySelector('#penalty-scene'),assist=document.querySelector('.pa-assist'),shootButton=document.querySelector('#pa-shoot'),sponsors=arenaSponsors(data,settings);
 const ui=Object.fromEntries(['menu','start','result','paused','hint','power','pause','reset','next','replay','sound','fullscreen','status','clubs'].map(id=>[id,get(id)]));
 let view=null,runtime=null,phase='menu',priorPhase='ready',shot=null,aim={x:1.4,y:1.5},idle=0,streak=0,best=0,goals=0,shots=0,difficulty=get('difficulty').value,mode=get('mode').value,drag=null,frameId=0,lastTime=0,accumulator=0,replayTime=0,resultShown=false,soundOn=false,audio=null,destroyed=false,loading=false,duel=createDuel(c.duelRounds),turn='home',expanded=false,nativeFullscreen=false,adTime=0,adIndex=0,adOffset=0,adsPaused=!c.sponsorMotion||matchMedia('(prefers-reduced-motion: reduce)').matches;
 let clubs=chooseArenaClubs(data,c.defaultTeam,c.defaultOpponent);
 try{const saved=window.parent!==window&&document.body.dataset.previewPath?null:JSON.parse(localStorage.getItem('ssl.fan.penalty.clubs.v2')||'null');if(saved)clubs=chooseArenaClubs(data,saved.home,saved.away);}catch{}
 const storageKey=()=> 'ssl.fan.penalty.v2:'+seasonKey(data.league)+':'+clubs.home?.id+':'+difficulty+':'+mode;
 const readBest=()=>{try{const raw=localStorage.getItem(storageKey())??(mode!=='duel'?localStorage.getItem('ssl.fan.penalty.v1:'+seasonKey(data.league)+':'+difficulty+':'+mode):null),n=Number(raw);return Number.isInteger(n)&&n>=0&&n<=100000?n:0;}catch{return 0;}};
 const announce=text=>{ui.status.textContent=text;};
 const sceneMatch=()=>({home:clubs.home,away:clubs.away,keeper:turn==='away'?clubs.home:clubs.away,turn,homeScore:mode==='duel'?duelStatus(duel).home:goals,awayScore:mode==='duel'?duelStatus(duel).away:0,sponsorIndex:adIndex});
 const updateScene=()=>view?.setMatch?.(sceneMatch());
 const renderDots=(side)=>{const values=duel[side],count=Math.max(c.duelRounds,values.length+(duel.winner?0:1));return Array.from({length:count},(_,i)=>`<i class="${values[i]?'is-'+(values[i]==='goal'?'goal':'miss'):''}" aria-label="${i+1}: ${values[i]?t(values[i]==='goal'?'Qol':'Çölə getdi'):'—'}">${values[i]?(values[i]==='goal'?'✓':'×'):''}</i>`).join('');};
 const stats=()=>{
  get('streak').textContent=streak;get('best').textContent=best;get('goals').textContent=goals;get('shots').textContent=shots;
  const state=duelStatus(duel),dueling=mode==='duel';root.dataset.mode=mode;root.dataset.turn=turn;
  get('home-score').textContent=dueling?state.home:goals;get('away-score').textContent=dueling?state.away:'—';
  get('match-label').textContent=t(dueling?'Penalti dueli':mode==='practice'?'Məşq':'Seriya');
  get('round-label').textContent=dueling?(state.suddenDeath?t('Əlavə zərbələr'):Math.min(state.round,c.duelRounds)+' / '+c.duelRounds):t('Sənin zərbən');
  for(const side of ['home','away']){get(side+'-kicks').innerHTML=dueling?renderDots(side):'';get('score-'+side+'-name').textContent=clubs[side]?.name||'';get('score-'+side+'-logo').src=clubs[side]?.logo||'/assets/logo.png';get('score-'+side+'-logo').alt=clubs[side]?.name||'';}
  get('turn-label').textContent=phase==='menu'?'SSL ARENA':t(turn==='away'?'Rəqibin zərbəsi':'Sənin zərbən');updateScene();
 };
 const syncClubs=(save=false)=>{
  clubs=chooseArenaClubs(data,get('home-team').value||clubs.home?.id,get('away-team').value||clubs.away?.id);
  get('home-team').value=clubs.home?.id||'';get('away-team').value=clubs.away?.id||'';
  for(const option of get('away-team').options)option.disabled=option.value===clubs.home?.id;
  for(const side of ['home','away']){get(side+'-crest').src=clubs[side]?.logo||'/assets/logo.png';get(side+'-crest').alt=clubs[side]?.name||'';root.dataset[side]=clubs[side]?.id||'';}
  ui.start.disabled=!clubs.away;best=readBest();stats();
  if(save)try{localStorage.setItem('ssl.fan.penalty.clubs.v2',JSON.stringify({home:clubs.home.id,away:clubs.away.id}));}catch{}
 };
 get('home-team').value=clubs.home?.id||'';get('away-team').value=clubs.away?.id||'';syncClubs();
 get('home-team').onchange=get('away-team').onchange=()=>syncClubs(true);
 const rotateSponsor=()=>{
  if(!sponsors.length)return;adIndex=(Math.floor(adTime/6)+adOffset)%sponsors.length;const q=sponsors[adIndex];get('sponsor-link').href=q.url;get('sponsor-logo').src=q.logo;get('sponsor-logo').alt=q.name;get('sponsor-name').textContent=q.name;updateScene();
 };
 if(get('sponsor-next'))get('sponsor-next').onclick=()=>{adOffset=(adOffset+1)%sponsors.length;rotateSponsor();};
 const adPauseLabel=()=>{const b=get('sponsor-pause');if(!b)return;b.setAttribute('aria-pressed',String(adsPaused));b.setAttribute('aria-label',t(adsPaused?'Reklamların hərəkətini davam etdir':'Reklamların hərəkətini dayandır'));b.textContent=adsPaused?'▶':'Ⅱ';};
 if(get('sponsor-pause'))get('sponsor-pause').onclick=()=>{adsPaused=!adsPaused;adPauseLabel();};adPauseLabel();
 const inputAllowed=()=>phase==='ready'&&turn==='home';
 const setPhase=value=>{phase=value;stage.dataset.phase=value;ui.menu.hidden=value!=='menu';ui.result.hidden=value!=='result';ui.paused.hidden=value!=='paused';ui.pause.disabled=!view||['menu','paused'].includes(value);ui.reset.disabled=!view;shootButton.disabled=!inputAllowed();stage.classList.toggle('pa-active',!!view);};
 const tone=type=>{
  if(!soundOn||!audio)return;try{const now=audio.currentTime,out=audio.createGain();out.connect(audio.destination);out.gain.setValueAtTime(type==='goal'?.08:.055,now);out.gain.exponentialRampToValueAtTime(.0001,now+.5);const frequencies=type==='goal'?[523.25,659.25,783.99]:type==='kick'?[110]:type==='post'?[880]:[155];frequencies.forEach((frequency,i)=>{const osc=audio.createOscillator();osc.type=type==='kick'?'triangle':'sine';osc.frequency.setValueAtTime(frequency,now+i*.08);if(type==='kick')osc.frequency.exponentialRampToValueAtTime(38,now+.11);osc.connect(out);osc.start(now+i*.08);osc.stop(now+.5);});}catch{}
 };
 const ready=()=>{shot=null;drag=null;accumulator=0;resultShown=false;turn=mode==='duel'?duelStatus(duel).turn:'home';stage.removeAttribute('data-outcome');ui.hint.textContent=t(turn==='home'?'Topdan qapıya doğru sürüşdür':'Rəqibin zərbəsi');ui.power.value=.75;setPhase('ready');stats();view?.canvas.focus({preventScroll:true});};
 const finish=()=>{
  if(resultShown||!shot?.result)return;resultShown=true;const outcome=shot.result;stage.dataset.outcome=outcome;
  if(turn==='home'){
   if(outcome==='goal'){goals++;streak++;if(streak>best){best=streak;try{localStorage.setItem(storageKey(),String(best));}catch{}}}else if(mode!=='streak')streak=0;
  }
  if(mode==='duel')duel=recordDuelKick(duel,turn,outcome);
  const state=duelStatus(duel),ended=mode==='streak'&&outcome!=='goal';
  get('result-kicker').textContent=mode==='duel'?(turn==='home'?clubs.home.name:clubs.away.name):t(ended?'Seriya bitdi':'Penalti arenası');
  get('result-title').textContent=mode==='duel'&&state.winner?t(state.winner==='home'?'Qələbə!':'Rəqib qalib gəldi'):t({goal:'QOOOL!',save:'Qapıçı qurtardı',post:'Dirək!',miss:'Çölə getdi'}[outcome]);
  get('result-copy').textContent=mode==='duel'?clubs.home.code+' '+state.home+' : '+state.away+' '+clubs.away.code+' · '+(state.suddenDeath?t('Əlavə zərbələr'):Math.min(state.round,c.duelRounds)+' / '+c.duelRounds):t('Seriya')+' '+streak+' · '+t('Rekord')+' '+best;
  ui.next.textContent=t(mode==='duel'?(state.winner?'Yenidən oyna':state.turn==='away'?'Rəqibin zərbəsinə bax':'Növbəti zərbə'):ended?'Yenidən oyna':'Növbəti zərbə');ui.hint.textContent=t('Nişan al');setPhase('result');stats();announce(get('result-title').textContent+'. '+get('result-copy').textContent);tone(outcome);
 };
 const fire=(target=aim,power=.75,spin=0,ai=false)=>{
  if(phase!=='ready'||!view||turn==='away'&&!ai)return;const seed=new Uint32Array(1);crypto.getRandomValues(seed);
  shot=makePenaltyShot({x:target.x,y:target.y,power,spin,difficulty:ai?({easy:'hard',normal:'normal',hard:'easy'}[difficulty]):difficulty,streak:turn==='home'?streak:0,seed:seed[0],idle});if(turn==='home')shots++;stats();ui.power.value=power;drag=null;accumulator=0;resultShown=false;setPhase('flight');ui.hint.textContent=turn==='away'?t('Rəqibin zərbəsi'):'';tone('kick');
 };
 const rivalKick=()=>{const seed=new Uint32Array(1);crypto.getRandomValues(seed);const rng=randomSequence(seed[0]),accuracy={easy:.75,normal:.9,hard:.98}[difficulty],wide=rng()>accuracy;fire({x:(rng()<.5?-1:1)*(wide?2.25:1.05+rng()*.72),y:.24+rng()*1.37},.65+rng()*.33,(rng()-.5)*.6,true);};
 const pause=()=>{if(!view||['menu','paused'].includes(phase))return;priorPhase=phase;drag=null;setPhase('paused');announce(t('Oyun dayandırılıb'));};
 const resume=()=>{if(phase!=='paused')return;lastTime=performance.now();setPhase(priorPhase);announce(t('Davam et'));view?.canvas.focus({preventScroll:true});};
 const expand=value=>{expanded=value;root.classList.toggle('pa-expanded',value);document.documentElement.classList.toggle('pa-game-expanded',value);ui.fullscreen.setAttribute('aria-pressed',String(value));ui.fullscreen.textContent=t(value?'Ekranı kiçilt':'Tam ekran');};
 const exitExpanded=()=>{expand(false);pause();if(document.fullscreenElement===root)document.exitFullscreen().catch(()=>{});};
 const fullscreenChanged=()=>{if(document.fullscreenElement===root)nativeFullscreen=true;else if(nativeFullscreen){nativeFullscreen=false;expand(false);pause();}};
 ui.fullscreen.onclick=()=>{if(expanded){exitExpanded();return;}expand(true);if(root.requestFullscreen)root.requestFullscreen().catch(()=>{});};document.addEventListener('fullscreenchange',fullscreenChanged);
 const installInput=()=>{
  const canvas=view.canvas;canvas.tabIndex=0;canvas.setAttribute('aria-label',t('Topdan qapıya doğru sürüşdür')+'. '+t('Oxlarla nişan al, boşluq düyməsi ilə vur.'));
  canvas.addEventListener('pointerdown',event=>{if(!inputAllowed()||!event.isPrimary||event.button!==0)return;const ball=view.ballScreen(),rect=canvas.getBoundingClientRect();if(Math.hypot(event.clientX-ball.x,event.clientY-ball.y)>Math.max(78,rect.height*.17))return;event.preventDefault();canvas.focus({preventScroll:true});canvas.setPointerCapture(event.pointerId);drag={id:event.pointerId,points:[{x:event.clientX,y:event.clientY,t:performance.now()}]};});
  canvas.addEventListener('pointermove',event=>{if(!drag||event.pointerId!==drag.id||!inputAllowed())return;event.preventDefault();drag.points.push({x:event.clientX,y:event.clientY,t:performance.now()});if(drag.points.length>90)drag.points.splice(1,1);aim=view.aimAt(event.clientX,event.clientY);ui.power.value=gestureShot(drag.points,canvas.getBoundingClientRect())?.power||.35;});
  canvas.addEventListener('pointerup',event=>{if(!drag||event.pointerId!==drag.id)return;const points=drag.points;points.push({x:event.clientX,y:event.clientY,t:performance.now()});drag=null;if(canvas.hasPointerCapture(event.pointerId))canvas.releasePointerCapture(event.pointerId);if(!inputAllowed())return;const gesture=gestureShot(points,canvas.getBoundingClientRect());if(gesture){aim=view.aimAt(event.clientX,event.clientY);fire(aim,gesture.power,gesture.spin);}});
  for(const name of ['pointercancel','lostpointercapture'])canvas.addEventListener(name,()=>{drag=null;});
  canvas.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();if(expanded)exitExpanded();else phase==='paused'?resume():pause();return;}if(!inputAllowed())return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' ','Enter'].includes(event.key)){event.preventDefault();if([' ','Enter'].includes(event.key))fire();else{aim.x=clamp(aim.x+({ArrowLeft:-.16,ArrowRight:.16}[event.key]||0),-3,3);aim.y=clamp(aim.y+({ArrowUp:.13,ArrowDown:-.13}[event.key]||0),.12,2.8);}}});
 };
 const tick=now=>{
  if(destroyed)return;frameId=requestAnimationFrame(tick);const delta=Math.min(.25,Math.max(0,(now-lastTime)/1000||0));lastTime=now;if(!view||phase==='paused'||document.hidden)return;idle+=delta;
  if(!adsPaused){const old=adIndex;adTime+=delta;if(sponsors.length&&(Math.floor(adTime/6)+adOffset)%sponsors.length!==old)rotateSponsor();}
  if(phase==='flight'&&shot){accumulator+=delta;while(accumulator>=PHYSICS_STEP){stepPenaltyShot(shot);accumulator-=PHYSICS_STEP;}if(shot.result&&shot.t-shot.resolvedAt>.68)finish();}
  if(phase==='result'&&shot&&shot.t<2.5){accumulator+=delta;while(accumulator>=PHYSICS_STEP){stepPenaltyShot(shot);accumulator-=PHYSICS_STEP;}}
  if(phase==='replay'&&shot){replayTime+=delta*.45;if(replayTime>=shot.history.at(-1).t+.3){setPhase('result');ui.hint.textContent=t('Nişan al');}}
  const replayFrame=phase==='replay'?shot.history.reduce((frame,next)=>next.t<=replayTime?next:frame,shot.history[0]):null;
  view.render({shot,idle,replay:phase==='replay',replayFrame,aim,aiming:inputAllowed()&&!!drag,phase,delta,sponsorIndex:adIndex});
 };
 const reset=()=>{streak=0;goals=0;shots=0;duel=createDuel(c.duelRounds);turn='home';difficulty=get('difficulty').value;mode=get('mode').value;best=readBest();ready();announce(t('Topdan qapıya doğru sürüşdür'));};
 ui.start.onclick=async()=>{
  if(loading||destroyed||!clubs.away)return;loading=true;ui.start.disabled=true;ui.start.textContent=t('Yüklənir…');
  try{runtime=await import(new URL('./penalty-runtime.js?v=20261021clubs',import.meta.url).href);if(destroyed)return;
   view=runtime.createPenaltyView(host,{forceLite:get('quality').value==='lite',sponsors,onContextLost:()=>{if(destroyed)return;pause();view?.destroy();view=runtime.createPenaltyView(host,{forceLite:true,sponsors});installInput();updateScene();announce(t('Davam et'));}});
   installInput();reset();if(!expanded&&matchMedia('(max-width:760px)').matches)root.scrollIntoView({block:'center',behavior:'instant'});lastTime=performance.now();cancelAnimationFrame(frameId);frameId=requestAnimationFrame(tick);
  }catch(error){announce(t('Oyun yüklənmədi. Yenidən sına.'));console.error('Penalty arena load failed:',error);}
  finally{loading=false;ui.start.disabled=false;ui.start.textContent=t('Oyuna başla');}
 };
 ui.next.onclick=()=>{if(mode==='duel'){if(duelStatus(duel).winner){reset();return;}ready();if(turn==='away')rivalKick();return;}if(mode==='streak'&&shot?.result!=='goal'){streak=0;goals=0;shots=0;}ready();};
 if(ui.replay)ui.replay.onclick=()=>{if(phase!=='result'||!shot?.history.length)return;replayTime=0;setPhase('replay');ui.hint.textContent=t('Təkrar');};
 ui.pause.onclick=pause;get('resume').onclick=resume;ui.reset.onclick=reset;
 ui.clubs.onclick=()=>{view?.destroy();view=null;cancelAnimationFrame(frameId);shot=null;duel=createDuel(c.duelRounds);turn='home';goals=shots=streak=0;setPhase('menu');stats();ui.start.focus();};
 if(ui.sound)ui.sound.onclick=async()=>{soundOn=!soundOn;if(soundOn){try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw Error('Audio unavailable');audio||=new Audio();await audio.resume();}catch{soundOn=false;}}ui.sound.setAttribute('aria-pressed',String(soundOn));if(soundOn)tone('kick');};
 assist.addEventListener('click',event=>{const button=event.target.closest('[data-pa-aim]');if(button){const [x,y]=button.dataset.paAim.split(',').map(Number);aim={x,y};assist.querySelectorAll('[data-pa-aim]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));if(inputAllowed())announce(button.textContent);}if(event.target.closest('#pa-shoot'))fire();});
 const hidden=()=>{if(document.hidden)pause();};document.addEventListener('visibilitychange',hidden);
 const visibility=new IntersectionObserver(entries=>{if(entries[0]&&!entries[0].isIntersecting&&!expanded)pause();},{threshold:0});visibility.observe(stage);
 get('difficulty').onchange=get('mode').onchange=()=>{difficulty=get('difficulty').value;mode=get('mode').value;best=readBest();stats();};
 const clearRecord=()=>{best=0;stats();};window.addEventListener('ssl-preferences-reset',clearRecord);
 const onPageHide=event=>{if(event.persisted)pause();else dispose();};
 const dispose=()=>{destroyed=true;window.removeEventListener('pagehide',onPageHide);cancelAnimationFrame(frameId);visibility.disconnect();view?.destroy();audio?.close().catch(()=>{});document.documentElement.classList.remove('pa-game-expanded');document.removeEventListener('fullscreenchange',fullscreenChanged);document.removeEventListener('visibilitychange',hidden);window.removeEventListener('ssl-preferences-reset',clearRecord);};
 window.addEventListener('pagehide',onPageHide);return dispose;
}
