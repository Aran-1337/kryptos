'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { StudentLeaderboardItem } from '../types/leaderboard.types';

interface EditStudentModalProps {
  student: StudentLeaderboardItem | null;
  onClose: () => void;
  onUpdateStudent: (updated: StudentLeaderboardItem) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EditStudentModal({
  student,
  onClose,
  onUpdateStudent,
  onSubmit,
}: EditStudentModalProps) {
  return (
    <AnimatePresence>
      {student && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: 480,
              background: 'var(--surface)',
              borderRadius: 24,
              padding: 32,
              zIndex: 201,
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
              maxHeight: '85vh',
              overflowY: 'auto',
              direction: 'rtl',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>
                تعديل بيانات {student.name}
              </h2>
              <button
                type="button"
                onClick={onClose}
                style={{ background: 'var(--bg)', border: 'none', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>الاسم الكامل</label>
                <input
                  value={student.name}
                  onChange={e => onUpdateStudent({ ...student, name: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>النقاط</label>
                  <input
                    type="number"
                    value={student.points}
                    onChange={e => onUpdateStudent({ ...student, points: Number(e.target.value) })}
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>النسبة المئوية</label>
                  <input
                    value={student.score}
                    onChange={e => onUpdateStudent({ ...student, score: e.target.value })}
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>الشارة التكريمية</label>
                <input
                  value={student.badge}
                  onChange={e => onUpdateStudent({ ...student, badge: e.target.value })}
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="submit"
                  style={{ flex: 1, background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', borderRadius: 14, padding: '13px', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                >
                  حفظ التغييرات
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{ background: 'var(--bg)', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: 14, padding: '13px 20px', fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
