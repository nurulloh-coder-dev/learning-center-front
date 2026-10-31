# Agent sessiyasi uchun: ish tartibi, holat va ochiq ishlar

Yangi agent sessiyasi shu fayldan boshlaydi (CLAUDE.md dan keyin). Oldingi
sessiyalarda kelishilgan ish tartibi va hali tugamagan ishlar shu yerda —
qayta "kashf qilinmasin". Oxirgi yangilanish: 2026-10-31.

## Kim bilan ishlaymiz

- **Loyiha rahbari** (sessiyani ochgan foydalanuvchi) — dasturchi emas.
  Javob o'zbekcha, qisqa, sodda; texnik tafsilot faqat kerak bo'lsa.
  Xarajatga e'tiborli — ortiqcha aylanma, keraksiz tekshiruv yo'q.
- Agent — **tech lead va reviewer**: kod yozadi, jamoa ishini ko'rib chiqadi,
  jamoaga xabar tayyorlaydi.
- **Nurulloh** — backend lead, Railway akkaunti uniki.
  **Muhammadali** — backend. **Diyor** — frontend (Jules bilan ishlaydi:
  unga kichik, aniq fayl nomli vazifa). Oybek jamoadan chiqqan.
- Jamoaga xabar — **kod blokida**, rahbar nomidan, "siz" bilan. Rahbar uni
  o'zi ko'chirib yuboradi.
- Rahbar Nurullohning ovozli xabarlarini matn qilib yuboradi — ular
  qaror/talab, lekin kodga qarab tekshiriladi (pastdagi saboqlar).

## Ruxsat va taqiqlar

- **Doimiy ruxsat:** agent o'z PR'ini `N` ga ochadi va CI yashil bo'lsa
  **o'zi merge qiladi**, keyin rahbarga qisqa aytadi.
- Merge'dan oldin: kodni o'qish, to'rtta tekshiruv (`typecheck`, `lint`,
  `test`, `build`), demo'da ko'rish (light + dark, kompyuter + telefon eni).
- `N` ga to'g'ridan-to'g'ri push yo'q. Deploy/Railway o'zgarishi — oldin so'raladi.
- Kalit, token, parol chatga, kodga, hujjatga yozilmaydi; chatda so'ralmaydi.
  Test login faqat env o'zgaruvchida va faqat test tashkilot uchun.
- **Backend testlari ishga tushirilmaydi** — ular production bazaga ulanadi.
- Ishonchsiz repolardan kod olinmaydi.
- Commit/PR'da model nomi yozilmaydi.

## Saboqlar (xato qilingan joylar)

- **"Backend tuzatildi" degan gapga ishonmay, `main` ni o'qib tekshirish.**
  Backend: `git clone --depth 1 -b main https://github.com/nurulloh-coder-dev/learning-center`
  (o'qish uchun). DTO/endpoint shu yerdan solishtiriladi.
- Backend xatosi topilsa — fayl:qator, sabab va tayyor tuzatish bilan
  Nurullohga xabar. Front backend tayyor bo'lmasa ham yoziladi, lekin
  **xavfli bo'lsa merge qilinmaydi** (masalan PR #135).
- Mavjud xatti-harakatni "yo'l-yo'lakay" o'zgartirish yo'q: masalan
  `GROUP_MANAGEMENT` ruxsati qo'shildi, lekin bu ruxsatsiz adminlardan guruh
  bo'limi yashirilmadi — eski adminlar uni birdan yo'qotardi.
- Sinab ko'rilmagan narsa "ishlaydi" deyilmaydi; taxmin — taxmin deb aytiladi.
- Next.js metadata route'lariga `export const dynamic = 'force-static'` kerak
  (statik eksport). `/developer` kabi yangi ilova yo'li `Caddyfile` `@app` ga ham
  qo'shiladi — aks holda 404 (PR #130 → #132 da shunday bo'lgan).

## Demo'da tekshirish

```bash
npm ci && npm run build:demo
cd dist-demo && python3 -m http.server 4599
# http://localhost:4599/demo.html#ADMINISTRATOR  (yoki #SUPER_ADMIN, #TEACHER ...)
```

- Playwright/Chromium muhitda o'rnatilgan (`require('playwright')`).
- Tema: `localStorage` `clc-theme` = `light` | `dark`.
- Menyu bandlari `button`, `link` emas: `getByText('Lidlar', { exact: true })`.
- Telefon eni: avval 1280 da sahifaga o'tib, keyin `setViewportSize({ width: 390 })`
  (telefonda chap menyu yopiq).

## Ochiq ishlar

| Ish | Holat | Kimda |
| --- | --- | --- |
| PR #135: parolni yangilash, adminni tahrirlash, o'z akkaunti ro'yxatda yo'q, `GROUP_MANAGEMENT`, lid kartasi stili | Draft. Backend tuzatmaguncha **merge qilinmaydi** | Agent kutadi |
| `POST /user/{id}/password-regenerate`: javobda hash qaytadi, tashkilot/ruxsat tekshiruvi yo'q; `PUT /user/{id}` faqat o'zini tahrirlaydi | Tuzatilmagan (2026-10-30 holati) | Nurulloh |
| Limit foizi API (tashkilotda o'quvchilar soni / tarif limiti) | Kutilmoqda | Muhammadali |
| Limit UI: dasturchi panelida >100% tashkilot qizil; super admin'ga ≥80% — "N% joy qoldi", >100% — "7 kun ichida yangi tarifga o'ting" | API kelgach | Agent |
| `PlanValidator.validateLimits` limitga yetganda darhol bloklaydi — 7 kunlik muhlat qoidasiga zid | Nurullohga aytilgan | Nurulloh |
| `/auth/me` da `branchId` doim `null` (`User` da filial yo'q) → "Markaz sozlamalari" ochilmaydi | Nurullohga aytilgan | Nurulloh |
| Landing canonical/metadata/sitemap → `https://www.alia.uz` | Va'da qilingan | Agent |
| Landing demo formasi → ochiq lead-form endpointiga | Berilgan | Diyor |
| Ilgarigi backend topilmalari: to'lov invoice `paidAmount`/holatini yangilamaydi, `@PreAuthorize` bo'shliqlari, ikki marta invoice xavfi, `unmappedTargetPolicy = ERROR`, kunlik zaxira | Ochiq | Nurulloh |

## Tariflar (2026-10-29 qarori)

O'quvchilar soni bo'yicha: Start (100 tagacha), Standard (101–300),
Pro (301–1000), Premium (1000+). To'lov 2, 4, 6 yoki 12 oyga; 4 oy −5%,
6 oy −10%, 12 oy −15%.

| Muddat | Start | Standard | Pro | Premium |
| --- | --- | --- | --- | --- |
| 2 oy | 600 000 | 1 000 000 | 2 000 000 | 3 500 000 |
| 4 oy | 1 140 000 | 1 900 000 | 3 800 000 | 6 650 000 |
| 6 oy | 1 620 000 | 2 700 000 | 5 400 000 | 9 450 000 |
| 12 oy | 3 060 000 | 5 100 000 | 10 200 000 | 17 850 000 |

Limitdan oshish qoidasi (Nurulloh, 2026-10-30/31):

- Limitdan oshgach **7 kun** muhlat; platforma bloklanmaydi. 7 kun ichida
  limitga qaytsa — hech narsa to'lanmaydi.
- Yuqori tarifga o'tish: **qolgan oylar × chegirmasiz oylik narx farqi**.
  Chegirmasiz oylik: Start 300 000, Standard 500 000, Pro 1 000 000,
  Premium 1 750 000. Misol: 5 oy qolganda Start → Standard =
  (500 000 − 300 000) × 5 = 1 000 000.
- Limit oyning 1–15-kunlarida oshsa, shu oy ham farqqa kiradi; 16-kundan
  keyin — keyingi oydan. (Ochiq savol: kalendar oyimi yoki to'lov oyimi.)
- Kodda avtomatik hisoblanmaydi: jamoa har kuni panelda ko'radi va
  Telegram orqali mijoz bilan bog'lanadi.

## Hujjatlar (repoda emas)

- **Tijorat taklifi** — Claude Docs hujjati, rahbarning claude.ai
  hujjatlarida "ALIA — Tijorat taklifi". Tariflar va limit qoidasi shunda.
  Mijozga: gaplashib, demo ko'rsatgandan keyin qoldiriladi.
- **Ommaviy oferta** — qoralama PDF. E'londan oldin: operator rekvizitlari
  (YTT/MChJ, STIR), shaxsiy ma'lumotlarni O'zbekistonda saqlash talabi
  (server Railway'da — huquqshunos ko'rsin), pul qaytarish va javobgarlik
  chegarasi, aksept = to'lov, Maxfiylik siyosati, limit/upgrade qoidasi.
