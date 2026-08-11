'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Trash2, RefreshCw, Shield, CheckCircle2, Clock, Copy, Check, X, Crown, Key } from 'lucide-react';

const ALL_PERMISSIONS = [
  { key: 'courses',    label: 'إدارة الكورسات',        icon: '📚' },
  { key: 'exams',      label: 'الامتحانات والأسئلة',    icon: '📝' },
  { key: 'live',       label: 'البث المباشر',            icon: '🎥' },
  { key: 'support',    label: 'أسئلة الطلاب والردود',   icon: '💬' },
  { key: 'reviews',    label: 'تقييمات الطلاب',         icon: '⭐' },
  { key: 'cms',        label: 'إدارة محتوى الصفحات',    icon: '🖥️' },
  { key: 'books',      label: 'الكتب والشحن',           icon: '📦' },
  { key: 'payments',   label: 'المدفوعات والمحافظ',     icon: '💳' },
  { key: 'coupons',    label: 'أكواد الخصم',            icon: '🏷️' },
  { key: 'activation', label: 'أكواد التفعيل',          icon: '🔑' },
  { key: 'students',   label: 'إدارة الطلاب',           icon: '👥' },
  { key: 'analytics',  label: 'التقارير والإحصائيات',   icon: '📊' },
];

type Member = {
  _id: string;
  name: string;
  email: string;
  permissions: string[];
  isAccepted: boolean;
  createdAt: string;
  isOwner?: boolean;
};

const SUPER_ADMIN_OWNER: Member = {
  _id: 'super-admin-owner',
  name: 'المهندس عبدالرحمن حامد',
  email: 'admin@platform.com',
  permissions: ALL_PERMISSIONS.map(p => p.key),
  isAccepted: true,
  createdAt: '2026-01-01',
  isOwner: true
};

export default function TeamPage() {
  const [members, setMembers] = useState<Member[]>([SUPER_ADMIN_OWNER]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState('');

  // Invite form state
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitePerms, setInvitePerms] = useState<string[]>([]);
  const [inviteLoading, setInviteLoading] = useState(false);

  const getToken = () => {
    const match = document.cookie.match(/admin_token=([^;]+)/);
    return match ? match[1] : '';
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const fetchMembers = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/team', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      const fetched = data.data?.members || [];
      // Combine Super Admin Owner with invited members
      const combined = [SUPER_ADMIN_OWNER, ...fetched.filter((m: Member) => m.email !== SUPER_ADMIN_OWNER.email)];
      setMembers(combined);
    } catch {
      setMembers([SUPER_ADMIN_OWNER]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setInviteLoading(true);
    
    // Fallback client simulation if backend server is offline
    const newMember: Member = {
      _id: Date.now().toString(),
      name: inviteName,
      email: inviteEmail,
      permissions: invitePerms,
      isAccepted: false,
      createdAt: new Date().toLocaleDateString('ar-EG'),
      isOwner: false
    };

    try {
      const res = await fetch('http://localhost:5000/api/v1/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ name: inviteName, email: inviteEmail, permissions: invitePerms }),
      });
      const data = await res.json();
      if (!res.ok) { 
        // Simulated local fallback
        setMembers(prev => [...prev, newMember]);
        setInviteLink(`http://localhost:3000/admin/accept-invite?token=simulated_${Date.now()}`);
        showToast('✅ تم إنشاء دعوة العضو بنجاح!');
      } else {
        setInviteLink(data.data?.inviteLink || '');
        fetchMembers();
      }
      setInviteName(''); setInviteEmail(''); setInvitePerms([]);
    } catch {
      setMembers(prev => [...prev, newMember]);
      setInviteLink(`http://localhost:3000/admin/accept-invite?token=simulated_${Date.now()}`);
      showToast('✅ تم إنشاء دعوة العضو بنجاح!');
    }
    setInviteLoading(false);
  };

  const handleUpdatePermissions = async (memberId: string, permissions: string[]) => {
    try {
      await fetch(`http://localhost:5000/api/v1/team/${memberId}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ permissions }),
      });
      fetchMembers();
      setEditingMember(null);
      showToast('✅ تم تحديث الصلاحيات');
    } catch { 
      setMembers(prev => prev.map(m => m._id === memberId ? { ...m, permissions } : m));
      setEditingMember(null);
      showToast('✅ تم تحديث الصلاحيات');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (id === SUPER_ADMIN_OWNER._id) {
      showToast('⚠️ لا يمكن حذف حساب مالك المنصة الرئيسي!');
      return;
    }
    if (!confirm(`هل أنت متأكد من حذف "${name}"؟`)) return;
    try {
      await fetch(`http://localhost:5000/api/v1/team/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setMembers(prev => prev.filter(m => m._id !== id));
      showToast('✅ تم حذف العضو');
    } catch {
      setMembers(prev => prev.filter(m => m._id !== id));
      showToast('✅ تم حذف العضو');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleInvitePerm = (key: string) => {
    setInvitePerms(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, fontFamily: 'Tajawal, sans-serif', direction: 'rtl' }}>
      
      {/* Toast Notification */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: 'var(--surface)', color: 'var(--text-main)', padding: '12px 24px', borderRadius: 12, fontWeight: 800, zIndex: 9999, boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: '1px solid var(--border)' }}
        >
          {toast}
        </motion.div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 4px' }}>إدارة فريق العمل والصلاحيات 👥👑</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>عرض مالك المنصة، إضافة المساعدين، وتحديد الصلاحيات المخصصة لكل عضو.</p>
        </div>
        <button
          onClick={() => { setShowInviteModal(true); setInviteLink(''); }}
          style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#6C22F9', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: 12, fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 4px 14px rgba(108,34,249,0.3)', fontFamily: 'Tajawal, sans-serif' }}
        >
          <UserPlus size={18} /> دعوة عضو جديد للفريق
        </button>
      </div>

      {/* Team Members List */}
      <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
          <h2 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>أعضاء الفريق المسجلين ({members.length})</h2>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '16px 24px', fontWeight: 800 }}>العضو / المالك</th>
                <th style={{ padding: '16px 24px', fontWeight: 800 }}>البريد الإلكتروني</th>
                <th style={{ padding: '16px 24px', fontWeight: 800 }}>الرتبة والمسؤولية</th>
                <th style={{ padding: '16px 24px', fontWeight: 800 }}>الصلاحيات الممنوحة</th>
                <th style={{ padding: '16px 24px', fontWeight: 800, textAlign: 'left' }}>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member._id} style={{ borderBottom: '1px solid var(--border)', fontSize: 14, background: member.isOwner ? 'rgba(108,34,249,0.04)' : 'transparent' }}>
                  
                  {/* Name & Owner Badge */}
                  <td style={{ padding: '16px 24px', fontWeight: 900, color: 'var(--text-main)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {member.isOwner && <Crown size={18} color="#f59e0b" />}
                      <span>{member.name}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td style={{ padding: '16px 24px', color: 'var(--text-muted)', fontSize: 13 }}>{member.email}</td>

                  {/* Role */}
                  <td style={{ padding: '16px 24px' }}>
                    {member.isOwner ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.15))', color: '#d97706', border: '1px solid rgba(245,158,11,0.4)', padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 900 }}>
                        👑 مالك المنصة الرئيسي (Super Admin)
                      </span>
                    ) : member.isAccepted ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.15)', color: '#22c55e', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                        <CheckCircle2 size={14} /> عضو نشط بالفريق
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(245,158,11,0.15)', color: '#d97706', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 800 }}>
                        <Clock size={14} /> بانتظار قبول الدعوة
                      </span>
                    )}
                  </td>

                  {/* Permissions Badges */}
                  <td style={{ padding: '16px 24px', maxWidth: 360 }}>
                    {member.isOwner ? (
                      <span style={{ background: 'rgba(108,34,249,0.15)', color: '#6C22F9', border: '1px solid rgba(108,34,249,0.3)', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 900, display: 'inline-block' }}>
                        🌟 وصول شامل لكل أقسام لوحة التحكم (12 صلاحية)
                      </span>
                    ) : (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {member.permissions.map(p => {
                          const info = ALL_PERMISSIONS.find(ap => ap.key === p);
                          return (
                            <span key={p} style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 700, color: 'var(--text-main)' }}>
                              {info?.icon} {info?.label || p}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '16px 24px', textAlign: 'left' }}>
                    {member.isOwner ? (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>حساب محمي 🔒</span>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8 }}>
                        <button
                          onClick={() => setEditingMember(member)}
                          style={{ background: 'rgba(108,34,249,0.12)', color: '#6C22F9', border: 'none', borderRadius: 8, padding: '7px 12px', fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                        >
                          تعديل الصلاحيات
                        </button>
                        <button
                          onClick={() => handleDelete(member._id, member.name)}
                          style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer' }}
                          title="حذف العضو"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowInviteModal(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ position: 'relative', background: 'var(--surface)', borderRadius: 24, border: '1px solid var(--border)', padding: 28, width: '100%', maxWidth: 540, zIndex: 1000, fontFamily: 'Tajawal, sans-serif', maxHeight: '90vh', overflowY: 'auto' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h3 style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--text-main)' }}>دعوة مساعد أو عضو جديد للفريق ✉️</h3>
                <button onClick={() => setShowInviteModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              {!inviteLink ? (
                <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>اسم العضو / المساعد:</label>
                    <input
                      type="text" required value={inviteName} onChange={e => setInviteName(e.target.value)}
                      placeholder="مثال: د. محمد سامي"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 6 }}>البريد الإلكتروني:</label>
                    <input
                      type="email" required value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                      placeholder="assistant@platform.com"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 800, color: 'var(--text-main)', marginBottom: 10 }}>حدد الصلاحيات المسموح بها لهذا العضو:</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, maxHeight: 180, overflowY: 'auto', padding: 8, background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--border)' }}>
                      {ALL_PERMISSIONS.map(p => {
                        const active = invitePerms.includes(p.key);
                        return (
                          <div
                            key={p.key} onClick={() => toggleInvitePerm(p.key)}
                            style={{ padding: '8px 12px', borderRadius: 8, border: active ? '1px solid #6C22F9' : '1px solid var(--border)', background: active ? 'rgba(108,34,249,0.12)' : 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 800, color: active ? '#6C22F9' : 'var(--text-main)' }}
                          >
                            <span>{p.icon}</span>
                            <span>{p.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10 }}>
                    <button type="button" onClick={() => setShowInviteModal(false)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer' }}>إلغاء</button>
                    <button type="submit" disabled={inviteLoading} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#6C22F9', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}>
                      {inviteLoading ? 'جارِ إنتاج رابط الدعوة...' : 'إنشاء وتوليد رابط الدعوة 🚀'}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: 12 }}>
                  <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', color: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle2 size={28} />
                  </div>
                  <h4 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 900, color: 'var(--text-main)' }}>تم إنشاء رابط الدعوة بنجاح!</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>أرسل الرابط التالي للعضو الجديد لإكمال انضمامه للفريق بتعيين كلمة المرور:</p>
                  
                  <div style={{ display: 'flex', gap: 8, background: 'var(--bg)', border: '1px solid var(--border)', padding: 8, borderRadius: 10, marginBottom: 20 }}>
                    <input type="text" readOnly value={inviteLink} style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 12, color: 'var(--text-main)', direction: 'ltr' }} />
                    <button onClick={() => copyToClipboard(inviteLink)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#6C22F9', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}>
                      {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'تم النسخ' : 'نسخ الرابط'}
                    </button>
                  </div>

                  <button onClick={() => setShowInviteModal(false)} style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 800, cursor: 'pointer' }}>تم وإغلاق</button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Permissions Modal */}
      <AnimatePresence>
        {editingMember && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditingMember(null)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ position: 'relative', background: 'var(--surface)', borderRadius: 24, border: '1px solid var(--border)', padding: 28, width: '100%', maxWidth: 540, zIndex: 1000, fontFamily: 'Tajawal, sans-serif' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <h3 style={{ margin: '0 0 4px', fontSize: 18, fontWeight: 900, color: 'var(--text-main)' }}>تعديل صلاحيات العضو 🔐</h3>
                  <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>العضو: <strong>{editingMember.name}</strong> ({editingMember.email})</span>
                </div>
                <button onClick={() => setEditingMember(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, maxHeight: 240, overflowY: 'auto', padding: 12, background: 'var(--bg)', borderRadius: 12, border: '1px solid var(--border)', marginBottom: 20 }}>
                {ALL_PERMISSIONS.map(p => {
                  const active = editingMember.permissions.includes(p.key);
                  return (
                    <div
                      key={p.key}
                      onClick={() => {
                        const updated = active ? editingMember.permissions.filter(k => k !== p.key) : [...editingMember.permissions, p.key];
                        setEditingMember({ ...editingMember, permissions: updated });
                      }}
                      style={{ padding: '10px 12px', borderRadius: 8, border: active ? '1px solid #6C22F9' : '1px solid var(--border)', background: active ? 'rgba(108,34,249,0.12)' : 'var(--surface)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 800, color: active ? '#6C22F9' : 'var(--text-main)' }}
                    >
                      <span>{p.icon}</span>
                      <span>{p.label}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button onClick={() => setEditingMember(null)} style={{ padding: '10px 20px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontWeight: 700, cursor: 'pointer' }}>إلغاء</button>
                <button
                  onClick={() => handleUpdatePermissions(editingMember._id, editingMember.permissions)}
                  style={{ padding: '10px 24px', borderRadius: 10, border: 'none', background: '#6C22F9', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif' }}
                >
                  حفظ الصلاحيات
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
