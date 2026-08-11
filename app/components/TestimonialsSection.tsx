'use client';
import { useState, useEffect } from 'react';
import { Star, Quote, Sparkles } from 'lucide-react';

const defaultReviews = [
  {
    id: 'rev-1',
    studentName: 'أحمد محمود العبد',
    grade: 'طالب أولى ثانوي - القاهرة',
    rating: 5,
    comment: 'الشرح مع البشمهندس عبدالرحمن مختلف تماماً! طريقة تبسيط الخوارزميات والتطبيقات العملية خلّتني أحب البرمجة وأقفل امتحانات المدرسة بسهولة.',
    badge: '🥇 الأول على الدفعة'
  },
  {
    id: 'rev-2',
    studentName: 'سارة خالد السيد',
    grade: 'طالبة ثانية ثانوي - الإسكندرية',
    rating: 5,
    comment: 'نظام حماية الشاشة والامتحانات الذكية بيخليني ألتزم بالمذاكرة يوم بيوم. والمحفظة وتوصيل المذكرات للمنزل في سموحة وصلني في 24 ساعة بس!',
    badge: '🌟 متفوقة الأسبوع'
  },
  {
    id: 'rev-3',
    studentName: 'عمر طارق إبراهيم',
    grade: 'طالب أولى ثانوي - الجيزة',
    rating: 5,
    comment: 'المساعد الذكي والشات الفوري بيجاوب على أي كود مكنتش فاهمه في ثواني. أفضل منصة برمجة في مصر بلا منازع.',
    badge: '🏆 وسام التميز'
  },
  {
    id: 'rev-4',
    studentName: 'مريم سعيد علي',
    grade: 'طالبة ثانية ثانوي - طنطا',
    rating: 5,
    comment: 'البث المباشر والمذكرات الورقية المطبوعة جودة ممتازة جداً. البشمهندس بيشرح كل كود بالتفصيل والنتيجة ممتازة.',
    badge: '🌟 نجمة الدفعة'
  }
];

export default function TestimonialsSection() {
  const [reviewsList, setReviewsList] = useState(defaultReviews);

  const loadApprovedReviews = () => {
    try {
      const saved = localStorage.getItem('approved_reviews');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviewsList(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadApprovedReviews();

    const handleStorageChange = () => {
      loadApprovedReviews();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('reviews_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('reviews_updated', handleStorageChange);
    };
  }, []);

  // Multiply by 4 to guarantee 100% infinite seamless stream
  const marqueeItems = [...reviewsList, ...reviewsList, ...reviewsList, ...reviewsList];

  return (
    <section style={{ padding: '80px 0', background: 'var(--bg)', borderTop: '1px solid var(--border)', direction: 'rtl', fontFamily: 'Tajawal, sans-serif', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        
        {/* Title Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(108,34,249,0.12)', color: '#6C22F9', padding: '6px 16px', borderRadius: 20, fontSize: 13, fontWeight: 800, marginBottom: 12 }}>
            <Sparkles size={16} /> آراء وتقييمات طلابنا
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 12px' }}>ماذا يقول طلابنا عن تجربتهم معنا؟ 💬</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>
            آراء وحكايات نجاح حقيقية من طلابنا موافق عليها مباشرة من لوحة الإدارة.
          </p>
        </div>

      </div>

      {/* 100% Seamless Infinite Track Moving Right to Left with Hover Pause */}
      <div className="marquee-wrapper" style={{ width: '100%', overflow: 'hidden', padding: '10px 0', position: 'relative', direction: 'ltr' }}>
        <div 
          className="marquee-track"
          style={{
            display: 'flex',
            gap: 28,
            width: 'max-content',
            animation: 'marqueeRightToLeft 30s linear infinite'
          }}
        >
          {marqueeItems.map((r: any, i: number) => (
            <div 
              key={i}
              style={{
                width: 360,
                background: 'var(--surface)', borderRadius: 24, padding: 28,
                border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                position: 'relative', flexShrink: 0, direction: 'rtl', textAlign: 'right'
              }}
            >
              <Quote size={36} color="rgba(108,34,249,0.15)" style={{ position: 'absolute', top: 20, left: 20 }} />

              <div>
                {/* Rating Stars */}
                <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
                  {[...Array(r.rating || 5)].map((_, idx) => (
                    <Star key={idx} size={16} fill="#f59e0b" color="#f59e0b" />
                  ))}
                </div>

                <p style={{ fontSize: 14, color: 'var(--text-main)', lineHeight: 1.8, margin: '0 0 20px', fontWeight: 600 }}>
                  "{r.comment}"
                </p>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #6C22F9, #3b82f6)', color: '#fff', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>
                    {(r.studentName || 'ط').charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 900, color: 'var(--text-main)' }}>{r.studentName}</h4>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.grade || r.courseTitle || 'طالب متميز'}</span>
                  </div>
                </div>

                <span style={{ fontSize: 11, fontWeight: 800, background: 'rgba(16,185,129,0.12)', color: '#10b981', padding: '4px 10px', borderRadius: 12 }}>
                  {r.badge || '🌟 تقييم موثق'}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marqueeRightToLeft {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-wrapper:hover .marquee-track {
          animation-play-state: paused !important;
        }
      `}</style>
    </section>
  );
}
