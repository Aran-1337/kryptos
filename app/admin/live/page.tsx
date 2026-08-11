'use client';
import { useState } from 'react';
import { Plus, Video, Trash2, Calendar, Clock, X, Save, Radio, Link as LinkIcon, Users, User, CreditCard, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface LiveSessionItem {
  id: number;
  title: string;
  grade: string;
  date: string;
  time: string;
  platform: string;
  groupType: 'جماعية 👥' | 'فردية / خاصة 👤';
  pricingModel: 'دفع بالحصة ⚡' | 'اشتراك شهري 📅';
  priceAmount: number;
  status: string;
  link: string;
}

export default function AdminLivePage() {
  const [sessions, setSessions] = useState<LiveSessionItem[]>([
    {
      id: 1,
      title: 'بث مباشر: مراجعة الخوارزميات الشاملة',
      grade: 'أولى ثانوي',
      date: 'الإثنين 12 أكتوبر 2026',
      time: '07:00 مساءً',
      platform: 'Zoom Live',
      groupType: 'جماعية 👥',
      pricingModel: 'اشتراك شهري 📅',
      priceAmount: 200,
      status: 'قادم',
      link: 'https://zoom.us/j/123456789'
    },
    {
      id: 2,
      title: 'جلسة متابعة فردية وتصحيح أكواد (خاصة 1-on-1)',
      grade: 'ثانية ثانوي',
      date: 'الخميس 15 أكتوبر 2026',
      time: '05:00 مساءً',
      platform: 'Zoom Live',
      groupType: 'فردية / خاصة 👤',
      pricingModel: 'دفع بالحصة ⚡',
      priceAmount: 80,
      status: 'قادم',
      link: 'https://zoom.us/j/demo'
    }
  ]);

  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [grade, setGrade] = useState('أولى ثانوي');
  const [date, setDate] = useState('2026-10-20');
  const [time, setTime] = useState('08:00 مساءً');
  const [platform, setPlatform] = useState('Zoom Live');
  const [groupType, setGroupType] = useState<'جماعية 👥' | 'فردية / خاصة 👤'>('جماعية 👥');
  const [pricingModel, setPricingModel] = useState<'دفع بالحصة ⚡' | 'اشتراك شهري 📅'>('دفع بالحصة ⚡');
  const [priceAmount, setPriceAmount] = useState('50');
  const [link, setLink] = useState('');

  const handleOpenModal = () => {
    setTitle('');
    setGrade('أولى ثانوي');
    setDate('2026-10-20');
    setTime('08:00 مساءً');
    setPlatform('Zoom Live');
    setGroupType('جماعية 👥');
    setPricingModel('دفع بالحصة ⚡');
    setPriceAmount('50');
    setLink('');
    setShowModal(true);
  };

  const handleSaveSession = () => {
    if (!title.trim()) return;

    const newSession: LiveSessionItem = {
      id: Date.now(),
      title: title.trim(),
      grade,
      date: date || 'قريباً',
      time: time || '08:00 مساءً',
      platform,
      groupType,
      pricingModel,
      priceAmount: Number(priceAmount) || 50,
      status: 'قادم',
      link: link || 'https://zoom.us/j/demo'
    };

    setSessions([newSession, ...sessions]);
    setShowModal(false);
  };

  const handleDeleteSession = (id: number) => {
    if (confirm('هل أنت تأكد من حذف هذا البث المباشر؟')) {
      setSessions(sessions.filter(s => s.id !== id));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>إدارة الحصص والبث المباشر 🔴</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>تحديد نوع المجموعات (فردية / جماعية)، نظام التسعير (بالحصة / بالشهر)، وجدولة الحصص.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108, 34, 249, 0.35)', fontFamily: 'Tajawal, sans-serif' }}
        >
          <Plus size={18} /> جدولة بث / حصة جديدة
        </button>
      </div>

      {/* Table Container */}
      <div style={{ background: 'var(--surface)', borderRadius: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: 13 }}>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>عنوان البث / الحصة</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>الصف الدراسي</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>نوع المجموعة</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>نظام الدفع والسعر</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>الموعد والمنصة</th>
                <th style={{ padding: '16px 20px', fontWeight: 800 }}>الحالة</th>
                <th style={{ padding: '16px 20px', fontWeight: 800, textAlign: 'left' }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border)', fontSize: 14, fontWeight: 600, color: 'var(--text-main)' }}>
                  <td style={{ padding: '16px 20px', fontWeight: 800, color: '#6C22F9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <Radio size={18} color="#ef4444" />
                      {s.title}
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>{s.grade}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 800, background: s.groupType.includes('فردية') ? 'rgba(245,158,11,0.15)' : 'rgba(108,34,249,0.15)', color: s.groupType.includes('فردية') ? '#d97706' : '#6C22F9' }}>
                      {s.groupType}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontWeight: 900, color: '#10b981' }}>{s.priceAmount} ج.م</span>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginRight: 4 }}>({s.pricingModel})</span>
                  </td>
                  <td style={{ padding: '16px 20px', fontSize: 13, color: 'var(--text-muted)' }}>
                    <div>{s.date} - {s.time}</div>
                    <div style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700 }}>{s.platform}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: 8, fontSize: 12, fontWeight: 800, background: s.status === 'قادم' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(148, 163, 184, 0.15)', color: s.status === 'قادم' ? '#10b981' : '#64748b' }}>
                      {s.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'left' }}>
                    <button 
                      onClick={() => handleDeleteSession(s.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 6 }}
                      title="حذف"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ position: 'relative', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 32, width: '100%', maxWidth: 520, zIndex: 1000, boxShadow: '0 20px 40px rgba(0,0,0,0.2)', fontFamily: 'Tajawal, sans-serif' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>جدولة بث / حصة مباشرة جديدة 🔴</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>عنوان الحصة / البث المباشر</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="مثال: مراجعة الخوارزميات الفردية..." style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>الصف الدراسي</label>
                    <select value={grade} onChange={e => setGrade(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}>
                      <option value="أولى ثانوي">أولى ثانوي</option>
                      <option value="ثانية ثانوي">ثانية ثانوي</option>
                      <option value="تأسيس">تأسيس</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>نوع المجموعة</label>
                    <select value={groupType} onChange={e => setGroupType(e.target.value as any)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}>
                      <option value="جماعية 👥">مجموعة جماعية 👥</option>
                      <option value="فردية / خاصة 👤">مجموعة فردية / خاصة 👤</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>نظام التسعير والدفع</label>
                    <select value={pricingModel} onChange={e => setPricingModel(e.target.value as any)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}>
                      <option value="دفع بالحصة ⚡">دفع بالحصة (Pay Per Lesson)</option>
                      <option value="اشتراك شهري 📅">اشتراك شهري (Monthly)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>السعر (بالجنيه المصري)</label>
                    <input type="number" value={priceAmount} onChange={e => setPriceAmount(e.target.value)} placeholder="50" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>التاريخ</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>الوقت والمنصة</label>
                    <input type="text" value={time} onChange={e => setTime(e.target.value)} placeholder="07:00 مساءً" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>رابط غرفة البث المباشر (Zoom / YouTube)</label>
                  <input type="url" value={link} onChange={e => setLink(e.target.value)} placeholder="https://zoom.us/j/..." style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 13, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }} dir="ltr" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
                <button onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>إلغاء</button>
                <button onClick={handleSaveSession} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 10, border: 'none', background: '#6C22F9', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}><Save size={16} /> حفظ وجدولة البث</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
