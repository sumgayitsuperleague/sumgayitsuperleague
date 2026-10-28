import {IDENTITY_STYLES,IDENTITY_TONES,IDENTITY_PRODUCTS,IDENTITY_STORAGE,identityEscape,identityText,identityArtwork,identityLogo,identityPalette,normalizeIdentity,identityFromParams,identityLink,identityZip} from './fan-identity-model.js';
import {pageListen,pageFrame,onPageCleanup,pageScope} from './page-lifecycle.js';

export function renderFanIdentity(data,config,lang='az'){
 if(config.showIdentity===false)return '';const teams=data.league?.teams||[],state=normalizeIdentity({},teams),team=teams[0],e=identityEscape,t=k=>identityText(k,lang),season=data.league?.season||'';
 const art=(product,prefix)=>identityArtwork(product,team,state,{lang,season,prefix});
 return `<section class="fi-studio" translate="no" id="kimlik" aria-labelledby="fi-title" data-fi-studio><header class="fi-heading"><div><span class="fi-eyebrow">SSL / IDENTITY STUDIO</span><h2 id="fi-title">${e(!config.identityTitle||config.identityTitle===identityText('title','az')?t('title'):config.identityTitle)}</h2><p>${e(!config.identityDescription||config.identityDescription===identityText('description','az')?t('description'):config.identityDescription)}</p></div><span class="fi-collection-label">01 — 04 / FAN COLLECTION</span></header>${!team?`<p>${t('noTeams')}</p>`:`<details class="fi-workbench"><summary aria-label="${t('open')}"><span class="fi-cover-copy"><span class="fi-eyebrow">${e(season)} / ${t('fan')}</span><strong>${t('edition')}</strong><span>${['kit','scarf','wallpaper','avatar'].map(k=>t(k)).join(' · ')}</span><span class="fi-open-cta"><span data-fi-open-text>${t('open')}</span><b aria-hidden="true">↗</b></span></span><span class="fi-cover" aria-hidden="true"><span class="fi-cover-kit">${art('kit','fi-cover-kit')}</span><span class="fi-cover-wallpaper">${art('wallpaper','fi-cover-wallpaper')}</span><span class="fi-cover-avatar">${art('avatar','fi-cover-avatar')}</span><span class="fi-cover-scarf">${art('scarf','fi-cover-scarf')}</span></span></summary><div class="fi-layout"><div class="fi-controls"><div class="fi-control-heading"><span class="fi-step">01</span><h3>${t('team')}</h3></div><label for="fi-team" class="sr-only">${t('team')}</label><select id="fi-team">${teams.map(a=>`<option value="${e(a.id)}">${e(a.name)}</option>`).join('')}</select><div class="fi-personal"><label>${t('name')}<input id="fi-name" type="text" maxlength="20" autocomplete="off" spellcheck="false" placeholder="${t('name')}"></label><label>${t('number')}<input id="fi-number" type="text" inputmode="numeric" pattern="[0-9]{1,2}" maxlength="2" value="10" autocomplete="off"></label></div><small class="fi-field-note">${t('empty')}</small><div class="fi-control-heading"><span class="fi-step">02</span><h3>${t('style')}</h3></div><div class="fi-options" role="group" aria-label="${t('style')}">${IDENTITY_STYLES.map((key,i)=>`<button type="button" data-fi-style="${key}" aria-pressed="${i===0}"><i class="fi-swatch fi-swatch--${key}" aria-hidden="true"></i><span>${t(key)}</span></button>`).join('')}</div><div class="fi-control-heading"><span class="fi-step">03</span><h3>${t('tone')}</h3></div><div class="fi-tones" role="group" aria-label="${t('tone')}">${IDENTITY_TONES.map((key,i)=>`<button type="button" data-fi-tone="${key}" aria-pressed="${i===0}"><i class="fi-tone fi-tone--${key}" aria-hidden="true"></i>${t(key)}</button>`).join('')}</div><p class="fi-disclaimer">${t('unofficial')}</p><button type="button" class="fi-reset" data-fi-reset>${t('reset')} ↻</button><a class="fi-mobile-preview" href="#fi-canvas">${t('view')} ↓</a></div><div class="fi-preview"><div class="fi-preview-top"><span>${t('view')}</span><span data-fi-size>1800 × 1620 PNG</span></div><div class="fi-tabs" role="tablist" aria-label="${t('view')}">${Object.keys(IDENTITY_PRODUCTS).map((k,i)=>`<button type="button" role="tab" aria-selected="${i===0}" tabindex="${i===0?0:-1}" aria-controls="fi-canvas" id="fi-tab-${k}" data-fi-product="${k}"><span>0${i+1}</span>${t(k)}</button>`).join('')}</div><div class="fi-canvas" id="fi-canvas" role="tabpanel" aria-labelledby="fi-tab-kit">${art('kit','fi-main')}</div><div class="fi-downloads"><button type="button" class="fi-download" data-fi-download>${t('download')} <span aria-hidden="true">↓</span></button><button type="button" class="fi-pack" data-fi-pack>${t('pack')} <span aria-hidden="true">↓</span></button></div><button type="button" class="fi-share" data-fi-share>${t('share')} ↗</button><p class="fi-status" role="status" aria-live="polite"></p><label class="fi-copy-fallback" hidden>${t('copyFallback')}<input type="text" readonly data-fi-copy></label></div></div><footer class="fi-footnote">${t('privacy')}</footer></details>`}</section>`;
}

export function bindFanIdentity(data,lang='az'){
 const root=document.querySelector('[data-fi-studio]');if(!root||!data.league?.teams?.length)return;
 const teams=data.league.teams,details=root.querySelector('details'),t=k=>identityText(k,lang),scope=pageScope(),season=data.league.season;
 const fields={team:root.querySelector('#fi-team'),name:root.querySelector('#fi-name'),number:root.querySelector('#fi-number')},status=root.querySelector('.fi-status');
 let saved={};try{saved=JSON.parse(localStorage.getItem(IDENTITY_STORAGE)||'{}');}catch{}
 const params=new URLSearchParams(location.search);if(location.hash.startsWith('#kimlik?'))for(const [key,value] of new URLSearchParams(location.hash.slice(8)))params.set(key,value);
 let state=identityFromParams(params,teams,saved),product='kit',busy=false,disposed=false,generation=0;
 let controller;const urls=new Set(),logos=new Map(),alive=()=>!disposed&&!scope?.disposed&&root.isConnected;
 const syncFields=()=>{for(const [key,el] of Object.entries(fields))el.value=state[key];};
 const selectedTeam=()=>teams.find(a=>a.id===state.team)||teams[0];
 const clearReady=()=>{const a=root.querySelector('[data-fi-file]');if(a){URL.revokeObjectURL(a.href);urls.delete(a.href);a.remove();}};
 const remember=()=>{try{localStorage.setItem(IDENTITY_STORAGE,JSON.stringify(state));}catch{}};
 const drawCover=()=>{for(const kind of Object.keys(IDENTITY_PRODUCTS)){const el=root.querySelector('.fi-cover-'+kind);if(el)el.innerHTML=identityArtwork(kind,selectedTeam(),state,{lang,season,prefix:'fi-cover-'+kind});}};
 const draw=()=>{
  const team=selectedTeam(),palette=identityPalette(team,state.tone),main=root.querySelector('#fi-canvas'),size=IDENTITY_PRODUCTS[product];
  root.style.setProperty('--fi-club',identityPalette(team,'club').main);root.style.setProperty('--fi-accent',palette.accent);root.style.setProperty('--fi-main',palette.main);
  for(const b of root.querySelectorAll('[data-fi-style]'))b.setAttribute('aria-pressed',String(b.dataset.fiStyle===state.style));
  for(const b of root.querySelectorAll('[data-fi-tone]'))b.setAttribute('aria-pressed',String(b.dataset.fiTone===state.tone));
  for(const b of root.querySelectorAll('[data-fi-product]')){const selected=b.dataset.fiProduct===product;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;}
  main.setAttribute('aria-labelledby','fi-tab-'+product);main.dataset.product=product;main.innerHTML=identityArtwork(product,team,state,{lang,season,prefix:'fi-main'});
  root.querySelector('[data-fi-size]').textContent=size.width+' × '+size.height+' PNG';
  clearReady();root.querySelector('.fi-copy-fallback').hidden=true;status.textContent='';if(!details.open)drawCover();
 };
 const setBusy=value=>{busy=value;root.setAttribute('aria-busy',String(value));for(const el of root.querySelectorAll('button,input,select'))el.disabled=value;};
 const makeURL=blob=>{const u=URL.createObjectURL(blob);urls.add(u);return u;},release=u=>{URL.revokeObjectURL(u);urls.delete(u);};
 const logoData=team=>{
  const path=identityLogo(team);if(logos.has(path))return logos.get(path);
  const promise=(async()=>{controller||=new AbortController();const r=await fetch(path,{credentials:'omit',cache:'force-cache',signal:controller.signal});if(!r.ok)throw Error('Logo unavailable');const raw=await r.blob(),mime=raw.type.split(';')[0].trim(),blob=new Blob([raw],{type:mime});if(!/^image\/(png|jpeg|webp)$/.test(mime))throw Error('Invalid logo image: '+mime);return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('Logo unreadable'));reader.readAsDataURL(blob);});})();
  logos.set(path,promise);promise.catch(()=>logos.delete(path));return promise;
 };
 const renderPNG=async(kind,team,snapshot,logo)=>{
  const size=IDENTITY_PRODUCTS[kind],svg=identityArtwork(kind,team,snapshot,{logo,lang,season,prefix:'fi-export'}),url=makeURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'})),image=new Image();
  let canvas;try{image.src=url;await image.decode();if(!alive())throw Error('Disposed');canvas=document.createElement('canvas');canvas.width=size.width;canvas.height=size.height;const context=canvas.getContext('2d');if(!context)throw Error('Canvas unavailable');context.drawImage(image,0,0,size.width,size.height);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('PNG unavailable');return blob;}
  finally{release(url);if(canvas){canvas.width=0;canvas.height=0;}image.src='';}
 };
 const download=blob=>{
  clearReady();const a=document.createElement('a'),url=makeURL(blob);a.href=url;a.download='ssl-'+state.team+'-'+(blob.type==='application/zip'?'fan-collection.zip':product+'.png');a.className='fi-file-link';a.setAttribute('data-fi-file','');a.setAttribute('data-no-router','');a.textContent=t('file')+' ↓';status.after(a);a.click();
 };
 const exportDesign=async pack=>{
  if(busy)return;clearReady();setBusy(true);status.textContent=t('busy');const snapshot={...state},team=selectedTeam(),ticket=++generation,active=()=>alive()&&generation===ticket;
  try{
   const logo=await logoData(team);if(!active())return;
   if(pack){const files=[];let i=0;for(const kind of Object.keys(IDENTITY_PRODUCTS)){status.textContent=t('busy')+' '+(++i)+' / 4';const blob=await renderPNG(kind,team,snapshot,logo);if(!active())return;files.push({name:'ssl-'+snapshot.team+'-'+kind+'.png',bytes:new Uint8Array(await blob.arrayBuffer())});}if(!active())return;download(new Blob([identityZip(files)],{type:'application/zip'}));}
   else {const blob=await renderPNG(product,team,snapshot,logo);if(!active())return;download(blob);}
   if(active())status.textContent=t(pack?'packReady':'ready');
  }catch(error){console.error('Fan collection export failed',error);if(active())status.textContent=t('failed');}
  finally{if(alive())setBusy(false);}
 };
 pageListen(root,'input',event=>{
  if(busy)return;const key=event.target.id==='fi-name'?'name':event.target.id==='fi-number'?'number':'';if(!key)return;
  if(key==='number')event.target.value=event.target.value.replace(/\D/g,'').slice(0,2);
  state=normalizeIdentity({...state,[key]:event.target.value},teams);remember();draw();
 });
 pageListen(fields.team,'change',()=>{if(busy)return;state=normalizeIdentity({...state,team:fields.team.value},teams);remember();draw();});
 pageListen(details,'toggle',()=>{root.querySelector('[data-fi-open-text]').textContent=t(details.open?'close':'open');root.querySelector('summary').setAttribute('aria-label',t(details.open?'close':'open'));if(!details.open)drawCover();});
 pageListen(root,'keydown',event=>{
  const b=event.target.closest('[data-fi-product]');if(!b||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)||busy)return;event.preventDefault();const keys=Object.keys(IDENTITY_PRODUCTS),at=keys.indexOf(product),i=event.key==='Home'?0:event.key==='End'?keys.length-1:(at+(event.key==='ArrowRight'?1:-1)+keys.length)%keys.length;product=keys[i];draw();root.querySelector('[data-fi-product="'+product+'"]').focus();
 });
 pageListen(root,'click',async event=>{
  const b=event.target.closest('button');if(!b||busy)return;
  if(b.hasAttribute('data-fi-style')||b.hasAttribute('data-fi-tone')){state=normalizeIdentity({...state,...(b.dataset.fiStyle?{style:b.dataset.fiStyle}:{tone:b.dataset.fiTone})},teams);remember();draw();}
  if(b.dataset.fiProduct){product=b.dataset.fiProduct;draw();}
  if(b.hasAttribute('data-fi-reset')){state=normalizeIdentity({team:state.team},teams);syncFields();remember();draw();}
  if(b.hasAttribute('data-fi-download'))await exportDesign(false);
  if(b.hasAttribute('data-fi-pack'))await exportDesign(true);
  if(b.hasAttribute('data-fi-share')){const url=new URL(identityLink(state,teams,lang),location.origin).href;try{await navigator.clipboard.writeText(url);if(alive())status.textContent=t('copied');}catch{if(!alive())return;root.querySelector('.fi-copy-fallback').hidden=false;const field=root.querySelector('[data-fi-copy]');field.value=url;field.focus();field.select();status.textContent=t('copyFallback');}}
 });
 pageListen(window,'ssl-preferences-reset',()=>{try{localStorage.removeItem(IDENTITY_STORAGE);}catch{}generation++;state=normalizeIdentity({},teams);syncFields();draw();});
 onPageCleanup(()=>{disposed=true;controller?.abort();for(const url of urls)URL.revokeObjectURL(url);urls.clear();logos.clear();});
 const openFromLocation=()=>{
  if(!alive()||!location.hash.startsWith('#kimlik'))return;
  if(!busy){const current=new URLSearchParams(location.search);if(location.hash.startsWith('#kimlik?'))for(const [key,value] of new URLSearchParams(location.hash.slice(8)))current.set(key,value);state=identityFromParams(current,teams,state);syncFields();draw();}
  details.open=true;pageFrame(()=>{if(alive())root.scrollIntoView({block:'start',behavior:'instant'});});
 };
 pageListen(window,'hashchange',openFromLocation);syncFields();draw();if(location.hash.startsWith('#kimlik'))openFromLocation();else if(params.has('club'))details.open=true;
}
