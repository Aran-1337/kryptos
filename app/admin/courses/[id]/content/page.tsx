'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import {
  useCourseContent,
  CourseContentHeader,
  SecurityBanner,
  SectionsList,
  SectionModal,
  LessonModal,
} from '@/app/features/course-content';

export default function AdminCourseContentPage() {
  const params = useParams();
  const courseId = params?.id as string | undefined;

  const {
    sections,
    loading,
    error,
    apiError,
    saveLoading,
    showSectionModal,
    sectionTitleInput,
    setSectionTitleInput,
    showLessonModal,
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
  } = useCourseContent(courseId);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        fontFamily: 'Tajawal, sans-serif',
        direction: 'rtl',
      }}
    >
      {/* Header */}
      <CourseContentHeader onAddSection={handleOpenAddSection} />

      {/* Security Info Banner */}
      <SecurityBanner />

      {/* Error Banner with Retry */}
      {error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 12,
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: '#ef4444',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>⚠️</span>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{error}</span>
          </div>
          <button
            onClick={fetchContent}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              padding: '6px 14px',
              borderRadius: 8,
              fontWeight: 800,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            إعادة المحاولة
          </button>
        </div>
      )}

      {loading ? (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
          جاري تحميل أقسام ودروس الكورس من السيرفر...
        </div>
      ) : (
        /* Sections & Lessons List */
        <SectionsList
          sections={sections}
          onOpenAddLesson={handleOpenAddLesson}
          onDeleteLesson={handleDeleteLesson}
          onDeleteSection={handleDeleteSection}
        />
      )}

      {/* Add Section Modal */}
      <SectionModal
        show={showSectionModal}
        titleInput={sectionTitleInput}
        onTitleInputChange={setSectionTitleInput}
        onClose={handleCloseAddSection}
        onSave={handleSaveSection}
      />

      {/* Add Protected Lesson Modal */}
      <LessonModal
        show={showLessonModal}
        lessonTitle={lessonTitle}
        onLessonTitleChange={setLessonTitle}
        videoProvider={videoProvider}
        onVideoProviderChange={setVideoProvider}
        duration={duration}
        onDurationChange={setDuration}
        videoUrl={videoUrl}
        onVideoUrlChange={setVideoUrl}
        videoFile={videoFile}
        onVideoFileChange={setVideoFile}
        uploadProgress={uploadProgress}
        saveLoading={saveLoading}
        pdfUrl={pdfUrl}
        onPdfUrlChange={setPdfUrl}
        isPreview={isPreview}
        onIsPreviewChange={setIsPreview}
        onClose={handleCloseAddLesson}
        onSave={handleSaveLesson}
      />
    </div>
  );
}
