'use client';
import { useState } from 'react';
import API from '../../lib/adminApi';

type Tab = 'banners' | 'about' | 'faq' | 'policy';

export default function ContentPage() {
  const [tab, setTab] = useState<Tab>('banners');
  const [about, setAbout] = useState('');
  const [policy, setPolicy] = useState('');
  const [faq, setFaq] = useState([{ q: '', a: '' }]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const save = async (data: object) => {
    setSaving(true); setMsg('');
    try { await API.post('/content', { type: tab, ...data }); setMsg('تم الحفظ ✅'); }
    catch { setMsg('فشل الحفظ ❌'); }
    finally { setSaving(false); }
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'banners', label: 'البنرات', icon: '🖼️' },
    { id: 'about', label: 'من نحن', icon: '📖' },
    { id: 'faq', label: 'الأسئلة الشائعة', icon: '❓' },
    { id: 'policy', label: 'السياسات', icon: '📜' },
  ];

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1.5px solid #ebebf5', borderRadius: 12, fontSize: 14, fontFamily: "'Tajawal',sans-serif", outline: 'none', color: '#16133a' };

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#16133a', marginBottom: 24 }}>إدارة المحتوى</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setMsg(''); }} style={{
            padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
            background: tab === t.id ? '#6c63ff' : '#f3f4f6',
            color: tab === t.id ? '#fff' : '#374151',
            fontWeight: 600, fontSize: 14, fontFamily: "'Tajawal',sans-serif",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {msg && <div style={{ background: msg.includes('✅') ? '#d1fae5' : '#fee2e2', color: msg.includes('✅') ? '#065f46' : '#991b1b', padding: '10px 16px', borderRadius: 10, marginBottom: 16, fontSize: 14 }}>{msg}</div>}

      <div style={{ background: '#fff', borderRadius: 16, padding: 28, border: '1px solid #ebebf5' }}>
        {tab === 'banners' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#16133a', marginBottom: 16 }}>رفع بنرات الموقع</h2>
            <div style={{ border: '2px dashed #ebebf5', borderRadius: 12, padding: 40, textAlign: 'center', cursor: 'pointer', color: '#7c7a9a' }}
              onClick={() => document.getElementById('bannerInput')?.click()}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🖼️</div>
              <div style={{ fontSize: 14 }}>اضغط لرفع صورة البنر</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>PNG, JPG - الأبعاد المثالية: 1920×600</div>
            </div>
            <input id="bannerInput" type="file" accept="image/*" style={{ display: 'none' }} onChange={async (e) => {
              const f = e.target.files?.[0]; if (!f) return;
              const fd = new FormData(); fd.append('file', f); fd.append('type', 'banner');
              try { await API.post('/uploads', fd); setMsg('تم رفع البنر ✅'); } catch { setMsg('فشل الرفع ❌'); }
            }} />
          </div>
        )}

        {tab === 'about' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#16133a', marginBottom: 16 }}>صفحة من نحن</h2>
            <textarea value={about} onChange={e => setAbout(e.target.value)} rows={12} placeholder="اكتب محتوى صفحة من نحن هنا..."
              style={{ ...inputStyle, resize: 'vertical' }} />
            <button onClick={() => save({ content: about })} disabled={saving} style={{ marginTop: 16, padding: '12px 28px', background: 'linear-gradient(135deg,#6c63ff,#4f46e5)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Tajawal',sans-serif" }}>
              {saving ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        )}

        {tab === 'faq' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#16133a', marginBottom: 16 }}>الأسئلة الشائعة</h2>
            {faq.map((item, i) => (
              <div key={i} style={{ marginBottom: 16, padding: 16, background: '#f9f9fd', borderRadius: 12 }}>
                <input value={item.q} onChange={e => setFaq(p => p.map((x, j) => j === i ? { ...x, q: e.target.value } : x))} placeholder={`السؤال ${i + 1}`} style={{ ...inputStyle, marginBottom: 8 }} />
                <textarea value={item.a} onChange={e => setFaq(p => p.map((x, j) => j === i ? { ...x, a: e.target.value } : x))} placeholder="الإجابة" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setFaq(p => [...p, { q: '', a: '' }])} style={{ padding: '10px 18px', background: '#eeeeff', color: '#6c63ff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: "'Tajawal',sans-serif" }}>+ إضافة سؤال</button>
              <button onClick={() => save({ faqs: faq })} disabled={saving} style={{ padding: '10px 18px', background: 'linear-gradient(135deg,#6c63ff,#4f46e5)', color: '#fff', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: "'Tajawal',sans-serif" }}>
                {saving ? 'جاري الحفظ...' : 'حفظ'}
              </button>
            </div>
          </div>
        )}

        {tab === 'policy' && (
          <div>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#16133a', marginBottom: 16 }}>سياسات الموقع</h2>
            <textarea value={policy} onChange={e => setPolicy(e.target.value)} rows={14} placeholder="اكتب سياسات الموقع هنا..."
              style={{ ...inputStyle, resize: 'vertical' }} />
            <button onClick={() => save({ content: policy })} disabled={saving} style={{ marginTop: 16, padding: '12px 28px', background: 'linear-gradient(135deg,#6c63ff,#4f46e5)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Tajawal',sans-serif" }}>
              {saving ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
