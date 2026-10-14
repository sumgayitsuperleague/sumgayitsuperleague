import {sponsorLinkOK} from './sponsors-source.js';
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function sponsorPlacement(section,page){
 return section?.enabled&&page!=='notfound'&&(page==='home'?section.showOnHome:page==='about'?section.showOnAbout:section.showOnOtherPages);
}
export function renderSponsors(section,{page='home',imageURL=path=>path,force=false,instagramLabel='Instagram səhifəsi'}={}){
 if(!section||!force&&!sponsorPlacement(section,page))return '';
 const items=(section.items||[]).filter(item=>item.visible);
 if(!items.length)return '';
 return `<section class="sponsors-section${section.layout==='strip'?' sponsors-strip':''}" id="partners" aria-labelledby="partners-title"><div class="wrap"><div class="partners-heading"><div><h2 id="partners-title">${escape(section.title)}</h2>${section.subtitle?`<p>${escape(section.subtitle)}</p>`:''}</div><span class="partners-heading-line" aria-hidden="true"></span></div><div class="partners-grid">${items.map(item=>{
  const linked=!!item.url&&sponsorLinkOK(item.url),tag=linked?'a':'div';
  return `<${tag} class="partner-card" data-partner="${escape(item.id)}"${linked?` href="${escape(item.url)}" target="_blank" rel="sponsored noopener noreferrer"`:''}><div class="partner-logo partner-tone-${escape(item.tone)}"><div class="partner-logo-window"><img src="${escape(imageURL(item.logo))}" alt="${escape(item.alt||item.name)}" width="300" height="300" loading="lazy" decoding="async" class="partner-fit-${escape(item.fit)} partner-position-${escape(item.position)} partner-scale-${Number(item.scale)}"></div></div><div class="partner-caption"><h3>${escape(item.name)}</h3>${linked?`<span>${escape(instagramLabel)} <i aria-hidden="true">↗</i></span>`:''}</div></${tag}>`;
 }).join('')}</div></div></section>`;
}
