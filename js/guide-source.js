// Editorial guide, grounded in EMF's public introduction and ethics guidance.
const block=(id,type,text,url='')=>({id,type,text,url,alt:'',level:2});
export const GUIDE_TRANSLATIONS=[
 ['Minifutbol bələdçisi','Minifootball guide','Гид по мини-футболу'],
 ['Oyunu tanı. Liqanı daha yaxından izlə.','Understand the game. Get closer to the league.','Узнайте игру. Следите за лигой внимательнее.'],
 ['Kiçik meydan, böyük oyun','A smaller pitch, a bigger connection','Небольшое поле, большая игра'],
 ['Minifutbol daha kiçik meydan, qapı və heyətlə oynanır. Dünyada 5, 6, 7 və 8 nəfərlik formatları var; süni və təbii ot örtüklərində keçirilir. Konkret yarışın formatını onun əsasnaməsi müəyyən edir.','Minifootball uses a smaller pitch, goals and teams. Five-, six-, seven- and eight-a-side versions are played on artificial and natural grass. Each competition defines its own format.','В мини-футболе меньше поле, ворота и составы. Существуют форматы 5, 6, 7 и 8 игроков; матчи проводят на искусственной и натуральной траве. Формат конкретного турнира определяется его регламентом.'],
 ['Rəqabətin yanında hörmət','Respect belongs alongside competition','Уважение вместе с соперничеством'],
 ['EMF minifutbolun əsas dəyərləri arasında komanda işini, oyunçu inkişafını, fair-play və iştirakçılar arasında hörməti göstərir. Rəqibə və hakimə hörmət, birlikdə məsuliyyət daşımaq oyunun bir hissəsidir.','EMF highlights teamwork, player development, fair play and mutual respect. Respect for opponents and referees, and shared responsibility, are part of the game.','EMF подчёркивает командную работу, развитие игроков, честную игру и взаимное уважение. Уважение к соперникам и судье, общая ответственность — часть игры.'],
 ['Bizim liqada rəqəmlər necə oxunur?','Reading our league statistics','Как читать статистику нашей лиги'],
 ['Qələbə 3, heç-heçə 1 xal gətirir. Qrup cədvəlində O oyun, Q qələbə, H heç-heçə, M məğlubiyyət, VQ vurulan qol, BQ buraxılan qol, TF top fərqi, X isə xaldır. Tam sıralama meyarları Cədvəl səhifəsindədir.','A win earns three points and a draw one. The table shows played, wins, draws, losses, goals for and against, goal difference and points. Full ranking criteria are on the Standings page.','За победу начисляют 3 очка, за ничью — 1. Таблица показывает игры, победы, ничьи, поражения, забитые и пропущенные мячи, разницу и очки. Полные критерии — на странице таблицы.'],
 ['Avtoqol və bombardir statistikası','Own goals and the scorers chart','Автоголы и таблица бомбардиров'],
 ['Öz qapısına vurulan qol rəqib komandanın hesabına yazılır. Futbolçunun bombardir göstəricisinə əlavə edilmir. Müəllifi bilinməyən qol yekun nəticədə qalır; statistikada başqa oyunçuya aid edilmir.','An own goal counts for the opposing team, not for the player in the scorers chart. A goal with no recorded scorer stays in the result and is not assigned to another player.','Автогол засчитывается сопернику и не добавляется игроку в таблице бомбардиров. Гол без указанного автора остаётся в результате и не приписывается другому игроку.'],
 ['Oyunu izləmək üçün','Follow the match','Следите за матчем'],
 ['Matç mərkəzində nəticəni, qol müəlliflərini, kartları və qeydə alınmış MVP-ni görürsən. Media arxivindən tam yayımı və mövcud icmalları seçə bilərsən. Komandaları müqayisə edərkən onların hücum, müdafiə və qarşılıqlı oyun göstəricilərinə bax.','The match centre lists the result, scorers, cards and recorded player of the match. The media archive has full broadcasts and available highlights. Compare teams through attack, defence and head-to-head results.','В матч-центре доступны результат, авторы голов, карточки и выбранный MVP. В медиаархиве — полные трансляции и обзоры. Сравнивайте атаку, защиту и личные встречи команд.'],
 ['Mənbələr və əlavə oxu','Sources and further reading','Источники и материалы'],
 ['EMF · Minifutbol nədir?','EMF · What is minifootball?','EMF · Что такое мини-футбол?'],
 ['EMF · Fair-play və etik prinsiplər','EMF · Fair play and ethics','EMF · Честная игра и этика'],
 ['Azərbaycan Minifutbol Federasiyası','Azerbaijan Minifootball Federation','Федерация мини-футбола Азербайджана']
];
export const defaultGuide=()=>({title:GUIDE_TRANSLATIONS[0][0],subtitle:GUIDE_TRANSLATIONS[1][0],blocks:[
 block('guide-intro-heading','heading',GUIDE_TRANSLATIONS[2][0]),block('guide-intro-text','paragraph',GUIDE_TRANSLATIONS[3][0]),
 block('guide-respect-heading','heading',GUIDE_TRANSLATIONS[4][0]),block('guide-respect-text','paragraph',GUIDE_TRANSLATIONS[5][0]),
 block('guide-table-heading','heading',GUIDE_TRANSLATIONS[6][0]),block('guide-table-text','paragraph',GUIDE_TRANSLATIONS[7][0]),
 block('guide-og-heading','heading',GUIDE_TRANSLATIONS[8][0]),block('guide-og-text','paragraph',GUIDE_TRANSLATIONS[9][0]),
 block('guide-watch-heading','heading',GUIDE_TRANSLATIONS[10][0]),block('guide-watch-text','paragraph',GUIDE_TRANSLATIONS[11][0]),
 block('guide-sources-heading','heading',GUIDE_TRANSLATIONS[12][0]),
 block('guide-source-emf','button',GUIDE_TRANSLATIONS[13][0],'https://www.minifootball.eu/what-is-minifootball/'),
 block('guide-source-ethics','button',GUIDE_TRANSLATIONS[14][0],'https://www.minifootball.eu/code-of-ethics/'),
 block('guide-source-amf','button',GUIDE_TRANSLATIONS[15][0],'https://minifootball.az/')
]});
