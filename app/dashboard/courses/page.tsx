'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  PlayCircle,
  CheckCircle,
  Clock,
  Star,
  X,
  Send,
  Sparkles,
  BookOpen,
  RefreshCw,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import api from '@/app/lib/api';

interface EnrolledCourseItem {
  id: string;
  _id?: string;
  title: string;
  progress?: number;
  totalLessons?: number;
  completedLessons?: number;
  img: string;
  status: 'in-progress' | 'completed';
  myRating?: number | null;
  myReview?: string | null;
}

export default function MyCoursesPage() {
  const [coursesList, setCoursesList] = useState<EnrolledCourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<EnrolledCourseItem | null>(null);
  const [ratingStars, setRatingStars] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  const fetchEnrolledCourses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/users/profile');
      const user = res.data?.data?.user;
      const enrolledRaw = user?.enrolledCourses || [];

      const normalized: EnrolledCourseItem[] = enrolledRaw.map((c: any) => {
        const id = (c._id || c.id || c).toString();
        const title = typeof c === 'object' && c.title ? c.title : 'كورس تعليمي';
        const img = typeof c === 'object' && c.thumbnail?.url ? c.thumbnail.url : '/hero1.webp';

        return {
          id,
          _id: id,
          title,
          progress: 0,
          totalLessons: 0,
          completedLessons: 0,
          img,
          status: 'in-progress',
          myRating: null,
          myReview: null,
        };
      });

      setCoursesList(normalized);
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || 'تعذر تحميل الكورسات المشترك بها';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrolledCourses();
  }, [fetchEnrolledCourses]);

  const handleOpenReviewModal = (course: EnrolledCourseItem) => {
    setSelectedCourse(course);
    setRatingStars(course.myRating || 5);
    setReviewComment(course.myReview || '');
    setIsSavedSuccess(false);
    setShowReviewModal(true);
  };

  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    setCoursesList(
      coursesList.map((c) => {
        if (c.id === selectedCourse.id) {
          return { ...c, myRating: ratingStars, myReview: reviewComment };
        }
        return c;
      })
    );

    setIsSavedSuccess(true);
    setTimeout(() => {
      setShowReviewModal(false);
    }, 1200);
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          gap: 16,
          direction: 'rtl',
          fontFamily: 'Tajawal, sans-serif',
        }}
      >
        <RefreshCw size={36} color="#6C22F9" className="animate-spin" />
        <p style={{ color: 'var(--text-muted)', fontSize: 16, fontWeight: 700 }}>
          جارِ تحميل الكورسات المشترك بها...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          padding: 24,
          direction: 'rtl',
          fontFamily: 'Tajawal, sans-serif',
          textAlign: 'center',
        }}
      >
        <AlertCircle size={40} color="#ef4444" style={{ marginBottom: 12 }} />
        <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 8px' }}>
          تعذر تحميل الكورسات
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: '0 0 20px', maxWidth: 400 }}>
          {error}
        </p>
        <button
          onClick={fetchEnrolledCourses}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            background: '#6C22F9',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          <RefreshCw size={14} /> إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        fontFamily: 'Tajawal, sans-serif',
        direction: 'rtl',
      }}
    >
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>
          كورساتي المشترك بها 📚
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 15, margin: 0 }}>
          تابع تقدمك في المنهج واستكمل المشاهدة وتقييم الكورسات لتطوير المحتوى.
        </p>
      </div>

      {coursesList.length === 0 ? (
        <div
          style={{
            background: 'var(--surface)',
            border: '1px dashed var(--border)',
            borderRadius: 24,
            padding: '48px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'rgba(108,34,249,0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BookOpen size={32} color="#6C22F9" />
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px' }}>
              لم تشترك في أي كورس بعد
            </h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: 0, maxWidth: 380, lineHeight: 1.6 }}>
              استكشف أحدث الكورسات والمناهج المتاحة على المنصة وابدأ رحلتك التعليمية الآن.
            </p>
          </div>
          <Link
            href="/courses"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#6C22F9',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: 12,
              fontWeight: 800,
              textDecoration: 'none',
              fontSize: 14,
              boxShadow: '0 4px 12px rgba(108,34,249,0.25)',
            }}
          >
            تصفح الكورسات المتاحة <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
            gap: 24,
          }}
        >
          {coursesList.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: 'var(--surface)',
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                border: '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Image Section */}
              <div style={{ position: 'relative', height: 180 }}>
                <Image src={course.img} alt={course.title} fill style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />

                <div
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    background: 'rgba(108,34,249,0.9)',
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Clock size={14} /> مشترك
                </div>

                <Link
                  href={`/courses/${course.id}/watch`}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <motion.div whileHover={{ scale: 1.15 }}>
                    <PlayCircle
                      size={54}
                      color="#fff"
                      style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.5))' }}
                    />
                  </motion.div>
                </Link>
              </div>

              {/* Content Section */}
              <div
                style={{
                  padding: 24,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h3
                    style={{
                      fontSize: 18,
                      fontWeight: 900,
                      color: 'var(--text-main)',
                      margin: '0 0 12px',
                    }}
                  >
                    {course.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                  <Link
                    href={`/courses/${course.id}/watch`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                      background: '#6C22F9',
                      color: '#fff',
                      padding: '12px',
                      borderRadius: 14,
                      textDecoration: 'none',
                      fontWeight: 800,
                      fontSize: 14,
                      boxShadow: '0 4px 12px rgba(108,34,249,0.3)',
                    }}
                  >
                    <PlayCircle size={18} /> متابعة مشاهدة الدروس
                  </Link>

                  {/* Rating & Review Button */}
                  <button
                    onClick={() => handleOpenReviewModal(course)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      background: 'var(--bg)',
                      color: 'var(--text-main)',
                      border: '1px solid var(--border)',
                      padding: '10px',
                      borderRadius: 14,
                      fontWeight: 700,
                      fontSize: 13,
                      cursor: 'pointer',
                    }}
                  >
                    <Star size={16} fill={course.myRating ? '#f59e0b' : 'none'} color="#f59e0b" />
                    {course.myRating
                      ? `تقييمك: ${course.myRating}/5 ⭐ (تعديل الرأي)`
                      : 'تقييم الكورس وكتابة رأيك ⭐'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && selectedCourse && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 20,
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15,10,50,0.6)',
                backdropFilter: 'blur(4px)',
                zIndex: 1001,
              }}
              onClick={() => setShowReviewModal(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'relative',
                zIndex: 1002,
                width: '100%',
                maxWidth: 460,
                background: 'var(--surface)',
                borderRadius: 24,
                padding: 32,
                boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                color: 'var(--text-main)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                  paddingBottom: 16,
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>
                  تقييم الكورس وكتابة رأيك ⭐️
                </h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              {isSavedSuccess ? (
                <div style={{ textAlign: 'center', padding: '30px 0' }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'rgba(16,185,129,0.15)',
                      color: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <CheckCircle size={32} />
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px' }}>
                    تم حفظ تقييمك بنجاح! 🎉
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>
                    شكراً لمشاركتك رأيك القيمة معنا.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSaveReview} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
                      {selectedCourse.title}
                    </p>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        marginBottom: 8,
                      }}
                    >
                      اختر التقييم (من 1 إلى 5 نجوم):
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        gap: 8,
                        justifyContent: 'center',
                        padding: 12,
                        background: 'var(--bg)',
                        borderRadius: 14,
                        border: '1px solid var(--border)',
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setRatingStars(num)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                        >
                          <Star size={32} fill={num <= ratingStars ? '#f59e0b' : 'none'} color="#f59e0b" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 13,
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        marginBottom: 8,
                      }}
                    >
                      اكتب رأيك وانطباعك الشفاف عن الكورس والشرح:
                    </label>
                    <textarea
                      rows={4}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="الشرح ممتاز جداً والبث المباشر بيساعدنا نفهم الكود خطوة بخطوة..."
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: 12,
                        border: '1px solid var(--border)',
                        background: 'var(--bg)',
                        color: 'var(--text-main)',
                        outline: 'none',
                        fontSize: 14,
                        fontFamily: 'Tajawal, sans-serif',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(false)}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 10,
                        border: 'none',
                        background: 'var(--bg)',
                        color: 'var(--text-main)',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '10px 24px',
                        borderRadius: 10,
                        border: 'none',
                        background: '#6C22F9',
                        color: '#fff',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                    >
                      <Send size={15} /> إرسال التقييم
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
