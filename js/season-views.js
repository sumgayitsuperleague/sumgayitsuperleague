import {canonicalPath,publicSeason,seasonEndpoint} from './routes-source.js';

const copy={
 az:{label:'Mövsümlər',active:'Əsas mövsüm',archive:'Arxiv',season:id=>id+'-ci mövsüm',browse:'Mövsümə bax',teams:'Komandalar',players:'Futbolçular',fans:'Azarkeş mərkəzi'},
 en:{label:'Seasons',active:'Current season',archive:'Archive',season:id=>'Season '+id,browse:'View season',teams:'Clubs',players:'Players',fans:'Fan centre'},
 ru:{label:'Сезоны',active:'Текущий сезон',archive:'Архив',season:id=>'Сезон '+id,browse:'Смотреть сезон',teams:'Команды',players:'Игроки',fans:'Центр болельщиков'}
};
const listing={'/komanda':'/komandalar','/futbolcu':'/futbolcular','/matc':'/oyunlar','/xeberler':'/xeberler'};

export function seasonPicker(lang,escape){
 const view=publicSeason();if(!view)return '';
 const c=copy[lang]||copy.az,current=canonicalPath(location.pathname);
 const path=listing[current]||(current.startsWith('/sehife/')?'/':current);
 return `<nav class="ssl-season-switch" aria-label="${c.label}">${['1','2'].map(id=>`<a data-season-link href="${escape(seasonEndpoint(path,id))}"${id===view.selected?' aria-current="page"':''} title="${id===view.active?c.active:c.archive}">${c.season(id)}</a>`).join('')}</nav>`;
}

export function seasonDirectory(lang,escape){
 const view=publicSeason(),c=copy[lang]||copy.az;
 if(!view)return '';
 const order=[view.active,view.active==='1'?'2':'1'];
 const cards=order.map(id=>{
  const active=id===view.active;
  const links=[['/komandalar',c.teams],['/futbolcular',c.players],['/azarkes',c.fans]]
   .map(([path,label])=>`<a data-season-link href="${escape(seasonEndpoint(path,id))}">${label}</a>`).join('');
  return `<article class="ssl-season-choice ${active?'ssl-season-choice-next':'ssl-season-choice-archive'}">
   <div class="ssl-season-choice-content">
    <span class="ssl-season-status">${active?c.active:c.archive}</span>
    <h2>${c.season(id)}</h2>
    <a class="ssl-season-button" data-season-link href="${escape(seasonEndpoint('/',id))}">${c.browse} ↗</a>
    <div class="ssl-season-workspace-links">${links}</div>
   </div>
  </article>`;
 }).join('');
 return `<section class="ssl-season-directory"><div class="wrap">
  <header class="ssl-season-section-head"><h1>${c.label}</h1></header>
  <div class="ssl-season-choices">${cards}</div>
 </div></section>`;
}
