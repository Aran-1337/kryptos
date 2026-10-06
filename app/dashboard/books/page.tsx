'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  BookOpen,
  GraduationCap,
  Truck,
  Download,
  CheckCircle2,
  Star,
  MapPin,
  Phone,
  Wallet,
  CreditCard,
  Filter,
  ArrowLeft,
  X,
  FileText,
  Package,
  AlertCircle,
  Clock,
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface BookItem {
  id: number | string;
  title: string;
  desc: string;
  grade: string;
  type: 'printed' | 'digital';
  typeLabel: string;
  price: number;
  originalPrice: number;
  pages: number;
  paperType: string;
  image: string;
  discountBadge?: string;
  rating: number;
  ordersCount: number;
}

const defaultBooksList: BookItem[] = [
  // Grade 1 Books
  {
    id: 'b1-1',
    title: 'مذكرة الشرح الذهبية - البرمجة والذكاء الاصطناعي (أولى ثانوي)',
    desc: 'مذكرة الشرح الشاملة لمنهج أولى ثانوي، طباعة ملونة بأعلى جودة ورق كوشيه مع أسئلة وتمارين بعد كل درس وأكواد QR Code لشرح الحل بالفيديو.',
    grade: 'الصف الأول الثانوي',
    type: 'printed',
    typeLabel: '📚 نسخة مطبوعة ورَقياً (شحن لباب البيت)',
    price: 130,
    originalPrice: 180,
    pages: 180,
    paperType: 'طباعة كوشيه 90 جرام + غلاف مقوى سلك فاخر',
    image: '/th1.webp',
    discountBadge: 'خصم 28%',
    rating: 4.9,
    ordersCount: 1450
  },
  {
    id: 'b1-2',
    title: 'كتاب بنك الأسئلة والتدريبات العملية - أولى ثانوي',
    desc: 'أكثر من 600 سؤال وتطبيق برمجي على نظام التابلت الحديث، مع نماذج امتحانات الوزارة الرسمية مجابة بالكامل.',
    grade: 'الصف الأول الثانوي',
    type: 'printed',
    typeLabel: '📚 نسخة مطبوعة ورَقياً (شحن لباب البيت)',
    price: 140,
    originalPrice: 200,
    pages: 210,
    paperType: 'ورق أبيض فاخر 80 جرام + غلاف حراري سلفان',
    image: '/th2.webp',
    discountBadge: 'خصم 30%',
    rating: 4.8,
    ordersCount: 980
  },
  {
    id: 'b1-3',
    title: 'دليل أكواد بايثون والخرائط الذهنية - أولى ثانوي (PDF)',
    desc: 'ملف PDF ملون عالي الدقة يضم تلخيص كامل القوانين ودوال بايثون مع رسومات بيانية مساعدة لتثبيت الفهم.',
    grade: 'الصف الأول الثانوي',
    type: 'digital',
    typeLabel: '📄 نسخة رقمية (تحميل PDF مباشر)',
    price: 0,
    originalPrice: 80,
    pages: 95,
    paperType: 'ملف PDF إلكتروني عالي الدقة جاهز للطباعة',
    image: '/th1.webp',
    discountBadge: 'مجاناً 🎁',
    rating: 5.0,
    ordersCount: 3420
  },
  {
    id: 'b1-4',
    title: 'كبسولة المراجعة النهائية ونماذج الامتحانات (PDF)',
    desc: 'ملخص ليلة الامتحان المركز لطلاب الصف الأول الثانوي مع توقعات الأسئلة ونماذج إجابة معتمدة.',
    grade: 'الصف الأول الثانوي',
    type: 'digital',
    typeLabel: '📄 نسخة رقمية (تحميل PDF مباشر)',
    price: 0,
    originalPrice: 100,
    pages: 75,
    paperType: 'ملف PDF تفاعلي',
    image: '/hero1.webp',
    discountBadge: 'مجاناً 🎁',
    rating: 4.9,
    ordersCount: 2890
  },

  // Grade 2 Books
  {
    id: 'b2-1',
    title: 'مذكرة الشامل في الخوارزميات والذكاء الاصطناعي (ثانية ثانوي)',
    desc: 'الشرح الكامل لمنهج الصف الثاني الثانوي مع تعمق في خوارزميات البحث وتدريب النماذج ومشاريع عملية خطوة بخطوة.',
    grade: 'الصف الثاني الثانوي',
    type: 'printed',
    typeLabel: '📚 نسخة مطبوعة ورَقياً (شحن لباب البيت)',
    price: 150,
    originalPrice: 210,
    pages: 220,
    paperType: 'طباعة كوشيه ملونة 90 جرام + غلاف مقوى فاخر',
    image: '/th2.webp',
    discountBadge: 'خصم 29%',
    rating: 5.0,
    ordersCount: 1680
  },
  {
    id: 'b2-2',
    title: 'كتاب بنك الأسئلة والامتحانات الشاملة - ثانية ثانوي',
    desc: 'بنك أسئلة متكامل يغطي كافة أفكار الخوارزميات والشبكات العصبية مع تدريبات مكثفة للمتفوقين.',
    grade: 'الصف الثاني الثانوي',
    type: 'printed',
    typeLabel: '📚 نسخة مطبوعة ورَقياً (شحن لباب البيت)',
    price: 160,
    originalPrice: 220,
    pages: 240,
    paperType: 'ورق أبيض فاخر 80 جرام + غلاف حراري',
    image: '/th1.webp',
    discountBadge: 'خصم 27%',
    rating: 4.9,
    ordersCount: 1120
  },
  {
    id: 'b2-3',
    title: 'ملخص مشاريع بايثون والذكاء الاصطناعي - ثانية ثانوي (PDF)',
    desc: 'كتيب إلكتروني يحتوي على الأكواد الكاملة لكافة مشاريع المنهج مع شرح تعليمات كل سطر برمجي.',
    grade: 'الصف الثاني الثانوي',
    type: 'digital',
    typeLabel: '📄 نسخة رقمية (تحميل PDF مباشر)',
    price: 0,
    originalPrice: 90,
    pages: 110,
    paperType: 'ملف PDF ملون عالي الجودة',
    image: '/th2.webp',
    discountBadge: 'مجاناً 🎁',
    rating: 4.9,
    ordersCount: 2750
  },

  // Foundation & General Books
  {
    id: 'bf-1',
    title: 'كتاب التأسيس البرمجي والتفكير المنطقي - من الصفر',
    desc: 'مرجع تأسيسي رائع لأي طالب يرغب في فهم التفكير الحسابي والخوارزميات قبل بدء الدراسة المتخصصة.',
    grade: 'كورس تأسيسي',
    type: 'printed',
    typeLabel: '📚 نسخة مطبوعة ورَقياً (شحن لباب البيت)',
    price: 110,
    originalPrice: 160,
    pages: 140,
    paperType: 'طباعة ممتازة + تدريبات محلولة',
    image: '/hero1.webp',
    discountBadge: 'خصم 31%',
    rating: 4.8,
    ordersCount: 890
  }
];

export default function StudentBooksPage() {
  const [studentGrade, setStudentGrade] = useState('الصف الأول الثانوي');
  const [studentName, setStudentName] = useState('أحمد');
  const [studentPhone, setStudentPhone] = useState('');
  const [walletBalance, setWalletBalance] = useState(450);
  const [booksList, setBooksList] = useState<BookItem[]>(defaultBooksList);
  
  // Tabs & Filters
  const [activeTab, setActiveTab] = useState<'my_grade' | 'printed' | 'digital' | 'all'>('my_grade');
  
  // Order Modal State
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [governorate, setGovernorate] = useState('القاهرة والجيزة (شحن 30 ج.م)');
  const [address, setAddress] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [deliveryName, setDeliveryName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'cod'>('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // PDF Download Notification
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const loadStudentData = () => {
    try {
      const savedProfile = localStorage.getItem('student_profile_info');
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        if (parsed.grade) setStudentGrade(parsed.grade);
        if (parsed.name) {
          setStudentName(parsed.name);
          setDeliveryName(parsed.name);
        }
        if (parsed.phone) {
          setStudentPhone(parsed.phone);
          setDeliveryPhone(parsed.phone);
        }
      }

      const savedWallet = localStorage.getItem('student_wallet_balance');
      if (savedWallet) setWalletBalance(Number(savedWallet));

      // Admin created books sync
      const savedAdminBooks = localStorage.getItem('admin_created_books');
      if (savedAdminBooks) {
        const parsedAdmin = JSON.parse(savedAdminBooks);
        if (Array.isArray(parsedAdmin) && parsedAdmin.length > 0) {
          const formatted: BookItem[] = parsedAdmin.map((b: any) => ({
            id: b.id || `ab-${Date.now()}`,
            title: b.title,
            desc: b.desc || 'مذكرة دراسية معتمدة من المنصة.',
            grade: b.grade || 'الصف الأول الثانوي',
            type: b.type === 'digital' ? 'digital' : 'printed',
            typeLabel: b.type === 'digital' ? '📄 نسخة رقمية (تحميل PDF مباشر)' : '📚 نسخة مطبوعة ورَقياً (شحن للمنزل)',
            price: Number(b.price) || 120,
            originalPrice: Number(b.originalPrice) || 160,
            pages: Number(b.pages) || 150,
            paperType: b.paperType || 'طباعة ملونة فاخرة',
            image: b.image || '/th1.webp',
            discountBadge: b.discountBadge || '',
            rating: 5.0,
            ordersCount: 200
          }));

          const existingIds = new Set(defaultBooksList.map(b => b.id));
          const additions = formatted.filter(b => !existingIds.has(b.id));
          setBooksList([...defaultBooksList, ...additions]);
        }
      }
    } catch {}
  };

  useEffect(() => {
    loadStudentData();
    window.addEventListener('student_profile_updated', loadStudentData);
    window.addEventListener('wallet_updated', loadStudentData);
    return () => {
      window.removeEventListener('student_profile_updated', loadStudentData);
      window.removeEventListener('wallet_updated', loadStudentData);
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

  const isMatchMyGrade = (bookGrade: string) => {
    const sCat = getGradeCategory(studentGrade);
    const bCat = getGradeCategory(bookGrade);
    if (bCat === 'all' || bCat === 'foundation') return true;
    return sCat === bCat;
  };

  const filteredBooks = booksList.filter(book => {
    if (activeTab === 'my_grade') return isMatchMyGrade(book.grade);
    if (activeTab === 'printed') return book.type === 'printed';
    if (activeTab === 'digital') return book.type === 'digital';
    return true;
  });

  const getShippingCost = () => {
    return governorate.includes('30') ? 30 : 50;
  };

  // Submit Book Order
  const handleConfirmOrder = () => {
    if (!selectedBook) return;
    if (!deliveryName.trim() || !deliveryPhone.trim() || !address.trim()) {
      setErrorMsg('يرجى كتابة الاسم ورقم الهاتف والعنوان التفصيلي للاستلام.');
      return;
    }

    const shipping = getShippingCost();
    const totalCost = selectedBook.price + shipping;

    if (paymentMethod === 'wallet' && walletBalance < totalCost) {
      setErrorMsg(`رصيد محفظتك (${walletBalance} ج.م) غير كافٍ لدفع الإجمالي (${totalCost} ج.م). يمكنك اختيار الدفع عند الاستلام أو شحن المحفظة.`);
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      const orderId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;

      // Deduct wallet if selected
      if (paymentMethod === 'wallet') {
        const newBal = walletBalance - totalCost;
        setWalletBalance(newBal);
        localStorage.setItem('student_wallet_balance', String(newBal));
        window.dispatchEvent(new Event('wallet_updated'));
      }

      // Save order
      const newOrder = {
        id: orderId,
        studentName: deliveryName,
        phone: deliveryPhone,
        governorate,
        address,
        bookTitle: selectedBook.title,
        copyType: 'مطبوع (ورقي)',
        price: selectedBook.price,
        shippingFee: shipping,
        total: totalCost,
        paymentMethod: paymentMethod === 'wallet' ? 'تم الدفع بالمحفظة' : 'دفع عند الاستلام',
        trackingNumber: `TRK-${Math.floor(10000 + Math.random() * 90000)}`,
        status: 'pending',
        date: new Date().toLocaleDateString('ar-EG')
      };

      try {
        const savedOrders = localStorage.getItem('student_book_orders');
        const list = savedOrders ? JSON.parse(savedOrders) : [];
        list.unshift(newOrder);
        localStorage.setItem('student_book_orders', JSON.stringify(list));
      } catch {}

      setIsProcessing(false);
      setOrderSuccessData(newOrder);
      setSelectedBook(null);
    }, 700);
  };

  const handleDownloadPDF = (book: BookItem) => {
    setDownloadSuccess(book.title);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Toast Download Notification */}
      {downloadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
            background: '#10b981', color: '#fff', padding: '12px 24px', borderRadius: 14,
            fontWeight: 800, zIndex: 9999, boxShadow: '0 10px 30px rgba(16,185,129,0.3)',
            display: 'flex', alignItems: 'center', gap: 8
          }}
        >
          <CheckCircle2 size={20} /> جاري تحميل {downloadSuccess} بصيغة PDF...
        </motion.div>
      )}

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
              الكتب والمذكرات الدراسية 📦
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.7 }}>
              مرحباً {studentName.split(' ')[0]}! هذه المذكرات والكتب مخصصة لـ <strong style={{ color: '#fff', textDecoration: 'underline' }}>{studentGrade}</strong>. يمكنك طلب شحن النسخ الورقية المجلدة لباب بيتك، أو تحميل المذكرات الرقمية PDF مباشرة.
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

      {/* Filter Tabs */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
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
            <GraduationCap size={17} /> مذكرات صفي ({studentGrade})
          </button>

          <button
            onClick={() => setActiveTab('printed')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 14,
              fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s',
              background: activeTab === 'printed' ? '#6C22F9' : 'var(--surface)',
              color: activeTab === 'printed' ? '#fff' : 'var(--text-main)',
              border: activeTab === 'printed' ? '1px solid #6C22F9' : '1px solid var(--border)',
            }}
          >
            <Truck size={16} /> المطبوعة ورقياً (شحن للمنزل)
          </button>

          <button
            onClick={() => setActiveTab('digital')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 14,
              fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s',
              background: activeTab === 'digital' ? '#6C22F9' : 'var(--surface)',
              color: activeTab === 'digital' ? '#fff' : 'var(--text-main)',
              border: activeTab === 'digital' ? '1px solid #6C22F9' : '1px solid var(--border)',
            }}
          >
            <FileText size={16} /> ملفات PDF (تحميل مباشر)
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
            <BookOpen size={16} /> جميع المراحل
          </button>
        </div>

        {/* Shipping notice pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontSize: 13, fontWeight: 800, background: 'rgba(16, 185, 129, 0.1)', padding: '6px 14px', borderRadius: 20 }}>
          <Truck size={15} /> توصيل لجميع المحافظات خلال 48 ساعة
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div style={{ background: 'var(--surface)', borderRadius: 20, padding: '50px 20px', textAlign: 'center', border: '1px solid var(--border)' }}>
          <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>لا توجد مذكرات في هذا التصنيف حالياً</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>تصفح باقي التصنيفات من الأزرار بالأعلى.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {filteredBooks.map((book, idx) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              style={{
                background: 'var(--surface)',
                borderRadius: 22,
                border: '1px solid var(--border)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: 'var(--shadow-sm)',
                position: 'relative'
              }}
            >
              {/* Thumbnail Header */}
              <div style={{ position: 'relative', height: 200, width: '100%', background: '#120f2e' }}>
                <Image 
                  src={book.image} 
                  alt={book.title} 
                  fill 
                  style={{ objectFit: 'cover' }} 
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10, 8, 30, 0.85) 0%, transparent 60%)' }} />

                {/* Badges */}
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
                    {book.grade}
                  </span>
                  <span style={{
                    background: book.type === 'printed' ? 'rgba(16, 185, 129, 0.9)' : 'rgba(14, 165, 233, 0.9)',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: 16,
                    backdropFilter: 'blur(6px)'
                  }}>
                    {book.type === 'printed' ? 'مطبوع ورقي' : 'رقمي PDF'}
                  </span>
                </div>

                {book.discountBadge && (
                  <div style={{ position: 'absolute', top: 12, left: 12, background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 900, padding: '4px 10px', borderRadius: 20 }}>
                    {book.discountBadge}
                  </div>
                )}

                <div style={{ position: 'absolute', bottom: 12, right: 14, left: 14, display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FileText size={14} color="#38bdf8" /> {book.pages} صفحة
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={14} color="#fbbf24" fill="#fbbf24" /> {book.rating}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div style={{ padding: 22, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8, lineHeight: 1.4 }}>
                    {book.title}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, margin: '0 0 14px' }}>
                    {book.desc}
                  </p>
                  <div style={{ fontSize: 12, color: 'var(--text-main)', background: 'var(--bg)', padding: '8px 12px', borderRadius: 10, border: '1px solid var(--border)', fontWeight: 600 }}>
                    {book.paperType}
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    {book.price === 0 ? (
                      <span style={{ fontSize: 20, fontWeight: 900, color: '#10b981' }}>مجاني للطلاب 🎁</span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                        <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)' }}>
                          {book.price} <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>ج.م</span>
                        </span>
                        {book.originalPrice > book.price && (
                          <span style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                            {book.originalPrice} ج.م
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {book.type === 'digital' ? (
                    <button
                      onClick={() => handleDownloadPDF(book)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: '#10b981', color: '#fff',
                        padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 800,
                        border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
                    >
                      <Download size={15} /> تحميل PDF
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedBook(book);
                        setErrorMsg('');
                        setPaymentMethod('wallet');
                      }}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        background: '#6C22F9', color: '#fff',
                        padding: '10px 18px', borderRadius: 12, fontSize: 13, fontWeight: 800,
                        border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,34,249,0.3)',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'none'}
                    >
                      <Truck size={15} /> طلب شحن للمنزل
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Book Shipping Checkout Modal */}
      <AnimatePresence>
        {selectedBook && (
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
                maxWidth: 550,
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                border: '1px solid var(--border)',
                overflow: 'hidden',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Modal Header */}
              <div style={{
                background: 'linear-gradient(135deg, #16133a 0%, #6C22F9 100%)',
                color: '#fff', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 700 }}>طلب شحن مذكرة مطبوعة</span>
                  <h3 style={{ margin: '4px 0 0', fontSize: 17, fontWeight: 900 }}>{selectedBook.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedBook(null)}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', width: 34, height: 34, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
                
                {/* Book & Price Summary */}
                <div style={{ background: 'var(--bg)', borderRadius: 16, padding: '14px 18px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>سعر المذكرة:</span>
                    <strong style={{ fontSize: 15, color: 'var(--text-main)' }}>{selectedBook.price} ج.م</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>مصاريف الشحن:</span>
                    <strong style={{ fontSize: 15, color: '#38bdf8' }}>{getShippingCost()} ج.م</strong>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>الإجمالي المطلوب:</span>
                    <strong style={{ fontSize: 18, fontWeight: 900, color: '#6C22F9' }}>
                      {selectedBook.price + getShippingCost()} ج.م
                    </strong>
                  </div>
                </div>

                {/* Shipping Details Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <label style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)' }}>بيانات الشحن والتوصيل:</label>
                  
                  <input
                    type="text"
                    placeholder="اسم الطالب المستلم كاملاً"
                    value={deliveryName}
                    onChange={(e) => setDeliveryName(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontWeight: 700 }}
                  />

                  <input
                    type="tel"
                    placeholder="رقم هاتف المستلم (للتواصل مع المندوب)"
                    value={deliveryPhone}
                    onChange={(e) => setDeliveryPhone(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontWeight: 700 }}
                  />

                  <select
                    value={governorate}
                    onChange={(e) => setGovernorate(e.target.value)}
                    style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontWeight: 700 }}
                  >
                    <option value="القاهرة والجيزة (شحن 30 ج.م)">القاهرة والجيزة (شحن 30 ج.م)</option>
                    <option value="الإسكندرية والبحيرة (شحن 50 ج.م)">الإسكندرية والبحيرة (شحن 50 ج.م)</option>
                    <option value="الدلتا والقناة (شحن 50 ج.م)">الدلتا والقناة (شحن 50 ج.م)</option>
                    <option value="محافظات الصعيد (شحن 50 ج.م)">محافظات الصعيد (شحن 50 ج.م)</option>
                  </select>

                  <textarea
                    placeholder="العنوان بالتفصيل (اسم الشارع - رقم العمارة - الدور - الشقة - علامة مميزة)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontWeight: 700, resize: 'none' }}
                  />
                </div>

                {/* Payment Option */}
                <div>
                  <label style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 8, display: 'block' }}>طريقة دفع الشحنة:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      style={{
                        padding: '12px 10px', borderRadius: 12, cursor: 'pointer',
                        border: paymentMethod === 'wallet' ? '2px solid #6C22F9' : '1px solid var(--border)',
                        background: paymentMethod === 'wallet' ? 'rgba(108,34,249,0.08)' : 'var(--bg)',
                        color: paymentMethod === 'wallet' ? '#6C22F9' : 'var(--text-main)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 12
                      }}
                    >
                      <Wallet size={18} />
                      خصم من المحفظة ({walletBalance} ج.م)
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      style={{
                        padding: '12px 10px', borderRadius: 12, cursor: 'pointer',
                        border: paymentMethod === 'cod' ? '2px solid #6C22F9' : '1px solid var(--border)',
                        background: paymentMethod === 'cod' ? 'rgba(108,34,249,0.08)' : 'var(--bg)',
                        color: paymentMethod === 'cod' ? '#6C22F9' : 'var(--text-main)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 12
                      }}
                    >
                      <Truck size={18} />
                      الدفع عند الاستلام كاش
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div style={{ padding: '10px 14px', background: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: 10, fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <AlertCircle size={16} /> {errorMsg}
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                  <button
                    onClick={() => setSelectedBook(null)}
                    style={{ flex: 1, padding: 12, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', fontWeight: 800, cursor: 'pointer' }}
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleConfirmOrder}
                    disabled={isProcessing}
                    style={{
                      flex: 2, padding: 12, borderRadius: 12, border: 'none',
                      background: '#6C22F9', color: '#fff', fontWeight: 900, cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(108,34,249,0.35)'
                    }}
                  >
                    {isProcessing ? 'جاري تسجيل الطلب...' : 'تأكيد طلب الشحن 🚀'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Success Modal */}
      <AnimatePresence>
        {orderSuccessData && (
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
                maxWidth: 480,
                boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                border: '1px solid var(--border)',
                padding: 30,
                textAlign: 'center'
              }}
            >
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle2 size={36} />
              </div>
              
              <h2 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>
                تم استلام طلب الشحن بنجاح! 🚚
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
                سيتم تجهيز وشحن <strong>{orderSuccessData.bookTitle}</strong> إلى عنوانك خلال 48 ساعة.
              </p>

              <div style={{ background: 'var(--bg)', padding: '12px 16px', borderRadius: 14, border: '1px solid var(--border)', marginBottom: 22, textAlign: 'right', fontSize: 13 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>رقم الطلب:</span>
                  <strong>{orderSuccessData.id}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--text-muted)' }}>رقم التتبع:</span>
                  <strong style={{ color: '#6C22F9' }}>{orderSuccessData.trackingNumber}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>طريقة الدفع:</span>
                  <strong style={{ color: '#10b981' }}>{orderSuccessData.paymentMethod}</strong>
                </div>
              </div>

              <button
                onClick={() => setOrderSuccessData(null)}
                style={{
                  width: '100%', padding: 14, borderRadius: 12, border: 'none',
                  background: '#6C22F9', color: '#fff', fontWeight: 900, cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(108,34,249,0.3)'
                }}
              >
                حسناً، فهمت
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
