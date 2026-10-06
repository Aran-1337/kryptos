'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { Student } from '../types/student.types';

interface StudentNoteModalProps {
  student: Student | null;
  noteText: string;
  onNoteChange: (text: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function StudentNoteModal({
  student,
  noteText,
  onNoteChange,
  onClose,
  onSave,
}: StudentNoteModalProps) {
  return (
    <AnimatePresence>
      {student && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
            }}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            style={{
              position: 'relative',
              background: 'var(--surface)',
              borderRadius: 24,
              border: '1px solid var(--border)',
              padding: 28,
              width: '100%',
              maxWidth: 580,
              zIndex: 1000,
              fontFamily: 'Tajawal, sans-serif',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <div>
                <h3
                  style={{
                    margin: '0 0 4px',
                    fontSize: 18,
                    fontWeight: 900,
                    color: 'var(--text-main)',
                  }}
                >
                  تعديل التوجيه والتقرير الخاص بالطالب 📝
                </h3>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  الطالب: <strong>{student.name}</strong> ({student.grade})
                </span>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#6C22F9',
                  marginBottom: 6,
                }}
              >
                نص توجيه وملاحظة المهندس عبدالرحمن حامد المخصصة:
              </label>
              <textarea
                value={noteText}
                onChange={e => onNoteChange(e.target.value)}
                rows={4}
                placeholder="اكتب توجيهك المباشر للطالب هنا..."
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--text-main)',
                  fontSize: 14,
                  fontFamily: 'Tajawal, sans-serif',
                  resize: 'vertical',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              <p
                style={{
                  fontSize: 12,
                  color: 'var(--text-muted)',
                  marginTop: 8,
                  lineHeight: 1.5,
                }}
              >
                💡 <strong>ملاحظة:</strong> كروت (نقاط القوة) و (التوصيات للتحسين) يتم
                احتسابها وتوليدها أوتوماتيكياً بواسطة النظام بناءً على أداء الطالب
                وأخطائه في الامتحانات والمشاهدات.
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 12,
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                إلغاء
              </button>
              <button
                onClick={onSave}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 24px',
                  borderRadius: 10,
                  border: 'none',
                  background: '#6C22F9',
                  color: '#fff',
                  fontWeight: 800,
                  cursor: 'pointer',
                  fontFamily: 'Tajawal, sans-serif',
                }}
              >
                <Save size={16} /> حفظ التوجيه والملاحظات
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
