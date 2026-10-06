'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Upload, Video, RefreshCw } from 'lucide-react';

interface LessonModalProps {
  show: boolean;
  lessonTitle: string;
  onLessonTitleChange: (val: string) => void;
  videoProvider?: string;
  onVideoProviderChange?: (val: string) => void;
  duration: string;
  onDurationChange: (val: string) => void;
  videoUrl?: string;
  onVideoUrlChange?: (val: string) => void;
  videoFile?: File | null;
  onVideoFileChange?: (file: File | null) => void;
  uploadProgress?: boolean;
  saveLoading?: boolean;
  pdfUrl: string;
  onPdfUrlChange: (val: string) => void;
  isPreview: boolean;
  onIsPreviewChange: (val: boolean) => void;
  onClose: () => void;
  onSave: () => void;
}

export default function LessonModal({
  show,
  lessonTitle,
  onLessonTitleChange,
  videoProvider,
  onVideoProviderChange,
  duration,
  onDurationChange,
  videoUrl,
  onVideoUrlChange,
  videoFile,
  onVideoFileChange,
  uploadProgress,
  saveLoading,
  pdfUrl,
  onPdfUrlChange,
  isPreview,
  onIsPreviewChange,
  onClose,
  onSave,
}: LessonModalProps) {
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
              maxWidth: 620,
              background: 'var(--surface)',
              borderRadius: 24,
              padding: 32,
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              border: '1px solid var(--border)',
              maxHeight: '90vh',
              overflowY: 'auto',
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
                }}
              >
                إضافة درس جديد وتأمين الفيديو (Signed Stream)
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    marginBottom: 6,
                  }}
                >
                  عنوان الدرس
                </label>
                <input
                  type="text"
                  value={lessonTitle}
                  onChange={e => onLessonTitleChange(e.target.value)}
                  placeholder="مثال: الشرح العملي لخرائط التدفق"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
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

              {/* Video File Picker for Multipart Upload */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    marginBottom: 6,
                  }}
                >
                  رفع ملف الفيديو (سيرفر التخزين الآمن Cloudinary)
                </label>
                <div
                  style={{
                    border: '2px dashed var(--border)',
                    borderRadius: 14,
                    padding: '18px 16px',
                    textAlign: 'center',
                    background: 'var(--bg)',
                    position: 'relative',
                  }}
                >
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime,video/x-matroska"
                    onChange={e => {
                      const file = e.target.files?.[0] || null;
                      if (file && file.size > 100 * 1024 * 1024) {
                        alert('حجم الفيديو يتجاوز الحد الأقصى المسموح به (100MB)');
                        return;
                      }
                      onVideoFileChange?.(file);
                    }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      opacity: 0,
                      cursor: 'pointer',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                  {videoFile ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                      <Video size={24} color="#6C22F9" />
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                          {videoFile.name}
                        </p>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                          {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          onVideoFileChange?.(null);
                        }}
                        style={{
                          background: 'rgba(239,68,68,0.1)',
                          border: 'none',
                          color: '#ef4444',
                          borderRadius: '50%',
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload size={28} color="#6C22F9" style={{ margin: '0 auto 8px' }} />
                      <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                        اضغط هنا لاختيار ملف الفيديو من جهازك
                      </p>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                        الصيغ المدعومة: MP4, WebM, MOV, MKV (الحد الأقصى: 100MB)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    marginBottom: 6,
                  }}
                >
                  مدة الدرس التقديرية (بالدقائق والثواني)
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={e => onDurationChange(e.target.value)}
                  placeholder="مثال: 25:30"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
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

              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    marginBottom: 6,
                  }}
                >
                  رابط مذكرة PDF المرفقة (اختياري)
                </label>
                <input
                  type="text"
                  value={pdfUrl}
                  onChange={e => onPdfUrlChange(e.target.value)}
                  placeholder="/memento1.pdf أو رابط PDF"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
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

              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#6C22F9',
                }}
              >
                <input
                  type="checkbox"
                  checked={isPreview}
                  onChange={e => onIsPreviewChange(e.target.checked)}
                  style={{ accentColor: '#6C22F9' }}
                />
                تفعيل كدرس معاينة مجانية (Free Preview) للطلاب الجدد
              </label>
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
                disabled={saveLoading || uploadProgress}
                style={{
                  background: 'var(--bg)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border)',
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: saveLoading || uploadProgress ? 'not-allowed' : 'pointer',
                  fontFamily: 'Tajawal, sans-serif',
                }}
              >
                إلغاء
              </button>
              <button
                onClick={onSave}
                disabled={saveLoading || uploadProgress}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: saveLoading || uploadProgress ? '#a855f7' : '#6C22F9',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 24px',
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: saveLoading || uploadProgress ? 'not-allowed' : 'pointer',
                  fontFamily: 'Tajawal, sans-serif',
                }}
              >
                {saveLoading || uploadProgress ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>جارِ حفظ الدرس ورفع الفيديو...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>حفظ الدرس ورفع الفيديو ⚡️</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
