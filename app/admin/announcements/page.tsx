'use client';
import { useState } from 'react';
import { sendNotification } from '../../lib/adminApi';

export default function AnnouncementsPage() {
  const [form, setForm] = useState({ title: '', message: '', type: 'all', courseId: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setSuccess(''); setError('');
    try {
      await sendNotification(form);
      setSuccess('تم إرسال الإشعار بنجاح ✅');
      setForm({ title: '', message: '', type: 'all', courseId: '' });
    } catch {
      setError('فشل الإرسال، حاول مرة أخرى');
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%', padding: '12px 16px', border: '1.5px solid #ebebf5', borderRadius: 12,
    fontSize: 14, fontFamily: "'Tajawal',sans-serif", outline: 'none', color: '#16133a',
  };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#16133a', marginBottom: 24 }}>الإعلانات والإشعارات</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #ebebf5' }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#16133a', marginBottom: 20 }}>إرسال إشعار جديد</h2>

          {success && <div style={{ background: '#d1fae5', color: '#065f46', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 14 }}>{success}</div>}
          {error && <div style={{ background: '#fee2e2', color: '#991b1b', padding: '12px 16px', borderRadius: 10, marginBottom: 16, fontSize: 14 }}>{error}</div>}

          <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#16133a', display: 'block', marginBottom: 6 }}>نوع الإشعار</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="all">لجميع الطلاب</option>
                <option value="course">لطلاب كورس معين</option>
                <option value="student">لطالب محدد</option>
              </select>
            </div>

            {form.type !== 'all' && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: '#16133a', display: 'block', marginBottom: 6 }}>
                  {form.type === 'course' ? 'ID الكورس' : 'ID الطالب'}
                </label>
                <input value={form.courseId} onChange={e => setForm(p => ({ ...p, courseId: e.target.value }))}
                  placeholder={form.type === 'course' ? 'أدخل ID الكورس' : 'أدخل ID الطالب'} style={inputStyle} />
              </div>
            )}

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#16133a', display: 'block', marginBottom: 6 }}>عنوان الإشعار *</label>
              <input required value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="عنوان الإشعار" style={inputStyle} />
            </div>

            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#16133a', display: 'block', marginBottom: 6 }}>نص الرسالة *</label>
              <textarea required value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="اكتب نص الإشعار هنا..." rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            <button type="submit" disabled={loading} style={{
              padding: '13px', background: loading ? '#a5a0ff' : 'linear-gradient(135deg,#6c63ff,#4f46e5)',
              color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 15,
              fontFamily: "'Tajawal',sans-serif", cursor: loading ? 'not-allowed' : 'pointer',
            }}>
              {loading ? 'جاري الإرسال...' : '📢 إرسال الإشعار'}
            </button>
          </form>
        </div>

        {/* Tips */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { icon: '📢', title: 'لجميع الطلاب', desc: 'يصل الإشعار لكل المسجلين في المنصة' },
            { icon: '📚', title: 'لكورس معين', desc: 'يصل فقط لطلاب الكورس المحدد' },
            { icon: '👤', title: 'لطالب محدد', desc: 'رسالة شخصية لطالب واحد' },
          ].map(tip => (
            <div key={tip.title} style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #ebebf5' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{tip.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#16133a', marginBottom: 4 }}>{tip.title}</div>
              <div style={{ fontSize: 13, color: '#7c7a9a' }}>{tip.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
