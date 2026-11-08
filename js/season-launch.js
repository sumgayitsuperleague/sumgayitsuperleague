import {normalizeRegistration,REGISTRATION_PATH,SEASON_ARCHIVE,seasonSettings} from './season-model.js';
import {onPageCleanup,pageListen} from './page-lifecycle.js';

const words={
 az:{next:'Yeni mövsüm',open:'Qeydiyyat açıqdır',closed:'Qeydiyyat bağlıdır',apply:'Komandanı qeydiyyata al',archive:'Mövsüm arxivi',archiveAction:'Arxivə bax',seasons:'Mövsüm',pick:'Mövsümü seç',intro:'Yeni mövsümə qoşul və ya əvvəlki mövsümün nəticələrinə bax.',formTitle:'Komanda qeydiyyatı',firstName:'Ad',lastName:'Soyad',team:'Komanda adı',phone:'Əlaqə nömrəsi',phoneHint:'Məsələn: +994 50 123 45 67',privacy:'Məlumatları müraciətini nəzərdən keçirmək və səninlə əlaqə saxlamaq üçün istifadə edirik.',privacyLink:'Məxfilik siyasəti',send:'Müraciəti göndər',sending:'Müraciət göndərilir…',sent:'Müraciət qəbul olundu',sentBody:'Liqa komandası qeyd etdiyin nömrə ilə səninlə əlaqə saxlayacaq.',close:'Bağla',back:'Mövsümlərə qayıt',preview:'Bu ön baxışdır. Buradan müraciət göndərilmir.',unavailable:'Müraciət göndərilmədi. Bir qədər sonra yenidən sına.',rate:'Çox sayda cəhd oldu. Bir dəqiqə sonra yenidən sına.',closedBody:'Hazırda yeni müraciət qəbul edilmir.',invalid:'Məlumatı yoxlayıb yenidən daxil et.',seasonPass:'YENİ MÖVSÜM',step:'01 / MÜRACİƏT',yearArchive:'BAŞA ÇATIB',registration:'Qeydiyyat'},
 en:{next:'New season',open:'Registration open',closed:'Registration closed',apply:'Register your team',archive:'Season archive',archiveAction:'View archive',seasons:'Seasons',pick:'Choose a season',intro:'Join the new season or explore the previous season’s results.',formTitle:'Team registration',firstName:'First name',lastName:'Last name',team:'Team name',phone:'Contact number',phoneHint:'For example: +994 50 123 45 67',privacy:'We use these details to review your application and get in touch.',privacyLink:'Privacy policy',send:'Send application',sending:'Sending application…',sent:'Application received',sentBody:'The league will contact you at the number you provided.',close:'Close',back:'Back to seasons',preview:'Applications cannot be sent from this preview.',unavailable:'Your application could not be sent. Please try again shortly.',rate:'Too many attempts. Please try again in a minute.',closedBody:'We are not accepting new applications right now.',invalid:'Please check this field and try again.',seasonPass:'NEW SEASON',step:'01 / APPLICATION',yearArchive:'COMPLETED',registration:'Registration'},
 ru:{next:'Новый сезон',open:'Регистрация открыта',closed:'Регистрация закрыта',apply:'Зарегистрировать команду',archive:'Архив сезона',archiveAction:'Открыть архив',seasons:'Сезоны',pick:'Выбери сезон',intro:'Присоединяйся к новому сезону или посмотри итоги прошлого.',formTitle:'Регистрация команды',firstName:'Имя',lastName:'Фамилия',team:'Название команды',phone:'Контактный телефон',phoneHint:'Например: +994 50 123 45 67',privacy:'Мы используем данные, чтобы рассмотреть заявку и связаться с тобой.',privacyLink:'Политика конфиденциальности',send:'Отправить заявку',sending:'Отправляем заявку…',sent:'Заявка получена',sentBody:'Организаторы свяжутся с тобой по указанному номеру.',close:'Закрыть',back:'Назад к сезонам',preview:'Отправка заявок в предпросмотре недоступна.',unavailable:'Не удалось отправить заявку. Попробуй ещё раз чуть позже.',rate:'Слишком много попыток. Попробуй ещё раз через минуту.',closedBody:'Сейчас мы не принимаем новые заявки.',invalid:'Проверь это поле и попробуй ещё раз.',seasonPass:'НОВЫЙ СЕЗОН',step:'01 / ЗАЯВКА',yearArchive:'ЗАВЕРШЁН',registration:'Регистрация'}
};
export const seasonWords=lang=>words[lang]||words.az;

export function installSeasonLaunch({P,CMS,L,lang,esc,logo,archiveTitle}) {
 const c=seasonWords(lang),settings=seasonSettings(CMS.seasons,lang),active=settings.registrationOpen;
 const archiveName=archiveTitle||settings.archiveTitle;
 const season=esc(L.season);
 const icon='<span class="ssl-season-arrow" aria-hidden="true">↗</span>';
 const state=(label,closed=false)=>`<span class="ssl-season-status${closed?' is-closed':''}"><i aria-hidden="true"></i>${label}</span>`;
 const registrationLink=(className='ssl-season-button')=>`<a class="${className}" href="${REGISTRATION_PATH}"${active?' data-season-open aria-haspopup="dialog"':''}>${active?c.apply:c.registration}${icon}</a>`;
 const pitch='<svg class="ssl-season-pitch" viewBox="0 0 300 180" fill="none" aria-hidden="true"><rect x="13" y="13" width="274" height="154" rx="3"/><path d="M150 13v154M13 51h44v78H13m274-78h-44v78h44"/><circle cx="150" cy="90" r="27"/><circle cx="150" cy="90" r="2"/></svg>';
 const ticket=()=>`<div class="ssl-season-ticket-stage" data-season-tilt aria-hidden="true"><div class="ssl-season-ticket"><div class="ssl-season-ticket-top"><span>SSL / 02</span><span>SUMQAYIT</span></div>${pitch}<div class="ssl-season-ticket-crest"><img src="${esc(logo)}" alt=""></div><div class="ssl-season-ticket-bottom"><strong>${c.seasonPass}</strong><span>02</span></div></div></div>`;
 const hero=()=>`<section class="ssl-season-hero"><div class="wrap ssl-season-hero-inner"><div class="ssl-season-lead"><div class="ssl-season-overline"><span>SUMQAYIT SUPER LİQASI</span>${state(active?c.open:c.closed,!active)}</div><h1>${esc(settings.title)}</h1><p>${esc(active?settings.description:c.closedBody)}</p><div class="ssl-season-actions">${active?registrationLink():''}<a class="ssl-season-button is-outline" href="/movsum">${c.seasons}${icon}</a></div></div>${ticket()}</div></section>`;
 const archiveLabel=()=>`<div class="ssl-season-archive-strip wrap"><div><span class="ssl-season-kicker">${c.archive} / ${season}</span><strong>${esc(archiveName)}</strong></div><a href="${SEASON_ARCHIVE}">${c.archiveAction} ${icon}</a></div>`;
 const field=(name,opts={})=>`<label for="ssl-reg-${name}"><span>${c[name]}</span><input id="ssl-reg-${name}" name="${name}" type="${opts.type||'text'}" autocomplete="${opts.autocomplete||'off'}" required maxlength="${opts.max||60}"${opts.type==='tel'?` inputmode="tel" aria-describedby="ssl-reg-phone-hint" placeholder="+994 50 123 45 67"`:' minlength="2"'}>${opts.type==='tel'?`<small id="ssl-reg-phone-hint">${c.phoneHint}</small>`:''}</label>`;
 const form=()=>active?`<form class="ssl-reg-form" data-season-registration><div class="ssl-reg-fields">${field('firstName',{autocomplete:'given-name'})}${field('lastName',{autocomplete:'family-name'})}${field('team',{autocomplete:'organization',max:100})}${field('phone',{type:'tel',autocomplete:'tel',max:32})}</div><div hidden aria-hidden="true"><label>Website<input name="website" tabindex="-1" autocomplete="off"></label></div><p class="ssl-reg-privacy">${c.privacy} ${CMS.pages?.some(p=>p.slug==='mexfilik'&&p.published)?`<a href="/sehife/mexfilik" target="_blank" rel="noopener noreferrer">${c.privacyLink}</a>`:''}</p><button type="submit" class="ssl-season-button">${c.send}${icon}</button><p class="ssl-reg-message" data-reg-message role="status" aria-live="polite"></p></form><div class="ssl-reg-success" data-reg-success hidden tabindex="-1"><span aria-hidden="true">✓</span><h3>${c.sent}</h3><p>${c.sentBody}</p></div>`:`<p class="ssl-reg-closed">${c.closedBody}</p>`;
 const formPanel=(tag,id)=>`<div class="ssl-reg-panel"><div class="ssl-reg-panel-head"><span class="ssl-season-kicker">${c.step}</span><${tag} id="${id}">${c.formTitle}</${tag}><p>${active?esc(settings.description):c.closed}</p></div>${form()}</div>`;
 const seasons=()=>`<section class="ssl-season-directory"><div class="wrap"><header class="ssl-season-section-head"><span class="ssl-season-kicker">SSL / ${c.seasons}</span><h1>${c.pick}</h1><p>${c.intro}</p></header><div class="ssl-season-choices"><article class="ssl-season-choice ssl-season-choice-next"><div class="ssl-season-choice-content">${state(active?c.open:c.closed,!active)}<h2>${c.next}</h2><p>${esc(active?settings.description:c.closedBody)}</p>${registrationLink()}</div><span class="ssl-season-choice-number" aria-hidden="true">02</span></article><article class="ssl-season-choice ssl-season-choice-archive"><div class="ssl-season-choice-content">${state(season+' / '+c.yearArchive,true)}<h2>${esc(archiveName)}</h2><p>${esc(settings.archiveDescription)}</p><a class="ssl-season-button is-outline" href="${SEASON_ARCHIVE}">${c.archiveAction}${icon}</a></div><span class="ssl-season-choice-number" aria-hidden="true">01</span></article></div></div></section>`;
 const oldHome=P.home, oldArchive=P.playoffs;
 if(settings.showHome){
  P.home=()=>hero()+archiveLabel()+oldHome().replace(/<h1(\s[^>]*)?>([\s\S]*?)<\/h1>/i,(_,attrs='',copy)=>`<h2${attrs}>${copy}</h2>`);
  P.home.init=oldHome.init;
 }
 P.seasons=seasons;
 P.registration=()=>`<section class="ssl-reg-page"><div class="wrap ssl-reg-page-grid"><div class="ssl-reg-aside"><a class="ssl-reg-back" href="/movsum">← ${c.back}</a>${ticket()}</div>${formPanel('h1','ssl-reg-page-title')}</div></section>`;
 P.playoffs=()=>oldArchive().replace(/<h1(\s[^>]*)?>[\s\S]*?<\/h1>/i,(_,attrs='')=>`<h1${attrs}>${esc(archiveName)}</h1>`);
 P.playoffs.init=oldArchive.init;
 return {mount(page){
  const preview=!!document.body.dataset.previewPath;
  let dialog=null,trigger=null;
  if(page!=='registration'&&active&&document.querySelector('[data-season-open]')){
   document.body.insertAdjacentHTML('beforeend',`<dialog class="ssl-reg-dialog" aria-labelledby="ssl-reg-dialog-title"><div class="ssl-reg-dialog-inner"><button type="button" class="ssl-reg-dialog-close" data-reg-close aria-label="${c.close}">×</button>${formPanel('h2','ssl-reg-dialog-title')}</div></dialog>`);
   dialog=document.querySelector('.ssl-reg-dialog');
   pageListen(document,'click',event=>{
    const link=event.target.closest?.('[data-season-open]');
    if(!link||event.defaultPrevented||event.button>0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||typeof dialog.showModal!=='function')return;
    event.preventDefault();trigger=link;if(!dialog.open)dialog.showModal();dialog.querySelector('input[name="firstName"]')?.focus();
   },true);
   pageListen(dialog,'click',event=>{if(event.target.closest?.('[data-reg-close]'))dialog.close();});
   pageListen(dialog,'close',()=>trigger?.focus());
   onPageCleanup(()=>{if(dialog.open)dialog.close();dialog.remove();});
  }
  for(const formNode of document.querySelectorAll('[data-season-registration]')){
   const message=formNode.querySelector('[data-reg-message]'),button=formNode.querySelector('button[type="submit"]');
   const say=(value,error=false)=>{message.textContent=value;message.classList.toggle('is-error',error);};
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
    try{
     const response=await fetch('/api/season-registration',{method:'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json','X-SSL-Registration':'1'},body:JSON.stringify({...result.value,website:body.website||''}),signal:AbortSignal.any([responseController.signal,AbortSignal.timeout(12000)])});
     const payload=await response.json().catch(()=>null);
     if(response.status===201&&payload?.ok===true){
      formNode.reset();formNode.hidden=true;formNode.dataset.dirty='false';const success=formNode.nextElementSibling;success.hidden=false;success.focus();
     }else if(response.status===409&&payload?.code==='REGISTRATION_CLOSED')say(c.closedBody,true);
     else if(response.status===429)say(c.rate,true);
     else if(payload?.field&&Object.hasOwn(c,payload.field))invalid(payload.field);
     else say(c.unavailable,true);
    }catch{if(!responseController.signal.aborted)say(c.unavailable,true);}
    finally{formNode.removeAttribute('aria-busy');button.disabled=false;}
   });
  }
  if(typeof matchMedia==='function'&&matchMedia('(hover:hover) and (pointer:fine) and (prefers-reduced-motion:no-preference)').matches){
   for(const stage of document.querySelectorAll('[data-season-tilt]')){
    const card=stage.firstElementChild;
    pageListen(stage,'pointermove',event=>{if(event.pointerType==='touch')return;const box=stage.getBoundingClientRect();card.style.setProperty('--rx',((.5-(event.clientY-box.top)/box.height)*12).toFixed(1)+'deg');card.style.setProperty('--ry',(((event.clientX-box.left)/box.width-.5)*16).toFixed(1)+'deg');},{passive:true});
    pageListen(stage,'pointerleave',()=>{card.style.removeProperty('--rx');card.style.removeProperty('--ry');});
   }
  }
 }};
}
