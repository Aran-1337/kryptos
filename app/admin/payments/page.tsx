'use client';
import { useState } from 'react';
import { Search, CheckCircle, XCircle, ExternalLink, X, Download, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPaymentsPage() {
  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState('');

  const [requestsList, setRequestsList] = useState([
    { id: 1, student: 'أحمد محمود', phone: '01012345678', course: 'كورس أولى ثانوي - الترم الأول', amount: '350 ج.م', senderPhone: '01099887766', date: 'منذ 10 دقائق', status: 'قيد المراجعة', receipt: '/hero1.webp' },
    { id: 2, student: 'سارة خالد', phone: '01122334455', course: 'الكورس التأسيسي في البرمجة', amount: '150 ج.م', senderPhone: '01155443322', date: 'منذ ساعتين', status: 'مقبول', receipt: '/hero1.webp' },
    { id: 3, student: 'عمر طارق', phone: '01233445566', course: 'كورس ثانية ثانوي', amount: '350 ج.م', senderPhone: '01211223344', date: 'أمس', status: 'مرفوض', receipt: '/hero1.webp' },
  ]);

  const handleApprove = (id: number, studentName: string) => {
    setRequestsList(prev => prev.map(r => r.id === id ? { ...r, status: 'مقبول' } : r));
    setToastMsg(`✅ تم قبول الطلب وتفعيل الكورس للطالب (${studentName}) بنجاح!`);
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleReject = (id: number, studentName: string) => {
    setRequestsList(prev => prev.map(r => r.id === id ? { ...r, status: 'مرفوض' } : r));
    setToastMsg(`✅ تم رفض طلب تحويل الطالب (${studentName}).`);
    setTimeout(() => setToastMsg(''), 3500);
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
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>طلبات الدفع اليدوي 💳</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>مراجعة إيصالات التحويل عبر فودافون كاش و InstaPay وتفعيل الكورسات للطلاب.</p>
        </div>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        
        {/* Toolbar */}
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 250, maxWidth: 400 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="ابحث برقم محول منه أو اسم الطالب..." 
              style={{ width: '100%', padding: '10px 42px 10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} 
            />
          </div>
          
          <select style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid var(--border)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', color: 'var(--text-main)', background: 'var(--bg)' }}>
            <option value="all">كل الطلبات</option>
            <option value="pending">قيد المراجعة</option>
            <option value="approved">المقبولة</option>
            <option value="rejected">المرفوضة</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px', fontWeight: 800 }}>الطالب</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>الكورس</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>المبلغ</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>رقم المحول منه</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>الإيصال</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>الحالة</th>
                <th style={{ padding: '16px', fontWeight: 800, textAlign: 'left' }}>إجراءات التفعيل</th>
              </tr>
            </thead>
            <tbody>
              {requestsList.map((req) => (
                <tr key={req.id} style={{ borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                  <td style={{ padding: '16px' }}>
                    <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 900, color: 'var(--text-main)' }}>{req.student}</p>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{req.phone}</p>
                  </td>
                  <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>{req.course}</td>
                  <td style={{ padding: '16px', fontSize: 14, fontWeight: 900, color: '#6C22F9' }}>{req.amount}</td>
                  <td style={{ padding: '16px', fontSize: 13, fontWeight: 800, color: 'var(--text-main)' }}>{req.senderPhone}</td>
                  <td style={{ padding: '16px' }}>
                    <button
                      onClick={() => setSelectedReceipt(req)}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg)', border: '1px solid var(--border)', padding: '6px 12px', borderRadius: 8, fontSize: 12.5, fontWeight: 800, color: '#6C22F9', cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                    >
                      <ExternalLink size={14} /> معاينة الإيصال
                    </button>
                  </td>
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      background: req.status === 'مقبول' ? 'rgba(34,197,94,0.15)' : req.status === 'مرفوض' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)',
                      color: req.status === 'مقبول' ? '#22c55e' : req.status === 'مرفوض' ? '#ef4444' : '#d97706',
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 900,
                    }}>
                      {req.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px', textAlign: 'left' }}>
                    {req.status === 'قيد المراجعة' ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                        <button
                          onClick={() => handleApprove(req.id, req.student)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#10b981', color: '#fff', border: 'none', padding: '7px 14px', borderRadius: 8, fontWeight: 800, fontSize: 12.5, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif', boxShadow: '0 2px 8px rgba(16,185,129,0.25)' }}
                        >
                          <CheckCircle size={14} /> قبول وتفعيل
                        </button>
                        <button
                          onClick={() => handleReject(req.id, req.student)}
                          style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '7px 14px', borderRadius: 8, fontWeight: 800, fontSize: 12.5, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                        >
                          <XCircle size={14} /> رفض
                        </button>
                      </div>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>تم اتخاذ إجراء ({req.status})</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Preview Receipt Modal */}
      <AnimatePresence>
        {selectedReceipt && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedReceipt(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ position: 'relative', background: 'var(--surface)', borderRadius: 24, border: '1px solid var(--border)', padding: 28, width: '100%', maxWidth: 520, zIndex: 1000, fontFamily: 'Tajawal, sans-serif' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 900, color: 'var(--text-main)' }}>معاينة إيصال التحويل 📄</h3>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>الطالب: <strong>{selectedReceipt.student}</strong> ({selectedReceipt.amount})</span>
                </div>
                <button onClick={() => setSelectedReceipt(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', background: '#000', marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', maxHeight: 340 }}>
                <img src={selectedReceipt.receipt} alt="إيصال التحويل" style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
              </div>

              <div style={{ background: 'var(--bg)', padding: 14, borderRadius: 12, border: '1px solid var(--border)', marginBottom: 20, fontSize: 13, color: 'var(--text-main)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ color: 'var(--text-muted)' }}>رقم المحول منه:</span>
                  <strong>{selectedReceipt.senderPhone}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>الكورس المطلوب:</span>
                  <strong>{selectedReceipt.course}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button onClick={() => setSelectedReceipt(null)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer' }}>إغلاق</button>
                {selectedReceipt.status === 'قيد المراجعة' && (
                  <button
                    onClick={() => { handleApprove(selectedReceipt.id, selectedReceipt.student); setSelectedReceipt(null); }}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 10, border: 'none', background: '#10b981', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <CheckCircle size={16} /> قبول وإرسال التفعيل
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
