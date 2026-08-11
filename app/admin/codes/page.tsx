'use client';
import { useState, useEffect } from 'react';
import { KeyRound, Search, Plus, Trash2, Printer, X, Check, Copy, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCodesPage() {
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [codesList, setCodesList] = useState([
    { id: 1, code: 'AH-2026-X9YZ', value: '350 ج.م', type: 'كورس أولى ثانوي', status: 'مستخدم', usedBy: 'أحمد محمود', date: '12 أكتوبر 2026' },
    { id: 2, code: 'AH-2026-M4KN', value: '350 ج.م', type: 'كورس أولى ثانوي', status: 'غير مستخدم', usedBy: '-', date: '15 أكتوبر 2026' },
    { id: 3, code: 'AH-2026-P8QL', value: '150 ج.م', type: 'مراجعة ليلة الامتحان', status: 'مستخدم', usedBy: 'سارة خالد', date: '10 أكتوبر 2026' },
    { id: 4, code: 'AH-2026-W3BC', value: '500 ج.م', type: 'شحن محفظة', status: 'غير مستخدم', usedBy: '-', date: '15 أكتوبر 2026' },
  ]);

  // Generation form fields
  const [codeType, setCodeType] = useState('كورس أولى ثانوي');
  // Dynamic course options fetched from admin_courses & academic_grades
  const [courseOptions, setCourseOptions] = useState<string[]>([
    'كورس أولى ثانوي',
    'كورس ثانية ثانوي',
    'الكورس التأسيسي',
    'شحن محفظة الطالب 💳',
    'مراجعة ليلة الامتحان 📝'
  ]);

  useEffect(() => {
    try {
      // 1. Fetch created courses from localStorage
      const savedCourses = localStorage.getItem('admin_created_courses');
      const savedGrades = localStorage.getItem('academic_grades');
      
      const dynamicList: string[] = [];
      if (savedCourses) {
        const parsed = JSON.parse(savedCourses);
        parsed.forEach((c: any) => {
          if (c.title) dynamicList.push(c.title);
        });
      }

      if (dynamicList.length > 0) {
        setCourseOptions([
          ...dynamicList,
          'شحن محفظة الطالب 💳',
          'مراجعة ليلة الامتحان 📝'
        ]);
        setCodeType(dynamicList[0]);
      }
    } catch {}
  }, []);
  const [codeCount, setCodeCount] = useState('5');

  const handleGenerateCodes = (e: React.FormEvent) => {
    e.preventDefault();
    const count = Math.min(50, Math.max(1, Number(codeCount) || 1));
    const newGenerated = [];

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    for (let i = 0; i < count; i++) {
      let randStr = '';
      for (let j = 0; j < 4; j++) {
        randStr += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      newGenerated.push({
        id: Date.now() + i,
        code: `AH-2026-${randStr}`,
        value: `${codeValue} ج.م`,
        type: codeType,
        status: 'غير مستخدم',
        usedBy: '-',
        date: new Date().toLocaleDateString('ar-EG')
      });
    }

    setCodesList(prev => [...newGenerated, ...prev]);
    setShowGenerateModal(false);
    setToastMsg(`✅ تم توليد وتفعيل ${count} أكواد تفعيل جديدة بنجاح!`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleDeleteCode = (id: number) => {
    setCodesList(prev => prev.filter(c => c.id !== id));
    setToastMsg('✅ تم حذف كود التفعيل.');
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handlePrintSheet = () => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>طباعة كروت وأكواد التفعيل</title>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@700;900&display=swap" rel="stylesheet">
        <style>
          body { font-family: 'Tajawal', sans-serif; padding: 20px; direction: rtl; }
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .card { border: 2px dashed #6C22F9; padding: 16px; border-radius: 12px; text-align: center; background: #faf5ff; }
          .code { font-size: 22px; font-weight: 900; color: #6C22F9; letter-spacing: 2px; margin: 10px 0; font-family: monospace; }
          .meta { font-size: 13px; color: #475569; font-weight: 700; }
        </style>
      </head>
      <body>
        <h2 style="text-align: center; color: #16133a;">كروت وأكواد تفعيل الكورسات - منصة م. عبدالرحمن حامد</h2>
        <div class="grid">
          ${codesList.map(c => `
            <div class="card">
              <div class="meta">${c.type} (${c.value})</div>
              <div class="code">${c.code}</div>
              <div class="meta">الحالة: ${c.status}</div>
            </div>
          `).join('')}
        </div>
        <script>window.onload = function() { window.print(); };</script>
      </body>
      </html>
    `;

    printWin.document.write(html);
    printWin.document.close();
  };

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(codeText);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Toast Notification */}
      {toastMsg && (
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--surface)', color: 'var(--text-main)', padding: '12px 24px', borderRadius: 12,
            fontWeight: 800, zIndex: 9999, boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid var(--border)'
          }}
        >
          {toastMsg}
        </motion.div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>أكواد التفعيل 🔑</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>توليد وإدارة كروت الشحن وأكواد التفعيل لبيعها في السناتر.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button 
            onClick={handlePrintSheet}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface)', color: 'var(--text-main)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
          >
            <Printer size={18} /> طباعة الأكواد
          </button>
          <button 
            onClick={() => setShowGenerateModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108, 34, 249, 0.3)', fontFamily: 'Tajawal, sans-serif' }}
          >
            <Plus size={18} /> توليد أكواد جديدة
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        
        {/* Toolbar */}
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 250, maxWidth: 400 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="ابحث بالكود..." 
              style={{ width: '100%', padding: '10px 42px 10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} 
            />
          </div>
          
          <select style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid var(--border)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', color: 'var(--text-main)', background: 'var(--bg)' }}>
            <option value="all">كل الحالات</option>
            <option value="used">مستخدم</option>
            <option value="unused">غير مستخدم</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px', fontWeight: 800 }}>الكود</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>القيمة</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>النوع</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>تاريخ الإنشاء</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>الحالة</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>استخدم بواسطة</th>
                <th style={{ padding: '16px', fontWeight: 800, textAlign: 'left' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {codesList.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                  <td style={{ padding: '16px', fontSize: 14, fontWeight: 900, color: 'var(--text-main)', letterSpacing: 1 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span>{item.code}</span>
                      <button onClick={() => handleCopyCode(item.code)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6C22F9', padding: 0 }} title="نسخ الكود">
                        {copiedCode === item.code ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '16px', fontSize: 14, fontWeight: 900, color: '#6C22F9' }}>{item.value}</td>
                  <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>{item.type}</td>
                  <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>{item.date}</td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      background: item.status === 'مستخدم' ? 'rgba(148,163,184,0.15)' : 'rgba(34,197,94,0.15)',
                      color: item.status === 'مستخدم' ? 'var(--text-muted)' : '#22c55e',
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 900,
                    }}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', fontSize: 13, color: item.usedBy === '-' ? 'var(--text-muted)' : 'var(--text-main)', fontWeight: item.usedBy === '-' ? 400 : 800 }}>
                    {item.usedBy}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'left' }}>
                    <button 
                      onClick={() => handleDeleteCode(item.id)}
                      style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: item.status === 'مستخدم' ? 'not-allowed' : 'pointer', opacity: item.status === 'مستخدم' ? 0.5 : 1 }} 
                      title="حذف الكود"
                      disabled={item.status === 'مستخدم'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Generate Codes Modal */}
      <AnimatePresence>
        {showGenerateModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowGenerateModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ position: 'relative', background: 'var(--surface)', borderRadius: 24, border: '1px solid var(--border)', padding: 28, width: '100%', maxWidth: 520, zIndex: 1000, fontFamily: 'Tajawal, sans-serif' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 900, color: 'var(--text-main)' }}>توليد أكواد تفعيل وشحن جديدة 🔑</h3>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>إنشاء كروت مخصصة للتوزيع في السناتر أو المبيعات اليدوية.</span>
                </div>
                <button onClick={() => setShowGenerateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleGenerateCodes} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>نوع الكود / الكورس المطبق عليه:</label>
                  <select
                    value={codeType} onChange={e => setCodeType(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  >
                    {courseOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>قيمة الكود (ج.م):</label>
                    <input
                      type="number" required value={codeValue} onChange={e => setCodeValue(e.target.value)}
                      placeholder="350"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>عدد الأكواد المطلوبة:</label>
                    <input
                      type="number" required value={codeCount} onChange={e => setCodeCount(e.target.value)} min="1" max="50"
                      placeholder="5"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                  <button type="button" onClick={() => setShowGenerateModal(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer' }}>إلغاء</button>
                  <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 10, border: 'none', background: '#6C22F9', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
                    <Plus size={16} /> توليد الكروت الآن
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
