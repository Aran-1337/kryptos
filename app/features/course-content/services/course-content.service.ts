import api from '@/app/lib/api';
import {
  Section,
  Lesson,
  CreateSectionDTO,
  UpdateSectionDTO,
  CreateLessonDTO,
  UpdateLessonDTO,
} from '../types/course-content.types';

export function normalizeBackendLesson(l: any): Lesson {
  if (!l) return {} as Lesson;
  const durSec = l.video?.duration || (typeof l.duration === 'number' ? l.duration : 0);
  const mins = Math.floor(durSec / 60);
  const secs = Math.floor(durSec % 60);
  const formattedDur = durSec > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : (typeof l.duration === 'string' ? l.duration : '10:00');

  return {
    id: (l._id || l.id || '').toString(),
    _id: l._id ? l._id.toString() : undefined,
    title: l.title || '',
    duration: formattedDur,
    durationSeconds: durSec,
    isPreview: Boolean(l.isFree),
    isFree: Boolean(l.isFree),
    videoProvider: 'Cloudinary Secure Video',
    videoUrl: l.video?.secureUrl || '',
    hasVideo: Boolean(l.video?.publicId),
    pdfUrl: l.attachments?.[0]?.secureUrl || '',
    order: l.order || 0,
    description: l.description || '',
  };
}

export function normalizeBackendSection(s: any): Section {
  if (!s) return {} as Section;
  return {
    id: (s._id || s.id || '').toString(),
    _id: s._id ? s._id.toString() : undefined,
    title: s.title || '',
    order: s.order || 0,
    lessons: Array.isArray(s.lessons) ? s.lessons.map(normalizeBackendLesson) : [],
  };
}

export const courseContentService = {
  // Get all sections for a course (populated with lessons)
  async getSections(courseId?: string): Promise<Section[]> {
    if (!courseId) return [];
    const res = await api.get(`/courses/${courseId}/sections`);
    const rawSections = res.data?.data?.sections || res.data?.data || [];
    return Array.isArray(rawSections) ? rawSections.map(normalizeBackendSection) : [];
  },

  // Create section
  async createSection(courseId: string, payload: CreateSectionDTO): Promise<Section> {
    const res = await api.post(`/courses/${courseId}/sections`, payload);
    const raw = res.data?.data?.section || res.data?.data || res.data;
    return normalizeBackendSection(raw);
  },

  // Update section
  async updateSection(courseId: string, sectionId: string, payload: UpdateSectionDTO): Promise<Section> {
    const res = await api.patch(`/courses/${courseId}/sections/${sectionId}`, payload);
    const raw = res.data?.data?.section || res.data?.data || res.data;
    return normalizeBackendSection(raw);
  },

  // Delete section
  async deleteSection(courseId: string, sectionId: string): Promise<void> {
    await api.delete(`/courses/${courseId}/sections/${sectionId}`);
  },

  // Get lessons of a section
  async getLessons(courseId: string, sectionId: string): Promise<Lesson[]> {
    const res = await api.get(`/courses/${courseId}/sections/${sectionId}/lessons`);
    const rawLessons = res.data?.data?.lessons || res.data?.data || [];
    return Array.isArray(rawLessons) ? rawLessons.map(normalizeBackendLesson) : [];
  },

  // Create lesson
  async createLesson(courseId: string, sectionId: string, payload: CreateLessonDTO): Promise<Lesson> {
    const res = await api.post(`/courses/${courseId}/sections/${sectionId}/lessons`, payload);
    const raw = res.data?.data?.lesson || res.data?.data || res.data;
    return normalizeBackendLesson(raw);
  },

  // Update lesson
  async updateLesson(
    courseId: string,
    sectionId: string,
    lessonId: string,
    payload: UpdateLessonDTO
  ): Promise<Lesson> {
    const res = await api.patch(
      `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`,
      payload
    );
    const raw = res.data?.data?.lesson || res.data?.data || res.data;
    return normalizeBackendLesson(raw);
  },

  // Delete lesson
  async deleteLesson(courseId: string, sectionId: string, lessonId: string): Promise<void> {
    await api.delete(`/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}`);
  },

  // Get secure signed video streaming URL
  async getLessonVideo(
    courseId: string,
    sectionId: string,
    lessonId: string
  ): Promise<{ url: string; duration?: number; expiresIn?: number }> {
    const res = await api.get(
      `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/video`
    );
    return res.data?.data || res.data;
  },

  // Upload lesson video file (multipart/form-data)
  async uploadLessonVideo(
    courseId: string,
    sectionId: string,
    lessonId: string,
    file: File
  ): Promise<Lesson> {
    const formData = new FormData();
    formData.append('video', file);
    const res = await api.post(
      `/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/video`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    const raw = res.data?.data?.lesson || res.data?.data || res.data;
    return normalizeBackendLesson(raw);
  },
};
