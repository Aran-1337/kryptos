'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingBag, 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Sparkles, 
  Wallet, 
  CreditCard, 
  Tag, 
  Filter, 
  ArrowLeft, 
  X, 
  Key, 
  Check, 
  AlertCircle,
  PlayCircle,
  HelpCircle,
  PhoneCall
} from 'lucide-react';

interface Course {
  id: number | string;
  title: string;
  desc: string;
  grade: string;
  type: string;
  price: number;
  originalPrice: number;
  lessonsCount: number;
  hoursCount: number;
  image: string;
  discountBadge?: string;
  features: string[];
}

const defaultCoursesList: Course[] = [
  // Grade 1 Courses
  {
    id: 1,
    title: 'كورس أولى ثانوي - الترم الأول',
    desc: 'تأسيس شامل ومبسط لمنهج البرمجة والذكاء الاصطناعي مع تدريبات برمجية عملية وأسئلة تفاعلية خطوة بخطوة.',
    grade: 'الصف الأول الثانوي',
    type: 'شرح المنهج',
    price: 350,
    originalPrice: 500,
    lessonsCount: 24,
    hoursCount: 36,
    image: '/hero1.webp',
    discountBadge: 'خصم 30%',
    features: ['24 حصة شرح وتطبيقات عملية', 'مذكرات الشرح والتمارين PDF', 'بنك أسئلة لكل حصة وامتحان شهري', 'دعم مباشر وأسئلة مع المدرس']
  },
  {
    id: 4,
    title: 'كورس أولى ثانوي - الترم الثاني',
    desc: 'استكمال تطبيقات البرمجة وخوارزميات الذكاء الاصطناعي وبناء مشاريع برمجية حقيقية بلغة بايثون.',
    grade: 'الصف الأول الثانوي',
    type: 'شرح المنهج',
    price: 350,
    originalPrice: 500,
    lessonsCount: 22,
    hoursCount: 32,
    image: '/th1.webp',
    discountBadge: 'خصم 30%',
    features: ['22 حصة شاملة المشاريع العملية', 'كود تدريبي متكامل لكل حصة', 'اختبارات تقييم دورية', 'شهادة إتمام معتمدة']
  },
  {
    id: 5,
    title: 'مراجعة ليلة الامتحان - أولى ثانوي',
    desc: 'مراجعة مكثفة وشاملة لكافة أفكار المنهج وحل امتحانات المحافظات السابقة مع بنك الأسئلة المتوقعة.',
    grade: 'الصف الأول الثانوي',
    type: 'المراجعة النهائية',
    price: 150,
    originalPrice: 250,
    lessonsCount: 8,
    hoursCount: 14,
    image: '/th2.webp',
    discountBadge: 'خصم 40%',
    features: ['خرائط ذهنية وتلخيص لكامل المنهج', 'حل أكثر من 300 سؤال متوقع', 'نماذج امتحانات الوزارة الرسمية']
  },
  {
    id: 6,
    title: 'بنك الأسئلة والتدريبات البرمجية - أولى ثانوي',
    desc: 'أكثر من 500 سؤال وتمرين برمجي عملي مع شروحات بالفيديو لجميع الإجابات النموذجية.',
    grade: 'الصف الأول الثانوي',
    type: 'بنك الأسئلة',
    price: 120,
    originalPrice: 180,
    lessonsCount: 12,
    hoursCount: 18,
    image: '/th1.webp',
    discountBadge: 'خصم 33%',
    features: ['500+ سؤال بنظام التابلت الحديث', 'فيديوهات حل لكل سؤال معقد', 'تقارير أداء فورية لتقييم مستواك']
  },

  // Grade 2 Courses
  {
    id: 2,
    title: 'كورس ثانية ثانوي - الترم الأول',
    desc: 'تعمق في الخوارزميات وهياكل البيانات وتطبيقات الذكاء الاصطناعي المتقدمة المصممة خصيصاً للثانوية العامة.',
    grade: 'الصف الثاني الثانوي',
    type: 'شرح المنهج',
    price: 350,
    originalPrice: 500,
    lessonsCount: 26,
    hoursCount: 40,
    image: '/th2.webp',
    discountBadge: 'خصم 30%',
    features: ['26 حصة متقدمة وتطبيقات خوارزمية', 'شرح مفصل لهياكل البيانات', 'مشاريع ذكاء اصطناعي تفاعلية', 'متابعة دورية مع المساعدين']
  },
  {
    id: 7,
    title: 'كورس ثانية ثانوي - الترم الثاني',
    desc: 'الجزء الثاني لمنهج ثانية ثانوي يركز على الشبكات العصبية وتدريب النماذج الذكية وحل المشكلات المعقدة.',
    grade: 'الصف الثاني الثانوي',
    type: 'شرح المنهج',
    price: 350,
    originalPrice: 500,
    lessonsCount: 24,
    hoursCount: 38,
    image: '/hero1.webp',
    discountBadge: 'خصم 30%',
    features: ['24 حصة في الشبكات العصبية', 'تطبيقات عملية على Machine Learning', 'مشاريع تخرج مصغرة', 'دعم فني وبرمجي متواصل']
  },
  {
    id: 8,
    title: 'مراجعة ليلة الامتحان - ثانية ثانوي',
    desc: 'كبسولة المراجعة النهائية لثانية ثانوي: ملخص شامل لكافة القوانين والأكواد وحل أحدث الاختبارات القياسية.',
    grade: 'الصف الثاني الثانوي',
    type: 'المراجعة النهائية',
    price: 150,
    originalPrice: 250,
    lessonsCount: 8,
    hoursCount: 16,
    image: '/th1.webp',
    discountBadge: 'خصم 40%',
    features: ['مراجعة شاملة لجميع الوحدات', 'حل امتحانات إلكترونية سابقة', 'توقعات ليلة الامتحان والأسئلة الحرجة']
  },

  // Foundation & General Courses
  {
    id: 3,
    title: 'الكورس التأسيسي في البرمجة والتفكير المنطقي',
    desc: 'كورس مصمم من الصفر لتبسيط مفاهيم البرمجة والـ Problem Solving لتكون مؤهلاً لأي مرحلة ومسار تعليمي.',
    grade: 'كورس تأسيسي',
    type: 'كورس تأسيسي',
    price: 0,
    originalPrice: 200,
    lessonsCount: 10,
    hoursCount: 12,
    image: '/th1.webp',
    discountBadge: 'مجاني 100%',
    features: ['10 حصص تمهيدية مبسطة', 'لا يشترط أي خبرة مسبقة', 'أساسيات البرمجة بلغة سهلة', 'متاح ومجاني لجميع الطلاب']
  }
];

export default function StudentCoursesStorePage() {
  const [studentGrade, setStudentGrade] = useState('الصف الأول الثانوي');
  const [studentName, setStudentName] = useState('أحمد');
  const [walletBalance, setWalletBalance] = useState(450);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<number[]>([1]); // default enrolled in course 1
  const [allCourses, setAllCourses] = useState<Course[]>(defaultCoursesList);
  const [activeTab, setActiveTab] = useState<'my_grade' | 'all' | 'foundation'>('my_grade');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('الكل');

  // Checkout Modal State
  const [checkoutCourse, setCheckoutCourse] = useState<Course | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'code' | 'vodafone'>('wallet');
  const [scratchCode, setScratchCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successCourse, setSuccessCourse] = useState<Course | null>(null);

  // Load student profile & enrolled courses & admin courses
  const loadData = () => {
    try {
      // 1. Student Profile
      const savedProfile = localStorage.getItem('student_profile_info');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.grade) setStudentGrade(parsed.grade);
        if (parsed.name) setStudentName(parsed.name.split(' ')[0] || 'طالبنا المتميز');
      }

      // 2. Wallet Balance
      const savedWallet = localStorage.getItem('student_wallet_balance');
      if (savedWallet) setWalletBalance(Number(savedWallet));

      // 3. Enrolled Courses
      const savedEnrolled = localStorage.getItem('student_enrolled_courses');
      if (savedEnrolled) {
        const parsed = JSON.parse(savedEnrolled);
        if (Array.isArray(parsed)) {
          setEnrolledCourseIds(parsed.map((c: any) => typeof c === 'object' ? c.id : c));
        }
      }

      // 4. Admin Created Courses
      const adminCoursesSaved = localStorage.getItem('admin_created_courses');
      if (adminCoursesSaved) {
        const parsedAdmin = JSON.parse(adminCoursesSaved);
        if (Array.isArray(parsedAdmin) && parsedAdmin.length > 0) {
          const formattedAdmin: Course[] = parsedAdmin.map((c: any) => ({
            id: c.id,
            title: c.title,
            desc: c.desc || 'كورس دراسي معتمد على المنصة مع شرح وتدريبات.',
            grade: c.grade || 'الصف الأول الثانوي',
            type: c.type || 'شرح المنهج',
            price: Number(String(c.price).replace(/[^0-9]/g, '')) || 350,
            originalPrice: Number(String(c.originalPrice).replace(/[^0-9]/g, '')) || 500,
            lessonsCount: c.lessonsCount || 20,
            hoursCount: c.hoursCount || 30,
            image: c.image || '/th1.webp',
            discountBadge: c.discountBadge || '',
            features: ['شرح وتطبيقات عملية', 'مذكرات واختبارات دورية']
          }));

          // Merge without duplicate IDs
          const existingIds = new Set(defaultCoursesList.map(c => c.id));
          const additions = formattedAdmin.filter(c => !existingIds.has(c.id));
          setAllCourses([...defaultCoursesList, ...additions]);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    loadData();
    window.addEventListener('student_profile_updated', loadData);
    window.addEventListener('student_enrolled_updated', loadData);
    window.addEventListener('wallet_updated', loadData);
    return () => {
      window.removeEventListener('student_profile_updated', loadData);
      window.removeEventListener('student_enrolled_updated', loadData);
      window.removeEventListener('wallet_updated', loadData);
    };
  }, []);

  // Grade category helper to strictly distinguish Grade 1 and Grade 2
  const getGradeCategory = (rawGrade: string): 'grade1' | 'grade2' | 'grade3' | 'foundation' | 'all' => {
    if (!rawGrade) return 'all';
    const g = rawGrade.trim().toLowerCase();
    if (g.includes('تأسيس') || g.includes('foundation')) return 'foundation';
    const is1 = g.includes('أول') || g.includes('اول') || g.includes('1') || g.includes('grade1');
    const is2 = g.includes('ثاني') || g.includes('ثانية') || g.includes('تاني') || g.includes('تانية') || g.includes('2') || g.includes('grade2');
    const is3 = g.includes('ثالث') || g.includes('3') || g.includes('grade3');
    if (is1 && !is2 && !is3) return 'grade1';
    if (is2 && !is1 && !is3) return 'grade2';
    if (is3) return 'grade3';
    return 'all';
  };

  const isMatchMyGrade = (courseGrade: string) => {
    const sCat = getGradeCategory(studentGrade);
    const cCat = getGradeCategory(courseGrade);
    if (cCat === 'all' || cCat === 'foundation') return true;
    return sCat === cCat;
  };

  const filteredCourses = allCourses.filter(course => {
    // Tab filter
    if (activeTab === 'my_grade') {
      if (!isMatchMyGrade(course.grade)) return false;
    } else if (activeTab === 'foundation') {
      if (!course.grade.includes('تأسيس') && course.type !== 'كورس تأسيسي') return false;
    }

    // Sub-type filter
    if (selectedTypeFilter !== 'الكل' && course.type !== selectedTypeFilter) {
      return false;
    }

    return true;
  });

  // Handle Enrollment
  const handleEnrollWithWallet = () => {
    if (!checkoutCourse) return;
    if (walletBalance < checkoutCourse.price) {
      setCodeError('رصيد المحفظة الحالي غير كافٍ. يرجى شحن المحفظة أولاً أو استخدام كود اشتراك.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      // 1. Deduct balance
      const newBal = walletBalance - checkoutCourse.price;
      setWalletBalance(newBal);
      localStorage.setItem('student_wallet_balance', String(newBal));

      // 2. Add to enrolled courses
      const newEnrolledIds = [...enrolledCourseIds, Number(checkoutCourse.id)];
      setEnrolledCourseIds(newEnrolledIds);
      
      // Update persistent list
      try {
        const currentSaved = localStorage.getItem('student_enrolled_courses');
        let arr = currentSaved ? JSON.parse(currentSaved) : [];
        if (!Array.isArray(arr)) arr = [];
        arr.push({
          id: checkoutCourse.id,
          title: checkoutCourse.title,
          progress: 0,
          totalLessons: checkoutCourse.lessonsCount,
          completedLessons: 0,
          lastWatched: 'مقدمة الكورس وطريقة المذاكرة',
          img: checkoutCourse.image,
          status: 'in-progress'
        });
        localStorage.setItem('student_enrolled_courses', JSON.stringify(arr));
      } catch {}

      window.dispatchEvent(new Event('student_enrolled_updated'));
      window.dispatchEvent(new Event('wallet_updated'));

      setIsProcessing(false);
      setSuccessCourse(checkoutCourse);
      setCheckoutCourse(null);
    }, 700);
  };

  const handleEnrollWithCode = () => {
    if (!checkoutCourse) return;
    if (!scratchCode.trim()) {
      setCodeError('يرجى إدخال كود الكورس أو كارت الشحن.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      // Add to enrolled courses
      const newEnrolledIds = [...enrolledCourseIds, Number(checkoutCourse.id)];
      setEnrolledCourseIds(newEnrolledIds);

      try {
        const currentSaved = localStorage.getItem('student_enrolled_courses');
        let arr = currentSaved ? JSON.parse(currentSaved) : [];
        if (!Array.isArray(arr)) arr = [];
        arr.push({
          id: checkoutCourse.id,
          title: checkoutCourse.title,
          progress: 0,
          totalLessons: checkoutCourse.lessonsCount,
          completedLessons: 0,
          lastWatched: 'مقدمة الكورس وطريقة المذاكرة',
          img: checkoutCourse.image,
          status: 'in-progress'
        });
        localStorage.setItem('student_enrolled_courses', JSON.stringify(arr));
      } catch {}

      window.dispatchEvent(new Event('student_enrolled_updated'));

      setIsProcessing(false);
      setSuccessCourse(checkoutCourse);
      setCheckoutCourse(null);
      setScratchCode('');
    }, 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Grade Custom Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(22, 19, 58, 0.96) 0%, rgba(108, 34, 249, 0.88) 100%)',
        borderRadius: 24,
        padding: '30px 32px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 35px rgba(108, 34, 249, 0.22)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        {/* Glow decoration */}
        <div style={{ position: 'absolute', top: -40, left: -40, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', filter: 'blur(40px)' }} />

        <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ maxWidth: 650 }}>
            {/* Student Grade Pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', padding: '6px 16px', borderRadius: 30, marginBottom: 14, border: '1px solid rgba(255,255,255,0.25)' }}>
              <GraduationCap size={18} color="#facc15" />
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fef08a' }}>
                سنتك الدراسية: {studentGrade}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 900, marginBottom: 10, lineHeight: 1.3 }}>
              متجر الكورسات والمناهج الدراسية 🛒
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.7 }}>
              مرحباً {studentName}! تم فلترة الكورسات تلقائياً لعرض المناهج والمراجعات الخاصة بـ <strong style={{ color: '#fff', textDecoration: 'underline' }}>{studentGrade}</strong> لتشترك وتبدأ التعلم مباشرة.
            </p>
          </div>

          {/* Quick Wallet Info & Action */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(10px)',
            borderRadius: 20,
            padding: '18px 24px',
            border: '1px solid rgba(255,255,255,0.15)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            minWidth: 220,
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: 700 }}>
              <Wallet size={16} color="#38bdf8" /> رصيد محفظتك المتاح
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>
              {walletBalance} <span style={{ fontSize: 16, color: '#38bdf8', fontWeight: 700 }}>ج.م</span>
            </div>
            <Link 
              href="/dashboard/wallet"
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                background: '#fff', color: '#6C22F9', padding: '8px 16px', borderRadius: 12,
                fontSize: 13, fontWeight: 800, textDecoration: 'none', transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              + شحن المحفظة
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Categories */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
        
        {/* Main Grade Tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('my_grade')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 14,
              fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s',
              background: activeTab === 'my_grade' ? '#6C22F9' : 'var(--surface)',
              color: activeTab === 'my_grade' ? '#fff' : 'var(--text-main)',
              border: activeTab === 'my_grade' ? '1px solid #6C22F9' : '1px solid var(--border)',
              boxShadow: activeTab === 'my_grade' ? '0 4px 14px rgba(108,34,249,0.3)' : 'none'
            }}
          >
            <GraduationCap size={17} /> كورسات صفي ({studentGrade})
          </button>

          <button
            onClick={() => setActiveTab('foundation')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 14,
              fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s',
              background: activeTab === 'foundation' ? '#6C22F9' : 'var(--surface)',
              color: activeTab === 'foundation' ? '#fff' : 'var(--text-main)',
              border: activeTab === 'foundation' ? '1px solid #6C22F9' : '1px solid var(--border)',
            }}
          >
            <Sparkles size={16} /> الكورسات التأسيسية
          </button>

          <button
            onClick={() => setActiveTab('all')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 14,
              fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s',
              background: activeTab === 'all' ? '#6C22F9' : 'var(--surface)',
              color: activeTab === 'all' ? '#fff' : 'var(--text-main)',
              border: activeTab === 'all' ? '1px solid #6C22F9' : '1px solid var(--border)',
            }}
          >
            <BookOpen size={16} /> جميع الكورسات والمراحل
          </button>
        </div>

        {/* Content Type Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Filter size={14} /> النوع:
          </span>
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            style={{
              background: 'var(--surface)',
              color: 'var(--text-main)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '8px 14px',
              fontSize: 13,
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="الكل">كل الأنواع</option>
            <option value="شرح المنهج">شرح المنهج</option>
            <option value="المراجعة النهائية">المراجعة النهائية</option>
            <option value="بنك الأسئلة">بنك الأسئلة</option>
            <option value="كورس تأسيسي">كورس تأسيسي</option>
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length === 0 ? (
        <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '50px 20px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <ShoppingBag size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>لا توجد كورسات مطابقة حالياً</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>يمكنك تصفح باقي التصنيفات أو الكورسات التأسيسية عبر الأزرار بالأعلى.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {filteredCourses.map((course, idx) => {
            const isEnrolled = enrolledCourseIds.includes(Number(course.id));

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                style={{
                  background: 'var(--surface)',
                  borderRadius: 22,
                  border: isEnrolled ? '2px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative'
                }}
              >
                {/* Thumbnail Header */}
                <div style={{ position: 'relative', height: 180, width: '100%', background: '#120f2e' }}>
                  <Image 
                    src={course.image} 
                    alt={course.title} 
                    fill 
                    style={{ objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10, 8, 30, 0.85) 0%, transparent 60%)' }} />

                  {/* Top Badges */}
                  <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{
                      background: 'rgba(108, 34, 249, 0.9)',
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 800,
                      padding: '4px 10px',
                      borderRadius: 16,
                      backdropFilter: 'blur(6px)'
                    }}>
                      {course.grade}
                    </span>
                    <span style={{
                      background: 'rgba(0, 0, 0, 0.65)',
                      color: '#e2e8f0',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 16,
                      backdropFilter: 'blur(6px)'
                    }}>
                      {course.type}
                    </span>
                  </div>

                  {/* Discount / Enrolled badge */}
                  {isEnrolled ? (
                    <div style={{ position: 'absolute', top: 12, left: 12, background: '#10b981', color: '#fff', fontSize: 12, fontWeight: 800, padding: '4px 12px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)' }}>
                      <CheckCircle2 size={14} /> مشترك بالفعل
                    </div>
                  ) : course.discountBadge ? (
                    <div style={{ position: 'absolute', top: 12, left: 12, background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 900, padding: '4px 10px', borderRadius: 20 }}>
                      {course.discountBadge}
                    </div>
                  ) : null}

                  {/* Course stats overlay */}
                  <div style={{ position: 'absolute', bottom: 12, right: 14, left: 14, display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <PlayCircle size={14} color="#38bdf8" /> {course.lessonsCount} حصة
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={14} color="#fbbf24" /> {course.hoursCount} ساعة تدريب
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8, lineHeight: 1.4 }}>
                      {course.title}
                    </h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 16px' }}>
                      {course.desc}
                    </p>

                    {/* Features list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 8 }}>
                      {course.features.map((feat, fIdx) => (
                        <div key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--text-main)', fontWeight: 600 }}>
                          <Check size={14} color="#10b981" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing & Action */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      {course.price === 0 ? (
                        <span style={{ fontSize: 20, fontWeight: 900, color: '#10b981' }}>مجاني بالكامل</span>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                          <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)' }}>
                            {course.price} <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>ج.م</span>
                          </span>
                          {course.originalPrice > course.price && (
                            <span style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                              {course.originalPrice} ج.م
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {isEnrolled ? (
                      <Link
                        href="/dashboard/courses"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          background: 'rgba(16, 185, 129, 0.12)', color: '#10b981',
                          padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 800,
                          textDecoration: 'none', border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        دخول الكورس <ArrowLeft size={15} />
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          setCheckoutCourse(course);
                          setPaymentMethod('wallet');
                          setCodeError('');
                        }}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          background: '#6C22F9', color: '#fff',
                          padding: '10px 20px', borderRadius: 12, fontSize: 13, fontWeight: 800,
                          border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,34,249,0.3)',
                          transition: 'all 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
                      >
                        اشترك الآن ⚡
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Checkout / Subscription Modal */}
      <AnimatePresence>
        {checkoutCourse && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
          }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                background: 'var(--surface)',
                borderRadius: 24,
                width: '100%',
                maxWidth: 520,
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                border: '1px solid var(--border)',
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{
                background: 'linear-gradient(135deg, #16133a 0%, #6C22F9 100%)',
                color: '#fff', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 700 }}>تأكيد الاشتراك في الكورس</span>
                  <h3 style={{ margin: '4px 0 0', fontSize: 18, fontWeight: 900 }}>{checkoutCourse.title}</h3>
                </div>
                <button
                  onClick={() => setCheckoutCourse(null)}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
                
                {/* Course Summary Box */}
                <div style={{ background: 'var(--bg)', borderRadius: 16, padding: '14px 18px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>المرحلة: {checkoutCourse.grade}</span>
                    <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>{checkoutCourse.lessonsCount} حصة + بنك الأسئلة والامتحانات</p>
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: '#6C22F9' }}>{checkoutCourse.price} ج.م</span>
                  </div>
                </div>

                {/* Payment Methods Tabs */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 10, display: 'block' }}>اختر طريقة الدفع المفضلة:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => { setPaymentMethod('wallet'); setCodeError(''); }}
                      style={{
                        padding: '12px 8px', borderRadius: 14, cursor: 'pointer',
                        border: paymentMethod === 'wallet' ? '2px solid #6C22F9' : '1px solid var(--border)',
                        background: paymentMethod === 'wallet' ? 'rgba(108,34,249,0.08)' : 'var(--surface)',
                        color: paymentMethod === 'wallet' ? '#6C22F9' : 'var(--text-main)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 12
                      }}
                    >
                      <Wallet size={20} />
                      رصيد المحفظة
                    </button>

                    <button
                      type="button"
                      onClick={() => { setPaymentMethod('code'); setCodeError(''); }}
                      style={{
                        padding: '12px 8px', borderRadius: 14, cursor: 'pointer',
                        border: paymentMethod === 'code' ? '2px solid #6C22F9' : '1px solid var(--border)',
                        background: paymentMethod === 'code' ? 'rgba(108,34,249,0.08)' : 'var(--surface)',
                        color: paymentMethod === 'code' ? '#6C22F9' : 'var(--text-main)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 12
                      }}
                    >
                      <Key size={20} />
                      كود سنتر / كارت
                    </button>

                    <button
                      type="button"
                      onClick={() => { setPaymentMethod('vodafone'); setCodeError(''); }}
                      style={{
                        padding: '12px 8px', borderRadius: 14, cursor: 'pointer',
                        border: paymentMethod === 'vodafone' ? '2px solid #6C22F9' : '1px solid var(--border)',
                        background: paymentMethod === 'vodafone' ? 'rgba(108,34,249,0.08)' : 'var(--surface)',
                        color: paymentMethod === 'vodafone' ? '#6C22F9' : 'var(--text-main)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 12
                      }}
                    >
                      <CreditCard size={20} />
                      فودافون كاش
                    </button>
                  </div>
                </div>

                {/* Method 1: Wallet */}
                {paymentMethod === 'wallet' && (
                  <div style={{ background: 'var(--bg)', borderRadius: 16, padding: 18, border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>رصيدك المتاح حالياً:</span>
                      <strong style={{ fontSize: 16, color: 'var(--text-main)' }}>{walletBalance} ج.م</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>قيمة الكورس:</span>
                      <strong style={{ fontSize: 16, color: '#6C22F9' }}>{checkoutCourse.price} ج.م</strong>
                    </div>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0 12px' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>الرصيد المتبقي بعد الاشتراك:</span>
                      <strong style={{ fontSize: 16, color: walletBalance >= checkoutCourse.price ? '#10b981' : '#ef4444' }}>
                        {walletBalance - checkoutCourse.price} ج.م
                      </strong>
                    </div>

                    {walletBalance < checkoutCourse.price && (
                      <div style={{ marginTop: 14, padding: '10px 12px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: 10, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <AlertCircle size={16} /> رصيدك غير كافٍ للاشتراك. يمكنك شحن المحفظة أولاً أو الدفع بكود.
                      </div>
                    )}
                  </div>
                )}

                {/* Method 2: Scratch Code */}
                {paymentMethod === 'code' && (
                  <div style={{ background: 'var(--bg)', borderRadius: 16, padding: 18, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <label style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)' }}>ادخل كود الاشتراك (السنتر أو كارت الشحن):</label>
                    <input
                      type="text"
                      placeholder="مثال: SEC1-9842-8812"
                      value={scratchCode}
                      onChange={(e) => { setScratchCode(e.target.value); setCodeError(''); }}
                      style={{
                        padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)',
                        background: 'var(--surface)', color: 'var(--text-main)', fontSize: 15, fontWeight: 800,
                        textAlign: 'center', letterSpacing: '1px'
                      }}
                    />
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>يمكنك شراء كروت الاشتراك من خلال السناتر المعتمدة أو مكتبات الدعم.</span>
                  </div>
                )}

                {/* Method 3: Vodafone Cash */}
                {paymentMethod === 'vodafone' && (
                  <div style={{ background: 'var(--bg)', borderRadius: 16, padding: 18, border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{ margin: 0, fontSize: 13, color: 'var(--text-main)', lineHeight: 1.6 }}>
                      حول مبلغ <strong>{checkoutCourse.price} ج.م</strong> إلى رقم فودافون كاش الخاص بالمنصة:
                    </p>
                    <div style={{ background: 'rgba(108,34,249,0.1)', color: '#6C22F9', padding: '10px 16px', borderRadius: 12, textAlign: 'center', fontSize: 18, fontWeight: 900, letterSpacing: '1px' }}>
                      01012345678
                    </div>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>ثم تواصل مع الدعم الفني عبر واتساب لإرسال صورة التحويل وتفعيل الكورس فوراً.</span>
                  </div>
                )}

                {codeError && (
                  <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: 10, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={16} /> {codeError}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                  <button
                    onClick={() => setCheckoutCourse(null)}
                    style={{ flex: 1, padding: 14, borderRadius: 14, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontWeight: 800, cursor: 'pointer' }}
                  >
                    إلغاء
                  </button>

                  {paymentMethod === 'wallet' && (
                    <button
                      onClick={handleEnrollWithWallet}
                      disabled={isProcessing || walletBalance < checkoutCourse.price}
                      style={{
                        flex: 2, padding: 14, borderRadius: 14, border: 'none',
                        background: walletBalance >= checkoutCourse.price ? '#6C22F9' : '#9ca3af',
                        color: '#fff', fontWeight: 900, cursor: walletBalance >= checkoutCourse.price ? 'pointer' : 'not-allowed',
                        boxShadow: walletBalance >= checkoutCourse.price ? '0 4px 14px rgba(108,34,249,0.35)' : 'none'
                      }}
                    >
                      {isProcessing ? 'جاري التفعيل...' : 'تأكيد ودفع من المحفظة ⚡'}
                    </button>
                  )}

                  {paymentMethod === 'code' && (
                    <button
                      onClick={handleEnrollWithCode}
                      disabled={isProcessing}
                      style={{
                        flex: 2, padding: 14, borderRadius: 14, border: 'none',
                        background: '#6C22F9', color: '#fff', fontWeight: 900, cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(108,34,249,0.35)'
                      }}
                    >
                      {isProcessing ? 'جاري التحقق...' : 'تفعيل الكود الآن 🔑'}
                    </button>
                  )}

                  {paymentMethod === 'vodafone' && (
                    <Link
                      href="https://wa.me/201012345678"
                      target="_blank"
                      style={{
                        flex: 2, padding: 14, borderRadius: 14, border: 'none',
                        background: '#10b981', color: '#fff', fontWeight: 900, cursor: 'pointer',
                        textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        boxShadow: '0 4px 14px rgba(16,185,129,0.35)'
                      }}
                    >
                      <PhoneCall size={18} /> تواصل واتساب للتفعيل
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {successCourse && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(5px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
          }}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{
                background: 'var(--surface)',
                borderRadius: 24,
                width: '100%',
                maxWidth: 460,
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                border: '1px solid var(--border)',
                padding: 32,
                textAlign: 'center'
              }}
            >
              <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                <CheckCircle2 size={38} />
              </div>
              
              <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>
                مبروك! تم تفعيل الاشتراك بنجاح 🎉
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
                تم إضافة <strong>{successCourse.title}</strong> إلى قائمة كورساتك. يمكنك الآن البدء في مشاهدة الحصص وحل الواجبات.
              </p>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setSuccessCourse(null)}
                  style={{ flex: 1, padding: 12, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontWeight: 800, cursor: 'pointer' }}
                >
                  استكمال التسوق
                </button>
                <Link
                  href="/dashboard/courses"
                  style={{
                    flex: 1.5, padding: 12, borderRadius: 12, border: 'none',
                    background: '#6C22F9', color: '#fff', fontWeight: 900, textDecoration: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    boxShadow: '0 4px 14px rgba(108,34,249,0.3)'
                  }}
                >
                  الذهاب لكورساتي <ArrowLeft size={16} />
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
