export const LEAGUE_NAME='Sumqayıt Super Liqası';
export function leagueBrandText(value){
 if(typeof value!=='string')return value;
 return value.replace(/Sumqayıt Super Liqanın/g,LEAGUE_NAME+'nın').replace(/Sumqayıt Super Liqaya/g,LEAGUE_NAME+'na').replace(/Sumqayıt Super Liqada/g,LEAGUE_NAME+'nda').replace(/Sumqayıt Super Liqadan/g,LEAGUE_NAME+'ndan').replace(/Sumqayıt Super Liqanı/g,LEAGUE_NAME+'nı').replace(/Sumqayıt Super Liqa(?!sı)/g,LEAGUE_NAME).replace(/SUMQAYIT SUPER LİQA(?!SI)/g,'SUMQAYIT SUPER LİQASI').replace(/Sumg(?:ay|a)it Super League/g,LEAGUE_NAME).replace(/Сумгаитск(?:ая Суперлига|ой Суперлиги|ую Суперлигу)/g,LEAGUE_NAME);
}
export function withLeagueBrand(value){
 if(typeof value==='string')return leagueBrandText(value);
 if(Array.isArray(value))return value.map(withLeagueBrand);
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,withLeagueBrand(v)]));
 return value;
}
