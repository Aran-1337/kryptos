'use client';
import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { PlayCircle, CheckCircle, FileText, Lock, ChevronRight, Download, MessageSquare, Menu, X, Eye, EyeOff, Video, Send, CheckCircle2, CornerDownLeft, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CourseWatchPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'qa'>('overview');
  
  // DRM Screen Capture simulation state
  const [isScreenRecordingDetected, setIsScreenRecordingDetected] = useState(false);

  // Live Watch Points & Anti-Skip Engine State
  const [isPlaying, setIsPlaying] = useState(false);
  const [watchedSeconds, setWatchedSeconds] = useState(1080); // 18 minutes watched simulation
  const [earnedPoints, setEarnedPoints] = useState(18);
  const [skipWarning, setSkipWarning] = useState('');
  const lastTimeRef = useRef(1080);

  // Points rules
  const [pointsPerMin, setPointsPerMin] = useState(1);

  useEffect(() => {
    try {
      const rules = localStorage.getItem('points_calculation_rules');
      if (rules) {
        const parsed = JSON.parse(rules);
        if (parsed.pointsPerMinute) setPointsPerMin(Number(parsed.pointsPerMinute));
      }
    } catch {}
  }, []);

  // Watch timer simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setWatchedSeconds(prev => {
          const next = prev + 1;
          const mins = Math.floor(next / 60);
          const pts = mins * pointsPerMin;
          setEarnedPoints(pts);
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, pointsPerMin]);

  // Lesson Q&A Questions state
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [lessonQuestions, setLessonQuestions] = useState([
    {
      id: 'lq-1',
      studentName: 'أحمد محمود العبد',
      date: 'منذ ساعتين',
      question: 'هل يمكن تخزين القيم النصية والأرقام معاً في نفس المتغير في لغة بايثون؟',
      status: 'answered',
      reply: 'أهلاً يا أحمد! في بايثون المتغير ياخد قيمة واحدة فقط في اللحظة الواحدة، لكن يمكنك دمج النص والرقام باستعمال string formatting كالتالي: print(f"العمر: {age}").'
    }
  ]);

  const course = {
    id: unwrappedParams.id,
    title: 'كورس البرمجة والذكاء الاصطناعي - أولى ثانوي',
  };

  const curriculum = [
    {
      title: 'الوحدة الأولى: الأساسيات (Basics)',
      lessons: [
        { id: 1, title: 'مقدمة في علم البرمجة', duration: '15:20', type: 'video', completed: true, active: false },
        { id: 2, title: 'كتابة أول كود لك', duration: '22:10', type: 'video', completed: true, active: false },
        { id: 3, title: 'المتغيرات وأنواع البيانات', duration: '35:00', type: 'video', completed: false, active: true },
        { id: 4, title: 'مذكرة الوحدة الأولى', duration: 'PDF', type: 'pdf', completed: false, active: false },
      ]
    },
    {
      title: 'الوحدة الثانية: الخوارزميات (Algorithms)',
      lessons: [
        { id: 5, title: 'ما هي الخوارزميات؟', duration: '28:45', type: 'video', completed: false, active: false },
        { id: 6, title: 'خوارزمية البحث الخطي', duration: '41:10', type: 'video', completed: false, active: false },
      ]
    }
  ];

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ = {
      id: Date.now().toString(),
      studentName: 'أحمد محمود',
      date: 'الآن',
      question: newQuestionText,
      status: 'pending',
      reply: null
    };

    setLessonQuestions([newQ, ...lessonQuestions]);
    setNewQuestionText('');
    setShowQuestionForm(false);
  };

  const minutesWatchedDisplay = Math.floor(watchedSeconds / 60);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', color: 'var(--text-main)', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      
      {/* Sidebar / Playlist */}
      <div 
        className={`watch-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}
        style={{ 
          width: 320, background: 'var(--surface)', borderLeft: '1px solid var(--border)', flexShrink: 0,
          display: 'flex', flexDirection: 'column', transition: 'margin 0.3s',
          marginLeft: isSidebarOpen ? 0 : -320
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'linear-gradient(135deg, #16133a, #2d2870)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>محتوى الكورس</h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>تم إنجاز 2 من 6 دروس</p>
          </div>
          <button className="mobile-close-sidebar" onClick={() => setIsSidebarOpen(false)} style={{ display: 'none', background: 'none', border: 'none', color: '#fff' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {curriculum.map((unit, i) => (
            <div key={i}>
              <div style={{ padding: '14px 20px', background: 'rgba(108,34,249,0.12)', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 13, fontWeight: 900, color: '#a78bfa', margin: 0 }}>{unit.title}</h3>
              </div>
              <div>
                {unit.lessons.map(lesson => (
                  <div key={lesson.id} 
                    style={{ 
                      padding: '16px 24px', display: 'flex', gap: 12, borderBottom: '1px solid var(--border)', cursor: 'pointer',
                      background: lesson.active ? 'rgba(108,34,249,0.2)' : 'var(--surface)',
                      borderRight: lesson.active ? '4px solid #6C22F9' : '4px solid transparent',
                      transition: 'background 0.2s'
                    }}
                  >
                    <div style={{ marginTop: 2 }}>
                      {lesson.completed ? (
                        <CheckCircle size={18} color="#10b981" />
                      ) : lesson.active ? (
                        <PlayCircle size={18} color="#6C22F9" />
                      ) : (
                        lesson.type === 'video' ? <Video size={18} color="var(--text-muted)" /> : <FileText size={18} color="var(--text-muted)" />
                      )}
                    </div>
                    <div>
                      <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: lesson.active ? 900 : 600, color: lesson.active ? '#a78bfa' : 'var(--text-main)' }}>
                        {lesson.title}
                      </p>
                      <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{lesson.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Video Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        
        {/* Top Navbar */}
        <div style={{ height: 64, background: 'var(--surface)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 24px', gap: 16, flexWrap: 'wrap' }}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: 8 }}>
            <Menu size={24} />
          </button>
          
          <Link href="/dashboard/courses" style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 700 }}>
            <ChevronRight size={18} /> العودة للكورسات
          </Link>

          {/* Live Points Counter Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.25)', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 800 }}>
            <ShieldCheck size={16} color="#10b981" />
            <span>المشاهدة الحالية: {minutesWatchedDisplay} دقيقة (تكسب +{earnedPoints} نقطة 🌟)</span>
          </div>

          <div style={{ margin: '0 auto' }} />
          
          <button 
            onClick={() => setIsScreenRecordingDetected(!isScreenRecordingDetected)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: isScreenRecordingDetected ? 'rgba(239,68,68,0.2)' : 'var(--bg)', color: isScreenRecordingDetected ? '#ef4444' : 'var(--text-main)', border: '1px solid var(--border)', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
          >
            <EyeOff size={14} /> {isScreenRecordingDetected ? 'إلغاء وضع التسجيل' : 'تجربة حماية DRM'}
          </button>
        </div>

        {/* DRM Hardware Encrypted Video Container */}
        <div 
          style={{ 
            background: '#000', width: '100%', aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {isScreenRecordingDetected ? (
            <div style={{ position: 'absolute', inset: 0, background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', zIndex: 100, padding: 32, textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(239,68,68,0.15)', border: '2px solid #ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Lock size={36} color="#ef4444" />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 10px' }}>[ 🔒 شاشة محمية بنظام DRM ضد تسجيل الشاشة ]</h3>
              <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 520, lineHeight: 1.7, margin: 0 }}>
                تم اكتشاف برنامج تسجيل شاشة يعمل في الخلفية. تظهر هذه الشاشة سوداء بالكامل في التسجيل لحماية حقوق الملكية الفكرية. يُرجى إغلاق برنامج التسجيل لمتابعة المشاهدة.
              </p>
            </div>
          ) : (
            <>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ cursor: 'pointer' }}
                >
                  <PlayCircle size={80} color={isPlaying ? '#10b981' : 'rgba(255,255,255,0.85)'} />
                </motion.div>
                <div style={{ color: '#fff', fontSize: 14, fontWeight: 800 }}>
                  {isPlaying ? '▶️ جارِ المشاهدة وتجميع النقاط أوتوماتيكياً...' : 'اضغط للتشغيل وبدء احتساب النقاط ⏱️'}
                </div>
              </div>

              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 20, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: 2 }}>
                  <div style={{ width: `${Math.min(100, (watchedSeconds / 2100) * 100)}%`, height: '100%', background: '#6C22F9', borderRadius: 2 }} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Content Below Video */}
        <div style={{ padding: '32px', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>المتغيرات وأنواع البيانات (Variables & Data Types)</h1>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: 32, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
            <button 
              onClick={() => setActiveTab('overview')}
              style={{ background: 'none', border: 'none', padding: '0 0 16px', fontSize: 15, fontWeight: 700, cursor: 'pointer', color: activeTab === 'overview' ? '#6C22F9' : 'var(--text-muted)', borderBottom: activeTab === 'overview' ? '3px solid #6C22F9' : '3px solid transparent' }}
            >
              نظرة عامة
            </button>
            <button 
              onClick={() => setActiveTab('files')}
              style={{ background: 'none', border: 'none', padding: '0 0 16px', fontSize: 15, fontWeight: 700, cursor: 'pointer', color: activeTab === 'files' ? '#6C22F9' : 'var(--text-muted)', borderBottom: activeTab === 'files' ? '3px solid #6C22F9' : '3px solid transparent' }}
            >
              الملفات والمذكرات
            </button>
            <button 
              onClick={() => setActiveTab('qa')}
              style={{ background: 'none', border: 'none', padding: '0 0 16px', fontSize: 15, fontWeight: 700, cursor: 'pointer', color: activeTab === 'qa' ? '#6C22F9' : 'var(--text-muted)', borderBottom: activeTab === 'qa' ? '3px solid #6C22F9' : '3px solid transparent' }}
            >
              سؤال وجواب ({lessonQuestions.length})
            </button>
          </div>

          {activeTab === 'overview' && (
            <div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-muted)' }}>
                في هذا الدرس سنكتشف مفهوم المتغيرات وأنواع البيانات الأساسية في لغة بايثون. ستتعلم كيفية إنشاء متغير جديد وتخزين الأرقام والنصوص والقيم المنطقية داخل الذاكرة.
              </p>
            </div>
          )}

          {activeTab === 'files' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 16, background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <FileText size={24} color="#6C22F9" />
                  <div>
                    <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>ملخص درس المتغيرات.pdf</h4>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>1.2 ميجابايت</span>
                  </div>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                  <Download size={14} /> تحميل
                </button>
              </div>
            </div>
          )}

          {activeTab === 'qa' && (
            <div>
              <button 
                onClick={() => setShowQuestionForm(!showQuestionForm)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#6C22F9', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: 'pointer', marginBottom: 20 }}
              >
                <MessageSquare size={16} /> طرح سؤال جديد على الدرس
              </button>

              {showQuestionForm && (
                <form onSubmit={handleAddQuestion} style={{ marginBottom: 24, background: 'var(--surface)', padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
                  <textarea 
                    value={newQuestionText} 
                    onChange={e => setNewQuestionText(e.target.value)}
                    rows={3} 
                    placeholder="اكتب سؤالك التفصيلي هنا..."
                    style={{ width: '100%', padding: 12, borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontFamily: 'Tajawal, sans-serif', fontSize: 14, marginBottom: 12, boxSizing: 'border-box' }}
                  />
                  <button type="submit" style={{ background: '#10b981', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 800, fontSize: 13, cursor: 'pointer' }}>
                    إرسال للمدرس
                  </button>
                </form>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {lessonQuestions.map(q => (
                  <div key={q.id} style={{ background: 'var(--surface)', padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 14 }}>{q.studentName}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{q.date}</span>
                    </div>
                    <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-main)' }}>{q.question}</p>
                    {q.reply && (
                      <div style={{ background: 'rgba(108,34,249,0.1)', padding: 14, borderRadius: 10, borderRight: '3px solid #6C22F9', fontSize: 13, color: 'var(--text-main)', lineHeight: 1.6 }}>
                        <strong style={{ color: '#a78bfa', display: 'block', marginBottom: 4 }}>رد المدرس:</strong>
                        {q.reply}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
