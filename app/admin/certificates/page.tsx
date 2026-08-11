'use client';
import { useEffect, useState } from 'react';
import { getCertificates } from '../../lib/adminApi';

interface Certificate { _id: string; user?: { name: string; email: string }; course?: { title: string }; issuedAt: string; verificationCode?: string; }

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getCertificates().then(r => setCerts(r.data?.data?.certificates || r.data?.certificates || [])).finally(() => setLoading(false));
  }, []);

  const filtered = certs.filter(c =>
    c.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.course?.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#16133a', marginBottom: 24 }}>الشهادات</h1>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 ابحث باسم الطالب أو الكورس..."
        style={{ padding: '11px 16px', border: '1.5px solid #ebebf5', borderRadius: 12, fontSize: 14, fontFamily: "'Tajawal',sans-serif", width: 320, outline: 'none', marginBottom: 20 }} />

      {loading ? <div style={{ color: '#7c7a9a', padding: 40, textAlign: 'center' }}>جاري التحميل...</div> : (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebf5', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f9f9fd', borderBottom: '1px solid #ebebf5' }}>
                {['الطالب', 'الكورس', 'تاريخ الإصدار', 'كود التحقق', 'إجراءات'].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'right', color: '#7c7a9a', fontWeight: 600, fontSize: 13 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length ? filtered.map(c => (
                <tr key={c._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#16133a' }}>{c.user?.name || '—'}</td>
                  <td style={{ padding: '14px 16px', color: '#7c7a9a' }}>{c.course?.title || '—'}</td>
                  <td style={{ padding: '14px 16px', color: '#7c7a9a' }}>{new Date(c.issuedAt).toLocaleDateString('ar-EG')}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: 12, background: '#f3f4f6', padding: '3px 8px', borderRadius: 6 }}>{c.verificationCode || '—'}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button onClick={() => window.open(`/api/v1/certificates/${c._id}/download`, '_blank')} style={{
                      padding: '6px 14px', background: '#eeeeff', color: '#6c63ff', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: "'Tajawal',sans-serif",
                    }}>📥 تحميل PDF</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#7c7a9a' }}>لا توجد شهادات</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
