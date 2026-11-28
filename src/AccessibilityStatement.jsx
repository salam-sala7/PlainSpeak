import { useTranslation } from 'react-i18next'

const statements = {
  en: [
    'PlainSpeak aims to make its terms and community features accessible. The accessibility panel offers text resizing, high contrast, link underlining, and reduced motion.',
    'Selected text can be read aloud in browsers that support speech synthesis. Available languages and voices depend on your browser and device. Conformance with Israeli Standard 5568 at level AA has not been established.',
    'To report a barrier or request an accessible version of content, email us. If possible, include the page address and describe what you were trying to do.'
  ],
  ar: [
    'نسعى في PlainSpeak إلى تسهيل الوصول إلى المصطلحات وميزات المجتمع. تتيح لوحة إمكانية الوصول تكبير النص وزيادة التباين وتسطير الروابط وتقليل الحركة.',
    'يمكن قراءة النص المحدد بصوت عالٍ في المتصفحات التي تدعم تحويل النص إلى كلام. تعتمد اللغات والأصوات المتاحة على المتصفح والجهاز. لم يُتحقق من المطابقة الكاملة للمعيار الإسرائيلي 5568 بالمستوى AA.',
    'للإبلاغ عن عائق أو طلب نسخة يمكن الوصول إليها من المحتوى، راسلنا عبر البريد الإلكتروني. إن أمكن، أرفق عنوان الصفحة واذكر ما كنت تحاول القيام به.'
  ],
  he: [
    'PlainSpeak שואף להנגיש את מאגר המונחים ואת תכונות הקהילה. תפריט הנגישות מאפשר להגדיל טקסט, להגביר ניגודיות, לסמן קישורים בקו תחתון ולהפחית תנועה.',
    'ניתן להקריא טקסט מסומן בדפדפנים התומכים בהקראה. השפות והקולות הזמינים תלויים בדפדפן ובמכשיר. טרם אומתה התאמה מלאה לתקן הישראלי 5568 ברמה AA.',
    'לדיווח על קושי בנגישות או לבקשת גרסה נגישה של תוכן, פנו אלינו בדוא״ל. במידת האפשר, צרפו את כתובת הדף ותארו מה ניסיתם לעשות.'
  ]
}

export default function AccessibilityStatement() {
  const { t, i18n } = useTranslation()
  return <section className="page">
    <h1>{t('Accessibility statement')}</h1>
    {(statements[i18n.resolvedLanguage] || statements.en).map(paragraph => <p key={paragraph}>{paragraph}</p>)}
    <p><a href="mailto:salammoney@salamsalah.com"><bdi>salammoney@salamsalah.com</bdi></a></p>
  </section>
}
