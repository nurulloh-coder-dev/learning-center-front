import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadataBase = new URL(
  process.env.NEXT_PUBLIC_APP_URL || "https://alia.uz"
);

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f8fafc" },
    { media: "(prefers-color-scheme: dark)", color: "#07080e" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: "A.L.I.A - Academic Lead & Intelligence Assistant | Ta'lim ERP va CRM",
    template: "%s | A.L.I.A",
  },
  description:
    "A.L.I.A (Academic Lead & Intelligence Assistant) — o'quv markazlari uchun CRM va boshqaruv tizimi: lidlar va ochiq ariza formasi, talabalar, guruhlar, davomat, to'lovlar va filiallar kesimidagi hisobotlar. CRM для учебных центров.",
  keywords: [
    // Uzbek keywords
    "alia",
    "academic lead intelligence assistant",
    "o'quv markaz dasturi",
    "ta'lim markazini boshqarish",
    "o'quv markaz CRM",
    "o'quv markaz ERP",
    "modme muqobili",
    "o'quv markazi avtomatlashtirish",
    "talabalar davomati",
    "o'quv markaz to'lovlari",
    "kurslar uchun CRM",
    "til markazi dasturi",
    "IT akademiya dasturi",
    "filiallar boshqaruvi",
    "ta'lim tizimi",
    // Russian keywords
    "CRM для учебного центра",
    "автоматизация учебных центров",
    "программа для языковой школы",
    "учет студентов",
    "система управления курсами",
    "CRM для IT академии",
    "CRM Uzbekistan",
    "CRM Tashkent",
    // English keywords
    "A.L.I.A",
    "Academic Lead & Intelligence Assistant",
    "learning center management software",
    "education ERP",
    "education CRM",
    "language school software",
    "tutoring center management",
    "student attendance software",
    "school billing system",
    "multi branch education platform",
    "alia app",
  ],
  authors: [{ name: "A.L.I.A Team", url: "https://alia.uz" }],
  creator: "A.L.I.A",
  publisher: "A.L.I.A",
  category: "Education & Business Management Software",
  applicationName: "A.L.I.A",
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
    languages: {
      "uz-UZ": "/?lang=uz",
      "ru-RU": "/?lang=ru",
      "en-US": "/?lang=en",
    },
  },
  openGraph: {
    title: "A.L.I.A - Academic Lead & Intelligence Assistant | Ta'lim ERP va CRM",
    description:
      "O'quv markazlari uchun CRM: lidlar, talabalar, guruhlar, davomat, to'lovlar va filiallar hisobotlari bitta tizimda.",
    url: "https://alia.uz",
    siteName: "A.L.I.A",
    locale: "uz_UZ",
    alternateLocale: ["ru_RU", "en_US"],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "A.L.I.A - Academic Lead & Intelligence Assistant",
    description:
      "O'quv markazlari uchun CRM: lidlar, davomat, to'lovlar va filiallar boshqaruvi.",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="uz"
      className="h-full antialiased dark"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-neutral-950 dark:text-slate-100 transition-colors duration-200">
        <LanguageProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
