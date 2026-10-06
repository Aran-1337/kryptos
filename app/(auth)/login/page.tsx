'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
const BRAND_BLUE = '#0084FF';

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleIdentifierChange = (val: string) => {
    setForm(p => ({ ...p, identifier: val }));
    if (errors.identifier) setErrors(p => ({ ...p, identifier: '' }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    const val = form.identifier.trim();
    if (!val) {
      e.identifier = 'يرجى إدخال رقم الهاتف أو البريد الإلكتروني';
    }
    if (!form.password) {
      e.password = 'كلمة المرور مطلوبة';
    }
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
      const cleanId = form.identifier.trim();
      const egyptPhoneRegex = /^(010|011|012|015)\d{8}$/;
      const loginPayload = egyptPhoneRegex.test(cleanId)
        ? { phone: cleanId, password: form.password }
        : { email: cleanId, password: form.password };

      const res = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginPayload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'البريد الإلكتروني/رقم الهاتف أو كلمة المرور غير صحيحة');
      }
      if (data.data?.accessToken) {
        localStorage.setItem('accessToken', data.data.accessToken);
      }
      document.cookie = 'student_token=active; path=/; max-age=2592000; SameSite=Strict;';
      router.push(data.data.user?.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: '#ffffff',
      fontFamily: 'Tajawal, sans-serif',
      direction: 'rtl',
      display: 'flex',
      alignItems: 'stretch',
      justifyContent: 'center',
      padding: '16px',
      boxSizing: 'border-box'
    }}>
      <style jsx global>{`
        @media (min-width: 1024px) {
          .lg\\:h-full {
            height: 100%;
          }
        }
        .rounded-xl {
          border-radius: 0.75rem;
        }
        @media (max-width: 1023px) {
          .login-split-wrapper {
            grid-template-columns: 1fr !important;
          }
          .login-visual-side {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Container - Full Width & Height Split without empty side gutters */}
      <div 
        className="login-split-wrapper"
        style={{
          width: '100%',
          minHeight: 'calc(100vh - 32px)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 20,
          alignItems: 'stretch',
          boxSizing: 'border-box'
        }}
      >
        {/* RIGHT SIDE (in RTL): Login Form Card */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-xl lg:h-full"
          style={{
            background: '#f3f4f6',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.04)',
            padding: 'clamp(32px, 4vw, 56px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxSizing: 'border-box',
            width: '100%',
            height: '100%'
          }}
        >
          <div style={{ width: '100%', maxWidth: 760 }}>
          {/* Centered Brand Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <Link href="/">
              <img 
                src="/Logo-cropped.png" 
                alt="Logo" 
                style={{ maxHeight: 92, maxWidth: 300, objectFit: 'contain' }} 
              />
            </Link>
          </div>

          {/* Title & Subtitle */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <h1 style={{ fontSize: 'clamp(24px, 2.5vw, 30px)', fontWeight: 900, color: '#111827', margin: '0 0 8px' }}>
              تسجيل الدخول إلى حسابك 👋
            </h1>
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
              ادخل رقم هاتفك أو بريدك الإلكتروني لمتابعة حصصك وكورساتك
            </p>
          </div>

          {apiError && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 700,
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <AlertCircle size={16} /> {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
            {/* Phone or Email Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={form.identifier}
                  onChange={e => handleIdentifierChange(e.target.value)}
                  onFocus={() => setFocused('identifier')}
                  onBlur={() => setFocused(null)}
                  placeholder="رقم الهاتف أو البريد الإلكتروني"
                  style={{
                    width: '100%',
                    border: 'none',
                    borderBottom: `1.5px solid ${errors.identifier ? '#ef4444' : (focused === 'identifier' ? BRAND_BLUE : '#d1d5db')}`,
                    borderRadius: 0,
                    background: 'transparent',
                    padding: '14px 14px 14px 44px',
                    textAlign: 'right',
                    direction: 'rtl',
                    fontSize: 15.5,
                    fontWeight: 700,
                    color: '#111827',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'Tajawal, sans-serif',
                    boxSizing: 'border-box'
                  }}
                />
                <User size={19} color={BRAND_BLUE} style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
              </div>
              {errors.identifier && <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 700 }}>⚠ {errors.identifier}</span>}
            </div>

            {/* Password Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => { setForm(p => ({ ...p, password: e.target.value })); if (errors.password) setErrors(p => ({ ...p, password: '' })); }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  placeholder="كلمة المرور"
                  style={{
                    width: '100%',
                    border: 'none',
                    borderBottom: `1.5px solid ${errors.password ? '#ef4444' : (focused === 'password' ? BRAND_BLUE : '#d1d5db')}`,
                    borderRadius: 0,
                    background: 'transparent',
                    padding: '14px 14px 14px 44px',
                    textAlign: 'right',
                    direction: 'rtl',
                    fontSize: 15.5,
                    fontWeight: 700,
                    color: '#111827',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    fontFamily: 'Tajawal, sans-serif',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', left: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}
                >
                  {showPass ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
              {errors.password && <span style={{ fontSize: 12, color: '#ef4444', fontWeight: 700 }}>⚠ {errors.password}</span>}
            </div>

            {/* Forgot Password Link */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -10 }}>
              <Link href="/forgot-password" style={{ color: BRAND_BLUE, fontSize: 13.5, fontWeight: 700, textDecoration: 'none' }}>
                نسيت كلمة المرور؟
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                borderRadius: 12,
                padding: '15px 20px',
                fontSize: 16.5,
                fontWeight: 900,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
                fontFamily: 'Tajawal, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              {loading ? (
                <span>جاري تسجيل الدخول...</span>
              ) : (
                <>
                  <LogIn size={20} />
                  <span>تسجيل الدخول</span>
                </>
              )}
            </button>
          </form>

          {/* Bottom Register Link */}
          <p style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: '#4b5563', margin: '32px 0 0' }}>
            ليس لديك حساب بعد؟{' '}
            <Link href="/register" style={{ color: BRAND_BLUE, fontWeight: 800, textDecoration: 'none' }}>
              أنشئ حساباً جديداً الآن !
            </Link>
          </p>

          </div>
        </motion.div>

        {/* LEFT SIDE (in RTL): Visual Image Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="login-visual-side rounded-xl lg:h-full"
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            border: '1px solid #e2e8f0',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.05)',
            background: '#ffffff',
            minHeight: 'calc(100vh - 32px)'
          }}
        >
          <Image
            src="/hero1.webp"
            alt="Abdelrahman Hamed - Programming & AI"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </motion.div>

      </div>
    </div>
  );
}
