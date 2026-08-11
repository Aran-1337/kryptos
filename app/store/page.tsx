'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Truck, CheckCircle2, Star, ShieldCheck, MapPin, Phone, ArrowLeft, X, Save } from 'lucide-react';

export default function PrintedBooksStorePage() {
  const [books] = useState([
    {
      id: 1,
      title: 'مذكرة الشرح الذهبية - البرمجة أولى ثانوي (الترم الأول)',
      grade: 'أولى ثانوي',
      pages: 180,
      paperType: 'ورق كوشيه 90 جرام فاخر + غلاف مقوى',
      originalPrice: '180 ج.م',
      price: '130 ج.م',
      discountBadge: 'خصم 28%',
      image: '/th1.webp',
      rating: 4.9,
      reviewsCount: 320
    },
    {
      id: 2,
      title: 'كتاب بنك الأسئلة والامتحانات الشاملة - ثانية ثانوي',
      grade: 'ثانية ثانوي',
      pages: 240,
      paperType: 'طباعة ملونة فاخرة + إجابات نموذجية بالـ QR Code',
      originalPrice: '220 ج.م',
      price: '160 ج.م',
      discountBadge: 'خصم 27%',
      image: '/th2.webp',
      rating: 5.0,
      reviewsCount: 450
    },
  ]);

  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [governorate, setGovernorate] = useState('القاهرة والجيزة (شحن 30 ج.م)');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleOrderSubmit = () => {
    if (!address.trim() || !phone.trim()) {
      alert('يرجى ملء كافة بيانات العنوان ورقم الموبايل للشحن.');
      return;
    }
    setOrderSuccess(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Top Banner */}
      <div style={{ background: '#16133a', color: '#fff', padding: '12px 24px', textAlign: 'center', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <Truck size={16} color="#38bdf8" /> خدمة توصيل المذكرات المطبوعة ورَقياً لجميع محافظات مصر خلال 48 ساعة 🚀
      </div>

      {/* Main Container */}
      <main style={{ maxWidth: 1100, margin: '40px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center' }}>
          <span style={{ background: '#f5f3ff', color: '#6C22F9', border: '1px solid #ddd6fe', padding: '6px 18px', borderRadius: 50, fontSize: 13, fontWeight: 800, display: 'inline-block', marginBottom: 12 }}>
            المذكرات المطبوعة الورقية 📚
          </span>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 900, color: '#16133a', margin: '0 0 12px' }}>
            احصل على كُتب ومذكرات الكورس مجلدة حتى باب بيتك
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', maxWidth: 600, margin: '0 auto' }}>
            طباعة ملونة فاخرة بجودة دور النشر مع تمارين محلولة وأكواد QR لمشاهدة فيديو حل كل سؤال ورَقياً!
          </p>
        </div>

        {/* Books Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: 24 }}>
          {books.map(book => (
            <div key={book.id} style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
              
              {/* Cover Image & Discount Badge */}
              <div style={{ position: 'relative', width: '100%', height: 220, background: '#16133a' }}>
                <Image src={book.image} alt={book.title} fill style={{ objectFit: 'cover' }} />
                <span style={{ position: 'absolute', top: 16, right: 16, background: '#ef4444', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 900, boxShadow: '0 4px 12px rgba(239,68,68,0.4)' }}>
                  {book.discountBadge}
                </span>
              </div>

              {/* Content */}
              <div style={{ padding: 24, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: 8, marginBottom: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: '#6C22F9', background: '#f5f3ff', padding: '2px 10px', borderRadius: 12 }}>{book.grade}</span>
                    <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={14} fill="#f59e0b" /> {book.rating} ({book.reviewsCount} تقييم)
                    </span>
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#16133a', margin: '0 0 10px', lineHeight: 1.5 }}>{book.title}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>📄 {book.pages} صفحة • {book.paperType}</p>
                </div>

                <div style={{ paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 900, color: '#16133a' }}>{book.price}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'line-through' }}>{book.originalPrice}</div>
                  </div>

                  <button 
                    onClick={() => setSelectedBook(book)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#6C22F9', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 12px rgba(108,34,249,0.3)' }}
                  >
                    <ShoppingBag size={16} /> اطلب النسخة المطبوعة
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </main>

      {/* Checkout Shipping Modal Perfectly Centered */}
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
                  <h3 style={{ fontSize: 22, fontWeight: 900, color: '#16133a', margin: '0 0 8px' }}>تم استلام طلب الشحن بنجاح! 🚚</h3>
                  <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24, lineHeight: 1.6 }}>
                    جاري تجهيز نسخة المذكرة المطبوعة وتوصيلها إلى عنوانك خلال 48 ساعة. سيصلك اتصال من المندوب فور الوصول.
                  </p>
                  <button onClick={() => { setSelectedBook(null); setOrderSuccess(false); }} style={{ background: '#16133a', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 12, fontWeight: 800, cursor: 'pointer' }}>
                    تم، عودة للمتجر
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <h3 style={{ fontSize: 18, fontWeight: 900, color: '#16133a', margin: '0 0 4px' }}>طلب شراء المذكرة المطبوعة ورَقياً</h3>
                      <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>{selectedBook.title}</p>
                    </div>
                    <button onClick={() => setSelectedBook(null)} style={{ background: '#f3f4f6', border: 'none', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>المحافظة (لتحديد مصاريف الشحن)</label>
                      <select value={governorate} onChange={e => setGovernorate(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #cbd5e1', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', background: '#fff' }}>
                        <option value="القاهرة والجيزة (شحن 30 ج.م)">القاهرة والجيزة (شحن 30 ج.م)</option>
                        <option value="الإسكندرية والوجه البحري (شحن 45 ج.م)">الإسكندرية والوجه البحري (شحن 45 ج.م)</option>
                        <option value="محافظات الصعيد والوجه القبلي (شحن 55 ج.م)">محافظات الصعيد والوجه القبلي (شحن 55 ج.م)</option>
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
                      <span style={{ fontSize: 14, fontWeight: 800, color: '#16133a' }}>إجمالي المبلغ المطلوب عند الاستلام:</span>
                      <span style={{ fontSize: 18, fontWeight: 900, color: '#6C22F9' }}>{selectedBook.price} + الشحن</span>
                    </div>
                  </div>

                  <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <button onClick={() => setSelectedBook(null)} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>إلغاء</button>
                    <button onClick={handleOrderSubmit} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 8, fontWeight: 800, fontSize: 14, cursor: 'pointer' }}><Truck size={16} /> تأكيد طلب الشحن</button>
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
