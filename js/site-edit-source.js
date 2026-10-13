import {PAGE_ROUTES,canonicalPath} from './routes-source.js';
export const defaultEditor=()=>({labels:[],styles:[],layouts:[]});
export const editorPage=p=>p==='*'||Object.hasOwn(PAGE_ROUTES,p)&&p!=='/admin'||typeof p==='string'&&/^\/sehife\/[a-z0-9][a-z0-9-]{0,79}$/.test(p);
export const selectorOK=s=>typeof s==='string'&&s.length>0&&s.length<=240&&/^[a-zA-Z0-9_*#.\[\]="'():+~> -]+$/.test(s)&&!/[{};@\\/<>]/.test(s.replace(/>/g,''));
const plain=(s,max,required=false)=>typeof s==='string'&&s.length<=max&&(!required||!!s.trim())&&!/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s);
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const keys=(x,list)=>object(x)&&Object.keys(x).every(k=>list.includes(k));
const id=x=>typeof x==='string'&&/^[a-z0-9][a-z0-9_-]{0,79}$/.test(x);
const length=x=>typeof x==='string'&&/^-?(?:\d{1,4}(?:\.\d{1,2})?|\.\d{1,2})(?:px|rem|em|%|vw|vh)$/.test(x);
const spacing=x=>typeof x==='string'&&x.split(' ').length<=4&&x.split(' ').every(v=>v==='0'||v==='auto'||length(v));
const color=x=>typeof x==='string'&&(/^#[a-fA-F0-9]{6}$/.test(x)||x==='transparent');
export const STYLE_PROPERTIES=Object.freeze({
 color,backgroundColor:color,fontSize:length,fontWeight:x=>/^(?:[1-9]00|normal|bold)$/.test(x),
 fontFamily:x=>['system','manrope','montserrat','georgia','barlow'].includes(x),
 lineHeight:x=>typeof x==='string'&&/^\d(?:\.\d{1,2})?$/.test(x)&&+x>=.5&&+x<=4,
 letterSpacing:length,textAlign:x=>['left','center','right','start','end','justify'].includes(x),
 padding:spacing,margin:spacing,borderRadius:length,gap:length,
 width:x=>x==='auto'||length(x),maxWidth:x=>x==='none'||length(x),minHeight:length,
 display:x=>['block','flex','grid','inline','inline-block','inline-flex','none'].includes(x),
 gridColumns:x=>typeof x==='string'&&/^[1-6]$/.test(x)
});
export function validateEditor(editor,{imagePath,linkOK}){
 const errors=[],check=(ok,message)=>{if(!ok&&errors.length<25)errors.push(message);return ok;};
 if(!check(keys(editor,['labels','styles','layouts']),'Canlı redaktorun quruluşu düzgün deyil.'))return errors;
 if(check(Array.isArray(editor.labels)&&editor.labels.length<=600,'Ən çox 600 mətn dəyişikliyi ola bilər.')){
  const seen=new Set(),ids=new Set();for(const r of editor.labels){if(!check(keys(r,['id','source','az','en','ru','scope']),'Mətn dəyişikliyi düzgün deyil.'))continue;
   const key=r.scope+'|'+String(r.source).trim().normalize('NFC').toLocaleLowerCase('az');check(id(r.id)&&!ids.has(r.id)&&plain(r.source,12000,true)&&['az','en','ru'].every(lang=>plain(r[lang],12000))&&editorPage(r.scope)&&!seen.has(key),'Mətnin mənbəsi, dili və ya səhifəsi düzgün deyil.');seen.add(key);ids.add(r.id);
  }
 }
 if(check(Array.isArray(editor.styles)&&editor.styles.length<=200,'Ən çox 200 element dizaynı ola bilər.')){
  const seen=new Set(),ids=new Set();for(const r of editor.styles){if(!check(keys(r,['id','selector','page','viewport','css','attrs']),'Elementin dizayn quruluşu düzgün deyil.'))continue;
   const key=r.page+'|'+r.viewport+'|'+r.selector;check(id(r.id)&&!ids.has(r.id)&&selectorOK(r.selector)&&editorPage(r.page)&&['all','desktop','mobile'].includes(r.viewport)&&!seen.has(key),'Elementin seçimi və ya görünüşü düzgün deyil.');seen.add(key);ids.add(r.id);
   check(object(r.css)&&Object.keys(r.css).length<=20&&Object.entries(r.css).every(([k,v])=>typeof v==='string'&&Object.hasOwn(STYLE_PROPERTIES,k)&&STYLE_PROPERTIES[k](v)),'Dizayn dəyəri düzgün deyil.');
   if(check(keys(r.attrs,['image','alt','title','placeholder','ariaLabel','link','targetBlank']),'Elementin əlavə ayarları düzgün deyil.')){
    for(const key of ['alt','title','placeholder','ariaLabel'])check(r.attrs[key]===undefined||plain(r.attrs[key],300),'Elementin təsviri düzgün deyil.');
    check(r.attrs.image===undefined||imagePath(r.attrs.image),'Şəkil ünvanı düzgün deyil.');check(r.attrs.link===undefined||linkOK(r.attrs.link),'Keçid düzgün deyil.');check(r.attrs.targetBlank===undefined||typeof r.attrs.targetBlank==='boolean','Keçidin açılma ayarı düzgün deyil.');
   }
  }
 }
 if(check(Array.isArray(editor.layouts)&&editor.layouts.length<=50,'Ən çox 50 səhifə düzülüşü ola bilər.')){
  const seen=new Set();for(const r of editor.layouts){if(!check(keys(r,['page','order']),'Bölmə düzülüşü düzgün deyil.'))continue;check(r.page!=='*'&&editorPage(r.page)&&!seen.has(r.page)&&Array.isArray(r.order)&&r.order.length<=50&&new Set(r.order).size===r.order.length&&r.order.every(s=>/^section-\d{1,2}$/.test(s)),'Bölmələrin sırası düzgün deyil.');seen.add(r.page);}
 }
 return errors;
}
export function editorLinkOK(value,safeLink){return safeLink(value)||typeof value==='string'&&(/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)||/^tel:[+\d ()-]{3,30}$/.test(value));}
const fonts={system:'system-ui, sans-serif',manrope:'"Manrope", system-ui, sans-serif',montserrat:'"Montserrat", system-ui, sans-serif',georgia:'Georgia, serif',barlow:'"Barlow Condensed", system-ui, sans-serif'};
export const editorPath=path=>canonicalPath(path);
export function editorStyleSheet(editor,path){
 return (editor.styles||[]).filter(r=>r.page==='*'||r.page===editorPath(path)).map(r=>{
  const declarations=Object.entries(r.css).map(([key,value])=>key==='gridColumns'?'grid-template-columns:repeat('+value+',minmax(0,1fr))!important;':key.replace(/[A-Z]/g,c=>'-'+c.toLowerCase())+':'+(key==='fontFamily'?fonts[value]:value)+'!important;').join('');
  const selector=r.selector==='body'||r.selector===':root'?'body.site-public':'body.site-public '+r.selector,rule=selector+'{'+declarations+'}';return r.viewport==='all'?rule:'@media('+(r.viewport==='mobile'?'max-width:760px':'min-width:761px')+'){'+rule+'}';
 }).join('\n');
}
