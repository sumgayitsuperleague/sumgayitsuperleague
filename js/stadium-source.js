// Site experience settings. The six instrumental themes are original note patterns.
export const STADIUM_PRESETS=[
 {id:'meydan',title:'Meydan bizimdir',bpm:112,root:50,chords:[0,3,10,8],melody:[0,3,7,10,7,3,5,7,0,3,7,12,10,7,5,3]},
 {id:'sumqayit',title:'Sumqayıt ritmi',bpm:124,root:52,chords:[0,3,10,8],melody:[7,7,10,12,10,7,3,5,7,10,14,12,10,7,5,3]},
 {id:'tribuna',title:'Tribuna',bpm:104,root:55,chords:[0,8,3,10],melody:[0,0,7,5,3,5,7,10,12,10,7,5,3,0,3,7]},
 {id:'start',title:'Başlama fitindən əvvəl',bpm:118,root:57,chords:[0,3,10,8],melody:[0,7,12,10,7,5,3,5,7,12,15,14,12,10,7,3]},
 {id:'gece',title:'Gecə oyunu',bpm:96,root:48,chords:[0,8,3,10],melody:[0,3,5,7,10,7,5,3,0,5,7,12,10,7,3,0]},
 {id:'qelebe',title:'Qələbəyə doğru',bpm:128,root:59,chords:[0,8,3,10],melody:[7,10,12,14,12,10,7,5,3,7,10,12,15,14,12,7]}
];
export function defaultStadium(){return {
 cursor:{mode:'football',size:32,touch:true},
 clock:{enabled:true,seconds:true},
 motion:{transition:'slide',depth:true,carousel:true,autoplay:true,interval:7},
 music:{enabled:true,autoplay:true,shuffle:true,volume:25,tracks:STADIUM_PRESETS.map(p=>({id:p.id,title:p.title,preset:p.id,source:'original',url:'',enabled:true}))},
 broadcast:{enabled:true,home:true,cards:true,label:'YouTube-da canlı izlə'}
};}
export function stadiumSettings(value){const defaults=defaultStadium();for(const key of Object.keys(defaults))defaults[key]={...defaults[key],...(value?.[key]||{})};return defaults;}
export function audioURL(value){
 if(typeof value!=='string'||value.length>1000||/[<>\\\u0000-\u0020]/.test(value))return false;
 if(/^\/assets\/audio\/[a-z0-9_-]+\.(?:mp3|m4a|ogg|wav)$/.test(value))return true;
 try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&/\.(?:mp3|m4a|ogg|wav)$/i.test(u.pathname);}catch{return false;}
}
export function audioOrigins(stadium){return [...new Set((stadium?.music?.tracks||[]).filter(t=>t.enabled&&t.source==='url'&&audioURL(t.url)&&t.url.startsWith('https:')).map(t=>new URL(t.url).origin))];}
const object=x=>x&&typeof x==='object'&&!Array.isArray(x),keys=(x,n)=>object(x)&&Object.keys(x).every(k=>n.includes(k)),bool=x=>typeof x==='boolean',int=(x,a,b)=>Number.isInteger(x)&&x>=a&&x<=b,text=(x,n)=>typeof x==='string'&&x.trim()&&x.length<=n&&!/[<>\u0000-\u001f]/.test(x);
export function validateStadium(s){
 const e=[],check=(v,m)=>{if(!v)e.push(m);return v;};
 if(!check(keys(s,['cursor','clock','motion','music','broadcast']),'Sayt effektlərinin quruluşu düzgün deyil.'))return e;
 const c=s.cursor,k=s.clock,m=s.motion,a=s.music,b=s.broadcast;
 check(keys(c,['mode','size','touch'])&&['system','football'].includes(c.mode)&&[24,32,40].includes(c.size)&&bool(c.touch),'Futbol göstəricisinin ayarları düzgün deyil.');
 check(keys(k,['enabled','seconds'])&&bool(k.enabled)&&bool(k.seconds),'Bakı saatının ayarları düzgün deyil.');
 check(keys(m,['transition','depth','carousel','autoplay','interval'])&&['none','fade','slide'].includes(m.transition)&&['depth','carousel','autoplay'].every(x=>bool(m[x]))&&int(m.interval,5,30),'Slayd və hərəkət ayarları düzgün deyil.');
 if(check(keys(a,['enabled','autoplay','shuffle','volume','tracks'])&&['enabled','autoplay','shuffle'].every(x=>bool(a[x]))&&int(a.volume,0,100)&&Array.isArray(a.tracks)&&a.tracks.length<=12,'Musiqi ayarları düzgün deyil.')){
  const ids=new Set();for(const t of a.tracks){if(!check(keys(t,['id','title','preset','source','url','enabled']),'Musiqi sətrinin quruluşu düzgün deyil.'))continue;check(text(t.id,80)&&/^[a-z0-9][a-z0-9_-]*$/.test(t.id)&&!ids.has(t.id)&&text(t.title,120)&&STADIUM_PRESETS.some(p=>p.id===t.preset)&&['original','url'].includes(t.source)&&bool(t.enabled)&&(t.source==='original'?t.url==='':audioURL(t.url)),'Musiqinin adı, növü və ya audio keçidi düzgün deyil.');ids.add(t.id);}
  check(!a.enabled||a.tracks.some(t=>t?.enabled),'Pleyer aktivdirsə ən azı bir musiqi seç.');
 }
 check(keys(b,['enabled','home','cards','label'])&&['enabled','home','cards'].every(x=>bool(b[x]))&&text(b.label,100),'Canlı yayım düyməsinin ayarları düzgün deyil.');return e;
}
export function nextTrack(tracks,current,shuffle,random=Math.random){const active=tracks.filter(t=>t.enabled);if(!active.length)return null;if(active.length===1)return active[0];const at=active.findIndex(t=>t.id===current);if(!shuffle)return active[(at+1)%active.length];const choices=active.filter(t=>t.id!==current);return choices[Math.min(choices.length-1,Math.floor(random()*choices.length))];}
export const STADIUM_COPY=[
 ['Dil, sevimli komanda, saxlanmış video və musiqi seçimləri bu cihazdan silinir.','Language, favourite club, saved videos and music preferences are removed from this device.','С этого устройства удаляются язык, любимая команда, сохранённые видео и настройки музыки.'],
 ['Bakı vaxtı','Baku time','Время Баку'],['Musiqini aç','Play music','Включить музыку'],['Musiqini dayandır','Pause music','Приостановить музыку'],['Musiqi ayarları','Music settings','Настройки музыки'],['Növbəti musiqi','Next track','Следующий трек'],['Mahnını seç','Choose a track','Выберите трек'],['Səs səviyyəsi','Volume','Громкость'],['Qarışıq sıra','Shuffle','Случайный порядок'],['Ayarları bağla','Close settings','Закрыть настройки'],['Musiqi üçün toxun','Tap to play music','Нажмите, чтобы включить музыку'],['Musiqi açılmadı. Başqa musiqi seç.','Unable to play. Choose another track.','Не удалось включить. Выберите другой трек.'],['Əvvəlki slayd','Previous slide','Предыдущий слайд'],['Növbəti slayd','Next slide','Следующий слайд'],['Slaydları dayandır','Pause slideshow','Приостановить слайды'],['Slaydları davam etdir','Resume slideshow','Продолжить слайды'],['Liqa slaydları','League slideshow','Слайды лиги'],['YouTube-da canlı izlə','Watch live on YouTube','Смотреть в прямом эфире на YouTube'],['Meydan bizimdir','Our pitch','Наше поле'],['Sumqayıt ritmi','Sumgayit rhythm','Ритм Сумгаита'],['Tribuna','The stands','Трибуна'],['Başlama fitindən əvvəl','Before kick-off','Перед началом'],['Gecə oyunu','Night match','Вечерний матч'],['Qələbəyə doğru','Towards victory','Навстречу победе'],['Meydanın növbəti görüşü','Next on the pitch','Следующий матч'],['Oyunu izlə. Liqanı yaşa.','Watch the game. Feel the league.','Смотрите игру. Живите лигой.'],['Matç arxivi və yayımlar','Match archive and broadcasts','Архив матчей и трансляции']
];
