# SSL Arena 3D · SSL Kuboku və Liqa

22 oktyabr 2026.

- Oyunda yalnız SSL Kuboku və Liqa formatları saxlanılıb. Yüngül qrafika, seriya, ayrıca penalti dueli və məşq seçimləri çıxarılıb.
- Liqa: 8 cari klub, 7 tur, 28 unikal qarşılaşma; qələbə 3, heç-heçə 1 xal. Cədvəl və tamamlanmış turlardan davametmə cihazda saxlanır.
- Tam 3D stadion: animasiyalı futbolçu, örtüklü tribunalar, klub bayraqları, real sponsor panelləri, TV və meydan kameraları, giriş və təkrar kameraları.
- Seçimlə açılan stadion səsləri və dəstəklənən telefonlarda titrəyiş. Kompüter, mobil və tam ekran idarəetməsi yenilənib.
- Admin panelin canlı ön baxışı və ümumi canlı redaktoru yeni formatları dəstəkləyir. Real liqa nəticələri, sponsorlar və musiqi qorunur.
- 343 avtomatik test; real WebGL-də 7 turluq liqa, 3 mərhələli kubok, mobil toxunuş, qapıçı, təkrar, davametmə və qorunan admin redaktəsi yoxlanıb.

---

## Əvvəlki buraxılış: Penalti arenası · SSL Kuboku

21 oktyabr 2026.

- Səkkiz cari klubla dörddəbir final, yarımfinal və finaldan ibarət yerli kubok rejimi əlavə edilib. İlk rəqibi oyunçu seçir, sonrakı rəqiblər turnir cədvəlindən gəlir.
- Duel və kubokda rəqib vurarkən qapıçını oyunçu idarə edir. Hər zərbədə bir atılış var; nəticə və təkrar eyni fiziki hərəkətdən hesablanır. Telefon, siçan və klaviatura idarəsi mövcuddur.
- Qurtarış, zərbə dəqiqliyi, kubok mükafatı və cihazda saxlanılan kubok sayı əlavə edilib. Zərbə izi və təkrar görüntüsü yenilənib; reklamlar cari sponsor siyahısından gəlir.
- Admin panelində SSL Kuboku üçün aktivlik və əsas rejim seçimi var; saxlanılmamış dəyişikliklər qorunan ön baxışda görünür.

Yoxlama: 338 avtomatik test, lokal WebGL və toxunma sınaqları, üç mərhələli kubok axını və Worker dry-run. Liqa məlumat bazası və giriş qaydaları bu kod yayımı ilə dəyişdirilmir.

---

# Penalti arenası · klub dueli

21 oktyabr 2026.

- Cari liqanın səkkiz komandasından öz klubunu və fərqli rəqibi seçmək mümkündür. Loqolar, forma rəngləri və stadion tamaşaçıları bu seçimə uyğunlaşır. Son seçim yalnız cihazda saxlanır.
- Penalti dueli, seriya və məşq rejimləri var. Dueldə erkən qalib və bərabərlikdən sonra əlavə zərbələr hesablanır. Rəqibin zərbəsi də eyni fizika ilə oynanır.
- Mövcud sponsorlar stadionun reklam panellərində və aşağıdakı idarə olunan lentdə göstərilir. Hərəkəti dayandırmaq və növbəti sponsora keçmək olar.
- Admin panelində oyun qaydaları, əsas komandalar, reklamlar və saxlanılmamış dəyişikliklərin canlı ön baxışı var. Ümumi canlı redaktor bütün hazırkı azarkeş səhifələrinə bağlıdır.
- Mövsümün zaman tuneli çıxarılıb. Köhnə ünvan Penalti arenasına yönləndirilir.

Liqa nəticələri, komandalar, sponsor siyahısı və digər məzmun bu kod yayımı ilə dəyişdirilmir. Qeydlər mövcud məlumat bazasında saxlanır.

Yayımda həm GitHub Pages, həm də Cloudflare Workers Builds yoxlanmalıdır. GitHub Pages qurmasını yalnız budaq göstəricisinin dəyişməsinə bağlamamaq üçün bu yayım qeydi Contents API ilə ayrıca yenilənir.

Yayım yoxlamaları: 334 avtomatik test, hər iki lokal brauzer sınağı və Worker dry-run uğurludur.

Canlı görünüş düzəlişi: kubok seçiləndə fokus meydançanı daxilən sürüşdürmür. Menyu 320, 390, 768 və 1440 piksel enlərdə tam görünməklə yoxlanıb.
