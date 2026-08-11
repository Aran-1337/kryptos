'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BarChart3, TrendingUp, Award, Clock, FileCheck2, CheckCircle2, Download, Share2, Sparkles, AlertCircle, Calendar } from 'lucide-react';

export default function WeeklyReportPage() {
  // Automated analysis based on student performance
  const examScore = 96;
  const cheatingWarnings = 0;
  const attendanceRate = 100;
  const weakTopics = ['تطبيقات Loops التكرارية في بايثون'];

  // Automatically computed fallback instructor note
  const autoInstructorNote = `أحمد من الطلاب المتميزين جداً هذا الأسبوع بأداء ممتاز (${examScore}%). التزامه بمشاهدة الحصص بنسبة ${attendanceRate}% وحل الامتحانات بدون إنذارات يعكس تفوقه وحصوله على المركز الأول. يُوصى بالتركيز على ${weakTopics.join(' و ')} للحفاظ على النتيجة النهائية.`;

  const [instructorNote, setInstructorNote] = useState(autoInstructorNote);

  useEffect(() => {
    const loadNote = () => {
      try {
        const saved = localStorage.getItem('student_teacher_notes');
        if (saved) {
          const parsed = JSON.parse(saved);
          const data = parsed['1'];
          if (data && typeof data === 'object' && data.note && data.note.trim()) {
            setInstructorNote(data.note);
          } else if (typeof data === 'string' && data.trim()) {
            setInstructorNote(data);
          }
        }
      } catch {}
    };
    loadNote();
    window.addEventListener('teacher_notes_updated', loadNote);
    return () => window.removeEventListener('teacher_notes_updated', loadNote);
  }, [autoInstructorNote]);

  const report = {
    studentName: 'أحمد محمود العبد',
    grade: 'أولى ثانوي (دفعة 2026/2027)',
    weekPeriod: 'الأسبوع الأول من أغسطس (01 - 06 أغسطس 2026)',
    overallScore: '94%',
    scoreStatus: 'ممتاز مرتفع 🌟',
    weeklyHours: '14.5 ساعة',
    completedLessons: '12 درس عملي',
    examsTaken: '2 امتحان أسبوعي',
    avgExamScore: `${examScore}%`,
    attendanceRate: `${attendanceRate}%`,
    weeklyComparison: '+12% تحسن عن الأسبوع الماضي',
    strengths: [
      'التفكير المنطقي في الخوارزميات',
      `سرعة حل امتحانات الخوارزميات (${cheatingWarnings} إنذارات غش)`,
      'الانضباط في مواعيد المشاهدة'
    ],
    improvementAreas: [
      `التركيز على ${weakTopics[0]}`
    ],
    instructorNotes: instructorNote
  };

  const dailyStudyHours = [
    { day: 'السبت', hours: 2.5, percent: 80 },
    { day: 'الأحد', hours: 3.0, percent: 100 },
    { day: 'الإثنين', hours: 2.0, percent: 65 },
    { day: 'الثلاثاء', hours: 3.5, percent: 100 },
    { day: 'الأربعاء', hours: 2.0, percent: 65 },
    { day: 'الخميس', hours: 1.5, percent: 50 },
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', fontFamily: 'Tajawal, sans-serif', direction: 'rtl', paddingBottom: 60 }}>
      
      {/* Top Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 6px' }}>تقرير الأداء والتقدم الأسبوعي 📊</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>ملخص تقييم الطالب، عدد ساعات المذاكرة، نتائج الامتحانات، وتوصيات المدرس.</p>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={handlePrint}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#6C22F9', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 12, fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,34,249,0.3)', fontFamily: 'Tajawal, sans-serif' }}
          >
            <Download size={16} /> طباعة التقرير PDF
          </button>
        </div>
      </div>

      {/* Main Report Card Container */}
      <div style={{ background: 'var(--surface)', borderRadius: 24, border: '1px solid var(--border)', boxShadow: '0 8px 30px rgba(0,0,0,0.04)', padding: '36px', position: 'relative', overflow: 'hidden' }}>
        
        {/* Header Ribbon */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, borderBottom: '1px solid var(--border)', paddingBottom: 24, marginBottom: 28 }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(108,34,249,0.12)', color: '#6C22F9', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 900, marginBottom: 10 }}>
              <Calendar size={14} /> {report.weekPeriod}
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px' }}>تقرير الطالب: {report.studentName}</h2>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: 0 }}>المرحلة: {report.grade}</p>
          </div>

          <div style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.08))', border: '1px solid rgba(16,185,129,0.3)', padding: '16px 24px', borderRadius: 20, textAlign: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: '#10b981', display: 'block', marginBottom: 2 }}>التقييم الإجمالي للأسبوع</span>
            <strong style={{ fontSize: 28, fontWeight: 900, color: '#10b981' }}>{report.overallScore}</strong>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', fontWeight: 700, marginTop: 2 }}>{report.scoreStatus}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{ background: 'var(--bg)', padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
              <Clock size={16} color="#6C22F9" /> ساعات المذاكرة
            </div>
            <strong style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)' }}>{report.weeklyHours}</strong>
            <span style={{ fontSize: 11, color: '#10b981', display: 'block', marginTop: 4, fontWeight: 800 }}>{report.weeklyComparison}</span>
          </div>

          <div style={{ background: 'var(--bg)', padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
              <FileCheck2 size={16} color="#10b981" /> الدروس المنجزة
            </div>
            <strong style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)' }}>{report.completedLessons}</strong>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 4, fontWeight: 700 }}>نسبة الحضور: {report.attendanceRate}</span>
          </div>

          <div style={{ background: 'var(--bg)', padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
              <Award size={16} color="#f59e0b" /> متوسط الامتحانات
            </div>
            <strong style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)' }}>{report.avgExamScore}</strong>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginTop: 4, fontWeight: 700 }}>{report.examsTaken}</span>
          </div>

          <div style={{ background: 'var(--bg)', padding: 20, borderRadius: 16, border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
              <CheckCircle2 size={16} color="#3b82f6" /> نسبة الحضور والالتزام
            </div>
            <strong style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)' }}>100%</strong>
            <span style={{ fontSize: 11, color: '#10b981', display: 'block', marginTop: 4, fontWeight: 800 }}>0 أيام غياب أسبوعي 🛡️</span>
          </div>
        </div>

        {/* Daily Study Hours Chart */}
        <div style={{ marginBottom: 32, background: 'var(--bg)', borderRadius: 20, border: '1px solid var(--border)', padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <BarChart3 size={18} color="#6C22F9" /> توزيع ساعات المذاكرة اليومية هذا الأسبوع
          </h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, height: 160, padding: '0 10px' }}>
            {dailyStudyHours.map((item, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, height: '100%', justifyContent: 'flex-end' }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-main)' }}>{item.hours}س</span>
                <div style={{ width: '100%', maxWidth: 36, height: `${item.percent}%`, background: 'linear-gradient(to top, #6C22F9, #a78bfa)', borderRadius: 8, minHeight: 12 }} />
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Recommendations Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginBottom: 28 }}>
          
          {/* Strengths */}
          <div style={{ background: 'rgba(16,185,129,0.06)', borderRadius: 20, border: '1px solid rgba(16,185,129,0.2)', padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#10b981', fontWeight: 900, fontSize: 15, marginBottom: 14 }}>
              <Sparkles size={18} /> نقاط القوة والتميز البرمجي
            </div>
            <ul style={{ margin: 0, paddingRight: 18, fontSize: 13.5, color: 'var(--text-main)', lineHeight: 1.8 }}>
              {report.strengths.map((item, idx) => (
                <li key={idx} style={{ marginBottom: 6 }}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div style={{ background: 'rgba(245,158,11,0.06)', borderRadius: 20, border: '1px solid rgba(245,158,11,0.2)', padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#d97706', fontWeight: 900, fontSize: 15, marginBottom: 14 }}>
              <AlertCircle size={18} /> التوصيات للتحسين
            </div>
            <ul style={{ margin: 0, paddingRight: 18, fontSize: 13.5, color: 'var(--text-main)', lineHeight: 1.8 }}>
              {report.improvementAreas.map((item, idx) => (
                <li key={idx} style={{ marginBottom: 6 }}>{item}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* Auto-Generated Instructor Guidance Box (matching screenshot) */}
        <div style={{ background: 'rgba(108,34,249,0.08)', border: '1.5px solid rgba(108,34,249,0.25)', padding: 24, borderRadius: 20 }}>
          <h4 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 900, color: '#6C22F9' }}>توجيه وملاحظة المهندس عبدالرحمن حامد:</h4>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--text-main)', lineHeight: 1.7, fontWeight: 600 }}>
            "{report.instructorNotes}"
          </p>
        </div>

      </div>
    </div>
  );
}
