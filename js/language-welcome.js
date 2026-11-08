import {canonicalPath,explicitLanguage,isSiteLanguage} from './routes-source.js';

export const LANGUAGE_PREFERENCE='ssl.language.v1';
export const LANGUAGE_WELCOME_SEEN='ssl.language.welcome.v2';
export const LANGUAGES={az:'Azərbaycanca',en:'English',ru:'Русский'};
const storageValue=(storage,key)=>{try{return storage?.getItem(key)||null;}catch{return null;}};
const write=(storage,key,value)=>{try{storage?.setItem(key,value);}catch{}};
export function languageWelcomeState({href,primary,storage,preference=null,preview=false}){
 if(preview||primary!=='en'||isSiteLanguage(preference))return {show:false};
 const url=new URL(href,'https://ssl.invalid');
 const path=canonicalPath(url.pathname),explicit=explicitLanguage(url.search);
 if(path==='/404')return {show:false};
 // A preference saved before this chooser was shown must not suppress it.
 return {show:!explicit&&storageValue(storage,LANGUAGE_WELCOME_SEEN)!=='1'};
}
export function rememberLanguage(storage,lang){
 if(isSiteLanguage(lang))write(storage,LANGUAGE_PREFERENCE,lang);
 write(storage,LANGUAGE_WELCOME_SEEN,'1');
}
export function renderLanguageWelcome(){
 return `<button class="language-welcome-close" type="button" data-language-dismiss aria-label="Bağla / Close">×</button><div class="language-welcome-brand"><img src="/assets/logo.png" alt="" width="44" height="44"><span>SUMQAYIT SUPER LEAGUE</span></div><h2 id="language-welcome-title">Saytı hansı dildə görmək istəyirsiniz?</h2><p id="language-welcome-desc" lang="en">Choose your language</p><div class="language-welcome-options">${['az','en','ru'].map(code=>`<button type="button" data-language="${code}" lang="${code}"${code==='az'?' autofocus':''}><img src="/assets/flags/${code}.svg" alt="" width="28" height="28"><span>${LANGUAGES[code]}</span><span class="language-welcome-arrow" aria-hidden="true">›</span></button>`).join('')}</div>`;
}
