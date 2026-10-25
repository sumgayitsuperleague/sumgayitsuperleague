// Runs once outside page scopes; SPA transitions count as new page views.
export function installTraffic(){
 if(window.__sslTrafficInstalled||document.body.dataset.previewPath||!/^https?:$/.test(location.protocol))return;
 window.__sslTrafficInstalled=true;
 const privacy=()=>{
  if(!['/sehife/mexfilik','/sehife/kukiler'].includes(location.pathname)||document.querySelector('[data-ssl-measurement]'))return;
  const lang=new URLSearchParams(location.search).get('lang'),i=lang==='en'?1:lang==='ru'?2:0,copy=[['Statistika və birlikdə baxış','Statistics and watch rooms','Статистика и совместный просмотр'],['Sayt təsadüfi brauzer identifikatoru ilə ziyarətləri, açılan səhifələri və görünən səhifədəki aktiv vaxtı ölçür. Hesabatlar yalnız adminə açıqdır və son 400 günü əhatə edir; IP ünvanları saxlanmır. Otaqdakı adın və son mesajların linklə qoşulan iştirakçılara görünür. Otaq məlumatları 24 saatdan sonra silinir. YouTube məzmunu videonu açmağı seçəndə yüklənir.','The site measures visits, page views and active time on visible pages using a random browser identifier. Reports are admin-only and retained for 400 days; IP addresses are not stored. Your room name and recent messages are visible to people joining via its link. Room data expires after 24 hours. YouTube loads when you open a video.','Сайт измеряет посещения, просмотры и время на видимых страницах по случайному идентификатору браузера. Отчёты доступны только администратору и хранятся 400 дней; IP-адреса не сохраняются. Имя и последние сообщения видны участникам комнаты по ссылке. Данные комнаты удаляются через 24 часа. YouTube загружается при открытии видео.'],['Ölçməni bu brauzerdə söndür','Disable measurement in this browser','Отключить измерение в этом браузере'],['Ölçməni bu brauzerdə aç','Enable measurement in this browser','Включить измерение в этом браузере']];
  const section=document.createElement('section');section.className='fz-panel';section.dataset.sslMeasurement='1';const h=document.createElement('h2'),p=document.createElement('p'),b=document.createElement('button');h.textContent=copy[0][i];p.textContent=copy[1][i];b.type='button';b.className='btn';let off=false;try{off=localStorage.getItem('ssl-analytics-optout')==='1';}catch{}b.textContent=copy[off?3:2][i];b.addEventListener('click',()=>{try{localStorage.setItem('ssl-analytics-optout',off?'0':'1');location.reload();}catch{}});section.append(h,p,b);(document.querySelector('#app .wrap')||document.querySelector('#app'))?.append(section);
 };
 privacy();window.addEventListener('ssl-page-change',privacy);
 const blocked=()=>navigator.doNotTrack==='1'||navigator.globalPrivacyControl===true||localStorage.getItem('ssl-analytics-optout')==='1';
 let visitor='',session='',last=Date.now(),lastSession=0,current=location.pathname,pending=0;
 try{if(blocked())return;visitor=localStorage.getItem('ssl-visitor-v1')||crypto.randomUUID();localStorage.setItem('ssl-visitor-v1',visitor);}catch{return;}
 const send=(type,elapsed=0)=>{
  try{if(blocked()||document.body.dataset.previewPath)return;const now=Date.now(),stored=JSON.parse(sessionStorage.getItem('ssl-session-v1')||'null');if(stored&&now-stored.at<1800000){session=stored.id;lastSession=stored.at;}if(!session||now-lastSession>1800000)session=crypto.randomUUID();lastSession=now;sessionStorage.setItem('ssl-session-v1',JSON.stringify({id:session,at:now}));
   const body=JSON.stringify({type,visitor,session,event:crypto.randomUUID(),path:current.replace(/\.html$/,'').replace(/\/index$/,'/')||'/',referrer:document.referrer,elapsed,watching:document.querySelector('[data-wp-root]')?.dataset.playing==='true'});
   fetch('/api/traffic',{method:'POST',credentials:'omit',keepalive:true,headers:{'Content-Type':'application/json','X-SSL-Traffic':'1'},body}).catch(()=>{});
  }catch{}
 };
 const flush=()=>{const now=Date.now();if(!document.hidden)pending+=Math.min(35000,Math.max(0,now-last));last=now;if(pending>0){send('heartbeat',pending);pending=0;}};
 if(!document.hidden)send('view');
 window.addEventListener('ssl-page-change',()=>{flush();current=location.pathname;if(!document.hidden)send('view');last=Date.now();});
 setInterval(flush,30000);
 document.addEventListener('visibilitychange',()=>{if(document.hidden){const elapsed=Math.min(35000,Math.max(0,Date.now()-last));if(elapsed)send('heartbeat',elapsed);}else if(!session)send('view');last=Date.now();});
 window.addEventListener('pagehide',()=>{if(!document.hidden)flush();});
}
