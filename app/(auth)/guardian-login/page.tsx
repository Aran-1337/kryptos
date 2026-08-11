'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { RiPhoneLine, RiLockPasswordLine, RiLoginCircleLine } from 'react-icons/ri';
import { motion } from 'framer-motion';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export default function GuardianLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handlePhoneChange = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length >= 2 && !digits.startsWith('01')) return;
    setForm(p => ({ ...p, phone: digits }));
    if (errors.phone) setErrors(p => ({ ...p, phone: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.phone) e.phone = 'رقم الهاتف مطلوب';
    else if (form.phone.length < 11) e.phone = 'رقم الهاتف يجب أن يكون 11 رقم';
    else if (!/^(010|011|012|015)\d{8}$/.test(form.phone)) e.phone = 'يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015';
    if (!form.password) e.password = 'كلمة المرور مطلوبة';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    setApiError('');
    try {
      const res = await fetch(`${API}/auth/guardian-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ phone: form.phone, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'حدث خطأ، حاول مرة أخرى');
      localStorage.setItem('accessToken', data.data.accessToken);
      router.push('/dashboard');
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', direction: 'rtl', background: '#fff', fontFamily: 'Tajawal, sans-serif' }}>
      {/* Right Side (Visual) - Hidden on Mobile */}
      <div className="auth-visual-side">
        <Image src="/th1.webp" alt="Background" fill style={{ objectFit: 'cover' }} priority />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(15,10,50,0.9) 0%, rgba(108,34,249,0.7) 100%)',
        }} />
        <div style={{
          position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', height: '100%', padding: '60px', color: '#fff'
        }}>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, marginBottom: 24, lineHeight: 1.3 }}>
              تابع مستوى أبنائك<br />خطوة بخطوة
            </h2>
            <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.9)', lineHeight: 1.8, maxWidth: 500 }}>
              بوابة ولي الأمر توفر لك تقارير دقيقة ومستمرة عن أداء الطالب وتطوره في جميع المواد.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Left Side (Form) */}
      <div className="auth-form-side">
        <motion.div 
          className="form-container"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        >
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <Link href="/" style={{ display: 'inline-block', marginBottom: 24 }}>
              <Image src="/Logo-cropped.png" alt="Logo" width={340} height={76} style={{ objectFit: 'contain' }} />
            </Link>
            <div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f3e8ff', padding: '6px 16px', borderRadius: 20, color: '#6C22F9', fontWeight: 800, fontSize: 14, marginBottom: 16 }}>
                بوابة ولي الأمر
              </span>
            </div>
            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#16133a', marginBottom: 8 }}>مرحباً بك مجدداً 👋</h1>
            <p style={{ color: '#6b7280', fontSize: 15 }}>سجّل دخولك لمتابعة مستوى تطور أبنائك</p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {/* Phone Input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700, color: '#16133a' }}>رقم الهاتف (ولي الأمر)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => handlePhoneChange(e.target.value)}
                  onFocus={() => setFocused('phone')}
                  onBlur={() => setFocused(null)}
                  placeholder="مثال: 01012345678"
                  maxLength={11}
                  style={{
                    width: '100%', padding: '16px 16px 16px 48px',
                    border: `2px solid ${errors.phone ? '#ef4444' : (focused === 'phone' ? '#6C22F9' : '#e5e7eb')}`,
                    borderRadius: 14, fontSize: 15, fontFamily: 'Tajawal, sans-serif',
                    background: focused === 'phone' ? '#fff' : '#f9fafb',
                    outline: 'none', transition: 'all 0.3s',
                    direction: 'rtl'
                  }}
                />
                <RiPhoneLine size={20} color={focused === 'phone' ? '#6C22F9' : '#9ca3af'} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', transition: 'color 0.3s' }} />
              </div>
              {errors.phone && <div style={{ color: '#ef4444', fontSize: 13, marginTop: 6, fontWeight: 600 }}>{errors.phone}</div>}
            </div>

            {/* Password Input */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 700, color: '#16133a' }}>كلمة المرور (أو رقم هاتف الطالب)</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => { setForm(p => ({ ...p, password: e.target.value })); if (errors.password) setErrors(p => ({ ...p, password: '' })); }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  placeholder="أدخل كلمة المرور"
                  style={{
                    width: '100%', padding: '16px 16px 16px 48px',
                    border: `2px solid ${errors.password ? '#ef4444' : (focused === 'password' ? '#6C22F9' : '#e5e7eb')}`,
                    borderRadius: 14, fontSize: 15, fontFamily: 'Tajawal, sans-serif',
                    background: focused === 'password' ? '#fff' : '#f9fafb',
                    outline: 'none', transition: 'all 0.3s'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {errors.password && <div style={{ color: '#ef4444', fontSize: 13, marginTop: 6, fontWeight: 600 }}>{errors.password}</div>}
            </div>

            {apiError && (
              <div style={{
                background: '#fef2f2', border: '1px solid #fecaca', padding: '12px 16px',
                borderRadius: 12, color: '#dc2626', fontSize: 14, fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20
              }}>
                ⚠️ {apiError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: 16,
                background: 'linear-gradient(135deg, #6C22F9, #9b6cf9)',
                color: '#fff', border: 'none', borderRadius: 14,
                fontSize: 16, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                boxShadow: '0 8px 24px rgba(108,34,249,0.25)',
                transition: 'all 0.3s', opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
                <>جاري الدخول...</>
              ) : (
                <><RiLoginCircleLine size={20} /> تسجيل الدخول</>
              )}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 32, fontSize: 15, color: '#6b7280' }}>
            رجوع إلى{' '}
            <Link href="/login" style={{ color: '#6C22F9', fontWeight: 800, textDecoration: 'none' }}>
              دخول الطالب ←
            </Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        .auth-visual-side {
          display: none;
          position: relative;
          overflow: hidden;
        }
        .auth-form-side {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }
        .form-container {
          width: 100%;
          max-width: 440px;
        }
        @media (min-width: 1024px) {
          .auth-visual-side {
            display: block;
            flex: 1;
          }
          .auth-form-side {
            width: 500px;
            padding: 40px;
          }
        }
        @media (min-width: 1280px) {
          .auth-form-side {
            width: 600px;
          }
        }
      `}</style>
    </div>
  );
}
