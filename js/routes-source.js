export const POLICY_SLUGS=Object.freeze(['mexfilik','kukiler','redaksiya']);
// Public routes stay independent of the GitHub Pages file layout.
export const PAGE_ROUTES = Object.freeze({
 '/final':'final.html','/ideal-altiliq':'ideal-altiliq.html','/viktorina':'viktorina.html',
 '/':'index.html','/oyunlar':'oyunlar.html','/cedvel':'cedvel.html',
 '/komandalar':'komandalar.html','/komanda':'komanda.html','/matc':'matc.html','/futbolcular':'futbolcular.html',
 '/futbolcu':'futbolcu.html','/bombardirler':'bombardirler.html','/statistika':'statistika.html',
 '/media':'media.html','/xeberler':'xeberler.html','/haqqimizda':'haqqimizda.html','/sponsorlar':'sponsorlar.html',
 '/movsum':'merhele.html','/muqayise':'muqayise.html','/minifutbol':'minifutbol.html','/elaqe':'elaqe.html','/azarkes':'azarkes.html','/admin':'admin.html','/404':'404.html'
});
export function canonicalPath(path) {
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
 if(lang==='ru'||lang==='en')u.searchParams.set('lang',lang);else u.searchParams.delete('lang');
 return u.pathname+u.search+u.hash;
}
export function languageHref(value,lang) {
 const u=new URL(value,'https://ssl.invalid');u.pathname=canonicalPath(u.pathname);
 if(lang==='az')u.searchParams.delete('lang');else u.searchParams.set('lang',lang);
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
 if(!value.startsWith('#')){if(lang==='ru'||lang==='en')url.searchParams.set('lang',lang);else url.searchParams.delete('lang');}
 return path+url.search+url.hash;
}
