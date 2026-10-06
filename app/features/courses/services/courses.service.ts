import api from '@/app/lib/api';
import { Course, CreateCourseDTO, UpdateCourseDTO } from '../types/course.types';

// Helper to normalize backend course into UI Course interface
export function normalizeBackendCourse(backendCourse: any): Course {
  if (!backendCourse) return {} as Course;
  const priceVal = backendCourse.price !== undefined && backendCourse.price !== null ? Number(backendCourse.price) : 0;
  const discountVal = backendCourse.discountPrice !== undefined && backendCourse.discountPrice !== null ? Number(backendCourse.discountPrice) : undefined;
  const hasDiscount = discountVal !== undefined && discountVal < priceVal;

  return {
    id: backendCourse._id || backendCourse.id,
    _id: backendCourse._id,
    title: backendCourse.title || '',
    description: backendCourse.description || '',
    grade: backendCourse.grade || 'أولى ثانوي',
    type: backendCourse.category || 'شرح المنهج',
    category: backendCourse.category || '',
    level: backendCourse.level || 'beginner',
    originalPrice: hasDiscount ? `${priceVal} ج.م` : `${priceVal} ج.م`,
    price: hasDiscount ? `${discountVal} ج.م` : `${priceVal} ج.م`,
    discountPrice: discountVal,
    discountBadge: hasDiscount ? `خصم ${Math.round(((priceVal - discountVal) / (priceVal || 1)) * 100)}%` : '',
    image: backendCourse.thumbnail?.url || '/th1.webp',
    thumbnail: backendCourse.thumbnail,
    students: backendCourse.totalStudents || 0,
    totalStudents: backendCourse.totalStudents || 0,
    totalLessons: backendCourse.totalLessons || 0,
    status: backendCourse.isPublished ? 'مفعل' : 'مسودة',
    isPublished: Boolean(backendCourse.isPublished),
    isFree: Boolean(backendCourse.isFree),
    sections: backendCourse.sections || [],
    instructor: backendCourse.instructor,
    createdAt: backendCourse.createdAt,
    updatedAt: backendCourse.updatedAt,
  };
}

export const coursesService = {
  // Public course list (published only)
  async getCourses(params?: Record<string, any>): Promise<{ courses: Course[]; total: number }> {
    const res = await api.get('/courses', { params });
    const items = res.data?.data?.data || res.data?.data?.courses || res.data?.data || [];
    const total = res.data?.data?.pagination?.total ?? (Array.isArray(items) ? items.length : 0);
    const normalized = Array.isArray(items) ? items.map(normalizeBackendCourse) : [];
    return { courses: normalized, total };
  },

  // Management course list (published + drafts for authorized staff/instructors)
  async getManageCourses(params?: Record<string, any>): Promise<{ courses: Course[]; total: number }> {
    const res = await api.get('/courses/manage', { params });
    const items = res.data?.data?.data || res.data?.data?.courses || res.data?.data || [];
    const total = res.data?.data?.pagination?.total ?? (Array.isArray(items) ? items.length : 0);
    const normalized = Array.isArray(items) ? items.map(normalizeBackendCourse) : [];
    return { courses: normalized, total };
  },

  // Get single course details
  async getCourseById(id: string): Promise<Course> {
    const res = await api.get(`/courses/${id}`);
    const raw = res.data?.data?.course || res.data?.data || res.data;
    return normalizeBackendCourse(raw);
  },

  // Create course
  async createCourse(payload: CreateCourseDTO): Promise<Course> {
    const res = await api.post('/courses', payload);
    const raw = res.data?.data?.course || res.data?.data || res.data;
    return normalizeBackendCourse(raw);
  },

  // Update course
  async updateCourse(id: string, payload: UpdateCourseDTO): Promise<Course> {
    const res = await api.patch(`/courses/${id}`, payload);
    const raw = res.data?.data?.course || res.data?.data || res.data;
    return normalizeBackendCourse(raw);
  },

  // Delete course
  async deleteCourse(id: string): Promise<void> {
    await api.delete(`/courses/${id}`);
  },

  // Publish course
  async publishCourse(id: string): Promise<Course> {
    const res = await api.patch(`/courses/${id}/publish`);
    const raw = res.data?.data?.course || res.data?.data || res.data;
    return normalizeBackendCourse(raw);
  },
};
