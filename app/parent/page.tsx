'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Users, Shield, Award, CheckCircle2, AlertTriangle, BookOpen, Clock, Phone, MessageSquare, ExternalLink } from 'lucide-react';

export default function ParentDashboardPage() {
  const [studentCode, setStudentCode] = useState('STUDENT-9842');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const studentData = {
    name: 'أحمد محمود العبد',
    grade: 'الصف الأول الثانوي',
    phone: '01012345678',
    parentPhone: '01298765432',
    coursesEnrolled: 2,
    completionPercentage: 82,
    attendanceStatus: 'ملتزم جداً (حضور 95%)',
    exams: [
      { id: 1, title: 'امتحان الشامل في الخوارزميات', score: '19 / 20', percentage: '95%', status: 'ممتاز ✅', tabSwitchCount: 0 },
      { id: 2, title: 'اختبار قصير: أساسيات بايثون', score: '09 / 10', percentage: '90%', status: 'ممتاز ✅', tabSwitchCount: 0 },
    ],
    recentActivity: [
      { id: 101, title: 'شاهد درس: المتغيرات وأنواع البيانات', date: 'اليوم الساعة 04:30 مساءً', duration: '35 دقيقة' },
      { id: 102, title: 'حل امتحان الخوارزميات الشامل', date: 'أمس الساعة 08:15 مساءً', duration: '22 دقيقة' },
    ]
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Header */}
      <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Image src="/Logo-cropped.png" alt="Logo" width={160} height={36} style={{ objectFit: 'contain' }} />
          <span style={{ background: '#f5f3ff', color: '#6C22F9', border: '1px solid #ddd6fe', padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 800 }}>
            بوابة متابعة ولي الأمر 👨‍👩‍👦
          </span>
        </div>
        <a 
          href={`https://wa.me/201012345678?text=${encodeURIComponent('السلام عليكم، أنا ولي أمر الطالب أحمد محمود وحابب أستفسر عن المتابعة')}`} 
          target="_blank" 
          rel="noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#25D366', color: '#fff', padding: '10px 20px', borderRadius: 10, fontWeight: 800, textDecoration: 'none', fontSize: 14, boxShadow: '0 4px 12px rgba(37,211,102,0.3)' }}
        >
          <MessageSquare size={16} /> تواصل مع المحاضر عبر الواتساب
        </a>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: 1100, margin: '36px auto', padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 28 }}>
        
        {/* Student Summary Card */}
        <div style={{ background: 'linear-gradient(135deg, #16133a 0%, #2d2870 100%)', borderRadius: 24, padding: 32, color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24, boxShadow: '0 16px 40px rgba(22,19,58,0.25)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'linear-gradient(135deg, #6C22F9, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900 }}>
              أ
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 900 }}>تقرير الطالب: {studentData.name}</h1>
                <span style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', padding: '2px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700 }}>
                  {studentData.grade}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                رقم الطالب: {studentData.phone} | كود المتابعة: {studentCode}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 20 }}>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '14px 20px', borderRadius: 16, textAlign: 'center', minWidth: 120 }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>نسبة إنجاز المنهج</p>
              <h3 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#38bdf8' }}>{studentData.completionPercentage}%</h3>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '14px 20px', borderRadius: 16, textAlign: 'center', minWidth: 120 }}>
              <p style={{ margin: '0 0 4px', fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>حالة الالتزام</p>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 900, color: '#4ade80' }}>ممتاز 🌟</h3>
            </div>
          </div>
        </div>

        {/* Exams & Cheating Log */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 18, fontWeight: 900, color: '#16133a', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Award size={20} color="#6C22F9" /> درجات الامتحانات والانضباط
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ background: '#f8fafc', color: '#64748b', fontSize: 13, borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '14px', fontWeight: 700 }}>عنوان الامتحان</th>
                  <th style={{ padding: '14px', fontWeight: 700 }}>درجة الطالب</th>
                  <th style={{ padding: '14px', fontWeight: 700 }}>النسبة المئوية</th>
                  <th style={{ padding: '14px', fontWeight: 700 }}>إنذارات مغادرة الشاشة (الغش)</th>
                  <th style={{ padding: '14px', fontWeight: 700 }}>التقييم العام</th>
                </tr>
              </thead>
              <tbody>
                {studentData.exams.map(exam => (
                  <tr key={exam.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px', fontSize: 14, fontWeight: 800, color: '#16133a' }}>{exam.title}</td>
                    <td style={{ padding: '14px', fontSize: 14, fontWeight: 900, color: '#6C22F9' }}>{exam.score}</td>
                    <td style={{ padding: '14px', fontSize: 13, fontWeight: 700, color: '#10b981' }}>{exam.percentage}</td>
                    <td style={{ padding: '14px' }}>
                      <span style={{ background: '#ecfdf5', color: '#10b981', padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <CheckCircle2 size={14} /> 0 إنذارات (التزام تام)
                      </span>
                    </td>
                    <td style={{ padding: '14px', fontSize: 13, fontWeight: 800, color: '#10b981' }}>{exam.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Attendance & Recent Activity */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid #e2e8f0', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#16133a', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={20} color="#6C22F9" /> سجل حضور وحركات الطالب الأخيرة
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {studentData.recentActivity.map(act => (
              <div key={act.id} style={{ padding: 16, borderRadius: 14, background: '#f8fafc', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 2px', fontSize: 14, fontWeight: 800, color: '#16133a' }}>{act.title}</h4>
                    <p style={{ margin: 0, fontSize: 12, color: '#64748b', fontWeight: 600 }}>{act.date}</p>
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#6C22F9', background: '#f5f3ff', padding: '4px 10px', borderRadius: 8 }}>
                  ⏱️ {act.duration}
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
}
