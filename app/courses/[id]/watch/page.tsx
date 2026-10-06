'use client';
import { useState, useEffect, useRef, use, useCallback } from 'react';
import Link from 'next/link';
import {
  PlayCircle,
  CheckCircle,
  FileText,
  Lock,
  ChevronRight,
  Download,
  MessageSquare,
  Menu,
  X,
  EyeOff,
  Video,
  Send,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { coursesService } from '@/app/features/courses/services/courses.service';
import { courseContentService } from '@/app/features/course-content/services/course-content.service';
import { Course } from '@/app/features/courses/types/course.types';
import { Section, Lesson } from '@/app/features/course-content/types/course-content.types';

export default function CourseWatchPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const courseId = unwrappedParams.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [activeSectionId, setActiveSectionId] = useState<string>('');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isForbidden, setIsForbidden] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'qa'>('overview');

  // DRM Screen Capture simulation state
  const [isScreenRecordingDetected, setIsScreenRecordingDetected] = useState(false);

  // Live Watch Points & Anti-Skip Engine State
  const [isPlaying, setIsPlaying] = useState(false);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [earnedPoints, setEarnedPoints] = useState(0);
  const [pointsPerMin, setPointsPerMin] = useState(1);

  // Lesson Q&A Questions state
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState('');
  const [lessonQuestions, setLessonQuestions] = useState<any[]>([]);

  // Load course and curriculum
  const loadCourseAndCurriculum = useCallback(async () => {
    setLoading(true);
    setPageError(null);
    try {
      const [courseData, sectionsData] = await Promise.all([
        coursesService.getCourseById(courseId),
        courseContentService.getSections(courseId),
      ]);

      if (!courseData || !courseData.id) {
        throw new Error('لم يتم العثور على الكورس المطلوب');
      }

      setCourse(courseData);
      setSections(sectionsData);

      // Set initial active lesson if available
      for (const sec of sectionsData) {
        if (sec.lessons && sec.lessons.length > 0) {
          setActiveSectionId(sec.id);
          setActiveLesson(sec.lessons[0]);
          break;
        }
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'حدث خطأ أثناء تحميل محتوى الكورس';
      setPageError(msg);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadCourseAndCurriculum();
  }, [loadCourseAndCurriculum]);

  // Load video stream for active lesson
  useEffect(() => {
    if (!courseId || !activeSectionId || !activeLesson?.id) {
      setVideoUrl('');
      setVideoLoading(false);
      return;
    }

    let isMounted = true;
    setVideoLoading(true);
    setVideoError(null);
    setIsForbidden(false);

    courseContentService
      .getLessonVideo(courseId, activeSectionId, activeLesson.id)
      .then((data) => {
        if (isMounted) {
          setVideoUrl(data.url || '');
          setVideoLoading(false);
        }
      })
      .catch((err: any) => {
        if (isMounted) {
          const status = err.response?.status;
          const msg = err.response?.data?.message;
          if (status === 403) {
            setIsForbidden(true);
            setVideoError(msg || 'يجب شراء الكورس أولاً لمشاهدة هذا الدرس');
          } else if (status === 404) {
            setVideoError(msg || 'لا يوجد فيديو مرفوع لهذا الدرس حالياً');
          } else {
            setVideoError(msg || 'تعذر تشغيل الفيديو لهذا الدرس');
          }
          setVideoUrl('');
          setVideoLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [courseId, activeSectionId, activeLesson?.id]);

  // Watch timer simulation
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setWatchedSeconds((prev) => {
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

  const handleSelectLesson = (sectionId: string, lesson: Lesson) => {
    setActiveSectionId(sectionId);
    setActiveLesson(lesson);
    setIsPlaying(false);
    setWatchedSeconds(0);
    setEarnedPoints(0);
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ = {
      id: Date.now().toString(),
      studentName: 'الطالب',
      date: 'الآن',
      question: newQuestionText,
      status: 'pending',
      reply: null,
    };

    setLessonQuestions([newQ, ...lessonQuestions]);
    setNewQuestionText('');
    setShowQuestionForm(false);
  };

  const minutesWatchedDisplay = Math.floor(watchedSeconds / 60);

  // Total lessons in curriculum
  const totalLessons = sections.reduce(
    (acc, sec) => acc + (Array.isArray(sec.lessons) ? sec.lessons.length : 0),
    0
  );

  // Page level loading
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          direction: 'rtl',
          fontFamily: 'Tajawal, sans-serif',
          background: 'var(--bg)',
        }}
      >
        <RefreshCw size={36} color="#6C22F9" className="animate-spin" />
        <p style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 700 }}>
          جارِ تجهيز غرفة المشاهدة والدروس...
        </p>
      </div>
    );
  }

  // Page level error
  if (pageError || !course) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          direction: 'rtl',
          fontFamily: 'Tajawal, sans-serif',
          background: 'var(--bg)',
          textAlign: 'center',
        }}
      >
        <AlertCircle size={48} color="#ef4444" style={{ marginBottom: 16 }} />
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>
          تعذر فتح غرفة المشاهدة
        </h2>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: 15,
            maxWidth: 440,
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          {pageError || 'لم يتم العثور على الكورس المطلوب أو لا تملك صلاحية الوصول إليه.'}
        </p>
        <Link
          href="/courses"
          style={{
            padding: '12px 24px',
            background: '#6C22F9',
            color: '#fff',
            borderRadius: 12,
            fontWeight: 800,
            textDecoration: 'none',
          }}
        >
          العودة للكورسات
        </Link>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--bg)',
        color: 'var(--text-main)',
        direction: 'rtl',
        fontFamily: 'Tajawal, sans-serif',
      }}
    >
      {/* Sidebar / Playlist */}
      <div
        className={`watch-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}
        style={{
          width: 320,
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin 0.3s',
          marginLeft: isSidebarOpen ? 0 : -320,
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border)',
            background: 'linear-gradient(135deg, #16133a, #2d2870)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 800, margin: '0 0 4px', color: '#fff' }}>
              محتوى الكورس
            </h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              {totalLessons} دروس عبر {sections.length} وحدات
            </p>
          </div>
          <button
            className="mobile-close-sidebar"
            onClick={() => setIsSidebarOpen(false)}
            style={{ display: 'none', background: 'none', border: 'none', color: '#fff' }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {sections.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
              لا توجد وحدات أو دروس متاحة حالياً
            </div>
          ) : (
            sections.map((unit) => (
              <div key={unit.id}>
                <div
                  style={{
                    padding: '14px 20px',
                    background: 'rgba(108,34,249,0.12)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <h3 style={{ fontSize: 13, fontWeight: 900, color: '#a78bfa', margin: 0 }}>
                    {unit.title}
                  </h3>
                </div>
                <div>
                  {(!unit.lessons || unit.lessons.length === 0) ? (
                    <div style={{ padding: '12px 20px', fontSize: 13, color: 'var(--text-muted)' }}>
                      لا توجد دروس
                    </div>
                  ) : (
                    unit.lessons.map((lesson) => {
                      const isActive = activeLesson?.id === lesson.id;
                      return (
                        <div
                          key={lesson.id}
                          onClick={() => handleSelectLesson(unit.id, lesson)}
                          style={{
                            padding: '16px 24px',
                            display: 'flex',
                            gap: 12,
                            borderBottom: '1px solid var(--border)',
                            cursor: 'pointer',
                            background: isActive ? 'rgba(108,34,249,0.2)' : 'var(--surface)',
                            borderRight: isActive ? '4px solid #6C22F9' : '4px solid transparent',
                            transition: 'background 0.2s',
                          }}
                        >
                          <div style={{ marginTop: 2 }}>
                            {isActive ? (
                              <PlayCircle size={18} color="#6C22F9" />
                            ) : (
                              <Video size={18} color="var(--text-muted)" />
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <p
                              style={{
                                margin: '0 0 4px',
                                fontSize: 14,
                                fontWeight: isActive ? 900 : 600,
                                color: isActive ? '#a78bfa' : 'var(--text-main)',
                              }}
                            >
                              {lesson.title}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                                {lesson.duration || '10:00'}
                              </span>
                              {lesson.isFree && (
                                <span
                                  style={{
                                    fontSize: 10,
                                    background: '#dcfce7',
                                    color: '#15803d',
                                    padding: '1px 6px',
                                    borderRadius: 4,
                                    fontWeight: 700,
                                  }}
                                >
                                  مجاني
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Video Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Top Navbar */}
        <div
          style={{
            height: 64,
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-main)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 8,
            }}
          >
            <Menu size={24} />
          </button>

          <Link
            href={`/courses/${courseId}`}
            style={{
              color: 'var(--text-muted)',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            <ChevronRight size={18} /> تفاصيل الكورس
          </Link>

          {/* Live Points Counter Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(16,185,129,0.12)',
              color: '#10b981',
              border: '1px solid rgba(16,185,129,0.25)',
              padding: '6px 16px',
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 800,
            }}
          >
            <ShieldCheck size={16} color="#10b981" />
            <span>المشاهدة الحالية: {minutesWatchedDisplay} دقيقة (تكسب +{earnedPoints} نقطة 🌟)</span>
          </div>

          <div style={{ margin: '0 auto' }} />

          <button
            onClick={() => setIsScreenRecordingDetected(!isScreenRecordingDetected)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: isScreenRecordingDetected ? 'rgba(239,68,68,0.2)' : 'var(--bg)',
              color: isScreenRecordingDetected ? '#ef4444' : 'var(--text-main)',
              border: '1px solid var(--border)',
              padding: '4px 12px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <EyeOff size={14} /> {isScreenRecordingDetected ? 'إلغاء وضع التسجيل' : 'تجربة حماية الشاشة'}
          </button>
        </div>

        {/* Video Player Container */}
        <div
          style={{
            background: '#000',
            width: '100%',
            aspectRatio: '16/9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            userSelect: 'none',
            WebkitUserSelect: 'none',
          }}
        >
          {isScreenRecordingDetected ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: '#000',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                zIndex: 100,
                padding: 32,
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: '50%',
                  background: 'rgba(239,68,68,0.15)',
                  border: '2px solid #ef4444',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}
              >
                <Lock size={36} color="#ef4444" />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 10px' }}>
                [ 🔒 شاشة مؤمنة ضد تسجيل الشاشة والتقاط النوافذ ]
              </h3>
              <p style={{ color: '#94a3b8', fontSize: 15, maxWidth: 520, lineHeight: 1.7, margin: 0 }}>
                تم اكتشاف برنامج تسجيل شاشة يعمل في الخلفية. تظهر هذه الشاشة سوداء بالكامل في
                التسجيل لحماية حقوق الملكية الفكرية. يُرجى إغلاق برنامج التسجيل لمتابعة المشاهدة.
              </p>
            </div>
          ) : videoLoading ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 12,
                color: '#fff',
              }}
            >
              <RefreshCw size={36} color="#6C22F9" className="animate-spin" />
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700 }}>جارِ تحميل مشغل الفيديو المشفّر...</p>
            </div>
          ) : videoError ? (
            <div
              style={{
                padding: 32,
                textAlign: 'center',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
                maxWidth: 480,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: isForbidden ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isForbidden ? <Lock size={32} color="#ef4444" /> : <AlertCircle size={32} color="#f59e0b" />}
              </div>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, margin: '0 0 8px' }}>
                  {isForbidden ? 'محتوى الدرس محمي' : 'تعذر تشغيل الفيديو'}
                </h3>
                <p style={{ color: '#94a3b8', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
                  {videoError}
                </p>
              </div>
              {isForbidden && (
                <Link
                  href={`/courses/${courseId}`}
                  style={{
                    padding: '10px 24px',
                    background: '#6C22F9',
                    color: '#fff',
                    borderRadius: 10,
                    fontWeight: 800,
                    textDecoration: 'none',
                    fontSize: 14,
                  }}
                >
                  الاشتراك في الكورس لفتح المشاهدة 🚀
                </Link>
              )}
            </div>
          ) : videoUrl ? (
            <video
              src={videoUrl}
              controls
              controlsList="nodownload"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: 24 }}>
              اختر درساً من القائمة الجانبية لبدء المشاهدة
            </div>
          )}
        </div>

        {/* Content Below Video */}
        <div style={{ padding: '32px', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 24 }}>
            {activeLesson?.title || course.title}
          </h1>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 32, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0 0 16px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                color: activeTab === 'overview' ? '#6C22F9' : 'var(--text-muted)',
                borderBottom: activeTab === 'overview' ? '3px solid #6C22F9' : '3px solid transparent',
              }}
            >
              نظرة عامة
            </button>
            <button
              onClick={() => setActiveTab('files')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0 0 16px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                color: activeTab === 'files' ? '#6C22F9' : 'var(--text-muted)',
                borderBottom: activeTab === 'files' ? '3px solid #6C22F9' : '3px solid transparent',
              }}
            >
              الملفات والمذكرات
            </button>
            <button
              onClick={() => setActiveTab('qa')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0 0 16px',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                color: activeTab === 'qa' ? '#6C22F9' : 'var(--text-muted)',
                borderBottom: activeTab === 'qa' ? '3px solid #6C22F9' : '3px solid transparent',
              }}
            >
              سؤال وجواب ({lessonQuestions.length})
            </button>
          </div>

          {activeTab === 'overview' && (
            <div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: 'var(--text-muted)' }}>
                {activeLesson?.description ||
                  course.description ||
                  'تابع هذا الدرس بعناية وسجل ملاحظاتك. يمكنك طرح أسئلتك على المدرس من تبويب الأسئلة.'}
              </p>
            </div>
          )}

          {activeTab === 'files' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {activeLesson?.pdfUrl ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 16,
                    background: 'var(--surface)',
                    borderRadius: 12,
                    border: '1px solid var(--border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <FileText size={24} color="#6C22F9" />
                    <div>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>مذكرة الدرس</h4>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>ملف PDF مرفق</span>
                    </div>
                  </div>
                  <a
                    href={activeLesson.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      background: '#6C22F9',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: 'pointer',
                      textDecoration: 'none',
                    }}
                  >
                    <Download size={14} /> تحميل
                  </a>
                </div>
              ) : (
                <div style={{ color: 'var(--text-muted)', fontSize: 14, padding: 12 }}>
                  لا توجد ملفات أو مذكرات مرفقة بهذا الدرس.
                </div>
              )}
            </div>
          )}

          {activeTab === 'qa' && (
            <div>
              <button
                onClick={() => setShowQuestionForm(!showQuestionForm)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#6C22F9',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: 10,
                  fontWeight: 800,
                  fontSize: 14,
                  cursor: 'pointer',
                  marginBottom: 20,
                }}
              >
                <MessageSquare size={16} /> طرح سؤال جديد على الدرس
              </button>

              {showQuestionForm && (
                <form
                  onSubmit={handleAddQuestion}
                  style={{
                    marginBottom: 24,
                    background: 'var(--surface)',
                    padding: 20,
                    borderRadius: 16,
                    border: '1px solid var(--border)',
                  }}
                >
                  <textarea
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    rows={3}
                    placeholder="اكتب سؤالك التفصيلي هنا..."
                    style={{
                      width: '100%',
                      padding: 12,
                      borderRadius: 10,
                      border: '1px solid var(--border)',
                      background: 'var(--bg)',
                      color: 'var(--text-main)',
                      outline: 'none',
                      fontFamily: 'Tajawal, sans-serif',
                      fontSize: 14,
                      marginBottom: 12,
                      boxSizing: 'border-box',
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#10b981',
                      color: '#fff',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: 8,
                      fontWeight: 800,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    إرسال للمدرس
                  </button>
                </form>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {lessonQuestions.length === 0 ? (
                  <div style={{ color: 'var(--text-muted)', fontSize: 14, padding: 12 }}>
                    لا توجد استفسارات سابقة على هذا الدرس. كن أول من يسأل!
                  </div>
                ) : (
                  lessonQuestions.map((q) => (
                    <div
                      key={q.id}
                      style={{
                        background: 'var(--surface)',
                        padding: 20,
                        borderRadius: 16,
                        border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontWeight: 800, fontSize: 14 }}>{q.studentName}</span>
                        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{q.date}</span>
                      </div>
                      <p style={{ margin: '0 0 12px', fontSize: 14, color: 'var(--text-main)' }}>{q.question}</p>
                      {q.reply && (
                        <div
                          style={{
                            background: 'rgba(108,34,249,0.1)',
                            padding: 14,
                            borderRadius: 10,
                            borderRight: '3px solid #6C22F9',
                            fontSize: 13,
                            color: 'var(--text-main)',
                            lineHeight: 1.6,
                          }}
                        >
                          <strong style={{ color: '#a78bfa', display: 'block', marginBottom: 4 }}>رد المدرس:</strong>
                          {q.reply}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
