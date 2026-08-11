import { FaCode, FaLaptopCode, FaGlobeAfrica, FaLayerGroup, FaPython, FaDatabase, FaChartBar, FaRobot, FaNetworkWired, FaBrain } from 'react-icons/fa';
import { MdPlayLesson, MdQuiz, MdFitnessCenter, MdSecurity } from 'react-icons/md';
import { HiLightBulb } from 'react-icons/hi';
import { GiStairsGoal } from 'react-icons/gi';
import { TbCircuitResistor } from 'react-icons/tb';
import { BsStars } from 'react-icons/bs';

export const features = [
  { icon: <FaCode size={16} color="var(--primary)" />, label: 'برمجة متقدمة' },
  { icon: <MdPlayLesson size={16} color="#f59e0b" />, label: 'شرح بسيط' },
  { icon: <FaLaptopCode size={16} color="#10b981" />, label: 'تدريب عملي' },
  { icon: <MdQuiz size={16} color="#ef4444" />, label: 'أسئلة ومراجعات' },
  { icon: <FaGlobeAfrica size={16} color="var(--primary-dark)" />, label: 'مناسب عربي ولغات' },
];

export const whyCards = [
  { icon: <FaLayerGroup size={22} color="var(--primary)" />, bg: 'var(--primary-light)', title: 'تعمق في البرمجة', desc: 'نكمل على أساس أولى ثانوي ونتعمق في Python والخوارزميات بشكل أقوى.' },
  { icon: <HiLightBulb size={22} color="#f59e0b" />, bg: '#fef3c7', title: 'تفكير خوارزمي', desc: 'نطور مهارة حل المشكلات والتفكير المنطقي خطوة بخطوة.' },
  { icon: <MdFitnessCenter size={22} color="#10b981" />, bg: '#d1fae5', title: 'مشاريع حقيقية', desc: 'الطالب يطبق اللي اتعلمه في مشاريع عملية حقيقية.' },
  { icon: <GiStairsGoal size={22} color="#ef4444" />, bg: '#fee2e2', title: 'استعداد لتالتة ثانوي', desc: 'الطالب اللي يتأسس صح في تانية ثانوي، يدخل تالتة وهو جاهز للتخصص.' },
];

export const progressSteps = [
  { num: '1', label: 'مراجعة' },
  { num: '2', label: 'تعمق' },
  { num: '3', label: 'تطبيق' },
  { num: '4', label: 'مشاريع' },
  { num: '5', label: 'جاهز لتالتة ثانوي' },
];

export const curriculumItems = [
  { tag: 'خوارزميات', icon: <TbCircuitResistor size={20} color="var(--primary)" />, bg: 'var(--primary-light)', color: 'var(--primary)', title: 'الخوارزميات والتعقيد', desc: 'نفهم إزاي نحل المشاكل بكفاءة ونقيس أداء الكود.' },
  { tag: 'برمجة', icon: <FaPython size={20} color="#2563eb" />, bg: '#dbeafe', color: '#1d4ed8', title: 'Python المتقدمة', desc: 'نتعمق في الدوال والـ OOP والمكتبات الأساسية.' },
  { tag: 'هياكل', icon: <FaLayerGroup size={18} color="#7c3aed" />, bg: '#ede9fe', color: '#5b21b6', title: 'هياكل البيانات', desc: 'نتعلم القوائم والمصفوفات والـ Stack والـ Queue.' },
  { tag: 'قواعد بيانات', icon: <FaDatabase size={18} color="#0284c7" />, bg: '#e0f2fe', color: '#0369a1', title: 'SQL وقواعد البيانات', desc: 'نكتب استعلامات SQL ونتعامل مع قواعد البيانات العلائقية.' },
  { tag: 'شبكات', icon: <FaNetworkWired size={18} color="#0891b2" />, bg: '#cffafe', color: '#0e7490', title: 'الشبكات المتقدمة', desc: 'نفهم بروتوكولات الإنترنت وطبقات الشبكة بشكل أعمق.' },
  { tag: 'أمان', icon: <MdSecurity size={20} color="#10b981" />, bg: '#d1fae5', color: '#065f46', title: 'الأمن السيبراني', desc: 'نتعلم أساليب الحماية والهجمات الشائعة وكيفية التصدي لها.' },
  { tag: 'تحليل', icon: <FaChartBar size={18} color="#d97706" />, bg: '#fef3c7', color: '#92400e', title: 'تحليل البيانات المتقدم', desc: 'نستخدم Python لتحليل البيانات وعرضها بشكل احترافي.' },
  { tag: 'ذكاء اصطناعي', icon: <FaBrain size={18} color="#ef4444" />, bg: '#fee2e2', color: '#991b1b', title: 'مقدمة في الذكاء الاصطناعي', desc: 'نفهم مفاهيم الـ AI والـ Machine Learning بطريقة مبسطة.' },
  { tag: 'روبوتيكس', icon: <FaRobot size={18} color="#059669" />, bg: '#d1fae5', color: '#065f46', title: 'الروبوتيكس والأتمتة', desc: 'نتعرف على أساسيات الروبوتيكس وتطبيقاتها العملية.' },
  { tag: 'مشاريع', icon: <BsStars size={18} color="#6366f1" />, bg: '#ede9fe', color: '#4338ca', title: 'مشروع التخرج', desc: 'الطالب يطبق كل اللي اتعلمه في مشروع متكامل من اختياره.' },
];
