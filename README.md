# A.L.I.A. — frontend

**A**cademic **L**ead & **I**ntelligence **A**ssistant

O'quv markazi uchun veb-mijoz. Spring backend bilan `/api/v1/**` orqali
ishlaydi va rolga qarab har xil panel ko'rsatadi:

| Rol             | Nima ko'radi                                                      |
| --------------- | ----------------------------------------------------------------- |
| `ADMINISTRATOR` | Students / Teachers / Groups / Lessons CRUD + guruhga o'quvchi biriktirish + **To'lovlar** (o'quvchini qidirib to'lov qabul qilish, alohida pul qaytarish) |
| `TEACHER`       | O'z guruhlari, ro'yxat, "Start lesson", davomat                    |
| `STUDENT`       | O'z profili; davomat va guruh — endpoint kutilmoqda                |
| `SUPER_ADMIN`   | Dashboard (4 ta karta, oylik tushum grafigi, lidlar holati, so'nggi to'lovlar, tezkor havolalar), tashkilot va filiallar CRUD, odamlar ro'yxati + administrator qo'shish |
| hamma rol       | **Sozlamalar**: til, tema, profil, parol (markaz bloki — `/auth/me` da filial yo'q) |
| boshqa          | Tushunarli xabar bilan placeholder                                 |

## Stack

- **React 19** + **React Router 7**
- **TypeScript 6** (`strict`) — butun `src/` `.ts`/`.tsx`
- **Vite 8** — dev server va build
- **Tailwind CSS 4** — `tailwind.config.js` YO'Q, sozlama `src/styles/index.css` ichida
- **TanStack Query 5** — server ma'lumoti (cache, loading, xato, invalidatsiya)
- **Vitest 4 + Testing Library** — testlar
- **ESLint 10** (flat config) + `typescript-eslint`

**Uch til:** o'zbekcha (default), ruscha, inglizcha — `src/shared/i18n/`.
**Dark/light rejim:** barcha ranglar CSS o'zgaruvchilari.
Ikkalasining tanlovi `localStorage` da, o'zgartirish — **Sozlamalar** sahifasida.

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:5173
```

Dev server `/api` ni `http://localhost:8080` ga uzatadi, ya'ni backend o'sha
yerda turishi kerak. Boshqa manzil kerak bo'lsa — `vite.config.ts` dagi
`server.proxy.target`.

Productionda Vite yo'q, shuning uchun `/api` ni frontend xizmatining o'zi
uzatadi — ildizdagi `Dockerfile` + `Caddyfile` shuning uchun.
Batafsil: [`docs/deployment.md`](docs/deployment.md).

## Backendsiz demo

```bash
npm run build:demo    # → dist-demo/alia-demo.html
```

Bitta o'zi yetarli HTML fayl: soxta API, soxta ma'lumot, shriftlar ham
ichida. Dizaynni ko'rsatish yoki backend tayyor bo'lmaganda ekranlarni
muhokama qilish uchun. Kod `src/demo/` da va production bundle'ga tushmaydi.

Muhit o'zgaruvchilari (`.env`) loyihada ishlatilmaydi, shuning uchun
`.env.example` ham yo'q. Kalit/token kodda saqlanmaydi.

## Buyruqlar

| Buyruq                  | Nima qiladi                                     |
| ----------------------- | ----------------------------------------------- |
| `npm run dev`           | Dev server (port 5173, `/api` proxy)            |
| `npm run typecheck`     | `tsc -b` — faqat tiplarni tekshiradi            |
| `npm test`              | Vitest, bir marta                               |
| `npm run test:watch`    | Vitest, kuzatuv rejimida                        |
| `npm run test:coverage` | Qamrov hisoboti                                 |
| `npm run lint`          | ESLint                                          |
| `npm run build`         | `tsc -b && vite build` → `dist/`                |
| `npm run build:demo`    | Backendsiz demo: bitta HTML fayl → `dist-demo/`  |
| `npm run preview`       | Tayyor `dist/` ni lokal ko'rish                 |

Kodni topshirishdan oldin: `npm run typecheck && npm run lint && npm test && npm run build`.

## Papka tuzilishi

Qatlamli tuzilma: **`app` → `features` → `shared`**. O'q faqat pastga
qaraydi — `shared` hech qachon `features` dan import qilmaydi.

```
src/
  app/                 ilova karkasi
    App.tsx            provider'lar + marshrutlar
    providers/         Theme, Auth, QueryClient
    routes/            AppRoutes, RoleDashboard
  features/            biznes bo'limlari (har biri o'zicha to'liq)
    auth/  admin/  teacher/  attendance/  payments/  settings/  student/  super-admin/  leads/
      api/         shu bo'lim endpoint'lari
      hooks/       TanStack Query hooklari va holat mantiqi
      components/  shu bo'limga tegishli komponentlar
      config/      jadval/forma konfiguratsiyasi (admin)
      pages/       ekran
  shared/            bo'limlarga bog'liq bo'lmagan hamma narsa
    api/     apiFetch, ApiError, queryKeys
    ui/      AppShell, Button, Modal, Panel, Badge, ThemeToggle …
    lib/     format, jwt, cn
    i18n/    tarjimalar: uz/ ru/ en/ papkalari, har bo'lim alohida fayl
    types/   backend DTO tiplari
  styles/index.css   Tailwind + rang tokenlari + dark rejim
  test/              test setup va yordamchilari
```

Batafsil qoidalar: [`docs/architecture.md`](docs/architecture.md).

## Auth oqimi

1. Sahifa ochilganda `AuthProvider` `/auth/refresh-token` ga POST yuboradi
   (`credentials: 'include'`) — httpOnly refresh cookie yangi access token beradi.
2. Access token payload'i **imzo tekshirilmasdan** ochiladi (`shared/lib/jwt.ts`),
   faqat `role` (va `ADMINISTRATOR` uchun — `permissions`) ni bilib kerakli
   panel/tab/tugmani ko'rsatish uchun (`useHasPermission`,
   `RequirePermission`). Avtorizatsiya — backendning ishi.
3. Token faqat React state'da yashaydi, `localStorage` da **emas**.
4. Chiqish boshlangach token boshqa yangilanmaydi — orqada qolgan so'rov
   403 olib, odamni qaytadan kiritib yubormasin.
5. Chiqishda keshdan tashqari forma qoralamalari ham o'chiriladi — ularda
   ism va telefon bor (`useDraft`, [docs/state-management.md](docs/state-management.md)).

## Hujjatlar

| Fayl                                                   | Nima haqida                                       |
| ------------------------------------------------------ | ------------------------------------------------- |
| [docs/architecture.md](docs/architecture.md)           | Papka tuzilishi, qatlam qoidalari, yangi bo'lim qo'shish |
| [docs/styling.md](docs/styling.md)                     | Tailwind v4, rang tokenlari, dark rejim           |
| [docs/state-management.md](docs/state-management.md)   | TanStack Query qoidalari, nega Redux emas         |
| [docs/typescript.md](docs/typescript.md)               | TS sozlamalari va tip yozish qoidalari            |
| [docs/i18n.md](docs/i18n.md)                           | Uch tillilik: yangi matn qo'shish, cheklovlar     |
| [docs/testing.md](docs/testing.md)                     | Testlarni yozish va ishga tushirish               |
| [docs/deployment.md](docs/deployment.md)               | Railway'ga deploy, `/api` proxysi, cookie masalasi |
| [docs/backend-notes.md](docs/backend-notes.md)         | Backend jamoasiga: xavfsizlik va topilgan xatolar  |
| [docs/backend-api-request.md](docs/backend-api-request.md) | Backend jamoasiga: kerakli API'lar, ustuvorlik bo'yicha |
| [docs/lead-form.md](docs/lead-form.md)                 | Ochiq lid formasi (`/f/<kalit>`): qarorlar va endpointlar |
| [docs/ARXITEKTURA-TARIXI.md](docs/ARXITEKTURA-TARIXI.md) | Nega shunday qilingan + loyihaning hozirgi holati |
| [CLAUDE.md](CLAUDE.md)                                 | Buzilmasligi kerak bo'lgan qoidalar               |
