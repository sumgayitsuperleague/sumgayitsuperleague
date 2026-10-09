SUMQAYIT SUPER LİQA — PRO 2026
=================================

Bu paket sizin göndərdiyiniz saytın yenilənmiş V2 versiyasıdır.
ORİJİNAL 8 KOMANDA LOQOSU, LİQA LOQOSU, 2026 MƏLUMATLARI VƏ
NƏTİCƏ PARSERİ QORUNUB.

SAYTI AÇMAQ
-----------
1. ZIP arxivini tam açın.
2. index.html faylını brauzerdə açın və ya faylları hostinqə yükləyin.
3. Canlı domenə yerləşdirmək üçün ZIP içindəki BÜTÜN fayl və qovluqları
   (ZIP-in ana qovluğunu deyil, içindəkiləri) public_html/www içinə köçürün.
4. Mövcud saytı əvəz etməzdən əvvəl hostinqdən TAM BACKUP götürün.
5. Keşi yeniləyin: Ctrl + F5; mobil brauzerdə sayt məlumatlarını yeniləyin.
6. Əgər hostinqdə köhnə fayllar qalırsa, yeni fayllarla əvəzləndiyini yoxlayın.

YENİ SƏHİFƏLƏR
--------------
xeberler.html      Xəbərlər: təsdiqlənmiş mənbələrə yönləndirən kartlar
media.html         SSL TV: məlum YouTube oyun arxivi və sosial linklər
haqqimizda.html    Liqa haqqında təqdimat
futbolcular.html   Bütün heyətlərdəki futbolçuların axtarışı/filtri
futbolcu.html      Fərdi futbolçu profili (?t=agt&p=...)
matc.html          Matç mərkəzi (?id=r1-qrt-kmn)

BÜTÜN ƏVVƏLKİ SƏHİFƏLƏR SAXLANILIB:
index, oyunlar, cedvel, komandalar, komanda, bombardirler, statistika,
admin və 404.

YENİ MATERİALLAR
----------------
css/pro.css          Yeni dizayn sistemi; köhnə style.css saxlanılıb.
js/content.js        Yoxlanmış xəbər linkləri, video linkləri və sosial kanallar.
assets/og-cover.png  1200x630 sosial şəbəkə link önizləmə şəkli.
sitemap.xml          Əsas açıq səhifələrin indeks siyahısı.
robots.txt           Sitemap ünvanı və admin üçün indeks istisnası.

NƏTİCƏLƏRİ YENİLƏMƏK (ƏVVƏLKİ QAYDA DƏYİŞMİR)
------------------------------------------------
1. admin.html səhifəsini kompüterinizdə açın (təhlükəsizlik üçün onlayn
   sayta yerləşdirmədən də işlədə bilərsiniz).
2. Turun nəticələrini mətndə daxil edin və “Analiz et” düyməsinə basın.
3. “Yenilənmiş data.js-i yüklə” düyməsinə basın.
4. Hazırlanan faylı hostinqdə js/data.js ilə əvəz edin.
5. Bütün səhifələr (turnir cədvəli, oyun, statistika, profil) yenilənəcək.

XƏBƏR, VIDEO VƏ SOSİAL MEDİA YENİLƏMƏK
-------------------------------------
- js/content.js içində `news` siyahısına yeni xəbər kartları artırın:
  id, date (YYYY-MM-DD), category, title, summary, source, url, mark.
- `videos` siyahısına video əlavə edin: label, date, match (data.js-də
  matç ID-si), url, home və away (komanda ID-ləri).
- Komandaların ID-ləri js/data.js içindədir; faktiki heyət və oyun
  məlumatlarını dəyişərkən eyni ID-ləri saxlayın.
- js/config.js içində YouTube, Instagram, TikTok, Facebook və əlaqə
  məlumatları dəyişdirilə bilər.
- Xəbərlər və YouTube avtomatik çəkilmir; siyahı əl ilə yenilənir.
  Avtomatik sinxronizasiya üçün gələcəkdə etibarlı backend/API lazımdır.

DİZAYN
------
- Rənglər: orijinal gecə göyü, elektrik mavi, vurğu qırmızısı.
- Tipografiya: web-font varsa Barlow Condensed və Manrope, əks halda
  kompüterin sistem şriftləri.
- CSS faylının sonunda css/pro.css üstünlük təşkil edir. Rəngləri
  css/pro.css içindəki :root dəyişənlərindən dəyişdirin.
- 1080 / 820 / 560 px ekran qırılma nöqtələri.
- Mobil menyu, sayt üzrə axtarış (Ctrl+K), ESC ilə bağlama.

SEO / GOOGLE
------------
- sitemap.xml hazırdır; Google Search Console-a əlavə edin.
- Open Graph şəkli və canonical etiketləri yeni fayllarda qurulub.
- Dinamik parametrlə açılan fərdi futbolçu və matç səhifələrinin
  Google-da müstəqil indekslənməsi üçün gələcəkdə prerender/SSR tövsiyədir.
- Domain və qovluq strukturu dəyişərsə canonical/sitemap URL-lərini dəyişin.

VACİB QEYDLƏR
-------------
- Bu statik saytdır. Canlı hesab, şifrə ilə onlayn idarəetmə paneli,
  avtomatik sosial media API axını və real bildiriş sistemi DEYİL.
- Nəticələr 09.10.2026 tarixli ilkin ZIP-də olduğu kimi saxlanılıb:
  20 tamamlanmış, 4 planlı oyun. Köhnə nəticələr uydurulmayıb.
- Qol müəlliflərinin adları heyət siyahısında fərqli yazılıbsa,
  fərdi profildə qol sayı tam uyğun gəlməyə bilər; data.js-də adları
  vahid formada yazmaq daha doğrudur.
- Videolarda yalnız yoxlanmış oyunlar yerləşdirilib, qalan matçlar
  üçün yalançı videolar yaradılmayıb.
- Instagram/TikTok/YouTube ünvanlarını yayıma çıxmazdan əvvəl bir də
  yoxlayın. Başqa saytların şəkilləri və loqoları kopyalanmayıb.

MƏNBƏLƏR VƏ İDEYA İSTİNADLARI
-----------------------------
Ayrıca ARAŞDIRMA.md faylına baxın. Dizayn originaldır, başqa saytın
kod və görünüşü eynilə köçürülməyib.
