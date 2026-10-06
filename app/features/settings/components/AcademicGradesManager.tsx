'use client';
import React from 'react';
import { GraduationCap, ToggleRight, ToggleLeft, Trash2, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AcademicGrade, DeleteGradeTarget } from '../types/settings.types';

interface AcademicGradesManagerProps {
  grades: AcademicGrade[];
  newGradeName: string;
  setNewGradeName: (val: string) => void;
  deleteGradeTarget: DeleteGradeTarget | null;
  setDeleteGradeTarget: (target: DeleteGradeTarget | null) => void;
  handleToggleGrade: (id: string) => void;
  handleAddGrade: () => void;
  handleDeleteGrade: (id: string, name: string) => void;
  handleConfirmDeleteGrade: () => void;
}

export default function AcademicGradesManager({
  grades,
  newGradeName,
  setNewGradeName,
  deleteGradeTarget,
  setDeleteGradeTarget,
  handleToggleGrade,
  handleAddGrade,
  handleDeleteGrade,
  handleConfirmDeleteGrade,
}: AcademicGradesManagerProps) {
  return (
    <>
      {/* Academic Grades Global Manager Card */}
      <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 16 }}>
          <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
            <GraduationCap size={22} color="#6C22F9" /> 🎓 إدارة المراحل والصفوف الدراسية بالمنصة (Academic Grades System)
          </h3>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>إلغاء أو تفعيل أي صف ينعكس أوتوماتيكياً في الواجهة ولوحة الأوائل والكورسات!</span>
        </div>

        {/* Grades Toggle List */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 20 }}>
          {grades.map(g => (
            <div key={g.id} style={{ background: 'var(--bg)', border: g.active ? '1.5px solid #6C22F9' : '1px solid var(--border)', padding: '14px 16px', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: '0 0 2px', fontSize: 14.5, fontWeight: 900, color: g.active ? 'var(--text-main)' : 'var(--text-muted)' }}>{g.name}</h4>
                <span style={{ fontSize: 11.5, color: g.active ? '#10b981' : '#ef4444', fontWeight: 800 }}>{g.active ? 'مفعلة بالمنصة 🟢' : 'معطلة (مخفية) 🔴'}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => handleToggleGrade(g.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: g.active ? '#10b981' : 'var(--text-muted)' }}
                  title={g.active ? 'إلغاء التفعيل' : 'تفعيل الصف'}
                >
                  {g.active ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteGrade(g.id, g.name)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                  title="حذف"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Grade Form */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'var(--bg)', padding: 12, borderRadius: 12, border: '1px solid var(--border)', maxWidth: 500 }}>
          <input
            type="text"
            value={newGradeName}
            onChange={e => setNewGradeName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAddGrade()}
            placeholder="إضافة صف دراسي جديد (مثلاً: ثالثة ثانوي)..."
            style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif' }}
          />
          <button
            type="button"
            onClick={handleAddGrade}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
          >
            <Plus size={14} /> إضافة الصف
          </button>
        </div>
      </div>

      {/* Delete Confirmation Popup Modal */}
      <AnimatePresence>
        {deleteGradeTarget && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteGradeTarget(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)', zIndex: 1001 }}
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{
                position: 'relative',
                zIndex: 1002,
                background: 'var(--surface)',
                borderRadius: 24,
                padding: 32,
                width: '100%',
                maxWidth: 440,
                textAlign: 'center',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                border: '1px solid var(--border)',
                fontFamily: 'Tajawal, sans-serif',
                direction: 'rtl',
              }}
            >
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: 'rgba(239,68,68,0.12)',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <Trash2 size={32} />
              </div>

              <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 10px' }}>
                تأكيد حذف المرحلة الدراسية ⚠️
              </h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, margin: '0 0 24px' }}>
                هل أنت متأكد من حذف المرحلة الدراسية <strong>"{deleteGradeTarget.name}"</strong>؟ لن تتمكن من التراجع عن هذه الخطوة.
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setDeleteGradeTarget(null)}
                  style={{ flex: 1, padding: '12px 20px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteGrade}
                  style={{ flex: 1, padding: '12px 20px', borderRadius: 12, border: 'none', background: '#ef4444', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(239,68,68,0.3)', fontFamily: 'Tajawal, sans-serif' }}
                >
                  نعم، تأكيد الحذف 🗑️
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
