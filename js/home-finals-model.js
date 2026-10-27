// Kickoffs are league records in Baku time, independent of the visitor's zone.
import {leagueDate} from './league-date.js';
export const HOME_FINALS_COPY={
 az:{cup:'Sumqayıt Super Liqasının kuboku',before:'Finala qədər',played:'Oyun',wins:'Qələbə',goals:'Qol',heading:'Final günü',season:'MÖVSÜMÜ',final:'Final',third:'3-cü yer uğrunda',finalCountdown:'Finala qalan vaxt',thirdCountdown:'Oyuna qalan vaxt',days:'Gün',hours:'Saat',minutes:'Dəq',seconds:'San',scheduled:'Planlaşdırılıb',live:'Canlı',done:'Tamamlanıb',soon:'Başlama vaxtı çatıb',waiting:'Oyunun başlaması gözlənilir',unscheduled:'Vaxt dəqiqləşdirilir',hub:'Final mərkəzi',match:'Matç mərkəzi',venue:'Stadionun xəritəsi',timezone:'Bakı vaxtı · UTC+4',penalties:'Penaltilər',result:'Oyunun nəticəsi',liveScore:'Canlı hesab'},
 en:{cup:'Sumqayit Super League trophy',before:'Before the final',played:'Played',wins:'Wins',goals:'Goals',heading:'Finals day',season:'SEASON',final:'Final',third:'Third-place match',finalCountdown:'Countdown to the final',thirdCountdown:'Countdown to kick-off',days:'Days',hours:'Hours',minutes:'Min',seconds:'Sec',scheduled:'Scheduled',live:'Live',done:'Full time',soon:'Kick-off time reached',waiting:'Waiting for the match to start',unscheduled:'Kick-off to be confirmed',hub:'Final centre',match:'Match centre',venue:'Stadium map',timezone:'Baku time · UTC+4',penalties:'Penalties',result:'Match result',liveScore:'Live score'},
 ru:{cup:'Кубок Сумгаитской Суперлиги',before:'До финала',played:'Матчи',wins:'Победы',goals:'Голы',heading:'День финала',season:'СЕЗОН',final:'Финал',third:'Матч за третье место',finalCountdown:'До финала',thirdCountdown:'До начала матча',days:'Дни',hours:'Часы',minutes:'Мин',seconds:'Сек',scheduled:'Запланирован',live:'В прямом эфире',done:'Матч завершён',soon:'Время начала наступило',waiting:'Ожидается начало матча',unscheduled:'Время уточняется',hub:'Центр финала',match:'Центр матча',venue:'Карта стадиона',timezone:'Время Баку · UTC+4',penalties:'Пенальти',result:'Результат матча',liveScore:'Текущий счёт'}
};
export function finalsKickoff(match){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(match?.date||'')||!/^([01]\d|2[0-3]):[0-5]\d$/.test(match?.time||''))return NaN;
 const day=Date.parse(match.date+'T00:00:00Z');if(!Number.isFinite(day)||new Date(day).toISOString().slice(0,10)!==match.date)return NaN;
 return Date.parse(match.date+'T'+match.time+':00+04:00');
}
export function finalsCountdown(match,now=Date.now()){
 if(match?.status==='done'||match?.status==='live')return {state:match.status};
 const instant=finalsKickoff(match);if(!Number.isFinite(instant)||!Number.isFinite(now))return {state:'unscheduled'};
 const remaining=Math.ceil((instant-now)/1000);if(remaining<=0)return {state:'waiting'};
 return {state:'countdown',values:[Math.floor(remaining/86400),Math.floor(remaining%86400/3600),Math.floor(remaining%3600/60),remaining%60]};
}
export function finalsDate(match,lang='az'){return leagueDate(match?.date,lang);}
