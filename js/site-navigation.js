import {createPageScope} from './page-lifecycle.js';
import {canonicalPath} from './routes-source.js';

export function installSiteNavigation(mount){
 if(!document.querySelector('base')){const base=document.createElement('base');base.href='/';document.head.prepend(base);}
 let scope,request=0,controller=null;
 const music=()=>document.querySelector('[data-stadium-player]');
 const render=()=>{scope?.dispose();scope=createPageScope();scope.run(mount);};
 const resetBody=(page,attributes={})=>{
  scope?.dispose();
  // Remove the old page around the original audio node, never detach the audio.
  const player=music();for(const node of [...document.body.childNodes])if(node!==player)node.remove();
  document.body.className='arena-site'+(player?' has-stadium-player':'');
  for(const name of [...document.body.getAttributeNames()])if(name.startsWith('data-'))document.body.removeAttribute(name);
  for(const [name,value] of Object.entries(attributes))document.body.setAttribute(name,value);
  document.body.dataset.page=page;
  const skip=document.createElement('a');skip.className='skip-link';skip.href='#app';skip.textContent='Əsas məzmuna keç';
  const app=document.createElement('main');app.id='app';document.body.append(skip,app);
 };
 const applyData=snapshot=>{if(!snapshot?.data?.league)return false;window.CONTENT=snapshot.data;window.LEAGUE=snapshot.data.league;window.SITE=snapshot.data.site;if(Number.isFinite(snapshot.serverNow))window.__sslServerOffset=snapshot.serverNow-Date.now();return true;};
 const snapshot=async(signal)=>{const r=await fetch('/api/site-content',{cache:'no-store',credentials:'omit',signal});if(!r.ok)throw Error('Content unavailable');return r.json();};
 const metadata=next=>{
  for(const selector of ['meta[name="description"]','meta[name="theme-color"]','link[rel="canonical"]','meta[property^="og:"]','meta[name^="twitter:"]','link[rel="alternate"][hreflang]','script[type="application/ld+json"]']){
   for(const el of document.head.querySelectorAll(selector))el.remove();
   for(const el of next.head.querySelectorAll(selector))document.head.append(document.importNode(el,true));
  }
 };
 const saveScroll=()=>{history.replaceState({...history.state,ssl:true,scroll:[window.scrollX||0,window.scrollY||0]},'',location.href);};
 const position=(url,scroll)=>{
  const target=url.hash&&document.getElementById(decodeURIComponent(url.hash.slice(1)));
  if(target)target.scrollIntoView({block:'start'});else scrollTo({left:scroll?.[0]||0,top:scroll?.[1]||0,behavior:'instant'});
  const heading=document.querySelector('#app h1')||document.querySelector('#app');if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
 };
 const navigate=async(href,{pop=false,scroll}={})=>{
  const url=new URL(href,location.href);if(url.origin!==location.origin)return false;
  controller?.abort();controller=new AbortController();const ticket=++request;
  document.documentElement.classList.add('site-navigating');document.querySelector('#app')?.setAttribute('aria-busy','true');
  try{
   const [response,data]=await Promise.all([fetch(url.href,{signal:controller.signal,credentials:'same-origin',headers:{Accept:'text/html'}}),snapshot(controller.signal).catch(()=>null)]);
   if(!response.ok||!response.headers.get('content-type')?.includes('text/html'))throw Error('Page unavailable');
   const next=new DOMParser().parseFromString(await response.text(),'text/html'),page=next.body.dataset.page;
   const script=next.querySelector('script[src*="/js/app.js"]'),current=document.querySelector('script[src*="/js/app.js"]');
   if(!page||!next.querySelector('#app')||!script||current&&script.getAttribute('src')!==current.getAttribute('src'))throw Error('Page version changed');
   if(ticket!==request)return false;
   if(!pop){saveScroll();history.pushState({ssl:true,scroll:[0,0]},'',url.href);}else if(url.href!==location.href)history.replaceState(history.state,'',url.href);
   const attributes=Object.fromEntries([...next.body.attributes].filter(a=>a.name.startsWith('data-')).map(a=>[a.name,a.value]));
   // Keep the script markers in the head for later version checks.
   document.title=next.title||document.title;resetBody(page,attributes);applyData(data);metadata(next);render();
   position(url,scroll);
   window.dispatchEvent(new CustomEvent('ssl-page-change',{detail:{url:url.href}}));return true;
  }catch(error){if(error.name!=='AbortError'&&ticket===request)location.assign(url.href);return false;}
  finally{if(ticket===request){document.documentElement.classList.remove('site-navigating');document.querySelector('#app')?.removeAttribute('aria-busy');}}
 };
 const refreshLocal=()=>{const fields=[...document.querySelectorAll('#app input[id],#app select[id]')].filter(e=>!['file','password','checkbox','radio'].includes(e.type)).map(e=>[e.id,e.value]);const page=document.body.dataset.page,attributes=Object.fromEntries([...document.body.attributes].filter(a=>a.name.startsWith('data-')).map(a=>[a.name,a.value])),scroll=[window.scrollX||0,window.scrollY||0];resetBody(page,attributes);render();for(const [id,value] of fields){const field=document.getElementById(id);if(field){field.value=value;field.dispatchEvent(new window.Event(field.tagName==='SELECT'?'change':'input',{bubbles:true}));}}scrollTo({left:scroll[0],top:scroll[1],behavior:'instant'});};
 const refresh=async()=>{const data=await snapshot();if(applyData(data))refreshLocal();return data;};
 window.SSL_SITE={enabled:false,navigate,refresh,refreshLocal};
 render();
 // The protected editor retains its own navigation and lifecycle.
 if(document.body.dataset.previewPath||typeof history==='undefined'||typeof fetch!=='function'||typeof DOMParser==='undefined')return;
 window.SSL_SITE.enabled=true;history.scrollRestoration='manual';saveScroll();
 let scrollTimer;window.addEventListener('scroll',()=>{clearTimeout(scrollTimer);scrollTimer=setTimeout(saveScroll,120);},{passive:true});
 document.addEventListener('click',event=>{
  const anchor=event.target.closest?.('a[href]');if(!anchor||event.defaultPrevented||event.button>0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||anchor.hasAttribute('download')||anchor.target&&anchor.target!=='_self'||anchor.closest('[data-no-router]'))return;
  const url=new URL(anchor.href,location.href);if(url.origin!==location.origin||!/^https?:$/.test(url.protocol)||/^\/(?:admin|api|assets|cdn-cgi)(?:\/|$)/.test(url.pathname)||/\.[a-z0-9]+$/i.test(url.pathname)&&!url.pathname.endsWith('.html'))return;
  if(url.pathname===location.pathname&&url.search===location.search&&url.hash)return;
  event.preventDefault();url.pathname=canonicalPath(url.pathname);navigate(url.href);
 });
 window.addEventListener('popstate',event=>navigate(location.href,{pop:true,scroll:event.state?.scroll}));
}
