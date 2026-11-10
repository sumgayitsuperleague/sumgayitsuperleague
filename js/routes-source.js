export const POLICY_SLUGS=Object.freeze(['mexfilik','kukiler','redaksiya']);
export const isSiteLanguage=value=>['az','en','ru'].includes(value);
export const siteDefaultLanguage=value=>isSiteLanguage(value)?value:'az';
export const explicitLanguage=search=>{const value=new URLSearchParams(search).get('lang');return isSiteLanguage(value)?value:null;};
export const languageFor=(search,fallback='az')=>explicitLanguage(search)||siteDefaultLanguage(fallback);
export const SITE_LANGUAGE_COOKIE='ssl_language';
export const SEASON_QUERY='sezon';
export const validSeason=id=>id==='1'||id==='2';
export function publicSeason(){
 const dataset=typeof document==='undefined'?null:document.body?.dataset;
 const selected=dataset?.siteSeason,active=dataset?.siteActiveSeason;
 return validSeason(selected)&&validSeason(active)?{selected,active}:null;
}
export function seasonEndpoint(path,selected=publicSeason()?.selected){
 if(!validSeason(selected))return path;
 const url=new URL(path,'https://ssl.invalid');
 url.searchParams.set(SEASON_QUERY,selected);
 return url.pathname+url.search+url.hash;
}
export function preserveSeason(url){
 const view=publicSeason(),path=canonicalPath(url.pathname);
 if(view&&view.selected!==view.active&&!url.searchParams.has(SEASON_QUERY)&&path!=='/admin'&&(Object.hasOwn(PAGE_ROUTES,path)||path.startsWith('/sehife/'))){
  url.searchParams.set(SEASON_QUERY,view.selected);
 }
 return url;
}
export function languageFromCookie(cookies=''){
 for(const field of String(cookies).split(';')){
  const [name,value]=field.trim().split('=',2);
  if(name===SITE_LANGUAGE_COOKIE&&isSiteLanguage(value))return value;
 }
 return null;
}
export const languageCookie=value=>isSiteLanguage(value)?`${SITE_LANGUAGE_COOKIE}=${value}; Path=/; Max-Age=31536000; SameSite=Lax; Secure`:'';
let seasonRoutesReady=true;
export function configureSeasonRoutes(ready){seasonRoutesReady=ready;}
export function setRouteLanguage(url){
 if(url.searchParams.has('lang'))url.searchParams.delete('lang');
 return url;
}
// Public routes stay independent of the GitHub Pages file layout.
export const PAGE_ROUTES = Object.freeze({
 '/mekan':'mekan.html','/qeydiyyat':'qeydiyyat.html',
 '/birlikde-izle':'birlikde-izle.html','/penalti-arenasi':'penalti-arenasi.html','/final':'final.html','/ideal-altiliq':'ideal-altiliq.html','/viktorina':'viktorina.html',
 '/':'index.html','/oyunlar':'oyunlar.html','/cedvel':'cedvel.html',
 '/komandalar':'komandalar.html','/komanda':'komanda.html','/matc':'matc.html','/futbolcular':'futbolcular.html',
 '/futbolcu':'futbolcu.html','/bombardirler':'bombardirler.html','/statistika':'statistika.html',
 '/media':'media.html','/xeberler':'xeberler.html','/haqqimizda':'haqqimizda.html','/sponsorlar':'sponsorlar.html',
 '/movsum':'movsum.html','/movsum/arxiv':'merhele.html','/muqayise':'muqayise.html','/minifutbol':'minifutbol.html','/elaqe':'elaqe.html','/azarkes':'azarkes.html','/admin':'admin.html','/404':'404.html'
});
export function canonicalPath(path) {
 if(['/son-30-saniye','/son-30-saniye/','/son-30-saniye.html'].includes(path))return '/azarkes';
 if(['/liqa-zali','/liqa-zali/','/liqa-zali.html'].includes(path))return '/azarkes';
 if(['/zaman-tuneli','/zaman-tuneli/','/zaman-tuneli.html'].includes(path))return '/penalti-arenasi';
 if(['/ideal-beslik','/ideal-beslik/','/ideal-beslik.html'].includes(path))return '/ideal-altiliq';
 if(path==='/index.html'||path==='/index'||path==='/index/')return '/';
 if(['/ssenari','/ssenari/','/ssenari.html'].includes(path))return '/movsum';
 if(path==='/merhele'||path==='/merhele/'||path==='/merhele.html')return '/movsum/arxiv';
 for(const [route,file] of Object.entries(PAGE_ROUTES))if(path==='/'+file||route!=='/'&&path===route+'/')return route;
 return path;
}
function hostRoute(url,clean=true){
 const canonical=canonicalPath(url.pathname);
 if(!seasonRoutesReady&&canonical==='/movsum/arxiv'){
  url.pathname=clean?'/movsum':'/merhele.html';
  url.searchParams.set('arxiv','2026');
 }else if(clean)url.pathname=canonical;
 else if(!seasonRoutesReady&&url.pathname==='/movsum')url.pathname='/movsum.html';
 return url;
}
export function publicHref(value) {
 if(typeof value!=='string'||!value||/^(?:[a-z]+:|\/\/|#)/i.test(value))return value;
 const u=new URL(value.startsWith('/')?value:'/'+value,'https://ssl.invalid');
 hostRoute(u);
 setRouteLanguage(u);
 preserveSeason(u);
 return u.pathname+u.search+u.hash;
}
export function languageHref(value) {
 const u=hostRoute(new URL(value,'https://ssl.invalid'));
 setRouteLanguage(u);
 return u.pathname+u.search+u.hash;
}
// Generated page-file links belong to the site root; fragments belong to this document.
export function siteAnchor(value,current,lang='az',clean=true){
 if(typeof value!=='string'||!value||/^(?:mailto:|tel:|javascript:)/i.test(value))return value;
 const base=new URL(current,'https://ssl.invalid');
 const relativeFile=!/^(?:[a-z]+:|\/\/|\/|\?|#)/i.test(value);
 const url=new URL(value,relativeFile?new URL('/',base):base);
 if(url.origin!==base.origin)return value;
 hostRoute(url,clean);
 setRouteLanguage(url);
  if(!value.startsWith('#'))preserveSeason(url);
 return url.pathname+url.search+url.hash;
}
