# Backend uchun eslatmalar

**Qaysi repo va branch tekshiriladi.** Railway'ga joylangan backend —
`nurulloh-coder-dev/learning-center`, branch **`main`** (backend jamoasi
2026-08-21 da tasdiqladi). `main` o'ziga `N` ni merge qilib olgan va undan
12 commit oldinda, ya'ni **haqiqat manbai `main`**, `N` emas.

Eski `goodman113/learning_center` ga qaralmaydi. Quyidagi eslatmalar
`nurulloh-coder-dev/learning-center@main` (`e02c464`, 2026-08-21) bo'yicha.

## Tuzatilganlar ✅

Birinchi ro'yxatdagi narsalar bajarilgani kodda tekshirildi:

| Nima | Holati |
| --- | --- |
| Kalitlar `application.yaml` dan env'ga chiqarildi | ✅ `${DB-URL}`, `${AWS-ACCESS-KEY}`, `${JWT-*-SECRET-KEY}` |
| `/api/v1/user/**` whitelist'dan olib tashlandi | ✅ |
| Token muddati soniyaga keltirildi | ✅ `900` va `604800` |
| Parol o'zgartirishdagi teskari shart | ✅ `!equals(...)` |
| `GroupNameProjection` ga `dayType` | ✅ frontendda filtr o'zi ishlab ketadi |
| Cookie `SameSite=Lax` | ✅ |

**`nurulloh-coder-dev/learning-center@N` da qo'shimcha tuzalganlar
(2026-08-19, `a8a67ca`):**

| Nima | Holati | Frontendga ta'siri |
| --- | --- | --- |
| `BranchDto.organization` izohdan chiqarildi | ✅ | super-adminda filial qaysi tashkilotniki ekani ko'rsatilishi mumkin |
| `OrganizationService.delete` haqiqiy `softDelete` qiladi | ✅ | tashkilotni o'chirish tugmasi qo'yilishi mumkin |
| `GET /attendance/group/{groupId}` qo'shildi | ⚠️ o'chirildi | pastga qarang |
| `Lead` API to'liq (`/api/v1/leads`) | ✅ | Leads bo'limi endi yozilishi mumkin |

> **Eslatma:** kalitlar env'ga chiqarilgani — ularni almashtirish o'rnini
> bosmaydi. Eski AWS va JWT kalitlari git tarixida qolgan va ochiq repoda
> turibdi. Ular hali almashtirilmagan bo'lsa, almashtiring.

> **2026-08-28:** `GET /attendance/group/{groupId}` backenddan o'chirilgan
> (404 qaytaradi) — o'qituvchi paneli va davomat ekrani shu sabab ishlamay
> qolgan edi. O'rniga `GET /attendance/monthly/{groupId}?previousMonths=`
> (javob: `[{ id, lessonTitle, date, attendanceStudentMap }]`, xarita
> kaliti — `studentId`) va o'quvchilar uchun `GET /student/{groupId}/students`
> ishlatiladi — frontend shularga o'tkazildi.

> **2026-09-01:** `attendanceStudentMap` javobi o'zgardi — endi qiymat
> `AttendanceStatus` emas, `{ status, reason }` obyekti (6-band pastda —
> ✅ deb belgilandi). `AttendanceStudentDto`/`AttendanceStudentCreateDto`
> ga `reason` qo'shilgani ham tasdiqlandi. Frontend yangi shaklga
> o'tkazildi (`StatusReasonDto`, `src/shared/types/index.ts`).
>
> Shu bilan birga davomatni tuzatish uchun `PUT /attendance/{id}` ham
> ishlatilmoqda — tana: `{ attendanceStudents: [{ studentId, status,
> reason }] }`, `{id}` — `MonthlyAttendanceDto.id` (yozuv id si, dars id
> emas). Backend BUTUN ro'yxatni almashtiradi, shuning uchun frontend
> har safar guruhdagi HAMMA o'quvchini yuboradi. Bu endpoint hali
> `backend-api-request.md` da so'ralmagan edi — agar aynan shu imzo bilan
> ishlamasa, aytilsin.
>
> **2026-09-01:** `Branch` entity'sida `chargeForMonth` endi YO'Q — u
> `Level`ga ko'chdi, `BranchDto`/`BranchUpdatePayload` bu maydonni umuman
> qaytarmaydi (ilgari maydon turardi-yu, doim `null` kelardi). Frontend
> `chargeForMonth`ni `BranchDto`/`BranchUpdatePayload`dan hamda Sozlamalar
> (`CentreForm`) va super-admin (`BranchFormModal`,
> `SuperAdminDashboardPage`) ekranlaridan olib tashladi. `Level`dagi oylik
> to'lov hali frontendda ko'rsatilmaydi — kerak bo'lsa alohida vazifa.

> **2026-09-05:** `Level`dagi oylik to'lov ulandi. `GET /group-level`
> maydonni endi qaytaradi, lekin **bosh harf bilan** — `MonthlyFee`, DTO'dagi
> qolgan barcha maydonlar (`lessonCount`, `orderNumber`, `durationInMonths`)
> kabi kichik harfda emas. Backend jamoasi buni tan oldi, tuzatiladi.
> Tuzalguncha frontend ikkalasini ham qabul qiladi
> (`GroupLevelDto.monthlyFee ?? GroupLevelDto.MonthlyFee`,
> `src/shared/types/index.ts`) — tuzatilgach `MonthlyFee` olib tashlanadi.
>
> Shu bilan birga `PUT /group-level/{id}` qo'shildi — tanasi
> `{ lessonCount, durationInMonths, monthlyFee }`, **`name` yo'q** (nomni
> tahrirlab bo'lmaydi, faqat yaratishda beriladi). Eski `PUT /group-level`
> (butun jadval tanasi `{ levels: [{ id, orderNumber }] }`) o'zgarishsiz
> qoldi — u faqat tartibni yangilaydi, frontendda `reorderGroupLevels` deb
> nomlandi (`updateGroupLevel` bilan adashtirilmasin uchun).
>
> Yana: `GroupDto.level` endi `GroupLevel` enum satri emas, to'liq
> `GroupLevelDto` obyekti (`{ id, name, lessonCount, orderNumber,
> durationInMonths, monthlyFee }`). O'quvchi va o'qituvchi panelidagi
> darajani ko'rsatuvchi ikki joy (`GroupCard`, `LessonStrip`)
> `group.level?.name` ga o'tkazildi.

---

## Qolgan va yangi topilganlar

### 0. 🔴 `POST /user/{id}/password-regenerate` va `PUT /user/{id}` (2026-10-28)

- Javobdagi `temporaryPassword` — `user.getPassword()`, ya'ni **hash**. Ochiq
  parol qaytarilmasa, tugma bosilgach odam akkauntidan butunlay qulflanadi.
  Shu tuzatilmaguncha frontenddagi "Parolni yangilash" tugmasi ishlatilmasin.
- Tashkilot va ruxsat tekshiruvi yo'q (`validateIdAndGet` butun bazadan
  qidiradi): istalgan administrator boshqa tashkilot odamining yoki super
  adminning parolini almashtira oladi.
- `PUT /user/{id}` — `validateIfCurrentUser`: faqat o'zini tahrirlaydi,
  super admin administratorni tahrirlasa 403.

### 1. 🔴 Hech qayerda `@PreAuthorize` yo'q — endi eng katta teshik

Butun `src/main/java` da `@PreAuthorize` **0 ta**. `@EnableMethodSecurity`
yoqilgan, lekin unga hech narsa berilmagan.

`/api/v1/user/**` whitelist'dan chiqqani yaxshi, lekin endi qoida shunday:
**kirgan istalgan odam — hamma narsani qila oladi.** Ya'ni o'quvchi rolidagi
foydalanuvchi ham:

- `DELETE /api/v1/user/{id}` — istalgan foydalanuvchini o'chira oladi
- `POST /api/v1/teacher` — o'ziga o'qituvchi yarata oladi
- `GET /api/v1/student` — barcha o'quvchilar ro'yxatini, telefonlari bilan
- `DELETE /api/v1/group/{id}` — guruhni o'chira oladi

Token olish oson: bitta o'quvchi hisobi yetarli.

**Tuzatish** — kamida admin amallariga:

```java
@PreAuthorize("hasRole('ADMINISTRATOR')")
@DeleteMapping("/{id}")
public ResponseEntity<Void> delete(@PathVariable String id) { … }
```

Rollar `Role` enum'ida bor. `hasRole('X')` Spring'da `ROLE_X` authority'sini
kutadi — `CustomUserDetails` da authority qanday yasalayotganini tekshiring,
mos kelmasa `hasAuthority('ADMINISTRATOR')` ishlating.

Minimal qamrov: `POST`, `PUT`, `DELETE` — administratorga; `GET` ro'yxatlar —
xodimlarga; o'quvchi faqat o'zinikini.

> **2026-09-01:** Backend jamoasi tasdiqladi — kamida `LeadController`da
> `@PreAuthorize` paydo bo'ldi (`hasRole('SUPER_ADMIN') or (hasRole('ADMINISTRATOR')
> and hasAuthority('LEAD_MANAGEMENT'))` shaklida) va JWT'ga `permissions`
> claim'i qo'shildi (`["LEAD_MANAGEMENT","TEACHER_MANAGEMENT",
> "STUDENT_MANAGEMENT","INVOICE_MANAGEMENT"]`). Frontend mos keldi —
> `src/shared/types/index.ts` (`AdminPermission`), `src/app/providers/useAuth.ts`
> (`useHasPermission`), `src/app/routes/RequirePermission.tsx` va admin
> panelidagi tab/tugmalar shu asosda yashirinadi. **Diqqat:** boshqa
> controller'larning holati bu yerda TEKSHIRILMAGAN — yuqoridagi jadval
> ularga hali ham tegishli bo'lishi mumkin.

### 2. 🟠 `/swagger**` naqshi Spring Boot 4 da ishlamaydi

```java
"/swagger**"
```

Spring Boot 4 (Spring Security 7) `requestMatchers(String…)` uchun
**PathPattern** ishlatadi, eski `AntPathMatcher` ni emas. PathPattern'da
`**` **butun segment** bo'lishi va oxirida turishi kerak.

Ya'ni `/swagger**` bitta segmentli yo'llarga tegishli bo'ladi (`/swagger-ui.html`
kabi), lekin `/swagger-ui/index.html` — ikki segment — **mos kelmaydi** va
401 qaytadi. Swagger UI ochilmay qoladi.

Naqsh umuman parse bo'lmasligi ham mumkin (o'shanda ilova ishga tushmaydi) —
buni deploy'dan oldin lokal ishga tushirib tekshiring.

**Xavfsiz shakl** — aniq yo'llarni sanang:

```java
private final String[] WHITE_LIST = {
        "/api/v1/auth/**",
        "/v3/api-docs/**",
        "/swagger-ui/**",
        "/swagger-ui.html"
};
```

### 3. 🟠 Proyeksiyadagi SpEL jadvali yo'q guruhda yiqiladi

```java
@Value("#{target.timeTable.dayType}")
DayType getDayType();
```

Guruhda `timeTable` `null` bo'lsa (masalan yangi yaratilgan, jadval hali
biriktirilmagan guruh), SpEL `NullPointerException` beradi va **butun
`GET /group/groups` 500 qaytaradi** — bitta guruh sabab o'qituvchining
hamma guruhlari ko'rinmay qoladi.

**Tuzatish** — xavfsiz navigatsiya operatori:

```java
@Value("#{target.timeTable?.dayType}")
DayType getDayType();
```

Frontend `dayType` ni optional deb biladi, `null` kelsa o'sha guruh
toq/juft filtriga tushmaydi — xato bermaydi.

### 4. 🔴 `frontUrl` qattiq yozilgani PRODUCTIONDA LOGINNI BLOKLAYAPTI

```yaml
spring:
  application:
    frontUrl: http://localhost:5173
```

Bu qiymat CORS'da `allowedOrigins` bo'lib ishlatiladi. Productionda
`localhost` qolsa, proxy'siz ishlatilgan har qanday holatda CORS bloklaydi.

```yaml
frontUrl: ${FRONT_URL:http://localhost:5173}
```

**2026-08-19 holati: kirish sahifasida `Request failed (403)` shundan.**

`SecurityConfig` da:

```java
config.setAllowedOrigins(List.of(frontUrl));   // frontUrl = http://localhost:5173
```

Brauzer **POST** so'rovida `Origin` sarlavhasini **same-origin bo'lganda ham**
yuboradi (GET da yubormaydi). Ya'ni frontend o'z domenidan `/api/v1/auth/login`
ga POST qilganda, Caddy uni backendga `Origin: https://robust-forgiveness-…`
bilan uzatadi. Spring'ning CORS filtri ro'yxatda faqat `http://localhost:5173`
ni ko'radi va so'rovni **403, bo'sh tana** bilan rad etadi — controller'gacha
yetib ham bormaydi.

Shuning uchun: GET'lar o'tadi, faqat POST yiqiladi va xabar bo'sh bo'ladi.

#### Nega "biz tuzatdik" deyilyapti, lekin baribir ishlamayapti

`nurulloh-coder-dev/learning-center@N` dagi `application.yaml` da
`frontUrl: ${FRONT_URL}` **bor** — lekin u faylning **izohga olingan**
qismida (1–46-qatorlar hammasi `#` bilan boshlanadi). Spring izohni o'qimaydi.

Faylning **haqiqiy** qismi 47-qatordan boshlanadi va 50-qatorda:

```yaml
spring:
  application:
    name: CRM
    frontUrl: http://localhost:5173   # ← ishlaydigan qiymat shu
  profiles:
    default: prod
```

`application-prod.yaml` esa `frontUrl` ni umuman qayta belgilamaydi
(unda faqat datasource, aws, jwt va `server.port` bor). Ya'ni `prod`
profilida ham asosiy fayldagi `localhost:5173` kuchda qoladi.

**Tuzatish — ikkita qadam:**

1. `application.yaml`, **47-qatordan keyingi** (izohga olinmagan) blokda:
   ```yaml
   frontUrl: ${FRONT_URL:http://localhost:5173}
   ```
   — yoki `application-prod.yaml` ga qo'shish:
   ```yaml
   spring:
     application:
       frontUrl: ${FRONT_URL}
   ```
2. Railway → backend xizmati → Variables:
   ```
   FRONT_URL = https://robust-forgiveness-production-c350.up.railway.app
   ```

Env o'zgaruvchisining o'zi yetmaydi — hozir yaml'da qiymat qattiq yozilgan,
ya'ni `FRONT_URL` o'qilmaydi. Izohga olingan blokni tuzatish ham yetmaydi —
u baribir o'qilmaydi.

**Tekshirish:** deploydan keyin

```bash
curl -i -X POST https://<backend>/api/v1/auth/login \
  -H 'Content-Type: application/json' \
  -H 'Origin: https://robust-forgiveness-production-c350.up.railway.app' \
  -d '{"phone":"+998000000000","password":"x"}'
```

403 va bo'sh tana o'rniga 400/401 va JSON kelsa — CORS tuzalgan.

(Frontend `/api` ni o'zi uzatgani uchun CORS mantiqan kerak emas, lekin
filtr baribir `Origin` ni tekshiradi — shuning uchun to'g'ri qiymat shart.)

### 5. 🟠 `/student/phone` ham himoyalanishi kerak

`GET /student/phone?phone=…` istalgan raqam bo'yicha o'quvchi kartasini
qaytaradi va backendda tekshiruv yo'q.

**2026-09-07:** frontend endi undan FOYDALANMAYDI — o'quvchi paneli
`/student/me` ga o'tdi. Ya'ni bu endi bizni to'smaydi, lekin endpoint
ochiqligicha qolyapti va tuzatilishi kerak.

1-banddagi `@PreAuthorize` ishi qilinganda shu endpoint "o'zi yoki xodim"
qoidasiga bo'ysunsin.

### 6. ✅ Davomat izohi — `AttendanceStudentCreateDto` ga `reason` qo'shildi

**2026-09-01: bajarildi.** `AttendanceStudentCreateDto` va
`AttendanceStudentDto` ga `reason` maydoni qo'shilgan, `attendanceStudentMap`
ham endi `{ status, reason }` obyekti qaytaradi. Frontend `reason`ni yig'ib
yuborishga o'tkazildi (`AttendanceCell` → `useAttendanceDraft.toPayload` →
`POST /attendance` / `PUT /attendance/{id}`), "izoh serverda saqlanmaydi"
ogohlantirishi olib tashlandi.

Yana: `LATE` statusi interfeysdan olib tashlangan (amalda ishlatilmagan).
Enum'da qolaversin — eski yozuvlarda uchraydi va ular ko'rsatilishi kerak.

### 7. 🟠 `EnrollmentDto` da `id` yo'q

Guruhga o'quvchi qo'shish `POST /enrollments` orqali ulandi va ishlaydi.

Lekin **guruhdan chiqarish qilinmadi**: `DELETE /enrollments/{id}` enrollment
id sini talab qiladi, `EnrollmentDto{studentId, groupId, reason}` esa uni
qaytarmaydi. Frontend id ni bilmaydi.

```java
public record EnrollmentDto(String id, String studentId, String groupId, String reason) {}
```

Ism ham qo'shilsa yaxshi bo'lardi (`studentFullName`) — hozir ro'yxatni
ko'rsatish uchun o'quvchilar ro'yxati bilan solishtirishga to'g'ri keladi.

### 8. 🔴 `LessonDto` dars haqidagi asosiy ma'lumotni qaytarmaydi

Admin panelida "Darslar" tabi ulandi (`POST /lesson`, `PUT /lesson/{id}`,
ro'yxat va o'chirish). Ulash paytida uchta muammo chiqdi — uchalasi ham
`LessonMapper` da.

```java
@Mapper(componentModel = "spring", uses = {TeacherMapper.class, GroupMapper.class})
public interface LessonMapper {
    @Mapping(source = "createdAt", target = "lessonDate")
    LessonDto toDto(Lesson lesson);
}
```

`Lesson` entity'sida `lessonName` va `isCompleted` bor, `LessonDto` da esa
`lessonNumber` va `isComplete`. Nomlar mos kelmagani uchun MapStruct ularni
**umuman to'ldirmaydi** (`unmappedTargetPolicy` sukut bo'yicha WARN, ya'ni
kompilyatsiya o'tadi, maydon esa `null` qoladi):

| Maydon | Hozir | Natija |
| --- | --- | --- |
| `lessonNumber` | manba yo'q | doim `null` |
| `isComplete` | entity'da `isCompleted` | doim `null` |
| dars nomi | `lessonName` DTO'da umuman yo'q | foydalanuvchi kiritgan nom qaytmaydi |

Ya'ni `POST /lesson` ga yuborilgan `lessonName` saqlanadi, lekin uni
qaytarib o'qib bo'lmaydi — admin jadvalida va tahrirlash formasida ustun
bo'sh turadi.

**So'rov:**

```java
public record LessonDto(String id, String lessonName, LocalDateTime lessonDate,
                        Boolean isComplete, GroupDto group, TeacherDto teacherDto) {}
```

```java
@Mapping(source = "createdAt", target = "lessonDate")
@Mapping(source = "isCompleted", target = "isComplete")
LessonDto toDto(Lesson lesson);
```

Nom `lessonNumber` bo'lib qolsa ham mayli, muhimi — ichida qiymat bo'lsin;
frontend maydon nomini bir qatorda moslashtiradi. Faqat ayting, chunki
o'qituvchi panelida matn hozir "{{number}}-dars" ko'rinishida — nom kelsa
uni oddiy sarlavhaga almashtiramiz.

Yana: `@Mapper` ga `unmappedTargetPolicy = ReportingPolicy.ERROR` qo'ysangiz,
bunday xatolar kompilyatsiyada tutiladi.

### 9. 🟠 Darsni administrator yaratsa, o'qituvchisiz qoladi

```java
teacherRepository.findTeacherByUser_Id(userService.getCurrentUser().getId())
```

`LessonService.toEntity` o'qituvchini **kirgan foydalanuvchidan** oladi.
Administrator dars yaratsa, uning `Teacher` yozuvi yo'q — `findTeacherByUser_Id`
`null` qaytaradi va dars o'qituvchisiz saqlanadi (`teacher` ustuni
`optional = true`, shuning uchun xato ham bermaydi).

Admin panelida dars yaratish endi bor, ya'ni bu holat amalda uchraydi.
Yechim ikkitadan biri:

- `LessonCreateDto` ga ixtiyoriy `teacherId` qo'shish va berilgan bo'lsa
  o'shani ishlatish (guruhning o'qituvchisi sukut bo'yicha), yoki
- o'qituvchini guruhdan olish: `group.getTeacher()`.

Ikkinchisi soddaroq va deyarli har doim to'g'ri.

### 10. ✅ `Branch` API — qilingan

`BranchController` va to'ldirilgan `BranchDto` paydo bo'lgach super-admin
paneli yozildi (`/super-admin`). `N` branchda `BranchDto.organization` ham
izohdan chiqarilgan, ya'ni filial qaysi tashkilotniki ekani ko'rsatilishi
mumkin — frontendda ustun qo'shish qoldi.

### 11. 🔴 `InvoiceMapper` da ism va rasm manzili almashib ketgan

`InvoiceMapper.toDtoFromProjection` — `GET /invoice` ro'yxati **aynan shu
yo'ldan** o'tadi (`InvoiceService:36` va `:70`):

```java
new UserDto(
        projection.getStudentUserId(),
        projection.getStudentFullName(),    // ← 2-o'rin: UserDto da bu `imageUrl`
        projection.getStudentImageUrl(),    // ← 3-o'rin: UserDto da bu `fullName`
        projection.getStudentPhone(),
        …
```

`UserDto` esa shunday e'lon qilingan:

```java
public record UserDto(String id, String imageUrl, String fullName,
                      String phone, LocalDate birthDate, Role role) {}
```

Ya'ni to'lovlar ro'yxatida **har bir o'quvchining ismi `imageUrl` maydoniga,
rasm manzili esa `fullName` ga** tushadi. Ikkalasi ham `String` bo'lgani
uchun kompilyator hech narsa demaydi — xato faqat ekranda ko'rinadi.

`GET /invoice/{id}` (bitta yozuv) `toDto` dan o'tadi va u to'g'ri, shuning
uchun ro'yxat bilan kartochka bir-biriga zid ko'rinadi.

**Tuzatish:** ikki qatorni almashtiring. Kelajakda bunday xato bo'lmasligi
uchun `new UserDto(...)` ni nomlangan qurilishga o'tkazing yoki
`UserDto` yasashni bitta yordamchi metodga chiqaring.

`TeacherDto` uchun ham shu proyeksiyada `getTeacherFullName` /
`getTeacherImageUrl` bor — o'sha joyni ham tekshiring.

### 12. 🟠 `LeadUpdateDto` maydonlari `LeadDto` bilan mos emas

`GET /leads` (va boshqa o'qish yo'llari) `LeadDto{id, fullName, phone, callAt,
status, source, preferredCourse, createdAt, updatedAt}` qaytaradi, lekin
`PUT /leads/{id}` kutayotgan `LeadUpdateDto` boshqacha:

- ism maydoni `fullName` emas, `name`;
- `preferredCourse` boshqa turda (aniq qaysi — ma'lum emas, `String` deb
  taxmin qilingan).

Ikkalasi bir xil "lid" tushunchasini tasvirlaydigan bo'lsa, maydon
nomlari ham mos kelishi kerak — aks holda frontendda ikkita alohida
xarita saqlashga to'g'ri keladi va birortasi yangilansa ikkinchisi
unutiladi.

Shu sabab **tahrirlash (edit) funksiyasi hozircha ulanmagan**: faqat
ro'yxat, yaratish, o'chirish va holat o'zgartirish (`PATCH .../status`)
ishlaydi. Aniqlik kirgach `NewLeadModal` yonida `EditLeadModal` qo'shiladi
(`src/features/leads/`).

**So'rov:** `docs/backend-api-request.md`.

### 13. 🟡 `ddl-auto: update`

Hozircha ishlaydi, lekin productionda xavfli: ustun o'chirilsa yoki tipi
o'zgarsa Hibernate jimgina noto'g'ri ish qilishi mumkin. Jonli ma'lumot
paydo bo'lgach Flyway yoki Liquibase'ga o'ting, `ddl-auto: validate` bilan.

### 13. 🔴 `messages*.properties` yo'q — xato matnlari kalit bo'lib chiqadi

Login noto'g'ri bo'lganda javob:

```json
{"message": "MessageKey not found: illegal.phone.number.or.password"}
```

`src/main/resources` da birorta `messages.properties` /
`messages_uz.properties` / `messages_ru.properties` fayli yo'q, shuning uchun
`MessageSource` hech qaysi kalitni topolmaydi. Frontend serverdan kelgan
matnni **tarjima qilmaydi va o'zgartirmaydi** (bu ataylab: server xatosi
qanday kelsa shunday ko'rsatiladi), ya'ni foydalanuvchi shu texnik satrni
ko'radi.

Kerak: `messages_uz.properties`, `messages_ru.properties`,
`messages_en.properties` (`Accept-Language` frontenddan `uz`/`ru`/`en` bo'lib
keladi) va ularda ishlatilayotgan hamma kalit.

### 14. 🟠 `InvoiceDto` da `type` yo'q, lekin `Invoice` da bor

`Invoice` entity'sida `InvoiceType type` bor (`PAID`, `RETURNED`) va
`InvoiceMapper` qaytarimda uni `RETURNED` qilib belgilaydi. Ammo:

```java
public record InvoiceDto(
        String id, String invoiceNumber, StudentDto student,
        BigDecimal amount, LocalDateTime issuedAt, InvoiceStatus status
) {}
```

`type` DTO'da yo'q — ya'ni to'lov va qaytarim yozuvlari ro'yxatda bir xil
ko'rinadi, faqat summasi bilan farq qiladi. Frontendda "Turi" ustuni bor,
lekin u doim bo'sh (`—`) chiqadi.

Kerak: `InvoiceDto` ga `InvoiceType type` qo'shilsin.

### 15. 🔴 To'rtta `/count` endpoint'i ham admin paneliga yaramaydi

Admin panelining tepasidagi to'rtta KPI kartasi (o'quvchilar, o'qituvchilar,
guruhlar, darslar soni) hammasi `—` ko'rsatadi. Sabab — to'rttala
endpoint ham frontend bera olmaydigan majburiy parametr talab qiladi:

| Endpoint | Talab qiladi | Muammo |
| --- | --- | --- |
| `GET /student/count` | `groupId` | Kartaga **markazdagi jami** o'quvchi kerak, guruhdagi emas |
| `GET /lesson/count` | `groupId` | Xuddi shunday |
| `GET /group/count` | `organizationId` | Tokendan olinishi kerak, mijozdan emas |
| `GET /teacher/count` | `organizationId` | Xuddi shunday |

Ya'ni hozir markaz bo'yicha umumiy sonni **hech qanday yo'l bilan** olib
bo'lmaydi.

Kerak: to'rttasi ham parametrsiz ishlasin va tashkilotni tokendan olsin
(`userValidator.authenticateAndGetOrganizationId()`). Guruh bo'yicha son
kerak bo'lsa — `groupId` **ixtiyoriy** parametr bo'lsin
(`@RequestParam(required = false)`), majburiy emas.

Frontend `GET /<endpoint>/count` ni parametrsiz chaqiradi va javobning
ikkala shaklini ham (`5` va `{"count": 5}`) tushunadi
(`src/features/admin/api/adminApi.ts:24`).

### 16. 🔴 `branch.organization_id` bo'sh — guruhlar ro'yxati shundan bo'sh chiqadi

`GroupRepository.getAllByFilter` shunday filtrlaydi:

```sql
JOIN g.branch b
WHERE b.organizationId = :organizationId
```

`Branch` da alohida `organization` bog'lanishi **yo'q** — uning tashkilotga
yagona aloqasi `BaseEntity.organizationId`. U esa faqat `@PrePersist` da
to'ladi, ya'ni **yangi qo'shilgan qatorlarda**. Bu o'zgarishdan oldin
yaratilgan filiallarning `organization_id` ustuni `NULL` bo'lib qolgan.

`NULL = 'biror-id'` hech qachon rost bo'lmaydi → ro'yxat bo'sh.

Darslar ishlayotgani shuni tasdiqlaydi: `GET /lesson` tashkilot bo'yicha
filtrlamaydi, shuning uchun ma'lumot ko'rinadi.

**Tuzatish — eski qatorlarni to'ldirish:**

```sql
SELECT id, name FROM organizations;
UPDATE branch SET organization_id = '<org-id>' WHERE organization_id IS NULL;
```

Xuddi shu muammo `BaseEntity` dan meros olgan **hamma** jadvalda bor:
`groups`, `students`, `teachers`, `lessons`, `invoice`. Tashkilot bo'yicha
filtr qo'shilgan har bir joyda eski ma'lumot ko'rinmay qoladi.

**Diqqat — ilova orqali tuzatib bo'lmaydi:**

```java
@Column(name = "organization_id", updatable = false)
```

`updatable = false` tufayli Hibernate mavjud qatorga bu ustunni **yozmaydi**.
Ya'ni to'ldirish faqat SQL bilan bo'ladi, yoki avval shu bayroq olib
tashlanishi kerak.

### 17. 🟡 `GroupStatus` da `ENDED` → `COMPLETED` (frontend moslashtirildi)

Backend enum'i `STARTING, ONGOING, COMPLETED` bo'ldi. Frontendda `ENDED`
turgandi — `src/shared/types/index.ts` va uch tildagi `status.*` kalitlari
yangilandi. Bu bandda backenddan hech narsa talab qilinmaydi, faqat yozib
qo'yildi: enum qiymati o'zgarsa frontend filtri jim yiqiladi (400), shuning
uchun bunday o'zgarishlarni oldindan ayting.

### 18. 🟡 Autentifikatsiyadan o'tmagan so'rovga 401 emas, 403 qaytadi

`SecurityConfig` da `authenticationEntryPoint` berilmagan:

```java
http.authorizeHttpRequests(auth -> auth
        .requestMatchers(WHITE_LIST).permitAll()
        .anyRequest().authenticated());
```

`httpBasic()`, `formLogin()` va `exceptionHandling(...)` ning hech biri yo'q,
shuning uchun Spring Security `Http403ForbiddenEntryPoint` ni ishlatadi —
ya'ni **token yo'q/eskirgan** holat ham **403** bo'lib qaytadi.

Natijada mijoz "token eskirgan" (yangilash kerak) va "bu rolga ruxsat yo'q"
(yangilash foydasiz) holatlarini ajrata olmaydi. Frontend hozir ikkalasini
ham bir xil ko'radi va ikkalasida ham tokenni yangilashga uradi.

Kerak:

```java
http.exceptionHandling(e -> e.authenticationEntryPoint(
        (req, res, ex) -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED)));
```

Bu bizni bloklamaydi — frontend ikkalasini ham ushlaydi — lekin to'g'risi shu.

---

## Railway env o'zgaruvchilari

`application.yaml` dagi nomlar defis bilan (`${DB-URL}`). Spring defisni
pastki chiziqqa aylantirib qidiradi, shuning uchun Railway'da **pastki
chiziq bilan** yozing:

```
DB_URL                  = jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}
DB_USERNAME             = ${{Postgres.PGUSER}}
DB_PASSWORD             = ${{Postgres.PGPASSWORD}}
AWS_ACCESS_KEY          = <yangi kalit>
AWS_SECRET_KEY          = <yangi kalit>
JWT_ACCESS_SECRET_KEY   = <yangi secret>
JWT_REFRESH_SECRET_KEY  = <yangi secret>
FRONT_URL               = https://<frontend-domeni>
SERVER_ADDRESS          = ::
JAVA_TOOL_OPTIONS       = -XX:MaxRAMPercentage=75
```

Railway'ning tayyor `DATABASE_URL` i `postgresql://…` ko'rinishida —
Spring `jdbc:postgresql://…` kutadi, shuning uchun yuqoridagidek qo'lda
yig'iladi.

`SERVER_ADDRESS=::` **shart**: Railway ichki tarmog'i IPv6, Spring esa
sukut bo'yicha faqat IPv4 tinglaydi va frontend proxysi unga yeta olmaydi.

Backendga **ochiq domen bermang** — frontend `/api` ni ichki tarmoq orqali
uzatadi (frontend repo'sidagi `Caddyfile`). Shunda refresh cookie same-site
bo'lib qoladi va CORS umuman kerak bo'lmaydi.

---

## Kelajakda kerak bo'ladigan endpoint'lar

Kerakli API'lar to'liq imzolari bilan alohida faylga chiqarildi:
[`backend-api-request.md`](backend-api-request.md). Shu fayl "nima
yozamiz?" degan savolga javob beradi — bu yerdagi ro'yxat esa mavjud
kodadagi xatolar haqida.

---

## Frontend moslashtirilgan DTO'lar

Bu shakllar `src/shared/types/index.ts` ga ko'chirilgan. O'zgartirsangiz
ayting — kompilyator qaysi ekranga tegishini o'zi ko'rsatadi.

`UserDto.imageUrl` · `TimeTableDto.dayType` (ODD/EVEN) ·
`LessonDto.lessonNumber` (String) ·
`GroupDto.level` (endi `GroupLevelDto` obyekti, enum satr emas) ·
`GroupDto.currentMonth/lessonsCount` ·
`GroupLevelDto.monthlyFee` (backend `MonthlyFee` deb bosh harf bilan
qaytaradi — tuzatilguncha ikkalasi ham qabul qilinadi) ·
`GroupNameProjection` (id, name, dayType) · `AttendanceCreateDto{lessonId, students}` ·
`StatusReasonDto{status, reason}` (`MonthlyAttendanceDto.attendanceStudentMap` qiymati) ·
`AttendanceStudentDto.reason`

---

## 2026-09-09: to'lov modeli almashtirildi — topilgan muammolar

Backend `main` da hisob + tranzaksiya modeli ishga tushdi. Front unga
o'tkazildi, lekin uchta narsa mijoz tomondan ishlamaydi:

### 1. ✅ `POST /invoice` — tuzatildi

**2026-09-09:** `InvoiceCreateDto` endi `String enrollmentId` oladi.
Bundan tashqari `POST /invoice/{groupId}` qo'shildi — guruhga shu oy
uchun hisob yaratadi, front unga ulandi.

### 2. 🟠 Tranzaksiya summasining ISHORASI mijozga qolgan

`TransactionService.create` → `setNewBalance(amount, studentId)`, so'rov esa
`balance = balance + :amount`. Backend turga qaramaydi: `PAID` bo'ladimi,
`RETURNED` bo'ladimi — qanday summa kelsa shundoq qo'shadi.

`@DecimalMin("0.0")` olib tashlangani uchun endi manfiy son yuborsa
bo'ladi va front `RETURNED` da aynan shunday qilyapti (`transactionApi.ts`).
Backendning o'zi ham ichkarida shunday qiladi — `createGroupInvoice` da
`monthlyFee.negate()`.

Ishlaydi, lekin mo'rt: boshqa mijoz (mobil ilova, Swagger orqali qo'lda
so'rov) musbat son yuborsa, qaytarim qarzni kamaytirish o'rniga
**oshiradi** va buni hech narsa to'xtatmaydi. Ishorani `TransactionService`
ning o'zi turga qarab qo'ysa ishonchli bo'lardi.

### 3. ✅ `InvoiceDto` da holat va o'quvchi ismi — qo'shildi

**2026-09-10:** `InvoiceDto` ga `paymentStatus`, `EnrollmentDto` ga
`studentFullName` qo'shildi. Front o'shanga o'tkazildi: jadval endi
o'quvchilar ro'yxatini yuklamaydi va holat ustuni qaytdi.

Quyidagi eski yozuv tarix uchun qoldirildi.

#### (eski) `InvoiceDto` da holat ham, o'quvchi ham yo'q edi

`GET /invoice?status=…` filtri ishlaydi, lekin javobda `status` qaytmaydi —
ya'ni foydalanuvchi nima bo'yicha filtrlaganini jadvalda ko'rmaydi.
O'quvchi ham faqat `enrollmentDto.studentId` bo'lib keladi; ismni
ko'rsatish uchun front butun o'quvchilar ro'yxatini yuklab, id bo'yicha
qidiryapti. `InvoiceDto` ga `status` va o'quvchi ismini qo'shsangiz shu
ikkalasi ham yo'qoladi.

### 4. ✅ To'lov faqat ENG SO'NGGI hisobga bog'lanadi — endi `invoiceId` bor

**2026-10-04:** `TransactionCreateDto` da `invoiceId` (`@NotNull`) bor, front
hisobni o'zi tanlab yuboradi. Lekin backend uni faqat `MONTHLY_FEE` uchun
o'qiydi — pastdagi 2026-10-04 bo'limi, 21-band.


`TransactionMapper.toEntity` → `studentService.getLatestInvoice(studentId)`.
Ya'ni eski hisobga to'lov yozib bo'lmaydi, va o'quvchida umuman hisob
bo'lmasa `POST /transaction` 404 qaytaradi. Hozircha yetarli, lekin
`TransactionCreateDto` ga ixtiyoriy `invoiceId` qo'shilsa moslashuvchan
bo'lardi.

---

## 2026-09-11 — `login apis fixes` (9795c65)

### 5. 🔴 LOGINDA AYLANMA BOG'LIQLIK — hech kim kira olmaydi

Uchta narsa bir-birini bog'lab qo'ygan:

1. `LoginRequest.organizationId` — `@NotBlank`, yuborilmasa `400`.
2. Uni bilishning yagona yo'li — `GET /api/v1/organization/name`.
3. Lekin `OrganizationService.getByName()` birinchi qatoridayoq
   `userValidator.authenticateAndGetOrganizationId()` chaqiradi, u esa
   `SecurityContext` bo'sh bo'lsa `UNAUTHORIZED` tashlaydi.

`SecurityConfig` bu yo'lni `WHITE_LIST` ga qo'shgani yordam bermaydi:
Spring so'rovni ichkariga kiritadi, keyin servisning o'zi rad etadi.

Ya'ni: **kirish uchun `organizationId` kerak, `organizationId` ni bilish
uchun esa avval kirish kerak.** Kirmagan odam bu halqadan chiqa olmaydi.

Yechim ikkitadan biri:
- `getByName()` dan `authenticateAndGetOrganizationId()` ni olib tashlash
  (u baribir ishlatilmayapti — pastda 6-bandga qarang), yoki
- `organizationId` ni `@NotBlank` dan chiqarish.

Front tomonda vaqtinchalik himoya qo'yildi: ro'yxat kelmasa "Kirish"
tugmasi ochiq qoladi va xatoni backend aytadi — aks holda bitta nosozlik
butun tizimga kirishni yopib qo'yardi.

### 6. 🟠 `getByName()` chaqiruvchining tashkilotini tekshiradi, lekin filtrlamaydi

```java
String organizationId = userValidator.authenticateAndGetOrganizationId();
validator.validateAndGetId(organizationId);
List<Organization> organizations = repository.findAll();   // HAMMASI
```

Chaqiruvchining tashkiloti olinadi, tekshiriladi — va keyin e'tiborga
olinmaydi: `findAll()` tizimdagi BARCHA tashkilotlarni qaytaradi. Kirish
oynasi uchun aynan shu kerak (lekin tokensiz), kirgan foydalanuvchi uchun
esa bu boshqa mijozlarning ro'yxatini ko'rsatib qo'yish.

### 7. 🔴 `LoginRequest.organizationId` talab qilinadi, lekin ISHLATILMAYDI

`LoginRequest` ga `@NotBlank private String organizationId` qo'shildi.
`AuthService` esa uni umuman o'qimaydi — foydalanuvchi ilgarigiday faqat
telefon bo'yicha topiladi:

```java
User user = userRepository.findByPhoneAndDeletedFalse(phone)
```

Ya'ni hozir bu maydon **hech nimani hal qilmaydi**, faqat yuborilmasa
login `400` qaytaradi. Frontend moslashtirildi (kirish oynasiga tashkilot
tanlagichi qo'shildi), lekin ikkita savol ochiq:

1. Bir xil telefon raqami ikki tashkilotda bo'lsa nima bo'ladi?
   Hozircha **bo'la olmaydi**: `User.phone` da `@Column(unique = true)`
   turibdi, ya'ni raqam butun tizim bo'ylab yagona. Demak telefonning
   o'zi foydalanuvchini aniqlab beradi va `organizationId` ortiqcha.
   Agar "bir odam ikki markazda" modeli kerak bo'lsa, avval shu
   `unique = true` yechilishi kerak — bu ma'lumotlar bazasi qarori,
   login formasining qarori emas.
2. Agar 1-band bajarilmasa, maydonni `@NotBlank` dan olib tashlash
   kerak — hech nima hal qilmaydigan majburiy maydon faqat xatolik
   manbai.

Bu o'zi taklif qilgan "avval kirish, keyin tashkilot tanlash" modeliga
ham zid: ro'yxat kirishdan OLDIN ochiq turibdi (`WHITE_LIST` da
`/api/v1/organization/name` bor), ya'ni tashqaridan har kim barcha
tashkilotlar nomini ko'ra oladi.

### 8. 🟡 `/api/v1/organizations` → `/api/v1/organization`

Yo'l ko'plikdan birlikka o'zgardi. Frontend moslashtirildi
(`superAdminApi.ts`). Eslatma: bunday o'zgarish oldindan aytilmasa
super-admin paneli jimgina `404` bo'ladi — tekshirib ko'rmaguncha
bilinmaydi.


---

## 2026-09-14 — ikki bosqichli login (42dfd27)

`LoginRequest` dan `organizationId` olib tashlandi, `LoginResponse` ga
`requiresOrganizationSelection` va `organizations: List<IdNameDto>`
qo'shildi, `POST /auth/select-organization` paydo bo'ldi va
`WHITE_LIST` ga kiritildi. Front shu oqimga o'tkazildi.

### 9. 🔴 O'quvchilar ro'yxati hamon `User.organizationId` ni o'qiydi

`Student` ga `organizationId` qo'shildi, lekin uchta so'rov hamon
foydalanuvchi ustunini o'qiyapti:

```sql
where u.organizationId = :orgId          -- searchStudentsByOrganization
where u.organizationId = :organizationId -- getAnalyticStudent
where s.user.organizationId = :orgId     -- countStudentsByOrganizationId
```

`User` qatori faqat BIR marta — birinchi markazda — yaratiladi va o'sha
markaz bilan muhrlanadi. Demak ikkinchi markazga yozilgan o'quvchi:

- o'sha markazning ro'yxatida **umuman ko'rinmaydi**,
- birinchi markazning ro'yxatida esa **ketgandan keyin ham turaveradi**,
- hisobot va statistikada ham shunday.

Uchalasi `s.organizationId` ga o'tishi kerak.

### 10. 🔴 O'chirilgan a'zolik hamon kirish huquqini beradi

`findAllByUserId` va `findStudentByOrganizationIdAndUserId` da
`deleted = false` sharti yo'q. Ya'ni A markazidan chiqarilgan o'quvchi
tanlash ro'yxatida A ni ko'raveradi va tanlasa token ham oladi.

### 11. 🟠 Bitta a'zolikdagi tekshiruv foydalanuvchi ustuniga qaraydi

```java
Student student = studentList.get(0);
if (!student.getOrganizationId().equals(user.getOrganizationId()))
    throw new RestException(ErrorType.WRONG_ORGANIZATION, ...);
```

10-band tuzatilgach bu qulf bo'lib qoladi: A dan chiqib B da o'qiyotgan
o'quvchida bitta a'zolik (B) qoladi, `user.organizationId` esa A —
natijada u boshqa hech qachon kira olmaydi. Bitta a'zolik bo'lsa
shundoq `student.getOrganizationId()` olinsa kifoya; `User` dagi ustun
"hisob qayerda ochilgan" degani, huquq bermaydi.

### 12. 🟡 Mayda narsalar

- `searchStudentsByOrganization` da `and u.deleted = false` ikki marta.
- `select-organization` da `organizationId` — `@RequestParam`, ya'ni
  manzil satrida. Server va proxy jurnallariga tushadi; telefon va
  parol bilan bitta tanada yuborilgani tozaroq bo'lardi.


---

## 2026-09-15 — a'zolik modeli (`UserOrganization`) va guruh ro'yxati

Katta va to'g'ri o'zgarish: `User` endi faqat shaxsni saqlaydi (ism,
telefon, parol, rasm, tug'ilgan sana), `role`, `branch` va `permissions`
esa yangi `UserOrganization` jadvaliga ko'chdi. `refreshToken` ham
a'zolikni qayta tekshiradi. Bu ilgari taklif qilingan model.

### 13. 🔴 Loginda `return` tushib qolgan — HAMMA shu yo'lga tushadi

```java
if (allByUserId.size() == 1) {
    UserOrganization userOrganization = allByUserId.get(0);
    getLoginResponse(response, userOrganization);   // ← return YO'Q
}
return LoginResponse.builder()
        .requiresOrganizationSelection(true)
        ...
```

`getLoginResponse` `LoginResponse` qaytaradi, lekin natijasi
tashlab yuborilyapti va kod pastga tushib ketadi. Natijada **bitta
a'zoligi bor har bir foydalanuvchi** — ya'ni deyarli hamma:
administrator, o'qituvchi, ko'pchilik o'quvchi — token o'rniga bitta
elementli "markazni tanlang" ro'yxatini oladi.

Access token yasalgan, refresh cookie ham qo'yilgan, faqat javobga
tushmagan. Bitta `return` yetishmayapti.

Front tomonda vaqtinchalik qoplama qo'yildi: ro'yxatda bitta element
bo'lsa forma so'ramasdan ikkinchi bosqichni o'zi chaqiradi. Bu backend
tuzatilgandan keyin ham to'g'ri xatti-harakat bo'lib qoladi, lekin
hozir ortiqcha bitta so'rov ketyapti.

### 14. 🔴 O'quvchilar ro'yxati HAMON `User.organizationId` ni o'qiydi

9-band tuzatilmagan. `User` da endi `organizationId` ustuni faqat
`BaseEntity` dan kelyapti va a'zolik `UserOrganization` ga ko'chgani
uchun bu so'rovlar butunlay noto'g'ri manbaga qarab qoldi:

```sql
where u.organizationId = :orgId          -- searchStudentsByOrganization
where u.organizationId = :organizationId -- getAnalyticStudent
where s.user.organizationId = :orgId     -- countStudentsByOrganizationId
```

`s.organizationId` ga o'tishi kerak.

### 15. 🟠 `findStudentByOrganizationIdAndUserId` da `deleted` filtri yo'q

`findAllStudentOrganizationsByUserId` ga `s.deleted = false` qo'shildi
(rahmat), lekin ikkinchi bosqichdagi tekshiruv hamon filtrsiz. Ro'yxatda
ko'rinmasa ham, o'chirilgan a'zolikning id'sini qo'lda yuborib token
olish mumkin.

### 16. ✅ `GET /group` endi `GroupOverviewDto` qaytaradi

Ro'yxat javobi yangilandi: `teacher` ichma-ich `TeacherDto` emas,
`{ id, name }`; daraja obyekt emas, `levelName` satri; qo'shimcha
`startDate` va `activeStudentsCount` keldi.

Front moslashtirildi — `GroupOverviewDto` tipi qo'shildi, admin
jadvalidagi o'qituvchi ustuni tuzatildi (u yangi shaklda bo'sh chiqib
qolgan edi) va yangi maydonlar ustun sifatida qo'shildi.


---

## 2026-09-17 — KPI, parol va obuna

### 17. 🔴 `StudentService.createStudent` o'quvchini SAQLAMAYDI

```java
User user = userRepository.getReferenceById(userResponse.id());
Student entity = mapper.toEntity(createDto);
entity.setUser(user);
return new StudentCreateResponseDto(
        entity.getId(),        // ← saqlanmagani uchun null
        userResponse, ...
);
```

`repository.save(entity)` yo'q. Ilgari bor edi, qayta yozishda tushib
qolgan. Natijada `User` va `UserOrganization` yaratiladi, `Student`
qatori esa YO'Q.

Oqibati: odam tizimga kira oladi, lekin o'quvchi emas —
`GET /student/me` uni topolmaydi, guruhga qo'shib bo'lmaydi, balansi
yo'q. Javobdagi `id` ham `null` bo'lib qaytadi.

`TeacherService.createTeacher` da `repository.save(teacher)` bor —
ya'ni bu faqat o'quvchi yo'lida.

Tekshirish: o'quvchi qo'shing va javobdagi `id` ga qarang. `null`
bo'lsa shu.

### 18. 🟠 `newStudents` va `lostStudents` noto'g'ri sanaydi

`getGroupStats` so'rovida ikkalasi ham `s.created_at` ga qarayapti —
ya'ni O'QUVCHI qachon yaratilgan:

```sql
COUNT(... CASE WHEN s.created_at BETWEEN :monthAgo AND :now ...) AS newStudents
COUNT(... CASE WHEN s.created_at BETWEEN :monthAgo AND :now
                AND en.leaving_reason IS NOT NULL ...) AS lostStudents
```

- `newStudents` — bir yil oldin ro'yxatdan o'tgan, lekin bu oyda shu
  guruhga qo'shilgan o'quvchi sanalmaydi. Sana `enrollments` dan
  olinishi kerak.
- `lostStudents` — shart ikki tomonlama: o'quvchi shu oyda yaratilgan
  BO'LISHI kerak. Ya'ni uch oy oldin kelib, bu oyda ketgan odam
  sanalmaydi. Amalda deyarli hamma ketgan o'quvchi tushib qoladi.

### 19. ✅ `potentialFail` — to'g'ri yozilgan

Ketma-ket qoldirishni oynali funksiyalar bilan sanash (gaps and
islands) — aynan kelishilganidek. Rahmat.

### 20. ✅ Obuna: yo'l va ruxsat tuzatildi

`/api/v1/plans`, `/api/v1/subscriptions`, mutatsiyalarda
`@PreAuthorize("hasRole('DEVELOPER')")`. Front allaqachon shu
yo'llarga yozilgan edi.

Yangi: `GET /subscriptions/my` (ADMINISTRATOR/SUPER_ADMIN) va
`POST /subscriptions/renew/{orgId}`.


## 2026-09-18 — tuzatish: 17 va 18-bandlar

`StudentService.createStudent` da `repository.save` **bor** va `newStudents`
masalasi ham ko'rilgan. Yuqoridagi 17-band eskirgan nusxaga qarab
yozilgan — o'sha paytdagi `origin/main` da `save` yo'q edi, keyin
qo'shilgan. Yozuv tarix uchun qoldirildi, lekin **amalda emas**.

Saboq: backend haqida xulosa yozishdan oldin `git fetch` qilinsin.

### `GET /user/phone` — ulandi

`@RequestParam String phone`, `where u.phone = :phone` (teng, `like` emas),
topilmasa `null`. Front shu bo'yicha yozildi.

~~Bitta eslatma: bu yo'lda `@PreAuthorize` yo'q.~~ **Noto'g'ri edi.**
`UserController` KLASS tepasida
`@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMINISTRATOR')")` turibdi va u
barcha metodlarni qamraydi. Men faqat metod ustiga qaragan ekanman.

Saboq: annotatsiyani metodda topmasangiz, klass tepasiga ham qarang —
Spring'da u meros bo'lib o'tadi.


---

## 2026-09-23 — ✅ `lower(bytea)`: tarif va obuna ro'yxati yiqiladi — tuzatildi

Dasturchi panelida "Obunalar" tabi qizil xato bilan ochiladi:

```
ERROR: function lower(bytea) does not exist
  ... where (? is null or lower(o1_0.name) like lower(('%'||?||'%')) escape '')
```

Sabab: `SubscriptionRepository.findAll` va `PlanRepository.findAll` da

```sql
where (:search is null or lower(o.name) like lower(concat('%', :search, '%')))
```

`:search` **null** bo'lganda PostgreSQL `concat` ichidagi parametrning
turini aniqlay olmaydi va uni `bytea` deb oladi. `lower(bytea)` esa
mavjud emas — so'rov butunlay yiqiladi.

Ya'ni **qidiruvsiz ochilganda ro'yxat umuman kelmaydi**. Ikkala tab ham
shunday: obunalar va tariflar.

Yechim — parametr turini ochiq ko'rsatish:

```sql
where (:search is null or lower(o.name) like lower(concat('%', cast(:search as string), '%')))
```

Front tomonda vaqtinchalik chora qo'yildi: `search` endi bo'sh satr
bo'lib yuboriladi (`usePlans.ts`, `useSubscriptions.ts`). Shunda tur
aniq bo'ladi va `like '%%'` hammasini qaytaradi.

> **2026-09-27: tasdiqlandi — tuzatilgan.** `nurulloh-coder-dev/learning-center@main`
> (`ca53469`) da `SubscriptionRepository.findAll` va `PlanRepository.findAll`
> ikkalasida ham endi `cast(:search as string)` bor:
> ```sql
> where (:search is null or lower(o.name) like lower(concat('%', cast(:search as string), '%')))
> ```
> `null` bo'lganda parametr turi endi aniq — `lower(bytea)` xatosi
> chiqmaydi. Frontenddagi `search: ''` chorasi (`usePlans.ts`,
> `useSubscriptions.ts`) zarar qilmagani uchun **olib tashlanmadi** —
> ikkalasi ham bir vaqtda ishlashi mumkin.

### ✅ Yonida: tashkilot qidiruvi teskari yozilgan — tuzatildi

`OrganizationRepository`:

```sql
where (:search is null or :search ilike o.name)
```

Taqqoslash teskari edi: naqsh sifatida FOYDALANUVCHI kiritgan satr
ishlatilyapti, ustun esa qiymat. To'g'risi `o.name ilike :search`
bo'lishi kerak edi, va naqsh `%…%` bilan o'ralishi kerak edi.

Hozir yiqilmasdi (shuning uchun tashkilotlar tabi ochilardi), lekin
qidiruv ishlamasdi: "org" deb yozilsa hech nima topilmasdi.

> **2026-09-27: tasdiqlandi — yo'nalish tuzatilgan, lekin yangi xato
> chiqqan.** `nurulloh-coder-dev/learning-center@main` (`ca53469`) da:
> ```sql
> where (:search is null or o.name ilike concat('%',cast(:search as string),'%s'))
> ```
> Yo'nalish to'g'irlandi (`o.name ilike ...`) va `cast` bilan tur ham
> aniqlashtirilgan — yiqilish yo'q. Lekin oxirgi bo'lak `'%'` emas,
> **`'%s'`** — ya'ni naqsh `%<qidiruv>%s` bo'lib chiqadi: nomi harfiy
> **`s` bilan tugagan** tashkilotlar bundan mustasno, boshqalari hech
> qanday qidiruv so'zi bilan topilmaydi. Ehtimol `'%'` yozmoqchi bo'lib,
> qo'lda "s" harfi qo'shilib qolgan (typo). Yangi topilgan xato sifatida
> shu yerga yozib qo'yildi — frontendda hech narsa o'zgartirilmadi (bu
> band faqat mavjud ikkitasini "tuzatilgan" deb belgilashni so'ragandi).

---

## 2026-09-27 — administratorlar ro'yxati va filial tanlovi

### ✅ `GET /user` → `GET /user/admins`

`UserController` da administratorlar ro'yxati alohida yo'lga ko'chgan:

```java
@GetMapping("admins")
public ResponseEntity<Page<UserDto>> getAll(Pageable pageable, @RequestParam(required = false) String search)
```

Class darajasidagi `@PreAuthorize("hasAnyRole('SUPER_ADMIN','ADMINISTRATOR')")`
shu metodga ham tegishli. Javob — oddiy `Page<UserDto>`, avvalgi `/user`
kabi (yassi, `role` filtrisiz — endpoint o'zi faqat adminlarni qaytaradi).
Frontend `superAdminApi.ts` (`PEOPLE_ENDPOINT.administrators`,
`fetchAdminCount`) shu yo'lga o'tkazildi, `role: 'ADMINISTRATOR'` query
parametri endi yuborilmaydi (kerak emas).

### ✅ `branchId` — o'quvchi, o'qituvchi, administrator yaratishda bor

`UserCreateDto.branchId` (ixtiyoriy `String`, `UserService.createUserOrganization`
da `null`/bo'sh bo'lsa filial biriktirilmaydi) — `StudentCreateDto.userCreateDto`
va `TeacherCreateDto.user` ham shu tipdan foydalanadi, ya'ni uchala
yaratish yo'li (`/student`, `/teacher`, `/user`) bir xil maydonni oladi.
`UserUpdateDto`da bu maydon **yo'q** — tahrirlashda filialni almashtirib
bo'lmaydi (backend qarori, frontend qarori emas).

Frontend admin panelidagi o'quvchi va o'qituvchi yaratish formalariga
filial tanlagichi qo'shildi (`admin/config/forms.ts`, faqat yaratishda —
`optionsSource: 'branches'`). Bitta filial bo'lsa `EntityFormModal`
tanlagichni yashiradi va qiymatni o'zi qo'yadi (`superAdmin.branchRequired`
komentariga mos: "o'quvchi ham, o'qituvchi ham, administrator ham
filialga biriktiriladi").

**Diqqat:** administrator yaratish formasi admin panelida hali umuman
yo'q (`FORM_CONFIGS`/`ENTITIES` da `administrators` yo'q) — super-admin
paneli faqat administratorlar RO'YXATINI ko'rsatadi
(`PeoplePanel.tsx`: "qo'shish va tahrirlash administrator panelida").
Ya'ni filial avtomatik tanlanishi hozircha faqat o'quvchi va o'qituvchi
formalariga tegishli; administrator yaratish formasi alohida vazifa.

---

## 2026-10-04 — to'lov oynasi qayta yozildi (`main` 22ec819)

### 21. 🔴 `POST /transaction` to'lov va qaytarishda 500 beradi

`TransactionService.resolveInvoiceIfRequired` hisobni faqat `MONTHLY_FEE`
uchun topadi, `PAID` va `REFUND` da `null` qaytaradi. Keyin
`TransactionValidator.validate` → `transaction.getInvoice().getPaymentStatus()`
→ **NullPointerException → 500**. Ya'ni administrator hozir hech qanday
to'lovni yoza olmaydi.

Taklif: `invoiceId` har uch tur uchun o'qilsin (u baribir `@NotNull`) va
tashkilot tekshirilsin; "hisob to'langan" tekshiruvi faqat `PAID` uchun
qolsin — pul odatda aynan to'langan hisobdan qaytariladi.

### 22. 🔴 `GET /invoice` boshqa tashkilotlarning hisoblarini ham qaytaradi

`InvoiceRepository.getAllInvoicesByFilter` da `organizationId` sharti yo'q
(faqat `deleted = false`), global Hibernate filtri ham yo'q. Istalgan
markaz administratori qidiruv orqali boshqa markaz o'quvchilarining ismi,
telefoni va summalarini ko'radi. `where i.organizationId = :orgId` kerak.

### 23. 🟡 `RETURNED` → `REFUND`

Enum `REFUND` ga o'zgargan, `@Schema(allowableValues)` hali `RETURNED` ni
ko'rsatadi — Swagger'dan yuborilsa 400. Front `REFUND` ga o'tkazildi.

### 24. 🟡 O'quvchi qidiruvi faqat ism bo'yicha

`GET /student?search=` faqat `fullName` ni qidiradi. To'lov oynasida
telefon bo'yicha ham qidirish qulay bo'lardi — `u.phone` sharti qo'shilsa,
frontda o'zgarish kerak emas.

---

## 2026-10-05 — `GET /invoice/student/{studentId}` va yangi `EnrollmentDto` (`main` b4b1425)

Front ulandi: to'lov oynasi to'lanmagan hisoblarni shu endpointdan oladi
(qaytarish — eski qidiruv orqali, chunki pul to'langan hisobdan qaytadi).
`EnrollmentDto` ning yangi maydonlari (`fullName`, `phone`, `groupIdNameDto`)
va `InvoiceDto.paid` ham ulandi.

### 25. 🔴 Yangi so'rov parametri bog'lanmaydi

`InvoiceRepository.findByStudentId`: so'rovda `:statuses`, metodda esa
`@Param("status")`. `statuses` ga qiymat berilmaydi — chaqirilganda Hibernate
xato beradi, endpoint 500 qaytaradi.

### 26. 🔴 Mantiq teskari: to'langanlarini tanlaydi

`InvoiceService.getStudentInvoice` → `findByStudentId(studentId, InvoiceStatus.PAID)`,
so'rovda esa `paymentStatus in :statuses`. Nom tuzatilsa ham endpoint
TO'LANGAN hisoblarni qaytaradi. `not in` yoki `<> :status` kerak.

### 27. 🟠 Proyeksiyada holat nomi mos emas

So'rovda `i.paymentStatus as paymentStatus`, `SimpleInvoiceProjection` da
esa `getInvoiceStatus()` — holat har doim `null` keladi.
`i.deleted = false` sharti ham yo'q: o'chirilgan hisob tanlanib qolishi mumkin.

### 28. 🟡 "Hammasi to'langan" matni

`INVOICE_ALREADY_PAID` uchun `messages*.properties` yo'q — javobda
"MessageKey not found: invoice.already.paid". Front bu 409 ni o'zi ushlab,
o'z matnini ko'rsatadi.

21-band (`POST /transaction` da `PAID`/`REFUND` uchun hisob o'qilmaydi →
NPE → 500) hamon ochiq.

