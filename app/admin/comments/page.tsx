'use client';
import { useEffect, useState } from 'react';
import API from '../../lib/adminApi';

interface Review { _id: string; comment: string; rating: number; user?: { name: string }; course?: { title: string }; createdAt: string; isPinned?: boolean; }

export default function CommentsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    API.get('/reviews').then(r => setReviews(r.data?.data?.reviews || r.data?.reviews || [])).catch(() => setReviews([])).finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? reviews : reviews.filter(r => filter === 'pinned' ? r.isPinned : !r.isPinned);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#16133a', marginBottom: 24 }}>التعليقات والأسئلة</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[['all', 'الكل'], ['pinned', 'المثبتة'], ['normal', 'العادية']].map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)} style={{
            padding: '8px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: filter === v ? '#6c63ff' : '#f3f4f6',
            color: filter === v ? '#fff' : '#374151',
            fontWeight: 600, fontSize: 13, fontFamily: "'Tajawal',sans-serif",
          }}>{l}</button>
        ))}
      </div>

      {loading ? <div style={{ color: '#7c7a9a', padding: 40, textAlign: 'center' }}>جاري التحميل...</div> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.length ? filtered.map(r => (
            <div key={r._id} style={{ background: '#fff', borderRadius: 14, padding: 20, border: '1px solid #ebebf5', boxShadow: '0 1px 4px rgba(80,70,200,.07)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#6c63ff,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>
                      {r.user?.name?.[0] || '?'}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#16133a' }}>{r.user?.name || 'مجهول'}</div>
                      <div style={{ fontSize: 12, color: '#7c7a9a' }}>{r.course?.title || '—'} · {new Date(r.createdAt).toLocaleDateString('ar-EG')}</div>
                    </div>
                    {r.isPinned && <span style={{ padding: '2px 8px', background: '#fef3c7', color: '#92400e', borderRadius: 6, fontSize: 11, fontWeight: 700 }}>📌 مثبت</span>}
                  </div>
                  <div style={{ fontSize: 14, color: '#16133a', lineHeight: 1.7 }}>{r.comment}</div>
                  <div style={{ color: '#f59e0b', fontSize: 13, marginTop: 6 }}>{'⭐'.repeat(r.rating || 0)}</div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <button onClick={async () => { await API.patch(`/reviews/${r._id}`, { isPinned: !r.isPinned }); setReviews(p => p.map(x => x._id === r._id ? { ...x, isPinned: !x.isPinned } : x)); }} style={{
                    padding: '6px 12px', background: '#fef3c7', color: '#92400e', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: "'Tajawal',sans-serif",
                  }}>{r.isPinned ? 'إلغاء التثبيت' : 'تثبيت'}</button>
                  <button onClick={async () => { if (confirm('حذف التعليق؟')) { await API.delete(`/reviews/${r._id}`); setReviews(p => p.filter(x => x._id !== r._id)); } }} style={{
                    padding: '6px 12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 8, fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: "'Tajawal',sans-serif",
                  }}>حذف</button>
                </div>
              </div>
            </div>
          )) : <div style={{ background: '#fff', borderRadius: 16, padding: 60, textAlign: 'center', border: '1px solid #ebebf5', color: '#7c7a9a' }}>لا توجد تعليقات</div>}
        </div>
      )}
    </div>
  );
}
