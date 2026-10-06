'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  GraduationCap, 
  MapPin, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { getAcademicGrades, AcademicGrade } from '../../utils/academicGrades';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const egyptPhoneRegex = /^(010|011|012|015)\d{8}$/;
const BRAND_BLUE = '#0084FF';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: Personal, 1: Academic & Security, 2: Guardian & Terms
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Dynamic Academic Grades from Admin Settings
  const [availableGrades, setAvailableGrades] = useState<AcademicGrade[]>(() => {
    const all = getAcademicGrades();
    const active = all.filter(g => g.active);
    return active.length > 0 ? active : all;
  });

  useEffect(() => {
    const loadGrades = () => {
      const all = getAcademicGrades();
      const active = all.filter(g => g.active);
      if (active.length > 0) setAvailableGrades(active);
    };
    loadGrades();
    window.addEventListener('academic_grades_updated', loadGrades);
    return () => window.removeEventListener('academic_grades_updated', loadGrades);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    fatherName: '',
    grandfatherName: '',
    lastName: '',
    phone: '',
    grade: 'الصف الأول الثانوي',
    educationType: 'arabic',
    gender: 'male',
    governorate: 'القاهرة',
    city: '',
    email: '',
    password: '',
    confirmPassword: '',
    guardianName: '',
    guardianRelation: 'father',
    guardianPhone: '',
    acceptTerms: true,
    acceptPrivacy: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Validation
  const validateStep0 = () => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim() || formData.firstName.trim().length < 3) {
      errs.firstName = 'الاسم الأول يجب أن لا يقل عن 3 أحرف';
    }
    if (!formData.fatherName.trim() || formData.fatherName.trim().length < 3) {
      errs.fatherName = 'اسم الأب يجب أن لا يقل عن 3 أحرف';
    }
    if (!formData.grandfatherName.trim() || formData.grandfatherName.trim().length < 2) {
      errs.grandfatherName = 'يرجى إدخال اسم الجد';
    }
    if (!formData.lastName.trim() || formData.lastName.trim().length < 3) {
      errs.lastName = 'اسم العائلة يجب أن لا يقل عن 3 أحرف';
    }
    if (!formData.phone.trim()) {
      errs.phone = 'رقم هاتف الطالب مطلوب';
    } else if (!egyptPhoneRegex.test(formData.phone.trim())) {
      errs.phone = 'يجب أن يكون 11 رقم ويبدأ بـ 010 أو 011 أو 012 أو 015';
    }
    return errs;
  };

  const strongPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/;

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!formData.grade) errs.grade = 'يرجى اختيار المرحلة الدراسية';
    if (!formData.governorate) errs.governorate = 'يرجى اختيار المحافظة';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }
    if (!formData.password || formData.password.length < 8) {
      errs.password = 'كلمة المرور يجب أن لا تقل عن 8 أحرف';
    } else if (!strongPass.test(formData.password)) {
      errs.password = 'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم ورمز خاص';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'كلمة المرور وتأكيدها غير متطابقين';
    }
    return errs;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.guardianName.trim() || formData.guardianName.trim().length < 3) {
      errs.guardianName = 'يرجى إدخال اسم ولي الأمر كاملاً (3 أحرف على الأقل)';
    }
    if (!formData.guardianPhone.trim()) {
      errs.guardianPhone = 'رقم هاتف ولي الأمر مطلوب';
    } else if (!egyptPhoneRegex.test(formData.guardianPhone.trim())) {
      errs.guardianPhone = 'رقم هاتف ولي الأمر غير صحيح (11 رقم)';
    } else if (formData.guardianPhone.trim() === formData.phone.trim()) {
      errs.guardianPhone = 'يجب أن يختلف رقم ولي الأمر عن رقم هاتف الطالب';
    }
    if (!formData.acceptTerms) {
      errs.acceptTerms = 'يجب الموافقة على شروط الاستخدام للمتابعة';
    }
    return errs;
  };

  const handleNext = () => {
    if (step === 0) {
      const errs = validateStep0();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
      setStep(1);
    } else if (step === 1) {
      const errs = validateStep1();
      if (Object.keys(errs).length > 0) {
        setErrors(errs);
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateStep2();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    setApiError('');

    // Normalize values to exact backend schema expectations
    let backendGrade = 'grade1';
    if (formData.grade === 'grade2' || formData.grade.includes('ثاني') || formData.grade.includes('2')) {
      backendGrade = 'grade2';
    }

    let backendRelation = 'father';
    if (formData.guardianRelation === 'mother' || formData.guardianRelation === 'الأم' || formData.guardianRelation === 'ام') {
      backendRelation = 'mother';
    } else if (formData.guardianRelation === 'other' || formData.guardianRelation === 'أخرى' || formData.guardianRelation === 'ولي أمر آخر') {
      backendRelation = 'other';
    }

    const backendEducationType = (formData.educationType === 'languages' || formData.educationType === 'لغات') ? 'languages' : 'arabic';
    const backendGender = (formData.gender === 'female' || formData.gender === 'أنثى') ? 'female' : 'male';

    const payload = {
      firstName: formData.firstName.trim(),
      fatherName: formData.fatherName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      grade: backendGrade,
      governorate: formData.governorate,
      city: formData.city || formData.governorate,
      educationType: backendEducationType,
      gender: backendGender,
      acceptTerms: true,
      acceptPrivacy: true,
      guardian: {
        fullName: formData.guardianName.trim(),
        relation: backendRelation,
        phone: formData.guardianPhone.trim(),
      },
    };

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.data?.accessToken) {
          localStorage.setItem('accessToken', data.data.accessToken);
        }
        document.cookie = 'student_token=active; path=/; max-age=2592000; SameSite=Strict;';

        const studentProfile = {
          name: `${formData.firstName} ${formData.fatherName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phone,
          grade: backendGrade,
          city: formData.city || formData.governorate,
          governorate: formData.governorate,
        };
        try {
          localStorage.setItem('student_profile_info', JSON.stringify(studentProfile));
        } catch {}

        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('student_profile_updated'));
        }
        router.push('/dashboard');
      } else {
        let msg = data.message || 'فشل إنشاء الحساب، يرجى التحقق من صحة البيانات';
        if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
          msg = data.errors.map((item: any) => item.msg || item.message).join(' | ');
        }
        setApiError(msg);
      }
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : 'تعذر الاتصال بالخادم، يرجى التحقق من اتصالك بالإنترنت');
    } finally {
      setLoading(false);
    }
  };

  const stepInfo = [
    { label: 'الخطوة الأولى', percent: 30, title: 'أنشئ حسابك الآن :', subtitle: 'ادخل بياناتك بشكل صحيح للحصول علي افضل تجربة داخل الموقع' },
    { label: 'الخطوة الثانية', percent: 65, title: 'المرحلة الدراسية والأمان :', subtitle: 'حدد صفك الدراسي وكلمة المرور لتأمين حسابك والوصول لمحتواك' },
    { label: 'الخطوة الثالثة', percent: 100, title: 'بيانات ولي الأمر والموافقة :', subtitle: 'بيانات التواصل مع ولي الأمر لمتابعة التقارير ومستوى التقدم' }
  ];

  const currentInfo = stepInfo[step];

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
          .register-split-wrapper {
            grid-template-columns: 1fr !important;
          }
          .register-visual-side {
            display: none !important;
          }
        }
      `}</style>

      {/* Main Container - Full Width & Height Split without empty side gutters */}
      <div 
        className="register-split-wrapper"
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
        {/* RIGHT SIDE (in RTL): Registration Form Card */}
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
          {/* Inner Content - Spacious and filling available width */}
          <div style={{ width: '100%', maxWidth: 760 }}>
          {/* Top Progress Bar */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ color: BRAND_BLUE, fontWeight: 800, fontSize: 14.5 }}>
                {currentInfo.label}
              </span>
              <span style={{ color: '#6b7280', fontWeight: 700, fontSize: 13.5 }}>
                {currentInfo.percent}%
              </span>
            </div>
            <div style={{ width: '100%', height: 3.5, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                width: `${currentInfo.percent}%`,
                height: '100%',
                background: BRAND_BLUE,
                borderRadius: 4,
                transition: 'width 0.4s ease'
              }} />
            </div>
          </div>

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
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontSize: 'clamp(24px, 2.5vw, 30px)', fontWeight: 900, color: '#111827', margin: '0 0 8px' }}>
              {currentInfo.title}
            </h1>
            <p style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>
              {currentInfo.subtitle}
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

          {/* Form Body */}
          <form onSubmit={step === 2 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            <AnimatePresence mode="wait">
              
              {/* STEP 1: Personal Names & Phone */}
              {step === 0 && (
                <motion.div
                  key="step-0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 26 }}
                >
                  {/* Row 1: First Name & Father Name */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="الاسم الأول"
                          value={formData.firstName}
                          onChange={(e) => updateField('firstName', e.target.value)}
                          style={underlinedInputStyle(!!errors.firstName)}
                        />
                        <User size={19} color={BRAND_BLUE} style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
                      </div>
                      {errors.firstName && <span style={errorTextStyle}>⚠ {errors.firstName}</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="الاسم الثاني (اسم الأب)"
                          value={formData.fatherName}
                          onChange={(e) => updateField('fatherName', e.target.value)}
                          style={underlinedInputStyle(!!errors.fatherName)}
                        />
                        <User size={19} color={BRAND_BLUE} style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
                      </div>
                      {errors.fatherName && <span style={errorTextStyle}>⚠ {errors.fatherName}</span>}
                    </div>
                  </div>

                  {/* Row 2: Grandfather Name & Last Name */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="الاسم الثالث (اسم الجد)"
                          value={formData.grandfatherName}
                          onChange={(e) => updateField('grandfatherName', e.target.value)}
                          style={underlinedInputStyle(!!errors.grandfatherName)}
                        />
                        <User size={19} color={BRAND_BLUE} style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
                      </div>
                      {errors.grandfatherName && <span style={errorTextStyle}>⚠ {errors.grandfatherName}</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="الاسم الأخير (العائلة)"
                          value={formData.lastName}
                          onChange={(e) => updateField('lastName', e.target.value)}
                          style={underlinedInputStyle(!!errors.lastName)}
                        />
                        <User size={19} color={BRAND_BLUE} style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
                      </div>
                      {errors.lastName && <span style={errorTextStyle}>⚠ {errors.lastName}</span>}
                    </div>
                  </div>

                  {/* Row 3: Student Phone */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="tel"
                        placeholder="رقم الهاتف (الواتساب)"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        style={underlinedInputStyle(!!errors.phone)}
                      />
                      <Phone size={19} color={BRAND_BLUE} style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
                    </div>
                    {errors.phone && <span style={errorTextStyle}>⚠ {errors.phone}</span>}
                  </div>

                  {/* Next Button */}
                  <button
                    type="button"
                    onClick={handleNext}
                    style={mainPurpleBtnStyle}
                  >
                    التالي
                  </button>
                </motion.div>
              )}

              {/* STEP 1: Academic Grade & Credentials */}
              {step === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 26 }}
                >
                  {/* Grade Selection */}
                  <div>
                    <label style={{ fontSize: 13, fontWeight: 800, color: '#374151', marginBottom: 10, display: 'block' }}>
                      اختر سنتك الدراسية الحالية:
                    </label>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: availableGrades.length <= 2 ? '1fr 1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: 16
                    }}>
                      {availableGrades.map(g => {
                        const isSelected = formData.grade === g.name;
                        return (
                          <div
                            key={g.id}
                            onClick={() => updateField('grade', g.name)}
                            style={{
                              padding: '16px 18px',
                              borderRadius: 14,
                              cursor: 'pointer',
                              border: isSelected ? `2px solid ${BRAND_BLUE}` : '1.5px solid #d1d5db',
                              background: isSelected ? 'rgba(0, 132, 255, 0.08)' : '#ffffff',
                              textAlign: 'center',
                              transition: 'all 0.2s',
                              boxShadow: isSelected ? '0 4px 14px rgba(0, 132, 255, 0.12)' : 'none'
                            }}
                          >
                            <div style={{ fontSize: 15.5, fontWeight: 900, color: isSelected ? BRAND_BLUE : '#111827' }}>
                              {g.name}
                            </div>
                            <div style={{ fontSize: 12.5, color: isSelected ? BRAND_BLUE : '#6b7280', marginTop: 3 }}>
                              {g.subtitle || 'مرحلة دراسية 🎓'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {errors.grade && <span style={errorTextStyle}>⚠ {errors.grade}</span>}
                  </div>

                  {/* Governorate & City */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <select
                          value={formData.governorate}
                          onChange={(e) => updateField('governorate', e.target.value)}
                          style={{ ...underlinedInputStyle(false), cursor: 'pointer' }}
                        >
                          {['القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'الشرقية', 'القليوبية', 'الغربية', 'المنوفية', 'البحيرة', 'كفر الشيخ', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'بورسعيد', 'الإسماعيلية', 'السويس', 'دمياط', 'شمال سيناء', 'جنوب سيناء', 'البحر الأحمر', 'الوادي الجديد', 'مطروح'].map(gov => (
                            <option key={gov} value={gov}>{gov}</option>
                          ))}
                        </select>
                        <MapPin size={19} color={BRAND_BLUE} style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          type="text"
                          placeholder="المدينة / المركز (اختياري)"
                          value={formData.city}
                          onChange={(e) => updateField('city', e.target.value)}
                          style={underlinedInputStyle(false)}
                        />
                        <MapPin size={19} color={BRAND_BLUE} style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="email"
                        placeholder="البريد الإلكتروني"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        style={underlinedInputStyle(!!errors.email)}
                      />
                      <Mail size={19} color={BRAND_BLUE} style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
                    </div>
                    {errors.email && <span style={errorTextStyle}>⚠ {errors.email}</span>}
                  </div>

                  {/* Password & Confirm */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="كلمة المرور"
                          value={formData.password}
                          onChange={(e) => updateField('password', e.target.value)}
                          style={underlinedInputStyle(!!errors.password)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ position: 'absolute', left: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}
                        >
                          {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                        </button>
                      </div>
                      {errors.password && <span style={errorTextStyle}>⚠ {errors.password}</span>}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="تأكيد كلمة المرور"
                          value={formData.confirmPassword}
                          onChange={(e) => updateField('confirmPassword', e.target.value)}
                          style={underlinedInputStyle(!!errors.confirmPassword)}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{ position: 'absolute', left: 12, background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center' }}
                        >
                          {showConfirmPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                        </button>
                      </div>
                      {errors.confirmPassword && <span style={errorTextStyle}>⚠ {errors.confirmPassword}</span>}
                    </div>
                  </div>

                  {/* Navigation Buttons */}
                  <div style={{ display: 'flex', gap: 14 }}>
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      style={secondaryBtnStyle}
                    >
                      السابق
                    </button>
                    <button
                      type="button"
                      onClick={handleNext}
                      style={{ ...mainPurpleBtnStyle, flex: 2 }}
                    >
                      التالي
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: Guardian Details & Consent */}
              {step === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 26 }}
                >
                    {/* Guardian Name */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="اسم ولي الأمر كاملاً"
                        value={formData.guardianName}
                        onChange={(e) => updateField('guardianName', e.target.value)}
                        style={underlinedInputStyle(!!errors.guardianName)}
                      />
                      <User size={19} color={BRAND_BLUE} style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
                    </div>
                    {errors.guardianName && <span style={errorTextStyle}>⚠ {errors.guardianName}</span>}
                  </div>

                  {/* Relation & Phone */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <select
                          value={formData.guardianRelation}
                          onChange={(e) => updateField('guardianRelation', e.target.value)}
                          style={{ ...underlinedInputStyle(false), cursor: 'pointer' }}
                        >
                          <option value="الأب">صلة القرابة: الأب</option>
                          <option value="الأم">صلة القرابة: الأم</option>
                          <option value="الأخ الأكبر">صلة القرابة: الأخ الأكبر</option>
                          <option value="ولي أمر آخر">صلة القرابة: ولي أمر آخر</option>
                        </select>
                        <User size={19} color={BRAND_BLUE} style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <input
                          type="tel"
                          placeholder="رقم هاتف ولي الأمر"
                          value={formData.guardianPhone}
                          onChange={(e) => updateField('guardianPhone', e.target.value)}
                          style={underlinedInputStyle(!!errors.guardianPhone)}
                        />
                        <Phone size={19} color={BRAND_BLUE} style={{ position: 'absolute', left: 12, pointerEvents: 'none' }} />
                      </div>
                      {errors.guardianPhone && <span style={errorTextStyle}>⚠ {errors.guardianPhone}</span>}
                    </div>
                  </div>

                  {/* Terms Agreement */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 13, color: '#374151', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={formData.acceptTerms}
                        onChange={(e) => updateField('acceptTerms', e.target.checked)}
                        style={{ accentColor: '#7c3aed', width: 18, height: 18, cursor: 'pointer' }}
                      />
                      أوافق على كافة الشروط وسياسة الخصوصية الخاصة بالمنصة
                    </label>
                    {errors.acceptTerms && <span style={errorTextStyle}>⚠ {errors.acceptTerms}</span>}
                  </div>

                  {/* Navigation & Submit Buttons */}
                  <div style={{ display: 'flex', gap: 14 }}>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      style={secondaryBtnStyle}
                    >
                      السابق
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{ ...mainPurpleBtnStyle, flex: 2 }}
                    >
                      {loading ? 'جاري إنشاء الحساب...' : 'إنشاء الحساب الآن 🚀'}
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </form>

          {/* Bottom Link to Login */}
          <p style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: '#4b5563', margin: '32px 0 0' }}>
            يوجد لديك حساب بالفعل؟{' '}
            <Link href="/login" style={{ color: BRAND_BLUE, fontWeight: 800, textDecoration: 'none' }}>
              ادخل إلى حسابك الآن !
            </Link>
          </p>

          </div>
        </motion.div>

        {/* LEFT SIDE (in RTL): Visual Image Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="register-visual-side rounded-xl lg:h-full"
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

// Consistent styles matching user request
const underlinedInputStyle = (hasError: boolean): React.CSSProperties => ({
  width: '100%',
  border: 'none',
  borderBottom: `1.5px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
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
});

const errorTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: '#ef4444',
  fontWeight: 700
};

const mainPurpleBtnStyle: React.CSSProperties = {
  width: '100%',
  background: '#7c3aed',
  color: '#ffffff',
  border: 'none',
  borderRadius: 12,
  padding: '15px 20px',
  fontSize: 16.5,
  fontWeight: 900,
  cursor: 'pointer',
  transition: 'all 0.2s',
  boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)',
  fontFamily: 'Tajawal, sans-serif'
};

const secondaryBtnStyle: React.CSSProperties = {
  flex: 1,
  background: '#f3f4f6',
  color: '#374151',
  border: '1px solid #e5e7eb',
  borderRadius: 12,
  padding: '15px 20px',
  fontSize: 15,
  fontWeight: 800,
  cursor: 'pointer',
  transition: 'all 0.2s',
  fontFamily: 'Tajawal, sans-serif'
};
