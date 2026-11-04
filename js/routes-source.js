export const POLICY_SLUGS=Object.freeze(['mexfilik','kukiler','redaksiya']);
export const isSiteLanguage=value=>['az','en','ru'].includes(value);
export const siteDefaultLanguage=value=>isSiteLanguage(value)?value:'az';
export const explicitLanguage=search=>{const value=new URLSearchParams(search).get('lang');return isSiteLanguage(value)?value:null;};
export const languageFor=(search,fallback='az')=>explicitLanguage(search)||siteDefaultLanguage(fallback);
let browserDefault='az';
export function configureRouteLanguage(value){browserDefault=siteDefaultLanguage(value);}
export function setRouteLanguage(url,lang,primary=browserDefault){
 if(isSiteLanguage(lang)&&lang!==siteDefaultLanguage(primary))url.searchParams.set('lang',lang);else url.searchParams.delete('lang');
 return url;
}
// Public routes stay independent of the GitHub Pages file layout.
export const PAGE_ROUTES = Object.freeze({
 '/mekan':'mekan.html','/ssenari':'ssenari.html',
 '/birlikde-izle':'birlikde-izle.html','/penalti-arenasi':'penalti-arenasi.html','/final':'final.html','/ideal-altiliq':'ideal-altiliq.html','/viktorina':'viktorina.html',
 '/':'index.html','/oyunlar':'oyunlar.html','/cedvel':'cedvel.html',
 '/komandalar':'komandalar.html','/komanda':'komanda.html','/matc':'matc.html','/futbolcular':'futbolcular.html',
 '/futbolcu':'futbolcu.html','/bombardirler':'bombardirler.html','/statistika':'statistika.html',
 '/media':'media.html','/xeberler':'xeberler.html','/haqqimizda':'haqqimizda.html','/sponsorlar':'sponsorlar.html',
 '/movsum':'merhele.html','/muqayise':'muqayise.html','/minifutbol':'minifutbol.html','/elaqe':'elaqe.html','/azarkes':'azarkes.html','/admin':'admin.html','/404':'404.html'
});
export function canonicalPath(path) {
 if(['/son-30-saniye','/son-30-saniye/','/son-30-saniye.html'].includes(path))return '/azarkes';
 if(['/liqa-zali','/liqa-zali/','/liqa-zali.html'].includes(path))return '/azarkes';
 if(['/zaman-tuneli','/zaman-tuneli/','/zaman-tuneli.html'].includes(path))return '/penalti-arenasi';
 if(['/ideal-beslik','/ideal-beslik/','/ideal-beslik.html'].includes(path))return '/ideal-altiliq';
 if(path==='/index.html'||path==='/index'||path==='/index/')return '/';
 if(path==='/merhele'||path==='/merhele/'||path==='/merhele.html')return '/movsum';
 for(const [route,file] of Object.entries(PAGE_ROUTES))if(path==='/'+file||route!=='/'&&path===route+'/')return route;
 return path;
}
export function publicHref(value,lang='az') {
 if(typeof value!=='string'||!value||/^(?:[a-z]+:|\/\/|#)/i.test(value))return value;
 const u=new URL(value.startsWith('/')?value:'/'+value,'https://ssl.invalid');
 u.pathname=canonicalPath(u.pathname);
 setRouteLanguage(u,lang);
 return u.pathname+u.search+u.hash;
}
export function languageHref(value,lang,primary=browserDefault) {
 const u=new URL(value,'https://ssl.invalid');u.pathname=canonicalPath(u.pathname);
 setRouteLanguage(u,lang,primary);
 return u.pathname+u.search+u.hash;
}
// Generated page-file links belong to the site root; fragments belong to this document.
export function siteAnchor(value,current,lang='az',clean=true){
 if(typeof value!=='string'||!value||/^(?:mailto:|tel:|javascript:)/i.test(value))return value;
 const base=new URL(current,'https://ssl.invalid');
 const relativeFile=!/^(?:[a-z]+:|\/\/|\/|\?|#)/i.test(value);
 const url=new URL(value,relativeFile?new URL('/',base):base);
 if(url.origin!==base.origin)return value;
 const path=clean?canonicalPath(url.pathname):url.pathname;
 if(!value.startsWith('#'))setRouteLanguage(url,lang);
 return path+url.search+url.hash;
}
