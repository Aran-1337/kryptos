'use client';
import { useState, useEffect } from 'react';
import { Search, Shield, Ban, Mail, Smartphone, Laptop, Wifi, Globe, X, LogOut, AlertTriangle, CheckCircle2, MessageSquare, Edit3, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminStudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [editingNoteStudent, setEditingNoteStudent] = useState<any>(null);
  const [noteText, setNoteText] = useState('');
  const [strengthsText, setStrengthsText] = useState('التفكير المنطقي في الخوارزميات، سرعة حل امتحانات الخوارزميات (0 إنذارات غش)، الانضباط في مواعيد المشاهدة');
  const [improvementText, setImprovementText] = useState('التركيز على تطبيقات Loops التكرارية في بايثون');
  const [toastMsg, setToastMsg] = useState('');

  const [studentsList, setStudentsList] = useState([
    { 
      id: 1, name: 'أحمد محمود العبد', email: 'ahmed@example.com', grade: 'أولى ثانوي', courses: 2, joinedAt: '12 أكتوبر 2026', status: 'نشط',
      devicesCount: 2,
      devices: [
        { id: 'dev-1', type: 'laptop', name: 'Windows PC (Chrome 122)', ip: '197.34.12.89', city: 'القاهرة (WE Broadband)', isSameNetwork: true, lastActive: 'الآن (نشط حالياً)', isCurrent: true },
        { id: 'dev-2', type: 'mobile', name: 'iPhone 15 Pro (Safari)', ip: '197.34.12.89', city: 'القاهرة (WE Broadband)', isSameNetwork: true, lastActive: 'منذ ساعتين', isCurrent: false },
      ]
    },
    { 
      id: 2, name: 'سارة خالد السيد', email: 'sara@example.com', grade: 'ثانية ثانوي', courses: 1, joinedAt: '10 أكتوبر 2026', status: 'نشط',
      devicesCount: 3,
      devices: [
        { id: 'dev-3', type: 'laptop', name: 'MacBook Air (Safari)', ip: '156.204.11.45', city: 'الإسكندرية (Orange 4G)', isSameNetwork: false, lastActive: 'الآن', isCurrent: true },
        { id: 'dev-4', type: 'mobile', name: 'Samsung Galaxy S24', ip: '41.233.90.12', city: 'أسيوط (Vodafone 4G)', isSameNetwork: false, lastActive: 'منذ 10 دقائق', isCurrent: false },
        { id: 'dev-5', type: 'mobile', name: 'Xiaomi Redmi Note 12', ip: '197.45.100.8', city: 'القاهرة (Etisalat 4G)', isSameNetwork: false, lastActive: 'أمس', isCurrent: false },
      ]
    },
    { 
      id: 3, name: 'عمر طارق إبراهيم', email: 'omar@example.com', grade: 'تأسيس', courses: 3, joinedAt: '05 أكتوبر 2026', status: 'محظور',
      devicesCount: 1,
      devices: [
        { id: 'dev-6', type: 'mobile', name: 'Realme C55', ip: '41.130.44.90', city: 'الجيزة (WE 4G)', isSameNetwork: true, lastActive: 'منذ 3 أيام', isCurrent: false }
      ]
    },
    { 
      id: 4, name: 'مريم سعيد النجار', email: 'mariam@example.com', grade: 'أولى ثانوي', courses: 1, joinedAt: '01 أكتوبر 2026', status: 'نشط',
      devicesCount: 1,
      devices: [
        { id: 'dev-7', type: 'laptop', name: 'Dell XPS 15 (Edge)', ip: '197.35.88.10', city: 'المنصورة (WE Broadband)', isSameNetwork: true, lastActive: 'منذ ساعة', isCurrent: true }
      ]
    },
  ]);

  // Custom teacher notes mapped by student ID
  const [studentNotes, setStudentNotes] = useState<Record<string, any>>({
    '1': {
      note: 'أحمد من الطلاب المتميزين جداً هذا الأسبوع. التزامه بمشاهدة الحصص وحل الامتحانات في مواعيدها يعكس تفوقه وحصوله على المركز الأول في الدفعة.',
      strengths: 'التفكير المنطقي في الخوارزميات، سرعة حل امتحانات الخوارزميات (0 إنذارات غش)، الانضباط في مواعيد المشاهدة',
      improvement: 'التركيز على تطبيقات Loops التكرارية في بايثون'
    }
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('student_teacher_notes');
      if (saved) {
        setStudentNotes(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const handleSaveNote = () => {
    if (!editingNoteStudent) return;
    const updated = {
      ...studentNotes,
      [editingNoteStudent.id]: {
        note: noteText,
        strengths: strengthsText,
        improvement: improvementText
      }
    };
    setStudentNotes(updated);
    localStorage.setItem('student_teacher_notes', JSON.stringify(updated));
    window.dispatchEvent(new Event('teacher_notes_updated'));

    setEditingNoteStudent(null);
    setToastMsg(`✅ تم حفظ التوجيه ونقاط التميز والتوصيات للطالب (${editingNoteStudent.name}) بنجاح!`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleUnbindDevice = (devId: string) => {
    if (!selectedStudent) return;
    const updatedDevices = selectedStudent.devices.filter((d: any) => d.id !== devId);
    const updatedStudent = {
      ...selectedStudent,
      devices: updatedDevices,
      devicesCount: updatedDevices.length
    };
    setSelectedStudent(updatedStudent);
    setStudentsList(prev => prev.map(s => s.id === selectedStudent.id ? updatedStudent : s));
    setToastMsg('✅ تم فك ارتباط الجهاز بالحساب بنجاح!');
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleToggleBlock = (studentId: number, currentStatus: string) => {
    const newStatus = currentStatus === 'نشط' ? 'محظور' : 'نشط';
    setStudentsList(prev => prev.map(s => s.id === studentId ? { ...s, status: newStatus } : s));
    setToastMsg(`✅ تم ${newStatus === 'محظور' ? 'حظر' : 'إلغاء حظر'} الطالب بنجاح!`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const openNoteEditor = (student: any) => {
    setEditingNoteStudent(student);
    const existing = studentNotes[student.id];
    if (existing && typeof existing === 'object') {
      setNoteText(existing.note || '');
    } else if (typeof existing === 'string') {
      setNoteText(existing);
    } else {
      setNoteText('أحمد من الطلاب المتميزين جداً هذا الأسبوع. التزامه بمشاهدة الحصص وحل الامتحانات في مواعيدها يعكس تفوقه وحصوله على المركز الأول في الدفعة.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--surface)', color: 'var(--text-main)', padding: '12px 24px', borderRadius: 12,
            fontWeight: 800, zIndex: 9999, boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid var(--border)'
          }}
        >
          {toastMsg}
        </motion.div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>إدارة الطلاب وحماية الأجهزة 👥</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>متابعة حسابات الطلاب، فحص عناوين الـ IP، الأجهزة المسجلة لمنع مشاركة الحسابات، وتعديل التوجيهات والتوصيات.</p>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        
        {/* Toolbar */}
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 250, maxWidth: 400 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="ابحث بالاسم أو الإيميل..." 
              style={{ width: '100%', padding: '10px 42px 10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} 
            />
          </div>
          
          <select style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid var(--border)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', color: 'var(--text-main)', background: 'var(--bg)' }}>
            <option value="all">كل المراحل الدراسية</option>
            <option value="grade1">أولى ثانوي</option>
            <option value="grade2">ثانية ثانوي</option>
            <option value="foundation">تأسيس</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px', fontWeight: 800 }}>الاسم</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>الإيميل</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>المرحلة</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>الأجهزة المسجلة</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>فحص الأمان</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>الحالة</th>
                <th style={{ padding: '16px', fontWeight: 800, textAlign: 'left' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {studentsList.map((student) => {
                const hasSuspiciousDevices = student.devices.some((d: any) => !d.isSameNetwork);

                return (
                  <tr key={student.id} style={{ borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                    <td style={{ padding: '16px', fontWeight: 800, color: 'var(--text-main)' }}>{student.name}</td>
                    <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>{student.email}</td>
                    <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>{student.grade}</td>
                    
                    {/* Devices Count & Button */}
                    <td style={{ padding: '16px' }}>
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 8, fontSize: 13, fontWeight: 800, color: '#6C22F9', cursor: 'pointer' }}
                      >
                        <Laptop size={14} /> {student.devicesCount} أجهزة (معاينة)
                      </button>
                    </td>

                    {/* Security Check Status */}
                    <td style={{ padding: '16px' }}>
                      {hasSuspiciousDevices ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.15)', color: '#ef4444', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                          <AlertTriangle size={14} /> أجهزة متعددة (شبكات مختلفة)
                        </span>
                      ) : (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                          <CheckCircle2 size={14} /> حساب آمن (نفس الشبكة)
                        </span>
                      )}
                    </td>

                    <td style={{ padding: '16px' }}>
                      <button
                        onClick={() => handleToggleBlock(student.id, student.status)}
                        style={{ 
                          background: student.status === 'نشط' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                          color: student.status === 'نشط' ? '#22c55e' : '#ef4444',
                          border: student.status === 'نشط' ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(239,68,68,0.3)',
                          padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif'
                        }}
                        title="اضغط لتغيير الحالة فوراً (فك الحظر / حظر)"
                      >
                        {student.status === 'نشط' ? 'نشط 🟢' : 'محظور 🔴 (فك الحظر)'}
                      </button>
                    </td>

                    <td style={{ padding: '16px', textAlign: 'left' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                        <button
                          onClick={() => openNoteEditor(student)}
                          style={{ background: 'rgba(108,34,249,0.12)', color: '#6C22F9', border: 'none', borderRadius: 8, padding: '7px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, fontWeight: 800 }}
                          title="كتابة وتعديل التوجيهات ونقاط القوة والتوصيات"
                        >
                          <Edit3 size={15} /> توجيه وملاحظات
                        </button>

                        {student.status === 'محظور' ? (
                          <button
                            onClick={() => handleToggleBlock(student.id, student.status)}
                            style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '6px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, fontFamily: 'Tajawal, sans-serif' }}
                            title="فك حظر الحساب"
                          >
                            <CheckCircle2 size={14} /> فك الحظر
                          </button>
                        ) : (
                          <button onClick={() => handleToggleBlock(student.id, student.status)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer' }} title="حظر الطالب">
                            <Ban size={16} />
                          </button>
                        )}

                        <a href={`mailto:${student.email}`} style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer', display: 'inline-flex' }} title="مراسلة"><Mail size={16} /></a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Teacher Note & Recommendations Modal */}
      <AnimatePresence>
        {editingNoteStudent && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingNoteStudent(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ position: 'relative', background: 'var(--surface)', borderRadius: 24, border: '1px solid var(--border)', padding: 28, width: '100%', maxWidth: 580, zIndex: 1000, fontFamily: 'Tajawal, sans-serif', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 900, color: 'var(--text-main)' }}>تعديل التوجيه والتقرير الخاص بالطالب 📝</h3>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>الطالب: <strong>{editingNoteStudent.name}</strong> ({editingNoteStudent.grade})</span>
                </div>
                <button onClick={() => setEditingNoteStudent(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#6C22F9', marginBottom: 6 }}>نص توجيه وملاحظة المهندس عبدالرحمن حامد المخصصة:</label>
                <textarea
                  value={noteText}
                  onChange={e => setNoteText(e.target.value)}
                  rows={4}
                  placeholder="اكتب توجيهك المباشر للطالب هنا..."
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }}
                />
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
                  💡 <strong>ملاحظة:</strong> كروت (نقاط القوة) و (التوصيات للتحسين) يتم احتسابها وتوليدها أوتوماتيكياً بواسطة النظام بناءً على أداء الطالب وأخطائه في الامتحانات والمشاهدات.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button onClick={() => setEditingNoteStudent(null)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer' }}>إلغاء</button>
                <button
                  onClick={handleSaveNote}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 10, border: 'none', background: '#6C22F9', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                >
                  <Save size={16} /> حفظ التوجيه والملاحظات
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Devices Inspection Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedStudent(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ position: 'relative', background: 'var(--surface)', borderRadius: 24, border: '1px solid var(--border)', padding: 28, width: '100%', maxWidth: 640, zIndex: 1000, fontFamily: 'Tajawal, sans-serif' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 900, color: 'var(--text-main)' }}>الأجهزة المسجلة لحساب ({selectedStudent.name})</h3>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>الحد الأقصى المسموح: جهاز كمبيوتر + جهاز موبايل فقط.</span>
                </div>
                <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
                {selectedStudent.devices.length === 0 ? (
                  <div style={{ padding: 30, textAlign: 'center', color: 'var(--text-muted)' }}>لا توجد أجهزة مسجلة حالياً بهذا الحساب.</div>
                ) : (
                  selectedStudent.devices.map((dev: any) => (
                    <div key={dev.id} style={{ background: 'var(--bg)', borderRadius: 14, border: dev.isSameNetwork ? '1px solid var(--border)' : '1px solid #ef4444', padding: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6C22F9' }}>
                          {dev.type === 'laptop' ? <Laptop size={22} /> : <Smartphone size={22} />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>{dev.name}</h4>
                            {dev.isCurrent && <span style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 6 }}>الجهاز الحالي</span>}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, display: 'flex', gap: 12 }}>
                            <span>IP: {dev.ip}</span>
                            <span>📍 {dev.city}</span>
                            <span>⏳ النشاط: {dev.lastActive}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleUnbindDevice(dev.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'none', padding: '8px 14px', borderRadius: 8, fontSize: 12.5, fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                      >
                        <LogOut size={14} /> فك الارتباط
                      </button>
                    </div>
                  ))
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedStudent(null)} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#6C22F9', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>إغلاق</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
