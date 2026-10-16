import {sponsorLinkOK} from './sponsors-source.js';
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function sponsorPlacement(section,page){
 return section?.enabled&&page!=='notfound'&&(page==='home'?section.showOnHome:page==='about'?section.showOnAbout:section.showOnOtherPages);
}
export function renderSponsors(section,{page='home',imageURL=path=>path,force=false,instagramLabel='Instagram səhifəsi',translate=value=>value}={}){
 if(!section||!force&&!sponsorPlacement(section,page))return '';
 const items=(section.items||[]).filter(item=>item.visible);
 if(!items.length)return '';
 if(section.marquee!==false){
  const itemHTML=(item,copy=false)=>{const linked=!!item.url&&sponsorLinkOK(item.url),tag=linked?'a':'div';return `<${tag} class="partner-card partner-marquee-item" ${copy?'data-partner-copy aria-hidden="true"':'data-partner="'+escape(item.id)+'"'}${linked?` href="${escape(item.url)}" target="_blank" rel="sponsored noopener noreferrer"${copy?' tabindex="-1"':''}`:''}><div class="partner-logo partner-tone-${escape(item.tone)}"><div class="partner-logo-window"><img src="${escape(imageURL(item.logo))}" alt="${copy?'':escape(item.alt||item.name)}" width="300" height="300" loading="lazy" decoding="async" class="partner-fit-${escape(item.fit)} partner-position-${escape(item.position)} partner-scale-${Number(item.scale)}"></div></div><div class="partner-caption"><h3>${escape(translate(item.name))}</h3></div></${tag}>`;};
  const repeats=Math.ceil(8/items.length),group=copy=>Array.from({length:repeats},(_,i)=>items.map(item=>itemHTML(item,copy||i>0)).join('')).join('');
  return `<section class="sponsors-section sponsors-marquee${section.layout==='strip'?' sponsors-strip':''}${section.pauseOnHover===false?'':' sponsors-pause-hover'}" id="partners" aria-labelledby="partners-title" data-partner-speed="${Number(section.speed)||36}" data-partner-direction="${section.direction==='right'?'right':'left'}"><div class="wrap"><div class="partners-heading"><div><h2 id="partners-title">${escape(translate(section.title))}</h2>${section.subtitle?`<p>${escape(translate(section.subtitle))}</p>`:''}</div><button type="button" data-partner-pause aria-pressed="false" aria-label="${escape(translate('Sponsor lentini dayandır'))}"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg></button></div><div class="partners-marquee-window"><div class="partners-track"><div class="partners-group">${group(false)}</div><div class="partners-group" aria-hidden="true">${group(true)}</div></div></div></div></section>`;
 }
 return `<section class="sponsors-section${section.layout==='strip'?' sponsors-strip':''}" id="partners" aria-labelledby="partners-title"><div class="wrap"><div class="partners-heading"><div><h2 id="partners-title">${escape(section.title)}</h2>${section.subtitle?`<p>${escape(section.subtitle)}</p>`:''}</div><span class="partners-heading-line" aria-hidden="true"></span></div><div class="partners-grid">${items.map(item=>{
  const linked=!!item.url&&sponsorLinkOK(item.url),tag=linked?'a':'div';
  return `<${tag} class="partner-card" data-partner="${escape(item.id)}"${linked?` href="${escape(item.url)}" target="_blank" rel="sponsored noopener noreferrer"`:''}><div class="partner-logo partner-tone-${escape(item.tone)}"><div class="partner-logo-window"><img src="${escape(imageURL(item.logo))}" alt="${escape(item.alt||item.name)}" width="300" height="300" loading="lazy" decoding="async" class="partner-fit-${escape(item.fit)} partner-position-${escape(item.position)} partner-scale-${Number(item.scale)}"></div></div><div class="partner-caption"><h3>${escape(item.name)}</h3>${linked?`<span>${escape(instagramLabel)} <i aria-hidden="true">↗</i></span>`:''}</div></${tag}>`;
 }).join('')}</div></div></section>`;
}
export function bindSponsors(root=document,{translate=value=>value}={}){
 const cleanups=[];for(const section of root.querySelectorAll('.sponsors-marquee')){
  if(section.dataset.marqueeBound)continue;section.dataset.marqueeBound='true';
  const track=section.querySelector('.partners-track'),group=section.querySelector('.partners-group'),button=section.querySelector('[data-partner-pause]'),media=window.matchMedia?.('(prefers-reduced-motion: reduce)');let paused=false,visible=true;
  const resize=()=>{const width=group.getBoundingClientRect().width;if(width)section.style.setProperty('--partner-duration',(width/(Number(section.dataset.partnerSpeed)||36))+'s');};
  const sync=()=>{const reduce=!!media?.matches;section.classList.toggle('partners-stopped',paused||!visible||document.hidden||reduce);button.disabled=reduce;button.setAttribute('aria-pressed',String(paused||reduce));button.setAttribute('aria-label',translate(paused?'Sponsor lentini davam etdir':'Sponsor lentini dayandır'));button.innerHTML=paused?'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m8 5 11 7-11 7Z"/></svg>':'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';};
  button.onclick=()=>{paused=!paused;sync();};
  const ro=typeof ResizeObserver==='function'?new ResizeObserver(resize):null;ro?.observe(group);const io=typeof IntersectionObserver==='function'?new IntersectionObserver(([e])=>{visible=e.isIntersecting;sync();},{threshold:.01}):null;io?.observe(section);
  document.addEventListener('visibilitychange',sync);media?.addEventListener?.('change',sync);window.addEventListener('resize',resize,{passive:true});
  const cleanup=()=>{ro?.disconnect();io?.disconnect();document.removeEventListener('visibilitychange',sync);media?.removeEventListener?.('change',sync);window.removeEventListener('resize',resize);window.removeEventListener('pagehide',hide);};const hide=e=>{if(!e.persisted)cleanup();};window.addEventListener('pagehide',hide);cleanups.push(cleanup);resize();sync();
 }return ()=>cleanups.forEach(fn=>fn());
}
