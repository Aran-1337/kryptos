'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Exam, StudentResult } from '../types/exam.types';

interface ExamResultsModalProps {
  exam: Exam | null;
  onClose: () => void;
}

export default function ExamResultsModal({
  exam,
  onClose,
}: ExamResultsModalProps) {
  return (
    <AnimatePresence>
      {exam && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95 }} 
            style={{ 
              position: 'relative', 
              zIndex: 201, 
              width: '100%', 
              maxWidth: 750, 
              background: 'var(--surface)', 
              borderRadius: 24, 
              padding: 32, 
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)', 
              maxHeight: '85vh', 
              overflowY: 'auto',
              fontFamily: 'Tajawal, sans-serif',
              direction: 'rtl'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px' }}>تقرير درجات ومحاولات غش الطلاب</h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>امتحان: {exam.title}</p>
              </div>
              <button 
                type="button"
                onClick={onClose} 
                style={{ background: 'var(--bg)', border: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Student Results Table */}
            <div style={{ overflowX: 'auto', maxHeight: '55vh' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                <thead>
                  <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '12px', fontWeight: 700 }}>اسم الطالب</th>
                    <th style={{ padding: '12px', fontWeight: 700 }}>الدرجة النهائي</th>
                    <th style={{ padding: '12px', fontWeight: 700 }}>النسبة المئوية</th>
                    <th style={{ padding: '12px', fontWeight: 700 }}>عدد مرات مغادرة الشاشة</th>
                    <th style={{ padding: '12px', fontWeight: 700 }}>حالة الأمان والتقرير</th>
                  </tr>
                </thead>
                <tbody>
                  {(!exam.studentResults || exam.studentResults.length === 0) ? (
                    <tr>
                      <td colSpan={5} style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                        لم يقم أي طالب بتقديم هذا الامتحان بعد.
                      </td>
                    </tr>
                  ) : (
                    exam.studentResults.map((res: StudentResult) => (
                      <tr key={res.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px', fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>{res.name}</td>
                        <td style={{ padding: '12px', fontSize: 14, fontWeight: 900, color: '#6C22F9' }}>{res.score}</td>
                        <td style={{ padding: '12px', fontSize: 13, fontWeight: 700, color: '#10b981' }}>{res.percentage}</td>
                        
                        <td style={{ padding: '12px' }}>
                          {res.tabSwitchCount === 0 ? (
                            <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <ShieldCheck size={14} /> 0 (التزام كامل)
                            </span>
                          ) : (
                            <span style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <AlertTriangle size={14} /> غادر {res.tabSwitchCount} مرات
                            </span>
                          )}
                        </td>

                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            background: res.autoSubmitted ? 'rgba(239,68,68,0.15)' : 'var(--bg)',
                            color: res.autoSubmitted ? '#ef4444' : 'var(--text-muted)',
                            padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700
                          }}>
                            {res.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                type="button"
                onClick={onClose} 
                style={{ background: 'var(--bg)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '10px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
              >
                إغلاق التقرير
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
