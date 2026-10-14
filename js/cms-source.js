// Structured site editing shared by the admin and public renderer.
import {PAGE_ROUTES} from './routes-source.js';
import {defaultGuide} from './guide-source.js';
import {defaultCommunity,instagramPostURL} from './community-source.js';
import {defaultEditor,validateEditor,editorLinkOK} from './site-edit-source.js';
import {defaultMatchCenter,MATCH_STAGES} from './home-source.js';
import {defaultSponsors,validateSponsors} from './sponsors-source.js';
export const NAV_ITEMS = [
  ['home','Ana səhifə','index.html'],['games','Oyunlar','oyunlar.html'],['table','Cədvəl','cedvel.html'],
  ['teams','Komandalar','komandalar.html'],['players','Futbolçular','futbolcular.html'],
  ['scorers','Bombardirlər','bombardirler.html'],['stats','Statistika','statistika.html'],
  ['media','Media','media.html'],['news','Xəbərlər','xeberler.html'],['about','Haqqımızda','haqqimizda.html'],
  ['playoffs','Mövsüm','merhele.html'],['compare','Müqayisə','muqayise.html'],['guide','Minifutbol','minifutbol.html'],['contact','Əlaqə','elaqe.html'],['fans','Azarkeş mərkəzi','azarkes.html']
];
export const HOME_SECTIONS = [['pulse','Liqa rəqəmləri'],['results','Son nəticələr'],['fixtures','Növbəti oyunlar'],['table','Turnir cədvəli'],['videos','Videolar'],['scorers','Bombardirlər'],['teams','Komandalar'],['news','Xəbərlər'],['mvp','Ən yaxşı oyunçular']];
export const BLOCK_TYPES = [['heading','Başlıq'],['paragraph','Mətn'],['image','Şəkil'],['quote','Sitat'],['list','Siyahı'],['button','Düymə / keçid'],['divider','Ayırıcı']];
export function buttonText(color) {
  const c=color.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
  const luminance=.2126*c[0]+.7152*c[1]+.0722*c[2];
  return 1.05/(luminance+.05)>(luminance+.05)/.05?'#ffffff':'#071128';
}
export function getCMS(data) {
  const site=data.site||{},cms=data.cms||{};
  const defaults={
    home:{title:'',highlight:'',buttonLabel:'Oyunlar və nəticələr',buttonUrl:'/oyunlar',image:'',announcement:'',announcementUrl:'',layout:'league',featuredNews:'',leadType:'news',featuredMatch:'',featuredTitle:'Əsas oyun',featuredText:'',showSideNews:true,showGuidePromo:true,showEntryLinks:true,blocks:[],blockPosition:'afterLead',matchCenter:defaultMatchCenter(),newsLimit:0,videoLimit:3,showClubStrip:false,showScoreStrip:true,sections:HOME_SECTIONS.map(([id])=>({id,visible:id==='videos'}))},
    guide:defaultGuide(),community:defaultCommunity(),sponsors:defaultSponsors(),editor:defaultEditor(),
    about:{title:'Liqa haqqında',subtitle:'Sumqayıtdan başlayan mini futbol hekayəsi.',heading:'BU ŞƏHƏRDƏ OYUN BİTMİR.',image:'',showFacts:true,showClubs:true,showJourney:true,showContact:true,blocks:[{id:'about-note-heading',type:'heading',text:'Rəqəmlər, rəqabət və icma',url:'',alt:'',level:2},{id:'about-note-text',type:'paragraph',text:'Bu platformada turnir cədvəli, bütün komandaların heyətləri, futbolçular, oyun statistikası və video arxivi bir arada toplanır. Oyun tarixləri və nəticələr saytdakı mövsüm məlumatlarından avtomatik yaradılır.',url:'',alt:'',level:2}]},
    appearance:{background:'#f4f6fa',surface:'#ffffff',text:'#172640',muted:'#627189',font:'system',headingFont:'system',radius:18,width:1320,mobileNav:true},
    branding:{logo:'/assets/logo.png',footerText:'Sumqayıtın mini futbol həyəcanı. Oyunlar, statistika, komandalar və media bir məkanda.',copyright:'Bütün hüquqlar qorunur.'},
    seo:{title:site.name||'',description:(site.hero||'').slice(0,500),image:''},
    navigation:NAV_ITEMS.map(([id,label])=>({id,label,visible:true})),pages:[],media:[]
  };
  for(const key of ['home','about','guide','community','sponsors','editor','appearance','branding','seo'])defaults[key]={...defaults[key],...(cms[key]||{})};
  defaults.community.poll={...defaultCommunity().poll,...(cms.community?.poll||{})};
  defaults.community.featured={...defaultCommunity().featured,...(cms.community?.featured||{})};
  defaults.home.matchCenter={...defaultMatchCenter(),...(cms.home?.matchCenter||{})};
  for(const key of ['navigation','pages','media'])if(Array.isArray(cms[key]))defaults[key]=cms[key];
  if(Array.isArray(cms.navigation))defaults.navigation=[...cms.navigation,...NAV_ITEMS.filter(([id])=>!cms.navigation.some(n=>n.id===id)).map(([id,label])=>({id,label,visible:true}))];
  return defaults;
}
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const keys=(x,names)=>object(x)&&Object.keys(x).every(k=>names.includes(k));
const text=(x,max=300,required=false)=>typeof x==='string'&&x.length<=max&&(!required||x.trim())&&!/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(x);
const ident=x=>typeof x==='string'&&/^[a-z0-9][a-z0-9_-]{0,79}$/.test(x);
const color=x=>typeof x==='string'&&/^#[a-fA-F0-9]{6}$/.test(x);
const date=x=>typeof x==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(x)&&Number.isFinite(Date.parse(x+'T00:00:00Z'))&&new Date(x+'T00:00:00Z').toISOString().slice(0,10)===x;
export const imagePath=x=>x===''||typeof x==='string'&&/^\/assets\/(?:logo\.png|(?:logos|editorial)\/[a-zA-Z0-9_-]+\.(?:png|jpg|jpeg|webp))$/.test(x);
export function safeLink(x) {
  if(x==='')return true;
  if(typeof x!=='string'||!text(x,1000))return false;
  if(x.startsWith('/')&&!x.startsWith('//')&&!x.includes('\\')){const [path,query]=x.split('?');if(Object.hasOwn(PAGE_ROUTES,path)&&(!query||/^[a-zA-Z0-9_%=&.-]*$/.test(query)))return true;}
  if(/^\/(?:[a-z0-9_-]+\.html(?:\?[a-zA-Z0-9_%=&.-]*)?|sehife\/[a-z0-9][a-z0-9-]{0,79})$/.test(x)||x==='/')return true;
  try{const u=new URL(x);return u.protocol==='https:'&&!u.username&&!u.password;}catch{return false;}
}
export function validateCMS(cms) {
  const errors=[],check=(ok,msg)=>{if(!ok&&errors.length<30)errors.push(msg);return ok;};
  if(!check(keys(cms,['home','about','guide','community','sponsors','editor','appearance','branding','seo','navigation','pages','media']),'Redaktorun məlumat quruluşu düzgün deyil.'))return errors;
  if(cms.sponsors!==undefined)errors.push(...validateSponsors(cms.sponsors,imagePath));
  if(cms.editor!==undefined)errors.push(...validateEditor(cms.editor,{imagePath,linkOK:value=>editorLinkOK(value,safeLink)}));
  const H=cms.home,A=cms.about,T=cms.appearance,B=cms.branding,S=cms.seo;
  if(T?.mobileNav!==undefined)check(typeof T.mobileNav==='boolean','Telefon menyusu ayarı düzgün deyil.');
  if(check(keys(H,['title','highlight','buttonLabel','buttonUrl','image','announcement','announcementUrl','sections','layout','featuredNews','newsLimit','videoLimit','showClubStrip','showScoreStrip','matchCenter','leadType','featuredMatch','featuredTitle','featuredText','showSideNews','showGuidePromo','showEntryLinks','blocks','blockPosition']),'Ana səhifə ayarları düzgün deyil.')) {
    check(text(H.title,100)&&text(H.highlight,100)&&text(H.buttonLabel,80,true)&&safeLink(H.buttonUrl)&&!!H.buttonUrl&&imagePath(H.image)&&text(H.announcement,300)&&safeLink(H.announcementUrl),'Ana səhifədə mətn və ya keçid düzgün deyil.');
    check(Array.isArray(H.sections)&&H.sections.length===HOME_SECTIONS.length&&new Set(H.sections.map(s=>s?.id)).size===HOME_SECTIONS.length&&H.sections.every(s=>keys(s,['id','visible'])&&HOME_SECTIONS.some(([id])=>id===s.id)&&typeof s.visible==='boolean'),'Ana səhifənin bölmələri düzgün deyil.');
    check(H.layout===undefined||['league','editorial','classic'].includes(H.layout),'Giriş düzülüşü düzgün deyil.');
    check(H.featuredNews===undefined||H.featuredNews===''||ident(H.featuredNews),'Əsas xəbər seçimi düzgün deyil.');
    for(const k of ['newsLimit','videoLimit'])check(H[k]===undefined||Number.isInteger(H[k])&&H[k]>=0&&H[k]<=6,'Material sayı 0–6 olmalıdır.');
    for(const k of ['showClubStrip','showScoreStrip'])check(H[k]===undefined||typeof H[k]==='boolean','Üst zolaq ayarı düzgün deyil.');
    check(H.leadType===undefined||['news','match','custom','none'].includes(H.leadType),'Əsas hissənin növü düzgün deyil.');
    check(H.featuredMatch===undefined||H.featuredMatch===''||ident(H.featuredMatch),'Əsas oyun seçimi düzgün deyil.');
    check(H.featuredTitle===undefined||text(H.featuredTitle,160,true),'Əsas oyun başlığı düzgün deyil.');
    check(H.featuredText===undefined||text(H.featuredText,600),'Əsas oyun təqdimatı düzgün deyil.');
    for(const k of ['showSideNews','showGuidePromo','showEntryLinks'])check(H[k]===undefined||typeof H[k]==='boolean','Ana səhifə hissəsinin görünməsi düzgün deyil.');
    check(H.blockPosition===undefined||['beforeLead','afterLead','bottom'].includes(H.blockPosition),'Ana səhifə bloklarının yeri düzgün deyil.');
    const c=H.matchCenter;
    if(c?.showCountdown!==undefined)check(typeof c.showCountdown==='boolean','Oyun vaxtı ayarı düzgün deyil.');
    if(c!==undefined&&check(keys(c,['title','mode','round','stage','matches','limit','showSelector','showCountdown']),'Matç mərkəzi ayarları düzgün deyil.')){
      check(text(c.title,160,true)&&['automatic','round','stage','manual'].includes(c.mode)&&Number.isInteger(c.round)&&c.round>=1&&c.round<=99&&MATCH_STAGES.some(([s])=>s===c.stage)&&Number.isInteger(c.limit)&&c.limit>=1&&c.limit<=8&&typeof c.showSelector==='boolean','Matç mərkəzinin başlığı, mərhələsi və ya sayı düzgün deyil.');
      check(Array.isArray(c.matches)&&c.matches.length<=8&&new Set(c.matches).size===c.matches.length&&c.matches.every(ident)&&!(c.mode==='manual'&&!c.matches.length),'Ən çox səkkiz fərqli oyun seçin.');
    }
  }
  const blocks=(items,label)=>{
    if(!check(Array.isArray(items)&&items.length<=80,label+': ən çox 80 blok olmalıdır.'))return;
    const ids=new Set();
    items.forEach(b=>{
      if(!check(keys(b,['id','type','text','url','alt','level']),label+': blok düzgün deyil.'))return;
      check(ident(b.id)&&!ids.has(b.id)&&BLOCK_TYPES.some(([type])=>type===b.type)&&text(b.text,12000)&&text(b.alt,300)&&[2,3,4].includes(b.level),label+': blokun mətni və ya növü düzgün deyil.');ids.add(b.id);
      check(b.type==='image'?imagePath(b.url)&&!!b.url:b.type==='button'?safeLink(b.url)&&!!b.url:b.url==='',label+': blokun keçidi düzgün deyil.');
    });
  };
  if(H?.blocks!==undefined)blocks(H.blocks,'Ana səhifə');
  if(check(keys(A,['title','subtitle','heading','image','blocks','showFacts','showClubs','showJourney','showContact']),'Haqqımızda ayarları düzgün deyil.')){check(text(A.title,160,true)&&text(A.subtitle,500)&&text(A.heading,200,true)&&imagePath(A.image),'Haqqımızda başlığı və ya şəkli düzgün deyil.');blocks(A.blocks,'Haqqımızda');for(const k of ['showFacts','showClubs','showJourney','showContact'])check(A[k]===undefined||typeof A[k]==='boolean','Haqqımızda hissəsinin görünməsi düzgün deyil.');}
  if(cms.guide!==undefined&&check(keys(cms.guide,['title','subtitle','blocks']),'Minifutbol bələdçisi düzgün deyil.')){check(text(cms.guide.title,160,true)&&text(cms.guide.subtitle,500),'Bələdçi başlığı düzgün deyil.');blocks(cms.guide.blocks,'Minifutbol');}
  if(cms.community!==undefined&&check(keys(cms.community,['enabled','showQuiz','title','homeLimit','posts','poll','homeFeature','featured']),'İcma ayarları düzgün deyil.')){
    const c=cms.community;if(c.showQuiz!==undefined)check(typeof c.showQuiz==='boolean','Liqa testi ayarı düzgün deyil.');check(typeof c.enabled==='boolean'&&text(c.title,160,true)&&Number.isInteger(c.homeLimit)&&c.homeLimit>=0&&c.homeLimit<=4,'İcma başlığı və ya paylaşım sayı düzgün deyil.');
    if(check(Array.isArray(c.posts)&&c.posts.length<=60,'Instagram bölməsində ən çox 60 paylaşım ola bilər.')){
      const ids=new Set(),urls=new Set();for(const p of c.posts){if(!check(keys(p,['id','url','title','text','date','published','kind']),'Instagram paylaşımı düzgün deyil.'))continue;
        check(ident(p.id)&&!ids.has(p.id)&&instagramPostURL(p.url)&&!urls.has(p.url)&&text(p.title,160,true)&&text(p.text,600)&&date(p.date)&&typeof p.published==='boolean'&&['post','reel'].includes(p.kind),'Instagram keçidi, tarix və ya mətn düzgün deyil.');ids.add(p.id);urls.add(p.url);}
    }
    if(check(keys(c.poll,['enabled','round','question']),'Səsvermə ayarları düzgün deyil.'))check(typeof c.poll.enabled==='boolean'&&Number.isInteger(c.poll.round)&&c.poll.round>=1&&c.poll.round<=99&&text(c.poll.question,200,true),'Səsvermə sualı və ya tur düzgün deyil.');
    check(c.homeFeature===undefined||['poll','match','off'].includes(c.homeFeature),'Ana səhifənin seçilmiş oyun hissəsi düzgün deyil.');
    if(c.featured!==undefined&&check(keys(c.featured,['match','title','text','showVideo']),'Seçilmiş oyun ayarları düzgün deyil.'))check((c.featured.match===''||ident(c.featured.match))&&text(c.featured.title,160,true)&&text(c.featured.text,600)&&typeof c.featured.showVideo==='boolean','Seçilmiş oyunun başlığı, mətni və ya keçidi düzgün deyil.');
  }
  if(check(keys(T,['background','surface','text','muted','font','headingFont','radius','width','mobileNav']),'Dizayn ayarları düzgün deyil.'))check(['background','surface','text','muted'].every(k=>color(T[k]))&&['manrope','montserrat','system','georgia'].includes(T.font)&&['barlow','montserrat','system','georgia'].includes(T.headingFont)&&Number.isInteger(T.radius)&&T.radius>=0&&T.radius<=32&&Number.isInteger(T.width)&&T.width>=960&&T.width<=1600,'Dizayn rəngləri, şrift və ya ölçülər düzgün deyil.');
  if(check(keys(B,['logo','footerText','copyright']),'Loqo və alt hissə ayarları düzgün deyil.'))check(imagePath(B.logo)&&!!B.logo&&text(B.footerText,1500)&&text(B.copyright,300),'Loqo və alt hissə mətnləri düzgün deyil.');
  if(check(keys(S,['title','description','image']),'Axtarış ayarları düzgün deyil.'))check(text(S.title,160)&&text(S.description,500)&&imagePath(S.image),'Axtarış başlığı, təsviri və ya şəkli düzgün deyil.');
  check(Array.isArray(cms.navigation)&&cms.navigation.length>=10&&cms.navigation.length<=NAV_ITEMS.length&&new Set(cms.navigation.map(n=>n?.id)).size===cms.navigation.length&&NAV_ITEMS.slice(0,10).every(([id])=>cms.navigation.some(n=>n?.id===id))&&cms.navigation.every(n=>keys(n,['id','label','visible'])&&NAV_ITEMS.some(([id])=>id===n.id)&&text(n.label,50,true)&&typeof n.visible==='boolean'),'Sayt menyusu düzgün deyil.');
  if(check(Array.isArray(cms.pages)&&cms.pages.length<=50,'Ən çox 50 əlavə səhifə olmalıdır.')){
    const ids=new Set(),slugs=new Set();
    cms.pages.forEach(p=>{
      if(!check(keys(p,['id','slug','title','description','published','showInMenu','menuLabel','blocks']),'Səhifənin quruluşu düzgün deyil.'))return;
      check(ident(p.id)&&!ids.has(p.id)&&typeof p.slug==='string'&&/^[a-z0-9][a-z0-9-]{0,79}$/.test(p.slug)&&!slugs.has(p.slug)&&text(p.title,160,true)&&text(p.description,500)&&typeof p.published==='boolean'&&typeof p.showInMenu==='boolean'&&text(p.menuLabel,50,true),'Səhifənin ünvanı, adı və ya statusu düzgün deyil.');ids.add(p.id);slugs.add(p.slug);blocks(p.blocks,'Səhifə');
    });
  }
  if(check(Array.isArray(cms.media)&&cms.media.length<=200,'Media kitabxanasında ən çox 200 şəkil ola bilər.')){
    const urls=new Set();
    cms.media.forEach(m=>{check(keys(m,['url','title','alt','date'])&&imagePath(m.url)&&!!m.url&&!urls.has(m.url)&&text(m.title,160,true)&&text(m.alt,300)&&date(m.date),'Media şəkli və ya məlumatı düzgün deyil.');urls.add(m?.url);});
  }
  return errors;
}
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function renderBlocks(blocks) {
  return (blocks||[]).map(b=>{
    const t=escape(b.text).replace(/\n/g,'<br>');
    if(b.type==='heading')return `<h${b.level}>${t}</h${b.level}>`;
    if(b.type==='paragraph')return `<p>${t}</p>`;
    if(b.type==='quote')return `<blockquote>${t}</blockquote>`;
    if(b.type==='list')return `<ul>${b.text.split('\n').filter(x=>x.trim()).map(x=>`<li>${escape(x)}</li>`).join('')}</ul>`;
    if(b.type==='image')return imagePath(b.url)?`<figure><img src="${escape(b.url)}" alt="${escape(b.alt)}" loading="lazy">${b.text?`<figcaption>${t}</figcaption>`:''}</figure>`:'';
    if(b.type==='button')return safeLink(b.url)?`<p><a class="btn pri" href="${escape(b.url)}" rel="noopener noreferrer">${t||'Keçid'}</a></p>`:'';
    return b.type==='divider'?'<hr>':'';
  }).join('');
}
