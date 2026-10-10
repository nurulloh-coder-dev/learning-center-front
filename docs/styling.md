# Stillar: Tailwind 4 va tema

## Sozlama qayerda

`tailwind.config.js` **yo'q** — Tailwind 4 da sozlama CSS ichida:
[`src/styles/index.css`](../src/styles/index.css).

Vite plagini (`@tailwindcss/vite`) `vite.config.ts` ga ulangan, PostCSS
konfiguratsiyasi kerak emas.

## Ranglar qanday ishlaydi

Uch qavat:

1. `:root` — light rejim qiymatlari (`--surface: #faf6ee`)
2. `.dark` — dark rejim qiymatlari (`--surface: #16171b`)
3. `@theme inline` — CSS o'zgaruvchisini Tailwind utility'siga ulaydi
   (`--color-surface: var(--surface)` → `bg-surface`, `text-surface`, …)

`inline` so'zi muhim: utility qiymatni nusxalab olmaydi, o'zgaruvchiga
**havola** qiladi. Shuning uchun `<html>` ga `dark` klassi qo'shilishi bilan
butun sahifa qayta bo'yaladi — JS ishtirokisiz.

### Yangi rang qo'shish

```css
:root  { --info: #2f6fb0; }
.dark  { --info: #7fb2e0; }

@theme inline {
  --color-info: var(--info);
}
```

Shundan keyin `bg-info`, `text-info`, `border-info` o'zi ishlaydi.

**Komponentda hex kod yozmang.** Agar kerakli semantik rang yo'q bo'lsa,
uni yuqoridagidek qo'shing.

## Palitra (2026-10, ikkinchi yangilanish)

Nurulloh ikki namuna tanladi: **light — "ERP" uslubi**, **dark — "PulseBoard"**.

- **Light:** och kulrang-ko'k fon `#eef2f7`, oq kartalar, bitta ko'k aksent
  `#2563eb`. Chap menyu ham oq (`--sidebar`), faol band — to'liq ko'k kapsula.
- **Dark:** chuqur navy fon `#070b16`, karta `#0d1426`, chegaralar ko'rinadigan
  `#1b2540` (oq foiz emas). Faol band va asosiy tugma — moviydan binafshaga
  gradient.
- **Gradient bitta joyda:** `from-brand to-brand-2`. Light'da ikkala token bir
  xil (`#2563eb`) — gradient sezilmaydi, dark'da `#3b82f6 → #6d5cf6`. Yangi
  gradient yozmang, shu juftlikni ishlating.
- **Kartalar to'liq rangli** (`bg-surface-card`), shishasiz (`backdrop-blur` yo'q),
  soya — `shadow-[var(--shadow-card)]`.
- **Ikonka fonlari pastel** (`accent-soft`, `success-soft`, `amber-soft`,
  `purple-soft`, `steel-soft`) — namunadagi dumaloq ikonkalar.
- **Holat ranglari** (`success`, `danger`, `warning`) faqat holat uchun.
- **`StatCard`:** tepada kichik bosh harfli sarlavha, o'ng burchakda dumaloq
  ikonka, katta raqam, ostida yashil o'sish yozuvi (faqat HAQIQIY ma'lumot).
- **Progress chiziqlari** — `<progress>` + `[&::-webkit-progress-value]:bg-…`:
  eni ma'lumotga bog'liq, lekin inline `style` kerak emas.
- **Asosiy tugma** (`primary`) — kapsula (`rounded-full`). Burchak klassi
  variantda turadi, `Button` asosida emas: bitta elementda ikki xil `rounded-*` bo'lmasin.
- **Qidiruv** — `SearchInput`; **odamlar** — `Avatar colorful`.

## Dark rejim

`prefers-color-scheme` emas, `<html class="dark">` ishlatiladi — foydalanuvchi
tizim sozlamasidan qat'i nazar temani tanlay olishi kerak.

Boshqaruv: [`src/app/providers/ThemeProvider.tsx`](../src/app/providers/ThemeProvider.tsx).
Tanlov `localStorage` dagi `clc-theme` kalitida. Saqlangan tanlov bo'lmasa
tizim sozlamasi olinadi.

Almashtirgich — `<ThemeToggle />`, har bir ekranning sarlavhasida bor.

### Dark rejimni tekshirish

Har bir yangi ekran uchun:

1. `npm run dev`, tepadagi oy/quyosh tugmasini bosing.
2. Matn fonga singib ketmaganini tekshiring (ayniqsa `text-fg-faint`).
3. To'q fonda to'yingan ranglar "yonib" ketadi — shuning uchun `.dark` da
   ochroq variantlar berilgan (`--accent`, `--success`, `--danger`).

## Nomlash

Semantik nom ishlating, rang nomini emas: `bg-surface-card`, `text-fg-muted`,
`border-border-base`. `bg-yellow-400` kabi qattiq ranglar dark rejimda
buziladi.

| Token guruhi                         | Nima uchun                          |
| ------------------------------------ | ----------------------------------- |
| `surface`, `surface-card`, `surface-muted`, `surface-hover` | fonlar |
| `fg`, `fg-muted`, `fg-faint`, `fg-inverted` | matn         |
| `border-base`, `border-strong`       | chegaralar                          |
| `brand`, `accent`, `success`, `danger`, `warning`, `purple` | urg'u va holat |
| `*-soft`                             | shu rangning och foni (nishon uchun)|
| `*-fg`                               | shu soft fon ustidagi matn rangi    |

## Inline `style` ishlatilmaydi

Ilgari har sahifada 100+ qatorli `const s = { … }` obyekti bor edi. Ular
Tailwind klasslariga ko'chirildi: dark rejim, `:hover`, media so'rovlar va
kod takrorlanishi shu bilan yechildi.

## Butun ekranli oyna — faqat portal orqali

`Panel` va sozlamalar kartalarida `backdrop-blur` (`backdrop-filter`) bor.
Bu xususiyat ichidagi `fixed` elementni butun ekranga emas, **kartaning
o'ziga** bog'laydi: `fixed inset-0` yozilgan oyna karta o'lchamida qoladi,
tepasi yuqori panel ostida qirqiladi, keyingi kartalar esa uning ustiga
chiqadi (2026-09-30: 1280×900 ekranda rasm oynasi 670×315 bo'lib chiqqan).

Shuning uchun:

- oyna kerak bo'lsa — `shared/ui/Modal` (u `document.body` ga portal qiladi);
- `Modal` to'g'ri kelmasa (masalan rasmni kattalashtirish) —
  `createPortal(..., document.body)` bilan o'zingiz chiqaring;
- `fixed` elementni to'g'ridan-to'g'ri kartaning ichiga yozmang.
