'use client';

import React from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Tag } from 'lucide-react';
import { Course, CourseGrade, CourseType, CourseStatus } from '../types/course.types';

interface CourseModalProps {
  show: boolean;
  editingCourse: Course | null;
  title: string;
  onTitleChange: (v: string) => void;
  grade: CourseGrade;
  onGradeChange: (v: CourseGrade) => void;
  type: CourseType;
  onTypeChange: (v: CourseType) => void;
  originalPrice: string;
  onOriginalPriceChange: (v: string) => void;
  price: string;
  onPriceChange: (v: string) => void;
  hasDiscount: boolean;
  onHasDiscountChange: (v: boolean) => void;
  imageUrl: string;
  onImageUrlChange: (v: string) => void;
  status: CourseStatus;
  onStatusChange: (v: CourseStatus) => void;
  onClose: () => void;
  onSave: () => void;
  apiError?: string;
  saveLoading?: boolean;
}

export default function CourseModal({
  show,
  editingCourse,
  title,
  onTitleChange,
  grade,
  onGradeChange,
  type,
  onTypeChange,
  originalPrice,
  onOriginalPriceChange,
  price,
  onPriceChange,
  hasDiscount,
  onHasDiscountChange,
  imageUrl,
  onImageUrlChange,
  status,
  onStatusChange,
  onClose,
  onSave,
  apiError,
  saveLoading,
}: CourseModalProps) {
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
              maxWidth: 640,
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
                {editingCourse
                  ? 'تعديل بيانات الكورس والخصم'
                  : 'إضافة كورس جديد مع خصم'}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Cover image selection */}
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
                  رابط صورة غلاف الكورس (Cover Image)
                </label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <div
                    style={{
                      position: 'relative',
                      width: 64,
                      height: 64,
                      borderRadius: 12,
                      overflow: 'hidden',
                      background: '#16133a',
                      flexShrink: 0,
                      border: '1px solid var(--border)',
                    }}
                  >
                    <Image
                      src={imageUrl || '/th1.webp'}
                      alt="Preview"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={e => onImageUrlChange(e.target.value)}
                    placeholder="مثال: /th1.webp أو رابط صورة"
                    style={{
                      flex: 1,
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
                  عنوان الكورس
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => onTitleChange(e.target.value)}
                  placeholder="مثال: كورس البرمجة والذكاء الاصطناعي"
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

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                }}
              >
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
                    المرحلة الدراسية
                  </label>
                  <select
                    value={grade}
                    onChange={e => onGradeChange(e.target.value as CourseGrade)}
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
                      cursor: 'pointer',
                    }}
                  >
                    <option value="أولى ثانوي">أولى ثانوي</option>
                    <option value="ثانية ثانوي">ثانية ثانوي</option>
                    <option value="تأسيس">كورس تأسيسي</option>
                  </select>
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
                    نوع الكورس
                  </label>
                  <select
                    value={type}
                    onChange={e => onTypeChange(e.target.value as CourseType)}
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
                      cursor: 'pointer',
                    }}
                  >
                    <option value="شرح المنهج">شرح المنهج</option>
                    <option value="كورس تأسيسي">كورس تأسيسي</option>
                    <option value="بنك الأسئلة">بنك الأسئلة</option>
                    <option value="حل الامتحانات">حل الامتحانات</option>
                    <option value="المراجعة النهائية">المراجعة النهائية</option>
                  </select>
                </div>
              </div>

              {/* Price & Discount Settings */}
              <div
                style={{
                  background: 'var(--bg)',
                  padding: 18,
                  borderRadius: 16,
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <h4
                    style={{
                      margin: 0,
                      fontSize: 14,
                      fontWeight: 800,
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Tag size={16} color="#6C22F9" /> إعدادات السعر والخصم
                  </h4>
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 800,
                      cursor: 'pointer',
                      color: '#6C22F9',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={hasDiscount}
                      onChange={e => onHasDiscountChange(e.target.checked)}
                      style={{ accentColor: '#6C22F9' }}
                    />
                    تفعيل خصم السعر
                  </label>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 16,
                  }}
                >
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
                      {hasDiscount
                        ? 'السعر الأصلي (قبل الخصم)'
                        : 'سعر الكورس الحالي'}
                    </label>
                    <input
                      type="number"
                      value={hasDiscount ? originalPrice : price}
                      onChange={e =>
                        hasDiscount
                          ? onOriginalPriceChange(e.target.value)
                          : onPriceChange(e.target.value)
                      }
                      placeholder="مثال: 500"
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: 10,
                        border: '1px solid var(--border)',
                        background: 'var(--surface)',
                        color: 'var(--text-main)',
                        outline: 'none',
                        fontSize: 14,
                        fontFamily: 'Tajawal, sans-serif',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {hasDiscount && (
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: 13,
                          fontWeight: 700,
                          color: '#ef4444',
                          marginBottom: 6,
                        }}
                      >
                        السعر النهائي (بعد الخصم)
                      </label>
                      <input
                        type="number"
                        value={price}
                        onChange={e => onPriceChange(e.target.value)}
                        placeholder="مثال: 350"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: 10,
                          border: '1px solid var(--border)',
                          background: 'var(--surface)',
                          color: 'var(--text-main)',
                          outline: 'none',
                          fontSize: 14,
                          fontFamily: 'Tajawal, sans-serif',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  )}
                </div>

                {hasDiscount &&
                  originalPrice &&
                  price &&
                  Number(originalPrice) > Number(price) && (
                    <div
                      style={{
                        background: 'rgba(16,185,129,0.15)',
                        color: '#10b981',
                        border: '1px solid rgba(16,185,129,0.3)',
                        padding: '8px 12px',
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 800,
                        textAlign: 'center',
                      }}
                    >
                      🎉 سيظهر للطلاب خصم بمقدار:{' '}
                      {Math.round(
                        ((Number(originalPrice) - Number(price)) /
                          Number(originalPrice)) *
                          100
                      )}
                      %
                    </div>
                  )}
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
                  حالة ظهور الكورس
                </label>
                <select
                  value={status}
                  onChange={e => onStatusChange(e.target.value as CourseStatus)}
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
                    cursor: 'pointer',
                  }}
                >
                  <option value="مفعل">مفعل (ظاهر للطلاب)</option>
                  <option value="مسودة">مسودة (مخفي)</option>
                </select>
              </div>
            </div>

            {apiError && (
              <div
                style={{
                  marginTop: 16,
                  padding: '10px 14px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 10,
                  color: '#ef4444',
                  fontSize: 13,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span>⚠️</span>
                <span>{apiError}</span>
              </div>
            )}

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
                <Save size={16} /> حفظ الكورس والخصم
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
