# Penalti arenası və mövsümün zaman tuneli

Yayım: 21 oktyabr 2026.

- `/penalti-arenasi`: istifadəyə başladıqda yüklənən Three.js mühərriki, sürüşdürmə və klaviatura idarəetməsi, cihazda saxlanan rekordlar, təkrar baxış və yüngül qrafika.
- `/zaman-tuneli`: cari liqa məlumatlarından yaranan mövsüm fəsilləri, təşkilatçı redaktələri, yalnız yayımlanmış hekayələr və sürüşdürmə ilə naviqasiya.
- Ana səhifədə hər iki bölməyə qısa keçidlər var.

## Yoxlama

Admin repozitoriyasında 333 avtomatik test, mövcud azarkeş səhifələrinin brauzer yoxlaması və yeni arena/zaman tuneli brauzer yoxlaması keçib. WebGL, mobil toxunma, ekran istiqaməti, tam ekran, təkrar baxışın hesabı dəyişməməsi və qaralamaların məxfiliyi lokal sınaqlarla yoxlanıb.

## Yayım ardıcıllığı

Ön hissə `sumgayitsuperleague/sumgayitsuperleague` repozitoriyasının `main` budağından GitHub Pages-ə yayımlanır. Worker və onun öz resursları `sumgayitsuperleague/ssl-secure-admin` repozitoriyasının `main` budağından Cloudflare Workers Builds ilə yerləşdirilir. Tam yayımda hər iki hissənin yoxlaması izlənməlidir; təkcə budaq göstəricisini dəyişmək GitHub Pages qurmasını həmişə başlatmır.

Canlı liqa məlumatları Worker-in mövcud bazasında qalır. Bu yayım üçün `js/content.js` və canlı admin məlumatları dəyişdirilməyib.
