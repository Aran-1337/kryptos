'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Wallet, Plus, CreditCard, ArrowDownRight, ArrowUpRight, History, CheckCircle2, Copy, Check, ShieldCheck, X, Save, Clock, Upload, AlertCircle, Ticket, Sparkles } from 'lucide-react';

export default function StudentWalletPage() {
  const [balance, setBalance] = useState(450);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Recharge Code Input State
  const [rechargeCode, setRechargeCode] = useState('');
  const [codeSuccessToast, setCodeSuccessToast] = useState('');

  // Form State
  const [amount, setAmount] = useState('350');
  const [paymentMethod, setPaymentMethod] = useState('vodafone'); // vodafone, instapay, fawry, code
  const [senderPhone, setSenderPhone] = useState('');
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [topUpPending, setTopUpPending] = useState(false);
  const [warningToast, setWarningToast] = useState('');
  const [transferNumber, setTransferNumber] = useState('01012345678');

  const [transactions, setTransactions] = useState([
    { id: 'tx-1', type: 'deposit', title: 'شحن رصيد - فودافون كاش', amount: '+500 ج.م', date: '06 أغسطس 2026', status: 'مكتمل ✅' },
    { id: 'tx-2', type: 'purchase', title: 'شراء كورس أولى ثانوي (الترم الأول)', amount: '-350 ج.م', date: '06 أغسطس 2026', status: 'خصم تلقائي' },
    { id: 'tx-3', type: 'reward', title: 'مكافأة التفوق في امتحان الخوارزميات (المركز الأول)', amount: '+300 ج.م', date: '05 أغسطس 2026', status: 'مكافأة 🎁' },
  ]);

  const loadTransferNumberAndBalance = () => {
    try {
      const savedNumber = localStorage.getItem('payment_vodafone_number');
      if (savedNumber) setTransferNumber(savedNumber);

      const savedBal = localStorage.getItem('student_wallet_balance');
      if (savedBal !== null) {
        setBalance(Number(savedBal));
      } else {
        localStorage.setItem('student_wallet_balance', '450');
      }
    } catch {}
  };

  useEffect(() => {
    loadTransferNumberAndBalance();
    window.addEventListener('payment_settings_updated', loadTransferNumberAndBalance);
    window.addEventListener('student_wallet_updated', loadTransferNumberAndBalance);
    return () => {
      window.removeEventListener('payment_settings_updated', loadTransferNumberAndBalance);
      window.removeEventListener('student_wallet_updated', loadTransferNumberAndBalance);
    };
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  // Secure Activation Handler verifying against generated admin codes
  const handleActivateCode = (codeToActivate?: string) => {
    const code = (codeToActivate || rechargeCode).trim().toUpperCase();
    if (!code) {
      setWarningToast('⚠️ يرجى كتابة كود التفعيل أو كارت الشحن أولاً.');
      setTimeout(() => setWarningToast(''), 3500);
      return;
    }

    try {
      const savedCodesRaw = localStorage.getItem('admin_created_codes');
      const savedCodes = savedCodesRaw ? JSON.parse(savedCodesRaw) : [];
      
      const foundIndex = savedCodes.findIndex((c: any) => c.code.toUpperCase() === code && c.status === 'نشط');

      if (foundIndex === -1) {
        setWarningToast('⚠️ كود الشحن غير صحيح أو تم استخدامه مسبقاً.');
        setTimeout(() => setWarningToast(''), 3500);
        return;
      }

      // Code is valid! Mark code as used in admin records
      const targetCode = savedCodes[foundIndex];
      targetCode.status = 'مستعمل';
      targetCode.usedBy = 'الطالب أحمد';
      targetCode.usedAt = new Date().toLocaleDateString('ar-EG');

      localStorage.setItem('admin_created_codes', JSON.stringify(savedCodes));

      const addedValue = targetCode.price || 350;
      const newBal = balance + addedValue;
      setBalance(newBal);
      localStorage.setItem('student_wallet_balance', newBal.toString());
      window.dispatchEvent(new Event('student_wallet_updated'));

      const newTx = {
        id: `tx-${Date.now()}`,
        type: 'deposit',
        title: `شحن رصيد بواسطة كارت التفعيل (${code})`,
        amount: `+${addedValue} ج.م`,
        date: new Date().toLocaleDateString('ar-EG'),
        status: 'شحن فوري ⚡️'
      };

      setTransactions([newTx, ...transactions]);
      setRechargeCode('');
      setCodeSuccessToast(`🎉 تم تفعيل الكود بنجاح إضافة +${addedValue} ج.م لحسابك فوراً!`);
      setTimeout(() => setCodeSuccessToast(''), 4000);
      setShowTopUpModal(false);
    } catch {
      setWarningToast('⚠️ كود الشحن غير صحيح.');
      setTimeout(() => setWarningToast(''), 3500);
    }
  };

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'code') {
      handleActivateCode(rechargeCode);
      return;
    }

    if (!senderPhone.trim()) {
      setWarningToast('⚠️ يرجى كتابة رقم المحفظة المحول منها.');
      setTimeout(() => setWarningToast(''), 3500);
      return;
    }
    if (!receiptFile) {
      setWarningToast('⚠️ يرجى اختيار وإرفاق صورة إيصال التحويل لإكمال وتأكيد الطلب.');
      setTimeout(() => setWarningToast(''), 3500);
      return;
    }

    const newTx = {
      id: `tx-${Date.now()}`,
      type: 'deposit',
      title: `شحن رصيد (${amount} ج.م) - تحويل يدوي`,
      amount: `+${amount} ج.م`,
      date: new Date().toLocaleDateString('ar-EG'),
      status: 'قيد المراجعة ⏳'
    };

    setTransactions([newTx, ...transactions]);
    setTopUpPending(true);
  };

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Toast Warning Popup */}
      {warningToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--surface)', color: '#ef4444', padding: '14px 28px', borderRadius: 14,
            fontWeight: 800, zIndex: 99999, boxShadow: '0 10px 30px rgba(239,68,68,0.2)', border: '1.5px solid #ef4444', fontSize: 14.5
          }}
        >
          {warningToast}
        </motion.div>
      )}

      {/* Success Toast */}
      {codeSuccessToast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
            background: '#10b981', color: '#fff', padding: '14px 28px', borderRadius: 14,
            fontWeight: 900, zIndex: 99999, boxShadow: '0 10px 30px rgba(16,185,129,0.3)', fontSize: 15
          }}
        >
          {codeSuccessToast}
        </motion.div>
      )}

      {/* Page Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 6 }}>محفظة الطالب الرقمية (Student Wallet) 💳</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>شحن الرصيد والدفع السريع بضغطة واحدة لشراء الكورسات والمطبوعات بدون إعادة إدخال البيانات.</p>
        </div>
        
        <button 
          onClick={() => { setShowTopUpModal(true); setTopUpPending(false); setReceiptFile(null); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#6C22F9', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,34,249,0.35)', fontFamily: 'Tajawal, sans-serif' }}
        >
          <Plus size={18} /> شحن رصيد المحفظة الآن
        </button>
      </div>

      {/* Recharge Code Section (تفعيل أسرع لكروت الشحن) */}
      <div style={{ background: 'linear-gradient(135deg, rgba(108,34,249,0.08) 0%, rgba(59,130,246,0.08) 100%)', borderRadius: 20, padding: 24, border: '1.5px solid rgba(108,34,249,0.2)', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Ticket color="#6C22F9" size={24} />
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 900, color: 'var(--text-main)' }}>هل لديك كود شحن أو كارت تفعيل؟ 🎟️</h3>
        </div>
        <p style={{ margin: '0 0 16px', fontSize: 13.5, color: 'var(--text-muted)', fontWeight: 600 }}>
          أدخل الكود المطبوع على كارت الشحن الخاص بك ليتم إضافة قيمته فوراً إلى رصيد محفظتك بدون انتظار!
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            type="text"
            value={rechargeCode}
            onChange={e => setRechargeCode(e.target.value.toUpperCase())}
            placeholder="مثال: XXXXXXXX"
            style={{ flex: 1, minWidth: 240, padding: '12px 16px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: 15, fontWeight: 900, fontFamily: 'Tajawal, sans-serif', letterSpacing: 1 }}
          />
          <button
            type="button"
            onClick={() => handleActivateCode()}
            style={{ background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 12, fontWeight: 900, fontSize: 14.5, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 14px rgba(108,34,249,0.3)', fontFamily: 'Tajawal, sans-serif' }}
          >
            <Wallet size={18} /> تفعيل وشحن فوراً ⚡️
          </button>
        </div>
      </div>

      {/* Balance Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 20, marginBottom: 32 }}>
        
        {/* Main Balance Card */}
        <div style={{ background: 'linear-gradient(135deg, #6C22F9 0%, #4f46e5 100%)', borderRadius: 24, padding: 28, color: '#fff', boxShadow: '0 16px 36px rgba(108,34,249,0.25)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -20, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.9 }}>رصيد المحفظة المتاح المؤكد</span>
            <Wallet size={24} />
          </div>

          <h2 style={{ fontSize: 36, fontWeight: 900, margin: '0 0 12px', letterSpacing: '-0.5px' }}>
            {balance} <span style={{ fontSize: 18, fontWeight: 700 }}>ج.م</span>
          </h2>

          <div style={{ fontSize: 12, opacity: 0.8, fontWeight: 600 }}>
            جاهز للشراء الفوري السريع لجميع الكورسات والكتب ⚡️
          </div>
        </div>

        {/* Info Box */}
        <div style={{ background: 'var(--surface)', borderRadius: 24, padding: 28, border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <ShieldCheck size={20} color="#10b981" /> وسائل الدفع والشحن
          </h3>
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>
            يمكنك تفعيل أكواد الشحن فورياً، أو الشحن عبر تحويل فودافون كاش و InstaPay مع رفع صورة الإيصال لمراجعتها.
          </p>
        </div>

      </div>

      {/* Transaction History Table */}
      <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
        <div style={{ padding: 20, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <History size={18} color="#6C22F9" />
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>سجل المعاملات وطلبات الشحن</h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '14px', fontWeight: 800 }}>المعاملة</th>
                <th style={{ padding: '14px', fontWeight: 800 }}>المبلغ</th>
                <th style={{ padding: '14px', fontWeight: 800 }}>التاريخ</th>
                <th style={{ padding: '14px', fontWeight: 800 }}>الحالة</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '14px', fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>{tx.title}</td>
                  <td style={{ padding: '14px', fontSize: 14, fontWeight: 900, color: tx.amount.startsWith('+') ? '#10b981' : '#ef4444' }}>{tx.amount}</td>
                  <td style={{ padding: '14px', fontSize: 13, color: 'var(--text-muted)' }}>{tx.date}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      background: tx.status.includes('مكتمل') || tx.status.includes('فوري') ? 'rgba(34,197,94,0.15)' : tx.status.includes('قيد المراجعة') ? 'rgba(245,158,11,0.15)' : 'rgba(108,34,249,0.12)',
                      color: tx.status.includes('مكتمل') || tx.status.includes('فوري') ? '#22c55e' : tx.status.includes('قيد المراجعة') ? '#d97706' : '#6C22F9',
                      padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800
                    }}>
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top-Up Balance Modal */}
      <AnimatePresence>
        {showTopUpModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', zIndex: 1001 }} onClick={() => setShowTopUpModal(false)} />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 10 }} style={{ position: 'relative', zIndex: 1002, width: '100%', maxWidth: 520, background: 'var(--surface)', borderRadius: 24, padding: 28, boxShadow: '0 20px 50px rgba(0,0,0,0.3)', border: '1px solid var(--border)', maxHeight: '90vh', overflowY: 'auto' }}>
              
              {topUpPending ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(245,158,11,0.15)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Clock size={38} />
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 8px' }}>تم إرسال طلب الشحن بنجاح! ⏳</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24, maxWidth: 420, margin: '0 auto 24px' }}>
                    تم استلام رقمك وصورة الإيصال بنجاح. طلبك الآن <strong>(قيد المراجعة)</strong>، وسيقوم الأدمن بتأكيد إضافة المبلغ <strong>({amount} ج.م)</strong> لحسابك فور المعاينة خلال دقائق.
                  </p>
                  <button onClick={() => setShowTopUpModal(false)} style={{ background: '#6C22F9', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
                    تم، عودة للمحفظة
                  </button>
                </div>
              ) : (
                <form onSubmit={handleTopUpSubmit}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>شحن رصيد المحفظة الرقمية 💳</h3>
                    <button type="button" onClick={() => setShowTopUpModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    
                    <div>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>وسيلة التحويل والشحن:</label>
                      <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}>
                        <option value="vodafone">فودافون كاش (Vodafone Cash)</option>
                        <option value="instapay">انستا باي (InstaPay)</option>
                        <option value="code">كارت شحن / كود تفعيل (فوري)</option>
                      </select>
                    </div>

                    {paymentMethod === 'code' ? (
                      <div>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>أدخل كود الشحن / كارت التفعيل:</label>
                        <input
                          type="text"
                          value={rechargeCode}
                          onChange={e => setRechargeCode(e.target.value.toUpperCase())}
                          placeholder="أدخل كود الشحن (مثال: XXXXXXXX)"
                          style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1px solid #6C22F9', background: 'rgba(108,34,249,0.06)', color: 'var(--text-main)', outline: 'none', fontSize: 16, fontWeight: 900, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}
                        />
                      </div>
                    ) : (
                      <>
                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>مبلغ الشحن المطلوب (بالجنيه المصري):</label>
                          <input type="number" required value={amount} onChange={e => setAmount(e.target.value)} placeholder="مثال: 350" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 15, fontWeight: 800, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                        </div>

                        {/* Transfer Details Card */}
                        <div style={{ background: 'var(--bg)', padding: 16, borderRadius: 14, border: '1px solid var(--border)' }}>
                          <p style={{ margin: '0 0 6px', fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 800 }}>حوّل المبلغ على الرقم التالي:</p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface)', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)' }}>
                            <strong style={{ fontSize: 16, color: '#6C22F9', letterSpacing: 1 }}>{transferNumber}</strong>
                            <button type="button" onClick={() => handleCopy(transferNumber)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6C22F9', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, fontWeight: 800 }}>
                              {copiedAccount ? <Check size={14} color="#10b981" /> : <Copy size={14} />} {copiedAccount ? 'تم النسخ' : 'نسخ الرقم'}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>رقم المحفظة التي تم التحويل منها <span style={{ color: '#ef4444' }}>*</span>:</label>
                          <input type="tel" required value={senderPhone} onChange={e => setSenderPhone(e.target.value)} placeholder="مثال: 01012345678" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }} />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>صورة إيصال التحويل (إثبات الدفع 📄) <span style={{ color: '#ef4444' }}>*</span>:</label>
                          <input
                            type="file"
                            accept="image/*"
                            required
                            onChange={e => setReceiptFile(e.target.files ? e.target.files[0] : null)}
                            style={{ width: '100%', padding: '8px 12px', borderRadius: 10, border: '1px dashed #6C22F9', background: 'rgba(108,34,249,0.06)', color: 'var(--text-main)', fontSize: 13, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box', cursor: 'pointer' }}
                          />
                          <span style={{ fontSize: 11.5, color: 'var(--text-muted)', display: 'block', marginTop: 4, fontWeight: 700 }}>
                            📸 ارفع سكرين شوت أو صورة إيصال التحويل لإكمال وتفعيل الطلب.
                          </span>
                        </div>
                      </>
                    )}

                  </div>

                  <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <button type="button" onClick={() => setShowTopUpModal(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer' }}>إلغاء</button>
                    <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#6C22F9', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
                      <Save size={16} /> {paymentMethod === 'code' ? 'تفعيل الكود وشحن الرصيد ⚡️' : 'إرسال إثبات التحويل 🚀'}
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
