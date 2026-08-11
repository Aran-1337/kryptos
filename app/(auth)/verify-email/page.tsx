'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

function VerifyEmailContent() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get('email') || '';
  const token = params.get('token') || '';

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(token ? 'loading' : 'idle');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);

  // Auto-verify if token in URL
  useState(() => {
    if (!token) return;
    fetch(`${API}/auth/verify-email/${token}`)
      .then(r => r.json())
      .then(d => {
        if (d.status === 'success') { setStatus('success'); setMessage('تم تأكيد بريدك الإلكتروني بنجاح! 🎉'); }
        else { setStatus('error'); setMessage(d.message || 'رمز التحقق غير صالح أو منتهي الصلاحية'); }
      })
      .catch(() => { setStatus('error'); setMessage('حدث خطأ، حاول مرة أخرى'); });
  });

  const resendEmail = async () => {
    if (!email) return;
    setResending(true);
    try {
      const res = await fetch(`${API}/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(res.ok ? 'تم إرسال رابط التحقق مرة أخرى، تحقق من بريدك 📧' : data.message || 'حدث خطأ');
    } catch {
      setMessage('حدث خطأ، حاول مرة أخرى');
    } finally {
      setResending(false);
    }
  };

  if (status === 'loading') {
    return (
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', fontWeight: 600 }}>جاري التحقق من بريدك الإلكتروني...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--success)', marginBottom: 8 }}>تم التحقق بنجاح!</h2>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 28 }}>{message}</p>
        <button onClick={() => router.push('/login')} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
          تسجيل الدخول الآن
        </button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{ textAlign: 'center', padding: 20 }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>❌</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--danger)', marginBottom: 8 }}>فشل التحقق</h2>
        <p style={{ fontSize: 15, color: 'var(--text-muted)', marginBottom: 28 }}>{message}</p>
        <button onClick={resendEmail} disabled={resending} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
          {resending ? '⏳ جاري الإرسال...' : 'إعادة إرسال رابط التحقق'}
        </button>
      </div>
    );
  }

  // Idle - waiting for user to check email
  return (
    <div style={{ textAlign: 'center', padding: 20 }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>📧</div>
      <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)', marginBottom: 12 }}>
        تحقق من بريدك الإلكتروني
      </h2>
      <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: 8 }}>
        أرسلنا رابط تفعيل الحساب إلى
      </p>
      {email && (
        <div style={{
          background: 'var(--primary-light)', borderRadius: 10, padding: '10px 20px',
          display: 'inline-block', marginBottom: 20,
          color: 'var(--primary)', fontWeight: 800, fontSize: 15,
          border: '1.5px solid rgba(108,99,255,0.2)',
        }}>
          {email}
        </div>
      )}
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28 }}>
        الرابط صالح لمدة 24 ساعة. تحقق من مجلد الـ Spam إذا لم تجده.
      </p>

      {message && (
        <div style={{
          padding: '12px 16px', borderRadius: 10, marginBottom: 16,
          background: '#d1fae5', border: '1px solid #6ee7b7',
          color: '#065f46', fontSize: 14, fontWeight: 600,
        }}>
          {message}
        </div>
      )}

      <button onClick={resendEmail} disabled={resending}
        className="btn btn-outline" style={{ width: '100%', marginBottom: 12 }}>
        {resending ? '⏳ جاري الإرسال...' : '🔄 إعادة إرسال الرابط'}
      </button>

      <Link href="/login" style={{ fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', display: 'block' }}>
        العودة لتسجيل الدخول
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '24px 16px',
    }}>
      <Link href="/" style={{ marginBottom: 28, display: 'block' }}>
        <Image src="/logo.webp" alt="logo" width={80} height={80} style={{ objectFit: 'contain' }} />
      </Link>

      <div style={{
        width: '100%', maxWidth: 460,
        background: 'var(--surface)', borderRadius: 24,
        boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
        padding: 'clamp(24px, 4vw, 40px)',
      }}>
        <Suspense fallback={<div style={{ textAlign: 'center', padding: 40 }}>⏳ جاري التحميل...</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
