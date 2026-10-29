import {IDENTITY_STYLES,IDENTITY_TONES,IDENTITY_PRODUCTS,IDENTITY_POSTERS,IDENTITY_AVATARS,identityTexture,IDENTITY_ASSETS,IDENTITY_STORAGE,identityEscape,identityText,identityArtwork,identityLogo,identityPalette,normalizeIdentity,identityFromParams,identityLink,identityZip} from './fan-identity-model.js';
import {pageListen,pageFrame,onPageCleanup,pageScope} from './page-lifecycle.js';

export function renderFanIdentity(data,config,lang='az'){
 if(config.showIdentity===false)return '';const teams=data.league?.teams||[],state=normalizeIdentity({},teams),team=teams[0],e=identityEscape,t=k=>identityText(k,lang),season=data.league?.season||'';
 const art=(product,prefix)=>identityArtwork(product,team,state,{lang,season,prefix,preview:true});
 return `<section class="fi-studio" translate="no" id="kimlik" aria-labelledby="fi-title" data-fi-studio><header class="fi-heading"><div><span class="fi-eyebrow">SSL / IDENTITY STUDIO</span><h2 id="fi-title">${e(!config.identityTitle||config.identityTitle===identityText('title','az')?t('title'):config.identityTitle)}</h2><p>${e(!config.identityDescription||config.identityDescription===identityText('description','az')?t('description'):config.identityDescription)}</p></div><span class="fi-collection-label">01 — 04 / FAN COLLECTION</span></header>${!team?`<p>${t('noTeams')}</p>`:`<details class="fi-workbench"><summary aria-label="${t('open')}"><span class="fi-cover-copy"><span class="fi-eyebrow">${e(season)} / ${t('fan')}</span><strong>${t('edition')}</strong><span>${['kit','scarf','wallpaper','avatar'].map(k=>t(k)).join(' · ')}</span><span class="fi-open-cta"><span data-fi-open-text>${t('open')}</span><b aria-hidden="true">↗</b></span></span><span class="fi-cover" aria-hidden="true"><span class="fi-cover-kit">${art('kit','fi-cover-kit')}</span><span class="fi-cover-wallpaper">${art('wallpaper','fi-cover-wallpaper')}</span></span></summary><div class="fi-layout"><div class="fi-controls"><div class="fi-control-heading"><span class="fi-step">01</span><h3>${t('team')}</h3></div><label for="fi-team" class="sr-only">${t('team')}</label><select id="fi-team">${teams.map(a=>`<option value="${e(a.id)}">${e(a.name)}</option>`).join('')}</select><div class="fi-personal"><label>${t('name')}<input id="fi-name" type="text" maxlength="20" autocomplete="off" spellcheck="false" placeholder="${t('name')}"></label><label>${t('number')}<input id="fi-number" type="text" inputmode="numeric" pattern="[0-9]{1,2}" maxlength="2" value="10" autocomplete="off"></label></div><small class="fi-field-note">${t('empty')}</small><div data-fi-garment-options><div class="fi-control-heading"><span class="fi-step">02</span><h3>${t('style')}</h3></div><div class="fi-options" role="group" aria-label="${t('style')}">${IDENTITY_STYLES.map((key,i)=>`<button type="button" data-fi-style="${key}" aria-pressed="${i===0}"><i class="fi-swatch fi-swatch--${key}" aria-hidden="true"></i><span>${t(key)}</span></button>`).join('')}</div></div><div class="fi-compositions" hidden><div class="fi-control-heading"><span class="fi-step">02</span><h3>${t('composition')}</h3></div><div class="fi-composition-buttons"></div></div><div class="fi-control-heading"><span class="fi-step">03</span><h3>${t('tone')}</h3></div><div class="fi-tones" role="group" aria-label="${t('tone')}">${IDENTITY_TONES.map((key,i)=>`<button type="button" data-fi-tone="${key}" aria-pressed="${i===0}"><i class="fi-tone fi-tone--${key}" aria-hidden="true"></i>${t(key)}</button>`).join('')}</div><div class="fi-custom-colours"><div class="fi-control-heading"><span class="fi-step">04</span><h3>${t('custom')}</h3></div><div class="fi-colour-grid">${['primary','secondary','lettering'].map(key=>`<label class="fi-colour"><span>${t(key)}</span><span class="fi-colour-input"><input type="color" data-fi-color="${key}" aria-label="${t(key)}"><input type="text" data-fi-hex="${key}" aria-label="${t(key)} HEX" pattern="#[0-9a-fA-F]{6}" maxlength="7" spellcheck="false" autocomplete="off"></span></label>`).join('')}</div><button type="button" class="fi-palette-reset" data-fi-palette-reset>${t('paletteReset')} ↺</button></div><p class="fi-disclaimer">${t('unofficial')}</p><button type="button" class="fi-reset" data-fi-reset>${t('reset')} ↻</button><a class="fi-mobile-preview" href="#fi-canvas">${t('view')} ↓</a></div><div class="fi-preview"><div class="fi-preview-top"><span>${t('view')}</span><span data-fi-size>1800 × 1620 PNG</span></div><div class="fi-tabs" role="tablist" aria-label="${t('view')}">${Object.keys(IDENTITY_PRODUCTS).map((k,i)=>`<button type="button" role="tab" aria-selected="${i===0}" tabindex="${i===0?0:-1}" aria-controls="fi-canvas" id="fi-tab-${k}" data-fi-product="${k}"><span>0${i+1}</span>${t(k)}</button>`).join('')}</div><div class="fi-canvas" id="fi-canvas" role="tabpanel" aria-labelledby="fi-tab-kit">${art('kit','fi-main')}</div><div class="fi-view-controls"><button type="button" data-fi-360 aria-pressed="false">${t('turn')} ↻</button><span class="fi-gesture" data-fi-gesture hidden>${t('gesture')}</span><div class="fi-orbit-tools" hidden><div class="fi-orbit-buttons"><button type="button" data-fi-front>${t('front')}</button><button type="button" data-fi-quarter>${t('quarter')}</button><button type="button" data-fi-back>${t('back')}</button><button type="button" data-fi-auto aria-pressed="false">${t('auto')} ↻</button></div><label for="fi-angle">${t('angle')}<input id="fi-angle" type="range" min="0" max="360" step="1" value="0" aria-label="${t('angle')}"></label><label for="fi-zoom">${t('zoom')}<input id="fi-zoom" type="range" min="80" max="165" step="1" value="100" aria-label="${t('zoom')}"></label><button type="button" class="fi-fullscreen" data-fi-fullscreen>${t('fullscreen')} ⛶</button></div></div><div class="fi-downloads"><button type="button" class="fi-download" data-fi-download>${t('download')} <span aria-hidden="true">↓</span></button><button type="button" class="fi-pack" data-fi-pack>${t('pack')} <span aria-hidden="true">↓</span></button></div><button type="button" class="fi-share" data-fi-share>${t('share')} ↗</button><p class="fi-status" role="status" aria-live="polite"></p><label class="fi-copy-fallback" hidden>${t('copyFallback')}<input type="text" readonly data-fi-copy></label></div></div><footer class="fi-footnote">${t('privacy')}</footer></details>`}</section>`;
}

export function bindFanIdentity(data,lang='az'){
 const root=document.querySelector('[data-fi-studio]');if(!root||!data.league?.teams?.length)return;
 const teams=data.league.teams,details=root.querySelector('details'),t=k=>identityText(k,lang),scope=pageScope(),season=data.league.season;
 const fields={team:root.querySelector('#fi-team'),name:root.querySelector('#fi-name'),number:root.querySelector('#fi-number')},status=root.querySelector('.fi-status');
 let saved={};try{saved=JSON.parse(localStorage.getItem(IDENTITY_STORAGE)||'{}');}catch{}
 const params=new URLSearchParams(location.search);if(location.hash.startsWith('#kimlik?'))for(const [key,value] of new URLSearchParams(location.hash.slice(8)))params.set(key,value);
 let state=identityFromParams(params,teams,saved),product='kit',busy=false,disposed=false,generation=0;
 let viewer=null,viewerHost=null,wants3D=false,viewerTicket=0,viewerTimer=0,modelPending=false,viewerTextures=[],runtimePromise,artTicket=0,artTimer=0,fontURI='';const atlasCache=new Map(),artCache=new Map();
 let controller;const urls=new Set(),logos=new Map(),alive=()=>!disposed&&!scope?.disposed&&root.isConnected;
 const syncFields=()=>{for(const [key,el] of Object.entries(fields))el.value=state[key];};
 const selectedTeam=()=>teams.find(a=>a.id===state.team)||teams[0];
 const clearReady=()=>{const a=root.querySelector('[data-fi-file]');if(a){URL.revokeObjectURL(a.href);urls.delete(a.href);a.remove();}};
 const remember=()=>{try{localStorage.setItem(IDENTITY_STORAGE,JSON.stringify(state));}catch{}};
 const drawCover=()=>{for(const kind of ['kit','wallpaper']){const el=root.querySelector('.fi-cover-'+kind);if(el)el.innerHTML=identityArtwork(kind,selectedTeam(),state,{lang,season,prefix:'fi-cover-'+kind,preview:true});}};
 const draw=()=>{
  const team=selectedTeam(),palette=identityPalette(team,state.tone,state),main=root.querySelector('#fi-canvas'),size=IDENTITY_PRODUCTS[product];
  root.style.setProperty('--fi-club',identityPalette(team,'club').main);root.style.setProperty('--fi-accent',palette.accent);root.style.setProperty('--fi-main',palette.main);
  for(const b of root.querySelectorAll('[data-fi-style]'))b.setAttribute('aria-pressed',String(b.dataset.fiStyle===state.style));
  for(const b of root.querySelectorAll('[data-fi-tone]'))b.setAttribute('aria-pressed',String(b.dataset.fiTone===state.tone&&!state.primary&&!state.secondary&&!state.lettering));
  for(const b of root.querySelectorAll('[data-fi-product]')){const selected=b.dataset.fiProduct===product;b.setAttribute('aria-selected',String(selected));b.tabIndex=selected?0:-1;}
  main.classList.remove('fi-art-loading');main.setAttribute('aria-labelledby','fi-tab-'+product);main.dataset.product=product;main.querySelector(':scope > svg')?.remove();main.insertAdjacentHTML('afterbegin',identityArtwork(product,team,state,{lang,season,prefix:'fi-main',preview:true}));
  root.querySelector('[data-fi-size]').textContent=size.width+' × '+size.height+' PNG';
  for(const [key,field] of [['primary','main'],['secondary','accent'],['lettering','ink']]){root.querySelector('[data-fi-color="'+key+'"]').value=palette[field];const hex=root.querySelector('[data-fi-hex="'+key+'"]');if(document.activeElement!==hex)hex.value=palette[field].toUpperCase();}
  clearReady();root.querySelector('.fi-copy-fallback').hidden=true;status.textContent='';if(!details.open)drawCover();updateCompositions();update360Controls();if(wants3D&&['kit','scarf'].includes(product))schedule360();else{dispose360();if(details.open)scheduleArtwork();}
 };
 const closeExpanded=()=>{const canvas=root.querySelector('#fi-canvas');canvas.classList.remove('fi-expanded');canvas.querySelector('[data-fi-close-expanded]')?.remove();root.querySelector('[data-fi-fullscreen]')?.setAttribute('aria-expanded','false');};
 const setBusy=value=>{busy=value;root.setAttribute('aria-busy',String(value));for(const el of root.querySelectorAll('button,input,select'))el.disabled=value;if(!value&&modelPending)root.querySelector('[data-fi-download]').disabled=true;};
 const makeURL=blob=>{const u=URL.createObjectURL(blob);urls.add(u);return u;},release=u=>{URL.revokeObjectURL(u);urls.delete(u);};
 const imageData=path=>{
  if(logos.has(path))return logos.get(path);
  const promise=(async()=>{controller||=new AbortController();const r=await fetch(path,{credentials:'same-origin',cache:'force-cache',signal:controller.signal});if(!r.ok)throw Error('Logo unavailable');const raw=await r.blob(),mime=raw.type.split(';')[0].trim(),blob=new Blob([raw],{type:mime});if(!/^image\/(png|jpeg|webp)$/.test(mime))throw Error('Invalid logo image: '+mime);return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('Logo unreadable'));reader.readAsDataURL(blob);});})();
  logos.set(path,promise);promise.catch(()=>logos.delete(path));return promise;
 };
 const renderPNG=async(kind,team,snapshot,logo)=>{
  const font=await fontData(),assets={};if(kind==='wallpaper'&&snapshot.poster==='stadium')assets.stadium=await imageData(IDENTITY_ASSETS.stadium);
  let renders={};if(kind==='kit'||kind==='scarf'||(kind==='wallpaper'&&snapshot.poster==='signature')){const runtime=await loadStudio(),atlas=await designAtlas(kind==='scarf'?'scarf':'kit',team,snapshot);renders=await runtime.prepareStudioRenders(kind==='scarf'?'scarf':'kit',atlas,{keys:kind==='wallpaper'?['hero']:kind==='kit'?['front','back']:['front']});}
  const size=IDENTITY_PRODUCTS[kind],svg=identityArtwork(kind,team,snapshot,{logo,font,renders,assets,lang,season,prefix:'fi-export'}),url=makeURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'})),image=new Image();
  let canvas;try{image.src=url;await image.decode();if(!alive())throw Error('Disposed');canvas=document.createElement('canvas');canvas.width=size.width;canvas.height=size.height;const context=canvas.getContext('2d');if(!context)throw Error('Canvas unavailable');context.drawImage(image,0,0,size.width,size.height);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('PNG unavailable');return blob;}
  finally{release(url);if(canvas){canvas.width=0;canvas.height=0;}image.src='';}
 };

 const download=blob=>{
  clearReady();const a=document.createElement('a'),url=makeURL(blob);a.href=url;a.download='ssl-'+state.team+'-'+(blob.type==='application/zip'?'fan-collection.zip':product+'.png');a.className='fi-file-link';a.setAttribute('data-fi-file','');a.setAttribute('data-no-router','');a.textContent=t('file')+' ↓';status.after(a);a.click();
 };
 const exportDesign=async pack=>{
  if(busy)return;clearReady();setBusy(true);status.textContent=t('busy');const snapshot={...state},team=selectedTeam(),ticket=++generation,active=()=>alive()&&generation===ticket;
  try{
   const logo=await imageData(identityLogo(team));if(!active())return;
   if(pack){const files=[];let i=0;for(const kind of Object.keys(IDENTITY_PRODUCTS)){status.textContent=t('busy')+' '+(++i)+' / 4';const blob=await renderPNG(kind,team,snapshot,logo);if(!active())return;files.push({name:'ssl-'+snapshot.team+'-'+kind+'.png',bytes:new Uint8Array(await blob.arrayBuffer())});}if(!active())return;download(new Blob([identityZip(files)],{type:'application/zip'}));}
   else {const size=IDENTITY_PRODUCTS[product],blob=viewer&&wants3D&&['kit','scarf'].includes(product)?await viewer.exportPNG(size.width,size.height):await renderPNG(product,team,snapshot,logo);if(!active())return;download(blob);}
   if(active())status.textContent=t(pack?'packReady':'ready');
  }catch(error){console.error('Fan collection export failed',error);if(active())status.textContent=t('failed');}
  finally{if(alive())setBusy(false);}
 };
 pageListen(root,'input',event=>{
  if(busy)return;
  if(event.target.id==='fi-angle'){viewer?.setAngle(event.target.value);return;}if(event.target.id==='fi-zoom'){viewer?.setZoom(Number(event.target.value)/100);return;}
  const colour=event.target.dataset.fiColor||event.target.dataset.fiHex;if(colour){let v=event.target.value;if(!v.startsWith('#'))v='#'+v;if(/^#[\da-f]{6}$/i.test(v)){state=normalizeIdentity({...state,[colour]:v},teams);remember();draw();}return;}
  const key=event.target.id==='fi-name'?'name':event.target.id==='fi-number'?'number':'';if(!key)return;
  if(key==='number')event.target.value=event.target.value.replace(/\D/g,'').slice(0,2);
  state=normalizeIdentity({...state,[key]:event.target.value},teams);remember();draw();
 });
 pageListen(fields.team,'change',()=>{if(busy)return;state=normalizeIdentity({...state,team:fields.team.value,tone:'club',primary:'',secondary:'',lettering:''},teams);remember();draw();});
 pageListen(details,'toggle',()=>{root.querySelector('[data-fi-open-text]').textContent=t(details.open?'close':'open');root.querySelector('summary').setAttribute('aria-label',t(details.open?'close':'open'));viewer?.setVisible(details.open);if(!details.open){artTicket++;drawCover();}else if(!wants3D)scheduleArtwork();});
 pageListen(root,'keydown',event=>{
  if(event.key==='Escape'){closeExpanded();return;}
  const b=event.target.closest('[data-fi-product]');if(!b||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)||busy)return;event.preventDefault();const keys=Object.keys(IDENTITY_PRODUCTS),at=keys.indexOf(product),i=event.key==='Home'?0:event.key==='End'?keys.length-1:(at+(event.key==='ArrowRight'?1:-1)+keys.length)%keys.length;product=keys[i];draw();root.querySelector('[data-fi-product="'+product+'"]').focus();
 });
 pageListen(root,'click',async event=>{
  const b=event.target.closest('button');if(!b||busy)return;
  if(b.hasAttribute('data-fi-360')){wants3D=!wants3D;update360Controls();if(wants3D){artTicket++;await ensure360();}else{dispose360();scheduleArtwork();}}
  if(b.hasAttribute('data-fi-auto'))viewer?.setSpinning(b.getAttribute('aria-pressed')!=='true');
  if(b.hasAttribute('data-fi-front'))viewer?.setAngle(0);
  if(b.hasAttribute('data-fi-quarter'))viewer?.setAngle(45);
  if(b.hasAttribute('data-fi-fullscreen')){const target=root.querySelector('#fi-canvas');if(target.classList.contains('fi-expanded'))closeExpanded();else{target.classList.add('fi-expanded');target.insertAdjacentHTML('beforeend',`<button type="button" class="fi-close-expanded" data-fi-close-expanded aria-label="${t('closeView')}">${t('closeView')} ×</button>`);b.setAttribute('aria-expanded','true');target.querySelector('[data-fi-close-expanded]').focus();}}
  if(b.hasAttribute('data-fi-close-expanded')){closeExpanded();root.querySelector('[data-fi-fullscreen]')?.focus();}
  if(b.dataset.fiComposition){state=normalizeIdentity({...state,[product==='avatar'?'avatar':'poster']:b.dataset.fiComposition},teams);remember();draw();}
  if(b.hasAttribute('data-fi-back'))viewer?.setAngle(180);
  if(b.hasAttribute('data-fi-style')||b.hasAttribute('data-fi-tone')){state=normalizeIdentity({...state,...(b.dataset.fiStyle?{style:b.dataset.fiStyle}:{tone:b.dataset.fiTone,primary:'',secondary:'',lettering:''})},teams);remember();draw();}
  if(b.hasAttribute('data-fi-palette-reset')){state=normalizeIdentity({...state,tone:'club',primary:'',secondary:'',lettering:''},teams);remember();draw();}
  if(b.dataset.fiProduct){product=b.dataset.fiProduct;draw();}
  if(b.hasAttribute('data-fi-reset')){state=normalizeIdentity({team:state.team},teams);syncFields();remember();draw();}
  if(b.hasAttribute('data-fi-download'))await exportDesign(false);
  if(b.hasAttribute('data-fi-pack'))await exportDesign(true);
  if(b.hasAttribute('data-fi-share')){const url=new URL(identityLink(state,teams,lang),location.origin).href;try{await navigator.clipboard.writeText(url);if(alive())status.textContent=t('copied');}catch{if(!alive())return;root.querySelector('.fi-copy-fallback').hidden=false;const field=root.querySelector('[data-fi-copy]');field.value=url;field.focus();field.select();status.textContent=t('copyFallback');}}
 });
 function update360Controls(){
  const enabled=['kit','scarf'].includes(product),button=root.querySelector('[data-fi-360]');button.hidden=!enabled;button.setAttribute('aria-pressed',String(wants3D&&enabled));button.textContent=t(wants3D?'flat':'turn')+' ↻';root.querySelector('.fi-orbit-tools').hidden=!(wants3D&&enabled);root.querySelector('[data-fi-gesture]').hidden=!(wants3D&&enabled);
 }
 function dispose360(){
  closeExpanded();viewerTicket++;modelPending=false;if(viewerTimer)clearTimeout(viewerTimer);viewer?.destroy();viewer=null;viewerHost?.remove();viewerHost=null;for(const image of viewerTextures){image.width=0;image.height=0;}viewerTextures=[];root.querySelector('#fi-canvas')?.classList.remove('fi-has-360');if(!busy)root.querySelector('[data-fi-download]').disabled=false;
 }
 function schedule360(){modelPending=true;root.querySelector('[data-fi-download]').disabled=true;viewerTicket++;if(viewerTimer)clearTimeout(viewerTimer);viewerTimer=setTimeout(()=>{if(alive()&&wants3D)void ensure360();},170);}
 async function textureCanvas(svg,width,height){
  const url=makeURL(new Blob([svg],{type:'image/svg+xml;charset=utf-8'})),image=new Image();try{image.src=url;await image.decode();if(!alive())throw Error('Disposed');const out=document.createElement('canvas');out.width=width;out.height=height;const ctx=out.getContext('2d');if(!ctx)throw Error('Canvas unavailable');ctx.drawImage(image,0,0,width,height);return out;}finally{release(url);image.src='';}
 }
 async function ensure360(){
  if(!wants3D||!['kit','scarf'].includes(product)||!alive())return;
  const ticket=++viewerTicket,kind=product,snapshot={...state},team=selectedTeam(),valid=()=>alive()&&ticket===viewerTicket&&wants3D&&product===kind,downloadButton=root.querySelector('[data-fi-download]');
  root.querySelector('#fi-canvas').classList.remove('fi-art-loading');modelPending=true;downloadButton.disabled=true;status.textContent=t('preparing360');
  try{
   const [runtime,atlas]=await Promise.all([loadStudio(),designAtlas(kind,team,snapshot)]);if(!valid())return;
   const next={kind,atlas,colour:identityPalette(team,snapshot.tone,snapshot).main,club:team.name,season,label:team.name+' · '+t(kind)+' · '+t('gesture')};
   if(viewer)await viewer.update(next);else{
    viewerHost=document.createElement('div');viewerHost.className='fi-360-host';viewerHost.dataset.fiModel=kind;root.querySelector('#fi-canvas').append(viewerHost);
    const created=await runtime.createFanStudio(viewerHost,{...next,onChange(value){if(!alive())return;const angle=root.querySelector('#fi-angle'),zoom=root.querySelector('#fi-zoom');if(document.activeElement!==angle)angle.value=value.angle;if(document.activeElement!==zoom)zoom.value=Math.round(value.zoom*100);root.querySelector('[data-fi-auto]').setAttribute('aria-pressed',String(value.spinning));}});
    if(!valid()){created.destroy();return;}viewer=created;
   }
   if(!valid())return;viewerHost.dataset.fiModel=kind;root.querySelector('#fi-canvas').classList.add('fi-has-360');viewer.setVisible(details.open);if(status.textContent===t('preparing360'))status.textContent='';
  }catch(error){if(valid()){dispose360();wants3D=false;update360Controls();status.textContent=t('failed360');console.error('Fan studio view failed',error);}}
  finally{if(ticket===viewerTicket){modelPending=false;if(!busy)downloadButton.disabled=false;}}
 }
 function updateCompositions(){
  const enabled=product==='wallpaper'||product==='avatar',box=root.querySelector('.fi-compositions');box.hidden=!enabled;root.querySelector('[data-fi-garment-options]').hidden=enabled;
  if(enabled){const key=product==='avatar'?'avatar':'poster',choices=key==='avatar'?IDENTITY_AVATARS:IDENTITY_POSTERS;root.querySelector('.fi-composition-buttons').innerHTML=choices.map(c=>`<button type="button" data-fi-composition="${c}" aria-pressed="${state[key]===c}">${t(c)}</button>`).join('');}
 }
 const loadStudio=()=>runtimePromise||=(import(new URL(document.body.dataset.previewPath?'/fan-studio-runtime.js?v=20261029atelier5':'/js/fan-studio-runtime.js?v=20261029atelier5',location.origin).href).catch(error=>{runtimePromise=null;throw error;}));
 const fontData=()=>{
  const path=IDENTITY_ASSETS.font;if(logos.has(path))return logos.get(path);
  const promise=(async()=>{controller||=new AbortController();const response=await fetch(path,{credentials:'same-origin',cache:'force-cache',signal:controller.signal});if(!response.ok)throw Error('Display font unavailable');const data=await response.arrayBuffer(),blob=new Blob([data],{type:'font/woff'});return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>{fontURI=reader.result;resolve(fontURI);};reader.onerror=()=>reject(Error('Display font unreadable'));reader.readAsDataURL(blob);});})();logos.set(path,promise);promise.catch(()=>logos.delete(path));return promise;
 };
 const designAtlas=(kind,team,snapshot)=>{
  const key=kind+':'+JSON.stringify(snapshot);if(atlasCache.has(key))return atlasCache.get(key);
  const promise=(async()=>{const [logo,font]=await Promise.all([imageData(identityLogo(team)),fontData()]);return textureCanvas(identityTexture(kind,team,snapshot,{logo,font,lang,season}),2048,kind==='scarf'?160:1024);})();atlasCache.set(key,promise);while(atlasCache.size>2)atlasCache.delete(atlasCache.keys().next().value);promise.catch(()=>atlasCache.delete(key));return promise;
 };
 function scheduleArtwork(){
  if(typeof Image==='undefined'||typeof document.createElement('canvas').getContext!=='function')return;
  artTicket++;if(artTimer)clearTimeout(artTimer);artTimer=setTimeout(()=>{void prepareArtwork();},80);
 }
 async function prepareArtwork(){
  const ticket=++artTicket,kind=product,snapshot={...state},team=selectedTeam(),valid=()=>alive()&&ticket===artTicket&&product===kind&&!(wants3D&&['kit','scarf'].includes(kind));
  if(!valid())return;const main=root.querySelector('#fi-canvas'),needsRenders=kind==='kit'||kind==='scarf'||(kind==='wallpaper'&&snapshot.poster==='signature'),key=kind+':'+JSON.stringify(snapshot);
  try{
   const font=await fontData();let renders=artCache.get(key)||{};
   if(needsRenders&&!artCache.has(key)){main.classList.add('fi-art-loading');const [runtime,atlas]=await Promise.all([loadStudio(),designAtlas(kind==='scarf'?'scarf':'kit',team,snapshot)]);if(!valid())return;renders=await runtime.prepareStudioRenders(kind==='scarf'?'scarf':'kit',atlas,{preview:true,keys:kind==='wallpaper'?['hero']:kind==='kit'?['front','back']:['front']});artCache.set(key,renders);while(artCache.size>4)artCache.delete(artCache.keys().next().value);}
   if(!valid())return;main.querySelector(':scope > svg')?.remove();main.insertAdjacentHTML('afterbegin',identityArtwork(kind,team,snapshot,{lang,season,prefix:'fi-main',preview:true,font,renders}));
  }catch(error){if(valid()){status.textContent=t('failed');console.error('Fan artwork preview failed',error);}}
  finally{if(valid())main.classList.remove('fi-art-loading');}
 }
 pageListen(root,'focusout',event=>{if(event.target.hasAttribute?.('data-fi-hex')){const key=event.target.dataset.fiHex,palette=identityPalette(selectedTeam(),state.tone,state);event.target.value=palette[{primary:'main',secondary:'accent',lettering:'ink'}[key]].toUpperCase();}});
 pageListen(window,'ssl-preferences-reset',()=>{try{localStorage.removeItem(IDENTITY_STORAGE);}catch{}generation++;state=normalizeIdentity({},teams);syncFields();draw();});
 onPageCleanup(()=>{disposed=true;artTicket++;if(artTimer)clearTimeout(artTimer);dispose360();atlasCache.clear();artCache.clear();controller?.abort();for(const url of urls)URL.revokeObjectURL(url);urls.clear();logos.clear();});
 const openFromLocation=()=>{
  if(!alive()||!location.hash.startsWith('#kimlik'))return;
  if(!busy){const current=new URLSearchParams(location.search);if(location.hash.startsWith('#kimlik?'))for(const [key,value] of new URLSearchParams(location.hash.slice(8)))current.set(key,value);state=identityFromParams(current,teams,state);syncFields();draw();}
  details.open=true;pageFrame(()=>{if(alive())root.scrollIntoView({block:'start',behavior:'instant'});});
 };
 pageListen(window,'hashchange',openFromLocation);syncFields();draw();if(location.hash.startsWith('#kimlik'))openFromLocation();else if(params.has('club'))details.open=true;
}
