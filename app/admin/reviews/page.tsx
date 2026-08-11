'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, CheckCircle2, XCircle, Plus, Trash2, X, Save, Sparkles, User, Award } from 'lucide-react';

const initialReviews = [
  {
    id: 'rev-1',
    studentName: 'أحمد محمود العبد',
    grade: 'طالب أولى ثانوي - القاهرة',
    courseTitle: 'كورس أولى ثانوي - الترم الأول',
    rating: 5,
    comment: 'الشرح مع البشمهندس عبدالرحمن مختلف تماماً! طريقة تبسيط الخوارزميات والتطبيقات العملية خلّتني أحب البرمجة وأقفل امتحانات المدرسة بسهولة.',
    badge: '🥇 الأول على الدفعة',
    status: 'approved',
    date: '06 أغسطس 2026'
  },
  {
    id: 'rev-2',
    studentName: 'سارة خالد السيد',
    grade: 'طالبة ثانية ثانوي - الإسكندرية',
    courseTitle: 'الكورس التأسيسي في البرمجة',
    rating: 5,
    comment: 'نظام حماية الشاشة والامتحانات الذكية بيخليني ألتزم بالمذاكرة يوم بيوم. والمحفظة وتوصيل المذكرات للمنزل في سموحة وصلني في 24 ساعة بس!',
    badge: '🌟 متفوقة الأسبوع',
    status: 'approved',
    date: '06 أغسطس 2026'
  },
  {
    id: 'rev-3',
    studentName: 'عمر طارق إبراهيم',
    grade: 'طالب أولى ثانوي - الجيزة',
    courseTitle: 'كورس أولى ثانوي - الترم الأول',
    rating: 5,
    comment: 'المساعد الذكي والشات الفوري بيجاوب على أي كود مكنتش فاهمه في ثواني. أفضل منصة برمجة في مصر بلا منازع.',
    badge: '🏆 وسام التميز',
    status: 'approved',
    date: '05 أغسطس 2026'
  },
  {
    id: 'rev-4',
    studentName: 'مريم سعيد علي',
    grade: 'طالبة ثانية ثانوي - طنطا',
    courseTitle: 'كورس ثانية ثانوي - الترم الأول',
    rating: 5,
    comment: 'البث المباشر والمذكرات الورقية المطبوعة جودة ممتازة جداً. البشمهندس بيشرح كل كود بالتفصيل والنتيجة ممتازة.',
    badge: '🌟 نجمة الدفعة',
    status: 'pending',
    date: 'اليوم'
  }
];

export default function AdminReviewsModerationPage() {
  const [reviews, setReviews] = useState(initialReviews);
  const [filter, setFilter] = useState('all');

  // New Review Modal State
  const [showModal, setShowModal] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [grade, setGrade] = useState('طالب أولى ثانوي - القاهرة');
  const [courseTitle, setCourseTitle] = useState('كورس أولى ثانوي - الترم الأول');
  const [rating, setRating] = useState(5);
  const [badge, setBadge] = useState('🥇 الأول على الدفعة');
  const [comment, setComment] = useState('');
  const [publishStatus, setPublishStatus] = useState('approved');

  useEffect(() => {
    try {
      const storedAll = localStorage.getItem('all_admin_reviews');
      if (storedAll) {
        setReviews(JSON.parse(storedAll));
      } else {
        localStorage.setItem('all_admin_reviews', JSON.stringify(initialReviews));
        saveApprovedList(initialReviews);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveApprovedList = (updatedList: any[]) => {
    const approvedOnly = updatedList.filter(r => r.status === 'approved');
    localStorage.setItem('approved_reviews', JSON.stringify(approvedOnly));
    localStorage.setItem('all_admin_reviews', JSON.stringify(updatedList));
    window.dispatchEvent(new Event('reviews_updated'));
  };

  const filteredReviews = reviews.filter(r => {
    if (filter === 'pending') return r.status === 'pending';
    if (filter === 'approved') return r.status === 'approved';
    if (filter === 'rejected') return r.status === 'rejected';
    return true;
  });

  const handleUpdateStatus = (id: string, newStatus: string) => {
    const updated = reviews.map(r => r.id === id ? { ...r, status: newStatus } : r);
    setReviews(updated);
    saveApprovedList(updated);
  };

  const handleDeleteReview = (id: string) => {
    if (confirm('هل أنت تأكد من حذف هذا التقييم؟')) {
      const updated = reviews.filter(r => r.id !== id);
      setReviews(updated);
      saveApprovedList(updated);
    }
  };

  const handleOpenModal = () => {
    setStudentName('');
    setGrade('طالب أولى ثانوي - القاهرة');
    setCourseTitle('كورس أولى ثانوي - الترم الأول');
    setRating(5);
    setBadge('🥇 الأول على الدفعة');
    setComment('');
    setPublishStatus('approved');
    setShowModal(true);
  };

  const handleCreateReview = () => {
    if (!studentName.trim() || !comment.trim()) return;

    const newReview = {
      id: `rev-${Date.now()}`,
      studentName: studentName.trim(),
      grade: grade.trim(),
      courseTitle: courseTitle.trim(),
      rating: Number(rating),
      comment: comment.trim(),
      badge,
      status: publishStatus,
      date: 'اليوم'
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    saveApprovedList(updated);
    setShowModal(false);
  };

  return (
    <div style={{ width: '100%', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Title & Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px' }}>مراجعة وتقييمات الطلاب ⭐️</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>مراجعة تقييمات الطلاب للكورسات أو إضافة تقييمات جديدة وعرضها في الصفحة الرئيسية.</p>
        </div>

        <button
          onClick={handleOpenModal}
          style={{
            display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none',
            padding: '12px 24px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(108,34,249,0.35)', fontFamily: 'Tajawal, sans-serif'
          }}
        >
          <Plus size={18} /> إضافة تقييم يدوي جديد
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '8px 20px', borderRadius: 20, border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer',
            background: filter === 'all' ? '#6C22F9' : 'var(--surface)', color: filter === 'all' ? '#fff' : 'var(--text-main)', border: '1px solid var(--border)'
          }}
        >
          الكل ({reviews.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          style={{
            padding: '8px 20px', borderRadius: 20, border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer',
            background: filter === 'pending' ? '#6C22F9' : 'var(--surface)', color: filter === 'pending' ? '#fff' : 'var(--text-main)', border: '1px solid var(--border)'
          }}
        >
          بانتظار الموافقة ({reviews.filter(r => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          style={{
            padding: '8px 20px', borderRadius: 20, border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer',
            background: filter === 'approved' ? '#6C22F9' : 'var(--surface)', color: filter === 'approved' ? '#fff' : 'var(--text-main)', border: '1px solid var(--border)'
          }}
        >
          المقبولة والمعروضة بالرئيسية ({reviews.filter(r => r.status === 'approved').length})
        </button>
      </div>

      {/* Reviews Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
        {filteredReviews.map((rev) => (
          <motion.div
            key={rev.id}
            layout
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            style={{
              background: 'var(--surface)', borderRadius: 20, padding: 24,
              border: '1px solid var(--border)', boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: 16
            }}
          >
            <div>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 2 }}>
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>

                <span style={{
                  fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20,
                  background: rev.status === 'approved' ? 'rgba(34,197,94,0.15)' : rev.status === 'rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                  color: rev.status === 'approved' ? '#22c55e' : rev.status === 'rejected' ? '#ef4444' : '#f59e0b'
                }}>
                  {rev.status === 'approved' ? 'معروض في الرئيسية ✅' : rev.status === 'rejected' ? 'مرفوض ❌' : 'في الانتظار ⏳'}
                </span>
              </div>

              {/* Student Name & Badge */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: 'var(--text-main)' }}>{rev.studentName}</h3>
                  {rev.badge && (
                    <span style={{ fontSize: 11, background: 'rgba(108,34,249,0.12)', color: '#6C22F9', padding: '2px 8px', borderRadius: 12, fontWeight: 800 }}>
                      {rev.badge}
                    </span>
                  )}
                </div>
                <p style={{ margin: '2px 0 0', fontSize: 12, color: 'var(--text-muted)' }}>{rev.grade} • {rev.courseTitle}</p>
              </div>

              {/* Comment */}
              <div style={{ background: 'var(--bg)', padding: 14, borderRadius: 12, border: '1px solid var(--border)', fontSize: 13, color: 'var(--text-main)', lineHeight: 1.6 }}>
                &ldquo;{rev.comment}&rdquo;
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border)', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 8 }}>
                {rev.status !== 'approved' && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'approved')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#10b981', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 10, fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <CheckCircle2 size={14} /> قبول ونشر
                  </button>
                )}
                {rev.status !== 'rejected' && (
                  <button
                    onClick={() => handleUpdateStatus(rev.id, 'rejected')}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.25)', padding: '8px 14px', borderRadius: 10, fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <XCircle size={14} /> رفض
                  </button>
                )}
              </div>

              <button
                onClick={() => handleDeleteReview(rev.id)}
                style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer' }}
                title="حذف التقييم"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Manual Review Modal Popup */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            
            {/* Backdrop */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(5,2,20,0.75)', backdropFilter: 'blur(4px)', zIndex: 1001 }} onClick={() => setShowModal(false)} />
            
            {/* Modal Box */}
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} style={{ position: 'relative', zIndex: 1002, width: '100%', maxWidth: 580, background: 'var(--surface)', borderRadius: 24, padding: 32, boxShadow: '0 20px 50px rgba(0,0,0,0.4)', border: '1px solid var(--border)', maxHeight: '90vh', overflowY: 'auto' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Sparkles size={20} color="#6C22F9" /> إضافة تقييم طالب جديد
                </h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-main)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><X size={18} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>اسم الطالب الثلاثي</label>
                  <input type="text" value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="مثال: محمود عبدالفتاح السيد" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>المرحلة والمحافظة</label>
                    <input type="text" value={grade} onChange={e => setGrade(e.target.value)} placeholder="مثال: طالب أولى ثانوي - القاهرة" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>اسم الكورس</label>
                    <input type="text" value={courseTitle} onChange={e => setCourseTitle(e.target.value)} placeholder="مثال: كورس أولى ثانوي - الترم الأول" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>التقييم (النجوم)</label>
                    <select value={rating} onChange={e => setRating(Number(e.target.value))} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}>
                      <option value={5}>⭐️⭐️⭐️⭐️⭐️ (5 نجوم)</option>
                      <option value={4}>⭐️⭐️⭐️⭐️ (4 نجوم)</option>
                      <option value={3}>⭐️⭐️⭐️ (3 نجوم)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>وسام التميز (اختياري)</label>
                    <select value={badge} onChange={e => setBadge(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}>
                      <option value="🥇 الأول على الدفعة">🥇 الأول على الدفعة</option>
                      <option value="🌟 متفوق الأسبوع">🌟 متفوق الأسبوع</option>
                      <option value="🏆 وسام التميز">🏆 وسام التميز</option>
                      <option value="">بدون وسام</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>نص التقييم والرأي</label>
                  <textarea rows={3} value={comment} onChange={e => setComment(e.target.value)} placeholder="اكتب تقييم الطالب هنا..." style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', resize: 'vertical', boxSizing: 'border-box' }} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>حالة النشر</label>
                  <select value={publishStatus} onChange={e => setPublishStatus(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}>
                    <option value="approved">مقبول ومعروض في الصفحة الرئيسية فوراً ✅</option>
                    <option value="pending">في انتظار مراجعة الأدمن ⏳</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                <button onClick={() => setShowModal(false)} style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 10, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>إلغاء</button>
                <button onClick={handleCreateReview} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}><Save size={16} /> إضافة ونشر التقييم</button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
