'use client';
import React from 'react';
import Link from 'next/link';
import { FileCheck2, HelpCircle, Eye, ExternalLink, Trash2 } from 'lucide-react';
import { Exam } from '../types/exam.types';

interface ExamsTableProps {
  exams: Exam[];
  onManageQuestions: (exam: Exam) => void;
  onViewResults: (exam: Exam) => void;
  onDeleteExam: (id: number, title: string) => void;
}

export default function ExamsTable({
  exams,
  onManageQuestions,
  onViewResults,
  onDeleteExam,
}: ExamsTableProps) {
  if (exams.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
        لا توجد أي امتحانات مطابقة للبحث.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
        <thead>
          <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '16px', fontWeight: 700 }}>عنوان الامتحان</th>
            <th style={{ padding: '16px', fontWeight: 700 }}>الكورس التابع له</th>
            <th style={{ padding: '16px', fontWeight: 700 }}>عدد الأسئلة</th>
            <th style={{ padding: '16px', fontWeight: 700 }}>تاريخ ووقت الفتح</th>
            <th style={{ padding: '16px', fontWeight: 700 }}>المدة</th>
            <th style={{ padding: '16px', fontWeight: 700 }}>تقرير الغش والنتائج</th>
            <th style={{ padding: '16px', fontWeight: 700, textAlign: 'left' }}>إدارة الأسئلة والمعاينة</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam) => (
            <tr key={exam.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '16px', fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <FileCheck2 size={18} color="#6C22F9" /> {exam.title}
                </div>
              </td>
              <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>{exam.course}</td>
              
              {/* Question Count Badge & Quick Question Manager Trigger */}
              <td style={{ padding: '16px' }}>
                <button
                  type="button"
                  onClick={() => onManageQuestions({ ...exam })}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'rgba(108,34,249,0.1)', color: '#6C22F9',
                    border: '1px solid rgba(108,34,249,0.2)', padding: '5px 12px',
                    borderRadius: 10, fontSize: 12, fontWeight: 800, cursor: 'pointer',
                    fontFamily: 'Tajawal, sans-serif'
                  }}
                >
                  <HelpCircle size={14} /> {exam.questions?.length || exam.questionsCount} سؤال (إدارة الأسئلة)
                </button>
              </td>

              <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-main)', fontWeight: 700 }}>{exam.startTime}</td>
              <td style={{ padding: '16px', fontSize: 13, fontWeight: 800, color: '#10b981' }}>{exam.duration}</td>
              
              {/* Results & Cheating Log Button */}
              <td style={{ padding: '16px' }}>
                <button 
                  type="button"
                  onClick={() => onViewResults(exam)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    background: 'var(--bg)', border: '1px solid var(--border)',
                    color: 'var(--text-main)', padding: '6px 12px', borderRadius: 10,
                    fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif'
                  }}
                >
                  <Eye size={14} /> {exam.submissionsCount} إجابة (تقرير الغش)
                </button>
              </td>

              <td style={{ padding: '16px', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
                  <Link 
                    href={`/exams/${exam.id}`} 
                    target="_blank"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'var(--bg)', border: '1px solid var(--border)',
                      color: '#6C22F9', padding: '6px 12px', borderRadius: 10,
                      fontSize: 12, fontWeight: 800, textDecoration: 'none'
                    }}
                  >
                    <ExternalLink size={14} /> معاينة كطالب
                  </Link>
                  <button
                    type="button"
                    onClick={() => onDeleteExam(exam.id, exam.title)}
                    style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer' }}
                    title="حذف الامتحان"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
