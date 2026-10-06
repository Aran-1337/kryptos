'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { QuestRewardType } from '../types/quest.types';
import { AcademicGrade } from '@/app/utils/academicGrades';

interface QuestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  questGrade: string;
  setQuestGrade: (val: string) => void;
  availableGrades: AcademicGrade[];
  pointsReward: string;
  setPointsReward: (val: string) => void;
  icon: string;
  setIcon: (val: string) => void;
  rewardType: QuestRewardType;
  setRewardType: (val: QuestRewardType) => void;
  rewardAmount: string;
  setRewardAmount: (val: string) => void;
  rewardGiftName: string;
  setRewardGiftName: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function QuestFormModal({
  isOpen,
  onClose,
  isEditing,
  title,
  setTitle,
  description,
  setDescription,
  questGrade,
  setQuestGrade,
  availableGrades,
  pointsReward,
  setPointsReward,
  icon,
  setIcon,
  rewardType,
  setRewardType,
  rewardAmount,
  setRewardAmount,
  rewardGiftName,
  setRewardGiftName,
  onSubmit,
}: QuestFormModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
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
              maxWidth: 560,
              zIndex: 1000,
              fontFamily: 'Tajawal, sans-serif',
              maxHeight: '90vh',
              overflowY: 'auto',
              direction: 'rtl',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--text-main)' }}>
                {isEditing ? 'تعديل بيانات التحدي 🎯' : 'إنشاء تحدي ومكافأة جديدة 🎯'}
              </h3>
              <button
                type="button"
                onClick={onClose}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
                  عنوان التحدي
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  placeholder="مثلاً: بطل الخوارزميات أو وسام المتفوق البرمجي"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    color: 'var(--text-main)',
                    fontSize: 13.5,
                    fontFamily: 'Tajawal, sans-serif',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
                  وصف التحدي والهدف المطلوبة
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  rows={2}
                  placeholder="حل امتحان الخوارزميات والحصول على درجة ممتاز..."
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    color: 'var(--text-main)',
                    fontSize: 13.5,
                    fontFamily: 'Tajawal, sans-serif',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Target Academic Grade Selection */}
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
                  المرحلة الدراسية المخصصة لهذا التحدي 🎓
                </label>
                <select
                  value={questGrade}
                  onChange={e => setQuestGrade(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    color: 'var(--text-main)',
                    fontSize: 13.5,
                    fontFamily: 'Tajawal, sans-serif',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="all">كافة المراحل الدراسية (متاح لجميع الطلاب) 🌐</option>
                  {availableGrades.map(g => (
                    <option key={g.id} value={g.name}>{g.name} 🎓</option>
                  ))}
                </select>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  يحدد هذا الخيار أي دفعة وسنة دراسية سيظهر لها هذا التحدي في حساب الطالب.
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
                    نقاط XP المكافأة
                  </label>
                  <input
                    type="number"
                    value={pointsReward}
                    onChange={e => setPointsReward(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      color: 'var(--text-main)',
                      fontSize: 13.5,
                      fontFamily: 'Tajawal, sans-serif',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
                    أيقونة التحدي
                  </label>
                  <select
                    value={icon}
                    onChange={e => setIcon(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      color: 'var(--text-main)',
                      fontSize: 13.5,
                      fontFamily: 'Tajawal, sans-serif',
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="🏆">🏆 كاس التفوق</option>
                    <option value="🎁">🎁 هدية ملموسة</option>
                    <option value="⚡️">⚡️ صاعقة التميز</option>
                    <option value="🥇">🥇 وسام ذهبي</option>
                    <option value="🔥">🔥 شعلة الشغف</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
                  نوع الجائزة والمكافأة
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <button
                    type="button"
                    onClick={() => setRewardType('money')}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: rewardType === 'money' ? '2px solid #10b981' : '1px solid var(--border)',
                      background: rewardType === 'money' ? 'rgba(16,185,129,0.12)' : 'var(--bg)',
                      color: rewardType === 'money' ? '#10b981' : 'var(--text-main)',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontFamily: 'Tajawal, sans-serif',
                    }}
                  >
                    💰 مبلغ مالي بالمحفظة
                  </button>
                  <button
                    type="button"
                    onClick={() => setRewardType('physical')}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: rewardType === 'physical' ? '2px solid #f59e0b' : '1px solid var(--border)',
                      background: rewardType === 'physical' ? 'rgba(245,158,11,0.12)' : 'var(--bg)',
                      color: rewardType === 'physical' ? '#d97706' : 'var(--text-main)',
                      fontWeight: 800,
                      cursor: 'pointer',
                      fontFamily: 'Tajawal, sans-serif',
                    }}
                  >
                    🎁 هدية عينية (شحن)
                  </button>
                </div>
              </div>

              {rewardType === 'money' ? (
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
                    المبلغ المالي المعطى للرصيد (بالجنيه)
                  </label>
                  <input
                    type="number"
                    value={rewardAmount}
                    onChange={e => setRewardAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      color: 'var(--text-main)',
                      fontSize: 13.5,
                      fontFamily: 'Tajawal, sans-serif',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>
                    تفاصيل الهدية العينية (تصل الطالب شحن للعنوان)
                  </label>
                  <input
                    type="text"
                    value={rewardGiftName}
                    onChange={e => setRewardGiftName(e.target.value)}
                    placeholder="مثلاً: كتاب ورقي مطبوع + ميدالية التفوق"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      color: 'var(--text-main)',
                      fontSize: 13.5,
                      fontFamily: 'Tajawal, sans-serif',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                <button
                  type="button"
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
                  type="submit"
                  style={{
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
                  حفظ التحدي
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
