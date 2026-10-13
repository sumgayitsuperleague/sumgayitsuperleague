// Translations are tied to their original text so edits cannot reuse stale copy.
export const LANGUAGES=Object.freeze(['az','ru','en']);
export function localizationTargets(data) {
 const rows=[];
 const list=value=>Array.isArray(value)?value:[];
 const add=(parent,key,id,label,group)=>{if(parent&&typeof parent[key]==='string'&&parent[key].trim())rows.push({key:id,source:parent[key],label,group,parent,property:key});};
 for(const key of ['name','tagline','hero','address'])add(data.site,key,'site.'+key,'Sayt · '+key,'site');
 add(data.league,'name','league.name','Liqa adı','site');
 for(const key of ['city','venue','mission'])add(data.about,key,'about.'+key,'Haqqımızda · '+key,'about');
 const cms=data.cms;
 if(cms){
  for(const [section,fields] of Object.entries({home:['title','highlight','buttonLabel','announcement'],about:['title','subtitle','heading'],guide:['title','subtitle'],branding:['footerText','copyright'],seo:['title','description']}))for(const key of fields)add(cms[section],key,'cms.'+section+'.'+key,section+' · '+key,['about','guide'].includes(section)?section:'site');
  for(const n of list(cms.navigation))if(n)add(n,'label','navigation.'+n.id,n.label,'menu');
  const blocks=(items,prefix,group)=>{for(const b of list(items))if(b)for(const key of ['text','alt'])add(b,key,prefix+'.'+b.id+'.'+key,typeof b.text==='string'?b.text.slice(0,55):b.alt,group);};
  blocks(cms.about?.blocks,'aboutBlocks','about');
  blocks(cms.guide?.blocks,'guideBlocks','guide');
  add(cms.community,'title','community.title','İcma başlığı','community');
  add(cms.community?.poll,'question','community.poll.question','Səsvermə sualı','community');
  for(const p of list(cms.community?.posts))if(p)for(const key of ['title','text'])add(p,key,'social.'+p.id+'.'+key,p.title+' · '+key,'community');
  for(const p of list(cms.pages))if(p){for(const key of ['title','description','menuLabel'])add(p,key,'page.'+p.id+'.'+key,p.title+' · '+key,'pages');blocks(p.blocks,'pageBlocks.'+p.id,'pages');}
 }
 for(const kind of ['news','videos'])for(const n of list(data[kind]))if(n)for(const key of kind==='news'?['title','text','category','source']:['title','text'])add(n,key,kind+'.'+n.id+'.'+key,n.title+' · '+key,kind);
 for(let i=0;i<list(data.league?.rules).length;i++)add(data.league.rules,i,'rule.'+i,'Sıralama · '+data.league.rules[i],'rules');
 return rows;
}
export function localizedContent(source,lang) {
 if(lang==='az'||!LANGUAGES.includes(lang))return source;
 const data=JSON.parse(JSON.stringify(source)),targets=new Map(localizationTargets(data).map(row=>[row.key,row]));
 for(const entry of source.locales?.[lang]||[]){const row=targets.get(entry.key);if(row&&entry.source===row.source&&entry.text.trim())row.parent[row.property]=entry.text;}
 return data;
}
export function publicLocales(data) {
 const targets=new Map(localizationTargets(data).map(row=>[row.key,row.source]));
 return Object.fromEntries(['ru','en'].map(lang=>[lang,(Array.isArray(data.locales?.[lang])?data.locales[lang]:[]).filter(entry=>entry&&targets.get(entry.key)===entry.source)]));
}
export function validateLocales(locales,data) {
 const plain=s=>typeof s==='string'&&s.length<=12000&&!/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(s);
 if(!locales||typeof locales!=='object'||Array.isArray(locales)||Object.keys(locales).some(key=>!['ru','en'].includes(key)))return ['Dillərin məlumat quruluşu düzgün deyil.'];
 const known=new Set(localizationTargets(data).map(row=>row.key)),errors=[];
 for(const [lang,entries] of Object.entries(locales)){
  if(!Array.isArray(entries)||entries.length>1000){errors.push('Tərcümə siyahısı düzgün deyil.');continue;}
  const seen=new Set();
  for(const row of entries){if(!row||typeof row!=='object'||Array.isArray(row)||Object.keys(row).some(k=>!['key','source','text'].includes(k))||typeof row.key!=='string'||!known.has(row.key)||seen.has(row.key)||!plain(row.source)||!plain(row.text)||!row.text.trim())errors.push(lang+': tərcümə mətni və ya məzmun açarı düzgün deyil.');seen.add(row?.key);if(errors.length>=20)return errors;}
 }
 return errors;
}
