'use client';

import React from 'react';
import {
  useCourses,
  CoursesHeader,
  CoursesToolbar,
  CoursesTable,
  CourseModal,
} from '@/app/features/courses';

export default function AdminCoursesPage() {
  const {
    filteredCourses,
    loading,
    error,
    apiError,
    saveLoading,
    searchQuery,
    setSearchQuery,
    showModal,
    editingCourse,
    title,
    setTitle,
    grade,
    setGrade,
    type,
    setType,
    originalPrice,
    setOriginalPrice,
    price,
    setPrice,
    hasDiscount,
    setHasDiscount,
    imageUrl,
    setImageUrl,
    status,
    setStatus,
    fetchCourses,
    handleOpenNewModal,
    handleOpenEditModal,
    handleCloseModal,
    handleSaveCourse,
    handleDeleteCourse,
  } = useCourses();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        fontFamily: 'Tajawal, sans-serif',
      }}
    >
      {/* Page Header */}
      <CoursesHeader onAddNew={handleOpenNewModal} />

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
            onClick={fetchCourses}
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

      {/* Main Table Container */}
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        <CoursesToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
            جاري تحميل الكورسات من السيرفر...
          </div>
        ) : (
          <CoursesTable
            courses={filteredCourses}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteCourse}
          />
        )}
      </div>

      {/* Add / Edit Course Modal */}
      <CourseModal
        show={showModal}
        editingCourse={editingCourse}
        title={title}
        onTitleChange={setTitle}
        grade={grade}
        onGradeChange={setGrade}
        type={type}
        onTypeChange={setType}
        originalPrice={originalPrice}
        onOriginalPriceChange={setOriginalPrice}
        price={price}
        onPriceChange={setPrice}
        hasDiscount={hasDiscount}
        onHasDiscountChange={setHasDiscount}
        imageUrl={imageUrl}
        onImageUrlChange={setImageUrl}
        status={status}
        onStatusChange={setStatus}
        onClose={handleCloseModal}
        onSave={handleSaveCourse}
        apiError={apiError}
        saveLoading={saveLoading}
      />
    </div>
  );
}
