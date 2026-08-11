'use client';
import { use, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle, Clock, BookOpen, CheckCircle, Video, FileText, Lock, ArrowRight, User, CheckCircle2, X, Wallet, Key } from 'lucide-react';

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [activationCode, setActivationCode] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('student_auth');
    const hasCookie = document.cookie.includes('student_token=') || document.cookie.includes('admin_token=');
    setIsLoggedIn(!!token || hasCookie);
  }, []);

  const course = {
    title: 'كورس أولى ثانوي - الترم الأول',
    desc: 'شرح مبسط ومفصل لمنهج البرمجة والذكاء الاصطناعي للصف الأول الثانوي مع تطبيقات عملية وتدريبات شاملة خطوة بخطوة للوصول للاحتراف.',
    price: 350,
    originalPrice: 500,
    students: 1250,
    duration: '24 ساعة',
    lessonsCount: 45,
    instructor: 'المهندس عبدالرحمن حامد',
    img: '/hero1.webp',
  };

  const curriculum = [
    {
      title: 'الوحدة الأولى: أساسيات البرمجة',
      lessons: [
        { title: 'مقدمة في علم البرمجة', duration: '15:20', type: 'video' },
        { title: 'كتابة أول كود لك', duration: '22:10', type: 'video' },
        { title: 'المتغيرات وأنواع البيانات (Variables & Data Types)', duration: '35:00', type: 'video' },
        { title: 'مذكرة الوحدة الأولى', duration: 'PDF', type: 'doc' },
      ]
    },
    {
      title: 'الوحدة الثانية: الخوارزميات (Algorithms)',
      lessons: [
        { title: 'ما هي الخوارزميات؟ وكيف تفكر كالمبرمج؟', duration: '28:45', type: 'video' },
        { title: 'تطبيق عملي: خوارزمية البحث الخطي', duration: '41:10', type: 'video' },
        { title: 'اختبار قصير على الخوارزميات', duration: '10:00', type: 'quiz' },
      ]
    },
    {
      title: 'الوحدة الثالثة: مقدمة في الذكاء الاصطناعي',
      lessons: [
        { title: 'مفاهيم الذكاء الاصطناعي الأساسية', duration: '33:15', type: 'video' },
        { title: 'كيف تتعلم الآلة؟ (Machine Learning)', duration: '45:00', type: 'video' },
        { title: 'مشروع الوحدة الثالثة', duration: 'مهمة', type: 'doc' },
      ]
    }
  ];

  const features = [
    'وصول مدى الحياة لمحتوى الكورس',
    'مذكرات PDF وملفات تدريبية لكل درس',
    'شهادة إتمام معتمدة بعد إنهاء الكورس',
    'جروب دعم فني للإجابة على جميع استفساراتك',
    'امتحانات دورية وتدريبات عملية'
  ];

  const handleSubscribeClick = () => {
    if (!isLoggedIn) {
      window.location.href = `/login?redirect=/courses/${unwrappedParams.id}`;
    } else {
      setShowPayModal(true);
    }
  };

  const handleConfirmEnroll = () => {
    setPaySuccess(true);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', direction: 'rtl', fontFamily: 'Tajawal, sans-serif' }}>
      
      {/* Course Hero Banner */}
      <div style={{ background: 'linear-gradient(135deg, rgba(15,10,50,0.95) 0%, rgba(108,34,249,0.85) 100%)', padding: '60px 0', color: '#fff' }}>
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Link href="/courses" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 14, fontWeight: 700 }}>
              <ArrowRight size={16} /> العودة للكورسات
            </Link>
          </div>
          
          <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <span style={{ background: '#059669', color: '#fff', padding: '4px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>أولى ثانوي</span>
                <span style={{ background: '#d97706', color: '#fff', padding: '4px 12px', borderRadius: 8, fontSize: 13, fontWeight: 700 }}>شرح المنهج</span>
              </div>
              <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, marginBottom: 16, lineHeight: 1.3 }}>
                {course.title}
              </h1>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, marginBottom: 32, maxWidth: 600 }}>
                {course.desc}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><User size={18} color="#a78bfa" /> المدرس: {course.instructor}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Clock size={18} color="#a78bfa" /> {course.duration}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><BookOpen size={18} color="#a78bfa" /> {course.lessonsCount} درس</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><User size={18} color="#a78bfa" /> {course.students} طالب مسجل</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px', display: 'flex', gap: 40, alignItems: 'flex-start' }}>
        
        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 40 }}>
          
          {/* About Section */}
          <section>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#16133a', marginBottom: 20 }}>ماذا ستتعلم في هذا الكورس؟</h2>
            <div style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                {features.map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 15, color: '#4b5563', lineHeight: 1.6, fontWeight: 600 }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Curriculum Section */}
          <section>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#16133a', marginBottom: 20 }}>محتوى الكورس</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {curriculum.map((unit, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.02)', border: '1px solid #f1f5f9' }}>
                  
                  {/* Unit Header */}
                  <div style={{ background: '#f8fafc', padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#16133a', margin: 0 }}>{unit.title}</h3>
                    <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>{unit.lessons.length} دروس</span>
                  </div>

                  {/* Lessons List */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {unit.lessons.map((lesson, j) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: j !== unit.lessons.length - 1 ? '1px solid #f1f5f9' : 'none', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          {lesson.type === 'video' && <Video size={18} color="#6b7280" />}
                          {lesson.type === 'doc' && <FileText size={18} color="#6b7280" />}
                          {lesson.type === 'quiz' && <CheckCircle size={18} color="#6b7280" />}
                          <span style={{ fontSize: 15, color: '#4b5563', fontWeight: 600 }}>{lesson.title}</span>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 600 }}>{lesson.duration}</span>
                          <Lock size={16} color="#d1d5db" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sticky Checkout Sidebar */}
        <div className="checkout-sidebar" style={{ width: 360, flexShrink: 0 }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', position: 'sticky', top: 100 }}
          >
            <div style={{ position: 'relative', height: 220, background: '#16133a' }}>
              <Image src={course.img} alt={course.title} fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <PlayCircle size={32} color="#fff" />
                </div>
              </div>
            </div>

            <div style={{ padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'end', gap: 12, marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: '#16133a', lineHeight: 1 }}>{course.price}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#16133a', marginBottom: 4 }}>ج.م</span>
                <span style={{ fontSize: 16, color: '#9ca3af', textDecoration: 'line-through', marginBottom: 4, marginRight: 8 }}>{course.originalPrice} ج.م</span>
              </div>

              <button
                onClick={handleSubscribeClick}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',
                  padding: '16px', background: '#6C22F9', color: '#fff', border: 'none',
                  borderRadius: 14, fontSize: 16, fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(108,34,249,0.3)', marginBottom: 16, fontFamily: 'Tajawal, sans-serif'
                }}
              >
                {isLoggedIn ? 'الاشتراك في الكورس الآن 🚀' : 'تسجيل الدخول للاشتراك 🔑'}
              </button>
              
              <p style={{ textAlign: 'center', fontSize: 13, color: '#6b7280', margin: 0, fontWeight: 600 }}>
                يتوفر الدفع بواسطة أكواد التفعيل والمحافظ الإلكترونية
              </p>

              <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '24px 0' }} />

              <h4 style={{ fontSize: 15, fontWeight: 800, color: '#16133a', marginBottom: 16 }}>يشمل هذا الكورس:</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#4b5563', fontWeight: 600 }}><Video size={16} color="#6C22F9" /> 24 ساعة من المحتوى المرئي</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#4b5563', fontWeight: 600 }}><FileText size={16} color="#6C22F9" /> 15 مذكرة قابلة للتحميل</li>
                <li style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: '#4b5563', fontWeight: 600 }}><CheckCircle size={16} color="#6C22F9" /> امتحانات بعد كل وحدة</li>
              </ul>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Subscribe Modal for Logged In Students */}
      <AnimatePresence>
        {showPayModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowPayModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ position: 'relative', background: '#fff', borderRadius: 24, border: '1px solid #e2e8f0', padding: 28, width: '100%', maxWidth: 500, zIndex: 1000, fontFamily: 'Tajawal, sans-serif' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#16133a' }}>إتمام الاشتراك في الكورس 💳</h3>
                <button onClick={() => setShowPayModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              {paySuccess ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
                  <h4 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 900, color: '#16133a' }}>تم تفعيل الكورس بنجاح! 🎉</h4>
                  <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>تمت إضافة الكورس لحسابك. يمكنك البدء بالمشاهدة فوراً من لوحة تحكم الطالب.</p>
                  <Link href="/courses/1/watch" style={{ display: 'inline-block', background: '#6C22F9', color: '#fff', padding: '12px 28px', borderRadius: 12, fontWeight: 800, textDecoration: 'none' }}>
                    بدء مشاهدة دروس الكورس 🚀
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ background: '#f8fafc', padding: 16, borderRadius: 14, border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: '0 0 4px', fontSize: 13, color: '#64748b', fontWeight: 600 }}>الكورس المحدد:</p>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#6C22F9' }}>{course.title} ({course.price} ج.م)</h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Link href="/dashboard/wallet" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, background: '#faf5ff', borderRadius: 12, border: '1px solid #ddd6fe', textDecoration: 'none', color: '#6C22F9', fontWeight: 800 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Wallet size={18} /> الخصم المباشر من المحفظة (رصيدك: 450 ج.م)</span>
                      <span>خصم 350 ج.م</span>
                    </Link>

                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>أو أدخل كود التفعيل / كارت الشحن:</label>
                      <input
                        type="text" value={activationCode} onChange={e => setActivationCode(e.target.value.toUpperCase())}
                        placeholder="مثال: AH-2026-X9YZ"
                        style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #cbd5e1', outline: 'none', fontSize: 14, fontWeight: 800, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                    <button onClick={() => setShowPayModal(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>إلغاء</button>
                    <button onClick={handleConfirmEnroll} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#6C22F9', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
                      تأكيد الاشتراك والتفعيل ⚡️
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
