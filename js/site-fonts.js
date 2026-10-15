// Load only the typefaces chosen in the CMS. System typography needs no request.
const families={manrope:'Manrope:wght@400;500;600;700;800',montserrat:'Montserrat:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,800;1,900',barlow:'Barlow Condensed:wght@500;600;700;800;900'};
export function installSiteFonts(appearance={},doc=document){
 const selected=[...new Set([appearance.font,appearance.headingFont])].map(key=>families[key]).filter(Boolean);
 if(!selected.length)return null;
 const url=new URL('https://fonts.googleapis.com/css2');for(const family of selected)url.searchParams.append('family',family);url.searchParams.set('display','swap');
 let link=doc.querySelector('[data-ssl-fonts]');if(!link){link=doc.createElement('link');link.rel='stylesheet';link.dataset.sslFonts='';doc.head.append(link);}link.href=url.href;return link;
}
