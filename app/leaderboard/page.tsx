'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Crown, Medal, Award, Flame, Star, Search, Filter, ArrowRight } from 'lucide-react';

import { getAcademicGrades, AcademicGrade } from '../utils/academicGrades';

export default function LeaderboardPage() {
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
    { rank: 1, name: 'أحمد محمود العبد', grade: 'أولى ثانوي', governorate: 'القاهرة', score: '99.5%', points: 2950, badge: '🥇 المركز الأول (العبقري)', avatar: 'أ' },
    { rank: 2, name: 'سارة خالد السيد', grade: 'ثانية ثانوي', governorate: 'الإسكندرية', score: '98.8%', points: 2820, badge: '🥈 المركز الثاني', avatar: 'س' },
    { rank: 3, name: 'عمر طارق إبراهيم', grade: 'أولى ثانوي', governorate: 'المنصورة', score: '97.4%', points: 2710, badge: '🥉 المركز الثالث', avatar: 'ع' },
    { rank: 4, name: 'مريم سعيد النجار', grade: 'تأسيس', governorate: 'أسيوط', score: '96.2%', points: 2540, badge: '⭐ متفوق رائع', avatar: 'م' },
    { rank: 5, name: 'يوسف حسن علي', grade: 'ثانية ثانوي', governorate: 'الجيزة', score: '95.0%', points: 2410, badge: '⭐ متفوق رائع', avatar: 'ي' },
    { rank: 6, name: 'نور أحمد مصطفى', grade: 'أولى ثانوي', governorate: 'طنطا', score: '94.5%', points: 2380, badge: '⭐ متفوق رائع', avatar: 'ن' },
  ];

  const filteredStudents = topStudents.filter(s => {
    if (selectedGrade === 'all') return true;
    return s.grade === selectedGrade;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Hero Header */}
      <section style={{ background: 'linear-gradient(135deg, #16133a 0%, #2d2870 50%, #1e1b5e 100%)', padding: '60px 20px', color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 850, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 20px', borderRadius: 50, fontSize: 13, fontWeight: 800, color: '#f59e0b', marginBottom: 16 }}>
            <Crown size={16} /> لوحة شرف المنصة وتكريم المتفوقين
          </motion.div>

          <h1 style={{ fontSize: 'clamp(26px, 4vw, 42px)', fontWeight: 900, marginBottom: 16, letterSpacing: '-0.5px' }}>
            أوائل المنصة والمتميزين لهذا الشهر 🏆
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
            يتم ترتيب الطلاب أوتوماتيكياً بناءً على درجات الامتحانات الشهرية، الانضباط في المشاهدة، والتفاعل في حل التدريبات.
          </p>
        </div>
      </section>

      {/* Top 3 Podium (المنصة الثلاثية) */}
      <div style={{ maxWidth: 1000, margin: '-40px auto 40px', padding: '0 20px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 20, alignItems: 'flex-end' }}>
          
          {/* Rank 2 (Silver) */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: '#fff', borderRadius: 24, padding: 24, textAlign: 'center', border: '2px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #94a3b8, #cbd5e1)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-40px auto 12px', fontSize: 24, fontWeight: 900, border: '4px solid #fff', boxShadow: '0 4px 14px rgba(148,163,184,0.4)' }}>
              🥈
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: '#16133a', margin: '0 0 4px' }}>{topStudents[1].name}</h3>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 12px' }}>{topStudents[1].governorate} • {topStudents[1].grade}</p>
            <div style={{ background: '#f8fafc', padding: '8px 16px', borderRadius: 12, fontSize: 14, fontWeight: 900, color: '#3b82f6', display: 'inline-block' }}>
              النسبة: {topStudents[1].score} ({topStudents[1].points} نقطة)
            </div>
          </motion.div>

          {/* Rank 1 (Gold) - Elevated */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ background: 'linear-gradient(135deg, #fff 0%, #fffbeb 100%)', borderRadius: 24, padding: 32, textAlign: 'center', border: '3px solid #f59e0b', boxShadow: '0 16px 40px rgba(245,158,11,0.2)', transform: 'scale(1.05)' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #fbbf24)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-55px auto 12px', fontSize: 36, fontWeight: 900, border: '4px solid #fff', boxShadow: '0 6px 20px rgba(245,158,11,0.5)' }}>
              👑
            </div>
            <span style={{ background: '#fef3c7', color: '#b45309', padding: '4px 14px', borderRadius: 20, fontSize: 12, fontWeight: 900, display: 'inline-block', marginBottom: 8 }}>
              🥇 المركز الأول المتميز
            </span>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#16133a', margin: '0 0 4px' }}>{topStudents[0].name}</h3>
            <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 16px' }}>{topStudents[0].governorate} • {topStudents[0].grade}</p>
            <div style={{ background: '#f59e0b', color: '#fff', padding: '10px 20px', borderRadius: 14, fontSize: 16, fontWeight: 900, display: 'inline-block', boxShadow: '0 4px 14px rgba(245,158,11,0.3)' }}>
              النسبة: {topStudents[0].score} ({topStudents[0].points} نقطة)
            </div>
          </motion.div>

          {/* Rank 3 (Bronze) */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ background: '#fff', borderRadius: 24, padding: 24, textAlign: 'center', border: '2px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #b45309, #d97706)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-40px auto 12px', fontSize: 24, fontWeight: 900, border: '4px solid #fff', boxShadow: '0 4px 14px rgba(180,83,9,0.4)' }}>
              🥉
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 900, color: '#16133a', margin: '0 0 4px' }}>{topStudents[2].name}</h3>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 12px' }}>{topStudents[2].governorate} • {topStudents[2].grade}</p>
            <div style={{ background: '#f8fafc', padding: '8px 16px', borderRadius: 12, fontSize: 14, fontWeight: 900, color: '#b45309', display: 'inline-block' }}>
              النسبة: {topStudents[2].score} ({topStudents[2].points} نقطة)
            </div>
          </motion.div>

        </div>
      </div>

      {/* Main Leaderboard Table */}
      <main style={{ maxWidth: 1000, margin: '0 auto 60px', padding: '0 20px' }}>
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
          
          {/* Grade Filter Tabs */}
          <div style={{ padding: 20, borderBottom: '1px solid #e2e8f0', display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: '#16133a', marginLeft: 8 }}>تصفية حسب المرحلة:</span>
            
            <button onClick={() => setSelectedGrade('all')} style={{ padding: '8px 16px', borderRadius: 10, border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer', background: selectedGrade === 'all' ? '#6C22F9' : '#f8fafc', color: selectedGrade === 'all' ? '#fff' : '#475569' }}>
              جميع المراحل
            </button>

            {activeGrades.map(g => (
              <button
                key={g.id}
                onClick={() => setSelectedGrade(g.name)}
                style={{
                  padding: '8px 16px', borderRadius: 10, border: 'none', fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif',
                  background: selectedGrade === g.name ? '#6C22F9' : '#f8fafc',
                  color: selectedGrade === g.name ? '#fff' : '#475569'
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
                <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>
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
                  <tr key={st.rank} style={{ borderBottom: '1px solid #f1f5f9', background: st.rank === 1 ? '#fffdf5' : '#fff' }}>
                    <td style={{ padding: '16px' }}>
                      <span style={{ 
                        width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14,
                        background: st.rank === 1 ? '#fef3c7' : st.rank === 2 ? '#e2e8f0' : st.rank === 3 ? '#ffedd5' : '#f1f5f9',
                        color: st.rank === 1 ? '#b45309' : st.rank === 2 ? '#475569' : st.rank === 3 ? '#c2410c' : '#64748b'
                      }}>
                        #{st.rank}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontSize: 14, fontWeight: 800, color: '#16133a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f5f3ff', color: '#6C22F9', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>
                          {st.avatar}
                        </div>
                        <div>
                          <span>{st.name}</span>
                          <span style={{ display: 'block', fontSize: 11, color: '#10b981', fontWeight: 700 }}>{st.badge}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '16px', fontSize: 13, color: '#475569' }}>{st.governorate}</td>
                    <td style={{ padding: '16px', fontSize: 13, color: '#475569' }}>{st.grade}</td>
                    <td style={{ padding: '16px', fontSize: 14, fontWeight: 900, color: '#6C22F9' }}>{st.points} pt</td>
                    <td style={{ padding: '16px', fontSize: 14, fontWeight: 900, color: '#10b981' }}>{st.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </main>

    </div>
  );
}
