'use client';
import { use, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import {
  PlayCircle,
  Clock,
  BookOpen,
  CheckCircle,
  Video,
  FileText,
  Lock,
  ArrowRight,
  User,
  CheckCircle2,
  X,
  Wallet,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import api from '@/app/lib/api';
import { coursesService } from '@/app/features/courses/services/courses.service';
import { Course } from '@/app/features/courses/types/course.types';
import { courseContentService } from '@/app/features/course-content/services/course-content.service';
import { Section } from '@/app/features/course-content/types/course-content.types';

export default function CourseDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const courseId = unwrappedParams.id;

  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<{ id: string; status: string; totalAmount: number } | null>(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [enrollError, setEnrollError] = useState('');
  const [orderInfo, setOrderInfo] = useState<{ id: string; status: string; totalAmount: number } | null>(null);

  const checkEnrollmentStatus = useCallback(async () => {
    try {
      const res = await api.get('/users/profile');
      const enrolledList: any[] = res.data?.data?.user?.enrolledCourses || [];
      const enrolled = enrolledList.some((c: any) => {
        const enrolledId = typeof c === 'object' ? c._id || c.id : c;
        return enrolledId && enrolledId.toString() === courseId;
      });
      setIsEnrolled(enrolled);
      return enrolled;
    } catch {
      return false;
    }
  }, [courseId]);

  const checkOrdersStatus = useCallback(async () => {
    try {
      const res = await api.get('/orders/my-orders');
      const payload = res.data?.data;
      const ordersList: any[] = Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.orders)
        ? payload.orders
        : Array.isArray(payload)
        ? payload
        : [];

      if (Array.isArray(ordersList)) {
        const found = ordersList.find((o: any) =>
          Array.isArray(o.items) &&
          o.items.some((it: any) => {
            const itId = typeof it.item === 'object' ? it.item?._id || it.item?.id : it.item;
            return itId && itId.toString() === courseId;
          })
        );
        if (found && found.status === 'pending') {
          setPendingOrder({
            id: found._id,
            status: found.status,
            totalAmount: found.totalAmount,
          });
        }
      }
    } catch {
      // Non-blocking
    }
  }, [courseId]);

  const loadCourseData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [courseData, sectionsData] = await Promise.all([
        coursesService.getCourseById(courseId),
        courseContentService.getSections(courseId).catch(() => [] as Section[]),
      ]);

      if (!courseData || !courseData.id) {
        throw new Error('لم يتم العثور على الكورس المطلوب');
      }

      setCourse(courseData);
      setSections(sectionsData);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'حدث خطأ أثناء تحميل بيانات الكورس';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadCourseData();
  }, [loadCourseData]);

  // Check authentication and enrollment status from backend
  useEffect(() => {
    const token =
      localStorage.getItem('accessToken') ||
      localStorage.getItem('student_token') ||
      localStorage.getItem('token');
    const hasCookie =
      document.cookie.includes('student_token=') ||
      document.cookie.includes('admin_token=') ||
      document.cookie.includes('jwt=');

    const authenticated = !!token || hasCookie;
    setIsLoggedIn(authenticated);

    if (authenticated) {
      checkEnrollmentStatus();
      checkOrdersStatus();

      // Browser return from payment gateway: verify authoritatively from backend
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const returnOrderId = urlParams.get('orderId');
        if (returnOrderId) {
          api
            .get(`/payments/status/${returnOrderId}`)
            .then(async (res) => {
              const returnedOrder = res.data?.data?.order;
              if (returnedOrder && returnedOrder.status === 'completed') {
                const verified = await checkEnrollmentStatus();
                if (verified) {
                  setIsEnrolled(true);
                  setPaySuccess(true);
                  setShowPayModal(true);
                }
              } else if (returnedOrder) {
                setPendingOrder({
                  id: returnOrderId,
                  status: returnedOrder.status,
                  totalAmount: returnedOrder.totalAmount,
                });
              }
            })
            .catch(() => {});
        }
      }
    }
  }, [courseId, checkEnrollmentStatus, checkOrdersStatus]);

  const defaultFeatures = [
    'وصول كامل لمحتوى الكورس عبر المنصة',
    'مذكرات وتدريبات عملية لكل وحدة',
    'امتحانات دورية وتدريبات شاملة',
    'جروب دعم للإجابة على جميع استفساراتك',
    'شهادة إتمام معتمدة بعد إنهاء الكورس',
  ];

  const handleSubscribeClick = () => {
    if (!isLoggedIn) {
      window.location.href = `/login?redirect=/courses/${courseId}`;
    } else if (isEnrolled) {
      window.location.href = `/courses/${courseId}/watch`;
    } else {
      setEnrollError('');
      setOrderInfo(null);
      setShowPayModal(true);
    }
  };

  const handleConfirmEnroll = async () => {
    if (!isLoggedIn) {
      window.location.href = `/login?redirect=/courses/${courseId}`;
      return;
    }

    if (isEnrolled) {
      window.location.href = `/courses/${courseId}/watch`;
      return;
    }

    setEnrollLoading(true);
    setEnrollError('');

    try {
      // 1. Dispatch real order creation to backend
      const orderRes = await api.post('/orders', {
        items: [{ courseId }],
      });

      const order = orderRes.data?.data?.order;
      if (!order || !order._id) {
        throw new Error('لم يتم استلام بيانات الطلب من السيرفر');
      }

      setOrderInfo({
        id: order._id,
        status: order.status,
        totalAmount: order.totalAmount,
      });

      // 2. If order completed immediately (e.g. Free course)
      if (order.status === 'completed') {
        // Verify from MongoDB that student profile actually reflects enrollment
        const verified = await checkEnrollmentStatus();
        if (verified) {
          setIsEnrolled(true);
          setPaySuccess(true);
        } else {
          // Poll once after 1 second for database propagation
          setTimeout(async () => {
            const retryVerified = await checkEnrollmentStatus();
            if (retryVerified) {
              setIsEnrolled(true);
              setPaySuccess(true);
            } else {
              setEnrollError('تم إنشاء الطلب وجارِ تفعيل الصلاحية، يرجى تحديث الصفحة.');
            }
          }, 1000);
        }
      } else {
        // 3. Paid order (pending status) - track pending order and initiate Kashier payment
        setPendingOrder({
          id: order._id,
          status: order.status,
          totalAmount: order.totalAmount,
        });
        try {
          const initRes = await api.post('/payments/initiate', {
            orderId: order._id,
            gateway: 'kashier',
          });
          const checkoutUrl = initRes.data?.data?.checkoutUrl;
          if (checkoutUrl) {
            window.location.href = checkoutUrl;
            return;
          }
        } catch (initErr: any) {
          const errMsg = initErr.response?.data?.message || initErr.message || 'تعذر بدء عملية الدفع عبر بوابة Kashier';
          setEnrollError(errMsg);
        }
        // Do NOT set paySuccess(true) until payment is confirmed by backend
      }
    } catch (err: any) {
      const backendMsg = err.response?.data?.message || err.message;
      if (backendMsg && backendMsg.includes('مسجل بالفعل')) {
        await checkEnrollmentStatus();
        setIsEnrolled(true);
        setPaySuccess(true);
      } else {
        setEnrollError(backendMsg || 'تعذر إتمام طلب الاشتراك. يرجى المحاولة مرة أخرى.');
      }
    } finally {
      setEnrollLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          direction: 'rtl',
          fontFamily: 'Tajawal, sans-serif',
        }}
      >
        <RefreshCw size={36} color="#6C22F9" className="animate-spin" />
        <p style={{ color: '#64748b', fontSize: 16, fontWeight: 700 }}>
          جارِ تحميل تفاصيل الكورس ومحتواه...
        </p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div
        style={{
          minHeight: '70vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          direction: 'rtl',
          fontFamily: 'Tajawal, sans-serif',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: 'rgba(239,68,68,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <AlertCircle size={36} color="#ef4444" />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#16133a', marginBottom: 8 }}>
          تعذر عرض الكورس
        </h2>
        <p style={{ color: '#64748b', fontSize: 15, maxWidth: 440, lineHeight: 1.6, marginBottom: 24 }}>
          {error || 'الكورس المطلوب غير متوفر أو لم يتم نشره بعد.'}
        </p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={loadCourseData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: '#6C22F9',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              fontWeight: 800,
              cursor: 'pointer',
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            <RefreshCw size={16} /> إعادة المحاولة
          </button>
          <Link
            href="/courses"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 24px',
              background: '#f1f5f9',
              color: '#475569',
              borderRadius: 12,
              fontWeight: 700,
              textDecoration: 'none',
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            <ArrowRight size={16} /> العودة لدليل الكورسات
          </Link>
        </div>
      </div>
    );
  }

  const instructorName = course.instructor?.name || 'مدرس المادة';
  const totalLessonsCount = sections.reduce(
    (acc, sec) => acc + (Array.isArray(sec.lessons) ? sec.lessons.length : 0),
    course.totalLessons || 0
  );
  const displayImage = course.image || course.thumbnail?.url || '/hero1.webp';

  return (
    <div
      style={{
        background: '#f8fafc',
        minHeight: '100vh',
        direction: 'rtl',
        fontFamily: 'Tajawal, sans-serif',
      }}
    >
      {/* Course Hero Banner */}
      <div
        style={{
          background:
            'linear-gradient(135deg, rgba(15,10,50,0.95) 0%, rgba(108,34,249,0.85) 100%)',
          padding: '60px 0',
          color: '#fff',
        }}
      >
        <div className="container" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <Link
              href="/courses"
              style={{
                color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              <ArrowRight size={16} /> العودة للكورسات
            </Link>
          </div>

          <div
            className="hero-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.5fr 1fr',
              gap: 48,
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <span
                  style={{
                    background: '#059669',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {course.grade || 'مرحلة دراسية'}
                </span>
                <span
                  style={{
                    background: '#d97706',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: 8,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  {course.type || course.category || 'شرح المنهج'}
                </span>
                {isEnrolled && (
                  <span
                    style={{
                      background: '#10b981',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <CheckCircle2 size={14} /> مشترك بالفعل
                  </span>
                )}
                {pendingOrder && !isEnrolled && (
                  <span
                    style={{
                      background: '#d97706',
                      color: '#fff',
                      padding: '4px 12px',
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    <Clock size={14} /> طلبك قيد الانتظار (#{pendingOrder.id.slice(-6).toUpperCase()})
                  </span>
                )}
              </div>
              <h1
                style={{
                  fontSize: 'clamp(26px, 3.5vw, 38px)',
                  fontWeight: 900,
                  marginBottom: 16,
                  lineHeight: 1.3,
                }}
              >
                {course.title}
              </h1>
              <p
                style={{
                  fontSize: 16,
                  color: 'rgba(255,255,255,0.85)',
                  lineHeight: 1.8,
                  marginBottom: 32,
                  maxWidth: 600,
                }}
              >
                {course.description || 'كورس تعليمي شامل ومحدث وفقاً لأحدث المناهج والمعايير.'}
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 24,
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={18} color="#a78bfa" /> المدرس: {instructorName}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <BookOpen size={18} color="#a78bfa" /> {totalLessonsCount} درس
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <User size={18} color="#a78bfa" /> {course.students || course.totalStudents || 0} طالب مسجل
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="container"
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '40px 20px',
          display: 'flex',
          gap: 40,
          alignItems: 'flex-start',
        }}
      >
        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 40 }}>
          {/* About Section */}
          <section>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#16133a', marginBottom: 20 }}>
              ماذا ستتعلم في هذا الكورس؟
            </h2>
            <div
              style={{
                background: '#fff',
                borderRadius: 24,
                padding: 32,
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: 16,
                }}
              >
                {defaultFeatures.map((feature, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <CheckCircle
                      size={20}
                      color="#10b981"
                      style={{ flexShrink: 0, marginTop: 2 }}
                    />
                    <span
                      style={{
                        fontSize: 15,
                        color: '#4b5563',
                        lineHeight: 1.6,
                        fontWeight: 600,
                      }}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Curriculum Section */}
          <section>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: '#16133a', marginBottom: 20 }}>
              محتوى الكورس ({sections.length} وحدات)
            </h2>

            {sections.length === 0 ? (
              <div
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: 32,
                  textAlign: 'center',
                  color: '#64748b',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                  border: '1px solid #f1f5f9',
                }}
              >
                <BookOpen size={36} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>
                  جارِ إعداد وتجهيز الوحدات والدروس لهذا الكورس قريباً.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {sections.map((section, i) => (
                  <div
                    key={section.id || i}
                    style={{
                      background: '#fff',
                      borderRadius: 16,
                      overflow: 'hidden',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.02)',
                      border: '1px solid #f1f5f9',
                    }}
                  >
                    {/* Unit Header */}
                    <div
                      style={{
                        background: '#f8fafc',
                        padding: '20px 24px',
                        borderBottom: '1px solid #f1f5f9',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: 16,
                          fontWeight: 800,
                          color: '#16133a',
                          margin: 0,
                        }}
                      >
                        {section.title}
                      </h3>
                      <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>
                        {section.lessons?.length || 0} دروس
                      </span>
                    </div>

                    {/* Lessons List */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      {(!section.lessons || section.lessons.length === 0) ? (
                        <div style={{ padding: '16px 24px', color: '#94a3b8', fontSize: 14 }}>
                          لا توجد دروس مضافة في هذه الوحدة حالياً
                        </div>
                      ) : (
                        section.lessons.map((lesson, j) => (
                          <div
                            key={lesson.id || j}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              padding: '16px 24px',
                              borderBottom:
                                j !== (section.lessons?.length || 0) - 1
                                  ? '1px solid #f1f5f9'
                                  : 'none',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <Video size={18} color="#6b7280" />
                              <span style={{ fontSize: 15, color: '#4b5563', fontWeight: 600 }}>
                                {lesson.title}
                              </span>
                              {lesson.isFree && (
                                <span
                                  style={{
                                    fontSize: 11,
                                    background: '#dcfce7',
                                    color: '#15803d',
                                    padding: '2px 8px',
                                    borderRadius: 6,
                                    fontWeight: 800,
                                  }}
                                >
                                  معاينة مجانية
                                </span>
                              )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{ fontSize: 13, color: '#9ca3af', fontWeight: 600 }}>
                                {lesson.duration || '10:00'}
                              </span>
                              {lesson.isFree || isEnrolled ? (
                                <PlayCircle size={16} color="#10b981" />
                              ) : (
                                <Lock size={16} color="#d1d5db" />
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sticky Checkout Sidebar */}
        <div className="checkout-sidebar" style={{ width: 360, flexShrink: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#fff',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
              position: 'sticky',
              top: 100,
            }}
          >
            <div style={{ position: 'relative', height: 220, background: '#16133a' }}>
              <Image src={displayImage} alt={course.title} fill style={{ objectFit: 'cover' }} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isEnrolled ? (
                  <Link
                    href={`/courses/${courseId}/watch`}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <PlayCircle size={36} color="#fff" />
                  </Link>
                ) : (
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(4px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PlayCircle size={32} color="#fff" />
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: 32 }}>
              <div style={{ display: 'flex', alignItems: 'end', gap: 12, marginBottom: 24 }}>
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: 900,
                    color: '#16133a',
                    lineHeight: 1,
                  }}
                >
                  {course.price}
                </span>
                {course.discountPrice && (
                  <span
                    style={{
                      fontSize: 16,
                      color: '#9ca3af',
                      textDecoration: 'line-through',
                      marginBottom: 4,
                      marginRight: 8,
                    }}
                  >
                    {course.originalPrice}
                  </span>
                )}
                {course.discountBadge && (
                  <span
                    style={{
                      fontSize: 12,
                      background: '#fee2e2',
                      color: '#dc2626',
                      padding: '2px 8px',
                      borderRadius: 6,
                      fontWeight: 800,
                      marginBottom: 4,
                    }}
                  >
                    {course.discountBadge}
                  </span>
                )}
              </div>

              {pendingOrder && !isEnrolled && (
                <div
                  style={{
                    padding: '14px 16px',
                    borderRadius: 14,
                    backgroundColor: '#fffbeb',
                    border: '1px solid #fde68a',
                    marginBottom: 16,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#b45309', fontWeight: 800, fontSize: 14, marginBottom: 4 }}>
                    <Clock size={16} />
                    <span>طلبك قيد انتظار تأكيد الدفع</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#92400e', margin: '0 0 10px 0', lineHeight: 1.5 }}>
                    لديك طلب مسجل بالفعل لهذا الكورس برقم #{pendingOrder.id.slice(-6).toUpperCase()}.
                  </p>
                  <Link
                    href="/dashboard/orders"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      fontSize: 13,
                      fontWeight: 700,
                      color: '#b45309',
                      textDecoration: 'underline',
                    }}
                  >
                    <span>عرض ومتابعة الطلب في لوحة التحكم</span>
                    <ArrowRight size={14} style={{ transform: 'rotate(180deg)' }} />
                  </Link>
                </div>
              )}

              {isEnrolled ? (
                <Link
                  href={`/courses/${courseId}/watch`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    padding: '16px',
                    background: '#10b981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 14,
                    fontSize: 16,
                    fontWeight: 800,
                    textDecoration: 'none',
                    boxShadow: '0 8px 24px rgba(16,185,129,0.3)',
                    marginBottom: 16,
                    fontFamily: 'Tajawal, sans-serif',
                    boxSizing: 'border-box',
                  }}
                >
                  بدء مشاهدة الكورس الآن 🚀
                </Link>
              ) : pendingOrder ? (
                <Link
                  href="/dashboard/orders"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    padding: '16px',
                    background: '#d97706',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 14,
                    fontSize: 16,
                    fontWeight: 800,
                    textDecoration: 'none',
                    boxShadow: '0 8px 24px rgba(217,119,6,0.3)',
                    marginBottom: 16,
                    fontFamily: 'Tajawal, sans-serif',
                    boxSizing: 'border-box',
                  }}
                >
                  متابعة حالة الطلب 📋
                </Link>
              ) : (
                <button
                  onClick={handleSubscribeClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    padding: '16px',
                    background: '#6C22F9',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 14,
                    fontSize: 16,
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(108,34,249,0.3)',
                    marginBottom: 16,
                    fontFamily: 'Tajawal, sans-serif',
                  }}
                >
                  {isLoggedIn ? 'الاشتراك في الكورس الآن 🚀' : 'تسجيل الدخول للاشتراك 🔑'}
                </button>
              )}

              <p
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  color: '#6b7280',
                  margin: 0,
                  fontWeight: 600,
                }}
              >
                يتوفر الدفع بواسطة أكواد التفعيل والمحافظ الإلكترونية
              </p>

              <hr
                style={{
                  border: 'none',
                  borderTop: '1px solid #f1f5f9',
                  margin: '24px 0',
                }}
              />

              <h4 style={{ fontSize: 15, fontWeight: 800, color: '#16133a', marginBottom: 16 }}>
                يشمل هذا الكورس:
              </h4>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                <li
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontSize: 14,
                    color: '#4b5563',
                    fontWeight: 600,
                  }}
                >
                  <Video size={16} color="#6C22F9" /> {totalLessonsCount} درس تعليمي مسجل
                </li>
                <li
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontSize: 14,
                    color: '#4b5563',
                    fontWeight: 600,
                  }}
                >
                  <FileText size={16} color="#6C22F9" /> تدريبات وملفات مساندة
                </li>
                <li
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    fontSize: 14,
                    color: '#4b5563',
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle size={16} color="#6C22F9" /> امتحانات تقييمية شاملة
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Subscribe Modal for Logged In Students */}
      <AnimatePresence>
        {showPayModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPayModal(false)}
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(6px)',
              }}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              style={{
                position: 'relative',
                background: '#fff',
                borderRadius: 24,
                border: '1px solid #e2e8f0',
                padding: 28,
                width: '100%',
                maxWidth: 500,
                zIndex: 1000,
                fontFamily: 'Tajawal, sans-serif',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: 18,
                    fontWeight: 900,
                    color: '#16133a',
                  }}
                >
                  إتمام الاشتراك في الكورس 💳
                </h3>
                <button
                  onClick={() => setShowPayModal(false)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              {paySuccess ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <CheckCircle2
                    size={48}
                    color="#10b981"
                    style={{ margin: '0 auto 16px' }}
                  />
                  <h4
                    style={{
                      margin: '0 0 8px',
                      fontSize: 18,
                      fontWeight: 900,
                      color: '#16133a',
                    }}
                  >
                    تم تفعيل الكورس بنجاح! 🎉
                  </h4>
                  <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>
                    تم التحقق من اشتراكك بنجاح من قاعدة البيانات. يمكنك البدء بالمشاهدة فوراً.
                  </p>
                  <Link
                    href={`/courses/${courseId}/watch`}
                    style={{
                      display: 'inline-block',
                      background: '#6C22F9',
                      color: '#fff',
                      padding: '12px 28px',
                      borderRadius: 12,
                      fontWeight: 800,
                      textDecoration: 'none',
                    }}
                  >
                    بدء مشاهدة دروس الكورس 🚀
                  </Link>
                </div>
              ) : orderInfo && orderInfo.status === 'pending' ? (
                <div style={{ textAlign: 'center', padding: 20 }}>
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      background: 'rgba(234, 179, 8, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                    }}
                  >
                    <Clock size={36} color="#eab308" />
                  </div>
                  <h4
                    style={{
                      margin: '0 0 8px',
                      fontSize: 18,
                      fontWeight: 900,
                      color: '#16133a',
                    }}
                  >
                    تم تسجيل طلب الاشتراك بنجاح 📋
                  </h4>
                  <p style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>
                    رقم الطلب: <strong style={{ color: '#6C22F9' }}>#{orderInfo.id.slice(-6).toUpperCase()}</strong>
                  </p>
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      padding: '14px 16px',
                      fontSize: 14,
                      color: '#475569',
                      lineHeight: 1.6,
                      marginBottom: 20,
                      textAlign: 'right',
                    }}
                  >
                    طلبك مسجل في النظام بحالة <strong>قيد المراجعة وتأكيد الدفع</strong> (المبلغ: {orderInfo.totalAmount} ج.م). سيتم تفعيل صلاحية الكورس بحسابك تلقائياً بمجرد إتمام الدفع أو اعتماده من الإدارة.
                  </div>
                  <button
                    onClick={() => setShowPayModal(false)}
                    style={{
                      background: '#6C22F9',
                      color: '#fff',
                      padding: '10px 24px',
                      borderRadius: 10,
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'Tajawal, sans-serif',
                    }}
                  >
                    حسناً، متابعة
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {enrollError && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        background: '#fee2e2',
                        color: '#dc2626',
                        padding: '10px 14px',
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      <AlertCircle size={16} />
                      <span>{enrollError}</span>
                    </div>
                  )}

                  <div
                    style={{
                      background: '#f8fafc',
                      padding: 16,
                      borderRadius: 14,
                      border: '1px solid #e2e8f0',
                    }}
                  >
                    <p
                      style={{
                        margin: '0 0 4px',
                        fontSize: 13,
                        color: '#64748b',
                        fontWeight: 600,
                      }}
                    >
                      الكورس المحدد:
                    </p>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#6C22F9' }}>
                      {course.title} ({course.price})
                    </h4>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Link
                      href="/dashboard/wallet"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 14,
                        background: '#faf5ff',
                        borderRadius: 12,
                        border: '1px solid #ddd6fe',
                        textDecoration: 'none',
                        color: '#6C22F9',
                        fontWeight: 800,
                      }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Wallet size={18} /> الخصم المباشر من المحفظة
                      </span>
                      <span>{course.price}</span>
                    </Link>

                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: 13,
                          fontWeight: 700,
                          color: '#475569',
                          marginBottom: 6,
                        }}
                      >
                        أو أدخل كود التفعيل / كارت الشحن:
                      </label>
                      <input
                        type="text"
                        value={activationCode}
                        onChange={(e) => setActivationCode(e.target.value.toUpperCase())}
                        placeholder="مثال: AH-2026-X9YZ"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: 10,
                          border: '1px solid #cbd5e1',
                          outline: 'none',
                          fontSize: 14,
                          fontWeight: 800,
                          fontFamily: 'Tajawal, sans-serif',
                          boxSizing: 'border-box',
                        }}
                      />
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      gap: 12,
                      justifyContent: 'flex-end',
                      marginTop: 12,
                    }}
                  >
                    <button
                      onClick={() => setShowPayModal(false)}
                      disabled={enrollLoading}
                      style={{
                        padding: '10px 20px',
                        borderRadius: 10,
                        border: '1px solid #e2e8f0',
                        background: '#f8fafc',
                        color: '#475569',
                        fontWeight: 700,
                        cursor: enrollLoading ? 'not-allowed' : 'pointer',
                      }}
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={handleConfirmEnroll}
                      disabled={enrollLoading}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        padding: '10px 24px',
                        borderRadius: 10,
                        border: 'none',
                        background: enrollLoading ? '#a855f7' : '#6C22F9',
                        color: '#fff',
                        fontWeight: 800,
                        cursor: enrollLoading ? 'not-allowed' : 'pointer',
                        fontFamily: 'Tajawal, sans-serif',
                      }}
                    >
                      {enrollLoading ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>جارِ المعالجة في السيرفر...</span>
                        </>
                      ) : (
                        <span>تأكيد الاشتراك والتفعيل ⚡️</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
