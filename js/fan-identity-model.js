import {identityMeasureText} from './fan-studio-font.js';
export {identityMeasureText} from './fan-studio-font.js';
// A fan-made collection, separate from official uniforms and league records.
export const IDENTITY_STYLES=Object.freeze(['classic','stripe','contour']);
export const IDENTITY_TONES=Object.freeze(['club','night','light']);
export const IDENTITY_PRODUCTS=Object.freeze({kit:{width:1800,height:1620},scarf:{width:1800,height:1080},wallpaper:{width:1080,height:1920},avatar:{width:1080,height:1080}});
export const IDENTITY_POSTERS=Object.freeze(['signature','stadium','minimal']);
export const IDENTITY_AVATARS=Object.freeze(['crest','number','minimal']);
export const IDENTITY_ASSETS=Object.freeze({cover:'/assets/fan-studio/v4/cover.webp',stadium:'/assets/fan-studio/stadium-v2.webp',font:'/assets/fonts/oswald-ssl.woff'});
export const IDENTITY_STORAGE='ssl.fan.identity.v1';
export const identityEscape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function normalizeIdentity(value={},teams=[]){
 const v=value&&typeof value==='object'?value:{},first=teams[0]?.id||'';
 return {team:teams.some(t=>t.id===v.team)?v.team:first,name:[...String(v.name??'').normalize('NFC').replace(/[\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g,'').replace(/\s+/g,' ').trim()].slice(0,20).join(''),number:/^\d{1,2}$/.test(String(v.number??''))?String(v.number):'10',style:IDENTITY_STYLES.includes(v.style)?v.style:'classic',tone:IDENTITY_TONES.includes(v.tone)?v.tone:'club',poster:IDENTITY_POSTERS.includes(v.poster)?v.poster:'signature',avatar:IDENTITY_AVATARS.includes(v.avatar)?v.avatar:'crest',...Object.fromEntries(['primary','secondary','lettering'].map(k=>[k,/^#[\da-f]{6}$/i.test(v[k]||'')?v[k].toLowerCase():'']))};
}
export function identityLogo(team){
 const value=String(team?.logo||'');
 if(/^\/assets\/logos\/[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp)$/.test(value))return value;
 return /^[a-zA-Z0-9_-]+\.(?:png|jpe?g|webp)$/.test(value)?'/assets/logos/'+value:'/assets/logo.png';
}
export function identityPalette(team,tone='club',custom={}){
 const color=/^#[\da-f]{6}$/i.test(team?.color||'')?team.color:'#1c44be';
 const rgb=color.slice(1).match(/../g).map(v=>parseInt(v,16)),bright=rgb.reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0)>150;
 const accent=color.toLowerCase()==='#000000'?'#d7b780':color;
 const palette=tone==='night'?{main:'#15191f',ink:'#f5f5ef',accent,trim:'#e3cf9f'}:tone==='light'?{main:'#f4f5f1',ink:'#122139',accent:color,trim:'#d8c7a5'}:{main:color,ink:bright?'#122139':'#fffdf5',accent:bright?'#122139':'#eef2f6',trim:'#e3cf9f'};
 for(const [key,field] of [['primary','main'],['secondary','accent'],['lettering','ink']])if(/^#[\da-f]{6}$/i.test(custom[key]||''))palette[field]=custom[key].toLowerCase();
 if(/^#[\da-f]{6}$/i.test(custom.primary||'')&&!custom.lettering){const bright=custom.primary.slice(1).match(/../g).reduce((sum,v,i)=>sum+parseInt(v,16)*[.2126,.7152,.0722][i],0)>150;palette.ink=bright?'#10254b':'#f8fbff';}
 return palette;
}
export function identityLink(value,teams,lang='az'){
 const v=normalizeIdentity(value,teams),p=new URLSearchParams({club:v.team}),fragment=new URLSearchParams({fan:v.name,number:v.number,design:v.style,tone:v.tone,poster:v.poster,avatar:v.avatar});for(const [key,field] of [['color','primary'],['accent','secondary'],['ink','lettering']])if(v[field])fragment.set(key,v[field]);if(lang==='en'||lang==='ru')p.set('lang',lang);
 // Personal text stays in the URL fragment, outside HTTP requests and logs.
 return '/azarkes?'+p.toString()+'#kimlik?'+fragment.toString();
}
export function identityFromParams(params,teams,fallback={}){
 const keys={club:'team',fan:'name',number:'number',design:'style',tone:'tone',color:'primary',accent:'secondary',ink:'lettering',poster:'poster',avatar:'avatar'},v={...fallback};
 if(params.has('design')||params.has('tone'))for(const [key,field] of [['color','primary'],['accent','secondary'],['ink','lettering']])if(!params.has(key))v[field]='';
 for(const [key,field] of Object.entries(keys))if(params.has(key))v[field]=params.get(key);
 return normalizeIdentity(v,teams);
}
export function identityText(key,lang='az'){
 const copy={composition:['Kompozisiya','Composition','Композиция'],signature:['İmza','Signature','Подпись'],stadium:['Tribuna','Stadium','Трибуна'],minimal:['Təmiz','Minimal','Минимал'],crest:['Loqo','Crest','Эмблема'],supporter:['AZARKEŞ','SUPPORTER','БОЛЕЛЬЩИК'],quality:['Studio keyfiyyəti','Studio quality','Качество студии'],lighting:['İşıqlı fon','Light studio','Светлый фон'],hanger:['Asılqan','Hanger','Вешалка'],quarter:['3/4','3/4','3/4'],closeView:['Görünüşü bağla','Close view','Закрыть просмотр'],fullscreen:['Tam ekran','Full screen','На весь экран'],turn:['360° fırlat','Rotate 360°','Вращать 360°'],flat:['Ön və arxanı göstər','Show front & back','Показать обе стороны'],auto:['Avtomatik fırlanma','Auto rotation','Автовращение'],gesture:['Sürüklə · fırlat · yaxınlaşdır','Drag · rotate · zoom','Тяни · вращай · приближай'],zoom:['Yaxınlaşdırma','Zoom','Масштаб'],preparing360:['360° görünüş hazırlanır…','Preparing the 360° view…','Готовим обзор 360°…'],failed360:['360° görünüş yüklənmədi. Yenidən sına.','Could not load the 360° view. Try again.','Не удалось открыть обзор 360°. Повтори попытку.'],primary:['Əsas rəng','Base colour','Основной цвет'],secondary:['Naxış və haşiyə','Pattern & trim','Узор и отделка'],lettering:['Yazı rəngi','Lettering colour','Цвет надписей'],custom:['İstədiyin rəngi seç','Choose any colour','Выбери любой цвет'],paletteReset:['Klub rənglərinə qayıt','Restore club colours','Вернуть цвета клуба'],angle:['Baxış bucağı','Viewing angle','Угол просмотра'],move:['Ön baxışı tərpət','Move the preview','Повернуть превью'],studio:['Azarkeş studiyası','Fan studio','Фан-студия'],title:['Komanda kimliyini yarat','Create your club identity','Создай образ своей команды'],description:['Sənin adın. Sənin rənglərin. Sənin komandan.','Your name. Your colours. Your club.','Твоё имя. Твои цвета. Твоя команда.'],kit:['Forma','Jersey','Форма'],scarf:['Şərf','Scarf','Шарф'],wallpaper:['Divar kağızı','Wallpaper','Обои'],avatar:['Profil şəkli','Profile image','Аватар'],classic:['Klassik','Classic','Классика'],stripe:['Zolaqlar','Stripes','Полосы'],contour:['Kontur','Contour','Контур'],club:['Klub rəngi','Club colours','Цвета клуба'],night:['Gecə','Night','Ночь'],light:['Açıq','Light','Светлый'],open:['Dəstini yarat','Create your collection','Создать комплект'],close:['Studiyanı yığışdır','Collapse studio','Свернуть студию'],team:['Komanda','Club','Команда'],name:['Adın və ya ləqəbin','Your name or nickname','Имя или ник'],number:['Nömrə','Number','Номер'],style:['Üslub','Style','Стиль'],tone:['Rəng seçimi','Colourway','Расцветка'],download:['PNG-ni endir','Download PNG','Скачать PNG'],file:['Hazır faylı endir','Download ready file','Скачать готовый файл'],pack:['Bütün dəst · ZIP','Full collection · ZIP','Весь комплект · ZIP'],share:['Dizaynın keçidini kopyala','Copy design link','Скопировать ссылку'],reset:['Yenidən qur','Reset design','Сбросить дизайн'],fan:['AZARKEŞ DİZAYNI','FAN DESIGN','ФАН-ДИЗАЙН'],unofficial:['Azarkeş üçün hazırlanmış dizayndır. Rəsmi forma və satış məhsulu deyil.','A fan-made design, not an official uniform or a product for sale.','Фанатский дизайн. Не официальная форма и не товар для продажи.'],privacy:['Seçimlər bu brauzerdə saxlanır. Paylaşdığın keçiddə yazdığın ad və nömrə görünür.','Choices stay in this browser. Your shared link includes the name and number you enter.','Выбор хранится в этом браузере. В ссылке будут указанные имя и номер.'],empty:['Ad yazmasan, AZARKEŞ göstərilir.','Leave the name blank to use FAN.','Без имени будет написано БОЛЕЛЬЩИК.'],busy:['Şəkil hazırlanır…','Preparing image…','Создаём изображение…'],ready:['Şəkil hazırdır.','Image ready.','Изображение готово.'],packReady:['Dörd məhsul bir ZIP faylında hazırdır.','All four products are ready in one ZIP.','Все четыре изображения готовы в одном ZIP.'],failed:['Şəkli hazırlamaq alınmadı. Loqonun yükləndiyini yoxlayıb yenidən sına.','Could not create the image. Check the logo has loaded and try again.','Не удалось создать изображение. Проверь загрузку логотипа и попробуй ещё раз.'],copied:['Dizaynın keçidi kopyalandı.','Design link copied.','Ссылка скопирована.'],copyFallback:['Keçidi bu sahədən kopyala.','Copy the link from this field.','Скопируй ссылку из этого поля.'],front:['ÖN','FRONT','ПЕРЕД'],back:['ARXA','BACK','СПИНА'],edition:['SƏNİN KOMANDAN. SƏNİN İMZAN.','YOUR CLUB. YOUR SIGNATURE.','ТВОЯ КОМАНДА. ТВОЯ ПОДПИСЬ.'],view:['Ön baxış','Preview','Предпросмотр'],noTeams:['Əvvəlcə liqaya komanda əlavə edilməlidir.','Add a league club first.','Сначала добавьте команду в лигу.']};
 return copy[key]?.[lang==='en'?1:lang==='ru'?2:0]||key;
}

const DATA_IMAGE=/^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;
const clubUpper=team=>String(team?.name||'SSL').toLocaleUpperCase(team?.id==='fvs'?'en':'az');
const DISPLAY_FONT='SSL Display,Arial Narrow,Arial,sans-serif';
const displayFont=options=>/^data:font\/woff;base64,[A-Za-z0-9+/=]+$/.test(options.font||'')?`<style>@font-face{font-family:'SSL Display';font-style:normal;font-weight:700;src:url(${options.font}) format('woff')}</style>`:'';
const uppercase=(value,lang)=>String(value).toLocaleUpperCase(lang==='az'?'az':lang);
function artworkLogo(team,options={}){const logo=options.logo;return DATA_IMAGE.test(logo||'')?logo:identityLogo(team);}
function svgText(value,x,y,font,fill,extra=''){return `<text x="${x}" y="${y}" font-family="${DISPLAY_FONT}" font-size="${font}" font-weight="700" fill="${fill}" ${extra}>${identityEscape(value)}</text>`;}
function fitText(value,width,font){return identityMeasureText(value,font)>width?`textLength="${width}" lengthAdjust="spacingAndGlyphs"`:'';}
function crestImage(team,logo,x,y,w,plate=false){return `<g data-fi-crest="">${['fvs','ssl'].includes(team?.id)?`<rect x="${x}" y="${y}" width="${w}" height="${w}" rx="${w*.1}" fill="${['fvs','ssl'].includes(team?.id)?'#10254b':'#fbfaf5'}"/>`:''}<image data-fi-logo="" href="${identityEscape(logo)}" x="${x+w*.04}" y="${y+w*.04}" width="${w*.92}" height="${w*.92}" preserveAspectRatio="xMidYMid meet"/></g>`;}
// Flat, unlit artwork is mapped to the actual sewn garment's UV surface.
export function identityTexture(kind,team,value={},options={}){
 const state=normalizeIdentity({...value,team:team?.id},team?[team]:[]),p=identityPalette(team,state.tone,state),lang=options.lang||'az',name=uppercase(state.name||identityText('supporter',lang),lang),club=clubUpper(team),logo=artworkLogo(team,options),scarf=kind==='scarf',width=2048,height=scarf?160:1024;
 const text=(v,x,y,size,fill,extra='')=>svgText(v,x,y,size,fill,`text-anchor="middle" ${extra}`),id='ssl-print';
 const pattern=scarf?`<path d="M0 8H2048M0 152H2048" stroke="${p.accent}" stroke-width="7"/>`:
 state.style==='stripe'?`<path d="M344 0V1024M512 0V1024M680 0V1024M1368 0V1024M1536 0V1024M1704 0V1024" stroke="${p.accent}" stroke-width="72" opacity=".38"/>`:
 state.style==='contour'?`<g fill="none" stroke="${p.accent}" stroke-width="2" opacity=".16">${Array.from({length:15},(_,i)=>`<path d="M0 ${170+i*48}Q400 ${40+i*48} 1024 ${260+i*48}M1024 ${260+i*48}Q1648 ${40+i*48} 2048 ${170+i*48}"/>`).join('')}</g>`:
 `<g opacity=".07" stroke="${p.ink}" stroke-width="1">${Array.from({length:60},(_,i)=>`<path d="M${i*35} 0V1024"/>`).join('')}</g>`;
 const print=scarf?`${[0,1024].map(offset=>`${crestImage(team,logo,offset+65,22,112,true)}${crestImage(team,logo,offset+847,22,112,true)}${text(club,offset+512,76,60,p.ink,fitText(club,550,60))}${text(name+' / '+state.number,offset+512,124,26,p.ink,fitText(name+' / '+state.number,550,26))}`).join('')}`:
 `<defs><clipPath id="${id}-front"><rect x="270" y="230" width="484" height="710"/></clipPath><clipPath id="${id}-back"><rect x="1286" y="230" width="500" height="710"/></clipPath></defs><g clip-path="url(#${id}-front)">${crestImage(team,logo,623,292,104,true)}${text('SSL',367,337,38,p.ink,'letter-spacing="2"')}${text('SUMQAYIT',367,359,10,p.ink,'letter-spacing="2"')}${text(club,512,493,52,p.ink,fitText(club,460,52)+' data-fi-print="club"')}${text(state.number,512,723,208,p.ink,fitText(state.number,370,208))}${text('SUMQAYIT SUPER LİQA',512,880,12,p.ink,'letter-spacing="3"')}</g><g clip-path="url(#${id}-back)">${text(name,1536,294,40,p.ink,fitText(name,455,40)+' data-fi-print="name"')}${text(state.number,1536,805,332,p.ink,fitText(state.number,380,332)+' data-fi-print="number"')}${text('SSL / '+String(options.season||'2026'),1536,906,14,p.ink,'letter-spacing="4"')}</g>`;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${displayFont(options)}<rect width="100%" height="100%" fill="${p.main}"/>${pattern}${print}<rect x="2008" y="0" width="25" height="24" fill="${p.main}"/><rect x="2033" y="0" width="15" height="15" fill="${p.accent}"/></svg>`;
}
export function identityArtwork(product,team,value={},options={}){
 const kind=Object.hasOwn(IDENTITY_PRODUCTS,product)?product:'kit',state=normalizeIdentity({...value,team:team?.id},team?[team]:[]),p=identityPalette(team,state.tone,state),e=identityEscape,lang=options.lang||'az',t=k=>identityText(k,lang),id=String(options.prefix||'fi-'+kind).replace(/[^a-zA-Z0-9_-]/g,''),size=IDENTITY_PRODUCTS[kind],logo=artworkLogo(team,options),stadium=DATA_IMAGE.test(options.assets?.stadium||'')?options.assets.stadium:IDENTITY_ASSETS.stadium,name=uppercase(state.name||t('supporter'),lang),club=clubUpper(team),season=String(options.season||'2026');
 if(options.texture)return identityTexture(kind,team,state,options);
 const text=(v,x,y,font,fill,extra='')=>svgText(v,x,y,font,fill,extra),center=(v,x,y,font,fill,extra='')=>text(v,x,y,font,fill,'text-anchor="middle" '+extra),photo=(key,x,y,w,h)=>`<image data-fi-render="${key}" href="${e(DATA_IMAGE.test(options.renders?.[key]||'')?options.renders[key]:IDENTITY_ASSETS.cover)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
 const darkInk=p.ink.slice(1).match(/../g).reduce((sum,v,i)=>sum+parseInt(v,16)*[.2126,.7152,.0722][i],0)<145,paper=darkInk?'#f1f1ed':'#101216',muted=darkInk?'#5b6472':'#9ca6b5';
 const defs=`<defs><linearGradient id="${id}-paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${paper}"/><stop offset="1" stop-color="${p.main}" stop-opacity=".17"/></linearGradient><linearGradient id="${id}-fade" x2="0" y2="1"><stop stop-color="${paper}"/><stop offset=".53" stop-color="${paper}" stop-opacity=".08"/><stop offset="1" stop-color="${paper}"/></linearGradient><pattern id="${id}-mesh" width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".6" fill="${p.ink}" opacity=".07"/></pattern><filter id="${id}-shadow" x="-40%" y="-40%" width="180%" height="200%"><feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity=".25"/></filter></defs>`;
 const base=(w,h)=>`<rect width="${w}" height="${h}" fill="${paper}"/><rect width="${w}" height="${h}" fill="url(#${id}-paper)"/>`;
 let art='';
 if(kind==='kit')art=`${base(1800,1620)}${text('SSL / ATELIER',90,100,22,muted,'letter-spacing="5"')}${text(club,86,222,98,p.ink,fitText(club,1520,98))}<path d="M90 272H1710" stroke="${p.accent}" stroke-width="2"/>${photo('front',30,290,860,1050)}${photo('back',910,290,860,1050)}${center(t('front'),460,1388,21,muted,'letter-spacing="4"')}${center(t('back'),1340,1388,21,muted,'letter-spacing="4"')}${text(name+' / '+state.number,90,1500,39,p.ink,fitText(name+' / '+state.number,1260,39))}${text(t('fan')+' / '+season,92,1565,17,muted,'letter-spacing="3"')}`;
 if(kind==='scarf')art=`${base(1800,1080)}${text('SSL / ATELIER',90,110,22,muted,'letter-spacing="5"')}${text(club,86,240,100,p.ink,fitText(club,1550,100))}<path d="M90 288H1710" stroke="${p.accent}" stroke-width="2"/>${photo('front',15,330,1770,470)}${text(name+' / '+state.number,90,948,43,p.ink,fitText(name+' / '+state.number,1460,43))}${text(t('fan')+' / '+season,92,1010,17,muted,'letter-spacing="3"')}`;
 if(kind==='wallpaper'){
  if(state.poster==='signature')art=`${base(1080,1920)}<path d="M72 230V430" stroke="${p.accent}" stroke-width="6"/>${text('SUMQAYIT SUPER LİQA / '+season,106,266,20,muted,'letter-spacing="3"')}${text(club,102,392,112,p.ink,fitText(club,865,112))}${photo('hero',-15,430,1110,1150)}${crestImage(team,logo,843,454,144,true)}<path d="M80 1605H1000" stroke="${p.accent}" stroke-width="2"/>${text(name,78,1720,98,p.ink,fitText(name,920,98))}${text('SSL / '+state.number+' / '+t('supporter'),83,1795,20,muted,'letter-spacing="4"')}${text(t('edition'),83,1858,18,muted,fitText(t('edition'),910,18)+' letter-spacing="2"')}`;
  else if(state.poster==='stadium')art=`${base(1080,1920)}<image href="${e(stadium)}" width="1080" height="1920" preserveAspectRatio="xMidYMid slice" opacity=".7"/><rect width="1080" height="1920" fill="url(#${id}-fade)"/>${text('SUMQAYIT SUPER LİQA / '+season,80,275,20,muted,'letter-spacing="4"')}${text(club,76,407,116,p.ink,fitText(club,930,116))}<path d="M80 464H1000" stroke="${p.accent}" stroke-width="3"/><g filter="url(#${id}-shadow)">${crestImage(team,logo,230,655,620,false)}</g>${text(name,80,1585,96,p.ink,fitText(name,920,96))}${text(t('supporter')+' / '+state.number,84,1660,24,muted,'letter-spacing="4"')}<path d="M80 1730H1000" stroke="${p.accent}" stroke-width="2"/>${text('SSL / '+season,84,1830,22,muted,'letter-spacing="5"')}`;
  else art=`<rect width="1080" height="1920" fill="${p.main}"/><rect x="70" y="245" width="12" height="280" fill="${p.accent}"/>${text('SSL / '+season,110,287,22,p.ink,'letter-spacing="4"')}${text(club,106,417,114,p.ink,fitText(club,860,114))}${crestImage(team,logo,225,642,630,false)}<path d="M110 1480H970" stroke="${p.accent}" stroke-width="3"/>${text(name,108,1620,96,p.ink,fitText(name,860,96))}${text(state.number+' / '+t('fan'),114,1710,23,p.ink,'letter-spacing="3"')}`;
 }
 if(kind==='avatar'){
  art=`<rect width="1080" height="1080" fill="${p.main}"/>`;
  if(state.avatar==='number')art=`${base(1080,1080)}<rect width="1080" height="1080" fill="url(#${id}-mesh)"/>${photo('portrait',-75,15,1230,1080)}`;
  else if(state.avatar==='minimal')art+=`${crestImage(team,logo,215,190,650,false)}<path d="M342 865H738" stroke="${p.accent}" stroke-width="4"/>`;
  else art+=`<path d="M-80 800 1200 70" stroke="${p.accent}" stroke-width="180" opacity=".09"/><rect width="1080" height="1080" fill="url(#${id}-mesh)"/>${center(club,540,168,42,p.ink,fitText(club,635,42)+' letter-spacing="2"')}<g filter="url(#${id}-shadow)">${crestImage(team,logo,235,218,610,false)}</g>`;
  art+=`<rect x="220" y="866" width="640" height="86" fill="${paper}" opacity=".96"/>${center(name,540,927,46,p.ink,fitText(name,584,46))}${center('SSL / '+state.number,540,995,24,p.ink,'letter-spacing="3"')}`;
 }
 const box=options.preview&&kind==='scarf'?'0 305 1800 520':`0 0 ${size.width} ${size.height}`;
 return `<svg xmlns="http://www.w3.org/2000/svg" translate="no" width="${size.width}" height="${size.height}" viewBox="${box}" role="img" aria-labelledby="${id}-title"><title id="${id}-title">${e(club+' · '+t(kind)+' · '+name+' '+state.number+' · '+t('fan'))}</title>${displayFont(options)}${defs}${art}</svg>`;
}

const crcTable=Uint32Array.from({length:256},(_,n)=>{for(let i=0;i<8;i++)n=n&1?0xedb88320^(n>>>1):n>>>1;return n>>>0;});
export function identityCRC32(bytes){let n=0xffffffff;for(const b of bytes)n=crcTable[(n^b)&255]^(n>>>8);return (n^0xffffffff)>>>0;}
// Stored ZIP entries: PNG is already compressed. No library or remote service.
export function identityZip(files){
 if(!Array.isArray(files)||files.length>8)throw Error('Invalid collection');
 const local=[],central=[];let offset=0,centralLength=0;
 for(const f of files){
  if(!/^[a-z0-9][a-z0-9._-]{0,79}$/.test(f.name)||!(f.bytes instanceof Uint8Array))throw Error('Invalid file');
  const name=new TextEncoder().encode(f.name),crc=identityCRC32(f.bytes),header=new Uint8Array(30+name.length),h=new DataView(header.buffer);
  h.setUint32(0,0x04034b50,true);h.setUint16(4,20,true);h.setUint16(12,33,true);h.setUint32(14,crc,true);h.setUint32(18,f.bytes.length,true);h.setUint32(22,f.bytes.length,true);h.setUint16(26,name.length,true);header.set(name,30);local.push(header,f.bytes);
  const entry=new Uint8Array(46+name.length),c=new DataView(entry.buffer);c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(14,33,true);c.setUint32(16,crc,true);c.setUint32(20,f.bytes.length,true);c.setUint32(24,f.bytes.length,true);c.setUint16(28,name.length,true);c.setUint32(42,offset,true);entry.set(name,46);central.push(entry);centralLength+=entry.length;offset+=header.length+f.bytes.length;
 }
 const end=new Uint8Array(22),d=new DataView(end.buffer);d.setUint32(0,0x06054b50,true);d.setUint16(8,files.length,true);d.setUint16(10,files.length,true);d.setUint32(12,centralLength,true);d.setUint32(16,offset,true);
 const out=new Uint8Array(offset+centralLength+22);let at=0;for(const p of [...local,...central,end]){out.set(p,at);at+=p.length;}return out;
}
