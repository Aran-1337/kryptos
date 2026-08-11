'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOCKOUT_MINUTES = 15;
const MAX_LOGIN_ATTEMPTS = 5;

function AdminLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [loginLocked, setLoginLocked] = useState<number | null>(null);
  const [loginCountdown, setLoginCountdown] = useState(0);

  // Load persisted lockout from sessionStorage
  useEffect(() => {
    const storedLogin = sessionStorage.getItem('admin_login_lockout');
    if (storedLogin) {
      const until = parseInt(storedLogin);
      if (until > Date.now()) setLoginLocked(until);
      else sessionStorage.removeItem('admin_login_lockout');
    }
  }, []);

  // Countdown timer for lockout
  useEffect(() => {
    let t: ReturnType<typeof setInterval>;
    if (loginLocked) {
      t = setInterval(() => {
        const remaining = Math.ceil((loginLocked - Date.now()) / 1000);
        if (remaining <= 0) {
          setLoginLocked(null);
          setLoginAttempts(0);
          setLoginCountdown(0);
          sessionStorage.removeItem('admin_login_lockout');
        } else {
          setLoginCountdown(remaining);
        }
      }, 1000);
    }
    return () => clearInterval(t);
  }, [loginLocked]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}:${s.toString().padStart(2, '0')} دقيقة` : `${s} ثانية`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginLocked) return;
    setError('');
    setLoading(true);

    try {
      // First try admin login (User model)
      let res = await fetch('http://localhost:5000/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      let data = await res.json();
      let isAssistant = false;

      // If failed or not admin role, try team member login
      if (!res.ok || data.data?.user?.role !== 'admin') {
        const teamRes = await fetch('http://localhost:5000/api/v1/team/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email, password }),
        });
        const teamData = await teamRes.json();

        if (!teamRes.ok) {
          const newAttempts = loginAttempts + 1;
          setLoginAttempts(newAttempts);
          if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
            const until = Date.now() + LOCKOUT_MINUTES * 60 * 1000;
            setLoginLocked(until);
            sessionStorage.setItem('admin_login_lockout', until.toString());
            setError(`تم قفل الحساب لمدة ${LOCKOUT_MINUTES} دقيقة بسبب كثرة المحاولات الفاشلة`);
          } else {
            setError(`البريد الإلكتروني أو كلمة المرور غير صحيحة (متبقي ${MAX_LOGIN_ATTEMPTS - newAttempts} محاولات)`);
          }
          setLoading(false);
          return;
        }

        data = teamData;
        isAssistant = true;
      }

      const accessToken = data.data?.accessToken;
      if (!accessToken) { setError('حدث خطأ، حاول تاني'); setLoading(false); return; }

      document.cookie = `admin_token=${accessToken}; path=/; max-age=${60 * 60 * 8}; SameSite=Strict`;
      const userData = data.data?.user;
      localStorage.setItem('admin_user', JSON.stringify(isAssistant ? { ...userData, role: 'assistant' } : userData));

      setLoginAttempts(0);
      router.push(redirect);
    } catch {
      setError('تعذر الاتصال بالسيرفر. تأكد من تشغيل الـ Backend');
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29 0%, #1a1350 50%, #24243e 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'Tajawal, sans-serif', direction: 'rtl',
    }}>
      <div style={{ position: 'fixed', top: '20%', right: '20%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,34,249,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '20%', left: '20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          width: '100%', maxWidth: 440,
          background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)', borderRadius: 28,
          padding: '48px 40px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 22,
            background: 'linear-gradient(135deg, #6C22F9, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(108,34,249,0.4)',
          }}>
            <ShieldCheck size={36} color="#fff" />
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>لوحة تحكم الأدمن</h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: 0 }}>سجل دخولك للمتابعة</p>
        </div>

        {loginLocked ? (
          <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 14, padding: '20px', textAlign: 'center' }}>
            <AlertCircle size={32} color="#fca5a5" style={{ margin: '0 auto 12px' }} />
            <p style={{ color: '#fca5a5', fontWeight: 800, fontSize: 15, margin: '0 0 8px' }}>تم قفل تسجيل الدخول مؤقتاً</p>
            <p style={{ color: 'rgba(252,165,165,0.7)', fontSize: 13, margin: 0 }}>
              حاول بعد: <strong>{formatTime(loginCountdown)}</strong>
            </p>
          </div>
        ) : (
          <>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, color: '#fca5a5', fontSize: 14, fontWeight: 600 }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>البريد الإلكتروني</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@platform.com"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '13px 44px 13px 16px', color: '#fff', fontSize: 15, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(108,34,249,0.7)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'} />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>كلمة المرور</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, padding: '13px 44px 13px 44px', color: '#fff', fontSize: 15, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = 'rgba(108,34,249,0.7)'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', top: '50%', left: 14, transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 0 }}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <motion.button type="submit" disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{
                  width: '100%', background: loading ? 'rgba(108,34,249,0.5)' : 'linear-gradient(135deg, #6C22F9, #4f46e5)',
                  color: '#fff', border: 'none', borderRadius: 14, padding: '15px',
                  fontSize: 16, fontWeight: 900, fontFamily: 'Tajawal, sans-serif',
                  cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8,
                  boxShadow: loading ? 'none' : '0 8px 24px rgba(108,34,249,0.4)',
                }}>
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                    <span style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} />
                    جاري الدخول...
                  </span>
                ) : 'تسجيل الدخول'}
              </motion.button>
            </form>
          </>
        )}

        <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 24 }}>
          الدخول محدود للمشرفين المعتمدين فقط 🔐
        </p>
      </motion.div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: rgba(255,255,255,0.25); }
      `}</style>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f0c29' }} />}>
      <AdminLoginContent />
    </Suspense>
  );
}
