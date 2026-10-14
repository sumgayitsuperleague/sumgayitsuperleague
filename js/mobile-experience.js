import * as UI from './i18n.js';
const icons={home:'<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',games:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18M7 14h3M14 14h3M7 17h3"/>',table:'<path d="M5 4h14v16H5Z M5 9h14M10 4v16M5 14h14"/>',media:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3Z"/>',fans:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-3a6 6 0 0 1 12 0v3M16 5a3 3 0 0 1 0 6M18 14a5 5 0 0 1 3 6"/>'};
export function mobileNavigation(ctx){
 if(ctx.CMS.appearance.mobileNav===false)return '';
 const routes=ctx.NAV.filter(([, ,id])=>Object.hasOwn(icons,id)),current=ctx.PAGE==='match'?'games':ctx.PAGE==='team'?'teams':ctx.PAGE;
 if(routes.length<2)return '';
 return `<nav class="mobile-dock" aria-label="${UI.t('Sürətli naviqasiya')}">${routes.map(([href,label,id])=>`<a href="${ctx.esc(href)}"${current===id?' aria-current="page"':''}><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${icons[id]}</svg><span>${ctx.esc(id==='fans'?'Azarkeş':label)}</span></a>`).join('')}</nav>`;
}
export function kickoffText(match,now=Date.now()){
 if(!match||match.status==='done')return '';
 const instant=Date.parse(match.date+'T'+match.time+':00+04:00');if(!Number.isFinite(instant))return '';
 const remaining=Math.ceil((instant-now)/60000);if(remaining<=0)return UI.t('Başlama vaxtı çatıb');
 const days=Math.floor(remaining/1440),hours=Math.floor(remaining%1440/60),minutes=remaining%60;
 return UI.t('Növbəti oyuna')+' '+(days?days+' '+UI.t('gün')+' · ':'')+(hours?hours+' '+UI.t('saat')+' · ':'')+minutes+' '+UI.t('dəqiqə');
}
export function bindMobileExperience(ctx){
 if(document.querySelector('.mobile-dock'))document.body.classList.add('has-mobile-dock');
 const nodes=[...document.querySelectorAll('[data-kickoff-hint]')];
 const draw=()=>nodes.forEach(el=>{const match=ctx.M.find(m=>m.id===el.dataset.kickoffHint);el.textContent=kickoffText(match);});if(nodes.length){draw();setInterval(draw,60000);}
}
