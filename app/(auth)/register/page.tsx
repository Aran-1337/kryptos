'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FiArrowRight, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import { HiAcademicCap } from 'react-icons/hi2';
import Stepper from './_components/Stepper';
import Step1Account from './_components/Step1Account';
import Step2Student from './_components/Step2Student';
import Step3Guardian from './_components/Step3Guardian';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const nameRegex = /^[\u0600-\u06FFa-zA-Z\s]+$/;
const egyptPhone = /^(010|011|012|015)\d{8}$/;
const strongPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/;

type Step1Data = { firstName: string; fatherName: string; lastName: string; email: string; phone: string; password: string; confirmPassword: string; };
type Step2Data = { grade: string; school: string; governorate: string; city: string; birthDate: string; gender: string; educationType: string; };
type GuardianData = { fullName: string; relation: string; phone: string; altPhone: string; email: string; };
type Consents = { acceptTerms: boolean; acceptPrivacy: boolean; acceptNotifications: boolean; };

const initStep1: Step1Data = { firstName: '', fatherName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' };
const initStep2: Step2Data = { grade: '', school: '', governorate: '', city: '', birthDate: '', gender: '', educationType: '' };
const initGuardian: GuardianData = { fullName: '', relation: '', phone: '', altPhone: '', email: '' };
const initConsents: Consents = { acceptTerms: false, acceptPrivacy: false, acceptNotifications: false };

function validateStep1(d: Step1Data): Record<string, string> {
  const e: Record<string, string> = {};
  if (!d.firstName || d.firstName.length < 3) e.firstName = 'الاسم الأول لا يقل عن 3 أحرف';
  else if (!nameRegex.test(d.firstName)) e.firstName = 'الاسم الأول لا يحتوي على أرقام أو رموز';
  if (!d.fatherName || d.fatherName.length < 3) e.fatherName = 'اسم الأب لا يقل عن 3 أحرف';
  else if (!nameRegex.test(d.fatherName)) e.fatherName = 'اسم الأب لا يحتوي على أرقام أو رموز';
  if (!d.lastName || d.lastName.length < 3) e.lastName = 'اسم العائلة لا يقل عن 3 أحرف';
  else if (!nameRegex.test(d.lastName)) e.lastName = 'اسم العائلة لا يحتوي على أرقام أو رموز';
  if (!d.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = 'البريد الإلكتروني غير صالح';
  if (!d.phone) e.phone = 'رقم الهاتف مطلوب';
  else if (!egyptPhone.test(d.phone)) e.phone = 'رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 010/011/012/015';
  if (!d.password || d.password.length < 8) e.password = 'كلمة المرور 8 أحرف على الأقل';
  else if (!strongPass.test(d.password)) e.password = 'يجب أن تحتوي على حرف كبير وصغير ورقم ورمز';
  if (d.confirmPassword !== d.password) e.confirmPassword = 'كلمة المرور غير متطابقة';
  return e;
}

function validateStep2(d: Step2Data): Record<string, string> {
  const e: Record<string, string> = {};
  if (!d.grade) e.grade = 'الصف الدراسي مطلوب';
  if (!d.educationType) e.educationType = 'نوع التعليم مطلوب';
  if (!d.governorate) e.governorate = 'المحافظة مطلوبة';
  if (!d.gender) e.gender = 'الجنس مطلوب';
  return e;
}

function validateStep3(g: GuardianData, c: Consents, studentPhone: string): Record<string, string> {
  const e: Record<string, string> = {};
  if (!g.fullName || g.fullName.length < 3) e['guardian.fullName'] = 'اسم ولي الأمر لا يقل عن 3 أحرف';
  else if (!nameRegex.test(g.fullName)) e['guardian.fullName'] = 'الاسم لا يحتوي على أرقام أو رموز';
  if (!g.relation) e['guardian.relation'] = 'صلة القرابة مطلوبة';
  if (!g.phone) e['guardian.phone'] = 'رقم هاتف ولي الأمر مطلوب';
  else if (!egyptPhone.test(g.phone)) e['guardian.phone'] = 'رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 010/011/012/015';
  else if (g.phone === studentPhone) e['guardian.phone'] = 'رقم ولي الأمر يجب أن يختلف عن رقم الطالب';
  if (!c.acceptTerms) e.acceptTerms = 'مطلوب';
  if (!c.acceptPrivacy) e.acceptPrivacy = 'مطلوب';
  return e;
}

const STEP_INFO = [
  { title: 'بيانات الحساب', subtitle: 'أدخل بياناتك الشخصية ومعلومات تسجيل الدخول', color: '#6c63ff' },
  { title: 'بيانات الطالب', subtitle: 'أدخل معلوماتك الدراسية والشخصية', color: '#f59e0b' },
  { title: 'بيانات ولي الأمر', subtitle: 'أدخل معلومات ولي الأمر والموافقات المطلوبة', color: '#10b981' },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [step1, setStep1] = useState<Step1Data>(initStep1);
  const [step2, setStep2] = useState<Step2Data>(initStep2);
  const [guardian, setGuardian] = useState<GuardianData>(initGuardian);
  const [consents, setConsents] = useState<Consents>(initConsents);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const scrollToFirstError = (errs: Record<string, string>) => {
    const firstKey = Object.keys(errs)[0];
    if (!firstKey) return;
    setTimeout(() => {
      const el = document.querySelector<HTMLElement>(`[name="${firstKey}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus();
    }, 50);
  };

  const handleNext = async () => {
    let errs: Record<string, string> = {};
    if (step === 0) {
      errs = validateStep1(step1);
      if (Object.keys(errs).length === 0) {
        try {
          const res = await fetch(`${API}/auth/check-availability`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: step1.email, phone: step1.phone }),
          });
          const data = await res.json();
          if (data.errors && Object.keys(data.errors).length > 0) {
            setErrors(data.errors);
            scrollToFirstError(data.errors);
            return;
          }
        } catch {
          setApiError('حدث خطأ، حاول مرة أخرى');
          return;
        }
      }
    }
    if (step === 1) errs = validateStep2(step2);
    setErrors(errs);
    if (Object.keys(errs).length > 0) scrollToFirstError(errs);
    else setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    const errs = validateStep3(guardian, consents, step1.phone);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      scrollToFirstError(errs);
      return;
    }
    try {
      const res = await fetch(`${API}/auth/check-availability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: guardian.phone }),
      });
      const data = await res.json();
      if (data.errors?.phone) {
        const e = { 'guardian.phone': 'رقم هاتف ولي الأمر مستخدم من قبل' };
        setErrors(e);
        scrollToFirstError(e);
        return;
      }
    } catch {
      setApiError('حدث خطأ، حاول مرة أخرى');
      return;
    }

    setLoading(true);
    setApiError('');
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...step1, ...step2,
          guardian: {
            fullName: guardian.fullName, relation: guardian.relation, phone: guardian.phone,
            ...(guardian.altPhone && { altPhone: guardian.altPhone }),
            ...(guardian.email && { email: guardian.email }),
          },
          acceptTerms: String(consents.acceptTerms),
          acceptPrivacy: String(consents.acceptPrivacy),
          acceptNotifications: consents.acceptNotifications,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'حدث خطأ، حاول مرة أخرى');
      router.push('/login');
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'حدث خطأ، حاول مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  const isStep3Valid = consents.acceptTerms && consents.acceptPrivacy &&
    guardian.fullName && guardian.relation && guardian.phone;

  const progress = ((step) / 3) * 100;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', direction: 'rtl', background: '#f8f9fa', fontFamily: 'Tajawal, sans-serif' }}>
      {/* Right Side (Visual) - Hidden on Mobile */}
      <div className="auth-visual-side">
        <Image src="/hero1.webp" alt="Background" fill style={{ objectFit: 'cover' }} priority />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(15,10,50,0.9) 0%, rgba(108,34,249,0.7) 100%)',
        }} />
        <div style={{
          position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', height: '100%', padding: '60px', color: '#fff'
        }}>
          <h2 style={{ fontSize: 'clamp(32px, 4vw, 48px)', fontWeight: 900, marginBottom: 24, lineHeight: 1.3 }}>
            انضم إلينا<br />وابدأ رحلة التفوق
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', lineHeight: 1.8, maxWidth: 500 }}>
            خطوة واحدة تفصلك عن الانضمام لآلاف الطلاب على المنصة الأولى لتعلم البرمجة والذكاء الاصطناعي للمرحلة الثانوية.
          </p>
        </div>
      </div>

      {/* Left Side (Form) */}
      <div className="auth-form-side">
        <div className="form-container">
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Link href="/" style={{ display: 'inline-block', marginBottom: 16 }}>
              <Image src="/Logo-cropped.png" alt="Logo" width={340} height={76} style={{ objectFit: 'contain' }} />
            </Link>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#16133a', marginBottom: 8 }}>إنشاء حساب جديد ✨</h1>
          </div>
          
          <div style={{ width: '100%' }}>
        {/* Header Card */}
        <div style={{
          background: `linear-gradient(135deg, ${STEP_INFO[step].color}15, ${STEP_INFO[step].color}08)`,
          border: `1.5px solid ${STEP_INFO[step].color}30`,
          borderRadius: 20, padding: '20px 24px', marginBottom: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          transition: 'all .4s',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <HiAcademicCap size={18} color={STEP_INFO[step].color} />
              <span style={{ fontSize: 13, fontWeight: 700, color: STEP_INFO[step].color }}>
                الخطوة {step + 1} من 3
              </span>
            </div>
            <h1 style={{ fontSize: 'clamp(18px, 2.5vw, 22px)', fontWeight: 900, color: 'var(--text-main)', marginBottom: 2 }}>
              {STEP_INFO[step].title}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{STEP_INFO[step].subtitle}</p>
          </div>
          <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: `${STEP_INFO[step].color}18`,
            border: `2px solid ${STEP_INFO[step].color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, flexShrink: 0,
          }}>
            {['👤', '🎓', '👨‍👦'][step]}
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: 5, background: 'var(--border)', borderRadius: 10, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 10,
            background: `linear-gradient(90deg, ${STEP_INFO[step].color}, ${STEP_INFO[step].color}aa)`,
            width: `${progress + 33}%`, transition: 'width .5s cubic-bezier(.4,0,.2,1)',
          }} />
        </div>

        {/* Main Card */}
        <div style={{
          background: 'var(--surface)', borderRadius: 24,
          boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
          padding: 'clamp(20px, 3vw, 36px)',
        }}>
          <Stepper current={step} />

          {step === 0 && <Step1Account data={step1} errors={errors} onChange={(f, v) => setStep1(p => ({ ...p, [f]: v }))} />}
          {step === 1 && <Step2Student data={step2} errors={errors} onChange={(f, v) => setStep2(p => ({ ...p, [f]: v }))} />}
          {step === 2 && (
            <Step3Guardian
              guardian={guardian} consents={consents} errors={errors} studentPhone={step1.phone}
              onGuardianChange={(f, v) => setGuardian(p => ({ ...p, [f]: v }))}
              onConsentChange={(f, v) => setConsents(p => ({ ...p, [f]: v }))}
            />
          )}

          {apiError && (
            <div style={{
              marginTop: 16, padding: '12px 16px', borderRadius: 12,
              background: '#fff1f1', border: '1.5px solid #fca5a5',
              color: 'var(--danger)', fontSize: 14, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{ fontSize: 18 }}>⚠️</span> {apiError}
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexDirection: 'row-reverse' }}>
            {step < 2 ? (
              <button onClick={handleNext}
                style={{
                  flex: 1, padding: '13px 20px',
                  background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
                  color: '#fff', border: 'none', borderRadius: 14,
                  fontSize: 15, fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: '0 4px 16px rgba(108,99,255,0.35)',
                  fontFamily: 'Tajawal, sans-serif', transition: 'all .2s',
                }}>
                التالي <FiArrowLeft size={17} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading || !isStep3Valid}
                style={{
                  flex: 1, padding: '13px 20px',
                  background: loading || !isStep3Valid
                    ? '#d1d5db'
                    : 'linear-gradient(135deg, var(--success), #059669)',
                  color: '#fff', border: 'none', borderRadius: 14,
                  fontSize: 15, fontWeight: 800,
                  cursor: loading || !isStep3Valid ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  boxShadow: loading || !isStep3Valid ? 'none' : '0 4px 16px rgba(16,185,129,0.35)',
                  fontFamily: 'Tajawal, sans-serif', transition: 'all .2s',
                }}>
                {loading ? (
                  <>
                    <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                    جاري الإنشاء...
                  </>
                ) : (
                  <><FiCheckCircle size={18} /> إنشاء الحساب</>
                )}
              </button>
            )}
            {step > 0 && (
              <button onClick={() => { setStep(s => s - 1); setErrors({}); }}
                style={{
                  flex: 1, padding: '13px 20px',
                  background: 'var(--surface)', color: 'var(--primary)',
                  border: '2px solid var(--primary)', borderRadius: 14,
                  fontSize: 15, fontWeight: 800, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontFamily: 'Tajawal, sans-serif', transition: 'all .2s',
                }}>
                <FiArrowRight size={17} /> السابق
              </button>
            )}
          </div>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--text-muted)' }}>
            عندك حساب بالفعل؟{' '}
            <Link href="/login" style={{ color: 'var(--primary)', fontWeight: 800, textDecoration: 'none' }}>
              سجل دخول ←
            </Link>
          </p>
        </div>
        </div>
        </div>
      </div>

      <style>{`
        .auth-visual-side { display: none; position: relative; overflow: hidden; }
        .auth-form-side { width: 100%; display: flex; justify-content: center; padding: 24px; max-height: 100vh; overflow-y: auto; background: #f8f9fa; }
        .form-container { width: 100%; max-width: 500px; padding: 20px 0; }
        @media (min-width: 1024px) {
          .auth-visual-side { display: block; flex: 1; }
          .auth-form-side { width: 600px; padding: 40px; }
        }
        @media (min-width: 1280px) {
          .auth-form-side { width: 680px; }
          .form-container { max-width: 560px; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
