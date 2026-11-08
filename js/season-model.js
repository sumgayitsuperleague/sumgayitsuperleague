export const REGISTRATION_EDITION = 'ssl-season-2';
export const SEASON_APP_VERSION = '20261108season1';
export const SEASON_ARCHIVE = '/movsum/arxiv';
export const REGISTRATION_PATH = '/qeydiyyat';
export const SEASON_DEFAULTS = Object.freeze({
  registrationOpen: true,
  showHome: true,
  title: 'Yeni mövsümdə meydan sənin komandanındır.',
  description: 'Komandanın adını və əlaqə məlumatını göndər. Liqa komandası növbəti addımlar üçün səninlə əlaqə saxlayacaq.',
  archiveTitle: 'Sumqayıtın 77 illiyinə həsr olunmuş mövsüm',
  archiveDescription: 'İlk mövsümün komandaları, yekun nəticələri, cədvəli və oyun videoları.'
});

const fields = {title:110, description:320, archiveTitle:130, archiveDescription:320};
const clean = (value, min, max) => typeof value === 'string' && value.length >= min && value.length <= max && value.trim() && !/[<>\p{Cc}\p{Cf}]/u.test(value);

export function validateSeasonSettings(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).some(key => !Object.hasOwn(SEASON_DEFAULTS,key))) return ['Mövsüm ayarları düzgün deyil.'];
  if (!['registrationOpen','showHome'].every(key => typeof value[key] === 'boolean') || !Object.entries(fields).every(([key,max]) => clean(value[key],2,max))) return ['Mövsümün başlığı, mətni və ya qeydiyyat ayarı düzgün deyil.'];
  return [];
}

const localized = {
  en: {title:'Bring your team into the new season.', description:'Send your team name and contact details. The league will get in touch about the next steps.', archiveTitle:'Season dedicated to Sumqayıt’s 77th anniversary', archiveDescription:'Clubs, final results, standings and match videos from the inaugural season.'},
  ru: {title:'Выведи свою команду на поле в новом сезоне.', description:'Оставь название команды и контакты. Лига свяжется с тобой и расскажет о следующих шагах.', archiveTitle:'Сезон, посвящённый 77-летию Сумгаита', archiveDescription:'Команды, итоги, турнирная таблица и видео матчей первого сезона.'}
};

export function seasonSettings(value, lang = 'az') {
  const settings = {...SEASON_DEFAULTS,...(value || {})};
  for (const key of Object.keys(fields)) if (settings[key] === SEASON_DEFAULTS[key] && localized[lang]) settings[key] = localized[lang][key];
  return settings;
}

export function normalizeRegistrationPhone(value) {
  if (typeof value !== 'string' || value.length > 32 || !/^\+?[0-9\s().-]+$/.test(value.trim())) return '';
  const digits = value.trim().replace(/[\s().-]/g,'');
  if (/^0[1-9]\d{8}$/.test(digits)) return '+994'+digits.slice(1);
  if (/^[1-9]\d{8}$/.test(digits)) return '+994'+digits;
  if (/^(?:00)?994[1-9]\d{8}$/.test(digits)) return '+'+digits.replace(/^00/,'');
  if (digits.startsWith('+994')) return /^\+994[1-9]\d{8}$/.test(digits) ? digits : '';
  if (/^\+[1-9]\d{7,14}$/.test(digits)) return digits;
  if (/^00[1-9]\d{7,14}$/.test(digits) && !digits.startsWith('00994')) return '+'+digits.slice(2);
  return '';
}

export const registrationSearchKey = value => String(value ?? '').normalize('NFKC').toLocaleLowerCase('az').replace(/ı/g,'i').replace(/ə/g,'e').normalize('NFD').replace(/\p{M}/gu,'').replace(/\s+/gu,' ').trim();

export function normalizeRegistration(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(key => !['firstName','lastName','team','phone','website'].includes(key))) return {field:'form'};
  const simple = key => typeof input[key] === 'string' ? input[key].normalize('NFC').trim().replace(/\s+/gu,' ') : '';
  const firstName=simple('firstName'),lastName=simple('lastName'),team=simple('team'),phone=normalizeRegistrationPhone(input.phone);
  for (const [key,value] of [['firstName',firstName],['lastName',lastName]]) {
    if (!clean(input[key],2,60) || !clean(value,2,60) || !/^[\p{L}\p{M}][\p{L}\p{M} .’'\-]*$/u.test(value)) return {field:key};
  }
  if (!clean(input.team,2,110) || !clean(team,2,100) || !/[\p{L}\p{N}]/u.test(team)) return {field:'team'};
  if (!phone) return {field:'phone'};
  return {value:{firstName,lastName,team,phone}};
}
