// Verified Azfar Sumqayıt: Yandex 179395234808; HMWM+C2M (27 October 2026).
// Coordinates match the stadium point, not the Sumqayıt city centre.
import {matchStageLabel} from './league-source.js';
export const VENUE_COPY=[
 ['Stadiona gəliş üçün xəritə','Getting to the stadium','Как добраться на стадион'],
 ['Azfar Arena · Sumqayıt','Azfar Arena · Sumqayıt','Азфар Арена · Сумгаит'],
 ['Bulvar küçəsi, 56, Sumqayıt','56 Bulvar Street, Sumqayıt','Сумгаит, улица Бульвар, 56'],
 ['Oyunlarımız Sumqayıt Bulvarı ərazisindəki Azfar stadionunda keçirilir.','Our matches take place at the Azfar stadium on Sumqayıt Boulevard.','Наши матчи проходят на стадионе «Азфар» на Сумгаитском бульваре.'],
 ['Waze ilə get','Navigate with Waze','Поехать с Waze'],['Google Maps ilə get','Navigate with Google Maps','Поехать с Google Картами'],
 ['Ünvanı kopyala','Copy address','Скопировать адрес'],['Ünvan kopyalandı.','Address copied.','Адрес скопирован.'],
 ['Ünvanı seçərək kopyalaya bilərsən.','You can select and copy the address.','Вы можете выделить и скопировать адрес.'],
 ['3D xəritəni aç','Explore the 3D map','Открыть 3D-карту'],['Xəritə yüklənir…','Loading the map…','Карта загружается…'],
 ['Xəritəni açmaq alınmadı. Marşrut düymələrindən istifadə edə bilərsən.','The map could not load. You can use the navigation buttons.','Карта не загрузилась. Воспользуйтесь кнопками маршрута.'],
 ['Stadiona qayıt','Back to the stadium','Вернуться к стадиону'],['Xəritəni çevir','Rotate the map','Повернуть карту'],
 ['Stadionun xəritəsi','Stadium map','Карта стадиона'],['Stadion nöqtəsinə toxun, marşrutu aç.','Tap the stadium marker to open navigation.','Нажмите на точку стадиона, чтобы открыть маршрут.'],
 ['Yandex Maps-də aç','Open in Yandex Maps','Открыть Яндекс Карты'],['Giriş məlumatı','Entry information','Информация о входе'],
 ['Gəliş haqqında','Getting here','Как добраться'],['Bakı vaxtı · UTC+4','Baku time · UTC+4','Бакинское время · UTC+4'],
 ['Final','Final','Финал'],['Yarımfinal','Semi-final','Полуфинал'],['3-cü yer uğrunda','Third-place match','Матч за третье место'],
 ['Qarşıdakı oyunlar','Upcoming matches','Ближайшие матчи'],
 ['Məkan haqqında məlumat hazırda göstərilmir.','Venue information is currently unavailable.','Информация о месте проведения сейчас недоступна.']
];
export const venueText=(s,lang='az')=>VENUE_COPY.find(row=>row[0]===s)?.[lang==='en'?1:lang==='ru'?2:0]||s;
export function venueSettings(value={}){
 const v={enabled:true,showHome:true,showMatches:true,showFinal:true,title:'Stadiona gəliş üçün xəritə',name:'Azfar Arena · Sumqayıt',address:'Bulvar küçəsi, 56, Sumqayıt',description:'Oyunlarımız Sumqayıt Bulvarı ərazisindəki Azfar stadionunda keçirilir.',mapUrl:'https://yandex.com/maps/org/179395234808/',destination:'HMWM+C2M, Sumqayıt, Azərbaycan',latitude:40.5960875,longitude:49.6825469,entryInfo:'',travelInfo:'',...value};
 if(v.title==='Oyuna gəlmək üçün məlumat')v.title='Stadiona gəliş üçün xəritə';
 return v;
}
const plain=(v,max)=>typeof v==='string'&&v.length<=max&&!/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v);
export function venueMapId(url){try{const u=new URL(url);if(u.protocol!=='https:'||u.username||u.password||!['yandex.com','yandex.az','yandex.ru'].includes(u.hostname)||u.search||u.hash)return '';return /^\/maps\/org\/(\d{6,15})\/?$/.exec(u.pathname)?.[1]||'';}catch{return '';}}
export const venueCoordinates=v=>[v?.longitude,v?.latitude].every(Number.isFinite)&&Math.abs(v.longitude)<=180&&Math.abs(v.latitude)<=85?[v.longitude,v.latitude]:null;
export function validateVenue(v){
 if(!v||typeof v!=='object'||Array.isArray(v)||Object.keys(v).some(k=>!['enabled','showHome','showMatches','showFinal','title','name','address','description','mapUrl','destination','entryInfo','travelInfo','latitude','longitude'].includes(k)))return ['Məkan ayarları düzgün deyil.'];
 const errors=[];for(const key of ['enabled','showHome','showMatches','showFinal'])if(typeof v[key]!=='boolean')errors.push('Məkanın görünmə ayarı düzgün deyil.');
 for(const [key,max] of Object.entries({title:160,name:160,address:300,description:600,destination:300,entryInfo:1000,travelInfo:1000}))if(!plain(v[key],max)||(['title','name','address','destination'].includes(key)&&!v[key]?.trim()))errors.push('Məkan mətni düzgün deyil: '+key);
 if(!venueMapId(v.mapUrl))errors.push('Yandex Maps keçidi məkanın birbaşa təşkilat səhifəsi olmalıdır.');
 if((v.latitude!==undefined||v.longitude!==undefined)&&!venueCoordinates(v))errors.push('Xəritənin koordinatları düzgün deyil.');
 return errors;
}
export function venueLinks(value){
 const v=venueSettings(value),url=new URL('https://www.google.com/maps/dir/'),google=new URL('https://www.google.com/maps/search/'),waze=new URL('https://waze.com/ul'),point=venueCoordinates(v);
 url.searchParams.set('api','1');url.searchParams.set('destination',v.destination);google.searchParams.set('api','1');google.searchParams.set('query',v.destination);
 if(point)waze.searchParams.set('ll',point[1]+','+point[0]);else waze.searchParams.set('q',v.name+' '+v.address);
 waze.searchParams.set('navigate','yes');waze.searchParams.set('utm_source','sumgayitsuperleague.com');
 const id=venueMapId(v.mapUrl);return {directions:url.href,google:google.href,waze:waze.href,yandex:id?v.mapUrl:'',embed:id?'https://yandex.com/map-widget/v1/?z=16&ol=biz&oid='+id:''};
}
export const venueMatch=m=>!m.qualificationPending&&/azfar/i.test(m.venue||'');
const e=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const venuePin='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="2.7" stroke="currentColor" stroke-width="1.6"/></svg>';
const arrow='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 19 14-14M5 5h14v14" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
export function renderVenueTeaser(data,lang='az'){
 const v=venueSettings(data.cms?.venue),t=s=>venueText(s,lang),links=venueLinks(v);if(!v.enabled)return '';
 const known=venueMapId(v.mapUrl)==='179395234808'&&Math.abs(v.latitude-40.5960875)<.00001&&Math.abs(v.longitude-49.6825469)<.00001;
 const teams=new Map(data.league.teams.map(team=>[team.id,team])),matches=data.league.matches.filter(m=>venueMatch(m)&&['planned','live'].includes(m.status)).sort((a,b)=>(a.date+' '+a.time).localeCompare(b.date+' '+b.time)).slice(0,2);
 const date=m=>{if(!m.date)return '';const [y,month,d]=m.date.split('-');return lang==='az'?+d+' '+['yanvar','fevral','mart','aprel','may','iyun','iyul','avqust','sentyabr','oktyabr','noyabr','dekabr'][+month-1]+' '+y:new Intl.DateTimeFormat(lang==='en'?'en-GB':'ru-RU',{day:'numeric',month:'long',year:'numeric',timeZone:'Asia/Baku'}).format(new Date(m.date+'T12:00:00+04:00'));};
 return '<section class="venue-inline-section" id="stadion" data-venue-widget data-venue-teaser data-venue-lat="'+e(v.latitude)+'" data-venue-lng="'+e(v.longitude)+'" data-venue-name="'+e(t(v.name))+'" data-venue-waze="'+e(links.waze)+'" data-venue-fallback="'+e(links.embed)+'" data-venue-lang="'+lang+'"><div class="wrap"><div class="venue-experience"><div class="venue-journey"><span class="venue-kicker">'+venuePin+e(t(v.name))+'</span><h2>'+e(t(v.title))+'</h2><p class="venue-intro">'+e(t(v.description))+'</p><address id="venue-address">'+e(t(v.address))+'</address><div class="venue-route-actions"><a class="venue-waze" data-venue-waze-link href="'+e(links.waze)+'" target="_blank" rel="noopener noreferrer"><span>'+e(t('Waze ilə get'))+'</span>'+arrow+'</a><a class="venue-google" href="'+e(links.directions)+'" target="_blank" rel="noopener noreferrer"><span>'+e(t('Google Maps ilə get'))+'</span>'+arrow+'</a></div><div class="venue-small-actions"><button type="button" data-copy-venue>'+e(t('Ünvanı kopyala'))+'</button><a href="'+e(links.yandex)+'" target="_blank" rel="noopener noreferrer">Yandex Maps ↗</a></div><span class="venue-copy-status" role="status" aria-live="polite"></span>'+['entryInfo','travelInfo'].filter(key=>v[key]).map(key=>'<div class="venue-note"><h3>'+e(t(key==='entryInfo'?'Giriş məlumatı':'Gəliş haqqında'))+'</h3><p>'+e(t(v[key]))+'</p></div>').join('')+'</div><div class="venue-map-stage"><div class="venue-gl-map" data-venue-map role="region" aria-label="'+e(t('Stadionun xəritəsi'))+'">'+(known?'<a class="venue-atlas" href="'+e(links.waze)+'" target="_blank" rel="noopener noreferrer" aria-label="'+e(t('Waze ilə get'))+'"><img data-venue-atlas-image src="/assets/maps/azfar-3d.svg?v=20261027map3d1" width="1000" height="680" loading="lazy" alt="'+e(t('Stadionun xəritəsi'))+' · 3D"></a>':'')+'</div><div class="venue-map-toolbar" data-venue-map-controls hidden><button type="button" data-venue-view="3d" aria-pressed="true">3D</button><button type="button" data-venue-view="2d" aria-pressed="false">2D</button><button type="button" data-venue-rotate aria-label="'+e(t('Xəritəni çevir'))+'">↻</button><button type="button" data-venue-reset aria-label="'+e(t('Stadiona qayıt'))+'">⌖</button></div><a class="venue-map-destination" href="'+e(links.waze)+'" target="_blank" rel="noopener noreferrer"><span>'+venuePin+'</span><div><b>'+e(t(v.name))+'</b><small>'+e(t('Waze ilə get'))+' ↗</small></div></a><div class="venue-map-hint" data-venue-map-status role="status" aria-live="polite">'+e(t('Stadion nöqtəsinə toxun, marşrutu aç.'))+'</div><a class="venue-map-credit" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">© OpenStreetMap · OpenMapTiles · OpenFreeMap</a></div></div>'+(matches.length?'<div class="venue-inline-fixtures" aria-label="'+e(t('Qarşıdakı oyunlar'))+'"><span>'+e(t('Bakı vaxtı · UTC+4'))+'</span>'+matches.map(m=>'<a href="/matc?id='+encodeURIComponent(m.id)+(lang==='az'?'':'&lang='+lang)+'"><span>'+e(t(matchStageLabel(m)))+' · '+e(date(m))+'</span><b>'+e(teams.get(m.home)?.name)+' — '+e(teams.get(m.away)?.name)+'</b><time>'+e(m.time||'—')+'</time></a>').join('')+'</div>':'')+'</div></section>';
}
export const renderVenuePage=(data,lang='az')=>renderVenueTeaser(data,lang)||'<p>'+e(venueText('Məkan haqqında məlumat hazırda göstərilmir.',lang))+'</p>';
