# SSL Pro 2026 — dizayn araşdırması və qərarlar

## Benchmark saytlar

1. **Premier League** — https://www.premierleague.com/en
   Güclü ilk ekran, oyuna və xəbərə bir toxunuşla keçid, statistik liderlər,
   media, klublar və futbolçular üçün aydın informasiya arxitekturası.
   **SSL tətbiqi:** son nəticələr lentı, liderlər, xəbər kartları, futbolçu kataloqu.

2. **UEFA** — https://www.uefa.com/
   Matç və yarışma mərkəzləri, komanda/oyun informasiyası, video ilə
   statistikanın birlikdə göstərilməsi.
   **SSL tətbiqi:** ayrıca `matc.html?id=...` səhifəsi, kartlar, qollar, MVP və uyğun video.

3. **Bundesliga** — https://www.bundesliga.com/en/bundesliga/
   Komandalar, əsas oyunçular, matç günü məlumatı və statistik sıralama.
   **SSL tətbiqi:** komanda kartları, turnir cədvəli və fərdi profil şəbəkəsi.

4. **Azərbaycan PFL** — https://pfl.az/ və https://liqa2.pfl.az/
   Təqvim, klublar, turnir cədvəli, bombardirlər və multimedia bölmələri.
   **SSL tətbiqi:** Azərbaycan dilində tanış naviqasiya, qrup üzrə statistika.

5. **Azərbaycan Minifutbol Federasiyası** — https://minifootball.az/
   Xəbərlər və milli minifutbolun video icmalları.
   **SSL tətbiqi:** mini futbol mərkəzli media və xəbər bölməsi.

## Sumqayıt Super Liqa üçün istifadə olunan açıq materiallar

- TVN.az, III turun nəticələri (20.09.2026):
  https://tvn.az/idman/sumqay%C4%B1t-superliqas%C4%B1nda-iii-turun-n%C9%99tic%C9%99l%C9%99ri-a%C3%A7%C4%B1qlan%C4%B1b/
- Liqa barədə TVN.az xəbər arxivi:
  https://tvn.az/tag/sumqay%C4%B1t-super-liqas%C4%B1/
- YouTube liqa kanalı: https://www.youtube.com/@sumgayitsuperleague
- Instagram: https://www.instagram.com/sumqayitsuperliqa/

## Kreativ istiqamət

- **Məqsəd:** sadə turnir cədvəli saytı deyil, rəqəmsal futbol klub/liqası brendi.
- **İdentika:** sahibinin ZIP paketində olan ağ SSL emblemi, navy/mavi/qırmızı rəng ailəsi.
- **Tipoqrafiya:** idman estetikası üçün iri, yığcam başlıqlar; statistika üçün oxunaqlı şrift.
- **Məzmun prioriteti:** matç -> nəticə -> komanda -> futbolçu -> video -> xəbər.
- **Orijinallıq:** başqa saytdan dizayn, şəkil, loqo və kod kopyalanmayıb.
- **Məlumat dəqiqliyi:** əsas hesab və statistikalar istifadəçinin `js/data.js` faylından gəlir.

## Gələcək yol xəritəsi (bu ZIP-də hələ yoxdur)

1. Təhlükəsiz server backend və şifrəli CMS; nəticələrin birbaşa idarəsi.
2. Xüsusi media yükləmə sistemi; oyun və futbolçu fotoları (rəsmi icazə ilə).
3. Admin tərəfindən real vaxt statusları və canlı oyun hadisələri.
4. Tam SEO üçün statik prerender / fərdi URL-lər və sosial kartlar.
5. Futbolçu profilində vahid ID və statistik adların normallaşdırılması.
