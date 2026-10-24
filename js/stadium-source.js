// Shared, validated experience settings. Legacy instrumental presets remain readable.
export const STADIUM_PRESETS=[
 {id:'meydan',title:'Meydan bizimdir',bpm:112,root:50,chords:[0,3,10,8],melody:[0,3,7,10,7,3,5,7,0,3,7,12,10,7,5,3]},
 {id:'sumqayit',title:'Sumqayıt ritmi',bpm:124,root:52,chords:[0,3,10,8],melody:[7,7,10,12,10,7,3,5,7,10,14,12,10,7,5,3]},
 {id:'tribuna',title:'Tribuna',bpm:104,root:55,chords:[0,8,3,10],melody:[0,0,7,5,3,5,7,10,12,10,7,5,3,0,3,7]},
 {id:'start',title:'Başlama fitindən əvvəl',bpm:118,root:57,chords:[0,3,10,8],melody:[0,7,12,10,7,5,3,5,7,12,15,14,12,10,7,3]},
 {id:'gece',title:'Gecə oyunu',bpm:96,root:48,chords:[0,8,3,10],melody:[0,3,5,7,10,7,5,3,0,5,7,12,10,7,3,0]},
 {id:'qelebe',title:'Qələbəyə doğru',bpm:128,root:59,chords:[0,8,3,10],melody:[7,10,12,14,12,10,7,5,3,7,10,12,15,14,12,7]}
];
export const WORLD_CUP_TRACKS=[
 {id:'waka-waka',title:'Shakira · Waka Waka',video:'pRpeEdMmmQ0'},
 {id:'wavin-flag',title:"K’NAAN · Wavin’ Flag",video:'WTJSt4wP2ME'},
 {id:'la-la-la',title:'Shakira · La La La (Brazil 2014)',video:'7-7knsP2n5w'},
 {id:'we-are-one',title:'Pitbull · We Are One (Ole Ola)',video:'TGtWWb9emYI'},
 {id:'hayya-hayya',title:'Trinidad Cardona, Davido & Aisha · Hayya Hayya',video:'vyDjFVZgJoo'},
 {id:'dreamers',title:'Jung Kook & Fahad Al Kubaisi · Dreamers',video:'IwzkfMmNMpM'}
];
// Named audio slots, not a licence or a hidden video player. The organiser
// supplies an authorised audio URL before enabling any recording.
export const worldCupAudioSlots=()=>WORLD_CUP_TRACKS.map(p=>({id:p.id,title:p.title,preset:'meydan',source:'url',url:'',enabled:false}));
export const MUSIC_LIBRARY=[
 {id:'edm-detection-mode',title:'Kevin MacLeod · EDM Detection Mode',file:'EDM Detection Mode',isrc:'USUAN1500026'},
 {id:'raving-energy',title:'Kevin MacLeod · Raving Energy',file:'Raving Energy',isrc:'USUAN1900013'},
 {id:'laserpack',title:'Kevin MacLeod · Laserpack',file:'Laserpack'},
 {id:'rising-tide',title:'Kevin MacLeod · Rising Tide',file:'Rising Tide'},
 {id:'realizer',title:'Kevin MacLeod · Realizer',file:'Realizer'},
 {id:'ethernight-club',title:'Kevin MacLeod · Ethernight Club',file:'Ethernight Club'}
];
export const musicLibraryTracks=()=>MUSIC_LIBRARY.map(p=>({id:p.id,title:p.title,preset:'meydan',source:'url',url:'https://incompetech.com/music/royalty-free/mp3-royaltyfree/'+encodeURIComponent(p.file)+'.mp3',enabled:true}));
export function youtubeVideoID(value){
 if(typeof value!=='string'||value.length>1000||/[<>\\\u0000-\u0020]/.test(value))return '';
 try{const u=new URL(value);if(u.protocol!=='https:'||u.username||u.password||u.port)return '';const host=u.hostname.toLowerCase();let id='';
 if(host==='youtu.be'&&/^\/[a-zA-Z0-9_-]{11}\/?$/.test(u.pathname))id=u.pathname.slice(1).replace(/\/$/,'');
 if(['youtube.com','www.youtube.com','m.youtube.com','www.youtube-nocookie.com'].includes(host)){if(u.pathname==='/watch')id=u.searchParams.get('v')||'';else id=u.pathname.match(/^\/(?:embed|live|shorts)\/([a-zA-Z0-9_-]{11})\/?$/)?.[1]||'';}
 return /^[a-zA-Z0-9_-]{11}$/.test(id)?id:'';}catch{return '';}
}
export const cursorSize=value=>value===32?20:value===40?24:[16,20,24].includes(value)?value:20;
export function defaultStadium(){return {
 version:3,
 cursor:{mode:'football',size:20,touch:true},
 clock:{enabled:true,seconds:true},
 motion:{enabled:true,level:'balanced',reveal:true,interactions:true,progress:true,intro:true,mobile3d:true,slideDepth:true,opening:'match',featureFirst:true,presentation:'official',navigationLabels:true,featuredVideo:'',scene:'stand',transition:'slide',depth:true,carousel:true,autoplay:true,interval:6},
 music:{enabled:false,autoplay:true,shuffle:true,volume:25,tracks:worldCupAudioSlots()},
 broadcast:{enabled:true,home:true,cards:true,label:'YouTube-da canlı izlə'}
};}
export function stadiumSettings(value){
 const defaults=defaultStadium();for(const key of ['cursor','clock','motion','music','broadcast'])defaults[key]={...defaults[key],...(value?.[key]||{})};
 // The owner requested replacement of every previous visual world. Upgrade once;
 // choices made in the new editor, including legacy presentations, remain stable.
 if(value?.version!==3)defaults.motion.presentation='official';
 defaults.cursor.size=cursorSize(defaults.cursor.size);
 if(value?.cursor&&![2,3].includes(value.version))defaults.cursor={...defaults.cursor,mode:'football',size:20};
 // Upgrade only untouched stock packs, preserving custom audio and owner switches.
 const tracks=defaults.music.tracks;
 const stockSynth=Array.isArray(tracks)&&tracks.length===6&&tracks.every(t=>t.source==='original'&&t.url===''&&STADIUM_PRESETS.some(p=>p.id===t.id&&p.id===t.preset&&p.title===t.title));
 const stockVideo=Array.isArray(tracks)&&tracks.length===6&&tracks.every(t=>t.source==='youtube'&&WORLD_CUP_TRACKS.some(p=>p.id===t.id&&p.title===t.title&&p.video===youtubeVideoID(t.url)));
 const stockAudio=Array.isArray(tracks)&&tracks.length===6&&tracks.every(t=>t.source==='url'&&musicLibraryTracks().some(p=>p.id===t.id&&p.title===t.title&&p.url===t.url));
 if(stockSynth||stockVideo||stockAudio){defaults.music.tracks=worldCupAudioSlots();defaults.music.enabled=false;}
 return defaults;
}
export function featuredStadiumVideo(videos=[],selected=''){
 const published=videos.filter(v=>v.published).slice().sort((a,b)=>b.date.localeCompare(a.date)||b.id.localeCompare(a.id));
 return published.find(v=>v.id===selected)||published.find(v=>(v.kind||'match')==='match')||published[0];
}
export function audioURL(value){
 if(typeof value!=='string'||value.length>1000||/[<>\\\u0000-\u0020]/.test(value))return false;
 if(/^\/assets\/audio\/[a-z0-9_-]+\.(?:mp3|m4a|ogg|wav)$/.test(value))return true;
 try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&/\.(?:mp3|m4a|ogg|wav)$/i.test(u.pathname);}catch{return false;}
}
export function audioOrigins(stadium){return [...new Set((stadium?.music?.tracks||[]).filter(t=>t.enabled&&t.source==='url'&&audioURL(t.url)&&t.url.startsWith('https:')).map(t=>new URL(t.url).origin))];}
const object=x=>x&&typeof x==='object'&&!Array.isArray(x),keys=(x,n)=>object(x)&&Object.keys(x).every(k=>n.includes(k)),bool=x=>typeof x==='boolean',int=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b,text=(x,n)=>typeof x==='string'&&x.trim()&&x.length<=n&&!/[<>\u0000-\u001f]/.test(x);
export function validateStadium(s){
 const e=[],check=(v,m)=>{if(!v)e.push(m);return v;};
 if(!check(keys(s,['version','cursor','clock','motion','music','broadcast']),'Sayt effektlərinin quruluşu düzgün deyil.'))return e;
 check(s.version===undefined||[2,3].includes(s.version),'Sayt effektlərinin versiyası düzgün deyil.');
 const c=s.cursor,k=s.clock,m=s.motion,a=s.music,b=s.broadcast;
 check(keys(c,['mode','size','touch'])&&['system','football'].includes(c.mode)&&[16,20,24,32,40].includes(c.size)&&bool(c.touch),'Futbol göstəricisinin ayarları düzgün deyil.');
 check(keys(k,['enabled','seconds'])&&bool(k.enabled)&&bool(k.seconds),'Bakı saatının ayarları düzgün deyil.');
 check(keys(m,['enabled','level','reveal','interactions','progress','intro','mobile3d','slideDepth','opening','featureFirst','presentation','navigationLabels','featuredVideo','scene','transition','depth','carousel','autoplay','interval'])&&['none','fade','slide'].includes(m.transition)&&['depth','carousel','autoplay'].every(x=>bool(m[x]))&&int(m.interval,5,30)&&['enabled','reveal','interactions','progress','intro','mobile3d','slideDepth','featureFirst','navigationLabels'].every(x=>m[x]===undefined||bool(m[x]))&&(m.level===undefined||['subtle','balanced','expressive'].includes(m.level))&&(m.opening===undefined||['news','match','media'].includes(m.opening))&&(m.presentation===undefined||['official','arena','panorama','broadcast','classic'].includes(m.presentation))&&(m.scene===undefined||['stand','touchline','aerial'].includes(m.scene))&&(m.featuredVideo===undefined||m.featuredVideo===''||text(m.featuredVideo,120)),'Slayd və hərəkət ayarları düzgün deyil.');
 if(check(keys(a,['enabled','autoplay','shuffle','volume','tracks'])&&['enabled','autoplay','shuffle'].every(x=>bool(a[x]))&&int(a.volume,0,100)&&Array.isArray(a.tracks)&&a.tracks.length<=12,'Musiqi ayarları düzgün deyil.')){
  const ids=new Set();for(const t of a.tracks){if(!check(keys(t,['id','title','preset','source','url','enabled']),'Musiqi sətrinin quruluşu düzgün deyil.'))continue;check(text(t.id,80)&&/^[a-z0-9][a-z0-9_-]*$/.test(t.id)&&!ids.has(t.id)&&text(t.title,120)&&STADIUM_PRESETS.some(p=>p.id===t.preset)&&['original','url','youtube'].includes(t.source)&&bool(t.enabled)&&(t.source==='original'?t.url==='':t.source==='youtube'?!!youtubeVideoID(t.url):audioURL(t.url)||!t.enabled&&t.url===''),'Musiqinin adı, növü və ya audio keçidi düzgün deyil.');ids.add(t.id);}
  check(!a.enabled||a.tracks.some(t=>t?.enabled),'Pleyer aktivdirsə ən azı bir musiqi seç.');
 }
 check(keys(b,['enabled','home','cards','label'])&&['enabled','home','cards'].every(x=>bool(b[x]))&&text(b.label,100),'Canlı yayım düyməsinin ayarları düzgün deyil.');return e;
}
export function nextTrack(tracks,current,shuffle,random=Math.random){const active=tracks.filter(t=>t.enabled);if(!active.length)return null;if(active.length===1)return active[0];const at=active.findIndex(t=>t.id===current);if(!shuffle)return active[(at+1)%active.length];const choices=active.filter(t=>t.id!==current);return choices[Math.min(choices.length-1,Math.floor(random()*choices.length))];}
export const STADIUM_COPY=[
 ['Pleyeri sürüşdür','Drag music player','Перетащить плеер'],['Yeri qaytar','Reset position','Вернуть на место'],['Pleyeri yerinə qaytar','Reset player position','Вернуть плеер на место'],
 ['Musiqi idarəetməsi','Music controls','Управление музыкой'],
 ['Son nəticələr','Latest results','Последние результаты'],
 ['Meydana baxış','Pitch view','Вид на поле'],
 ['Tribunadan','From the stand','С трибуны'],
 ['Yan xətdən','Touchline','С боковой линии'],
 ['Yuxarıdan','Aerial','Сверху'],
 ['Səhnəni dayandır','Pause scene','Приостановить сцену'],
 ['Səhnəni davam etdir','Resume scene','Продолжить сцену'],
 ['Matç','Match','Матч'],['Xəbər','News','Новости'],['Liqadan','From the league','Из лиги'],['Seçilmiş video','Featured video','Выбранное видео'],

 ['Şəhərin oyunu.','The city’s game.','Игра нашего города.'],['Bizim liqa.','Our league.','Наша лига.'],
 ['Oyunun nəticəsi','Match result','Результат матча'],['Musiqi dayandırıldı.','Music paused.','Музыка приостановлена.'],['Musiqi səslənir.','Music is playing.','Музыка играет.'],['Musiqi yüklənir…','Loading music…','Музыка загружается…'],['Musiqi açılmadı. Yenidən play düyməsinə toxun.','Unable to play music. Tap play to try again.','Не удалось включить музыку. Нажмите ещё раз.'],['Musiqi kreditləri','Music credits','Авторы музыки'],['Fon musiqiləri Kevin MacLeod tərəfindən hazırlanıb.','Background music by Kevin MacLeod.','Фоновая музыка — Kevin MacLeod.'],['Musiqilər dəyişdirilməyib.','The recordings are unmodified.','Записи использованы без изменений.'],
 ['Musiqi pleyerini aç','Open music player','Открыть музыкальный плеер'],['Musiqi pleyerini bağla','Close music player','Закрыть музыкальный плеер'],['Musiqi','Music','Музыка'],['Videoya bax','Show video','Показать видео'],['YouTube musiqisi video açıldıqda səslənir.','YouTube music plays while the video is open.','Музыка YouTube играет, пока открыто видео.'],

 ['Futbol musiqiləri','Football anthems','Футбольные хиты'],['YouTube-da aç','Open on YouTube','Открыть на YouTube'],['Pleyeri yığışdır','Minimise player','Свернуть плеер'],['Video yüklənir…','Loading video…','Загрузка видео…'],['Videoda ▶ düyməsinə toxun','Tap ▶ in the video','Нажмите ▶ в видео'],['Video bu saytda açılmadı. YouTube-da dinlə və ya növbəti mahnını seç.','Video unavailable here. Open YouTube or choose the next track.','Видео здесь недоступно. Откройте YouTube или выберите следующий трек.'],['Slayd','Slide','Слайд'],['Futbol axşamı','Football nights','Футбольный вечер'],['Eyni meydan. Yeni hekayələr.','One pitch. New stories.','Одно поле. Новые истории.'],['Komandaları kəşf et','Explore the clubs','Познакомьтесь с командами'],['Yayım başlamayıb','Broadcast has not started','Трансляция ещё не началась'],

 ['Dil, sevimli komanda, saxlanmış video və musiqi seçimləri bu cihazdan silinir.','Language, favourite club, saved videos and music preferences are removed from this device.','С этого устройства удаляются язык, любимая команда, сохранённые видео и настройки музыки.'],
 ['Bakı vaxtı','Baku time','Время Баку'],['Musiqini aç','Play music','Включить музыку'],['Musiqini dayandır','Pause music','Приостановить музыку'],['Musiqi ayarları','Music settings','Настройки музыки'],['Növbəti musiqi','Next track','Следующий трек'],['Mahnını seç','Choose a track','Выберите трек'],['Səs səviyyəsi','Volume','Громкость'],['Qarışıq sıra','Shuffle','Случайный порядок'],['Ayarları bağla','Close settings','Закрыть настройки'],['Musiqi üçün toxun','Tap to play music','Нажмите, чтобы включить музыку'],['Musiqi açılmadı. Başqa musiqi seç.','Unable to play. Choose another track.','Не удалось включить. Выберите другой трек.'],['Əvvəlki slayd','Previous slide','Предыдущий слайд'],['Növbəti slayd','Next slide','Следующий слайд'],['Slaydları dayandır','Pause slideshow','Приостановить слайды'],['Slaydları davam etdir','Resume slideshow','Продолжить слайды'],['Liqa slaydları','League slideshow','Слайды лиги'],['YouTube-da canlı izlə','Watch live on YouTube','Смотреть в прямом эфире на YouTube'],['Meydan bizimdir','Our pitch','Наше поле'],['Sumqayıt ritmi','Sumgayit rhythm','Ритм Сумгаита'],['Tribuna','The stands','Трибуна'],['Başlama fitindən əvvəl','Before kick-off','Перед началом'],['Gecə oyunu','Night match','Вечерний матч'],['Qələbəyə doğru','Towards victory','Навстречу победе'],['Meydanın növbəti görüşü','Next on the pitch','Следующий матч'],['Oyunu izlə. Liqanı yaşa.','Watch the game. Feel the league.','Смотрите игру. Живите лигой.'],['Matç arxivi və yayımlar','Match archive and broadcasts','Архив матчей и трансляции']
];

STADIUM_COPY.push(...[["Əvvəlki mahnı", "Previous track", "Предыдущая песня"], ["Növbəti mahnı", "Next track", "Следующая песня"], ["10 saniyə geri", "Back 10 seconds", "Назад на 10 секунд"], ["10 saniyə irəli", "Forward 10 seconds", "Вперёд на 10 секунд"], ["Mahnının vaxtı", "Track position", "Позиция песни"], ["Mahnını seç", "Choose a track", "Выбрать песню"], ["Canlı və tamamlanmış oyunların qolları.", "Goals from live and completed matches.", "Голы текущих и завершённых матчей."]]);
