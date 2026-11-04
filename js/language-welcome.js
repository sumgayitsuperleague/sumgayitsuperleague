import {canonicalPath,explicitLanguage,isSiteLanguage,languageHref} from './routes-source.js';

export const LANGUAGE_PREFERENCE='ssl.language.v1';
export const LANGUAGE_WELCOME_SEEN='ssl.language.welcome.v1';
export const LANGUAGES={az:'Azərbaycanca',en:'English',ru:'Русский'};
const storageValue=(storage,key)=>{try{return storage?.getItem(key)||null;}catch{return null;}};
const write=(storage,key,value)=>{try{storage?.setItem(key,value);}catch{}};
export function languageWelcomeState({href,primary,storage,preview=false}){
 if(preview||primary!=='en')return {show:false,redirect:null};
 const url=new URL(href,'https://ssl.invalid');
 if(explicitLanguage(url.search)||canonicalPath(url.pathname)==='/404')return {show:false,redirect:null};
 const chosen=storageValue(storage,LANGUAGE_PREFERENCE);
 if(isSiteLanguage(chosen))return {show:false,redirect:chosen===primary?null:languageHref(url.href,chosen,primary)};
 return {show:storageValue(storage,LANGUAGE_WELCOME_SEEN)!=='1',redirect:null};
}
export function rememberLanguage(storage,lang){
 if(isSiteLanguage(lang))write(storage,LANGUAGE_PREFERENCE,lang);
 write(storage,LANGUAGE_WELCOME_SEEN,'1');
}
export function renderLanguageWelcome(){
 return `<button class="language-welcome-close" type="button" data-language-dismiss aria-label="Bağla / Close">×</button><div class="language-welcome-brand"><img src="/assets/logo.png" alt="" width="44" height="44"><span>SUMQAYIT SUPER LEAGUE</span></div><h2 id="language-welcome-title">Saytı hansı dildə görmək istəyirsiniz?</h2><p id="language-welcome-desc" lang="en">Choose your language</p><div class="language-welcome-options">${['az','en','ru'].map(code=>`<button type="button" data-language="${code}" lang="${code}"${code==='az'?' autofocus':''}><img src="/assets/flags/${code}.svg" alt="" width="28" height="28"><span>${LANGUAGES[code]}</span><span class="language-welcome-arrow" aria-hidden="true">›</span></button>`).join('')}</div>`;
}
