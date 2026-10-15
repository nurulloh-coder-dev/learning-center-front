import { DropdownOption } from '@/components/ui/Dropdown'
import { Language } from '@/context/LanguageContext'
import {
  RoleFilter,
  OldVsNewItem,
  FeatureModule,
  TourTab,
  FaqItem,
  TeamMember,
} from '@/types/landing'
import {
  GraduationCap,
  CreditCard,
  Building2,
  PhoneCall,
  BarChart3,
  Filter,
  ClipboardCheck,
  ShieldCheck,
  Users,
} from 'lucide-react'

export interface NavTranslations {
  whyUs: string
  modules: string
  tour: string
  team: string
  faq: string
  login: string
  bookDemo: string
}

export interface TeamTranslations {
  badge: string
  heading: string
  subheading: string
  members: TeamMember[]
}

export interface HeroTranslations {
  badge: string
  titlePart1: string
  titleHighlight: string
  titlePart2: string
  description: string
  bookDemoBtn: string
  watchTourBtn: string
  trustTrial: string
  trustSetup: string
  trustMigration: string
  dashboardTitle: string
  liveSystem: string
  activeStudents: string
  thisMonth: string
  monthlyTuition: string
  collected: string
  newLeads: string
  readyToEnroll: string
  attendanceToday: string
  qrActive: string
  revenueChartTitle: string
  revenueChartSub: string
  chartCurrent: string
  liveStreamTitle: string
  tuitionPaid: string
  qrCheckin: string
  newLeadIg: string
}

export interface ComparisonTranslations {
  badge: string
  heading: string
  subheading: string
  oldWayTitle: string
  oldWayTag: string
  newWayTitle: string
  newWayTag: string
  items: OldVsNewItem[]
}

export interface FeatureModulesTranslations {
  badge: string
  heading: string
  subheading: string
  filterLabel: string
  requestDemo: string
  roleFilterOptions: DropdownOption<RoleFilter>[]
  modules: FeatureModule[]
}

export interface TourTranslations {
  badge: string
  heading: string
  subheading: string
  seeDemoBtn: string
  liveInterface: string
  synced: string
  tabs: TourTab[]
  mock: TourMock
}

// Tour oynasidagi namuna ekranlar matni — ilovadagi haqiqiy nomlar bilan bir xil
export interface TourMock {
  leadColumns: [string, string, string]
  callToday: string
  groupLabel: string
  lessonTitle: string
  present: string
  absent: string
  excused: string
  markedNote: string
  invoicesTitle: string
  paid: string
  pending: string
  overdue: string
  paymentsTitle: string
  monthlyFee: string
  paidAction: string
  myAttendance: string
  attendanceSummary: string
  myBalance: string
  balanceHint: string
  myGroup: string
  teacherLabel: string
}

export interface FaqTranslations {
  badge: string
  heading: string
  subheading: string
  faqs: FaqItem[]
}

export interface CtaTranslations {
  heading: string
  subheading: string
  bookDemoBtn: string
  freeTrialBtn: string
  guaranteeText: string
}

export interface FooterTranslations {
  brandDesc: string
  security: string
  modulesTitle: string
  solutionsTitle: string
  solutions: string[]
  contactTitle: string
  contactSub: string
  contactBtn: string
  allRightsReserved: string
}

export interface DemoModalTranslations {
  personalizedWalkthrough: string
  title: string
  subtitle: string
  confirmedTitle: string
  confirmedMessage: string
  stepContact: string
  stepScale: string
  fullNameLabel: string
  fullNamePlaceholder: string
  phoneLabel: string
  phonePlaceholder: string
  centerNameLabel: string
  centerNamePlaceholder: string
  nextCapacityBtn: string
  studentsDropdownLabel: string
  studentsSearchPlaceholder: string
  preferredTimeLabel: string
  timeOptions: string[]
  backBtn: string
  confirmBtn: string
  studentsOptions: DropdownOption<string>[]
}

export interface LanguageTranslationBundle {
  nav: NavTranslations
  hero: HeroTranslations
  comparison: ComparisonTranslations
  features: FeatureModulesTranslations
  tour: TourTranslations
  team: TeamTranslations
  faq: FaqTranslations
  cta: CtaTranslations
  footer: FooterTranslations
  demoModal: DemoModalTranslations
}

// Ism, rol va havolalar tilga bog'liq emas — uch tilda bitta ro'yxat,
// aks holda ru/en eskirib qoladi (oldin shunday bo'lgan edi).
const TEAM_MEMBERS: TeamMember[] = [
  {
    id: '1',
    name: 'Nurulloh Islomov',
    role: 'Co-Founder & Backend Engineer',
    image: '/Nurulloh.png',
    github: 'https://github.com/nurulloh-coder-dev',
    linkedin: 'https://www.linkedin.com/in/nurilloh-islomov-9b4a43386',
  },
  {
    id: '2',
    name: 'Diyor Khasanov',
    role: 'Co-Founder & Frontend Engineer',
    image: '/Diyor.png',
    github: 'https://github.com/Diyor-Khasanov-dev',
    linkedin: 'https://linkedin.com/in/diyor-khasanov',
  },
  {
    id: '3',
    name: 'Abdulmajid Sharipov',
    role: 'Co-Founder & Frontend Engineer',
    image: '/Abdulmajid.png',
    github: 'https://github.com/Abdulmajidkhan007',
    linkedin: 'https://linkedin.com/in/abdulmajid-sharipov-profile',
  },
  {
    id: '4',
    name: 'Muhammadali Yoqubjonov',
    role: 'Co-Founder & Backend Engineer',
    image:
      '/Muhammadali.png',
    github: 'https://github.com/goodman113',
    linkedin: 'https://www.linkedin.com/in/muhammadali-yokubjonov-2241972b6/',
  },
  {
    id: '5',
    name: 'Oybek Abdullayev',
    role: 'Co-Founder & Frontend Engineer',
    image:
      '/Oybek.png',
    github: 'https://github.com/powerful10',
    linkedin: 'https://linkedin.com/in/oybek-abdullayev-720a41401',
  },
]

export const TRANSLATIONS: Record<Language, LanguageTranslationBundle> = {
  uz: {
    nav: {
      whyUs: 'Nega biz',
      modules: 'Modullar',
      tour: 'Platforma',
      team: 'Jamoa',
      faq: 'KOP',
      login: 'Kirish',
      bookDemo: 'Bepul demo',
    },
    team: {
      badge: 'Kompaniya asoschilari',
      heading: 'A.L.I.A ortida turgan jamoa',
      subheading:
        "Ta'lim sohasini avtomatlashtirish va innovatsiyalarni joriy etishga bel bog'lagan mutaxassislarimiz bilan tanishing.",
      members: TEAM_MEMBERS,
    },
    hero: {
      badge: "O'quv markazlari uchun boshqaruv tizimi",
      titlePart1: "O'quv markazingizni",
      titleHighlight: "bitta tizimda",
      titlePart2: "boshqaring.",
      description: "Lidlar, o'quvchilar, guruhlar, davomat va to'lovlar — barchasi bir joyda. Markaz egasi, administrator, o'qituvchi va o'quvchi uchun alohida panellar.",
      bookDemoBtn: "Bepul demo olish",
      watchTourBtn: "Imkoniyatlarni ko'rish",
      trustTrial: "O'zbek, rus va ingliz tillarida",
      trustSetup: "Telefonda ham qulay",
      trustMigration: "Bepul jonli demo",
      dashboardTitle: "alia.uz/app",
      liveSystem: "Namuna",
      activeStudents: "Faol o'quvchilar",
      thisMonth: "+12 bu oy",
      monthlyTuition: "Oylik tushum",
      collected: "hisob-fakturalar bo'yicha",
      newLeads: "Yangi lidlar",
      readyToEnroll: "5 tasiga bugun qo'ng'iroq",
      attendanceToday: "Bugungi davomat",
      qrActive: "o'qituvchilar belgilagan",
      revenueChartTitle: "Oylik tushum",
      revenueChartSub: "oxirgi 6 oy",
      chartCurrent: "Hozir",
      liveStreamTitle: "So'nggi voqealar",
      tuitionPaid: "To'lov qabul qilindi",
      qrCheckin: "Davomat belgilandi",
      newLeadIg: "Formadan yangi lid",
    },
    comparison: {
      badge: "Excel va Telegram tartibsizligiga chek qo'ying",
      heading: "Eski usulda boshqarish sizga qanchaga tushyapti?",
      subheading: "Qog'ozlar va tarqoq chatlar orqali boshqarish yo'qolgan lidlarga, kuzatilmagan qarzlarga va charchagan administratorlarga olib keladi.",
      oldWayTitle: "Eski usul (Excel, qog'oz va chatlar)",
      oldWayTag: "Yo'qotish xavfi",
      newWayTitle: "A.L.I.A bilan",
      newWayTag: "Bitta tizimda",
      items: [
        {
          category: "Lidlar",
          oldWay: "Telegram va Excel'da yo'qolib ketadigan murojaatlar, kimga qachon qo'ng'iroq qilish esdan chiqadi.",
          newWay: "Kanban doska, havola orqali avtomatik tushadigan lidlar va qo'ng'iroq vaqtini belgilash.",
        },
        {
          category: "Davomat",
          oldWay: "Qog'oz jurnal yoki kechikib kiritiladigan ma'lumot, oy oxirida hisoblash qiyin.",
          newWay: "O'qituvchi darsda bir necha bosishda belgilaydi — oylik jadval va Excel tayyor.",
        },
        {
          category: "To'lovlar",
          oldWay: "Naqd pul hisobidagi xatolar, kim qancha qarzdorligi noma'lum.",
          newWay: "Oylik hisob-fakturalar, to'lov va qaytarish tarixi, har bir o'quvchining balansi.",
        },
        {
          category: "Filiallar va xodimlar",
          oldWay: "Har filialda alohida jadval, kim nimaga kira olishi aniq emas.",
          newWay: "Barcha filiallar bitta tizimda, administratorga faqat kerakli bo'limlarga ruxsat.",
        },
      ],
    },
    features: {
      badge: "Imkoniyatlar",
      heading: "Markazingiz kundalik ishi uchun kerakli hamma narsa",
      subheading: "Markaz egasi, administrator, o'qituvchi va o'quvchi uchun — har biriga o'z paneli.",
      filterLabel: "Modullarni rol bo'yicha filtrlash",
      requestDemo: "Shu modulni demoda ko'rish",
      roleFilterOptions: [
        {
          value: "all",
          label: "Barcha modullar",
          description: "Platformaning barcha imkoniyatlari",
          icon: Filter,
        },
        {
          value: "admin",
          label: "Ega va administrator",
          description: "Statistika, to'lovlar va ruxsatlar",
          icon: Building2,
        },
        {
          value: "sales",
          label: "Lidlar",
          description: "Kanban va avtomatik lid",
          icon: PhoneCall,
        },
        {
          value: "teacher",
          label: "O'qituvchilar",
          description: "Davomat va guruhlar",
          icon: ClipboardCheck,
        },
      ],
      modules: [
        {
          id: "crm",
          role: "sales",
          title: "Lidlar CRM va kanban",
          tagline: "Murojaatni o'quvchiga aylantiring",
          description: "Lidlar holat bo'yicha kanban doskada. Instagram va Telegram'dagi havola orqali kelgan so'rovlar avtomatik tushadi.",
          badge: "Avtomatik lid",
          icon: PhoneCall,
          color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
          highlights: ["Kanban doska, sudrab o'tkazish", "Havola orqali avtomatik lid", "Qo'ng'iroq vaqtini belgilash", "Lidni bir bosishda guruhga yozish"],
        },
        {
          id: "student-mgmt",
          role: "admin",
          title: "O'quvchilar, guruhlar va darslar",
          tagline: "Markaz tuzilmasi bir joyda",
          description: "O'quvchilar, o'qituvchilar, guruhlar, dars jadvali va kurs darajalari — barchasi bitta panelda.",
          badge: "Tartibli ma'lumot",
          icon: GraduationCap,
          color: "from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-400",
          highlights: ["Guruh jadvali va darslar", "Kurs darajalari va oylik to'lov", "O'quvchini guruhga biriktirish", "Telefon bo'yicha tez qidiruv"],
        },
        {
          id: "attendance",
          role: "teacher",
          title: "Davomat",
          tagline: "O'qituvchi darsda belgilaydi",
          description: "O'qituvchi darsni boshlaydi va davomatni bir necha bosishda belgilaydi. O'quvchi o'z davomatini kabinetida ko'radi.",
          badge: "Bir necha bosishda",
          icon: ClipboardCheck,
          color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
          highlights: ["Keldi, kelmadi, sababli", "Oylik davomat jadvali", "Excel'ga yuklash va chop etish", "O'quvchi kabinetida ko'rinadi"],
        },
        {
          id: "finance",
          role: "admin",
          title: "Hisob-faktura va to'lovlar",
          tagline: "Kim qancha to'lagani aniq",
          description: "Oylik hisob-fakturalar, to'lovni qabul qilish va pulni qaytarish — har bir o'quvchining balansi bilan.",
          badge: "Shaffof moliya",
          icon: CreditCard,
          color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
          highlights: ["Oylik hisob-fakturalar", "To'lov qabul qilish va qaytarish", "Chek chop etish", "O'quvchi balansi va qarzdorlik"],
        },
        {
          id: "analytics",
          role: "admin",
          title: "Statistika va filiallar",
          tagline: "Markaz egasi uchun umumiy ko'rinish",
          description: "Oylik tushum grafigi, lidlar holati, so'nggi to'lovlar va filiallar — bitta dashboardda.",
          badge: "Egasi uchun",
          icon: BarChart3,
          color: "from-indigo-500/20 to-sky-500/20 border-indigo-500/30 text-indigo-400",
          highlights: ["Oylik tushum grafigi", "Lidlar holati", "So'nggi to'lovlar", "Bir nechta filial"],
        },
        {
          id: "roles",
          role: "admin",
          title: "Rollar va xavfsizlik",
          tagline: "Har kim faqat o'z ishini ko'radi",
          description: "Markaz egasi, administrator, o'qituvchi va o'quvchi — har biri o'z panelida. Administratorga faqat kerakli bo'limlarga ruxsat beriladi.",
          badge: "Ruxsatlar",
          icon: ShieldCheck,
          color: "from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-400",
          highlights: ["To'rt xil panel", "Bo'limlar bo'yicha ruxsat", "O'zbek, rus va ingliz tili", "Yorug' va qorong'i rejim"],
        },
      ],
    },
    tour: {
      badge: "Platforma ichidan",
      heading: "Tizim qanday ishlashini ko'ring",
      subheading: "Bo'limlarni bosib, har biri qanday ishlashini ko'ring.",
      seeDemoBtn: "Jonli demoga yozilish",
      liveInterface: "Interfeys",
      synced: "Bitta tizimda",
      mock: {
        leadColumns: ["Yangi", "Keyinroq qo'ng'iroq", "Qabul qilingan"],
        callToday: "Qo'ng'iroq: bugun 15:00",
        groupLabel: "Guruh",
        lessonTitle: "IELTS 4 — bugungi dars",
        present: "Keldi",
        absent: "Kelmadi",
        excused: "Sababli",
        markedNote: "O'qituvchi belgiladi — oylik jadvalga darhol tushdi",
        invoicesTitle: "Hisoblar — oktabr",
        paid: "To'langan",
        pending: "Kutilmoqda",
        overdue: "Muddati o'tgan",
        paymentsTitle: "To'lov harakatlari",
        monthlyFee: "Oylik to'lov",
        paidAction: "To'ladi",
        myAttendance: "Mening davomatim",
        attendanceSummary: "Shu oyda 12 darsdan 11 tasida qatnashdi.",
        myBalance: "Balansim",
        balanceHint: "Balans toza",
        myGroup: "Mening guruhim",
        teacherLabel: "O'qituvchi",
      },
      tabs: [
        {
          id: "crm",
          label: "Lidlar",
          title: "Murojaatlarni o'quvchiga aylantiring",
          desc: "Lidlar holat bo'yicha kanban doskada. Kerakli vaqtga qo'ng'iroqni belgilaysiz, lidni bir bosishda guruhga yozasiz.",
          metrics: [
            { label: "Holatlar", val: "4 ta", trend: "Kanban" },
            { label: "Lid manbai", val: "Havola", trend: "Instagram, Telegram" },
            { label: "Qo'ng'iroq", val: "Eslatma", trend: "Kun va soat" },
          ],
        },
        {
          id: "attendance",
          label: "Davomat",
          title: "Davomat bir necha bosishda",
          desc: "O'qituvchi darsni boshlaydi va har o'quvchini belgilaydi. Oylik jadval o'zi tuziladi.",
          metrics: [
            { label: "Belgilash", val: "3 holat", trend: "Keldi, kelmadi, sababli" },
            { label: "Jadval", val: "Oylik", trend: "Guruh bo'yicha" },
            { label: "Eksport", val: "Excel", trend: "Chop etish ham" },
          ],
        },
        {
          id: "payments",
          label: "To'lovlar",
          title: "Kim qancha to'lagani aniq",
          desc: "O'quvchini qidirasiz, hisob-fakturasi o'zi tanlanadi — summani yozib to'lovni qabul qilasiz. Qaytarish alohida, sababi bilan.",
          metrics: [
            { label: "Hisob-faktura", val: "Oylik", trend: "Guruh bo'yicha" },
            { label: "Qaytarish", val: "Sabab bilan", trend: "Alohida tugma" },
            { label: "Chek", val: "Chop etish", trend: "Har bir to'lovga" },
          ],
        },
        {
          id: "student",
          label: "O'quvchi kabineti",
          title: "O'quvchi o'z ma'lumotini o'zi ko'radi",
          desc: "O'quvchi telefonidan guruhi, o'qituvchisi, dars jadvali, davomati va balansini ko'radi.",
          metrics: [
            { label: "Balans", val: "Doim aniq", trend: "Qarz yoki avans" },
            { label: "Davomat", val: "Oyma-oy", trend: "3 oygacha" },
            { label: "Guruh", val: "Jadval", trend: "O'qituvchi bilan" },
          ],
        },
      ],
    },
    faq: {
      badge: "Savollaringiz bormi?",
      heading: "Ko'p beriladigan savollar",
      subheading: "A.L.I.A'ni markazingizga joriy etish haqida.",
      faqs: [
        {
          q: "Bir nechta filialni qo'llab-quvvatlaydimi?",
          a: "Ha. Barcha filiallar bitta tizimda: markaz egasi umumiy statistikani ko'radi, administratorlar va o'quvchilar filialga biriktiriladi.",
        },
        {
          q: "Lidlar Instagram'dan qanday tushadi?",
          a: "Administrator tizimda markaz uchun maxsus havola yaratadi va uni Instagram bio'siga yoki Telegram'ga qo'yadi. Mijoz formani to'ldiradi — lid avtomatik \"Yangi\" bo'lib tushadi.",
        },
        {
          q: "O'qituvchi va o'quvchi tizimga kira oladimi?",
          a: "Ha. O'qituvchi o'z guruhlari va davomatini, o'quvchi esa guruhi, davomati va balansini o'z kabinetida ko'radi.",
        },
        {
          q: "Mavjud ma'lumotlarni qanday kiritamiz?",
          a: "O'quvchilar, guruhlar va o'qituvchilar tizimga kiritiladi; demo paytida ma'lumotlaringiz hajmiga qarab eng qulay yo'lini birga kelishib olamiz.",
        },
        {
          q: "Ma'lumotlarimiz xavfsizmi?",
          a: "Har bir markaz ma'lumoti alohida saqlanadi, aloqa shifrlangan (HTTPS), har bir xodim faqat ruxsat berilgan bo'limlarni ko'radi.",
        },
        {
          q: "Sotib olishdan oldin ko'rsa bo'ladimi?",
          a: "Ha — bepul jonli demo: jamoamiz tizimni sizning markazingiz misolida ko'rsatadi.",
        },
      ],
    },
    cta: {
      heading: "O'quv markazingiz boshqaruvini tartibga keltirishga tayyormisiz?",
      subheading: "Jonli demoni ko'ring — tizimni sizning markazingiz misolida ko'rsatamiz.",
      bookDemoBtn: "Jonli demo belgilash",
      freeTrialBtn: "Imkoniyatlarni ko'rish",
      guaranteeText: "Bepul • Majburiyatsiz • O'zbek, rus va ingliz tillarida",
    },
    footer: {
      brandDesc:
        "O'quv markazlari uchun CRM: lidlar, talabalar, guruhlar, davomat va to'lovlar bitta tizimda.",
      security: "Har bir markaz ma'lumoti alohida • HTTPS",
      modulesTitle: 'Modullar',
      solutionsTitle: 'Yechimlar',
      solutions: [
        'Til markazlari',
        'IT va Dasturlash akademiyalari',
        'IELTS va Imtihonga tayyorlov',
        'Ko‘p filialli franchayzalar',
        'Bolalar va STEM maktablari',
      ],
      contactTitle: 'Bog‘lanish',
      contactSub: "Savollaringiz bormi?",
      contactBtn: "Demo so'rash",
      allRightsReserved: 'Barcha huquqlar himoyalangan.',
    },
    demoModal: {
      personalizedWalkthrough: 'Shaxsiy 1-ga-1 tushuntirish',
      title: 'Markazingiz uchun jonli demo buyurtma qiling',
      subtitle:
        'A.L.I.A markazingiz ish jarayoniga va filiallar tuzilmasiga qanday mos kelishini ko‘ring.',
      confirmedTitle: 'Demo so‘rovingiz tasdiqlandi!',
      confirmedMessage: "Rahmat! Jamoamiz tez orada siz bilan bog'lanib, demo vaqtini kelishib oladi.",
      stepContact: 'Aloqa ma’lumotlari',
      stepScale: 'Markaz hajmi',
      fullNameLabel: 'Ism va familiyangiz',
      fullNamePlaceholder: 'Masalan: Akmal Umarov',
      phoneLabel: 'Telefon / WhatsApp raqamingiz',
      phonePlaceholder: '+998 90 123 45 67',
      centerNameLabel: 'O‘quv markazingiz nomi',
      centerNamePlaceholder: 'Masalan: Cambridge Education Hub',
      nextCapacityBtn: 'Keyingisi: O‘quvchilar sig‘imini tanlash',
      studentsDropdownLabel: 'Faol o‘quvchilar soni',
      studentsSearchPlaceholder: 'Sig‘im bo‘yicha qidirish...',
      preferredTimeLabel: 'Demo qo‘ng‘irog‘i uchun qulay vaqt',
      timeOptions: [
        'Ertalab (9:00 - 12:00)',
        'Tushdan keyin (12:00 - 17:00)',
        'Kechqurun (17:00 - 20:00)',
        'Bugun istalgan vaqtda',
      ],
      backBtn: 'Orqaga',
      confirmBtn: 'Tasdiqlash va Demoga yozilish',
      studentsOptions: [
        {
          value: 'Under 100',
          label: '100 tagacha o‘quvchi',
          description: 'Kichik filial / studiya',
          icon: Users,
        },
        {
          value: '100-300',
          label: '100 - 300 ta o‘quvchi',
          description: 'Rivojlanayotgan akademiya / 1-2 filial',
          icon: Users,
          badge: 'Ommabop',
        },
        {
          value: '300-800',
          label: '300 - 800 ta o‘quvchi',
          description: 'Yirik ko‘p filialli markaz',
          icon: Users,
        },
        {
          value: '800+',
          label: '800+ ta o‘quvchi (Franchayzi)',
          description: 'Katta tarmoq va franchayzing',
          icon: Building2,
          badge: 'Enterprise',
        },
      ],
    },
  },
  ru: {
    nav: {
      whyUs: 'Почему мы',
      modules: 'Модули',
      tour: 'Обзор',
      team: 'Команда',
      faq: 'FAQ',
      login: 'Войти',
      bookDemo: 'Бесплатное демо',
    },
    team: {
      badge: 'Основатели компании',
      heading: 'Команда, стоящая за A.L.I.A',
      subheading:
        'Познакомьтесь с экспертами, которые создают инновации и автоматизируют процессы для образовательных центров.',
      members: TEAM_MEMBERS,
    },
    hero: {
      badge: "Система управления для учебных центров",
      titlePart1: "Управляйте учебным центром",
      titleHighlight: "в одной системе",
      titlePart2: "",
      description: "Лиды, ученики, группы, посещаемость и платежи — всё в одном месте. Отдельные панели для владельца, администратора, преподавателя и ученика.",
      bookDemoBtn: "Получить бесплатное демо",
      watchTourBtn: "Посмотреть возможности",
      trustTrial: "На узбекском, русском и английском",
      trustSetup: "Удобно и с телефона",
      trustMigration: "Бесплатное живое демо",
      dashboardTitle: "alia.uz/app",
      liveSystem: "Пример",
      activeStudents: "Активные ученики",
      thisMonth: "+12 за месяц",
      monthlyTuition: "Доход за месяц",
      collected: "по счетам",
      newLeads: "Новые лиды",
      readyToEnroll: "5 нужно позвонить сегодня",
      attendanceToday: "Посещаемость сегодня",
      qrActive: "отметили преподаватели",
      revenueChartTitle: "Доход по месяцам",
      revenueChartSub: "последние 6 месяцев",
      chartCurrent: "Сейчас",
      liveStreamTitle: "Последние события",
      tuitionPaid: "Платёж принят",
      qrCheckin: "Посещаемость отмечена",
      newLeadIg: "Новый лид из формы",
    },
    comparison: {
      badge: "Хватит хаоса в Excel и Telegram",
      heading: "Во что обходится управление по-старому?",
      subheading: "Бумаги и разрозненные чаты приводят к потерянным лидам, неотслеженным долгам и уставшим администраторам.",
      oldWayTitle: "По-старому (Excel, бумага и чаты)",
      oldWayTag: "Риск потерь",
      newWayTitle: "С A.L.I.A",
      newWayTag: "В одной системе",
      items: [
        {
          category: "Лиды",
          oldWay: "Обращения теряются в Telegram и Excel, забывают, кому и когда перезвонить.",
          newWay: "Канбан-доска, лиды автоматически приходят по ссылке, время звонка можно запланировать.",
        },
        {
          category: "Посещаемость",
          oldWay: "Бумажный журнал или запоздалый ввод, в конце месяца трудно посчитать.",
          newWay: "Преподаватель отмечает на уроке в пару нажатий — месячная таблица и Excel готовы.",
        },
        {
          category: "Платежи",
          oldWay: "Ошибки в учёте наличных, неясно, кто сколько должен.",
          newWay: "Ежемесячные счета, история оплат и возвратов, баланс каждого ученика.",
        },
        {
          category: "Филиалы и сотрудники",
          oldWay: "В каждом филиале своя таблица, непонятно, у кого какой доступ.",
          newWay: "Все филиалы в одной системе, администратору — доступ только к нужным разделам.",
        },
      ],
    },
    features: {
      badge: "Возможности",
      heading: "Всё, что нужно для ежедневной работы центра",
      subheading: "Для владельца, администратора, преподавателя и ученика — у каждого своя панель.",
      filterLabel: "Фильтр модулей по роли",
      requestDemo: "Посмотреть модуль на демо",
      roleFilterOptions: [
        {
          value: "all",
          label: "Все модули",
          description: "Все возможности платформы",
          icon: Filter,
        },
        {
          value: "admin",
          label: "Владелец и администратор",
          description: "Статистика, платежи и права",
          icon: Building2,
        },
        {
          value: "sales",
          label: "Лиды",
          description: "Канбан и автоматические лиды",
          icon: PhoneCall,
        },
        {
          value: "teacher",
          label: "Преподаватели",
          description: "Посещаемость и группы",
          icon: ClipboardCheck,
        },
      ],
      modules: [
        {
          id: "crm",
          role: "sales",
          title: "Лиды: CRM и канбан",
          tagline: "Превращайте обращения в учеников",
          description: "Лиды на канбан-доске по статусам. Заявки по ссылке из Instagram и Telegram приходят автоматически.",
          badge: "Автоматические лиды",
          icon: PhoneCall,
          color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
          highlights: ["Канбан, перетаскивание", "Автоматические лиды по ссылке", "Планирование звонка", "Запись лида в группу в один клик"],
        },
        {
          id: "student-mgmt",
          role: "admin",
          title: "Ученики, группы и уроки",
          tagline: "Структура центра в одном месте",
          description: "Ученики, преподаватели, группы, расписание и уровни курсов — всё в одной панели.",
          badge: "Порядок в данных",
          icon: GraduationCap,
          color: "from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-400",
          highlights: ["Расписание групп и уроки", "Уровни курсов и оплата за месяц", "Запись ученика в группу", "Быстрый поиск по телефону"],
        },
        {
          id: "attendance",
          role: "teacher",
          title: "Посещаемость",
          tagline: "Преподаватель отмечает на уроке",
          description: "Преподаватель начинает урок и отмечает посещаемость в пару нажатий. Ученик видит её в своём кабинете.",
          badge: "В пару нажатий",
          icon: ClipboardCheck,
          color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
          highlights: ["Был, не был, уважительная причина", "Таблица за месяц", "Выгрузка в Excel и печать", "Видна в кабинете ученика"],
        },
        {
          id: "finance",
          role: "admin",
          title: "Счета и платежи",
          tagline: "Ясно, кто сколько заплатил",
          description: "Ежемесячные счета, приём оплаты и возвраты — с балансом каждого ученика.",
          badge: "Прозрачные финансы",
          icon: CreditCard,
          color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
          highlights: ["Ежемесячные счета", "Приём оплаты и возвраты", "Печать чека", "Баланс и долги учеников"],
        },
        {
          id: "analytics",
          role: "admin",
          title: "Статистика и филиалы",
          tagline: "Общая картина для владельца",
          description: "График дохода по месяцам, статусы лидов, последние платежи и филиалы — на одном дашборде.",
          badge: "Для владельца",
          icon: BarChart3,
          color: "from-indigo-500/20 to-sky-500/20 border-indigo-500/30 text-indigo-400",
          highlights: ["График дохода по месяцам", "Статусы лидов", "Последние платежи", "Несколько филиалов"],
        },
        {
          id: "roles",
          role: "admin",
          title: "Роли и безопасность",
          tagline: "Каждый видит только своё",
          description: "Владелец, администратор, преподаватель и ученик — у каждого своя панель. Администратору дают доступ только к нужным разделам.",
          badge: "Права доступа",
          icon: ShieldCheck,
          color: "from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-400",
          highlights: ["Четыре панели", "Права по разделам", "Узбекский, русский и английский", "Светлая и тёмная тема"],
        },
      ],
    },
    tour: {
      badge: "Изнутри платформы",
      heading: "Посмотрите, как работает система",
      subheading: "Нажимайте на разделы, чтобы увидеть, как работает каждый.",
      seeDemoBtn: "Записаться на живое демо",
      liveInterface: "Интерфейс",
      synced: "В одной системе",
      mock: {
        leadColumns: ["Новый", "Перезвонить", "Зачислен"],
        callToday: "Звонок: сегодня 15:00",
        groupLabel: "Группа",
        lessonTitle: "IELTS 4 — урок сегодня",
        present: "Был",
        absent: "Не был",
        excused: "Уважительная",
        markedNote: "Отметил преподаватель — сразу в месячной таблице",
        invoicesTitle: "Счета — октябрь",
        paid: "Оплачен",
        pending: "Ожидается",
        overdue: "Просрочен",
        paymentsTitle: "Движение платежей",
        monthlyFee: "Ежемесячная оплата",
        paidAction: "Оплатил",
        myAttendance: "Моя посещаемость",
        attendanceSummary: "В этом месяце посетил 11 из 12 уроков.",
        myBalance: "Мой баланс",
        balanceHint: "Долгов нет",
        myGroup: "Моя группа",
        teacherLabel: "Преподаватель",
      },
      tabs: [
        {
          id: "crm",
          label: "Лиды",
          title: "Превращайте обращения в учеников",
          desc: "Лиды на канбан-доске по статусам. Планируйте звонок на нужное время и записывайте лида в группу в один клик.",
          metrics: [
            { label: "Статусы", val: "4", trend: "Канбан" },
            { label: "Источник", val: "Ссылка", trend: "Instagram, Telegram" },
            { label: "Звонок", val: "Напоминание", trend: "День и время" },
          ],
        },
        {
          id: "attendance",
          label: "Посещаемость",
          title: "Посещаемость в пару нажатий",
          desc: "Преподаватель начинает урок и отмечает каждого ученика. Таблица за месяц собирается сама.",
          metrics: [
            { label: "Отметка", val: "3 статуса", trend: "Был, не был, уважительно" },
            { label: "Таблица", val: "За месяц", trend: "По группе" },
            { label: "Экспорт", val: "Excel", trend: "И печать" },
          ],
        },
        {
          id: "payments",
          label: "Платежи",
          title: "Ясно, кто сколько заплатил",
          desc: "Найдите ученика — счёт выберется сам, введите сумму и примите оплату. Возврат — отдельно, с причиной.",
          metrics: [
            { label: "Счёт", val: "Ежемесячно", trend: "По группе" },
            { label: "Возврат", val: "С причиной", trend: "Отдельная кнопка" },
            { label: "Чек", val: "Печать", trend: "К каждому платежу" },
          ],
        },
        {
          id: "student",
          label: "Кабинет ученика",
          title: "Ученик сам видит свои данные",
          desc: "С телефона ученик видит группу, преподавателя, расписание, посещаемость и баланс.",
          metrics: [
            { label: "Баланс", val: "Всегда точно", trend: "Долг или аванс" },
            { label: "Посещаемость", val: "По месяцам", trend: "До 3 месяцев" },
            { label: "Группа", val: "Расписание", trend: "С преподавателем" },
          ],
        },
      ],
    },
    faq: {
      badge: "Есть вопросы?",
      heading: "Частые вопросы",
      subheading: "О внедрении A.L.I.A в вашем центре.",
      faqs: [
        {
          q: "Поддерживается ли несколько филиалов?",
          a: "Да. Все филиалы в одной системе: владелец видит общую статистику, администраторы и ученики привязываются к филиалу.",
        },
        {
          q: "Как лиды приходят из Instagram?",
          a: "Администратор создаёт в системе специальную ссылку центра и ставит её в профиль Instagram или в Telegram. Клиент заполняет форму — лид автоматически появляется как «Новый».",
        },
        {
          q: "Могут ли преподаватель и ученик входить в систему?",
          a: "Да. Преподаватель видит свои группы и посещаемость, ученик — группу, посещаемость и баланс в своём кабинете.",
        },
        {
          q: "Как внести существующие данные?",
          a: "Ученики, группы и преподаватели вносятся в систему; на демо мы вместе выберем самый удобный способ под объём ваших данных.",
        },
        {
          q: "Безопасны ли наши данные?",
          a: "Данные каждого центра хранятся отдельно, соединение шифруется (HTTPS), каждый сотрудник видит только разрешённые разделы.",
        },
        {
          q: "Можно ли посмотреть до покупки?",
          a: "Да — бесплатное живое демо: команда покажет систему на примере вашего центра.",
        },
      ],
    },
    cta: {
      heading: "Готовы навести порядок в управлении центром?",
      subheading: "Посмотрите живое демо — покажем систему на примере вашего центра.",
      bookDemoBtn: "Записаться на демо",
      freeTrialBtn: "Посмотреть возможности",
      guaranteeText: "Бесплатно • Без обязательств • На узбекском, русском и английском",
    },
    footer: {
      brandDesc:
        'CRM для учебных центров: лиды, ученики, группы, посещаемость и платежи в одной системе.',
      security: "Данные каждого центра отдельно • HTTPS",
      modulesTitle: 'Модули',
      solutionsTitle: 'Решения для',
      solutions: [
        'Языковых центров',
        'IT и кодинг академий',
        'IELTS и подготовки к тестам',
        'Сетей и франшиз',
        'Детских и STEM школ',
      ],
      contactTitle: 'Контакты',
      contactSub: "Есть вопросы?",
      contactBtn: "Запросить демо",
      allRightsReserved: 'Все права защищены.',
    },
    demoModal: {
      personalizedWalkthrough: 'Персональная 1-на-1 презентация',
      title: 'Закажите демонстрацию для вашего центра',
      subtitle: 'Узнайте, как A.L.I.A адаптируется под ваши процессы и структуру филиалов.',
      confirmedTitle: 'Заявка на демо подтверждена!',
      confirmedMessage: "Спасибо! Наша команда скоро свяжется с вами и согласует время демо.",
      stepContact: 'Контакты',
      stepScale: 'Масштаб центра',
      fullNameLabel: 'Ваше имя и фамилия',
      fullNamePlaceholder: 'Например: Акмаль Умаров',
      phoneLabel: 'Телефон / WhatsApp',
      phonePlaceholder: '+998 90 123 45 67',
      centerNameLabel: 'Название учебного центра',
      centerNamePlaceholder: 'Например: Cambridge Education Hub',
      nextCapacityBtn: 'Далее: Выбрать количество учеников',
      studentsDropdownLabel: 'Количество активных учеников',
      studentsSearchPlaceholder: 'Поиск по количеству...',
      preferredTimeLabel: 'Удобное время для демо-звонка',
      timeOptions: [
        'Утром (9:00 - 12:00)',
        'Днем (12:00 - 17:00)',
        'Вечером (17:00 - 20:00)',
        'В любое время сегодня',
      ],
      backBtn: 'Назад',
      confirmBtn: 'Подтвердить и забронировать демо',
      studentsOptions: [
        {
          value: 'Under 100',
          label: 'До 100 учеников',
          description: 'Небольшой филиал / студия',
          icon: Users,
        },
        {
          value: '100-300',
          label: '100 - 300 учеников',
          description: 'Растущая академия / 1-2 филиала',
          icon: Users,
          badge: 'Популярно',
        },
        {
          value: '300-800',
          label: '300 - 800 учеников',
          description: 'Крупный многофилиальный центр',
          icon: Users,
        },
        {
          value: '800+',
          label: '800+ учеников (Франшиза)',
          description: 'Крупная сеть и франчайзинг',
          icon: Building2,
          badge: 'Enterprise',
        },
      ],
    },
  },
  en: {
    nav: {
      whyUs: 'Why Us',
      modules: 'Modules',
      tour: 'Tour',
      team: 'Team',
      faq: 'FAQ',
      login: 'Log In',
      bookDemo: 'Free Demo',
    },
    team: {
      badge: 'Startup Founders & Leadership',
      heading: 'Meet the Team Behind A.L.I.A',
      subheading:
        'Passionate innovators, engineers, and education leaders building the future of learning center operations.',
      members: TEAM_MEMBERS,
    },
    hero: {
      badge: "Management system for learning centers",
      titlePart1: "Run your learning center",
      titleHighlight: "in one system",
      titlePart2: "",
      description: "Leads, students, groups, attendance and payments — all in one place. Separate panels for the owner, administrator, teacher and student.",
      bookDemoBtn: "Get a free demo",
      watchTourBtn: "See the features",
      trustTrial: "In Uzbek, Russian and English",
      trustSetup: "Works great on phones",
      trustMigration: "Free live demo",
      dashboardTitle: "alia.uz/app",
      liveSystem: "Sample",
      activeStudents: "Active students",
      thisMonth: "+12 this month",
      monthlyTuition: "Monthly revenue",
      collected: "from invoices",
      newLeads: "New leads",
      readyToEnroll: "5 to call back today",
      attendanceToday: "Attendance today",
      qrActive: "marked by teachers",
      revenueChartTitle: "Monthly revenue",
      revenueChartSub: "last 6 months",
      chartCurrent: "Now",
      liveStreamTitle: "Recent activity",
      tuitionPaid: "Payment received",
      qrCheckin: "Attendance marked",
      newLeadIg: "New lead from the form",
    },
    comparison: {
      badge: "Stop the Excel and Telegram chaos",
      heading: "What is the old way costing you?",
      subheading: "Paper and scattered chats lead to lost leads, untracked debts and exhausted administrators.",
      oldWayTitle: "The old way (Excel, paper and chats)",
      oldWayTag: "Risk of losses",
      newWayTitle: "With A.L.I.A",
      newWayTag: "In one system",
      items: [
        {
          category: "Leads",
          oldWay: "Enquiries get lost in Telegram and Excel; nobody remembers whom to call back and when.",
          newWay: "A kanban board, leads arriving automatically through a link, and scheduled call-backs.",
        },
        {
          category: "Attendance",
          oldWay: "Paper registers or late entries, hard to total at month end.",
          newWay: "Teachers mark it in a few taps during class — the monthly sheet and Excel are ready.",
        },
        {
          category: "Payments",
          oldWay: "Cash bookkeeping mistakes, unclear who owes what.",
          newWay: "Monthly invoices, payment and refund history, every student's balance.",
        },
        {
          category: "Branches and staff",
          oldWay: "A separate sheet per branch, unclear who can access what.",
          newWay: "All branches in one system, administrators see only the sections they are allowed to.",
        },
      ],
    },
    features: {
      badge: "Features",
      heading: "Everything your center needs day to day",
      subheading: "For the owner, administrator, teacher and student — each with their own panel.",
      filterLabel: "Filter modules by role",
      requestDemo: "See this module in a demo",
      roleFilterOptions: [
        {
          value: "all",
          label: "All modules",
          description: "Everything the platform does",
          icon: Filter,
        },
        {
          value: "admin",
          label: "Owner and admin",
          description: "Statistics, payments and permissions",
          icon: Building2,
        },
        {
          value: "sales",
          label: "Leads",
          description: "Kanban and automatic leads",
          icon: PhoneCall,
        },
        {
          value: "teacher",
          label: "Teachers",
          description: "Attendance and groups",
          icon: ClipboardCheck,
        },
      ],
      modules: [
        {
          id: "crm",
          role: "sales",
          title: "Leads: CRM and kanban",
          tagline: "Turn enquiries into students",
          description: "Leads on a kanban board by status. Requests through your Instagram and Telegram link arrive automatically.",
          badge: "Automatic leads",
          icon: PhoneCall,
          color: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
          highlights: ["Kanban with drag and drop", "Automatic leads via a link", "Scheduled call-backs", "Enroll a lead into a group in one click"],
        },
        {
          id: "student-mgmt",
          role: "admin",
          title: "Students, groups and lessons",
          tagline: "Your center's structure in one place",
          description: "Students, teachers, groups, schedules and course levels — all in one panel.",
          badge: "Organized data",
          icon: GraduationCap,
          color: "from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-400",
          highlights: ["Group schedules and lessons", "Course levels and monthly fee", "Assign students to groups", "Quick search by phone"],
        },
        {
          id: "attendance",
          role: "teacher",
          title: "Attendance",
          tagline: "Teachers mark it in class",
          description: "The teacher starts the lesson and marks attendance in a few taps. Students see it in their cabinet.",
          badge: "In a few taps",
          icon: ClipboardCheck,
          color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/30 text-emerald-400",
          highlights: ["Present, absent, excused", "Monthly attendance sheet", "Excel export and printing", "Visible in the student cabinet"],
        },
        {
          id: "finance",
          role: "admin",
          title: "Invoices and payments",
          tagline: "Always clear who paid what",
          description: "Monthly invoices, receiving payments and refunds — with every student's balance.",
          badge: "Transparent finances",
          icon: CreditCard,
          color: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
          highlights: ["Monthly invoices", "Payments and refunds", "Printable receipts", "Student balance and debts"],
        },
        {
          id: "analytics",
          role: "admin",
          title: "Statistics and branches",
          tagline: "The big picture for the owner",
          description: "Monthly revenue chart, lead statuses, recent payments and branches — on one dashboard.",
          badge: "For owners",
          icon: BarChart3,
          color: "from-indigo-500/20 to-sky-500/20 border-indigo-500/30 text-indigo-400",
          highlights: ["Monthly revenue chart", "Lead statuses", "Recent payments", "Multiple branches"],
        },
        {
          id: "roles",
          role: "admin",
          title: "Roles and security",
          tagline: "Everyone sees only their part",
          description: "Owner, administrator, teacher and student — each in their own panel. Administrators only get the sections they need.",
          badge: "Permissions",
          icon: ShieldCheck,
          color: "from-pink-500/20 to-rose-500/20 border-pink-500/30 text-pink-400",
          highlights: ["Four panels", "Per-section permissions", "Uzbek, Russian and English", "Light and dark mode"],
        },
      ],
    },
    tour: {
      badge: "Inside the platform",
      heading: "See how the system works",
      subheading: "Click through the sections to see how each one works.",
      seeDemoBtn: "Book a live demo",
      liveInterface: "Interface",
      synced: "In one system",
      mock: {
        leadColumns: ["New", "Call later", "Enrolled"],
        callToday: "Call: today 15:00",
        groupLabel: "Group",
        lessonTitle: "IELTS 4 — today's lesson",
        present: "Present",
        absent: "Absent",
        excused: "Excused",
        markedNote: "Marked by the teacher — already in the monthly sheet",
        invoicesTitle: "Invoices — October",
        paid: "Paid",
        pending: "Pending",
        overdue: "Overdue",
        paymentsTitle: "Payment history",
        monthlyFee: "Monthly fee",
        paidAction: "Paid",
        myAttendance: "My attendance",
        attendanceSummary: "Attended 11 of 12 lessons this month.",
        myBalance: "My balance",
        balanceHint: "No debt",
        myGroup: "My group",
        teacherLabel: "Teacher",
      },
      tabs: [
        {
          id: "crm",
          label: "Leads",
          title: "Turn enquiries into students",
          desc: "Leads on a kanban board by status. Schedule a call-back for the right time and enroll a lead into a group in one click.",
          metrics: [
            { label: "Statuses", val: "4", trend: "Kanban" },
            { label: "Lead source", val: "Link", trend: "Instagram, Telegram" },
            { label: "Call-back", val: "Reminder", trend: "Day and time" },
          ],
        },
        {
          id: "attendance",
          label: "Attendance",
          title: "Attendance in a few taps",
          desc: "The teacher starts the lesson and marks each student. The monthly sheet builds itself.",
          metrics: [
            { label: "Marking", val: "3 states", trend: "Present, absent, excused" },
            { label: "Sheet", val: "Monthly", trend: "Per group" },
            { label: "Export", val: "Excel", trend: "Printing too" },
          ],
        },
        {
          id: "payments",
          label: "Payments",
          title: "Always clear who paid what",
          desc: "Find the student — the invoice is picked for you; enter the amount and take the payment. Refunds are separate, with a reason.",
          metrics: [
            { label: "Invoice", val: "Monthly", trend: "Per group" },
            { label: "Refund", val: "With a reason", trend: "Separate button" },
            { label: "Receipt", val: "Print", trend: "For every payment" },
          ],
        },
        {
          id: "student",
          label: "Student cabinet",
          title: "Students see their own data",
          desc: "From their phone students see their group, teacher, schedule, attendance and balance.",
          metrics: [
            { label: "Balance", val: "Always exact", trend: "Debt or credit" },
            { label: "Attendance", val: "Month by month", trend: "Up to 3 months" },
            { label: "Group", val: "Schedule", trend: "With the teacher" },
          ],
        },
      ],
    },
    faq: {
      badge: "Got questions?",
      heading: "Frequently asked questions",
      subheading: "About bringing A.L.I.A to your center.",
      faqs: [
        {
          q: "Does it support multiple branches?",
          a: "Yes. All branches live in one system: the owner sees overall statistics, administrators and students belong to a branch.",
        },
        {
          q: "How do leads arrive from Instagram?",
          a: "The administrator creates a dedicated link for the center and puts it in the Instagram bio or on Telegram. The client fills in the form — the lead appears as \"New\" automatically.",
        },
        {
          q: "Can teachers and students sign in?",
          a: "Yes. Teachers see their groups and attendance; students see their group, attendance and balance in their own cabinet.",
        },
        {
          q: "How do we enter our existing data?",
          a: "Students, groups and teachers are entered into the system; during the demo we agree on the easiest way for your data volume.",
        },
        {
          q: "Is our data safe?",
          a: "Each center's data is stored separately, connections are encrypted (HTTPS), and every staff member sees only the sections they are allowed to.",
        },
        {
          q: "Can we see it before buying?",
          a: "Yes — a free live demo: our team shows the system using your center as the example.",
        },
      ],
    },
    cta: {
      heading: "Ready to bring order to your center?",
      subheading: "See a live demo — we will show the system using your center as the example.",
      bookDemoBtn: "Book a live demo",
      freeTrialBtn: "See the features",
      guaranteeText: "Free • No commitment • In Uzbek, Russian and English",
    },
    footer: {
      brandDesc:
        'A CRM for learning centers: leads, students, groups, attendance and payments in one system.',
      security: "Each center's data kept separate • HTTPS",
      modulesTitle: 'Modules',
      solutionsTitle: 'Solutions For',
      solutions: [
        'Language Centers',
        'IT & Coding Academies',
        'IELTS & Test Prep Studios',
        'Multi-Branch Franchises',
        'Kids & STEM Schools',
      ],
      contactTitle: 'Get in Touch',
      contactSub: "Have questions?",
      contactBtn: "Request a demo",
      allRightsReserved: 'All rights reserved.',
    },
    demoModal: {
      personalizedWalkthrough: 'Personalized 1-on-1 Walkthrough',
      title: 'Book a Live Demo for Your Center',
      subtitle: 'See how A.L.I.A fits your learning center’s exact workflow & branch structure.',
      confirmedTitle: 'Demo Request Confirmed!',
      confirmedMessage: "Thank you! Our team will contact you soon to agree on a demo time.",
      stepContact: 'Contact Info',
      stepScale: 'Center Scale',
      fullNameLabel: 'Your Full Name',
      fullNamePlaceholder: 'e.g., Akmal Umarov',
      phoneLabel: 'Phone / WhatsApp Number',
      phonePlaceholder: '+998 90 123 45 67',
      centerNameLabel: 'Learning Center Name',
      centerNamePlaceholder: 'e.g., Cambridge Education Hub',
      nextCapacityBtn: 'Next: Select Student Capacity',
      studentsDropdownLabel: 'Number of Active Students',
      studentsSearchPlaceholder: 'Filter student capacity...',
      preferredTimeLabel: 'Preferred Time for Demo Call',
      timeOptions: [
        'Morning (9:00 - 12:00)',
        'Afternoon (12:00 - 17:00)',
        'Evening (17:00 - 20:00)',
        'Anytime Today',
      ],
      backBtn: 'Back',
      confirmBtn: 'Confirm & Book Demo',
      studentsOptions: [
        {
          value: 'Under 100',
          label: 'Under 100 Students',
          description: 'Boutique single branch / studio',
          icon: Users,
        },
        {
          value: '100-300',
          label: '100 - 300 Students',
          description: 'Growing academy / 1-2 branches',
          icon: Users,
          badge: 'Popular',
        },
        {
          value: '300-800',
          label: '300 - 800 Students',
          description: 'Established multi-branch center',
          icon: Users,
        },
        {
          value: '800+',
          label: '800+ Students (Franchise)',
          description: 'Enterprise network & franchise',
          icon: Building2,
          badge: 'Enterprise',
        },
      ],
    },
  },
}
