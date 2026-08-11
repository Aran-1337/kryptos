'use client';
import { useState } from 'react';
import { Plus, Video, Trash2, ShieldCheck, Save, ArrowRight, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function AdminCourseContentPage() {
  const [sections, setSections] = useState([
    {
      id: 'sec-1',
      title: 'الباب الأول: أساسيات التفكير البرمجي والخوارزميات',
      lessons: [
        { id: 'les-1', title: 'مقدمة في علوم الحاسب والبرمجة', duration: '18:40 دقيقة', isPreview: true, videoProvider: 'Bunny.net HLS (محمي ضد السرقة)', videoUrl: 'https://iframe.mediadelivery.net/embed/12345/abcde', pdfUrl: '/memento1.pdf' },
        { id: 'les-2', title: 'فهم خرائط التدفق (Flowcharts) بالتفصيل', duration: '25:10 دقيقة', isPreview: false, videoProvider: 'Vimeo Private Stream', videoUrl: 'https://player.vimeo.com/video/987654321', pdfUrl: '' }
      ]
    },
    {
      id: 'sec-2',
      title: 'الباب الثاني: المتغيرات وبنية البيانات في بايثون',
      lessons: [
        { id: 'les-3', title: 'المتغيرات وأنواع البيانات (Variables & Types)', duration: '30:00 دقيقة', isPreview: false, videoProvider: 'Bunny.net HLS', videoUrl: 'https://iframe.mediadelivery.net/embed/12345/xyz', pdfUrl: '/memento2.pdf' }
      ]
    }
  ]);

  // Section Modal State
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [sectionTitleInput, setSectionTitleInput] = useState('');

  // Lesson Modal State
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [targetSectionId, setTargetSectionId] = useState('sec-1');
  
  // Lesson Form State
  const [lessonTitle, setLessonTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoProvider, setVideoProvider] = useState('Bunny.net HLS (مشفر ضد التحميل)');
  const [duration, setDuration] = useState('20:00');
  const [isPreview, setIsPreview] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');

  const handleOpenAddSection = () => {
    setSectionTitleInput('');
    setShowSectionModal(true);
  };

  const handleSaveSection = () => {
    if (sectionTitleInput && sectionTitleInput.trim()) {
      setSections([...sections, { id: `sec-${Date.now()}`, title: sectionTitleInput.trim(), lessons: [] }]);
      setShowSectionModal(false);
      setSectionTitleInput('');
    }
  };

  const handleOpenAddLesson = (sectionId: string) => {
    setTargetSectionId(sectionId);
    setLessonTitle('');
    setVideoUrl('');
    setVideoProvider('Bunny.net HLS (مشفر ضد التحميل)');
    setDuration('20:00');
    setIsPreview(false);
    setPdfUrl('');
    setShowLessonModal(true);
  };

  const handleSaveLesson = () => {
    if (!lessonTitle.trim()) return;

    const newLesson = {
      id: `les-${Date.now()}`,
      title: lessonTitle,
      duration,
      isPreview,
      videoProvider,
      videoUrl: videoUrl || 'https://iframe.mediadelivery.net/embed/12345/demo',
      pdfUrl
    };

    setSections(sections.map(sec => {
      if (sec.id === targetSectionId) {
        return { ...sec, lessons: [...sec.lessons, newLesson] };
      }
      return sec;
    }));

    setShowLessonModal(false);
  };

  const handleDeleteLesson = (sectionId: string, lessonId: string) => {
    if (confirm('هل أنت متاكد من حذف هذا الدرس؟')) {
      setSections(sections.map(sec => {
        if (sec.id === sectionId) {
          return { ...sec, lessons: sec.lessons.filter(l => l.id !== lessonId) };
        }
        return sec;
      }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Link href="/admin/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6C22F9', fontSize: 13, fontWeight: 800, textDecoration: 'none', marginBottom: 8 }}>
            <ArrowRight size={16} /> العودة لقائمة الكورسات
          </Link>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>إدارة محتوى الكورس وتجهيز اللينكات المشفّرة</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '4px 0 0' }}>رفع الدرجات بالفصول، إضافة روابط الفيديوهات المخصصة المحمية ضد السرقة والتحميل.</p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={handleOpenAddSection}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,34,249,0.3)', fontFamily: 'Tajawal, sans-serif' }}
          >
            <Plus size={18} /> إضافة باب / فصل جديد
          </button>
        </div>
      </div>

      {/* Security Info Banner */}
      <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', padding: 20, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 16, color: 'var(--text-main)' }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ShieldCheck size={24} />
        </div>
        <div>
          <h4 style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 800, color: '#10b981' }}>حماية المحتوى ضد التنزيل والسرقة مفعلة 🛡️</h4>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>يتم تشفير لينكات الفيديوهات (Bunny.net HLS / Vimeo Private) وطباعة العلامة المائية المائية المتحركة برقم اسم الطالب فوق الفيديو أوتوماتيكياً لمنع تسجيل الشاشة.</p>
        </div>
      </div>

      {/* Sections & Lessons List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {sections.map((section, idx) => (
          <div key={section.id} style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            
            {/* Section Header */}
            <div style={{ padding: '20px 24px', background: 'var(--bg)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ background: '#6C22F9', color: '#fff', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900 }}>{idx + 1}</span>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>{section.title}</h3>
              </div>

              <button 
                onClick={() => handleOpenAddLesson(section.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
              >
                <Plus size={16} /> إضافة درس لهذا الفصل
              </button>
            </div>

            {/* Lessons List inside Section */}
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {section.lessons.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)', fontSize: 13 }}>لا توجد دروس في هذا الفصل بعد. اضغط إضافة درس للبدء.</div>
              ) : (
                section.lessons.map((lesson) => (
                  <div key={lesson.id} style={{ padding: 16, borderRadius: 14, background: 'var(--bg)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Video size={20} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text-main)' }}>{lesson.title}</h4>
                          {lesson.isPreview && (
                            <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontSize: 11, fontWeight: 800, padding: '2px 8px', borderRadius: 12 }}>معاينة مجانية</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                          <span>⏱️ {lesson.duration}</span>
                          <span style={{ color: '#6C22F9', fontWeight: 700 }}>🔒 {lesson.videoProvider}</span>
                          {lesson.pdfUrl && <span style={{ color: '#3b82f6' }}>📄 مذكرة PDF مرفقة</span>}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button onClick={() => handleDeleteLesson(section.id, lesson.id)} style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', padding: '8px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Tajawal, sans-serif' }}>
                        <Trash2 size={14} /> حذف الدرس
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        ))}
      </div>

      {/* Add Section Popup Modal */}
      <AnimatePresence>
        {showSectionModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(5,2,20,0.75)', backdropFilter: 'blur(4px)', zIndex: 1001 }} onClick={() => setShowSectionModal(false)} />
            
            {/* Modal Box */}
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} style={{ position: 'relative', zIndex: 1002, width: '100%', maxWidth: 480, background: 'var(--surface)', borderRadius: 24, padding: 28, boxShadow: '0 20px 50px rgba(0,0,0,0.4)', border: '1px solid var(--border)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookOpen size={20} color="#6C22F9" /> إضافة باب / فصل جديد
                </h3>
                <button onClick={() => setShowSectionModal(false)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-main)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 8 }}>عنوان الباب أو الفصل</label>
                <input 
                  type="text" 
                  autoFocus
                  value={sectionTitleInput} 
                  onChange={e => setSectionTitleInput(e.target.value)} 
                  placeholder="مثال: الباب الثالث: مصفوفات بايثون المتقدمة" 
                  onKeyDown={e => { if (e.key === 'Enter') handleSaveSection(); }}
                  style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} 
                />
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button onClick={() => setShowSectionModal(false)} style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>إلغاء</button>
                <button onClick={handleSaveSection} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}><Save size={16} /> إضافة الباب</button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Protected Lesson Modal Perfectly Centered */}
      <AnimatePresence>
        {showLessonModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(5,2,20,0.75)', backdropFilter: 'blur(4px)', zIndex: 1001 }} onClick={() => setShowLessonModal(false)} />
            
            {/* Modal Box */}
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} style={{ position: 'relative', zIndex: 1002, width: '100%', maxWidth: 620, background: 'var(--surface)', borderRadius: 24, padding: 32, boxShadow: '0 20px 50px rgba(0,0,0,0.4)', border: '1px solid var(--border)', maxHeight: '90vh', overflowY: 'auto' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>إضافة درس جديد مع تشفير الفيديو ضد السرقة</h3>
                <button onClick={() => setShowLessonModal(false)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-main)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>عنوان الدرس</label>
                  <input type="text" value={lessonTitle} onChange={e => setLessonTitle(e.target.value)} placeholder="مثال: الشرح العملي لخرائط التدفق" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>مزود الفيديو (نظام التشفير)</label>
                    <select value={videoProvider} onChange={e => setVideoProvider(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}>
                      <option value="Bunny.net HLS (مشفر ضد التحميل)">Bunny.net Stream HLS</option>
                      <option value="Vimeo Private Stream">Vimeo Private Video</option>
                      <option value="YouTube Unlisted (محمي)">YouTube Embed</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>مدة الدرس (بالدقائق والثواني)</label>
                    <input type="text" value={duration} onChange={e => setDuration(e.target.value)} placeholder="مثال: 25:30" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>رابط تشغيل الفيديو المشفر (Video Embed/Stream URL)</label>
                  <input type="text" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://iframe.mediadelivery.net/embed/12345/abcde" dir="ltr" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'monospace', textAlign: 'left', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>رابط مذكرة PDF المرفقة (اختياري)</label>
                  <input type="text" value={pdfUrl} onChange={e => setPdfUrl(e.target.value)} placeholder="/memento1.pdf أو رابط PDF" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 800, color: '#6C22F9' }}>
                  <input type="checkbox" checked={isPreview} onChange={e => setIsPreview(e.target.checked)} style={{ accentColor: '#6C22F9' }} />
                  تفعيل كدرس معاينة مجانية (Free Preview) للطلاب الجدد
                </label>
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button onClick={() => setShowLessonModal(false)} style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>إلغاء</button>
                <button onClick={handleSaveLesson} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}><Save size={16} /> حفظ الدرس المشفر</button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
