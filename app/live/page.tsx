'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Video, Calendar, Clock, User, Lock, LogIn, UserPlus, CreditCard, Sparkles, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import Link from 'next/link';

const upcomingLives = [
  {
    id: 1,
    title: 'بث مباشر: مراجعة شاملة لأساسيات الخوارزميات وتطبيقاتها',
    grade: 'الصف الأول الثانوي',
    date: 'الإثنين 12 أكتوبر 2026',
    time: '07:00 مساءً',
    instructor: 'م. عبدالرحمن حامد',
    status: 'قادم',
    price: '150 ج.م / شهر',
    requiresSubscription: true,
  },
  {
    id: 2,
    title: 'ورشة عمل تفاعلية: حل مشكلات التفكير البرمجي',
    grade: 'الصف الثاني الثانوي',
    date: 'الخميس 15 أكتوبر 2026',
    time: '05:00 مساءً',
    instructor: 'م. عبدالرحمن حامد',
    status: 'قادم',
    price: '150 ج.م / شهر',
    requiresSubscription: true,
  }
];

export default function LivePage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Check login state
    const token = localStorage.getItem('accessToken') || localStorage.getItem('admin_user');
    const hasCookie = document.cookie.includes('admin_token=') || document.cookie.includes('refreshToken=');
    const logged = !!token || hasCookie;
    setIsLoggedIn(logged);

    // Check if student has live subscription
    const subState = localStorage.getItem('live_subscribed') === 'true';
    setIsSubscribed(subState);
  }, []);

  const handleJoinClick = (e: React.MouseEvent, session: any) => {
    e.preventDefault();
    setSelectedSession(session);

    // Step 1: Not logged in
    if (!isLoggedIn) {
      setShowAuthModal(true);
      return;
    }

    // Step 2: Logged in but not subscribed
    if (!isSubscribed) {
      setShowSubModal(true);
      return;
    }

    // Step 3: Logged in & Subscribed -> Go to live room
    window.location.href = '/dashboard';
  };

  const handleSubscribeNow = () => {
    // Simulate subscription payment
    localStorage.setItem('live_subscribed', 'true');
    setIsSubscribed(true);
    setPaymentSuccess(true);
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', padding: '60px 0', direction: 'rtl', fontFamily: 'Tajawal, sans-serif', position: 'relative' }}>
      
      {/* ─── 1. Guest Auth Protection Modal ───────────────────────────────── */}
      <AnimatePresence>
        {showAuthModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowAuthModal(false)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(15,10,42,0.75)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{
                position: 'relative', width: '100%', maxWidth: 460,
                background: '#fff', borderRadius: 28, padding: '40px 32px',
                textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
                border: '1px solid #e2e8f0', zIndex: 1000,
              }}
            >
              <div style={{
                width: 72, height: 72, borderRadius: 24,
                background: 'linear-gradient(135deg, #6C22F9, #4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', boxShadow: '0 10px 28px rgba(108,34,249,0.3)',
              }}>
                <Lock size={36} color="#fff" />
              </div>

              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#16133a', margin: '0 0 10px' }}>
                تسجيل الدخول مطلوب 🔐
              </h2>
              <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: '0 0 28px' }}>
                البث المباشر والحصص التفاعلية مخصصة للطلاب المسجلين والمشتركين. سجل دخولك أولاً للمتابعة!
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Link
                  href="/login?redirect=/live"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff',
                    padding: '14px', borderRadius: 14, fontSize: 16, fontWeight: 900,
                    textDecoration: 'none', boxShadow: '0 8px 24px rgba(108,34,249,0.35)',
                  }}
                >
                  <LogIn size={18} /> تسجيل الدخول
                </Link>

                <Link
                  href="/register"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: '#f8fafc', color: '#16133a', border: '1px solid #cbd5e1',
                    padding: '14px', borderRadius: 14, fontSize: 15, fontWeight: 800,
                    textDecoration: 'none',
                  }}
                >
                  <UserPlus size={18} /> إنشاء حساب طالب جديد
                </Link>
              </div>

              <button
                onClick={() => setShowAuthModal(false)}
                style={{
                  background: 'none', border: 'none', color: '#94a3b8',
                  fontSize: 13, fontWeight: 700, marginTop: 20, cursor: 'pointer',
                  fontFamily: 'Tajawal, sans-serif'
                }}
              >
                إغلاق
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── 2. Subscription Gate Modal (Pay Required) ────────────────────── */}
      <AnimatePresence>
        {showSubModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowSubModal(false); setPaymentSuccess(false); }}
              style={{ position: 'absolute', inset: 0, background: 'rgba(15,10,42,0.75)', backdropFilter: 'blur(8px)' }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{
                position: 'relative', width: '100%', maxWidth: 480,
                background: '#fff', borderRadius: 28, padding: '40px 32px',
                textAlign: 'center', boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
                border: '1px solid #e2e8f0', zIndex: 1000,
              }}
            >
              {paymentSuccess ? (
                <div style={{ padding: '10px 0' }}>
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                    <CheckCircle2 size={64} color="#22c55e" style={{ margin: '0 auto 16px' }} />
                  </motion.div>
                  <h2 style={{ fontSize: 24, fontWeight: 900, color: '#16133a', margin: '0 0 8px' }}>تم تفعيل الاشتراك بنجاح! 🎉</h2>
                  <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>
                    مرحباً بك في البث المباشر! يمكنك الآن انضمام لجميع الحصص المباشرة والورش التفاعلية.
                  </p>
                  <button
                    onClick={() => { setShowSubModal(false); window.location.href = '/dashboard'; }}
                    style={{
                      width: '100%', background: 'linear-gradient(135deg, #22c55e, #16a34a)', color: '#fff',
                      border: 'none', borderRadius: 14, padding: '14px', fontSize: 16, fontWeight: 900,
                      cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', boxShadow: '0 8px 24px rgba(34,197,94,0.3)',
                    }}
                  >
                    🚀 دخول البث المباشر الآن
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowSubModal(false)}
                    style={{ position: 'absolute', top: 20, left: 20, background: '#f1f5f9', border: 'none', width: 34, height: 34, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
                  >
                    <X size={18} />
                  </button>

                  <div style={{
                    width: 72, height: 72, borderRadius: 24,
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 20px', boxShadow: '0 10px 28px rgba(239,68,68,0.35)',
                  }}>
                    <CreditCard size={36} color="#fff" />
                  </div>

                  <span style={{ background: '#fef2f2', color: '#ef4444', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 900, display: 'inline-block', marginBottom: 12 }}>
                    🔴 حصري للطلاب المشتركين
                  </span>

                  <h2 style={{ fontSize: 22, fontWeight: 900, color: '#16133a', margin: '0 0 10px' }}>
                    اشتراك البث المباشر مطلوب 💳
                  </h2>

                  <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, margin: '0 0 20px' }}>
                    عفواً، هذه الحصة المباشرة تقتضي وجود اشتراك شهري في البث التفاعلي لحضور جميع الورش ومراجعات ليلة الامتحان.
                  </p>

                  <div style={{ background: '#f8fafc', borderRadius: 16, padding: '16px 20px', marginBottom: 24, border: '1px solid #e2e8f0', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>الحصة المطلوبة:</span>
                      <span style={{ fontSize: 13, fontWeight: 800, color: '#16133a' }}>{selectedSession?.title}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8, borderTop: '1px solid #e2e8f0' }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#16133a' }}>قيمة الاشتراك الشهري:</span>
                      <span style={{ fontSize: 18, fontWeight: 900, color: '#6C22F9' }}>150 ج.م / شهر</span>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleSubscribeNow}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    style={{
                      width: '100%', background: 'linear-gradient(135deg, #6C22F9, #4f46e5)',
                      color: '#fff', border: 'none', borderRadius: 14, padding: '15px',
                      fontSize: 16, fontWeight: 900, fontFamily: 'Tajawal, sans-serif',
                      cursor: 'pointer', boxShadow: '0 8px 24px rgba(108,34,249,0.35)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    }}
                  >
                    <Sparkles size={18} /> تفعيل الاشتراك والانضمام الآن
                  </motion.button>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="container">
        
        {/* Header */}
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 40px' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 8, height: 8, background: '#ef4444', borderRadius: '50%' }} /> البث المباشر والحصص التفاعلية
            </span>
            <h1 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, color: '#16133a', margin: '16px 0 12px' }}>
              احضر حصصك المباشرة وراجع مع مهندسك
            </h1>
            <p style={{ fontSize: 16, color: '#6b7280', lineHeight: 1.8, margin: 0 }}>
              جدول الحصص المباشرة والورش التفاعلية للرد على جميع أسئلتك ومراجعة ليلة الامتحان خطوة بخطوة.
            </p>
          </motion.div>
        </div>

        {/* Dynamic Status Banner */}
        {isLoggedIn === false ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              maxWidth: 800, margin: '0 auto 28px',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #2e1065 100%)',
              borderRadius: 20, padding: '20px 24px', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 16, flexWrap: 'wrap', boxShadow: '0 10px 30px rgba(30,27,75,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={22} color="#a78bfa" />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 15 }}>البث المباشر متاح للطلاب المسجلين فقط 🔒</p>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>سجل دخولك الآن للانضمام إلى الحصص التفاعلية</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/login?redirect=/live" style={{ background: '#6C22F9', color: '#fff', padding: '10px 20px', borderRadius: 12, fontSize: 13.5, fontWeight: 800, textDecoration: 'none' }}>
                تسجيل الدخول
              </Link>
              <Link href="/register" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '10px 20px', borderRadius: 12, fontSize: 13.5, fontWeight: 800, textDecoration: 'none' }}>
                إنشاء حساب
              </Link>
            </div>
          </motion.div>
        ) : isLoggedIn && !isSubscribed ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              maxWidth: 800, margin: '0 auto 28px',
              background: 'linear-gradient(135deg, #7c2d12 0%, #9a3412 100%)',
              borderRadius: 20, padding: '18px 24px', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 16, flexWrap: 'wrap', boxShadow: '0 10px 30px rgba(124,45,18,0.2)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={22} color="#fdba74" />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 15 }}>يتطلب اشتراك البث المباشر 🔴</p>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>أنت مسجل الدخول، لكنك محتاج تشترك في البث المباشر لحضور الحصص</p>
              </div>
            </div>
            <button
              onClick={() => setShowSubModal(true)}
              style={{ background: '#f97316', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12, fontSize: 13.5, fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
            >
              اشترك الآن 💳
            </button>
          </motion.div>
        ) : null}

        {/* Live Sessions List */}
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          {upcomingLives.map((session, i) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: '#fff',
                borderRadius: 24,
                padding: 32,
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                border: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                flexWrap: 'wrap',
                gap: 20
              }}
            >
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ background: '#eff6ff', color: '#3b82f6', fontSize: 12, fontWeight: 800, padding: '4px 10px', borderRadius: 8 }}>{session.grade}</span>
                  <span style={{ fontSize: 13, color: '#10b981', fontWeight: 700 }}>● {session.status}</span>
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#16133a', marginBottom: 12, lineHeight: 1.4 }}>{session.title}</h3>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: '#6b7280', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Calendar size={15} color="#6C22F9" /> {session.date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Clock size={15} color="#6C22F9" /> {session.time}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><User size={15} color="#6C22F9" /> {session.instructor}</span>
                </div>
              </div>

              <div>
                <button
                  onClick={(e) => handleJoinClick(e, session)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: (isLoggedIn && isSubscribed) ? '#6C22F9' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 14,
                    fontWeight: 800, fontSize: 14, cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(108,34,249,0.25)', fontFamily: 'Tajawal, sans-serif'
                  }}
                >
                  {isLoggedIn && isSubscribed ? (
                    <><Video size={18} /> انضم للبث المباشر</>
                  ) : !isLoggedIn ? (
                    <><Lock size={16} /> سجل دخول للانضمام 🔒</>
                  ) : (
                    <><CreditCard size={16} /> اشترك للانضمام 💳</>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
