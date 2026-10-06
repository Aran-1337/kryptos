import { Course } from '../types/course.types';

export function filterCourses(courses: Course[], query: string): Course[] {
  if (!query.trim()) return courses;
  const q = query.toLowerCase().trim();
  return courses.filter(
    course =>
      course.title.toLowerCase().includes(q) ||
      course.grade.toLowerCase().includes(q) ||
      course.type.toLowerCase().includes(q)
  );
}

export function calculateDiscountBadge(
  hasDiscount: boolean,
  originalPrice: string,
  price: string
): string {
  const orig = Number(originalPrice);
  const cur = Number(price);
  if (hasDiscount && orig && cur && orig > cur) {
    return `خصم ${Math.round(((orig - cur) / orig) * 100)}%`;
  }
  return '';
}

export function calculateCourseStats(courses: Course[]) {
  return {
    total: courses.length,
    active: courses.filter(c => c.status === 'مفعل').length,
    draft: courses.filter(c => c.status === 'مسودة').length,
    totalStudents: courses.reduce((acc, c) => acc + (c.students || 0), 0),
  };
}
