'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { BookOpen, Download, Truck, CheckCircle2, Star, ShieldCheck, MapPin, Phone, Mail, X, Lock, LogIn, UserPlus } from 'lucide-react';

export default function BooksPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'printed' | 'digital'>('all');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // Check if user or admin/assistant is logged in
    const token = localStorage.getItem('accessToken') || localStorage.getItem('admin_user');
    const hasCookie = document.cookie.includes('admin_token=') || document.cookie.includes('refreshToken=');
    setIsLoggedIn(!!token || hasCookie);
  }, []);

  const books = [
    {
      id: 1,
      title: 'مذكرة الشرح الذهبية - البرمجة أولى ثانوي (الترم الأول)',
      type: 'printed',
      typeLabel: '📚 نسخة مطبوعة ورَقياً (شحن للمنزل)',
      grade: 'أولى ثانوي',
      pages: 180,
      paperType: 'طباعة كوشيه 90 جرام + غلاف مقوى فاخر',
      originalPrice: '180 ج.م',
      price: '130 ج.م',
      discountBadge: 'خصم 28%',
      image: '/th1.webp',
      rating: 4.9,
      downloadsOrOrders: '1,450 طالب طلبها'
    },
    {
      id: 2,
      title: 'كتاب بنك الأسئلة والامتحانات الشاملة - ثانية ثانوي (PDF)',
      type: 'digital',
      typeLabel: '📄 نسخة رقمية (تحميل PDF مباشر)',
      grade: 'ثانية ثانوي',
      pages: 240,
      paperType: 'ملف PDF ملون عالي الدقة (35 MB)',
      originalPrice: '120 ج.م',
      price: 'مجاني للطلاب',
      discountBadge: 'مجاناً 🎁',
      image: '/th2.webp',
      rating: 5.0,
      downloadsOrOrders: '3,890 تحميل'
    },
    {
      id: 3,
      title: 'ملخص الخوارزميات وتراكيب البيانات التأسيسي',
      type: 'printed',
      typeLabel: '📚 نسخة مطبوعة ورَقياً (شحن للمنزل)',
      grade: 'كورس تأسيسي',
      pages: 120,
      paperType: 'غلاف حراري + أسئلة مجابة بالـ QR Code',
      originalPrice: '150 ج.م',
      price: '100 ج.م',
      discountBadge: 'خصم 33%',
      image: '/hero1.webp',
      rating: 4.8,
      downloadsOrOrders: '890 طالب طلبها'
    },
    {
      id: 4,
      title: 'دليل أكواد بايثون والحلول النموذجية (PDF)',
      type: 'digital',
      typeLabel: '📄 نسخة رقمية (تحميل PDF مباشر)',
      grade: 'أولى ثانوي',
      pages: 95,
      paperType: 'ملف PDF التفاعلي (18 MB)',
      originalPrice: '80 ج.م',
      price: 'مجاني للطلاب',
      discountBadge: 'مجاناً 🎁',
      image: '/th1.webp',
      rating: 4.9,
      downloadsOrOrders: '2,410 تحميل'
    }
  ];

  const filteredBooks = books.filter(b => {
    if (activeCategory === 'printed') return b.type === 'printed';
    if (activeCategory === 'digital') return b.type === 'digital';
    return true;
  });

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [governorate, setGovernorate] = useState('القاهرة والجيزة (شحن 30 ج.م)');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleBookAction = (book: any) => {
    if (!isLoggedIn) {
      setShowAuthModal(true);
    } else {
      setSelectedBook(book);
    }
  };

  const handleOrderSubmit = () => {
    if (selectedBook.type === 'printed' && (!address.trim() || !phone.trim())) {
      alert('يرجى كتابة العنوان التفصيلي ورقم الموبايل للشحن.');
      return;
    }
    if (selectedBook.type === 'digital' && (!phone.trim() && !email.trim())) {
      alert('يرجى كتابة رقم الموبايل أو الإيميل لإرسال رابط الـ PDF.');
      return;
    }
    setOrderSuccess(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Tajawal, sans-serif', direction: 'rtl', position: 'relative' }}>
      
      {/* ─── Auth Protection Modal ────────────────────────────────────────── */}
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
                لطلب النسخ المطبوعة أو تحميل المذكرات الرقمية الـ PDF، يرجى تسجيل الدخول أو إنشاء حساب جديد.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Link
                  href="/login?redirect=/books"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                    background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff',
                    padding: '14px', borderRadius: 14, fontSize: 16, fontWeight: 900,
                    textDecoration: 'none', boxShadow: '0 8px 24px rgba(108,34,249,0.35)',
                    transition: 'all 0.2s',
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
                    textDecoration: 'none', transition: 'all 0.2s',
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

      {/* Top Shipping Notice */}
      <div style={{ background: '#16133a', color: '#fff', padding: '12px 24px', textAlign: 'center', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Truck size={16} color="#38bdf8" /> متوفر التوصيل الورقي لجميع محافظات مصر + التحميل الرقمي الـ PDF المباشر 📚
      </div>

      <main style={{ maxWidth: 1150, margin: '40px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ background: '#f5f3ff', color: '#6C22F9', border: '1px solid #ddd6fe', padding: '6px 18px', borderRadius: 50, fontSize: 13, fontWeight: 800, display: 'inline-block', marginBottom: 12 }}>
            مكتبة الكتب والمذكرات الشاملة 📚
          </span>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 900, color: '#16133a', margin: '0 0 12px' }}>
            اختر نسختك المطبوعة أو حمل المذكرة الرقمية PDF
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', maxWidth: 650, margin: '0 auto', lineHeight: 1.7 }}>
            يمكنك طلب المذكرات الورقية المطبوعة لتصلك حتى باب المنزل في أي محافظة، أو الحصول على النسخة الرقمية PDF فوراً.
          </p>
        </div>

        {/* Guest Lock Notification Banner (If not logged in) */}
        {isLoggedIn === false && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              maxWidth: 900, margin: '0 auto',
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
                <p style={{ margin: 0, fontWeight: 800, fontSize: 15 }}>المكتبة والكتب متاحة للطلاب المسجلين فقط 🔒</p>
                <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>سجل دخولك الآن لطلب النسخ المطبوعة أو تحميل ملفات الـ PDF</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link
                href="/login?redirect=/books"
                style={{
                  background: '#6C22F9', color: '#fff', padding: '10px 20px', borderRadius: 12,
                  fontSize: 13.5, fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 14px rgba(108,34,249,0.4)',
                }}
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                style={{
                  background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '10px 20px', borderRadius: 12,
                  fontSize: 13.5, fontWeight: 800, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                إنشاء حساب
              </Link>
            </div>
          </motion.div>
        )}

        {/* Filter Category Tabs */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button 
            onClick={() => setActiveCategory('all')}
            style={{ padding: '10px 24px', borderRadius: 12, border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', background: activeCategory === 'all' ? '#6C22F9' : '#fff', color: activeCategory === 'all' ? '#fff' : '#475569', boxShadow: activeCategory === 'all' ? '0 4px 14px rgba(108,34,249,0.3)' : '0 1px 3px rgba(0,0,0,0.05)' }}
          >
            عرض الكل (4)
          </button>
          <button 
            onClick={() => setActiveCategory('printed')}
            style={{ padding: '10px 24px', borderRadius: 12, border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', background: activeCategory === 'printed' ? '#6C22F9' : '#fff', color: activeCategory === 'printed' ? '#fff' : '#475569', boxShadow: activeCategory === 'printed' ? '0 4px 14px rgba(108,34,249,0.3)' : '0 1px 3px rgba(0,0,0,0.05)' }}
          >
            📚 المذكرات المطبوعة (شحن للمنزل)
          </button>
          <button 
            onClick={() => setActiveCategory('digital')}
            style={{ padding: '10px 24px', borderRadius: 12, border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', background: activeCategory === 'digital' ? '#6C22F9' : '#fff', color: activeCategory === 'digital' ? '#fff' : '#475569', boxShadow: activeCategory === 'digital' ? '0 4px 14px rgba(108,34,249,0.3)' : '0 1px 3px rgba(0,0,0,0.05)' }}
          >
            📄 المكتبة الرقمية (تحميل PDF)
          </button>
        </div>

        {/* Books Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 24 }}>
          {filteredBooks.map(book => (
            <div key={book.id} style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
              
              {/* Cover Image & Type Badge */}
              <div style={{ position: 'relative', width: '100%', height: 220, background: '#16133a' }}>
                <Image src={book.image} alt={book.title} fill style={{ objectFit: 'cover' }} />
                
                <span style={{ position: 'absolute', top: 16, right: 16, background: book.type === 'printed' ? '#6C22F9' : '#10b981', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 900, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  {book.typeLabel}
                </span>

                {book.discountBadge && (
                  <span style={{ position: 'absolute', top: 16, left: 16, background: '#ef4444', color: '#fff', padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 900 }}>
                    {book.discountBadge}
                  </span>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#6C22F9', background: '#f5f3ff', padding: '2px 10px', borderRadius: 12 }}>{book.grade}</span>
                    <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={14} fill="#f59e0b" /> {book.rating}
                    </span>
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#16133a', margin: '0 0 10px', lineHeight: 1.5 }}>{book.title}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>📄 {book.pages} صفحة • {book.paperType}</p>
                </div>

                <div style={{ paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#16133a' }}>{book.price}</div>
                    {book.originalPrice && <div style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>{book.originalPrice}</div>}
                  </div>

                  <button 
                    onClick={() => handleBookAction(book)}
                    style={{ 
                      display: 'flex', alignItems: 'center', gap: 8, 
                      background: isLoggedIn ? (book.type === 'printed' ? '#6C22F9' : '#10b981') : 'linear-gradient(135deg, #4f46e5, #7c3aed)', 
                      color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12, 
                      fontWeight: 800, fontSize: 14, cursor: 'pointer', 
                      boxShadow: '0 4px 12px rgba(108,34,249,0.3)' 
                    }}
                  >
                    {isLoggedIn ? (book.type === 'printed' ? <Truck size={16} /> : <Download size={16} />) : <Lock size={15} />}
                    {isLoggedIn ? (book.type === 'printed' ? 'طلب النسخة المطبوعة' : 'تحميل الـ PDF') : 'سجل دخول للطلب 🔒'}
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </main>

      {/* Unified Book Order Modal (Printed or Digital) Perfectly Centered */}
      <AnimatePresence>
        {selectedBook && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(15,10,50,0.6)', backdropFilter: 'blur(4px)', zIndex: 1001 }} onClick={() => { setSelectedBook(null); setOrderSuccess(false); }} />
            
            {/* Modal Box */}
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} style={{ position: 'relative', zIndex: 1002, width: '100%', maxWidth: 580, background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 20px 50px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' }}>
              
              {orderSuccess ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: 68, height: 68, borderRadius: '50%', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#16133a', margin: '0 0 8px' }}>
                    {selectedBook.type === 'printed' ? 'تم استلام طلب الشحن بنجاح! 🚚' : 'جاهز للتحميل والإرسال! 🎉'}
                  </h3>
                  <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>
                    {selectedBook.type === 'printed' 
                      ? 'جاري تجهيز نسخة المذكرة المطبوعة وتوصيلها لعنوانك خلال 48 ساعة.' 
                      : 'تم إرسال رابط تحميل مذكرة الـ PDF ورابط الواتساب بنجاح.'}
                  </p>

                  {selectedBook.type === 'digital' && (
                    <a 
                      href="/memento1.pdf" 
                      download 
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#10b981', color: '#fff', padding: '12px 28px', borderRadius: 12, fontWeight: 800, textDecoration: 'none', marginBottom: 16 }}
                    >
                      <Download size={18} /> اضغط هنا لتحميل الـ PDF فوراً
                    </a>
                  )}

                  <div>
                    <button onClick={() => { setSelectedBook(null); setOrderSuccess(false); }} style={{ background: '#16133a', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>
                      إغلاق
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 900, color: '#16133a', margin: '0 0 4px' }}>
                        {selectedBook.type === 'printed' ? 'طلب شراء النسخة المطبوعة ورَقياً' : 'طلب النسخة الرقمية (PDF)'}
                      </h3>
                      <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{selectedBook.title}</p>
                    </div>
                    <button onClick={() => setSelectedBook(null)} style={{ background: '#f3f4f6', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    
                    {/* Printed Book Form Fields */}
                    {selectedBook.type === 'printed' ? (
                      <>
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>المحافظة (لتحديد الشحن)</label>
                          <select value={governorate} onChange={e => setGovernorate(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', background: '#fff' }}>
                            <option value="القاهرة والجيزة (شحن 30 ج.م)">القاهرة والجيزة (شحن 30 ج.م)</option>
                            <option value="الإسكندرية والوجه البحري (شحن 45 ج.م)">الإسكندرية والوجه البحري (شحن 45 ج.م)</option>
                            <option value="محافظات الصعيد (شحن 55 ج.م)">محافظات الصعيد (شحن 55 ج.م)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>العنوان التفصيلي للتوصيل</label>
                          <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="مثال: القاهرة - مدينة نصر - شارع عباس العقاد عمارة 15" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif' }} />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>رقم الموبايل لتواصل المندوب</label>
                          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="01012345678" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif' }} />
                        </div>

                        <div style={{ background: '#f8fafc', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 14, fontWeight: 800, color: '#16133a' }}>المبلغ النهائي عند الاستلام:</span>
                          <span style={{ fontSize: 18, fontWeight: 900, color: '#6C22F9' }}>{selectedBook.price} + الشحن</span>
                        </div>
                      </>
                    ) : (
                      /* Digital Book Form Fields */
                      <>
                        <div style={{ background: '#ecfdf5', color: '#065f46', padding: 16, borderRadius: 12, border: '1px solid #a7f3d0', fontSize: 13, fontWeight: 700, lineHeight: 1.6 }}>
                          🎁 هذه النسخة الرقمية متاحة مجاناً لجميع طلاب المنصة. أدخل رقمك أو إيميلك لاستلام رابط التحميل المباشر فوراً.
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>رقم الواتساب أو الموبايل</label>
                          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="01012345678" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif' }} />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>البريد الإلكتروني (الإيميل)</label>
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="student@example.com" style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif' }} />
                        </div>
                      </>
                    )}

                  </div>

                  <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <button onClick={() => setSelectedBook(null)} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>إلغاء</button>
                    <button onClick={handleOrderSubmit} style={{ display: 'flex', alignItems: 'center', gap: 6, background: selectedBook.type === 'printed' ? '#6C22F9' : '#10b981', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
                      {selectedBook.type === 'printed' ? <Truck size={16} /> : <Download size={16} />}
                      {selectedBook.type === 'printed' ? 'تأكيد طلب الشحن الورقي' : 'استلام وتحميل الـ PDF'}
                    </button>
                  </div>
                </>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
