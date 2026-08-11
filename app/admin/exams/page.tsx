'use client';
import { useState } from 'react';
import { Plus, Search, FileCheck2, Shuffle, ExternalLink, X, Save, Eye, AlertTriangle, ShieldCheck, Trash2, HelpCircle, CheckCircle2, Edit3, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  points: number;
  explanation?: string;
}

interface Exam {
  id: number;
  title: string;
  course: string;
  questionsCount: number;
  duration: string;
  startTime: string;
  status: string;
  isShuffled: boolean;
  submissionsCount: number;
  questions: Question[];
  studentResults: any[];
}

const initialExams: Exam[] = [
  { 
    id: 1, 
    title: 'امتحان الشامل في الخوارزميات وتراكيب البيانات', 
    course: 'كورس أولى ثانوي - الترم الأول', 
    questionsCount: 3, 
    duration: '30 دقيقة', 
    startTime: '2026-08-06 الساعة 02:00 مساءً', 
    status: 'مجدول (جاهز)', 
    isShuffled: true,
    submissionsCount: 45,
    questions: [
      {
        id: 'q1',
        text: 'ما هي التعقدية الزمنية (Time Complexity) للبحث الثنائي Binary Search؟',
        options: ['O(1)', 'O(N)', 'O(log N)', 'O(N²)'],
        correctOptionIndex: 2,
        points: 5,
        explanation: 'يقوم البحث الثنائي بتقسيم مصفوفة البيانات المرتبة إلى النصف في كل خطوة.'
      },
      {
        id: 'q2',
        text: 'أي من تراكيب البيانات التالية يعتمد على مبدأ (LIFO - Last In First Out)؟',
        options: ['الكتلة (Queue)', 'المكدس (Stack)', 'المصفوفة (Array)', 'القائمة الموصولة (LinkedList)'],
        correctOptionIndex: 1,
        points: 5,
        explanation: 'الـ Stack يعتمد على مبدأ آخر عنصر يدخل هو أول عنصر يخرج.'
      },
      {
        id: 'q3',
        text: 'في لغة بايثون، ما هو الكود الصحيح لتعريف مصفوفة قائمة جديدة؟',
        options: ['arr = []', 'arr = {}', 'arr = ()', 'arr = <>'],
        correctOptionIndex: 0,
        points: 5,
        explanation: 'الأقواس المربعة [] هي الطريقة القياسية لإنشاء القوائم (Lists) في بايثون.'
      }
    ],
    studentResults: [
      { id: 101, name: 'أحمد محمود', score: '15 / 15', percentage: '100%', tabSwitchCount: 0, autoSubmitted: false, timeTaken: '22 دقيقة', status: 'ممتاز ✅' },
      { id: 102, name: 'سارة خالد', score: '10 / 15', percentage: '67%', tabSwitchCount: 2, autoSubmitted: false, timeTaken: '28 دقيقة', status: '⚠️ مغادرة (مرتين)' },
      { id: 103, name: 'عمر طارق', score: '05 / 15', percentage: '33%', tabSwitchCount: 3, autoSubmitted: true, timeTaken: '08 دقائق', status: '🚨 طرد إجباري (غش)' },
      { id: 104, name: 'مريم سعيد', score: '15 / 15', percentage: '100%', tabSwitchCount: 0, autoSubmitted: false, timeTaken: '18 دقيقة', status: 'ممتاز ✅' },
    ]
  },
  { 
    id: 2, 
    title: 'اختبار قصير: أساسيات بايثون', 
    course: 'الكورس التأسيسي في البرمجة', 
    questionsCount: 2, 
    duration: '15 دقيقة', 
    startTime: '2026-08-10 الساعة 06:00 مساءً', 
    status: 'مجدول', 
    isShuffled: true,
    submissionsCount: 12,
    questions: [
      {
        id: 'q201',
        text: 'ما ناتج تنفيذ الأمر print(2 ** 3) في لغة بايثون؟',
        options: ['6', '8', '9', '5'],
        correctOptionIndex: 1,
        points: 5,
        explanation: 'العلامة ** تعني الأسس، 2 أس 3 يساوي 8.'
      }
    ],
    studentResults: []
  },
];

export default function AdminExamsPage() {
  const [exams, setExams] = useState<Exam[]>(initialExams);
  const [search, setSearch] = useState('');
  const [showNewExamModal, setShowNewExamModal] = useState(false);
  const [selectedExamResults, setSelectedExamResults] = useState<Exam | null>(null);
  const [editingQuestionsExam, setEditingQuestionsExam] = useState<Exam | null>(null);

  // Form State for Exam Creation/Edit
  const [examTitle, setExamTitle] = useState('');
  const [examCourse, setExamCourse] = useState('كورس أولى ثانوي - الترم الأول');
  const [examStartTime, setExamStartTime] = useState('');
  const [examDuration, setExamDuration] = useState('30');
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  const [questionsList, setQuestionsList] = useState<Question[]>([]);

  // Question Form State inside modal
  const [qText, setQText] = useState('');
  const [qOpt0, setQOpt0] = useState('');
  const [qOpt1, setQOpt1] = useState('');
  const [qOpt2, setQOpt2] = useState('');
  const [qOpt3, setQOpt3] = useState('');
  const [qCorrectIndex, setQCorrectIndex] = useState(0);
  const [qPoints, setQPoints] = useState('5');
  const [qExplanation, setQExplanation] = useState('');

  const filteredExams = exams.filter(e => e.title.includes(search) || e.course.includes(search));

  const handleAddQuestion = () => {
    if (!qText.trim() || !qOpt0.trim() || !qOpt1.trim()) {
      alert('يرجى كتابة نص السؤال والإجابتين على الأقل.');
      return;
    }
    const newQ: Question = {
      id: Date.now().toString(),
      text: qText,
      options: [qOpt0, qOpt1, qOpt2 || 'غ/م', qOpt3 || 'غ/م'].filter(Boolean),
      correctOptionIndex: qCorrectIndex,
      points: Number(qPoints) || 5,
      explanation: qExplanation,
    };

    setQuestionsList([...questionsList, newQ]);
    // Reset question form
    setQText(''); setQOpt0(''); setQOpt1(''); setQOpt2(''); setQOpt3(''); setQExplanation('');
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestionsList(questionsList.filter(q => q.id !== id));
  };

  const handleSaveNewExam = () => {
    if (!examTitle.trim()) {
      alert('يرجى كتابة عنوان الامتحان.');
      return;
    }
    const newExam: Exam = {
      id: Date.now(),
      title: examTitle,
      course: examCourse,
      questionsCount: questionsList.length,
      duration: `${examDuration} دقيقة`,
      startTime: examStartTime || '2026-08-15 الساعة 08:00 مساءً',
      status: 'مجدول (جاهز)',
      isShuffled: shuffleQuestions,
      submissionsCount: 0,
      questions: questionsList,
      studentResults: [],
    };

    setExams([newExam, ...exams]);
    setShowNewExamModal(false);
    // Reset
    setExamTitle(''); setQuestionsList([]);
  };

  const handleSaveQuestionsForExam = () => {
    if (!editingQuestionsExam) return;
    setExams(prev => prev.map(e => e.id === editingQuestionsExam.id ? {
      ...editingQuestionsExam,
      questionsCount: editingQuestionsExam.questions.length
    } : e));
    setEditingQuestionsExam(null);
  };

  const handleDeleteExam = (id: number, title: string) => {
    if (confirm(`هل أنت متأكد من حذف امتحان "${title}"؟`)) {
      setExams(prev => prev.filter(e => e.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>
            إدارة الامتحانات والأسئلة 📝
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            إضافة الأسئلة والخيارات، جدولة المواعيد، وتتبع محاولات مغادرة الشاشة للطلاب.
          </p>
        </div>
        <button 
          onClick={() => { setShowNewExamModal(true); setQuestionsList([]); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff',
            border: 'none', padding: '12px 24px', borderRadius: 14,
            fontWeight: 800, fontSize: 14, cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(108,34,249,0.3)', fontFamily: 'Tajawal, sans-serif'
          }}
        >
          <Plus size={18} /> إنشاء امتحان مجدول وإضافة أسئلة
        </button>
      </div>

      {/* Main Table Card */}
      <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        
        {/* Search Toolbar */}
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="ابحث عن اسم امتحان أو كورس..." 
              style={{
                width: '100%', padding: '10px 42px 10px 14px', borderRadius: 12,
                border: '1px solid var(--border)', outline: 'none', fontSize: 14,
                fontFamily: 'Tajawal, sans-serif', background: 'var(--bg)', color: 'var(--text-main)', boxSizing: 'border-box'
              }} 
            />
          </div>
        </div>

        {/* Exams Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px', fontWeight: 700 }}>عنوان الامتحان</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>الكورس التابع له</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>عدد الأسئلة</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>تاريخ ووقت الفتح</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>المدة</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>تقرير الغش والنتائج</th>
                <th style={{ padding: '16px', fontWeight: 700, textAlign: 'left' }}>إدارة الأسئلة والمعاينة</th>
              </tr>
            </thead>
            <tbody>
              {filteredExams.map((exam) => (
                <tr key={exam.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '16px', fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <FileCheck2 size={18} color="#6C22F9" /> {exam.title}
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>{exam.course}</td>
                  
                  {/* Question Count Badge & Quick Question Manager Trigger */}
                  <td style={{ padding: '16px' }}>
                    <button
                      onClick={() => setEditingQuestionsExam({ ...exam })}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'rgba(108,34,249,0.1)', color: '#6C22F9',
                        border: '1px solid rgba(108,34,249,0.2)', padding: '5px 12px',
                        borderRadius: 10, fontSize: 12, fontWeight: 800, cursor: 'pointer',
                        fontFamily: 'Tajawal, sans-serif'
                      }}
                    >
                      <HelpCircle size={14} /> {exam.questions?.length || exam.questionsCount} سؤال (إدارة الأسئلة)
                    </button>
                  </td>

                  <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-main)', fontWeight: 700 }}>{exam.startTime}</td>
                  <td style={{ padding: '16px', fontSize: 13, fontWeight: 800, color: '#10b981' }}>{exam.duration}</td>
                  
                  {/* Results & Cheating Log Button */}
                  <td style={{ padding: '16px' }}>
                    <button 
                      onClick={() => setSelectedExamResults(exam)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: 'var(--bg)', border: '1px solid var(--border)',
                        color: 'var(--text-main)', padding: '6px 12px', borderRadius: 10,
                        fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif'
                      }}
                    >
                      <Eye size={14} /> {exam.submissionsCount} إجابة (تقرير الغش)
                    </button>
                  </td>

                  <td style={{ padding: '16px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 10 }}>
                      <Link href={`/exams/${exam.id}`} target="_blank"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          background: 'var(--bg)', border: '1px solid var(--border)',
                          color: '#6C22F9', padding: '6px 12px', borderRadius: 10,
                          fontSize: 12, fontWeight: 800, textDecoration: 'none'
                        }}
                      >
                        <ExternalLink size={14} /> معاينة كطالب
                      </Link>
                      <button
                        onClick={() => handleDeleteExam(exam.id, exam.title)}
                        style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer' }}
                        title="حذف الامتحان"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* ─── 1. Question Manager Modal for Existing Exam ────────────────────── */}
      <AnimatePresence>
        {editingQuestionsExam && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditingQuestionsExam(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ position: 'relative', width: '100%', maxWidth: 720, background: 'var(--surface)', borderRadius: 24, padding: 32, zIndex: 201, boxShadow: '0 30px 60px rgba(0,0,0,0.3)', maxHeight: '85vh', overflowY: 'auto' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px' }}>
                    إدارة أسئلة: {editingQuestionsExam.title} 📝
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                    إجمالي الأسئلة المضافة: {editingQuestionsExam.questions?.length || 0} أسئلة
                  </p>
                </div>
                <button onClick={() => setEditingQuestionsExam(null)} style={{ background: 'var(--bg)', border: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
              </div>

              {/* Questions List */}
              <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {editingQuestionsExam.questions?.length === 0 ? (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20 }}>لا توجد أسئلة مضافة بعد لهذا الامتحان.</p>
                ) : (
                  editingQuestionsExam.questions?.map((q, idx) => (
                    <div key={q.id} style={{ background: 'var(--bg)', borderRadius: 14, padding: 16, border: '1px solid var(--border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                        <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>
                          س{idx + 1}: {q.text} ({q.points} درجات)
                        </h4>
                        <button
                          onClick={() => {
                            const updatedQ = editingQuestionsExam.questions.filter(item => item.id !== q.id);
                            setEditingQuestionsExam({ ...editingQuestionsExam, questions: updatedQ });
                          }}
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
                    <input value={qText} onChange={e => setQText(e.target.value)} placeholder="مثال: ما هو ناتج تنفيذ الأمر print(3 * 4)؟"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>الخيار الأول (A)</label>
                      <input value={qOpt0} onChange={e => setQOpt0(e.target.value)} placeholder="الخيار الأول"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>الخيار الثاني (B)</label>
                      <input value={qOpt1} onChange={e => setQOpt1(e.target.value)} placeholder="الخيار الثاني"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>الخيار الثالث (C)</label>
                      <input value={qOpt2} onChange={e => setQOpt2(e.target.value)} placeholder="الخيار الثالث (اختياري)"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>الخيار الرابع (D)</label>
                      <input value={qOpt3} onChange={e => setQOpt3(e.target.value)} placeholder="الخيار الرابع (اختياري)"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>الإجابة الصحيحة ✅</label>
                      <select value={qCorrectIndex} onChange={e => setQCorrectIndex(Number(e.target.value))}
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}>
                        <option value={0}>الخيار الأول (A)</option>
                        <option value={1}>الخيار الثاني (B)</option>
                        <option value={2}>الخيار الثالث (C)</option>
                        <option value={3}>الخيار الرابع (D)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 4 }}>درجة السؤال</label>
                      <input type="number" value={qPoints} onChange={e => setQPoints(e.target.value)} placeholder="5"
                        style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (!qText.trim() || !qOpt0.trim()) { alert('يرجى ادخال نص السؤال والخيارات'); return; }
                      const newQ: Question = {
                        id: Date.now().toString(),
                        text: qText,
                        options: [qOpt0, qOpt1, qOpt2 || 'غ/م', qOpt3 || 'غ/م'].filter(Boolean),
                        correctOptionIndex: qCorrectIndex,
                        points: Number(qPoints) || 5,
                      };
                      setEditingQuestionsExam({
                        ...editingQuestionsExam,
                        questions: [...(editingQuestionsExam.questions || []), newQ]
                      });
                      setQText(''); setQOpt0(''); setQOpt1(''); setQOpt2(''); setQOpt3('');
                    }}
                    style={{ background: '#6C22F9', color: '#fff', border: 'none', borderRadius: 10, padding: '10px', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', marginTop: 4 }}
                  >
                    + إدراج هذا السؤال القائمة
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button onClick={handleSaveQuestionsForExam} style={{ background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
                  حفظ أسئلة الامتحان
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── 2. Create New Exam + Questions Builder Modal ───────────────────── */}
      <AnimatePresence>
        {showNewExamModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowNewExamModal(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ position: 'relative', width: '100%', maxWidth: 680, background: 'var(--surface)', borderRadius: 24, padding: 32, zIndex: 201, boxShadow: '0 30px 60px rgba(0,0,0,0.3)', maxHeight: '85vh', overflowY: 'auto' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>إنشاء امتحان مجدول وبناء الأسئلة</h3>
                <button onClick={() => setShowNewExamModal(false)} style={{ background: 'var(--bg)', border: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>عنوان الامتحان</label>
                  <input type="text" value={examTitle} onChange={e => setExamTitle(e.target.value)} placeholder="مثال: امتحان شهر أكتوبر الشامل - بايثون والخوارزميات" style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>الكورس التابع له</label>
                    <select value={examCourse} onChange={e => setExamCourse(e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}>
                      <option value="كورس أولى ثانوي - الترم الأول">كورس أولى ثانوي - الترم الأول</option>
                      <option value="كورس ثانية ثانوي - الترم الأول">كورس ثانية ثانوي - الترم الأول</option>
                      <option value="الكورس التأسيسي في البرمجة">الكورس التأسيسي في البرمجة</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>مدة التايمر (بالدقائق)</label>
                    <input type="number" value={examDuration} onChange={e => setExamDuration(e.target.value)} style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
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
                          <button onClick={() => handleRemoveQuestion(q.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={15} /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input fields to add question */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <input value={qText} onChange={e => setQText(e.target.value)} placeholder="نص السؤال..." style={{ width: '100%', padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <input value={qOpt0} onChange={e => setQOpt0(e.target.value)} placeholder="خيار 1 (A)" style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 12, fontFamily: 'Tajawal, sans-serif', outline: 'none' }} />
                      <input value={qOpt1} onChange={e => setQOpt1(e.target.value)} placeholder="خيار 2 (B)" style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 12, fontFamily: 'Tajawal, sans-serif', outline: 'none' }} />
                      <input value={qOpt2} onChange={e => setQOpt2(e.target.value)} placeholder="خيار 3 (C)" style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 12, fontFamily: 'Tajawal, sans-serif', outline: 'none' }} />
                      <input value={qOpt3} onChange={e => setQOpt3(e.target.value)} placeholder="خيار 4 (D)" style={{ padding: '8px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 12, fontFamily: 'Tajawal, sans-serif', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>الإجابة الصحيحة:</span>
                      <select value={qCorrectIndex} onChange={e => setQCorrectIndex(Number(e.target.value))} style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontSize: 12, fontFamily: 'Tajawal, sans-serif' }}>
                        <option value={0}>A (الخيار الأول)</option>
                        <option value={1}>B (الخيار الثاني)</option>
                        <option value={2}>C (الخيار الثالث)</option>
                        <option value={3}>D (الخيار الرابع)</option>
                      </select>
                      <button type="button" onClick={handleAddQuestion} style={{ marginRight: 'auto', background: '#6C22F9', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 16px', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
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
                <button onClick={() => setShowNewExamModal(false)} style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '11px 20px', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>إلغاء</button>
                <button onClick={handleSaveNewExam} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', padding: '11px 24px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}><Save size={16} /> حفظ الامتحان المجدول</button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── 3. Student Results & Anti-Cheating Log Modal ────────────────────── */}
      <AnimatePresence>
        {selectedExamResults && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedExamResults(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} style={{ position: 'relative', zIndex: 201, width: '100%', maxWidth: 750, background: 'var(--surface)', borderRadius: 24, padding: 32, boxShadow: '0 30px 60px rgba(0,0,0,0.3)', maxHeight: '85vh', overflowY: 'auto' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px' }}>تقرير درجات ومحاولات غش الطلاب</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>امتحان: {selectedExamResults.title}</p>
                </div>
                <button onClick={() => setSelectedExamResults(null)} style={{ background: 'var(--bg)', border: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
              </div>

              {/* Student Results Table */}
              <div style={{ overflowX: 'auto', maxHeight: '55vh' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
                      <th style={{ padding: '12px', fontWeight: 700 }}>اسم الطالب</th>
                      <th style={{ padding: '12px', fontWeight: 700 }}>الدرجة النهائي</th>
                      <th style={{ padding: '12px', fontWeight: 700 }}>النسبة المئوية</th>
                      <th style={{ padding: '12px', fontWeight: 700 }}>عدد مرات مغادرة الشاشة</th>
                      <th style={{ padding: '12px', fontWeight: 700 }}>حالة الأمان والتقرير</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedExamResults.studentResults?.map((res: any) => (
                      <tr key={res.id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '12px', fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>{res.name}</td>
                        <td style={{ padding: '12px', fontSize: 14, fontWeight: 900, color: '#6C22F9' }}>{res.score}</td>
                        <td style={{ padding: '12px', fontSize: 13, fontWeight: 700, color: '#10b981' }}>{res.percentage}</td>
                        
                        <td style={{ padding: '12px' }}>
                          {res.tabSwitchCount === 0 ? (
                            <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <ShieldCheck size={14} /> 0 (التزام كامل)
                            </span>
                          ) : (
                            <span style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                              <AlertTriangle size={14} /> غادر {res.tabSwitchCount} مرات
                            </span>
                          )}
                        </td>

                        <td style={{ padding: '12px' }}>
                          <span style={{ 
                            background: res.autoSubmitted ? 'rgba(239,68,68,0.15)' : 'var(--bg)',
                            color: res.autoSubmitted ? '#ef4444' : 'var(--text-muted)',
                            padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700
                          }}>
                            {res.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedExamResults(null)} style={{ background: 'var(--bg)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '10px 24px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>إغلاق التقرير</button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
