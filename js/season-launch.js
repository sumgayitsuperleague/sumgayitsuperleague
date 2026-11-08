import {completedLeagueSchedule,normalizeRegistration,registrationOpenFromResponse,REGISTRATION_API,REGISTRATION_PATH,SEASON_ARCHIVE,seasonSettings} from './season-model.js';
import {onPageCleanup,pageListen} from './page-lifecycle.js';
import {publicHref} from './routes-source.js';
import {finalContext} from './fan-zone-model.js';

const words={
 az:{next:'Yeni mövsüm',open:'Qeydiyyat açıqdır',closed:'Qeydiyyat bağlıdır',pending:'Qeydiyyat hazırlanır',pendingBody:'Yeni mövsüm üçün hazırlıq gedir. Qeydiyyat açıldıqda komandan üçün buradan müraciət edə biləcəksən.',apply:'Komandanı qeydiyyata al',archive:'Mövsüm arxivi',archiveAction:'Nəticələrə bax',seasons:'Mövsüm',pick:'Mövsümü seç',intro:'Yeni mövsümə qoşul və ya əvvəlki mövsümün nəticələrinə bax.',formTitle:'Komanda qeydiyyatı',firstName:'Ad',lastName:'Soyad',team:'Komanda adı',phone:'Əlaqə nömrəsi',phoneHint:'Məsələn: +994 50 123 45 67',privacy:'Məlumatları müraciətini nəzərdən keçirmək və səninlə əlaqə saxlamaq üçün istifadə edirik.',privacyLink:'Məxfilik siyasəti',send:'Müraciəti göndər',sending:'Müraciət göndərilir…',sent:'Müraciət qəbul olundu',sentBody:'Liqa komandası qeyd etdiyin nömrə ilə səninlə əlaqə saxlayacaq.',close:'Bağla',back:'Mövsümlərə qayıt',preview:'Bu ön baxışdır. Buradan müraciət göndərilmir.',unavailable:'Müraciət göndərilmədi. Bir qədər sonra yenidən sına.',rate:'Çox sayda cəhd oldu. Bir dəqiqə sonra yenidən sına.',closedBody:'Hazırda yeni müraciət qəbul edilmir.',invalid:'Məlumatı yoxlayıb yenidən daxil et.',seasonPass:'YENİ MÖVSÜM',step:'01 / MÜRACİƏT',yearArchive:'BAŞA ÇATIB',registration:'Qeydiyyat'},
 en:{next:'New season',open:'Registration open',closed:'Registration closed',pending:'Registration in preparation',pendingBody:'We are preparing the new season. You can apply here once registration opens.',apply:'Register your team',archive:'Season archive',archiveAction:'View results',seasons:'Seasons',pick:'Choose a season',intro:'Join the new season or explore the previous season’s results.',formTitle:'Team registration',firstName:'First name',lastName:'Last name',team:'Team name',phone:'Contact number',phoneHint:'For example: +994 50 123 45 67',privacy:'We use these details to review your application and get in touch.',privacyLink:'Privacy policy',send:'Send application',sending:'Sending application…',sent:'Application received',sentBody:'The league will contact you at the number you provided.',close:'Close',back:'Back to seasons',preview:'Applications cannot be sent from this preview.',unavailable:'Your application could not be sent. Please try again shortly.',rate:'Too many attempts. Please try again in a minute.',closedBody:'We are not accepting new applications right now.',invalid:'Please check this field and try again.',seasonPass:'NEW SEASON',step:'01 / APPLICATION',yearArchive:'COMPLETED',registration:'Registration'},
 ru:{next:'Новый сезон',open:'Регистрация открыта',closed:'Регистрация закрыта',pending:'Регистрация готовится',pendingBody:'Мы готовим новый сезон. Когда откроется регистрация, здесь можно будет подать заявку.',apply:'Зарегистрировать команду',archive:'Архив сезона',archiveAction:'Посмотреть результаты',seasons:'Сезоны',pick:'Выбери сезон',intro:'Присоединяйся к новому сезону или посмотри итоги прошлого.',formTitle:'Регистрация команды',firstName:'Имя',lastName:'Фамилия',team:'Название команды',phone:'Контактный телефон',phoneHint:'Например: +994 50 123 45 67',privacy:'Мы используем данные, чтобы рассмотреть заявку и связаться с тобой.',privacyLink:'Политика конфиденциальности',send:'Отправить заявку',sending:'Отправляем заявку…',sent:'Заявка получена',sentBody:'Организаторы свяжутся с тобой по указанному номеру.',close:'Закрыть',back:'Назад к сезонам',preview:'Отправка заявок в предпросмотре недоступна.',unavailable:'Не удалось отправить заявку. Попробуй ещё раз чуть позже.',rate:'Слишком много попыток. Попробуй ещё раз через минуту.',closedBody:'Сейчас мы не принимаем новые заявки.',invalid:'Проверь это поле и попробуй ещё раз.',seasonPass:'НОВЫЙ СЕЗОН',step:'01 / ЗАЯВКА',yearArchive:'ЗАВЕРШЁН',registration:'Регистрация'}
};
export const seasonWords=lang=>words[lang]||words.az;

const detailWords={
 az:{join:'Komandanı yeni mövsümə qoş',archiveNote:'2026 mövsümünün nəticələri',all:'Bütün mövsümlər',links:'Liqanı kəşf et',teams:'Komandalar',teamsNote:'Liqa klubları və heyətləri',media:'Media',mediaNote:'Oyun videoları və xəbərlər',passLabel:'II MÖVSÜM',summary:'Müraciətin gedişi',applyStep:'Məlumatlarını göndər',contactStep:'Liqa komandası sənə zəng edəcək',tryAgain:'Yenidən yoxla'},
 en:{join:'Enter your team in the new season',archiveNote:'Results from the 2026 season',all:'All seasons',links:'Explore the league',teams:'Clubs',teamsNote:'League clubs and squads',media:'Media',mediaNote:'Match videos and news',passLabel:'SEASON II',summary:'What happens next',applyStep:'Send your details',contactStep:'The league team will call you',tryAgain:'Check again'},
 ru:{join:'Заяви команду на новый сезон',archiveNote:'Результаты сезона 2026',all:'Все сезоны',links:'О лиге',teams:'Команды',teamsNote:'Клубы и составы лиги',media:'Медиа',mediaNote:'Видео матчей и новости',passLabel:'II СЕЗОН',summary:'Что дальше',applyStep:'Отправь свои данные',contactStep:'Организаторы свяжутся с тобой',tryAgain:'Проверить ещё раз'}
};
const registrationCopy={
 az:{rules:'Şərtləri öyrən · Reqlament',notPublished:'Yeni mövsümün reqlamenti hələ dərc edilməyib. Şərtlər barədə məlumat üçün liqa ilə əlaqə istəyə bilərsən.',request:'Şərtlər üçün mənimlə əlaqə saxlayın',backToForm:'Komanda qeydiyyatına qayıt',sendInquiry:'Məlumat sorğusunu göndər',inquiry:'Şərtlər barədə məlumat sorğusu',reference:'Müraciət nömrəsi',champion:'Mövsümün çempionu',final:'Finala bax'},
 en:{rules:'Entry conditions and regulations',notPublished:'The new season’s regulations have not been published yet. You can ask the league for details.',request:'Ask the league to contact me',backToForm:'Back to team registration',sendInquiry:'Send information request',inquiry:'Request about entry conditions',reference:'Application reference',champion:'Season champion',final:'View the final'},
 ru:{rules:'Условия участия и регламент',notPublished:'Регламент нового сезона ещё не опубликован. Условия можно уточнить у организаторов.',request:'Попросить организаторов связаться со мной',backToForm:'Вернуться к регистрации команды',sendInquiry:'Отправить запрос',inquiry:'Запрос об условиях участия',reference:'Номер заявки',champion:'Чемпион сезона',final:'Посмотреть финал'}
};

const seasonGlyph={
 archive:'<rect x="4" y="5" width="16" height="16" rx="3"/><path d="M8 3v4m8-4v4M4 10h16m-11 5h6m-6 3h4"/>',
 teams:'<path d="m12 3 8 3v6c0 4-3 7-8 9-5-2-8-5-8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
 media:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3Z"/>',
 join:'<path d="M12 5v14M5 12h14"/><rect x="3" y="3" width="18" height="18" rx="5"/>',
 rules:'<path d="M8 3h6l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"/><path d="M14 3v5h4m-9 4h6m-6 4h6"/>',
 trophy:'<path d="M8 3h8v6a4 4 0 1 1-8 0V3Zm0 2H4v2a4 4 0 0 0 4 4m8-6h4v2a4 4 0 0 1-4 4m-4 2v6m-4 2h8"/>',
};
const glyph=name=>`<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${seasonGlyph[name]}</svg>`;

export function installSeasonLaunch({P,CMS,L,lang,esc,logo,archiveTitle,preview=false}) {
 const c=seasonWords(lang),d=detailWords[lang]||detailWords.az,settings=seasonSettings(CMS.seasons,lang);
 const r=registrationCopy[lang]||registrationCopy.az;
 let open=preview?settings.registrationOpen:null,inquiry=preview&&settings.inquiryOpen;
 const active=()=>open===true;
 const statusLabel=()=>active()?c.open:open===false?c.closed:c.pending;
 const description=()=>active()?settings.description:open===false?settings.closedDescription:c.pendingBody;
 const archiveName=archiveTitle||settings.archiveTitle,previousSeason={az:'2026 mövsümü',en:'2026 season',ru:'Сезон 2026'}[lang]||'2026 mövsümü';
 const launchOnly=completedLeagueSchedule(L);
 const href=route=>esc(publicHref(route,lang));
 const archiveHref=href(SEASON_ARCHIVE),registrationHref=href(REGISTRATION_PATH),seasonsHref=href('/movsum');
 const icon='<span class="ssl-season-arrow" aria-hidden="true">↗</span>';
 const state=(label=statusLabel(),closed=!active())=>`<span class="ssl-season-status${closed?' is-closed':''}"><i aria-hidden="true"></i>${label}</span>`;
 const slot=(name,html)=>`<div data-season-slot="${name}"${name==='status'?' role="status"':''}>${html}</div>`;
 const registrationLink=(className='ssl-season-button')=>active()?`<a class="${className}" href="${registrationHref}" data-season-open aria-haspopup="dialog">${c.apply}${icon}</a>`:'';
 const pitch='<svg class="ssl-season-pitch" viewBox="0 0 300 180" fill="none" aria-hidden="true"><rect x="13" y="13" width="274" height="154" rx="3"/><path d="M150 13v154M13 51h44v78H13m274-78h-44v78h44"/><circle cx="150" cy="90" r="27"/><circle cx="150" cy="90" r="2"/></svg>';
 const ticket=()=>`<div class="ssl-season-ticket-stage" data-season-tilt aria-hidden="true"><div class="ssl-season-ticket"><div class="ssl-season-ticket-top"><span>SSL <i></i> ${d.passLabel}</span><span>SUMQAYIT</span></div>${pitch}<div class="ssl-season-ticket-crest"><img src="${esc(logo)}" alt="" width="120" height="120"></div><div class="ssl-season-ticket-bottom"><strong>${c.seasonPass}</strong><span>02</span></div></div></div>`;
 const heroCopy=()=>`<p>${esc(description())}</p><div class="ssl-season-actions">${registrationLink()}<a class="ssl-season-button is-outline" href="${seasonsHref}">${d.all}${icon}</a></div>`;
 const hero=()=>`<section class="ssl-season-hero"><div class="wrap ssl-season-hero-inner"><div class="ssl-season-lead"><div class="ssl-season-overline"><span>SUMQAYIT SUPER LİQASI</span>${slot('status',state())}</div><h1>${esc(settings.title)}</h1>${slot('hero',heroCopy())}</div>${ticket()}</div></section>`;
 const shortcut=(url,title,sub,key)=>`<a href="${url}"><span class="ssl-season-shortcut-icon">${glyph(key)}</span><span><strong>${title}</strong><small>${sub}</small></span>${icon}</a>`;
 const shortcuts=()=>`<nav class="ssl-season-shortcuts wrap" aria-label="${d.links}">${shortcut(registrationHref,c.registration,d.join,'join')}${shortcut(href('/komandalar'),d.teams,d.teamsNote,'teams')}${shortcut(href('/media'),d.media,d.mediaNote,'media')}</nav>`;
 const menu=({label=c.seasons,dock=false,current=false,icon:tabIcon=''})=>{
  const id=dock?'ssl-dock-seasons':'ssl-nav-seasons';
  return `<div class="ssl-season-menu${dock?' ssl-season-menu--dock':''}" data-season-menu><button type="button" class="ssl-season-menu-toggle${current?' on':''}" aria-expanded="false" aria-controls="${id}">${tabIcon}<span>${esc(label)}</span>${dock?'':'<svg class="ssl-season-menu-chevron" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m4 6 4 4 4-4"/></svg>'}</button><div class="ssl-season-menu-panel" id="${id}" hidden><div class="ssl-season-menu-caption"><b>SSL</b><span>${c.seasons}</span></div>${shortcut(registrationHref,c.next,c.formTitle,'join')}${shortcut(archiveHref,previousSeason,esc(archiveName),'archive')}<a class="ssl-season-menu-all" href="${seasonsHref}">${d.all}${icon}</a></div></div>`;
 };
 const field=(name,opts={})=>`<label for="ssl-reg-${name}"><span>${c[name]}</span><input id="ssl-reg-${name}" name="${name}" type="${opts.type||'text'}" autocomplete="${opts.autocomplete||'off'}" required maxlength="${opts.max||60}"${opts.type==='tel'?' inputmode="tel" aria-describedby="ssl-reg-phone-hint" placeholder="+994 50 123 45 67"':' minlength="2"'}>${opts.type==='tel'?`<small id="ssl-reg-phone-hint">${c.phoneHint}</small>`:''}</label>`;
 const rules=()=>`<details class="ssl-reg-rules" id="reqlament"${typeof location!=='undefined'&&location.hash==='#reqlament'?' open':''}><summary class="ssl-reg-rules-toggle"><span class="ssl-reg-rules-icon">${glyph('rules')}</span><span>${r.rules}</span><svg class="ssl-reg-rules-chevron" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 7 4 4 4-4"/></svg></summary><div class="ssl-reg-rules-body"><p>${esc(settings.rulesText.trim()||r.notPublished).replace(/\n/g,'<br>')}</p>${inquiry?`<button class="ssl-reg-retry" type="button" data-reg-mode="rules">${r.request}</button>`:''}</div></details>`;
 const form=()=>`${active()?'':`<div class="ssl-reg-closed"><p>${esc(description())}</p>${open===null?`<button class="ssl-reg-retry" type="button" data-season-retry>${d.tryAgain}</button>`:''}</div>`}${rules()}${active()||inquiry?`<form class="ssl-reg-form" action="${REGISTRATION_API}" method="post" data-season-registration${active()?'':' hidden'}><input type="hidden" name="requestType" value="application"><p class="ssl-reg-mode-title" data-reg-mode-title hidden>${r.inquiry}</p><div class="ssl-reg-fields">${field('firstName',{autocomplete:'given-name'})}${field('lastName',{autocomplete:'family-name'})}${field('team',{autocomplete:'organization',max:100})}${field('phone',{type:'tel',autocomplete:'tel',max:32})}</div><p class="ssl-reg-privacy">${c.privacy}</p><div class="ssl-reg-actions"><button type="submit" class="ssl-season-button"><span data-reg-submit-text>${c.send}</span>${icon}</button>${active()&&inquiry?`<button class="ssl-reg-retry" type="button" data-reg-mode="application" hidden>${r.backToForm}</button>`:''}</div><p class="ssl-reg-message" data-reg-message role="status" aria-live="polite"></p></form><div class="ssl-reg-success" data-reg-success hidden tabindex="-1"><span aria-hidden="true">✓</span><h3>${c.sent}</h3><p>${c.sentBody}</p><p class="ssl-reg-reference"><span>${r.reference}</span><strong data-reg-reference></strong></p></div>`:''}`;

 const formPanel=(tag,id)=>`<div class="ssl-reg-panel"><div class="ssl-reg-panel-head"><span class="ssl-season-kicker">${c.step}</span><${tag} id="${id}">${c.formTitle}</${tag}>${slot('status',state())}</div>${slot('form',form())}</div>`;
 const seasonNew=()=>`${state()}<h2>${c.next}</h2><p>${esc(description())}</p>${registrationLink()}`;
 const seasons=()=>`<section class="ssl-season-directory"><div class="wrap"><header class="ssl-season-section-head"><span class="ssl-season-kicker">SSL / ${c.seasons}</span><h1>${c.pick}</h1><p>${c.intro}</p></header><div class="ssl-season-choices"><article class="ssl-season-choice ssl-season-choice-next"><div class="ssl-season-choice-content" data-season-slot="new">${seasonNew()}</div><span class="ssl-season-choice-number" aria-hidden="true">02</span></article><article class="ssl-season-choice ssl-season-choice-archive"><div class="ssl-season-choice-content">${state(previousSeason,true)}<h2>${esc(archiveName)}</h2><p>${esc(settings.archiveDescription)}</p><a class="ssl-season-button is-outline" href="${archiveHref}">${c.archiveAction}${icon}</a></div><span class="ssl-season-choice-number" aria-hidden="true">01</span></article></div></div></section>`;
 const oldHome=P.home,oldArchive=P.playoffs;
 if(launchOnly){
  P.home=()=> (settings.showHome?hero():`<section class="phead"><div class="wrap"><h1>${c.next}</h1><p>${esc(description())}</p></div></section>`)+shortcuts();
 }else if(settings.showHome){
  P.home=()=>hero()+shortcuts()+oldHome().replace(/<h1(\s[^>]*)?>([\s\S]*?)<\/h1>/i,(_,attrs='',copy)=>`<h2${attrs}>${copy}</h2>`);
  P.home.init=oldHome.init;
 }
 P.seasons=seasons;
 P.registration=()=>`<section class="ssl-reg-page"><div class="wrap ssl-reg-page-grid"><div class="ssl-reg-aside"><a class="ssl-reg-back" href="${seasonsHref}">← ${c.back}</a>${ticket()}<div class="ssl-reg-steps"><strong>${d.summary}</strong><ol><li>${d.applyStep}</li><li>${d.contactStep}</li></ol></div></div>${formPanel('h1','ssl-reg-page-title')}</div></section>`;
 const honour=()=>{
  const final=finalContext({league:L},CMS.fanZone),team=final?.champion;
  if(!team)return '';
  return `<section class="wrap ssl-season-honour-wrap" aria-labelledby="ssl-season-champion"><article class="ssl-season-honour"><div class="ssl-season-honour-crest"><img src="/assets/logos/${esc(team.logo)}" alt="" width="100" height="100"></div><div class="ssl-season-honour-copy"><p class="ssl-season-honour-label">${glyph('trophy')} ${r.champion}</p><h2 id="ssl-season-champion">${esc(team.name)}</h2><p class="ssl-season-honour-edition">${esc(previousSeason)}</p></div><a class="ssl-season-honour-link" href="${href('/final')}">${r.final} ${icon}</a></article></section>`;
 };
 P.playoffs=()=>oldArchive().replace(/<h1(\s[^>]*)?>[\s\S]*?<\/h1>/i,(_,attrs='')=>`<h1${attrs}>${esc(archiveName)}</h1>`).replace('</section>','</section>'+honour());
 P.playoffs.init=oldArchive.init;
 return {menu,mount(page){
  bindSeasonMenus();
  let dialog=null,trigger=null,checking=false;
  const availability=typeof AbortController==='function'?new AbortController():null;
  onPageCleanup(()=>availability?.abort());

  const bindForm=formNode=>{
   const message=formNode.querySelector('[data-reg-message]'),button=formNode.querySelector('button[type="submit"]');
   const say=(value,error=false)=>{message.textContent=value;message.classList.toggle('is-error',error);};
   const panel=formNode.parentElement,mode=formNode.elements.namedItem('requestType'),team=formNode.elements.namedItem('team'),success=formNode.nextElementSibling;
   pageListen(panel,'click',event=>{
    const control=event.target.closest('[data-reg-mode]');
    if(!control||button.disabled)return;
    const rulesMode=control.dataset.regMode==='rules';
    if(rulesMode&&!inquiry||!rulesMode&&!active())return;
    mode.value=rulesMode?'rules':'application';team.disabled=rulesMode;team.closest('label').hidden=rulesMode;
    formNode.querySelector('[data-reg-mode-title]').hidden=!rulesMode;
    formNode.querySelector('[data-reg-submit-text]').textContent=rulesMode?r.sendInquiry:c.send;
    const back=formNode.querySelector('[data-reg-mode="application"]');if(back)back.hidden=!rulesMode;
    formNode.hidden=false;success.hidden=true;say('');formNode.elements.namedItem('firstName').focus();
   });
   let responseController=null;
   onPageCleanup(()=>responseController?.abort());
   pageListen(formNode,'input',event=>{event.target.removeAttribute('aria-invalid');formNode.dataset.dirty='true';});
   pageListen(formNode,'submit',async event=>{
    event.preventDefault();if(button.disabled)return;
    if(preview){say(c.preview);return;}
    const body=Object.fromEntries(new FormData(formNode)),result=normalizeRegistration(body);
    const invalid=fieldName=>{const input=formNode.elements.namedItem(fieldName);if(input?.focus){input.setAttribute('aria-invalid','true');input.focus();}say((c[fieldName]?c[fieldName]+': ':'')+c.invalid,true);};
    if(result.field){invalid(result.field);return;}
    responseController=new AbortController();
    button.disabled=true;formNode.dataset.dirty='true';formNode.setAttribute('aria-busy','true');say(c.sending);
    const timeout=setTimeout(()=>responseController.abort('timeout'),12000);
    try{
     const response=await fetch(REGISTRATION_API,{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json','X-SSL-Registration':'1'},body:JSON.stringify({...result.value,website:body.website||''}),signal:responseController.signal});
     const payload=await response.json().catch(()=>null);
     if(response.status===201&&payload?.ok===true&&/^SSL-[0-9A-F]{8}$/.test(payload.reference||'')){
      success.querySelector('[data-reg-reference]').textContent=payload.reference;formNode.reset();formNode.hidden=true;formNode.dataset.dirty='false';success.hidden=false;success.focus();
     }else if(response.status===409&&payload?.code==='REGISTRATION_CLOSED')say(c.closedBody,true);
     else if(response.status===429)say(c.rate,true);
     else if(payload?.field&&Object.hasOwn(c,payload.field))invalid(payload.field);
     else say(c.unavailable,true);
    }catch{if(!responseController.signal.aborted||responseController.signal.reason==='timeout')say(c.unavailable,true);}
    finally{clearTimeout(timeout);formNode.removeAttribute('aria-busy');button.disabled=false;}
   });
  };
  const checkAvailability=async()=>{
   if(checking||preview||!availability||availability.signal.aborted||typeof fetch!=='function')return;
   checking=true;
   const retry=document.querySelector('[data-season-retry]');if(retry)retry.disabled=true;
   const request=new AbortController(),stop=()=>request.abort(),timeout=setTimeout(stop,4500);
   availability.signal.addEventListener('abort',stop,{once:true});
   try{
    const response=await fetch(REGISTRATION_API,{credentials:'same-origin',cache:'no-store',signal:request.signal});
    if(!response.ok||!response.headers.get('content-type')?.includes('application/json'))return;
    const payload=await response.json(),result=registrationOpenFromResponse(payload),nextInquiry=payload?.inquiryOpen===true;
    if(result===null||result===open&&nextInquiry===inquiry||availability.signal.aborted)return;
    open=result;inquiry=nextInquiry;
    const views={status:state,hero:heroCopy,new:seasonNew,form};
    for(const element of document.querySelectorAll('[data-season-slot]'))element.innerHTML=views[element.dataset.seasonSlot]();
    const standalone=document.querySelector('.ssl-reg-page [data-season-registration]');if(standalone)bindForm(standalone);
   }catch{}finally{clearTimeout(timeout);availability.signal.removeEventListener('abort',stop);checking=false;if(retry?.isConnected)retry.disabled=false;}
  };
  const standalone=document.querySelector('.ssl-reg-page [data-season-registration]');if(standalone)bindForm(standalone);
  if((page==='home'&&settings.showHome)||page==='seasons'||page==='registration')checkAvailability();
  pageListen(document,'click',event=>{
   if(event.target.closest?.('[data-season-retry]')){checkAvailability();return;}
   const link=event.target.closest?.('[data-season-open]');
   if(!active()||!link||event.defaultPrevented||event.button>0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||typeof HTMLDialogElement==='undefined'||typeof HTMLDialogElement.prototype.showModal!=='function')return;
   event.preventDefault();trigger=link;
   if(!dialog){
    document.body.insertAdjacentHTML('beforeend',`<dialog class="ssl-reg-dialog" aria-labelledby="ssl-reg-dialog-title"><div class="ssl-reg-dialog-inner"><button type="button" class="ssl-reg-dialog-close" data-reg-close aria-label="${c.close}">×</button>${formPanel('h2','ssl-reg-dialog-title')}</div></dialog>`);
    dialog=document.querySelector('.ssl-reg-dialog');
    bindForm(dialog.querySelector('[data-season-registration]'));
    pageListen(dialog,'click',e=>{if(e.target===dialog||e.target.closest?.('[data-reg-close]'))dialog.close();});
    pageListen(dialog,'close',()=>trigger?.focus());
    onPageCleanup(()=>{if(dialog.open)dialog.close();dialog.remove();});
   }
   if(!dialog.open)dialog.showModal();(dialog.querySelector('[data-reg-success]:not([hidden])')||dialog.querySelector('input[name="firstName"]'))?.focus();
  },true);
  if(typeof matchMedia==='function'&&matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)').matches){
   for(const stage of document.querySelectorAll('[data-season-tilt]')){
    const card=stage.firstElementChild;
    pageListen(stage,'pointermove',event=>{if(event.pointerType==='touch')return;const box=stage.getBoundingClientRect();card.style.setProperty('--rx',((.5-(event.clientY-box.top)/box.height)*12).toFixed(1)+'deg');card.style.setProperty('--ry',(((event.clientX-box.left)/box.width-.5)*16).toFixed(1)+'deg');},{passive:true});
    pageListen(stage,'pointerleave',()=>{card.style.removeProperty('--rx');card.style.removeProperty('--ry');});
   }
  }
 }};
}

function bindSeasonMenus(){
 const desktop=window.matchMedia?.('(min-width:1001px) and (hover:hover) and (pointer:fine)');
 for(const menu of document.querySelectorAll('[data-season-menu]')){
  const toggle=menu.querySelector('button'),panel=menu.querySelector('.ssl-season-menu-panel');
  let mode='',leave;
  const set=value=>{clearTimeout(leave);mode=value;panel.hidden=!mode;toggle.setAttribute('aria-expanded',String(!!mode));};
  pageListen(toggle,'click',()=>set(mode==='hover'?'press':mode?'':'press'));
  pageListen(toggle,'keydown',event=>{if(event.key==='ArrowDown'){event.preventDefault();set('press');panel.querySelector('a')?.focus();}});
  pageListen(menu,'pointerenter',event=>{clearTimeout(leave);if(desktop?.matches&&event.pointerType!=='touch'&&!mode)set('hover');});
  pageListen(menu,'pointerleave',()=>{if(mode==='hover')leave=setTimeout(()=>{if(!menu.contains(document.activeElement))set('');},160);});
  pageListen(menu,'focusout',event=>{if(mode&&event.relatedTarget&&!menu.contains(event.relatedTarget))set('');});
  pageListen(panel,'click',event=>{if(event.target.closest?.('a'))set('');});
  pageListen(document,'pointerdown',event=>{if(mode&&!menu.contains(event.target))set('');});
  pageListen(document,'keydown',event=>{
   if(event.key!=='Escape'||!mode)return;
   event.stopPropagation();event.preventDefault();const inside=menu.contains(document.activeElement);set('');if(inside)toggle.focus();
  },true);
  onPageCleanup(()=>clearTimeout(leave));
 }
}
