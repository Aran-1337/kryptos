'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Edit3, Shield, X, Save, Lock, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Student Profile State
  const [profile, setProfile] = useState({
    name: 'أحمد محمود العبد',
    email: 'ahmed@example.com',
    phone: '01012345678',
    grade: 'الصف الأول الثانوي',
    city: 'القاهرة',
  });

  // Edit Form Fields
  const [editName, setEditName] = useState(profile.name);
  const [editEmail, setEditEmail] = useState(profile.email);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editGrade, setEditGrade] = useState(profile.grade);
  const [editCity, setEditCity] = useState(profile.city);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('student_profile_info');
      if (saved) {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        setEditName(parsed.name || 'أحمد محمود العبد');
        setEditEmail(parsed.email || 'ahmed@example.com');
        setEditPhone(parsed.phone || '01012345678');
        setEditGrade(parsed.grade || 'الصف الأول الثانوي');
        setEditCity(parsed.city || 'القاهرة');
      }
    } catch {}
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      name: editName,
      email: editEmail,
      phone: editPhone,
      grade: editGrade,
      city: editCity,
    };
    setProfile(updated);
    localStorage.setItem('student_profile_info', JSON.stringify(updated));

    setShowEditModal(false);
    setNewPassword('');
    setToastMsg('✅ تم تحديث بيانات الملف الشخصي بنجاح!');
    setTimeout(() => setToastMsg(''), 3500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 800, margin: '0 auto', fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
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

      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', marginBottom: 6 }}>الملف الشخصي 👤</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>إدارة بياناتك الشخصية وإعدادات الحساب.</p>
        </div>
        
        <button 
          onClick={() => setShowEditModal(true)}
          style={{ background: '#6C22F9', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 14px rgba(108,34,249,0.3)', fontFamily: 'Tajawal, sans-serif' }}
        >
          <Edit3 size={16} /> تعديل البيانات
        </button>
      </div>

      {/* Main Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: 'var(--surface)', borderRadius: 24, overflow: 'hidden', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}
      >
        {/* Header Cover */}
        <div style={{ height: 120, background: 'linear-gradient(135deg, rgba(15,10,50,0.95) 0%, rgba(108,34,249,0.85) 100%)', position: 'relative' }}>
          <div style={{
            position: 'absolute', bottom: -40, right: 32,
            width: 80, height: 80, borderRadius: '50%',
            background: 'var(--surface)', padding: 4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}>
            <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #6C22F9, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 32 }}>
              {profile.name.charAt(0)}
            </div>
          </div>
        </div>

        <div style={{ padding: '56px 32px 32px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--text-main)', marginBottom: 4 }}>{profile.name}</h2>
          <p style={{ color: '#10b981', fontSize: 13.5, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
            <Shield size={15} /> حساب نشط وموثق
          </p>

          {/* Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--border)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(108,34,249,0.12)', color: '#6C22F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={18} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>البريد الإلكتروني</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>{profile.email}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--border)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(16,185,129,0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={18} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>رقم الهاتف</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text-main)', direction: 'ltr', textAlign: 'right' }}>{profile.phone}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--border)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(245,158,11,0.12)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <GraduationCap size={18} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>الصف الدراسي</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>{profile.grade}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'var(--bg)', borderRadius: 16, border: '1px solid var(--border)' }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: 'rgba(168,85,247,0.12)', color: '#a855f7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={18} />
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>المحافظة</p>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 800, color: 'var(--text-main)' }}>{profile.city}</p>
              </div>
            </div>

          </div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEditModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ position: 'relative', background: 'var(--surface)', borderRadius: 24, border: '1px solid var(--border)', padding: 28, width: '100%', maxWidth: 540, zIndex: 1000, fontFamily: 'Tajawal, sans-serif', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--text-main)' }}>تعديل بيانات الملف الشخصي 🖋️</h3>
                <button onClick={() => setShowEditModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>الاسم بالكامل:</label>
                  <input
                    type="text" required value={editName} onChange={e => setEditName(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>البريد الإلكتروني:</label>
                    <input
                      type="email" required value={editEmail} onChange={e => setEditEmail(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>رقم الهاتف:</label>
                    <input
                      type="text" required value={editPhone} onChange={e => setEditPhone(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>الصف الدراسي:</label>
                    <select
                      value={editGrade} onChange={e => setEditGrade(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    >
                      <option value="الصف الأول الثانوي">الصف الأول الثانوي</option>
                      <option value="الصف الثاني الثانوي">الصف الثاني الثانوي</option>
                      <option value="دورة التأسيس الشاملة">دورة التأسيس الشاملة</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>المحافظة:</label>
                    <input
                      type="text" required value={editCity} onChange={e => setEditCity(e.target.value)}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>تغيير كلمة المرور (اختياري):</label>
                  <input
                    type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    placeholder="اكتب كلمة المرور الجديدة إذا كنت ترغب بتغييرها..."
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 13.5, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 12 }}>
                  <button type="button" onClick={() => setShowEditModal(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer' }}>إلغاء</button>
                  <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', borderRadius: 10, border: 'none', background: '#6C22F9', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
                    <Save size={16} /> حفظ التغيرات
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
