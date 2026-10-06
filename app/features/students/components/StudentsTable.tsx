'use client';

import React from 'react';
import { Laptop, AlertTriangle, CheckCircle2, Edit3, Ban, Mail } from 'lucide-react';
import { Student } from '../types/student.types';
import { hasSuspiciousDevices } from '../utils/student.utils';

interface StudentsTableProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  onToggleBlock: (studentId: number, currentStatus: string) => void;
  onOpenNoteEditor: (student: Student) => void;
}

export default function StudentsTable({
  students,
  onSelectStudent,
  onToggleBlock,
  onOpenNoteEditor,
}: StudentsTableProps) {
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
            <th style={{ padding: '16px', fontWeight: 800 }}>الاسم</th>
            <th style={{ padding: '16px', fontWeight: 800 }}>الإيميل</th>
            <th style={{ padding: '16px', fontWeight: 800 }}>المرحلة</th>
            <th style={{ padding: '16px', fontWeight: 800 }}>الأجهزة المسجلة</th>
            <th style={{ padding: '16px', fontWeight: 800 }}>فحص الأمان</th>
            <th style={{ padding: '16px', fontWeight: 800 }}>الحالة</th>
            <th style={{ padding: '16px', fontWeight: 800, textAlign: 'left' }}>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
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
                لا يوجد طلاب مطابقين للبحث أو الفلتر المحدد.
              </td>
            </tr>
          ) : (
            students.map(student => {
              const isSuspicious = hasSuspiciousDevices(student);

              return (
                <tr
                  key={student.id}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    fontSize: 13.5,
                  }}
                >
                  <td style={{ padding: '16px', fontWeight: 800, color: 'var(--text-main)' }}>
                    {student.name}
                  </td>
                  <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>
                    {student.email}
                  </td>
                  <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>
                    {student.grade}
                  </td>

                  {/* Devices Count & Button */}
                  <td style={{ padding: '16px' }}>
                    <button
                      onClick={() => onSelectStudent(student)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        padding: '6px 12px',
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 800,
                        color: '#6C22F9',
                        cursor: 'pointer',
                      }}
                    >
                      <Laptop size={14} /> {student.devicesCount} أجهزة (معاينة)
                    </button>
                  </td>

                  {/* Security Check Status */}
                  <td style={{ padding: '16px' }}>
                    {isSuspicious ? (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: 'rgba(239,68,68,0.15)',
                          color: '#ef4444',
                          padding: '4px 12px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        <AlertTriangle size={14} /> أجهزة متعددة (شبكات مختلفة)
                      </span>
                    ) : (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          background: 'rgba(34,197,94,0.15)',
                          color: '#22c55e',
                          padding: '4px 12px',
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 800,
                        }}
                      >
                        <CheckCircle2 size={14} /> حساب آمن (نفس الشبكة)
                      </span>
                    )}
                  </td>

                  {/* Status Toggle */}
                  <td style={{ padding: '16px' }}>
                    <button
                      onClick={() => onToggleBlock(student.id, student.status)}
                      style={{
                        background:
                          student.status === 'نشط'
                            ? 'rgba(34,197,94,0.15)'
                            : 'rgba(239,68,68,0.15)',
                        color: student.status === 'نشط' ? '#22c55e' : '#ef4444',
                        border:
                          student.status === 'نشط'
                            ? '1px solid rgba(34,197,94,0.3)'
                            : '1px solid rgba(239,68,68,0.3)',
                        padding: '5px 14px',
                        borderRadius: 20,
                        fontSize: 12,
                        fontWeight: 800,
                        cursor: 'pointer',
                        fontFamily: 'Tajawal, sans-serif',
                      }}
                      title="اضغط لتغيير الحالة فوراً (فك الحظر / حظر)"
                    >
                      {student.status === 'نشط' ? 'نشط 🟢' : 'محظور 🔴 (فك الحظر)'}
                    </button>
                  </td>

                  {/* Actions */}
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
                        onClick={() => onOpenNoteEditor(student)}
                        style={{
                          background: 'rgba(108,34,249,0.12)',
                          color: '#6C22F9',
                          border: 'none',
                          borderRadius: 8,
                          padding: '7px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          fontSize: 12.5,
                          fontWeight: 800,
                        }}
                        title="كتابة وتعديل التوجيهات ونقاط القوة والتوصيات"
                      >
                        <Edit3 size={15} /> توجيه وملاحظات
                      </button>

                      {student.status === 'محظور' ? (
                        <button
                          onClick={() => onToggleBlock(student.id, student.status)}
                          style={{
                            background: 'rgba(34,197,94,0.15)',
                            color: '#22c55e',
                            border: '1px solid rgba(34,197,94,0.3)',
                            borderRadius: 8,
                            padding: '6px 12px',
                            fontSize: 12,
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontFamily: 'Tajawal, sans-serif',
                          }}
                          title="فك حظر الحساب"
                        >
                          <CheckCircle2 size={14} /> فك الحظر
                        </button>
                      ) : (
                        <button
                          onClick={() => onToggleBlock(student.id, student.status)}
                          style={{
                            background: 'rgba(239,68,68,0.1)',
                            color: '#ef4444',
                            border: 'none',
                            borderRadius: 8,
                            padding: '7px 10px',
                            cursor: 'pointer',
                          }}
                          title="حظر الطالب"
                        >
                          <Ban size={16} />
                        </button>
                      )}

                      <a
                        href={`mailto:${student.email}`}
                        style={{
                          background: 'rgba(59,130,246,0.1)',
                          color: '#3b82f6',
                          border: 'none',
                          borderRadius: 8,
                          padding: '7px 10px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                        }}
                        title="مراسلة"
                      >
                        <Mail size={16} />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
