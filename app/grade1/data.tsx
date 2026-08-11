import { FaCode, FaLaptopCode, FaGlobeAfrica, FaLayerGroup, FaShieldAlt, FaWifi, FaDatabase, FaChartBar, FaFlask, FaPython } from 'react-icons/fa';
import { MdPlayLesson, MdQuiz, MdFitnessCenter, MdSecurity, MdVisibility } from 'react-icons/md';
import { HiLightBulb } from 'react-icons/hi';
import { GiStairsGoal } from 'react-icons/gi';
import { TbCircuitResistor } from 'react-icons/tb';
import { BiSitemap } from 'react-icons/bi';

export const features = [
  { icon: <FaCode size={16} color="var(--primary)" />, label: 'تأسيس من البداية' },
  { icon: <MdPlayLesson size={16} color="#f59e0b" />, label: 'شرح بسيط' },
  { icon: <FaLaptopCode size={16} color="#10b981" />, label: 'تدريب عملي' },
  { icon: <MdQuiz size={16} color="#ef4444" />, label: 'أسئلة ومراجعات' },
  { icon: <FaGlobeAfrica size={16} color="var(--primary-dark)" />, label: 'مناسب عربي ولغات' },
];

export const whyCards = [
  { icon: <FaLayerGroup size={22} color="var(--primary)" />, bg: 'var(--primary-light)', title: 'تأسيس قوي', desc: 'نبدأ بالمفاهيم الأساسية من غير تعقيد، عشان الطالب يبني فهم صح من البداية.' },
  { icon: <HiLightBulb size={22} color="#f59e0b" />, bg: '#fef3c7', title: 'فهم قبل الحفظ', desc: 'نشرح الفكرة بطريقة بسيطة تخلي الطالب يفهمها، مش يحفظها بس.' },
  { icon: <MdFitnessCenter size={22} color="#10b981" />, bg: '#d1fae5', title: 'تدريب مستمر', desc: 'بعد كل شرح، الطالب يحل ويتدرب عشان المعلومة تثبت.' },
  { icon: <GiStairsGoal size={22} color="#ef4444" />, bg: '#fee2e2', title: 'استعداد لتانية ثانوي', desc: 'الطالب اللي يتأسس صح في أولى ثانوي، يدخل تانية ثانوي وهو سابق بخطوة.' },
];

export const progressSteps = [
  { num: '1', label: 'البداية' },
  { num: '2', label: 'فهم' },
  { num: '3', label: 'تدريب' },
  { num: '4', label: 'تأسيس' },
  { num: '5', label: 'جاهز لتانية ثانوي' },
];

export const curriculumItems = [
  { tag: 'أساسيات', icon: <MdVisibility size={20} color="var(--primary)" />, bg: 'var(--primary-light)', color: 'var(--primary)', title: 'المعلومات والوسائط', desc: 'نفهم الفرق بين أنواع المعلومات وإزاي التكنولوجيا بتعرضها.' },
  { tag: 'وعي رقمي', icon: <FaShieldAlt size={18} color="#f59e0b" />, bg: '#fef3c7', color: '#92400e', title: 'أخلاقيات المعلومات', desc: 'نتعلم الاستخدام الصح والمسؤول للتكنولوجيا.' },
  { tag: 'أمان', icon: <MdSecurity size={20} color="#10b981" />, bg: '#d1fae5', color: '#065f46', title: 'البيانات الشخصية والخصوصية', desc: 'نعرف يعني إيه خصوصية وإزاي نحافظ على بياناتنا.' },
  { tag: 'حماية', icon: <FaShieldAlt size={18} color="#ef4444" />, bg: '#fee2e2', color: '#991b1b', title: 'أمن المعلومات', desc: 'نفهم أساسيات الأمان والحماية الرقمية.' },
  { tag: 'شبكات', icon: <FaWifi size={18} color="#6366f1" />, bg: '#ede9fe', color: '#4338ca', title: 'الاتصالات والشبكات', desc: 'نبدأ نفهم الإنترنت والشبكات بشكل بسيط.' },
  { tag: 'تنظيم', icon: <BiSitemap size={20} color="#0891b2" />, bg: '#cffafe', color: '#0e7490', title: 'تصميم المعلومات', desc: 'نتعلم إزاي نرتب المعلومات ونقدمها بشكل أوضح.' },
  { tag: 'منطق', icon: <TbCircuitResistor size={20} color="#7c3aed" />, bg: '#ede9fe', color: '#5b21b6', title: 'الكمبيوترات والدوائر المنطقية', desc: 'نفهم أساسيات عمل الكمبيوتر بطريقة مبسطة.' },
  { tag: 'بيانات', icon: <FaDatabase size={18} color="#0284c7" />, bg: '#e0f2fe', color: '#0369a1', title: 'قواعد البيانات', desc: 'نتعرف على فكرة تخزين البيانات وتنظيمها.' },
  { tag: 'تحليل', icon: <FaChartBar size={18} color="#d97706" />, bg: '#fef3c7', color: '#92400e', title: 'تحليل البيانات', desc: 'نبدأ نفهم إزاي نقرأ البيانات ونستفيد منها.' },
  { tag: 'تجربة', icon: <FaFlask size={18} color="#059669" />, bg: '#d1fae5', color: '#065f46', title: 'المحاكاة', desc: 'نشوف إزاي التكنولوجيا بتساعدنا نجرب مواقف بشكل افتراضي.' },
  { tag: 'برمجة', icon: <FaPython size={20} color="#2563eb" />, bg: '#dbeafe', color: '#1d4ed8', title: 'أساسيات البرمجة Python', desc: 'نأخذ أول خطوة في التفكير البرمجي وكتابة الكود.' },
];
