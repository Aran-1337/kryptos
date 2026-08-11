'use client';
import { useState } from 'react';
import { Search, Tag, Plus, Trash2, Copy, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminCouponsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Coupons State
  const [coupons, setCoupons] = useState([
    { id: 1, code: 'KORSA20', discount: 'خصم 20%', targetCourse: 'جميع الكورسات', usedCount: 45, maxUses: 100, expiryDate: '31 ديسمبر 2026', status: 'مفعل' },
    { id: 2, code: 'FIRST100', discount: 'خصm 50 ج.م', targetCourse: 'كورس أولى ثانوي', usedCount: 100, maxUses: 100, expiryDate: '15 أكتوبر 2026', status: 'مفعل' },
    { id: 3, code: 'SUMMER50', discount: 'خصم 50%', targetCourse: 'الكورس التأسيسي', usedCount: 12, maxUses: 50, expiryDate: '01 سبتمبر 2026', status: 'ملغي' },
  ]);

  // Form State
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percent');
  const [discountValue, setDiscountValue] = useState('');
  const [targetCourse, setTargetCourse] = useState('جميع الكورسات');
  const [maxUses, setMaxUses] = useState('100');
  const [expiryDate, setExpiryDate] = useState('2026-12-31');

  const handleCopyCode = (codeText: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(codeText);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !discountValue.trim()) return;

    const newC = {
      id: Date.now(),
      code: code.trim().toUpperCase(),
      discount: discountType === 'percent' ? `خصم ${discountValue}%` : `خصم ${discountValue} ج.م`,
      targetCourse,
      usedCount: 0,
      maxUses: Number(maxUses) || 100,
      expiryDate: expiryDate || '31 ديسمبر 2026',
      status: 'مفعل'
    };

    setCoupons([newC, ...coupons]);
    setShowModal(false);
    setCode('');
    setDiscountValue('');
    setToastMsg('✅ تم تفعيل وإنشاء كوبون الخصم بنجاح!');
    setTimeout(() => setToastMsg(''), 3500);
  };

  const handleDeleteCoupon = (id: number) => {
    if (!confirm('هل أنت متأكد من حذف كود الخصم هذا؟')) return;
    setCoupons(prev => prev.filter(c => c.id !== id));
    setToastMsg('✅ تم حذف الكوبون بنجاح.');
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
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>أكواد الخصم والكوبونات (Coupons & Discounts) 🏷️</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>إنشاء وإدارة بروموكودات الخصم وتحديد نسبة الخصم وعدد الاستخدامات للطلاب.</p>
        </div>

        <button 
          onClick={() => setShowModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#6C22F9', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,34,249,0.3)', fontFamily: 'Tajawal, sans-serif' }}
        >
          <Plus size={18} /> إنشاء كود خصم جديد
        </button>
      </div>

      <div style={{ background: 'var(--surface)', borderRadius: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid var(--border)', overflow: 'hidden' }}>
        
        {/* Toolbar */}
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 250, maxWidth: 400 }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="ابحث بكود الخصم..." 
              style={{ width: '100%', padding: '10px 42px 10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} 
            />
          </div>
          
          <select style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid var(--border)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', color: 'var(--text-main)', background: 'var(--bg)' }}>
            <option value="all">كل الكوبونات</option>
            <option value="active">المفعلة</option>
            <option value="expired">المنتهية أو الملغاة</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px', fontWeight: 800 }}>الكود</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>قيمة الخصم</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>الكورس المطبق عليه</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>استخدامات الكوبون</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>تاريخ الانتهاء</th>
                <th style={{ padding: '16px', fontWeight: 800 }}>الحالة</th>
                <th style={{ padding: '16px', fontWeight: 800, textAlign: 'left' }}>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} style={{ borderBottom: '1px solid var(--border)', fontSize: 13.5 }}>
                  <td style={{ padding: '16px' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(108,34,249,0.12)', border: '1px dashed #6C22F9', padding: '6px 14px', borderRadius: 8, fontSize: 14, fontWeight: 900, color: '#6C22F9', letterSpacing: 1 }}>
                      <Tag size={15} />
                      {coupon.code}
                      <button onClick={() => handleCopyCode(coupon.code)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6C22F9', padding: 0 }} title="نسخ الكود">
                        {copiedCode === coupon.code ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                      </button>
                    </div>
                  </td>

                  <td style={{ padding: '16px', fontSize: 14, fontWeight: 900, color: 'var(--text-main)' }}>{coupon.discount}</td>
                  <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>{coupon.targetCourse}</td>
                  <td style={{ padding: '16px', fontSize: 13, fontWeight: 800, color: 'var(--text-main)' }}>
                    {coupon.usedCount} / {coupon.maxUses} استخدام
                  </td>
                  <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>{coupon.expiryDate}</td>
                  
                  <td style={{ padding: '16px' }}>
                    <span style={{ 
                      background: coupon.status === 'مفعل' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                      color: coupon.status === 'مفعل' ? '#22c55e' : '#ef4444',
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 900
                    }}>
                      {coupon.status}
                    </span>
                  </td>

                  <td style={{ padding: '16px', textAlign: 'left' }}>
                    <button onClick={() => handleDeleteCoupon(coupon.id)} style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer' }} title="حذف الكوبون">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Coupon Modal with Dark Mode Compatibility */}
      <AnimatePresence>
        {showModal && (
          <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 1001 }} onClick={() => setShowModal(false)} />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} style={{ position: 'relative', zIndex: 1002, width: '100%', maxWidth: 540, background: 'var(--surface)', borderRadius: 24, padding: 28, boxShadow: '0 20px 50px rgba(0,0,0,0.3)', border: '1px solid var(--border)', maxHeight: '90vh', overflowY: 'auto', fontFamily: 'Tajawal, sans-serif' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>إنشاء كود خصم جديد (Coupon) 🏷️</h3>
                <button onClick={() => setShowModal(false)} style={{ background: 'var(--bg)', border: '1px solid var(--border)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
              </div>

              <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>كود الخصم (Coupon Code):</label>
                  <input type="text" required value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="مثال: KORSA20" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontWeight: 900, letterSpacing: 1, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>نوع الخصم:</label>
                    <select value={discountType} onChange={e => setDiscountType(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', background: 'var(--bg)', color: 'var(--text-main)', boxSizing: 'border-box' }}>
                      <option value="percent">نسبة مئوية (%)</option>
                      <option value="fixed">مبلغ ثابت (ج.م)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>قيمة الخصم:</label>
                    <input type="number" required value={discountValue} onChange={e => setDiscountValue(e.target.value)} placeholder="مثال: 20" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>الكورس المطبق عليه:</label>
                  <select value={targetCourse} onChange={e => setTargetCourse(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', background: 'var(--bg)', color: 'var(--text-main)', boxSizing: 'border-box' }}>
                    <option value="جميع الكورسات">جميع الكورسات</option>
                    <option value="كورس أولى ثانوي">كورس أولى ثانوي</option>
                    <option value="كورس ثانية ثانوي">كورس ثانية ثانوي</option>
                    <option value="الكورس التأسيسي">الكورس التأسيسي</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>الحد الأقصى لعدد الاستخدامات:</label>
                    <input type="number" value={maxUses} onChange={e => setMaxUses(e.target.value)} placeholder="مثال: 100" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>تاريخ انتهاء الخصم:</label>
                    <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                  <button type="button" onClick={() => setShowModal(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer' }}>إلغاء</button>
                  <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 10, border: 'none', background: '#6C22F9', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
                    <Tag size={16} /> تفعيل الكوبون
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
