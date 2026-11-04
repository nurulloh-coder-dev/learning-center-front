# Excel/CSV import (o'quvchi va o'qituvchi)

Yangi markaz yuzlab odamni qo'lda kiritmasin: administrator yoki super admin
Excel/CSV faylni yuklaydi, ustunlarni tasdiqlaydi va hammasi bitta so'rovda
qo'shiladi.

## Qayerda

- Admin paneli → O'quvchilar / O'qituvchilar → "Excel'dan import".
- Super admin → O'quvchilar / O'qituvchilar → "Excel'dan import".
- Sahifa: `/import/students` (`STUDENT_MANAGEMENT`), `/import/teachers`
  (`TEACHER_MANAGEMENT`). Super admin cheklovsiz. Modal emas — moslash va
  oldindan ko'rish jadvali kichik oynaga sig'maydi.

## Oqim

1. **Fayl va filial.** `.xlsx` yoki `.csv` (`;`, `,` yoki tab). Fayl
   brauzerning o'zida o'qiladi (`read-excel-file`, alohida bo'lak bo'lib
   faqat shu sahifada yuklanadi) — serverga fayl ketmaydi. Eski `.xls`
   o'qilmaydi. Filial bitta tanlanadi va hamma qatorga qo'yiladi; filial
   bitta bo'lsa — o'zi tanlanadi.
2. **Ustunlarni moslash.** Chapda fayl ustuni (tanlanadi), o'ngda bizning
   maydon (o'zgarmaydi). Avtomatik moslash uz/ru/en sinonimlar bo'yicha
   (`lib/importFields.ts`): "Tel", "Телефон", "FIO", "Дата рождения"…
   Bitta ustun ikki maydonga qo'yilmaydi. Majburiy: to'liq ism va telefon
   (yaratish formasidagidek). Qo'lda tanlangan moslik shu brauzerda eslab
   qolinadi (`localStorage`, `clc-import-headers:<tur>`).
3. **Tekshirish.** Ism yoki telefon yo'q / telefon noto'g'ri — qator
   YUBORILMAYDI. Tug'ilgan sana yoki ota-ona telefoni tushunilmasa — qator
   ketadi, o'sha maydon `null`. Telefon: `901234567` va `998901234567`
   `+998...` ga keltiriladi; O'zbekiston raqami aniq 12 raqam. Sana:
   `2008-03-14`, `14.03.2008`, Excel sana katakchasi yoki soni.
   Bir martada ko'pi bilan 500 qator.
4. **Natija.** Yangi parollar faqat shu javobda keladi — ekranda ko'rsatiladi
   va CSV qilib yuklab olinadi. Telefon tizimda allaqachon bo'lsa backend
   parol bermaydi ("mavjud akkaunt"). Yiqilgan qatorlar fayldagi qator
   raqami va server xabari bilan.

## Backend

`POST /student/list` (`List<StudentCreateDto>`) va `POST /teacher/list`
(`List<TeacherCreateDto>`), `main` `6a0588b`. Har qator alohida yaratiladi:
javob `BulkResult { succeeded[], failed[{ index, input, errorType, message }] }`,
hammasi o'tsa `201`, qisman — `207`.

Ma'lum cheklovlar (Nurullohga aytilgan, 2026-11-04):

- Faqat `RestException` ushlanadi — boshqa xato butun so'rovni `500` qiladi,
  oldingi qatorlar esa saqlanib qoladi. Front bunda "ro'yxatni tekshiring"
  deydi; qayta yuklansa saqlanganlar "telefon band" bo'lib o'tib ketadi.
- `createStudent` bir klass ichidan chaqiriladi — `@Transactional` ishlamaydi.
- Ro'yxat hajmiga backendda chegara yo'q — frontda 500.

## Kod

`src/features/import/` — `lib/` (o'qish, moslash, tekshirish — DOM'siz
test qilinadi), `hooks/useImportFlow.ts` (butun holat), `components/`
(uch qadam + natija), `pages/ImportPage.tsx`. Demo: `src/demo/mockApi/bulkImport.ts`
(telefoni `...901234567` bilan tugagan qator "telefon band" bo'lib yiqiladi).
