'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, Save } from 'lucide-react';

interface SectionModalProps {
  show: boolean;
  titleInput: string;
  onTitleInputChange: (val: string) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function SectionModal({
  show,
  titleInput,
  onTitleInputChange,
  onClose,
  onSave,
}: SectionModalProps) {
  return (
    <AnimatePresence>
      {show && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 20,
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(5,2,20,0.75)',
              backdropFilter: 'blur(4px)',
              zIndex: 1001,
            }}
            onClick={onClose}
          />

          {/* Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            style={{
              position: 'relative',
              zIndex: 1002,
              width: '100%',
              maxWidth: 480,
              background: 'var(--surface)',
              borderRadius: 24,
              padding: 28,
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              border: '1px solid var(--border)',
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                paddingBottom: 16,
                borderBottom: '1px solid var(--border)',
              }}
            >
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: 'var(--text-main)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <BookOpen size={20} color="#6C22F9" /> إضافة باب / فصل جديد
              </h3>
              <button
                onClick={onClose}
                style={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  color: 'var(--text-main)',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  marginBottom: 8,
                }}
              >
                عنوان الباب أو الفصل
              </label>
              <input
                type="text"
                autoFocus
                value={titleInput}
                onChange={e => onTitleInputChange(e.target.value)}
                placeholder="مثال: الباب الثالث: مصفوفات بايثون المتقدمة"
                onKeyDown={e => {
                  if (e.key === 'Enter') onSave();
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: '1px solid var(--border)',
                  background: 'var(--bg)',
                  color: 'var(--text-main)',
                  outline: 'none',
                  fontSize: 14,
                  fontFamily: 'Tajawal, sans-serif',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div
              style={{
                marginTop: 24,
                paddingTop: 16,
                borderTop: '1px solid var(--border)',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 12,
              }}
            >
              <button
                onClick={onClose}
                style={{
                  background: 'var(--bg)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: 'Tajawal, sans-serif',
                }}
              >
                إلغاء
              </button>
              <button
                onClick={onSave}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#6C22F9',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: 'pointer',
                  fontFamily: 'Tajawal, sans-serif',
                }}
              >
                <Save size={16} /> إضافة الباب
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
