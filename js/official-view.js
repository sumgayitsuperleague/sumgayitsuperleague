import {matchStage} from './league-source.js';
import * as UI from './i18n.js';
import {ordinal} from './league-source.js';
import {uiIcon} from './ui-icons.js';

export const OFFICIAL_ART='/assets/editorial/matchnight-field.webp';
export function officialEntrance(ctx,lead,side){
 const {H,L,S,esc}=ctx,art=H.image||OFFICIAL_ART,final=L.matches.find(m=>matchStage(m)==='final'&&!m.qualificationPending),third=L.matches.find(m=>matchStage(m)==='third-place'&&!m.qualificationPending);
 const phase=H.showFinalStage!==false&&final?`<a class="official-phase" href="merhele.html#final-stage">${uiIcon('trophy')}${esc(UI.t('Final mərhələsi'))}${uiIcon('arrow')}</a>`:'';
 const secondary=H.showFinalStage!==false&&third&&final?`<a class="official-third-match" href="matc.html?id=${esc(third.id)}"><span>${esc(UI.t('3-cü yer uğrunda'))}</span><b>${esc(ctx.T[third.home].name)}<i>—</i>${esc(ctx.T[third.away].name)}</b>${uiIcon('arrow')}</a>`:'';
 const links=H.showEntryLinks?`<nav class="official-entry-links" aria-label="${esc(UI.t('Liqa mərkəzi'))}">${[['oyunlar.html','Oyunlar'],['cedvel.html','Turnir cədvəli'],['komandalar.html','Komandalar'],['merhele.html','Mövsüm mərkəzi']].map(([href,label])=>`<a href="${href}">${esc(UI.t(label))}${uiIcon('arrow')}</a>`).join('')}</nav>`:'';
 return `<section class="league-entry league-entry--official${H.image?' official-custom-art':''}">${H.image?`<div class="official-hero-art" aria-hidden="true"><img src="${esc(art)}" alt="" width="1672" height="941" fetchpriority="high" decoding="async"></div>`:''}<div class="wrap official-hero-grid${lead?'':' official-hero-empty'}"><div class="official-intro">${phase}<h1>${esc(UI.t(H.title||L.season+' mövsümü'))}</h1>${H.highlight?`<p class="official-intro-line">${esc(UI.t(H.highlight))}</p>`:''}${H.buttonLabel?`<a class="official-primary" href="${esc(H.buttonUrl||'/oyunlar')}">${esc(UI.t(H.buttonLabel))}${uiIcon('arrow')}</a>`:''}</div><div class="official-feature">${lead}${secondary}</div></div>${links?`<div class="official-entry-bar"><div class="wrap">${links}</div></div>`:''}</section><div data-panorama-editorial>${side?`<section class="league-editorial official-editorial"><div class="wrap">${side}</div></section>`:''}</div>`;
}

export function installOfficialGround(root){
 if(!root)return ()=>{};
 let visible=true;const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)')||{matches:false},pause=()=>root.classList.toggle('official-art-paused',!visible||document.hidden||reduced.matches||document.body.dataset.stadiumMotion==='none');
 const observer=typeof IntersectionObserver==='function'?new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;pause();},{threshold:.01}):null;observer?.observe(root);document.addEventListener('visibilitychange',pause);reduced.addEventListener?.('change',pause);pause();
 const dispose=()=>{observer?.disconnect();document.removeEventListener('visibilitychange',pause);reduced.removeEventListener?.('change',pause);};window.addEventListener('pagehide',event=>{if(!event.persisted)dispose();});return dispose;
}

// The same frame is used by the protected native editor, with real club data.
export function officialPreview({title,subtitle,art='',home,away,time,stage,featureType='match',featureTitle='',esc}){
 return `<div class="official-native-preview">${art?`<img class="official-preview-backdrop" src="${esc(art)}" alt="">`:''}<div><strong>${esc(title)}</strong><span>${esc(subtitle)}</span></div><section><span>${esc(stage)}</span>${featureType==='match'?`<div><span><img src="${esc(home.logo)}" alt="">${esc(home.name)}</span><b>${esc(time)}</b><span><img src="${esc(away.logo)}" alt="">${esc(away.name)}</span></div>`:`<h3>${esc(featureTitle)}</h3>`}</section></div>`;
}
