# A.L.I.A — landing (alia.uz)

O'quv markazlari uchun CRM'ning ochiq sahifasi. Next.js 16, Tailwind 4,
lucide-react. Statik eksport (`output: 'export'` → `out/`): ildizdagi
`Dockerfile` uni ilova bilan bitta Caddy serveriga qo'yadi. Shuning uchun
server talab qiladigan Next imkoniyatlari (API route, SSR, rasm
optimallashtirish) ishlatilmaydi.

Bu papka monorepoga `git subtree` bilan olib kelingan
(`Diyor-Khasanov-dev/learning-center-landing`); endi ish shu yerda davom etadi.

## Buyruqlar

```bash
cd landing
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

CI (`.github/workflows/ci.yml`, `landing` job) `lint` va `build` ni ishga tushiradi.

## Qoidalar

- **Faqat ilovada haqiqatan bor imkoniyat yoziladi.** Soxta statistika,
  mijoz fikri, narx, "jonli" ko'rsatkichlar yo'q. Yangi bo'lim qo'shishdan
  oldin ilovada borligini tekshiring.
- Matnlar — `data/translations.ts` (uz / ru / en).
- `AGENTS.md` dagi ogohlantirish: Next.js 16 API'lari eski versiyalardan farq
  qiladi, kod yozishdan oldin `node_modules/next/dist/docs/` ga qarang.
- Demo so'rov formasi (`DemoModal`) hozircha hech qayerga yubormaydi —
  backendning ochiq lid formasiga ulash rejalashtirilgan
  (`../docs/lead-form.md`).
