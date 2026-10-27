// Stable league dates, including browsers and Workers with partial ICU data.
const MONTHS={az:['yanvar','fevral','mart','aprel','may','iyun','iyul','avqust','sentyabr','oktyabr','noyabr','dekabr'],en:['January','February','March','April','May','June','July','August','September','October','November','December'],ru:['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']};
export function leagueDate(value,lang='az'){
 if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return '';
 const instant=Date.parse(value+'T00:00:00Z');if(!Number.isFinite(instant)||new Date(instant).toISOString().slice(0,10)!==value)return '';
 const [year,month,day]=value.split('-').map(Number);return day+' '+(MONTHS[lang]||MONTHS.az)[month-1]+' '+year;
}
export function normalizeLeagueDateText(text,lang='az'){
 if(typeof text!=='string')return text;
 return text.replace(/\b(\d{4})\s+M(0?[1-9]|1[0-2])\s+(\d{1,2})\b/g,(original,y,m,d)=>leagueDate(y+'-'+m.padStart(2,'0')+'-'+d.padStart(2,'0'),lang)||original);
}
