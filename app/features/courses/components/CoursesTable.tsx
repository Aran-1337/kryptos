'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Edit2, Trash2, Video } from 'lucide-react';
import { Course } from '../types/course.types';

interface CoursesTableProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: string | number) => void;
}

export default function CoursesTable({
  courses,
  onEdit,
  onDelete,
}: CoursesTableProps) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
        <thead>
          <tr
            style={{
              background: 'var(--bg)',
              color: 'var(--text-muted)',
              fontSize: 13,
              borderBottom: '1px solid var(--border)',
            }}
          >
            <th style={{ padding: '16px', fontWeight: 700 }}>غلاف الكورس واسمه</th>
            <th style={{ padding: '16px', fontWeight: 700 }}>المرحلة</th>
            <th style={{ padding: '16px', fontWeight: 700 }}>النوع</th>
            <th style={{ padding: '16px', fontWeight: 700 }}>السعر والخصم</th>
            <th style={{ padding: '16px', fontWeight: 700 }}>إدارة الدرجات والمحتوى</th>
            <th style={{ padding: '16px', fontWeight: 700 }}>الحالة</th>
            <th style={{ padding: '16px', fontWeight: 700, textAlign: 'left' }}>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                style={{
                  padding: '40px 16px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: 14,
                }}
              >
                لا توجد كورسات مطابقة لبحثك.
              </td>
            </tr>
          ) : (
            courses.map(course => (
              <tr key={course.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td
                  style={{
                    padding: '16px',
                    fontSize: 14,
                    fontWeight: 800,
                    color: 'var(--text-main)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        position: 'relative',
                        width: 48,
                        height: 48,
                        borderRadius: 10,
                        overflow: 'hidden',
                        background: '#16133a',
                        flexShrink: 0,
                      }}
                    >
                      <Image
                        src={course.image || '/th1.webp'}
                        alt={course.title}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <span>{course.title}</span>
                  </div>
                </td>
                <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>
                  {course.grade}
                </td>
                <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>
                  {course.type}
                </td>

                {/* Price & Discount Display */}
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 900,
                          color: 'var(--text-main)',
                        }}
                      >
                        {course.price}
                      </span>
                      {course.discountBadge && (
                        <span
                          style={{
                            background: 'rgba(239,68,68,0.15)',
                            color: '#ef4444',
                            border: '1px solid rgba(239,68,68,0.3)',
                            padding: '2px 8px',
                            borderRadius: 12,
                            fontSize: 11,
                            fontWeight: 800,
                          }}
                        >
                          {course.discountBadge}
                        </span>
                      )}
                    </div>
                    {course.discountBadge && (
                      <span
                        style={{
                          fontSize: 12,
                          color: 'var(--text-muted)',
                          textDecoration: 'line-through',
                        }}
                      >
                        {course.originalPrice}
                      </span>
                    )}
                  </div>
                </td>

                {/* Manage Content Button */}
                <td style={{ padding: '16px' }}>
                  <Link
                    href={`/admin/courses/${course.id}/content`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      background: 'rgba(108,34,249,0.12)',
                      border: '1px solid rgba(108,34,249,0.25)',
                      color: '#6C22F9',
                      padding: '6px 14px',
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 800,
                      textDecoration: 'none',
                    }}
                  >
                    <Video size={14} /> دروس الفيديوهات والمحتوى
                  </Link>
                </td>

                <td style={{ padding: '16px' }}>
                  <span
                    style={{
                      background:
                        course.status === 'مفعل'
                          ? 'rgba(34,197,94,0.15)'
                          : 'rgba(148,163,184,0.15)',
                      color:
                        course.status === 'مفعل'
                          ? '#22c55e'
                          : 'var(--text-muted)',
                      padding: '4px 12px',
                      borderRadius: 20,
                      fontSize: 12,
                      fontWeight: 800,
                    }}
                  >
                    {course.status}
                  </span>
                </td>
                <td style={{ padding: '16px', textAlign: 'left' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 8,
                    }}
                  >
                    <button
                      onClick={() => onEdit(course)}
                      style={{
                        background: 'rgba(108,34,249,0.1)',
                        color: '#6C22F9',
                        border: 'none',
                        borderRadius: 8,
                        padding: '7px 10px',
                        cursor: 'pointer',
                      }}
                      title="تعديل"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(course.id)}
                      style={{
                        background: 'rgba(239,68,68,0.1)',
                        color: '#ef4444',
                        border: 'none',
                        borderRadius: 8,
                        padding: '7px 10px',
                        cursor: 'pointer',
                      }}
                      title="حذف"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
