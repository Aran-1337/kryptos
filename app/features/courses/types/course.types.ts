export type CourseGrade = 'أولى ثانوي' | 'ثانية ثانوي' | 'تأسيس' | string;

export type CourseType =
  | 'شرح المنهج'
  | 'كورس تأسيسي'
  | 'بنك الأسئلة'
  | 'حل الامتحانات'
  | 'المراجعة النهائية'
  | string;

export type CourseStatus = 'مفعل' | 'مسودة' | string;

export interface Course {
  id: string | number;
  _id?: string;
  title: string;
  description?: string;
  grade: CourseGrade;
  type: CourseType;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | string;
  originalPrice: string;
  price: string;
  discountPrice?: number;
  discountBadge: string;
  image: string;
  thumbnail?: { url?: string; publicId?: string };
  students: number;
  totalStudents?: number;
  totalLessons?: number;
  status: CourseStatus;
  isPublished?: boolean;
  isFree?: boolean;
  sections?: any[];
  instructor?: { _id: string; name: string; avatar?: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseFormData {
  title: string;
  description?: string;
  category?: string;
  grade: CourseGrade;
  type: CourseType;
  originalPrice: string;
  price: string;
  hasDiscount: boolean;
  imageUrl: string;
  status: CourseStatus;
  level?: 'beginner' | 'intermediate' | 'advanced' | string;
  isFree?: boolean;
}

export interface CreateCourseDTO {
  title: string;
  description: string;
  category: string;
  price?: number;
  discountPrice?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  isFree?: boolean;
  grade?: string;
  subject?: string;
  language?: string;
}

export interface UpdateCourseDTO {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  discountPrice?: number;
  level?: 'beginner' | 'intermediate' | 'advanced';
  isFree?: boolean;
  grade?: string;
  subject?: string;
  language?: string;
}
