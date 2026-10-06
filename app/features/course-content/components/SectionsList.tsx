'use client';

import React from 'react';
import { Plus, Video, Trash2 } from 'lucide-react';
import { Section } from '../types/course-content.types';

interface SectionsListProps {
  sections: Section[];
  onOpenAddLesson: (sectionId: string) => void;
  onDeleteLesson: (sectionId: string, lessonId: string) => void;
  onDeleteSection?: (sectionId: string) => void;
}

export default function SectionsList({
  sections,
  onOpenAddLesson,
  onDeleteLesson,
  onDeleteSection,
}: SectionsListProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {sections.map((section, idx) => (
        <div
          key={section.id}
          style={{
            background: 'var(--surface)',
            borderRadius: 20,
            border: '1px solid var(--border)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}
        >
          {/* Section Header */}
          <div
            style={{
              padding: '20px 24px',
              background: 'var(--bg)',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  background: '#6C22F9',
                  color: '#fff',
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 900,
                }}
              >
                {idx + 1}
              </span>
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 800,
                  color: 'var(--text-main)',
                }}
              >
                {section.title}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {onDeleteSection && (
                <button
                  onClick={() => onDeleteSection(section.id)}
                  title="حذف الفصل"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    padding: '8px 12px',
                    borderRadius: 10,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={15} />
                </button>
              )}
              <button
                onClick={() => onOpenAddLesson(section.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#6C22F9',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: 'pointer',
                  fontFamily: 'Tajawal, sans-serif',
                }}
              >
                <Plus size={16} /> إضافة درس لهذا الفصل
              </button>
            </div>
          </div>

          {/* Lessons List inside Section */}
          <div
            style={{
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {section.lessons.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: 24,
                  color: 'var(--text-muted)',
                  fontSize: 13,
                }}
              >
                لا توجد دروس في هذا الفصل بعد. اضغط إضافة درس للبدء.
              </div>
            ) : (
              section.lessons.map(lesson => (
                <div
                  key={lesson.id}
                  style={{
                    padding: 16,
                    borderRadius: 14,
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        background: 'rgba(59,130,246,0.12)',
                        color: '#3b82f6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Video size={20} />
                    </div>
                    <div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 4,
                        }}
                      >
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 15,
                            fontWeight: 800,
                            color: 'var(--text-main)',
                          }}
                        >
                          {lesson.title}
                        </h4>
                        {lesson.isPreview && (
                          <span
                            style={{
                              background: 'rgba(34,197,94,0.15)',
                              color: '#22c55e',
                              fontSize: 11,
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: 12,
                            }}
                          >
                            معاينة مجانية
                          </span>
                        )}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: 16,
                          fontSize: 12,
                          color: 'var(--text-muted)',
                          fontWeight: 600,
                        }}
                      >
                        <span>⏱️ {lesson.duration}</span>
                        <span style={{ color: '#6C22F9', fontWeight: 700 }}>
                          🔒 {lesson.videoProvider}
                        </span>
                        {lesson.pdfUrl && (
                          <span style={{ color: '#3b82f6' }}>
                            📄 مذكرة PDF مرفقة
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                      onClick={() => onDeleteLesson(section.id, lesson.id)}
                      style={{
                        background: 'rgba(239,68,68,0.12)',
                        border: '1px solid rgba(239,68,68,0.25)',
                        color: '#ef4444',
                        padding: '8px 12px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontFamily: 'Tajawal, sans-serif',
                      }}
                    >
                      <Trash2 size={14} /> حذف الدرس
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
