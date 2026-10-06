'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  useStudents,
  StudentsToolbar,
  StudentsTable,
  StudentNoteModal,
  StudentDevicesModal,
} from '@/app/features/students';

export default function AdminStudentsPage() {
  const {
    filteredStudents,
    searchQuery,
    setSearchQuery,
    selectedGrade,
    setSelectedGrade,
    selectedStudent,
    setSelectedStudent,
    editingNoteStudent,
    noteText,
    setNoteText,
    toastMsg,
    handleToggleBlock,
    handleUnbindDevice,
    openNoteEditor,
    handleSaveNote,
    closeNoteModal,
    closeDevicesModal,
  } = useStudents();

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
      {/* Toast Notification */}
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--surface)',
            color: 'var(--text-main)',
            padding: '12px 24px',
            borderRadius: 12,
            fontWeight: 800,
            zIndex: 9999,
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            border: '1px solid var(--border)',
          }}
        >
          {toastMsg}
        </motion.div>
      )}

      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 900,
              color: 'var(--text-main)',
              marginBottom: 8,
            }}
          >
            إدارة الطلاب وحماية الأجهزة 👥
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            متابعة حسابات الطلاب، فحص عناوين الـ IP، الأجهزة المسجلة لمنع مشاركة الحسابات، وتعديل التوجيهات والتوصيات.
          </p>
        </div>
      </div>

      {/* Main Table Container */}
      <div
        style={{
          background: 'var(--surface)',
          borderRadius: 20,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          border: '1px solid var(--border)',
          overflow: 'hidden',
        }}
      >
        <StudentsToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedGrade={selectedGrade}
          onGradeChange={setSelectedGrade}
        />

        <StudentsTable
          students={filteredStudents}
          onSelectStudent={setSelectedStudent}
          onToggleBlock={handleToggleBlock}
          onOpenNoteEditor={openNoteEditor}
        />
      </div>

      {/* Edit Teacher Note & Recommendations Modal */}
      <StudentNoteModal
        student={editingNoteStudent}
        noteText={noteText}
        onNoteChange={setNoteText}
        onClose={closeNoteModal}
        onSave={handleSaveNote}
      />

      {/* Devices Inspection Modal */}
      <StudentDevicesModal
        student={selectedStudent}
        onClose={closeDevicesModal}
        onUnbindDevice={handleUnbindDevice}
      />
    </div>
  );
}
