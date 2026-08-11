'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { PlayCircle, Trophy, BookOpen, Clock, ChevronLeft } from 'lucide-react';

export default function DashboardOverview() {
  const stats = [
    { label: 'الكورسات المشترك بها', value: '3', icon: <BookOpen color="#3b82f6" />, bg: 'rgba(59,130,246,0.15)' },
    { label: 'ساعات التعلم', value: '14.5', icon: <Clock color="#8b5cf6" />, bg: 'rgba(139,92,246,0.15)' },
    { label: 'الشهادات المكتسبة', value: '1', icon: <Trophy color="#f59e0b" />, bg: 'rgba(245,158,11,0.15)' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(15,10,50,1) 0%, rgba(108,34,249,1) 100%)',
          borderRadius: 24, padding: '40px', color: '#fff', position: 'relative', overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(108,34,249,0.2)'
        }}
      >
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h1 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 900, marginBottom: 12, color: '#fff' }}>أهلاً بك يا بطل في عالم البرمجة! 🚀</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', maxWidth: 500, lineHeight: 1.6, marginBottom: 24 }}>
            استمر في تفوقك! لقد أكملت 60% من هدفك الأسبوعي. واصل التعلم لتحقيق المزيد من النقاط والشهادات.
          </p>
          <Link href="/dashboard/courses" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', color: '#6C22F9',
            padding: '12px 24px', borderRadius: 12, fontWeight: 800, textDecoration: 'none',
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
          }}>
            استئناف التعلم
          </Link>
        </div>
        
        {/* Decorations */}
        <div style={{ position: 'absolute', top: -50, left: -50, width: 200, height: 200, background: 'rgba(255,255,255,0.1)', borderRadius: '50%', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: -50, right: 50, width: 150, height: 150, background: 'rgba(255,255,255,0.05)', borderRadius: '50%', filter: 'blur(30px)' }} />
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{
              background: 'var(--surface)', padding: 24, borderRadius: 20, display: 'flex', alignItems: 'center', gap: 20,
              boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)'
            }}
          >
            <div style={{ width: 64, height: 64, borderRadius: 16, background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4 }}>{stat.label}</p>
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: 'var(--text-main)' }}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Continue Learning & Upcoming Live */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 400px), 1fr))', gap: 32 }}>
        
        {/* Continue Learning */}
        <div style={{ background: 'var(--surface)', borderRadius: 24, padding: 28, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>أكمل التعلم</h3>
            <Link href="/dashboard/courses" style={{ color: '#6C22F9', fontSize: 14, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              عرض الكل <ChevronLeft size={16} />
            </Link>
          </div>

          <div style={{ background: 'var(--bg)', borderRadius: 16, padding: 16, display: 'flex', gap: 16, alignItems: 'center', border: '1px solid var(--border)' }}>
            <div style={{ position: 'relative', width: 90, height: 60, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
              <Image src="/a1.webp" alt="Course" fill style={{ objectFit: 'cover' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PlayCircle color="#fff" size={24} />
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: 'var(--text-main)', marginBottom: 4 }}>كورس أولى ثانوي - الترم الأول</h4>
              <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>الدرس الثالث: الخوارزميات (Algorithms)</p>
              
              {/* Progress bar */}
              <div style={{ width: '100%', height: 6, background: 'rgba(0,0,0,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: '45%', height: '100%', background: '#6C22F9' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Lessons */}
        <div style={{ background: 'var(--surface)', borderRadius: 24, padding: 28, boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: '0 0 20px' }}>الحصص القادمة</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2].map((item) => (
              <div key={item} style={{ display: 'flex', gap: 16, alignItems: 'center', paddingBottom: 16, borderBottom: item === 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(59,130,246,0.15)', color: '#3b82f6', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontWeight: 700 }}>أكتوبر</span>
                  <span style={{ fontSize: 16, fontWeight: 900 }}>12</span>
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text-main)', marginBottom: 2 }}>بث مباشر: مراجعة الخوارزميات</h4>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>🕒 7:00 مساءً - 9:00 مساءً</p>
                </div>
                <Link href="/live" style={{ fontSize: 12, fontWeight: 800, color: '#6C22F9', textDecoration: 'none', background: 'rgba(108,34,249,0.1)', padding: '6px 12px', borderRadius: 8 }}>
                  الدخول للغرفة
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
