// Staged audio manifest. Activate only after five verified MP3 uploads.
// No YouTube video or iframe is created here.
export const UPLOADED_FOOTBALL_AUDIO_REVISION='organiser-football-audio-2026-10-20-v1';
export const UPLOADED_FOOTBALL_TRACKS=Object.freeze([
  {
    "id": "waka-waka",
    "title": "Shakira · Waka Waka",
    "preset": "meydan",
    "source": "url",
    "url": "/assets/audio/world-cup-waka-waka-20261020.mp3",
    "enabled": true
  },
  {
    "id": "wavin-flag",
    "title": "K’NAAN · Wavin’ Flag (Coca-Cola Celebration Mix)",
    "preset": "meydan",
    "source": "url",
    "url": "/assets/audio/world-cup-wavin-flag-20261020.mp3",
    "enabled": true
  },
  {
    "id": "la-la-la",
    "title": "Shakira · La La La (Brazil 2014)",
    "preset": "meydan",
    "source": "url",
    "url": "/assets/audio/world-cup-la-la-la-20261020.mp3",
    "enabled": true
  },
  {
    "id": "we-are-one",
    "title": "We Are One (Ole Ola) · Olodum Mix",
    "preset": "meydan",
    "source": "url",
    "url": "/assets/audio/world-cup-we-are-one-20261020.mp3",
    "enabled": true
  },
  {
    "id": "hayya-hayya",
    "title": "Hayya Hayya (Better Together)",
    "preset": "meydan",
    "source": "url",
    "url": "/assets/audio/world-cup-hayya-hayya-20261020.mp3",
    "enabled": true
  }
]);
export const uploadedFootballTracks=()=>UPLOADED_FOOTBALL_TRACKS.map(track=>({...track}));
export function addUploadedFootballAudio(source){
 const data=structuredClone(source);
 const stadium=data.cms?.stadium;
 if(!stadium?.music)throw new Error('Missing live stadium settings');
 const current=Array.isArray(stadium.music.tracks)?stadium.music.tracks:[];
 // Do not replace any actively configured owner's audio selection.
 if(current.some(t=>t?.enabled&&typeof t.url==='string'&&t.url.trim()))return data;
 stadium.music={...stadium.music,enabled:true,shuffle:true,tracks:uploadedFootballTracks()};
 return data;
}
