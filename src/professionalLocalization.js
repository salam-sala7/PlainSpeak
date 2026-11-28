const roles = [
  [
    "Lawyer",
    "محامٍ",
    "עורך דין"
  ],
  [
    "Accounting graduate",
    "خريجة محاسبة",
    "בוגרת חשבונאות"
  ],
  [
    "Family physician",
    "طبيبة أسرة",
    "רופאת משפחה"
  ],
  [
    "Software engineering graduate",
    "خريج هندسة برمجيات",
    "בוגר הנדסת תוכנה"
  ],
  [
    "Human resources",
    "موارد بشرية",
    "משאבי אנוש"
  ],
  [
    "Civil engineer",
    "مهندس مدني",
    "מהנדס אזרחי"
  ],
  [
    "Economics graduate",
    "خريجة اقتصاد",
    "בוגרת כלכלה"
  ],
  [
    "Physiotherapist",
    "أخصائية علاج طبيعي",
    "פיזיותרפיסטית"
  ],
  [
    "Cybersecurity graduate",
    "خريج أمن سيبراني",
    "בוגר לימודי סייבר"
  ],
  [
    "Career adviser",
    "مستشارة مهنية",
    "יועצת קריירה"
  ],
  [
    "Electrical engineer",
    "مهندس كهرباء",
    "מהנדס חשמל"
  ],
  [
    "Contract lawyer",
    "محامي عقود",
    "עורך דין בתחום החוזים"
  ],
  [
    "Employment lawyer",
    "محامي عمل",
    "עורך דין לדיני עבודה"
  ],
  [
    "Family medicine physician",
    "طبيب طب الأسرة",
    "רופא משפחה"
  ],
  [
    "Dentist",
    "طبيب أسنان",
    "רופא שיניים"
  ],
  [
    "Accountant",
    "محاسب",
    "רואה חשבון"
  ],
  [
    "Tax accountant",
    "محاسب ضرائب",
    "רואה חשבון בתחום המס"
  ],
  [
    "Tenant and housing lawyer",
    "محامي سكن وإيجار",
    "עורך דין בתחום השכירות והדיור"
  ],
  [
    "Small business lawyer",
    "محامي أعمال صغيرة",
    "עורך דין לעסקים קטנים"
  ],
  [
    "Pediatrician",
    "طبيب أطفال",
    "רופא ילדים"
  ],
  [
    "Payroll accountant",
    "محاسب رواتب",
    "חשב שכר"
  ],
  [
    "Bookkeeper",
    "مسك الدفاتر المحاسبية",
    "מנהל חשבונות"
  ],
  [
    "Data privacy consultant",
    "مستشار خصوصية البيانات",
    "יועץ פרטיות מידע"
  ],
  [
    "Human resources consultant",
    "مستشار موارد بشرية",
    "יועץ משאבי אנוש"
  ],
  [
    "Housing adviser",
    "مستشار سكن",
    "יועץ דיור"
  ],
  [
    "Insurance claims adviser",
    "مستشار مطالبات تأمين",
    "יועץ תביעות ביטוח"
  ]
]
const normalize = value => String(value || '').trim().normalize('NFKC').toLowerCase().replace(/[\u064b-\u065f\u0670]/g, '')
const aliases = new Map(roles.flatMap(row => row.map(value => [normalize(value), row])))
export const specialtyOptions = roles.map(row => row[0])
export function localSpecialty(value, language) {
  const row = aliases.get(normalize(value))
  return row ? row[language === 'ar' ? 1 : language === 'he' ? 2 : 0] : (value || '')
}
export function experienceLabel(value, language) {
  if (value == null || value === '') return ''
  const n = Number(value)
  if (!Number.isInteger(n) || n < 0) return ''
  const count = new Intl.NumberFormat(language).format(n)
  if (language === 'ar') return n === 1 ? 'سنة خبرة واحدة' : n === 2 ? 'سنتان من الخبرة' : n >= 3 && n <= 10 ? `${count} سنوات خبرة` : `${count} سنة خبرة`
  if (language === 'he') return n === 1 ? 'שנת ניסיון אחת' : n === 2 ? 'שנתיים של ניסיון' : `${count} שנות ניסיון`
  return `${count} ${n === 1 ? 'year' : 'years'} of experience`
}
export const localDate = (value, language) => new Date(value).toLocaleString(language)
