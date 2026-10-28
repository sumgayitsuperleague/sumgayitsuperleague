import {playerKey,playerName,scorers} from './league-source.js';

const words=(lang,az,en,ru)=>lang==='en'?en:lang==='ru'?ru:az;
export function quizCategory(category,lang='az'){
 const labels={identity:['Liqa və qrup','League and group','Лига и группа'],squad:['Heyət','Squad','Состав'],results:['Nəticələr','Results','Результаты'],attack:['Qollar','Goals','Голы'],records:['Rekordlar','Records','Рекорды'],players:['Futbolçular','Players','Игроки'],recent:['Son oyun','Latest match','Последний матч'],discipline:['İntizam','Discipline','Дисциплина'],custom:['Xüsusi sual','Custom question','Свой вопрос']};
 return (labels[category]||labels.custom)[lang==='en'?1:lang==='ru'?2:0];
}

// Scores are the source for team totals. Named goal events are the source for
// individual scorers. Shootouts, pending qualification and planned games never
// enter those totals; a live game's saved score can enter goal/card questions.
export function quizRecordedMatches(league){
 const ids=new Set((league.teams||[]).map(t=>t.id));
 return (league.matches||[]).filter(m=>!m.qualificationPending&&['live','done'].includes(m.status)&&ids.has(m.home)&&ids.has(m.away)&&m.home!==m.away&&Number.isInteger(m.hs)&&m.hs>=0&&Number.isInteger(m.as)&&m.as>=0);
}
export function quizDataSummary(league){
 const matches=quizRecordedMatches(league);
 return {completed:matches.filter(m=>m.status==='done').length,live:matches.filter(m=>m.status==='live').length};
}

export function automaticFanQuestions(league,teamId='',lang='az'){
 const teams=league.teams||[],byId=new Map(teams.map(t=>[t.id,t])),team=byId.get(teamId),name=team?.name||'',all=quizRecordedMatches(league),recorded=all.filter(m=>!team||[m.home,m.away].includes(team.id)),played=recorded.filter(m=>m.status==='done'),result=[];
 const say=(az,en,ru)=>words(lang,az,en,ru),own=m=>m.home===team?.id?m.hs:m.as,against=m=>m.home===team?.id?m.as:m.hs;
 const scoreNote=say('Tamamlanmış və canlı oyunların saxlanmış hesabları; penalti seriyası daxil deyil.','Saved scores from completed and live matches; shootouts are excluded.','Сохранённые счета завершённых и текущих матчей; серии пенальти не учитываются.');
 const doneNote=say('Yalnız tamamlanmış oyunlar nəzərə alınır.','Only completed matches are counted.','Учитываются только завершённые матчи.');
 const playerNote=say('Qeydə alınmış fərdi qollar; avtoqollar, naməlum müəllifli qollar və penalti seriyası daxil deyil.','Recorded individual goals; own goals, unknown scorers and shootouts are excluded.','Записанные индивидуальные голы; автоголы, неизвестные авторы и серии пенальти исключены.');
 const source=(href,label)=>({href,label});
 const stats=source('/statistika',say('Statistikaya bax','View statistics','Смотреть статистику')),club=source('/komanda?t='+encodeURIComponent(team?.id||''),say('Komandanın məlumatları','Club records','Данные команды')),scoring=source('/bombardirler',say('Bombardirlərə bax','View scorers','Смотреть бомбардиров'));
 const add=(id,title,choices,category,note='',link=team?club:stats)=>{
  const unique=[...new Set(choices.map(String))].slice(0,4);if(unique.length<2)return;
  result.push({id:'auto-'+id,team:team?.id||'',title,choices:unique,answer:0,note,category,source:link,published:true});
 };
 const numeric=(id,title,n,category,note='',link)=>add(id,title,[n,Math.max(0,n-1),n+1,n+3,n+2,n+4],category,note,link);
 const named=(id,title,correct,others,category,note,link)=>add(id,title,[correct,...others.filter(x=>x!==correct)],category,note,link);
 const uniqueLeader=(id,title,rows,category,note,link)=>{
  if(!rows.length)return;const best=Math.max(...rows.map(r=>r.value)),leaders=rows.filter(r=>r.value===best);
  // Tied leaders are not silently turned into a single correct name.
  if(best>0&&leaders.length===1)named(id,title,leaders[0].label,rows.map(r=>r.label),category,note,link);
 };
 numeric('teams',say('Liqada neçə komanda iştirak edir?','How many clubs are in the league?','Сколько команд участвует в лиге?'),teams.length,'identity');
 if(team){
  const roster=team.players||[],groups=[...new Set(teams.map(t=>t.group).filter(Boolean))],groupLabel=g=>say('Qrup '+g,'Group '+g,'Группа '+g);
  if(team.group)named('team-group',say(name+' hansı qrupda çıxış edir?', 'Which group does '+name+' play in?', 'В какой группе играет '+name+'?'),groupLabel(team.group),groups.map(groupLabel),'identity','',source('/cedvel',say('Qrup cədvəli','Group table','Таблица группы')));
  numeric('roster',say(name+' heyətində neçə futbolçu qeyd olunub?','How many players are listed for '+name+'?','Сколько игроков в заявке '+name+'?'),roster.length,'squad');
  numeric('goalkeepers',say(name+' heyətində neçə qapıçı qeyd olunub?','How many goalkeepers are listed for '+name+'?','Сколько вратарей в заявке '+name+'?'),roster.filter(p=>p.gk===true).length,'squad');
  const goals=recorded.reduce((n,m)=>n+own(m),0),conceded=recorded.reduce((n,m)=>n+against(m),0);
  numeric('team-goals',say(name+' mövsümdə hazırda neçə qol vurub?','How many goals has '+name+' scored this season so far?','Сколько голов у '+name+' в этом сезоне на данный момент?'),goals,'attack',scoreNote);
  numeric('team-against',say(name+' mövsümdə hazırda neçə qol buraxıb?','How many goals has '+name+' conceded this season so far?','Сколько голов пропустила команда '+name+' в этом сезоне на данный момент?'),conceded,'attack',scoreNote);
  numeric('team-played',say(name+' neçə oyunu tamamlayıb?','How many matches has '+name+' completed?','Сколько матчей завершила команда '+name+'?'),played.length,'results',doneNote);
  if(played.length){
   const wins=played.filter(m=>own(m)>against(m)),draws=played.filter(m=>own(m)===against(m));
   numeric('team-wins',say(name+' qol hesabına görə neçə oyunda qalib gəlib?','How many wins does '+name+' have on the match score?','Сколько побед по счёту матча у '+name+'?'),wins.length,'results',doneNote+' '+say('Penalti seriyası bu saya daxil deyil.','Shootouts are excluded.','Серии пенальти не учитываются.'));
   numeric('team-draws',say(name+' üçün neçə oyun bərabər qol hesabı ilə bitib?','How many completed '+name+' matches ended with equal goal scores?','Сколько завершённых матчей '+name+' закончились с равным счётом?'),draws.length,'results',doneNote);
   numeric('team-losses',say(name+' qol hesabına görə neçə oyunda məğlub olub?','How many losses does '+name+' have on the match score?','Сколько поражений по счёту матча у '+name+'?'),played.length-wins.length-draws.length,'results',doneNote);
   numeric('team-clean-sheets',say(name+' neçə tamamlanmış oyunda qol buraxmayıb?','In how many completed matches did '+name+' keep a clean sheet?','В скольких завершённых матчах '+name+' не пропустила ни гола?'),played.filter(m=>against(m)===0).length,'results',doneNote);
   numeric('team-record',say(name+' komandasının ən məhsuldar bitmiş oyununda ümumilikdə neçə qol vurulub?','What is the highest total score in a completed match involving '+name+'?','Сколько голов в самом результативном завершённом матче '+name+'?'),Math.max(...played.map(m=>m.hs+m.as)),'records',doneNote);
   if(wins.length)numeric('team-biggest-win',say(name+' ən böyük qələbəsini neçə qol fərqi ilə qazanıb?','What is the largest winning margin recorded by '+name+'?','С какой максимальной разницей голов побеждала команда '+name+'?'),Math.max(...wins.map(m=>own(m)-against(m))),'records',doneNote);
   const last=played.slice().sort((a,b)=>(String(b.date||'')+(b.time||'')).localeCompare(String(a.date||'')+(a.time||'')))[0],opponent=byId.get(last.home===team.id?last.away:last.home),link=source('/matc?id='+encodeURIComponent(last.id),say('Oyunun protokoluna bax','View match record','Смотреть протокол матча'));
   named('last-opponent',say(name+' son tamamlanmış oyununu kimə qarşı keçirib?','Who did '+name+' face in their latest completed match?','С кем '+name+' сыграла последний завершённый матч?'),opponent.name,teams.filter(t=>t.id!==team.id).map(t=>t.name),'recent',doneNote,link);
   const score=last.hs+' : '+last.as;
   named('last-score',say(byId.get(last.home).name+' — '+byId.get(last.away).name+': son tamamlanmış görüş hansı hesabla bitib?',byId.get(last.home).name+' vs '+byId.get(last.away).name+': what was the score in their latest completed meeting?',byId.get(last.home).name+' — '+byId.get(last.away).name+': с каким счётом закончилась последняя встреча?'),score,[last.as+' : '+last.hs,(last.hs+1)+' : '+last.as,last.hs+' : '+(last.as+1),(last.hs+1)+' : '+(last.as+1)],'recent',doneNote,link);
   if(last.mvp?.p&&!last.mvp.unk){
    const people=[...new Map([...teams.filter(t=>[last.home,last.away].includes(t.id)).flatMap(t=>(t.players||[]).map(p=>[playerKey(p.name),playerName(p.name)])),...(last.goals||[]).filter(g=>g.p&&!g.unk).map(g=>[playerKey(g.p),playerName(g.p)])]).values()];
    named('last-mvp',say(name+' komandasının son bitmiş oyununda matçın ən yaxşısı kim seçilib?','Who was named MVP in '+name+"’s latest completed match?",'Кто стал лучшим игроком последнего завершённого матча '+name+'?'),playerName(last.mvp.p),people,'players','',link);
   }
  }
 }else{
  numeric('players',say('Liqanın cari heyətlərində cəmi neçə futbolçu qeyd olunub?','How many players are listed across the current league squads?','Сколько игроков заявлено в текущих составах лиги?'),teams.reduce((n,t)=>n+(t.players||[]).length,0),'squad');
  numeric('played',say('Liqada neçə tamamlanmış oyun qeyd olunub?','How many completed league matches are recorded?','Сколько завершённых матчей записано в лиге?'),played.length,'results',doneNote);
  numeric('goals',say('Liqada mövsüm ərzində hazırda neçə qol vurulub?','How many league goals have been scored this season so far?','Сколько голов забито в лиге в этом сезоне на данный момент?'),recorded.reduce((n,m)=>n+m.hs+m.as,0),'attack',scoreNote);
  if(played.length){
   numeric('record',say('Liqanın ən məhsuldar bitmiş oyununda neçə qol vurulub?','What is the highest total score in a completed league match?','Сколько голов в самом результативном завершённом матче лиги?'),Math.max(...played.map(m=>m.hs+m.as)),'records',doneNote);
   numeric('draws',say('Liqada neçə oyun bərabər qol hesabı ilə bitib?','How many completed league matches ended with equal goal scores?','Сколько завершённых матчей лиги закончились с равным счётом?'),played.filter(m=>m.hs===m.as).length,'results',doneNote);
  }
  uniqueLeader('most-goals-club',say('Hazırda liqada ən çox qol vuran komanda hansıdır?','Which club has scored the most league goals so far?','Какая команда на данный момент забила больше всего голов?'),teams.map(t=>({label:t.name,value:all.reduce((n,m)=>n+(m.home===t.id?m.hs:m.away===t.id?m.as:0),0)})),'attack',scoreNote);
 }
 const scorerRows=scorers({teams:teams.map(t=>({...t,players:t.players||[]})),matches:all.map(m=>({...m,goals:m.goals||[]}))}).filter(r=>!team||r.t===team.id),playerLabel=r=>team?r.p:r.p+' · '+byId.get(r.t).name;
 if(scorerRows.length){
  uniqueLeader('top-scorer',team?say(name+' komandasının hazırkı bombardiri kimdir?','Who is '+name+"’s current leading scorer?",'Кто сейчас лучший бомбардир команды '+name+'?'):say('Hazırda liqanın bombardirlər siyahısına kim başçılıq edir?','Who currently leads the league scoring chart?','Кто сейчас возглавляет список бомбардиров лиги?'),scorerRows.map(r=>({label:playerLabel(r),value:r.g})),'players',playerNote,scoring);
  numeric('top-scorer-goals',team?say(name+' komandasının bombardir liderinin neçə qolu var?','How many goals does '+name+"’s leading scorer have?",'Сколько голов у лидера бомбардиров команды '+name+'?'):say('Liqanın bombardir liderinin hazırda neçə qolu var?','How many goals does the league scoring leader have?','Сколько голов сейчас у лидера бомбардиров лиги?'),Math.max(...scorerRows.map(r=>r.g)),'players',playerNote,scoring);
  numeric('scoring-players',team?say(name+' üçün neçə fərqli futbolçunun adına qol yazılıb?','How many different players have scored for '+name+'?','Скольким разным игрокам '+name+' записаны голы?'):say('Liqada neçə fərqli futbolçunun adına qol yazılıb?','How many different players have recorded a league goal?','Скольким разным игрокам лиги записаны голы?'),new Set(scorerRows.map(r=>r.t+':'+playerKey(r.p))).size,'players',playerNote,scoring);
 }
 const cards=recorded.flatMap(m=>(m.cards||[]).filter(c=>[m.home,m.away].includes(c.t)&&(!team||c.t===team.id)));
 for(const [color,id,label] of [['y','yellow',say('sarı','yellow','жёлтых')],['r','red',say('qırmızı','red','красных')]])numeric(id,team?say(name+' üçün neçə '+label+' vərəqə qeydə alınıb?','How many '+label+' cards are recorded for '+name+'?','Сколько '+label+' карточек записано у '+name+'?'):say('Liqada neçə '+label+' vərəqə qeydə alınıb?','How many '+label+' cards are recorded in the league?','Сколько '+label+' карточек записано в лиге?'),cards.filter(c=>c.c===color).length,'discipline',say('Tamamlanmış və canlı oyunların saxlanmış protokolları.','Saved records from completed and live matches.','Сохранённые протоколы завершённых и текущих матчей.'));
 return result;
}

// A short attempt should cover different subjects rather than five variations
// of the same goal/count question. The caller shuffles the pool first.
export function diverseQuizQuestions(pool,limit){
 const chosen=[],deferred=[],seen=new Set();
 for(const q of pool){const key=q.category||'custom';if(seen.has(key))deferred.push(q);else{seen.add(key);chosen.push(q);}}
 return chosen.concat(deferred).slice(0,limit);
}
