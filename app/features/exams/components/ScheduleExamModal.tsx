'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Shuffle, Save } from 'lucide-react';
import { Question } from '../types/exam.types';

interface ScheduleExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  examTitle: string;
  setExamTitle: (val: string) => void;
  examCourse: string;
  setExamCourse: (val: string) => void;
  examDuration: string;
  setExamDuration: (val: string) => void;
  shuffleQuestions: boolean;
  setShuffleQuestions: (val: boolean) => void;
  shuffleOptions: boolean;
  setShuffleOptions: (val: boolean) => void;
  questionsList: Question[];
  onRemoveQuestion: (id: string) => void;
  qText: string;
  setQText: (val: string) => void;
  qOpt0: string;
  setQOpt0: (val: string) => void;
  qOpt1: string;
  setQOpt1: (val: string) => void;
  qOpt2: string;
  setQOpt2: (val: string) => void;
  qOpt3: string;
  setQOpt3: (val: string) => void;
  qCorrectIndex: number;
  setQCorrectIndex: (val: number) => void;
  onAddQuestion: () => void;
}

export default function ScheduleExamModal({
  isOpen,
  onClose,
  onSave,
  examTitle,
  setExamTitle,
  examCourse,
  setExamCourse,
  examDuration,
  setExamDuration,
  shuffleQuestions,
  setShuffleQuestions,
  shuffleOptions,
  setShuffleOptions,
  questionsList,
  onRemoveQuestion,
  qText,
  setQText,
  qOpt0,
  setQOpt0,
  qOpt1,
  setQOpt1,
  qOpt2,
  setQOpt2,
  qOpt3,
  setQOpt3,
  qCorrectIndex,
  setQCorrectIndex,
  onAddQuestion,
}: ScheduleExamModalProps) {
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
              maxWidth: 680, 
              background: 'var(--surface)', 
              borderRadius: 24, 
              padding: 32, 
              zIndex: 201, 
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)', 
              maxHeight: '85vh', 
              overflowY: 'auto',
              fontFamily: 'Tajawal, sans-serif',
              direction: 'rtl'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>إنشاء امتحان مجدول وبناء الأسئلة</h3>
              <button 
                onClick={onClose} 
                style={{ background: 'var(--bg)', border: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>عنوان الامتحان</label>
                <input 
                  type="text" 
                  value={examTitle} 
                  onChange={e => setExamTitle(e.target.value)} 
                  placeholder="مثال: امتحان شهر أكتوبر الشامل - بايثون والخوارزميات" 
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>الكورس التابع له</label>
                  <select 
                    value={examCourse} 
                    onChange={e => setExamCourse(e.target.value)} 
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}
                  >
                    <option value="كورس أولى ثانوي - الترم الأول">كورس أولى ثانوي - الترم الأول</option>
                    <option value="كورس ثانية ثانوي - الترم الأول">كورس ثانية ثانوي - الترم الأول</option>
                    <option value="الكورس التأسيسي في البرمجة">الكورس التأسيسي في البرمجة</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>مدة التايمر (بالدقائق)</label>
                  <input 
                    type="number" 
                    value={examDuration} 
                    onChange={e => setExamDuration(e.target.value)} 
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} 
                  />
                </div>
              </div>

              {/* Question Builder Box */}
              <div style={{ background: 'var(--bg)', borderRadius: 16, padding: 20, border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: 14, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>📝 أسئلة الامتحان المضافة ({questionsList.length})</span>
                </h4>

                {/* List of draft questions */}
                {questionsList.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {questionsList.map((q, idx) => (
                      <div key={q.id} style={{ background: 'var(--surface)', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>س{idx + 1}: {q.text}</span>
                        <button 
                          type="button"
                          onClick={() => onRemoveQuestion(q.id)} 
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input fields to add question */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input 
                    value={qText} 
                    onChange={e => setQText(e.target.value)} 
                    placeholder="نص السؤال..." 
                    style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} 
                  />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    <input value={qOpt0} onChange={e => setQOpt0(e.target.value)} placeholder="خيار 1 (A)" style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 12, fontFamily: 'Tajawal, sans-serif', outline: 'none' }} />
                    <input value={qOpt1} onChange={e => setQOpt1(e.target.value)} placeholder="خيار 2 (B)" style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 12, fontFamily: 'Tajawal, sans-serif', outline: 'none' }} />
                    <input value={qOpt2} onChange={e => setQOpt2(e.target.value)} placeholder="خيار 3 (C)" style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 12, fontFamily: 'Tajawal, sans-serif', outline: 'none' }} />
                    <input value={qOpt3} onChange={e => setQOpt3(e.target.value)} placeholder="خيار 4 (D)" style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 12, fontFamily: 'Tajawal, sans-serif', outline: 'none' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>الإجابة الصحيحة:</span>
                    <select 
                      value={qCorrectIndex} 
                      onChange={e => setQCorrectIndex(Number(e.target.value))} 
                      style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 12, fontFamily: 'Tajawal, sans-serif' }}
                    >
                      <option value={0}>A (الخيار الأول)</option>
                      <option value={1}>B (الخيار الثاني)</option>
                      <option value={2}>C (الخيار الثالث)</option>
                      <option value={3}>D (الخيار الرابع)</option>
                    </select>
                    <button 
                      type="button" 
                      onClick={onAddQuestion} 
                      style={{ marginRight: 'auto', background: '#6C22F9', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                    >
                      + إضافة السؤال
                    </button>
                  </div>
                </div>
              </div>

              {/* Anti Cheating Toggles */}
              <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 14, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Shuffle size={15} color="#6C22F9" /> خيارات خلط الأسئلة ومنع الغش
                </h4>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)' }}>
                  <input type="checkbox" checked={shuffleQuestions} onChange={e => setShuffleQuestions(e.target.checked)} style={{ accentColor: '#6C22F9' }} />
                  خلط ترتيب الأسئلة عشوائياً لكل طالب (Random Questions)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)' }}>
                  <input type="checkbox" checked={shuffleOptions} onChange={e => setShuffleOptions(e.target.checked)} style={{ accentColor: '#6C22F9' }} />
                  خلط ترتيب الخيارات (A, B, C, D) لكل سؤال
                </label>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button 
                type="button"
                onClick={onClose} 
                style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '11px 20px', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
              >
                إلغاء
              </button>
              <button 
                type="button"
                onClick={onSave} 
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', padding: '11px 24px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
              >
                <Save size={16} /> حفظ الامتحان المجدول
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
