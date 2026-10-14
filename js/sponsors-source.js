// The list is empty by default: a saved deletion must never restore a sponsor.
export const SPONSOR_TONES=['light','navy','blue','red','purple'];
export const SPONSOR_SCALES=[100,125,150,175,200,225,250,275,300];
export const SPONSOR_COPY=[
 ['Sponsorlar və tərəfdaşlar','Sponsors and partners','Спонсоры и партнёры'],
 ['Tərəfdaşlarımız','Our partners','Наши партнёры'],
 ['Instagram səhifəsi','Instagram profile','Страница в Instagram'],
 ['Sumqayıt FK Könüllüləri','Sumqayıt FK Volunteers','Волонтёры ФК «Сумгаит»'],
 ['Azərbaycan Minifutbol Federasiyası','Azerbaijan Minifootball Federation','Федерация мини-футбола Азербайджана']
];
export const INITIAL_SPONSORS=[
 {id:'partner-amf',name:'AMF',logo:'/assets/logos/partner-amf-transparent.png',url:'https://www.instagram.com/minifootball.az/',alt:'Azərbaycan Minifutbol Federasiyası',visible:true,tone:'navy',fit:'contain',position:'center',scale:100},
 {id:'partner-tvn',name:'TVN.AZ',logo:'/assets/logos/partner-tvn-transparent.png',url:'https://www.instagram.com/tvn.az/',alt:'TVN.AZ',visible:true,tone:'blue',fit:'contain',position:'center',scale:100},
 {id:'partner-butaverse',name:'Butaverse',logo:'/assets/logos/partner-butaverse-transparent.png',url:'https://www.instagram.com/bv.creators/',alt:'Butaverse',visible:true,tone:'red',fit:'contain',position:'center',scale:100},
 {id:'partner-sfc-volunteers',name:'Sumqayıt FK Könüllüləri',logo:'/assets/logos/partner-sfc-volunteers-transparent.png',url:'https://www.instagram.com/sfcvolunteers/',alt:'Sumqayıt FK Könüllüləri',visible:true,tone:'purple',fit:'contain',position:'center',scale:100},
 {id:'partner-ms-liya',name:'Ms. Liya',logo:'/assets/logos/partner-ms-liya-transparent.png',url:'https://www.instagram.com/msliyachocolate/',alt:'Ms. Liya',visible:true,tone:'navy',fit:'contain',position:'center',scale:100}
];
export const defaultSponsors=()=>({enabled:true,title:'Tərəfdaşlarımız',subtitle:'',layout:'cards',showOnHome:true,showOnAbout:true,showOnOtherPages:true,items:[]});
export function sponsorLinkOK(value){
 if(value==='')return true;
 if(typeof value!=='string'||value.length>1000||/[<>\\\u0000-\u0020]/.test(value))return false;
 try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password;}catch{return false;}
}
export function validateSponsors(section,imagePath){
 const errors=[],check=(ok,message)=>{if(!ok&&errors.length<20)errors.push(message);return ok;};
 const plain=(value,max,required=false)=>typeof value==='string'&&value.length<=max&&(!required||value.trim())&&!/[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value);
 const keys=(value,allowed)=>value&&typeof value==='object'&&!Array.isArray(value)&&Object.keys(value).every(key=>allowed.includes(key));
 if(!check(keys(section,['enabled','title','subtitle','layout','showOnHome','showOnAbout','showOnOtherPages','items']),'Tərəfdaşlar bölməsinin quruluşu düzgün deyil.'))return errors;
 check(section.layout===undefined||['strip','cards'].includes(section.layout),'Tərəfdaşların düzülüşü düzgün deyil.');
 check(['enabled','showOnHome','showOnAbout','showOnOtherPages'].every(key=>typeof section[key]==='boolean')&&plain(section.title,160,true)&&plain(section.subtitle,500),'Tərəfdaşlar bölməsinin başlığı və görünməsi düzgün deyil.');
 if(check(Array.isArray(section.items)&&section.items.length<=30,'Ən çox 30 tərəfdaş əlavə edilə bilər.')){
  const ids=new Set();
  for(const item of section.items){
   if(!check(keys(item,['id','name','logo','url','alt','visible','tone','fit','position','scale']),'Tərəfdaşın məlumat quruluşu düzgün deyil.'))continue;
   check(typeof item.id==='string'&&/^[a-z0-9][a-z0-9_-]{0,79}$/.test(item.id)&&!ids.has(item.id),'Tərəfdaşın identifikatoru düzgün və unikal olmalıdır.');ids.add(item.id);
   check(plain(item.name,120,true)&&plain(item.alt,300)&&imagePath(item.logo)&&!!item.logo&&sponsorLinkOK(item.url)&&typeof item.visible==='boolean','Tərəfdaşın adı, loqosu və ya HTTPS keçidi düzgün deyil.');
   check(SPONSOR_TONES.includes(item.tone)&&['contain','cover'].includes(item.fit)&&['center','top','bottom'].includes(item.position)&&SPONSOR_SCALES.includes(item.scale),'Loqonun görünüş ayarları düzgün deyil.');
  }
 }
 return errors;
}
