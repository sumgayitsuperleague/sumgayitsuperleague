const escapeICS=value=>String(value??'').replace(/\\/g,'\\\\').replace(/\r\n|\r|\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');
// Fold by UTF-8 octets, preserving complete Azerbaijani/Russian characters.
const fold=value=>{let line='',count=0,out=[];for(const char of value){const size=new TextEncoder().encode(char).length;if(count+size>75){out.push(line);line=' ';count=1;}line+=char;count+=size;}out.push(line);return out.join('\r\n');};
export function calendarEvent(match,teams,siteName,now=new Date()){
 if(!match||!/^[a-z0-9][a-z0-9_-]{0,79}$/.test(match.id)||!/^\d{4}-\d{2}-\d{2}$/.test(match.date)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(match.time)||!teams[match.home]||!teams[match.away])return '';
 const stamp=date=>date.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z'),start=new Date(match.date+'T'+match.time+':00+04:00');
 if(!Number.isFinite(start.getTime())||new Date(start.getTime()+4*60*60*1000).toISOString().slice(0,10)!==match.date)return '';
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Sumgayit Super League//Match Calendar//AZ','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+escapeICS(match.id)+'@sumgayitsuperleague.com','DTSTAMP:'+stamp(now),'DTSTART:'+stamp(start),'SUMMARY:'+escapeICS(teams[match.home].name+' — '+teams[match.away].name),'LOCATION:'+escapeICS(match.venue),'DESCRIPTION:'+escapeICS(siteName),'URL:https://sumgayitsuperleague.com/matc?id='+encodeURIComponent(match.id),'END:VEVENT','END:VCALENDAR'];
 return lines.map(fold).join('\r\n')+'\r\n';
}
