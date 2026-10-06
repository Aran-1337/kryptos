import { Course } from '../types/course.types';

export const initialCourses: Course[] = [
  { 
    id: 1, 
    title: 'كورس أولى ثانوي - الترم الأول', 
    grade: 'أولى ثانوي', 
    type: 'شرح المنهج', 
    originalPrice: '500 ج.م',
    price: '350 ج.م', 
    discountBadge: 'خصم 30%',
    image: '/th1.webp',
    students: 1250, 
    status: 'مفعل' 
  },
  { 
    id: 2, 
    title: 'الكورس التأسيسي في البرمجة', 
    grade: 'تأسيس', 
    type: 'كورس تأسيسي', 
    originalPrice: 'مجاني',
    price: 'مجاني', 
    discountBadge: '',
    image: '/hero1.webp',
    students: 3420, 
    status: 'مفعل' 
  },
  { 
    id: 3, 
    title: 'مراجعة ليلة الامتحان - أولى ثانوي', 
    grade: 'أولى ثانوي', 
    type: 'المراجعة النهائية', 
    originalPrice: '250 ج.م',
    price: '150 ج.م', 
    discountBadge: 'خصم 40%',
    image: '/th2.webp',
    students: 890, 
    status: 'مسودة' 
  },
];
