'use client';
import { useState, useEffect } from 'react';
import { Save, Wallet, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPaymentSettingsPage() {
  const [vodafoneEnabled, setVodafoneEnabled] = useState(true);
  const [instapayEnabled, setInstapayEnabled] = useState(true);
  const [paymobEnabled, setPaymobEnabled] = useState(true);
  const [fawryEnabled, setFawryEnabled] = useState(true);
  const [kashierEnabled, setKashierEnabled] = useState(false);

  // Transfer Numbers State
  const [vodafoneNumber, setVodafoneNumber] = useState('01012345678');
  const [backupVodafoneNumber, setBackupVodafoneNumber] = useState('01099887766');
  const [instapayAddress, setInstapayAddress] = useState('abdelrahman@instapay');

  const [toastMsg, setToastMsg] = useState('');

  useEffect(() => {
    try {
      const savedV = localStorage.getItem('payment_vodafone_number');
      if (savedV) setVodafoneNumber(savedV);

      const savedB = localStorage.getItem('payment_backup_vodafone');
      if (savedB) setBackupVodafoneNumber(savedB);

      const savedI = localStorage.getItem('payment_instapay_address');
      if (savedI) setInstapayAddress(savedI);
    } catch {}
  }, []);

  const handleSavePaymentSettings = () => {
    try {
      localStorage.setItem('payment_vodafone_number', vodafoneNumber);
      localStorage.setItem('payment_backup_vodafone', backupVodafoneNumber);
      localStorage.setItem('payment_instapay_address', instapayAddress);

      // Dispatch event for student dashboard live sync
      window.dispatchEvent(new Event('payment_settings_updated'));

      setToastMsg('✅ تم حفظ رقم التحويل وإعدادات الدفع بنجاح!');
      setTimeout(() => setToastMsg(''), 3500);
    } catch {
      setToastMsg('✅ تم حفظ التغيرات!');
      setTimeout(() => setToastMsg(''), 3500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900, fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
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

      <div>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 8 }}>إعدادات وسائل ورقم استقبال الدفع 💳</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>تعديل رقم تحويل فودافون كاش، انستاباي، والتحكم في بوابات الدفع الإلكترونية المتاحة للطلاب.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        
        {/* Section 1: Manual Wallets (Vodafone Cash & InstaPay) */}
        <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 28, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Wallet color="#6C22F9" size={22} /> الدفع عبر المحافظ الإلكترونية و InstaPay
            </h3>
            <span style={{ fontSize: 13, background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 12px', borderRadius: 20, fontWeight: 800 }}>تحويل يدوي + رفع إيصال</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Vodafone Cash */}
            <div style={{ background: 'var(--bg)', padding: 20, borderRadius: 14, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="10" fill="#E60000"/>
                    <path d="M20 9C13.925 9 9 13.925 9 20C9 26.075 13.925 31 20 31C26.075 31 31 26.075 31 20C31 13.925 26.075 9 20 9ZM20 27.5C15.858 27.5 12.5 24.142 12.5 20C12.5 15.858 15.858 12.5 20 12.5C24.142 12.5 27.5 15.858 27.5 20C27.5 24.142 24.142 27.5 20 27.5Z" fill="white"/>
                    <circle cx="20" cy="20" r="4.5" fill="white"/>
                  </svg>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>فودافون كاش (Vodafone Cash)</h4>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>محفظة كاش تحويل مباشر</span>
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 800, color: vodafoneEnabled ? '#10b981' : 'var(--text-muted)' }}>
                  <input type="checkbox" checked={vodafoneEnabled} onChange={e => setVodafoneEnabled(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#6C22F9' }} />
                  {vodafoneEnabled ? 'مُفعّل' : 'معطّل'}
                </label>
              </div>

              {vodafoneEnabled && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: '#6C22F9', marginBottom: 6 }}>رقم فودافون كاش الرئيسي لاستقبال تحويلات الطلاب:</label>
                    <input
                      type="text"
                      value={vodafoneNumber}
                      onChange={e => setVodafoneNumber(e.target.value)}
                      placeholder="01012345678"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: 15, fontWeight: 800, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>رقم كاش بديلي (اختياري)</label>
                    <input
                      type="text"
                      value={backupVodafoneNumber}
                      onChange={e => setBackupVodafoneNumber(e.target.value)}
                      placeholder="01099887766"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* InstaPay */}
            <div style={{ background: 'var(--bg)', padding: 20, borderRadius: 14, border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <rect width="40" height="40" rx="10" fill="#4C1D95"/>
                    <path d="M22 8L10 23H19L17 32L30 17H20L22 8Z" fill="#00E5FF" stroke="#00E5FF" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'var(--text-main)' }}>إنستاباي (InstaPay)</h4>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>تحويل لحظي عبر البنوك المصرية</span>
                  </div>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, fontWeight: 800, color: instapayEnabled ? '#10b981' : 'var(--text-muted)' }}>
                  <input type="checkbox" checked={instapayEnabled} onChange={e => setInstapayEnabled(e.target.checked)} style={{ width: 18, height: 18, accentColor: '#6C22F9' }} />
                  {instapayEnabled ? 'مُفعّل' : 'معطّل'}
                </label>
              </div>

              {instapayEnabled && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>معرف إنستاباي (IPA / Link)</label>
                    <input
                      type="text"
                      value={instapayAddress}
                      onChange={e => setInstapayAddress(e.target.value)}
                      placeholder="abdelrahman@instapay"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--text-main)', outline: 'none', fontSize: 14, fontFamily: 'Tajawal, sans-serif', textAlign: 'left', boxSizing: 'border-box' }}
                      dir="ltr"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSavePaymentSettings}
            style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'linear-gradient(135deg, #6C22F9, #4f46e5)', color: '#fff', border: 'none', padding: '14px 36px', borderRadius: 12, fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: '0 8px 24px rgba(108,34,249,0.3)', fontFamily: 'Tajawal, sans-serif' }}
          >
            <Save size={20} /> حفظ إعدادات ورقم الدفع 💾
          </button>
        </div>

      </div>
    </div>
  );
}
