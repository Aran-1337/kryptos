'use client';
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus } from 'lucide-react';
import { Exam } from '../types/exam.types';

interface QuestionBuilderModalProps {
  exam: Exam | null;
  onClose: () => void;
  onSave: () => void;
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
  qPoints: string;
  setQPoints: (val: string) => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (id: string) => void;
}

export default function QuestionBuilderModal({
  exam,
  onClose,
  onSave,
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
  qPoints,
  setQPoints,
  onAddQuestion,
  onRemoveQuestion,
}: QuestionBuilderModalProps) {
  return (
    <AnimatePresence>
      {exam && (
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
              maxWidth: 720, 
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
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px' }}>
                  إدارة أسئلة: {exam.title} 📝
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                  إجمالي الأسئلة المضافة: {exam.questions?.length || 0} أسئلة
                </p>
              </div>
              <button 
                onClick={onClose} 
                style={{ background: 'var(--bg)', border: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Questions List */}
            <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(!exam.questions || exam.questions.length === 0) ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20 }}>لا توجد أسئلة مضافة بعد لهذا الامتحان.</p>
              ) : (
                exam.questions.map((q, idx) => (
                  <div key={q.id} style={{ background: 'var(--bg)', borderRadius: 14, padding: 16, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>
                        س{idx + 1}: {q.text} ({q.points} درجات)
                      </h4>
                      <button
                        onClick={() => onRemoveQuestion(q.id)}
                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 8 }}>
                      {q.options?.map((opt, oIdx) => (
                        <div key={oIdx} style={{ fontSize: 13, padding: '6px 12px', borderRadius: 8, background: oIdx === q.correctOptionIndex ? 'rgba(34,197,94,0.15)' : 'var(--surface)', color: oIdx === q.correctOptionIndex ? '#22c55e' : 'var(--text-muted)', fontWeight: oIdx === q.correctOptionIndex ? 800 : 500, border: `1px solid ${oIdx === q.correctOptionIndex ? '#22c55e' : 'var(--border)'}` }}>
                          {oIdx === q.correctOptionIndex ? '✅ ' : ''}{opt}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add New Question Section inside Manager */}
            <div style={{ background: 'var(--bg)', borderRadius: 16, padding: 20, border: '1px dashed var(--border)' }}>
              <h4 style={{ margin: '0 0 14px', fontSize: 15, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Plus size={18} color="#6C22F9" /> إضافة سؤال جديد للامتحان
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>نص السؤال</label>
                  <input 
                    value={qText} 
                    onChange={e => setQText(e.target.value)} 
                    placeholder="مثال: ما هو ناتج تنفيذ الأمر print(3 * 4)؟"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>الخيار الأول (A)</label>
                    <input 
                      value={qOpt0} 
                      onChange={e => setQOpt0(e.target.value)} 
                      placeholder="الخيار الأول"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>الخيار الثاني (B)</label>
                    <input 
                      value={qOpt1} 
                      onChange={e => setQOpt1(e.target.value)} 
                      placeholder="الخيار الثاني"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>الخيار الثالث (C)</label>
                    <input 
                      value={qOpt2} 
                      onChange={e => setQOpt2(e.target.value)} 
                      placeholder="الخيار الثالث (اختياري)"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>الخيار الرابع (D)</label>
                    <input 
                      value={qOpt3} 
                      onChange={e => setQOpt3(e.target.value)} 
                      placeholder="الخيار الرابع (اختياري)"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>الإجابة الصحيحة ✅</label>
                    <select 
                      value={qCorrectIndex} 
                      onChange={e => setQCorrectIndex(Number(e.target.value))}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    >
                      <option value={0}>الخيار الأول (A)</option>
                      <option value={1}>الخيار الثاني (B)</option>
                      <option value={2}>الخيار الثالث (C)</option>
                      <option value={3}>الخيار الرابع (D)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>درجة السؤال</label>
                    <input 
                      type="number" 
                      value={qPoints} 
                      onChange={e => setQPoints(e.target.value)} 
                      placeholder="5"
                      style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} 
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onAddQuestion}
                  style={{ background: '#6C22F9', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', marginTop: 4 }}
                >
                  + إدراج هذا السؤال القائمة
                </button>
              </div>
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button 
                onClick={onSave} 
                style={{ background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
              >
                حفظ أسئلة الامتحان
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
