import {pageListen,pageInterval,pageTimeout,pageFrame,onPageCleanup,pageScope} from './page-lifecycle.js';
import {editorStyleSheet,editorPath} from './site-edit-source.js';
import * as UI from './i18n.js';
export function installSiteDesign(initial,source){
 let editor=initial,path=editorPath(document.body.dataset.previewPath||location.pathname),pending=false;
 document.body.classList.add('site-public');
 const originalAttributes=new Map();let originalOrder=null;
 function sections(){const parent=document.querySelector('#app');if(!parent)return [];return [...parent.children].filter(e=>e.tagName!=='STYLE').map((e,i)=>{if(!e.dataset.siteSection)e.dataset.siteSection='section-'+i;return {id:e.dataset.siteSection,name:e.querySelector('h1,h2,h3')?.textContent||e.getAttribute('aria-label')||e.className||e.tagName,visible:(typeof getComputedStyle==='function'?getComputedStyle(e).display:e.style.display)!=='none'};});}
 function apply(){
  const available=sections();if(originalOrder===null)originalOrder=available.map(s=>s.id);for(const s of available)if(!originalOrder.includes(s.id))originalOrder.push(s.id);
  let style=document.querySelector('#ssl-site-design');if(!style){style=document.createElement('style');style.id='ssl-site-design';document.head.append(style);}const css=editorStyleSheet(editor,path);if(style.textContent!==css)style.textContent=css;
  for(const [element,values] of originalAttributes){if(!document.contains(element)){originalAttributes.delete(element);continue;}for(const [attr,value] of Object.entries(values)){if(value===null)element.removeAttribute(attr);else if(element.getAttribute(attr)!==value)element.setAttribute(attr,value);}}
  for(const row of editor.styles.filter(r=>(r.page==='*'||r.page===path)&&(r.viewport==='all'||r.viewport==='mobile'&&(typeof innerWidth==='number'?innerWidth:1280)<=760||r.viewport==='desktop'&&(typeof innerWidth==='number'?innerWidth:1280)>760))){
   let elements;try{elements=document.querySelectorAll(row.selector);}catch{continue;}for(const element of elements){const attrs={};for(const [key,value] of Object.entries(row.attrs)){if(key==='image'&&element.tagName==='IMG'){attrs.src=value;attrs.srcset=null;}else if(key==='link'&&element.tagName==='A')attrs.href=value;else if(key==='targetBlank'&&element.tagName==='A'){attrs.target=value?'_blank':null;if(value)attrs.rel='noopener noreferrer';}else if(['alt','title','placeholder','ariaLabel'].includes(key))attrs[key==='ariaLabel'?'aria-label':key]=UI.t(value);}
    const original=originalAttributes.get(element)||{};for(const [key,value] of Object.entries(attrs)){if(!Object.hasOwn(original,key))original[key]=element.getAttribute(key);if(value===null)element.removeAttribute(key);else if(element.getAttribute(key)!==value)element.setAttribute(key,value);}originalAttributes.set(element,original);
   }
  }
  const layout=editor.layouts.find(r=>r.page===path),parent=document.querySelector('#app');if(parent){const order=layout?.order||originalOrder,children=[...parent.children],map=new Map(children.map(e=>[e.dataset.siteSection,e])),ordered=[...order.map(id=>map.get(id)).filter(Boolean),...children.filter(e=>!order.includes(e.dataset.siteSection))];if(ordered.some((e,i)=>children[i]!==e))for(const child of ordered)parent.append(child);}

 }
 function update(next){editor=next;UI.configureEditorTexts(editor,source,path);UI.enhanceRoot(document.body,true);apply();}
 apply();if(typeof MutationObserver!=='undefined'){const observer=new MutationObserver(records=>{if(pending||!records.some(r=>r.addedNodes.length))return;pending=true;queueMicrotask(()=>{pending=false;apply();});});observer.observe(document.body,{childList:true,subtree:true});onPageCleanup(()=>observer.disconnect());}
 if(typeof addEventListener==='function')pageListen(window,'resize',()=>apply());
 window.SSL_SITE_VIEW={sourceText:UI.sourceText,updateEditor:update,sections,path};return {apply,update,sections};
}
