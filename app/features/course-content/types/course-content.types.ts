export interface Lesson {
  id: string;
  _id?: string;
  title: string;
  duration: string;
  durationSeconds?: number;
  isPreview: boolean;
  isFree?: boolean;
  videoProvider: string;
  videoUrl: string;
  hasVideo?: boolean;
  pdfUrl?: string;
  order?: number;
  description?: string;
}

export interface Section {
  id: string;
  _id?: string;
  title: string;
  order?: number;
  lessons: Lesson[];
}

export interface LessonFormData {
  title: string;
  videoUrl: string;
  videoProvider: string;
  duration: string;
  isPreview: boolean;
  pdfUrl: string;
}

export interface CreateSectionDTO {
  title: string;
  order?: number;
}

export interface UpdateSectionDTO {
  title?: string;
  order?: number;
}

export interface CreateLessonDTO {
  title: string;
  description?: string;
  duration?: number;
  isFree?: boolean;
  order?: number;
}

export interface UpdateLessonDTO {
  title?: string;
  description?: string;
  duration?: number;
  isFree?: boolean;
  order?: number;
}
