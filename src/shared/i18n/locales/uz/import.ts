/**
 * Excel/CSV import bo'limi (o'quvchi va o'qituvchi).
 *
 * O'zbekcha — HAQIQAT MANBAI. Yangi kalit avval shu yerga qo'shiladi,
 * keyin `ru/` va `en/` dagi shu nomli faylga.
 */
export const importSection = {
    'import.button': 'Excel’dan import',
    'import.eyebrow': 'Import',
    'import.title.students': 'O‘quvchilarni import qilish',
    'import.title.teachers': 'O‘qituvchilarni import qilish',
    'import.step.file': '1. Fayl va filial',
    'import.fileHint':
        'Excel (.xlsx) yoki CSV fayl. Birinchi qator — ustun nomlari. Fayl serverga yuborilmaydi: u shu brauzerning o‘zida o‘qiladi.',
    'import.dropHere': 'Faylni shu yerga tashlang yoki bosib tanlang',
    'import.reading': 'Fayl o‘qilmoqda…',
    'import.fileInfo': '{{name}} — {{count}} ta qator',
    'import.otherFile': 'Boshqa fayl',
    'import.branchHint': 'Hamma qatorlar shu filialga qo‘shiladi.',
    'import.chooseBranch': 'Filialni tanlang',
    'import.step.mapping': '2. Ustunlarni moslash',
    'import.mappingHint':
        'Chapda — fayldagi ustun, o‘ngda — tizimdagi maydon. Dastur o‘zi topishga harakat qildi; noto‘g‘ri bo‘lsa, chapdan boshqasini tanlang.',
    'import.column': 'Fayldagi ustun',
    'import.field': 'Tizimdagi maydon',
    'import.notMapped': '— moslanmagan —',
    'import.required': 'majburiy',
    'import.requiredMissing': 'Majburiy maydonlarga ustun tanlang: {{fields}}',
    'import.step.preview': '3. Tekshirish',
    'import.summary.ready': 'Qo‘shishga tayyor: {{count}}',
    'import.summary.skipped': 'O‘tkazib yuboriladi: {{count}}',
    'import.summary.warnings': 'Ogohlantirish bilan: {{count}}',
    'import.previewHint': 'Birinchi {{count}} ta qator',
    'import.line': 'Qator',
    'import.status': 'Holat',
    'import.ok': 'tayyor',
    'import.problemsTitle': 'Muammoli qatorlar',
    'import.moreProblems': '… va yana {{count}} ta',
    'import.problem.missingFullName': 'ism yo‘q',
    'import.problem.missingPhone': 'telefon yo‘q',
    'import.problem.invalidPhone': 'telefon noto‘g‘ri',
    'import.problem.invalidBirthDate': 'tug‘ilgan sana tushunilmadi — bo‘sh qoldiriladi',
    'import.problem.invalidParentPhone': 'ota-ona telefoni noto‘g‘ri — bo‘sh qoldiriladi',
    'import.tooMany': 'Bir martada ko‘pi bilan {{max}} ta qator. Faylni bo‘laklarga bo‘ling.',
    'import.submit.students': '{{count}} ta o‘quvchini qo‘shish',
    'import.submit.teachers': '{{count}} ta o‘qituvchini qo‘shish',
    'import.submitting': 'Qo‘shilmoqda…',
    'import.error.unsupported': 'Bu fayl turi o‘qilmaydi. Excel’da .xlsx yoki .csv qilib saqlang.',
    'import.error.empty': 'Faylda ma’lumot topilmadi: birinchi qator — ustun nomlari, undan keyin kamida bitta qator bo‘lsin.',
    'import.error.unreadable': 'Faylni o‘qib bo‘lmadi. U buzilgan yoki parol bilan himoyalangan bo‘lishi mumkin.',
    'import.error.partial':
        'Server so‘rovni oxirigacha bajarmadi — ba’zi qatorlar saqlangan bo‘lishi mumkin. Ro‘yxatni tekshiring: faylni qayta yuklasangiz, saqlanganlari “telefon band” bo‘lib o‘tib ketadi.',
    'import.result.title': 'Natija',
    'import.result.created': 'Qo‘shildi: {{count}}',
    'import.result.failed': 'Qo‘shilmadi: {{count}}',
    'import.result.passwordsWarning':
        'Yangi parollar faqat hozir ko‘rinadi va boshqa hech qayerda saqlanmaydi. Sahifadan chiqishdan oldin yuklab oling.',
    'import.result.password': 'Parol',
    'import.result.existingAccount': 'mavjud akkaunt — paroli o‘zgarmadi',
    'import.result.downloadLogins': 'Loginlarni yuklab olish (CSV)',
    'import.result.again': 'Yana import',
    'import.result.backToList': 'Ro‘yxatga qaytish',
} as const

export type ImportKeys = keyof typeof importSection
