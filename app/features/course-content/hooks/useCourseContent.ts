import { useState, useEffect, useCallback } from 'react';
import { Section } from '../types/course-content.types';
import { courseContentService } from '../services/course-content.service';

export function useCourseContent(courseId?: string) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState('');
  const [saveLoading, setSaveLoading] = useState(false);

  // Section Modal State
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [sectionTitleInput, setSectionTitleInput] = useState('');

  // Lesson Modal State
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [targetSectionId, setTargetSectionId] = useState('');

  // Lesson Form State
  const [lessonTitle, setLessonTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(false);
  const [videoProvider, setVideoProvider] = useState(
    'Cloudinary Secure Video'
  );
  const [duration, setDuration] = useState('20:00');
  const [isPreview, setIsPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const fetchContent = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    setError('');
    try {
      const data = await courseContentService.getSections(courseId);
      setSections(data);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'تعذر تحميل محتوى الكورس من السيرفر';
      setError(msg);
      setSections([]);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const handleOpenAddSection = useCallback(() => {
    setSectionTitleInput('');
    setApiError('');
    setShowSectionModal(true);
  }, []);

  const handleCloseAddSection = useCallback(() => {
    setShowSectionModal(false);
    setApiError('');
  }, []);

  const handleSaveSection = useCallback(async () => {
    if (!courseId || !sectionTitleInput.trim()) {
      setApiError('يرجى كتابة عنوان الفصل');
      return;
    }

    setSaveLoading(true);
    setApiError('');
    try {
      await courseContentService.createSection(courseId, {
        title: sectionTitleInput.trim(),
        order: sections.length + 1,
      });
      await fetchContent();
      setShowSectionModal(false);
      setSectionTitleInput('');
    } catch (err: any) {
      setApiError(err.response?.data?.message || 'تعذر إنشاء الفصل');
    } finally {
      setSaveLoading(false);
    }
  }, [courseId, sectionTitleInput, sections.length, fetchContent]);

  const handleDeleteSection = useCallback(
    async (sectionId: string) => {
      if (!courseId || !confirm('هل أنت متأكد من حذف هذا الفصل وكافة دروسه؟')) return;
      try {
        await courseContentService.deleteSection(courseId, sectionId);
        await fetchContent();
      } catch (err: any) {
        alert(err.response?.data?.message || 'تعذر حذف الفصل');
      }
    },
    [courseId, fetchContent]
  );

  const handleOpenAddLesson = useCallback((sectionId: string) => {
    setTargetSectionId(sectionId);
    setLessonTitle('');
    setVideoUrl('');
    setVideoFile(null);
    setUploadProgress(false);
    setVideoProvider('Cloudinary Secure Video');
    setDuration('20:00');
    setIsPreview(false);
    setPdfUrl('');
    setApiError('');
    setShowLessonModal(true);
  }, []);

  const handleCloseAddLesson = useCallback(() => {
    setShowLessonModal(false);
    setVideoFile(null);
    setUploadProgress(false);
    setApiError('');
  }, []);

  const handleSaveLesson = useCallback(async () => {
    if (!courseId || !targetSectionId || !lessonTitle.trim()) {
      setApiError('يرجى كتابة عنوان الدرس');
      return;
    }

    setSaveLoading(true);
    setApiError('');

    // Parse duration "mm:ss" or minutes to seconds
    let durSec = 600;
    if (duration.includes(':')) {
      const parts = duration.split(':');
      durSec = (parseInt(parts[0], 10) || 0) * 60 + (parseInt(parts[1], 10) || 0);
    } else {
      durSec = (parseInt(duration, 10) || 10) * 60;
    }

    try {
      // 1. Create lesson metadata in backend
      const newLesson = await courseContentService.createLesson(courseId, targetSectionId, {
        title: lessonTitle.trim(),
        duration: durSec,
        isFree: isPreview,
      });

      const lessonId = newLesson._id || newLesson.id;

      // 2. If a video file is selected, upload via multipart/form-data
      if (videoFile && lessonId) {
        setUploadProgress(true);
        await courseContentService.uploadLessonVideo(
          courseId,
          targetSectionId,
          lessonId,
          videoFile
        );
      }

      await fetchContent();
      setShowLessonModal(false);
      setVideoFile(null);
    } catch (err: any) {
      setApiError(err.response?.data?.message || err.message || 'تعذر إضافة الدرس أو رفع ملف الفيديو');
    } finally {
      setSaveLoading(false);
      setUploadProgress(false);
    }
  }, [courseId, targetSectionId, lessonTitle, duration, isPreview, videoFile, fetchContent]);

  const handleDeleteLesson = useCallback(
    async (sectionId: string, lessonId: string) => {
      if (!courseId || !confirm('هل أنت متأكد من حذف هذا الدرس؟')) return;
      try {
        await courseContentService.deleteLesson(courseId, sectionId, lessonId);
        await fetchContent();
      } catch (err: any) {
        alert(err.response?.data?.message || 'تعذر حذف الدرس');
      }
    },
    [courseId, fetchContent]
  );

  return {
    sections,
    loading,
    error,
    apiError,
    saveLoading,
    showSectionModal,
    sectionTitleInput,
    setSectionTitleInput,
    showLessonModal,
    targetSectionId,
    lessonTitle,
    setLessonTitle,
    videoUrl,
    setVideoUrl,
    videoFile,
    setVideoFile,
    uploadProgress,
    videoProvider,
    setVideoProvider,
    duration,
    setDuration,
    isPreview,
    setIsPreview,
    pdfUrl,
    setPdfUrl,
    fetchContent,
    handleOpenAddSection,
    handleCloseAddSection,
    handleSaveSection,
    handleDeleteSection,
    handleOpenAddLesson,
    handleCloseAddLesson,
    handleSaveLesson,
    handleDeleteLesson,
  };
}
