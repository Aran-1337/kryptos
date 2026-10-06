import { Student, StudentNotesMap } from '../types/student.types';

export const initialStudents: Student[] = [
  { 
    id: 1, 
    name: 'أحمد محمود العبد', 
    email: 'ahmed@example.com', 
    grade: 'أولى ثانوي', 
    courses: 2, 
    joinedAt: '12 أكتوبر 2026', 
    status: 'نشط',
    devicesCount: 2,
    devices: [
      { id: 'dev-1', type: 'laptop', name: 'Windows PC (Chrome 122)', ip: '197.34.12.89', city: 'القاهرة (WE Broadband)', isSameNetwork: true, lastActive: 'الآن (نشط حالياً)', isCurrent: true },
      { id: 'dev-2', type: 'mobile', name: 'iPhone 15 Pro (Safari)', ip: '197.34.12.89', city: 'القاهرة (WE Broadband)', isSameNetwork: true, lastActive: 'منذ ساعتين', isCurrent: false },
    ]
  },
  { 
    id: 2, 
    name: 'سارة خالد السيد', 
    email: 'sara@example.com', 
    grade: 'ثانية ثانوي', 
    courses: 1, 
    joinedAt: '10 أكتوبر 2026', 
    status: 'نشط',
    devicesCount: 3,
    devices: [
      { id: 'dev-3', type: 'laptop', name: 'MacBook Air (Safari)', ip: '156.204.11.45', city: 'الإسكندرية (Orange 4G)', isSameNetwork: false, lastActive: 'الآن', isCurrent: true },
      { id: 'dev-4', type: 'mobile', name: 'Samsung Galaxy S24', ip: '41.233.90.12', city: 'أسيوط (Vodafone 4G)', isSameNetwork: false, lastActive: 'منذ 10 دقائق', isCurrent: false },
      { id: 'dev-5', type: 'mobile', name: 'Xiaomi Redmi Note 12', ip: '197.45.100.8', city: 'القاهرة (Etisalat 4G)', isSameNetwork: false, lastActive: 'أمس', isCurrent: false },
    ]
  },
  { 
    id: 3, 
    name: 'عمر طارق إبراهيم', 
    email: 'omar@example.com', 
    grade: 'تأسيس', 
    courses: 3, 
    joinedAt: '05 أكتوبر 2026', 
    status: 'محظور',
    devicesCount: 1,
    devices: [
      { id: 'dev-6', type: 'mobile', name: 'Realme C55', ip: '41.130.44.90', city: 'الجيزة (WE 4G)', isSameNetwork: true, lastActive: 'منذ 3 أيام', isCurrent: false }
    ]
  },
  { 
    id: 4, 
    name: 'مريم سعيد النجار', 
    email: 'mariam@example.com', 
    grade: 'أولى ثانوي', 
    courses: 1, 
    joinedAt: '01 أكتوبر 2026', 
    status: 'نشط',
    devicesCount: 1,
    devices: [
      { id: 'dev-7', type: 'laptop', name: 'Dell XPS 15 (Edge)', ip: '197.35.88.10', city: 'المنصورة (WE Broadband)', isSameNetwork: true, lastActive: 'منذ ساعة', isCurrent: true }
    ]
  },
];

export const initialStudentNotes: StudentNotesMap = {
  '1': {
    note: 'أحمد من الطلاب المتميزين جداً هذا الأسبوع. التزامه بمشاهدة الحصص وحل الامتحانات في مواعيدها يعكس تفوقه وحصوله على المركز الأول في الدفعة.',
    strengths: 'التفكير المنطقي في الخوارزميات، سرعة حل امتحانات الخوارزميات (0 إنذارات غش)، الانضباط في مواعيد المشاهدة',
    improvement: 'التركيز على تطبيقات Loops التكرارية في بايثون'
  }
};
