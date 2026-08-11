'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) setError('رابط الدعوة غير صالح');
  }, [token]);

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      return;
    }
    if (password !== confirm) {
      setError('كلمتا المرور غير متطابقتين');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/v1/team/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'حدث خطأ');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/admin/login'), 3000);
    } catch {
      setError('تعذر الاتصال بالسيرفر');
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

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%', maxWidth: 440,
          background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)', borderRadius: 28,
          padding: '48px 40px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
        }}
      >
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
              <CheckCircle size={72} color="#22c55e" style={{ margin: '0 auto 24px' }} />
            </motion.div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', marginBottom: 12 }}>تم بنجاح! 🎉</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15 }}>حسابك جاهز. سيتم تحويلك لصفحة الدخول...</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{
                width: 72, height: 72, borderRadius: 22,
                background: 'linear-gradient(135deg, #6C22F9, #4f46e5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(108,34,249,0.4)',
              }}>
                <ShieldCheck size={36} color="#fff" />
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>قبول دعوة الفريق</h1>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', margin: 0 }}>اختر كلمة مرور لحسابك</p>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 12, padding: '12px 16px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, color: '#fca5a5', fontSize: 14, fontWeight: 600 }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleAccept} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {[
                { label: 'كلمة المرور الجديدة', value: password, setter: setPassword },
                { label: 'تأكيد كلمة المرور', value: confirm, setter: setConfirm },
              ].map(({ label, value, setter }, i) => (
                <div key={i}>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 8 }}>{label}</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={18} color="rgba(255,255,255,0.4)" style={{ position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={value}
                      onChange={e => setter(e.target.value)}
                      required
                      placeholder="••••••••"
                      style={{
                        width: '100%', background: 'rgba(255,255,255,0.07)',
                        border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12,
                        padding: '13px 44px', color: '#fff', fontSize: 15,
                        fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = 'rgba(108,34,249,0.7)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                    />
                    {i === 0 && (
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', top: '50%', left: 14, transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 0 }}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    )}
                  </div>
                </div>
              ))}

              <motion.button type="submit" disabled={loading || !token}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{
                  width: '100%', background: loading ? 'rgba(108,34,249,0.5)' : 'linear-gradient(135deg, #6C22F9, #4f46e5)',
                  color: '#fff', border: 'none', borderRadius: 14, padding: '15px',
                  fontSize: 16, fontWeight: 900, fontFamily: 'Tajawal, sans-serif',
                  cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8,
                  boxShadow: '0 8px 24px rgba(108,34,249,0.4)',
                }}>
                {loading ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
              </motion.button>
            </form>
          </>
        )}
      </motion.div>
      <style>{`input::placeholder { color: rgba(255,255,255,0.25); }`}</style>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f0c29' }} />}>
      <AcceptInviteContent />
    </Suspense>
  );
}
