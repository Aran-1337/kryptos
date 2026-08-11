'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Medal, Award, Flame, Star, Search, Filter, UserCheck, ArrowDown } from 'lucide-react';
import { getAcademicGrades, AcademicGrade } from '../../utils/academicGrades';

export default function StudentDashboardLeaderboardPage() {
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [activeGrades, setActiveGrades] = useState<AcademicGrade[]>([]);

  useEffect(() => {
    const loadGrades = () => {
      const all = getAcademicGrades();
      setActiveGrades(all.filter(g => g.active));
    };
    loadGrades();
    window.addEventListener('academic_grades_updated', loadGrades);
    return () => window.removeEventListener('academic_grades_updated', loadGrades);
  }, []);

  const topStudents = [
    { rank: 1, name: 'أحمد محمود العبد', grade: 'أولى ثانوي', governorate: 'القاهرة', score: '99.5%', points: 2950, badge: '🥇 المركز الأول (العبقري)', avatar: 'أ', isCurrentUser: true },
    { rank: 2, name: 'سارة خالد السيد', grade: 'ثانية ثانوي', governorate: 'الإسكندرية', score: '98.8%', points: 2820, badge: '🥈 المركز الثاني', avatar: 'س', isCurrentUser: false },
    { rank: 3, name: 'عمر طارق إبراهيم', grade: 'أولى ثانوي', governorate: 'المنصورة', score: '97.4%', points: 2710, badge: '🥉 المركز الثالث', avatar: 'ع', isCurrentUser: false },
    { rank: 4, name: 'مريم سعيد النجار', grade: 'تأسيس', governorate: 'أسيوط', score: '96.2%', points: 2540, badge: '⭐ متفوق رائع', avatar: 'م', isCurrentUser: false },
    { rank: 5, name: 'يوسف حسن علي', grade: 'ثانية ثانوي', governorate: 'الجيزة', score: '95.0%', points: 2410, badge: '⭐ متفوق رائع', avatar: 'ي', isCurrentUser: false },
    { rank: 6, name: 'نور أحمد مصطفى', grade: 'أولى ثانوي', governorate: 'طنطا', score: '94.5%', points: 2380, badge: '⭐ متفوق رائع', avatar: 'ن', isCurrentUser: false },
  ];

  const currentUser = topStudents.find(s => s.isCurrentUser);

  const filteredStudents = topStudents.filter(s => {
    if (selectedGrade === 'all') return true;
    return s.grade === selectedGrade;
  });

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* ─── 1. Logged-In Student Personal Rank Banner ─────────────────────── */}
      {currentUser && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(108,34,249,0.12) 0%, rgba(16,185,129,0.1) 100%)',
          borderRadius: 22, border: '2px solid #6C22F9', padding: '22px 28px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
          marginBottom: 28, boxShadow: '0 8px 24px rgba(108,34,249,0.15)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#fff', fontSize: 28, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(245,158,11,0.4)', flexShrink: 0 }}>
              👑
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h2 style={{ margin: 0, fontSize: 19, fontWeight: 900, color: 'var(--text-main)' }}>مرحباً بك، {currentUser.name}! 👋</h2>
                <span style={{ background: '#6C22F9', color: '#fff', fontSize: 11.5, fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>حسابك الشخصي 🌟</span>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: 'var(--text-muted)', fontWeight: 600 }}>
                موقعك الحالي في قائمة المتفوقين: <strong style={{ color: '#6C22F9', fontWeight: 900, fontSize: 15 }}>المركز #{currentUser.rank} ({currentUser.badge})</strong> — النقاط: <strong style={{ color: '#10b981', fontWeight: 900 }}>{currentUser.points} pt</strong> ({currentUser.score})
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const el = document.getElementById('my-rank-row');
              el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', border: 'none', padding: '12px 22px', borderRadius: 12, fontWeight: 800, fontSize: 13.5, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', boxShadow: '0 4px 14px rgba(108,34,249,0.3)' }}
          >
            <ArrowDown size={16} /> انتقل لموقعك في الجدول
          </button>
        </div>
      )}

      {/* Top Banner */}
      <div style={{ background: 'linear-gradient(135deg, #16133a 0%, #2d2870 50%, #1e1b5e 100%)', borderRadius: 24, padding: '32px', color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden', marginBottom: 40, boxShadow: '0 10px 30px rgba(22,19,58,0.25)' }}>
        <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 850, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 20px', borderRadius: 50, fontSize: 13, fontWeight: 800, color: '#f59e0b', marginBottom: 16 }}>
            <Crown size={16} /> لوحة شرف المنصة وتكريم المتفوقين
          </motion.div>

          <h1 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, marginBottom: 12, color: '#fff' }}>
            أوائل المنصة والمتميزين لهذا الشهر 🏆
          </h1>
          <p style={{ fontSize: 14.5, color: 'rgba(255,255,255,0.85)', maxWidth: 680, margin: '0 auto', lineHeight: 1.8, fontWeight: 600 }}>
            ⚡️ احتساب النقاط وتكريم المتفوقين يعتمد أوتوماتيكياً على 3 محاور:
            <br />
            <span style={{ color: '#f59e0b', fontWeight: 800 }}>📝 درجات الاختبارات المجدولة</span> • <span style={{ color: '#10b981', fontWeight: 800 }}>🎥 دقائق مشاهدة الفيديوهات</span> • <span style={{ color: '#a78bfa', fontWeight: 800 }}>📤 تسليم الواجبات والتطبيقات البرمجية</span>
          </p>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div style={{ margin: '-20px auto 40px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 20, alignItems: 'flex-end' }}>
          
          {/* Rank 2 (Silver) */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: topStudents[1].isCurrentUser ? 'rgba(108,34,249,0.08)' : 'var(--surface)', borderRadius: 24, padding: 24, textAlign: 'center', border: topStudents[1].isCurrentUser ? '2px solid #6C22F9' : '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #94a3b8, #cbd5e1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-40px auto 12px', fontSize: 24, fontWeight: 900, border: '4px solid var(--surface)', boxShadow: '0 4px 14px rgba(148,163,184,0.4)' }}>
              🥈
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px' }}>{topStudents[1].name}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 12px' }}>{topStudents[1].governorate} • {topStudents[1].grade}</p>
            <div style={{ background: 'var(--bg)', padding: '8px 16px', borderRadius: 12, fontSize: 14, fontWeight: 900, color: '#3b82f6', display: 'inline-block' }}>
              النسبة: {topStudents[1].score} ({topStudents[1].points} نقطة)
            </div>
          </motion.div>

          {/* Rank 1 (Gold) - Elevated & Highlighted for Current User */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: 'linear-gradient(135deg, var(--surface) 0%, rgba(245,158,11,0.08) 100%)', borderRadius: 24, padding: 32, textAlign: 'center', border: '3px solid #f59e0b', boxShadow: '0 16px 40px rgba(245,158,11,0.2)' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-55px auto 12px', fontSize: 36, fontWeight: 900, border: '4px solid var(--surface)', boxShadow: '0 6px 20px rgba(245,158,11,0.5)' }}>
              👑
            </div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
              <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 900 }}>
                🥇 المركز الأول المتميز
              </span>
              {topStudents[0].isCurrentUser && (
                <span style={{ background: '#6C22F9', color: '#fff', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 900 }}>
                  أنت 🌟
                </span>
              )}
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px' }}>{topStudents[0].name}</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', margin: '0 0 16px' }}>{topStudents[0].governorate} • {topStudents[0].grade}</p>
            <div style={{ background: '#f59e0b', color: '#fff', padding: '10px 20px', borderRadius: 14, fontSize: 16, fontWeight: 900, display: 'inline-block', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}>
              النسبة: {topStudents[0].score} ({topStudents[0].points} نقطة)
            </div>
          </motion.div>

          {/* Rank 3 (Bronze) */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ background: topStudents[2].isCurrentUser ? 'rgba(108,34,249,0.08)' : 'var(--surface)', borderRadius: 24, padding: 24, textAlign: 'center', border: topStudents[2].isCurrentUser ? '2px solid #6C22F9' : '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #b45309, #d97706)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-40px auto 12px', fontSize: 24, fontWeight: 900, border: '4px solid var(--surface)', boxShadow: '0 4px 14px rgba(180,83,9,0.4)' }}>
              🥉
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px' }}>{topStudents[2].name}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 12px' }}>{topStudents[2].governorate} • {topStudents[2].grade}</p>
            <div style={{ background: 'var(--bg)', padding: '8px 16px', borderRadius: 12, fontSize: 14, fontWeight: 900, color: '#b45309', display: 'inline-block' }}>
              النسبة: {topStudents[2].score} ({topStudents[2].points} نقطة)
            </div>
          </motion.div>

        </div>
      </div>

      {/* Main Leaderboard Table */}
      <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden' }}>
        
        {/* Dynamic Grade Filter Tabs */}
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)', display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-main)', marginLeft: 8 }}>تصفية حسب المرحلة:</span>
          
          <button
            onClick={() => setSelectedGrade('all')}
            style={{
              padding: '8px 16px', borderRadius: 10, border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif',
              background: selectedGrade === 'all' ? '#6C22F9' : 'var(--bg)',
              color: selectedGrade === 'all' ? '#fff' : 'var(--text-muted)'
            }}
          >
            جميع المراحل
          </button>

          {activeGrades.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGrade(g.name)}
              style={{
                padding: '8px 16px', borderRadius: 10, border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif',
                background: selectedGrade === g.name ? '#6C22F9' : 'var(--bg)',
                color: selectedGrade === g.name ? '#fff' : 'var(--text-muted)'
              }}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px', fontWeight: 700 }}>الترتيب</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>اسم الطالب المتفوق</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>المحافظة</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>المرحلة</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>إجمالي النقاط</th>
                <th style={{ padding: '16px', fontWeight: 700 }}>النسبة المئوية</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((st) => (
                <tr
                  key={st.rank}
                  id={st.isCurrentUser ? 'my-rank-row' : undefined}
                  style={{
                    borderBottom: '1px solid var(--border)',
                    background: st.isCurrentUser
                      ? 'linear-gradient(90deg, rgba(108,34,249,0.15) 0%, rgba(16,185,129,0.12) 100%)'
                      : st.rank === 1 ? 'rgba(245,158,11,0.06)' : 'transparent',
                    borderRight: st.isCurrentUser ? '4px solid #6C22F9' : 'none'
                  }}
                >
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      width: 34, height: 34, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14,
                      background: st.isCurrentUser ? '#6C22F9' : st.rank === 1 ? '#fef3c7' : st.rank === 2 ? 'var(--bg)' : st.rank === 3 ? '#ffedd5' : 'var(--bg)',
                      color: st.isCurrentUser ? '#fff' : st.rank === 1 ? '#b45309' : st.rank === 2 ? 'var(--text-main)' : st.rank === 3 ? '#c2410c' : 'var(--text-muted)',
                      boxShadow: st.isCurrentUser ? '0 4px 10px rgba(108,34,249,0.3)' : 'none'
                    }}>
                      #{st.rank}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 38, height: 38, borderRadius: '50%', background: st.isCurrentUser ? '#6C22F9' : 'rgba(108,34,249,0.12)', color: st.isCurrentUser ? '#fff' : '#6C22F9', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
                        {st.avatar}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontWeight: st.isCurrentUser ? 900 : 800 }}>{st.name}</span>
                          {st.isCurrentUser && (
                            <span style={{ background: '#6C22F9', color: '#fff', padding: '2px 8px', borderRadius: 6, fontSize: 11, fontWeight: 900 }}>
                              أنت (حسابك الشخصي) 🌟
                            </span>
                          )}
                        </div>
                        <span style={{ display: 'block', fontSize: 11, color: st.isCurrentUser ? '#6C22F9' : '#10b981', fontWeight: 800 }}>{st.badge}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>{st.governorate}</td>
                  <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>{st.grade}</td>
                  <td style={{ padding: '16px', fontSize: 14, fontWeight: 900, color: '#6C22F9' }}>{st.points} pt</td>
                  <td style={{ padding: '16px', fontSize: 14, fontWeight: 900, color: '#10b981' }}>{st.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
}
