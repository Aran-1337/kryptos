'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, BookOpen, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, Download, Sparkles, Activity, Video, Calendar, Clock, Plus, X, Radio, Bell } from 'lucide-react';
import Link from 'next/link';

import { generateExecutiveReport } from '../utils/generateExecutiveReport';

export default function AdminDashboardPage() {
  const stats = [
    { title: 'إجمالي الطلاب', value: '1,250', trend: '+12%', isUp: true, icon: <Users size={22} color="#6C22F9" />, bg: 'rgba(108,34,249,0.12)', border: 'rgba(108,34,249,0.2)' },
    { title: 'الكورسات النشطة', value: '14', trend: '+2', isUp: true, icon: <BookOpen size={22} color="#10b981" />, bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.2)' },
    { title: 'إجمالي المبيعات', value: '45,200 ج.م', trend: '+18%', isUp: true, icon: <CreditCard size={22} color="#3b82f6" />, bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.2)' },
    { title: 'معدل الإكمال', value: '68%', trend: '-2%', isUp: false, icon: <TrendingUp size={22} color="#f59e0b" />, bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.2)' },
  ];

  const recentStudents = [
    { id: 1, name: 'أحمد محمود', course: 'كورس أولى ثانوي - الترم الأول', date: 'منذ ساعتين', status: 'نشط' },
    { id: 2, name: 'سارة خالد', course: 'الكورس التأسيسي في البرمجة', date: 'منذ 5 ساعات', status: 'نشط' },
    { id: 3, name: 'عمر طارق', course: 'كورس ثانية ثانوي - الترم الأول', date: 'أمس', status: 'غير مكتمل' },
    { id: 4, name: 'مريم سعيد', course: 'كورس أولى ثانوي - الترم الأول', date: 'أمس', status: 'نشط' },
  ];

  // Live Sessions State
  const [liveSessions, setLiveSessions] = useState([
    { id: 1, title: 'مراجعة الخوارزميات والتطبيقات البرمجية', grade: 'الصف الأول الثانوي', dateStr: 'اليوم', timeStr: '8:00 مساءً', status: '🔴 بث حي قريباً', instructor: 'المهندس عبدالرحمن حامد' },
    { id: 2, title: 'ورشة العمل التطبيقية لبناء واجهات React', grade: 'الصف الثاني الثانوي', dateStr: 'غداً', timeStr: '6:00 مساءً', status: '⏳ ميعاد مجدول', instructor: 'المهندس عبدالرحمن حامد' },
    { id: 3, title: 'جلسة الإجابة عن استفسارات الطلاب والتطبيقات', grade: 'تأسيس البرمجة', dateStr: 'الخميس القادم', timeStr: '7:30 مساءً', status: '📅 ميعاد مجدول', instructor: 'المهندس عبدالرحمن حامد' },
  ]);

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Schedule Modal Form
  const [newTitle, setNewTitle] = useState('');
  const [newGrade, setNewGrade] = useState('الصف الأول الثانوي');
  const [newDate, setNewDate] = useState('غداً');
  const [newTime, setNewTime] = useState('8:00 مساءً');

  const handleAddLiveSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newS = {
      id: Date.now(),
      title: newTitle,
      grade: newGrade,
      dateStr: newDate,
      timeStr: newTime,
      status: '⏳ ميعاد مجدول',
      instructor: 'المهندس عبدالرحمن حامد'
    };

    setLiveSessions([newS, ...liveSessions]);
    setShowScheduleModal(false);
    setNewTitle('');
    setToastMsg('✅ تم جدولة وإرسال تذكير الحصة البث المباشر للطلاب بنجاح!');
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleDownloadReport = () => {
    setIsExporting(true);
    setToastMsg('جاري تجهيز وتوليد التقرير التنفيذي...');

    setTimeout(() => {
      generateExecutiveReport({
        reportTitle: 'تقرير ملخص الأداء والإحصائيات العامة للمنصة',
        subtitle: 'بيانات الطلاب المسجلين والكورسات والأداء المالي',
        stats: stats.map(s => ({ title: s.title, value: s.value, trend: s.trend })),
        tables: [
          {
            title: 'أحدث سجلات الطلاب والكورسات المشترك بها',
            columns: ['اسم الطالب', 'الكورس المسجل', 'الوقت', 'حالة الحساب'],
            rows: recentStudents.map(st => [st.name, st.course, st.date, st.status])
          },
          {
            title: 'جدول مواعيد الحصص والبث المباشر القادمة',
            columns: ['عنوان الحصة', 'المرحلة الدراسية', 'اليوم والتوقيت', 'المحاضر'],
            rows: liveSessions.map(ls => [ls.title, ls.grade, `${ls.dateStr} - ${ls.timeStr}`, ls.instructor])
          }
        ]
      });

      setIsExporting(false);
      setToastMsg('✅ تم توليد فتح التقرير للطباعة والتنزيل بنجاح!');
      setTimeout(() => setToastMsg(''), 3000);
    }, 400);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--surface)', color: 'var(--text-main)', padding: '12px 24px', borderRadius: 12,
            fontWeight: 800, zIndex: 9999, boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            border: '1px solid var(--border)', fontFamily: 'Tajawal, sans-serif'
          }}
        >
          {toastMsg}
        </motion.div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: 'var(--text-main)', marginBottom: 6 }}>
            نظرة عامة 📊
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
            مرحباً بك في لوحة الإدارة. إليك ملخص أداء المنصة والتسجيلات وتذكيرات البث اليوم.
          </p>
        </div>
        <button
          onClick={handleDownloadReport}
          disabled={isExporting}
          style={{
            background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none',
            padding: '11px 24px', borderRadius: 12, fontWeight: 800,
            fontSize: 14, cursor: isExporting ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 20px rgba(108,34,249,0.3)', fontFamily: 'Tajawal, sans-serif',
            display: 'flex', alignItems: 'center', gap: 8, opacity: isExporting ? 0.7 : 1
          }}
        >
          <Download size={16} /> {isExporting ? 'جاري التحميل...' : 'تحميل التقرير'}
        </button>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            style={{
              background: 'var(--surface)', padding: 22, borderRadius: 20,
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: stat.bg, border: `1px solid ${stat.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: stat.isUp ? '#22c55e' : '#ef4444', fontSize: 12, fontWeight: 800, background: stat.isUp ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', padding: '4px 10px', borderRadius: 20 }}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {stat.trend}
              </div>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', fontWeight: 700, marginBottom: 4 }}>{stat.title}</p>
              <h3 style={{ margin: 0, fontSize: 24, fontWeight: 900, color: 'var(--text-main)' }}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      {/* NEW SECTION: Upcoming Live Stream & Online Class Reminders */}
      <div style={{ background: 'var(--surface)', borderRadius: 24, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(239,68,68,0.12)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Radio size={22} className="animate-pulse" />
            </div>
            <div>
              <h3 style={{ margin: '0 0 2px', fontSize: 18, fontWeight: 900, color: 'var(--text-main)' }}>تذكير بمواعيد البث المباشر والحصص الأونلاين القادمة 🎥📅</h3>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>جدول الحصص التفاعلية الحية القادمة مع الطلاب إشعارات التنبيه التلقائية.</p>
            </div>
          </div>

          <button
            onClick={() => setShowScheduleModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: 10, fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', boxShadow: '0 4px 12px rgba(108,34,249,0.25)' }}
          >
            <Plus size={16} /> جدولة حصة/بث جديد
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {liveSessions.map((session) => (
            <div key={session.id} style={{ background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--border)', padding: 18, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <span style={{ fontSize: 12, fontWeight: 900, background: 'rgba(108,34,249,0.12)', color: '#6C22F9', padding: '4px 10px', borderRadius: 20 }}>
                  {session.grade}
                </span>
                <span style={{ fontSize: 12, fontWeight: 800, color: session.status.includes('بث حي') ? '#ef4444' : '#10b981', background: session.status.includes('بث حي') ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)', padding: '4px 10px', borderRadius: 20 }}>
                  {session.status}
                </span>
              </div>

              <h4 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 900, color: 'var(--text-main)', lineHeight: 1.5 }}>
                {session.title}
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 12.5, color: 'var(--text-muted)', marginBottom: 16, fontWeight: 700 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={14} color="#6C22F9" /> {session.dateStr}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Clock size={14} color="#6C22F9" /> {session.timeStr}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>{session.instructor}</span>
                <Link
                  href="/admin/live"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: session.status.includes('بث حي') ? '#ef4444' : '#6C22F9', color: '#fff', textDecoration: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800 }}
                >
                  <Video size={13} /> {session.status.includes('بث حي') ? 'الانضمام الآن 🚀' : 'غرفة البث 🎥'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tables & Quick Actions Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24 }}>
        
        {/* Recent Registrations Table */}
        <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-main)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={20} color="#6C22F9" /> أحدث التسجيلات
          </h3>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 13 }}>
                  <th style={{ padding: '0 0 12px 12px', fontWeight: 700 }}>الطالب</th>
                  <th style={{ padding: '0 12px 12px', fontWeight: 700 }}>الكورس</th>
                  <th style={{ padding: '0 12px 12px', fontWeight: 700 }}>الوقت</th>
                  <th style={{ padding: '0 12px 12px', fontWeight: 700 }}>الحالة</th>
                </tr>
              </thead>
              <tbody>
                {recentStudents.map((student, i) => (
                  <tr key={i} style={{ borderBottom: i !== recentStudents.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '14px 0 14px 12px', fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>{student.name}</td>
                    <td style={{ padding: '14px 12px', fontSize: 13, color: 'var(--text-muted)' }}>{student.course}</td>
                    <td style={{ padding: '14px 12px', fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{student.date}</td>
                    <td style={{ padding: '14px 12px' }}>
                      <span style={{ 
                        background: student.status === 'نشط' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                        color: student.status === 'نشط' ? '#22c55e' : '#ef4444',
                        padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800
                      }}>
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ background: 'var(--surface)', borderRadius: 20, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 17, fontWeight: 900, color: 'var(--text-main)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={20} color="#6C22F9" /> إجراءات سريعة
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Link
              href="/admin/cms"
              style={{
                display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '16px',
                background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14,
                cursor: 'pointer', textAlign: 'right', transition: 'all 0.2s', textDecoration: 'none',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(108,34,249,0.12)', color: '#6C22F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookOpen size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>إدارة الكورسات والمحتوى</h4>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>قم بإنشاء كورس جديد ورفع المحتوى والدروس</p>
              </div>
            </Link>

            <Link
              href="/admin/team"
              style={{
                display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: '16px',
                background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14,
                cursor: 'pointer', textAlign: 'right', transition: 'all 0.2s', textDecoration: 'none',
                boxSizing: 'border-box'
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(59,130,246,0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Users size={20} />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>إدارة فريق العمل والصلاحيات</h4>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>دعوة مساعدين وتحديد الصلاحيات الخاصة لكل منهم</p>
              </div>
            </Link>
          </div>
        </div>

      </div>

      {/* Schedule Live Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowScheduleModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ position: 'relative', background: 'var(--surface)', borderRadius: 24, border: '1px solid var(--border)', padding: 28, width: '100%', maxWidth: 520, zIndex: 1000, fontFamily: 'Tajawal, sans-serif' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 900, color: 'var(--text-main)' }}>جدولة حصة أونلاين / بث مباشر جديد 🎥</h3>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>سيتم إرسال إشعار تلقائي لجميع الطلاب المشتركين بالحصة.</span>
                </div>
                <button onClick={() => setShowScheduleModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleAddLiveSession} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>عنوان الحصة / موضوع البث المباشر:</label>
                  <input
                    type="text" required value={newTitle} onChange={e => setNewTitle(e.target.value)}
                    placeholder="مثال: مراجعة خوارزميات بايثون والتطبيقات البرمجية"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>المرحلة الدراسية المستهدفة:</label>
                  <select
                    value={newGrade} onChange={e => setNewGrade(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  >
                    <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                    <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                    <option value="تأسيس البرمجة">تأسيس البرمجة</option>
                    <option value="جميع الطلاب">جميع الدفعات والطلاب</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>يوم الحصة:</label>
                    <input
                      type="text" required value={newDate} onChange={e => setNewDate(e.target.value)}
                      placeholder="مثال: اليوم أو الجمعة القادمة"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>التوقيت بالساعة:</label>
                    <input
                      type="text" required value={newTime} onChange={e => setNewTime(e.target.value)}
                      placeholder="مثال: 8:00 مساءً"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                  <button type="button" onClick={() => setShowScheduleModal(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer' }}>إلغاء</button>
                  <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 10, border: 'none', background: '#6C22F9', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
                    <Bell size={16} /> جدولة وإرسال التنبيهات
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
