import * as UI from './i18n.js';
import {POLICY_SLUGS} from './routes-source.js';
export function installPageExperience(ctx){
 const {P,CMS,esc,head}=ctx;
 P.custom=()=>{
  const slug=(document.body.dataset.previewPath||location.pathname).split('/').at(-1),page=CMS.pages.find(p=>p.slug===slug&&p.published);
  if(!page)return head(UI.t('Səhifə tapılmadı'),UI.t('Səhifə yayımlanmayıb və ya silinib.'));
  const headings=page.blocks.filter(b=>b.type==='heading'),policy=POLICY_SLUGS.includes(slug);let index=0;
  const blocks=window.SSL_CMS.renderBlocks(page.blocks).replace(/<h([234])([^>]*)>/g,(tag,level,attrs)=>`<h${level}${attrs} id="page-section-${index++}">`);
  const outline=headings.length>1?`<aside class="page-outline"><strong>${UI.t('Səhifənin bölmələri')}</strong>${headings.map((b,i)=>`<a href="#page-section-${i}">${esc(b.text)}</a>`).join('')}</aside>`:'';
  const preferences=slug==='kukiler'?`<section class="device-preferences"><h2>${UI.t('Brauzerdə saxlanan seçimlər')}</h2><p>${UI.t('Dil, sevimli komanda və saxlanmış video seçimləri bu cihazdan silinir.')}</p><button type="button" data-reset-preferences>${UI.t('Seçimləri sıfırla')}</button><p role="status" id="preferences-status"></p></section>`:'';
  return head(esc(page.title),esc(page.description))+`<section class="sec"><div class="wrap ${outline?'policy-page-layout':''}"><article class="cms-content cms-blocks ${policy?'policy-article':''}">${blocks}${preferences}</article>${outline}</div></section>`;
 };
 const originalBind=P.news?.init;
 document.addEventListener('click',async event=>{
  const reset=event.target.closest('[data-reset-preferences]');if(reset){
   for(const key of ['ssl.language.v1','ssl.favoriteTeam.v1','ssl.savedVideos.v1'])try{localStorage.removeItem(key);}catch{}
   window.dispatchEvent(new window.Event('ssl-preferences-reset'));const status=document.querySelector('#preferences-status');if(status)status.textContent=UI.t('Seçimlər sıfırlandı.');return;
  }
  const share=event.target.closest('[data-share-page]');if(!share||document.body.dataset.previewPath)return;
  const status=share.parentElement.querySelector('[role=status]'),url=new URL(location.href);url.hash='';
  try{if(typeof navigator.share==='function')await navigator.share({title:document.title,url:url.href});else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url.href);status.textContent=UI.t('Keçid kopyalandı.');}else{const input=document.createElement('input');input.value=url.href;input.readOnly=true;input.setAttribute('aria-label',UI.t('Keçidi kopyala'));share.parentElement.append(input);input.focus();input.select();}}catch(error){if(error.name!=='AbortError')status.textContent=UI.t('Keçidi kopyala')+': '+url.href;}
 });
 if(P.news){P.news.init=()=>{originalBind?.();if(new URLSearchParams(location.search).get('id')){const article=document.querySelector('.news-article-main')||document.querySelector('#app article');if(article&&!document.body.dataset.previewPath&&!article.querySelector('[data-share-page]'))article.insertAdjacentHTML('beforeend',`<div class="page-share-actions"><button type="button" data-share-page>${UI.t('Paylaş')} ↗</button><span role="status" aria-live="polite"></span></div>`);}};}
}
