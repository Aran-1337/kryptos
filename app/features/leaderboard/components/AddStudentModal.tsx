'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  newName: string;
  setNewName: (val: string) => void;
  newGrade: string;
  setNewGrade: (val: string) => void;
  newGov: string;
  setNewGov: (val: string) => void;
  newPoints: string;
  setNewPoints: (val: string) => void;
  newScore: string;
  setNewScore: (val: string) => void;
  newBadge: string;
  setNewBadge: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AddStudentModal({
  isOpen,
  onClose,
  newName,
  setNewName,
  newGrade,
  setNewGrade,
  newGov,
  setNewGov,
  newPoints,
  setNewPoints,
  newScore,
  setNewScore,
  newBadge,
  setNewBadge,
  onSubmit,
}: AddStudentModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
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
              <h2 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>إضافة طالب متميز جديد</h2>
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
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>اسم الطالب الكامل</label>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  required
                  placeholder="أحمد محمد"
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>المرحلة</label>
                  <select
                    value={newGrade}
                    onChange={e => setNewGrade(e.target.value)}
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="أولى ثانوي">أولى ثانوي</option>
                    <option value="ثانية ثانوي">ثانية ثانوي</option>
                    <option value="تأسيس">تأسيس</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>المحافظة</label>
                  <input
                    value={newGov}
                    onChange={e => setNewGov(e.target.value)}
                    placeholder="القاهرة"
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>النقاط</label>
                  <input
                    type="number"
                    value={newPoints}
                    onChange={e => setNewPoints(e.target.value)}
                    required
                    placeholder="2500"
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>النسبة المئوية (%)</label>
                  <input
                    value={newScore}
                    onChange={e => setNewScore(e.target.value)}
                    placeholder="98.5"
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>الشارة التكريمية</label>
                <input
                  value={newBadge}
                  onChange={e => setNewBadge(e.target.value)}
                  placeholder="⭐ متفوق رائع"
                  style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12, padding: '11px 14px', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', borderRadius: 14, padding: '14px', fontSize: 15, fontWeight: 900, fontFamily: 'Tajawal, sans-serif', cursor: 'pointer', marginTop: 8 }}
              >
                إضافة للوحة الشرف
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
