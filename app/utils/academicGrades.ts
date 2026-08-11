export interface AcademicGrade {
  id: string;
  name: string;
  subtitle: string;
  desc: string;
  img: string;
  href: string;
  active: boolean;
}

export const defaultGrades: AcademicGrade[] = [
  {
    id: 'g1',
    name: 'أولى ثانوي',
    subtitle: 'Programming & AI من الصفر',
    desc: 'هنساعدك تفهم Programming & AI من الأساس، وتتعامل مع مفاهيم التكنولوجيا والبرمجة بطريقة سهلة وعملية، عشان تدخل تانية ثانوي وأنت سابق بخطوة.',
    img: '/th1.webp',
    href: '/courses?grade=1',
    active: true,
  },
  {
    id: 'g2',
    name: 'ثانية ثانوي',
    subtitle: 'تعمّق وتميّز في عالم التقنية',
    desc: 'هنبني على اللي اتعلمته في أولى ثانوي ونوسّع مداركك في الـ AI والبرمجة المتقدمة، مع مشاريع عملية حقيقية تخليك جاهز لأي تحدي قادم.',
    img: '/th2.webp',
    href: '/courses?grade=2',
    active: true,
  },
  {
    id: 'g3',
    name: 'ثالثة ثانوي',
    subtitle: 'المرحلة النهائية والتحدي الأكبر',
    desc: 'إعداد واحتراف شامل لأعلى تقنيات البرمجة والذكاء الاصطناعي والاستعداد للجامعة وسوق العمل.',
    img: '/th2.webp',
    href: '/courses?grade=3',
    active: false,
  },
  {
    id: 'g4',
    name: 'تأسيس',
    subtitle: 'مبادئ التفكير المنطقي والبرمجة',
    desc: 'كورس تأسيسي مبسط للطلاب من كافة الأعمار والمراحل لتعلم الأساسيات بطريقة شيقة وممتعة.',
    img: '/th1.webp',
    href: '/courses?grade=0',
    active: true,
  },
];

export function getAcademicGrades(): AcademicGrade[] {
  if (typeof window === 'undefined') return defaultGrades;
  try {
    const saved = localStorage.getItem('academic_grades');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return defaultGrades;
}

export function saveAcademicGrades(grades: AcademicGrade[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('academic_grades', JSON.stringify(grades));
  window.dispatchEvent(new Event('academic_grades_updated'));
}
