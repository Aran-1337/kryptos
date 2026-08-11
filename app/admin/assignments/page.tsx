'use client';
import { useEffect, useState } from 'react';
import API from '../../lib/adminApi';

interface Assignment { _id: string; title: string; dueDate?: string; course?: { title: string }; submissions?: unknown[]; }

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/assignments').then(r => setAssignments(r.data?.data?.assignments || r.data?.assignments || [])).catch(() => setAssignments([])).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#16133a', marginBottom: 24 }}>إدارة الواجبات</h1>
      {loading ? <div style={{ color: '#7c7a9a', padding: 40, textAlign: 'center' }}>جاري التحميل...</div> : (
        assignments.length ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
            {assignments.map(a => (
              <div key={a._id} style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid #ebebf5', boxShadow: '0 1px 4px rgba(80,70,200,.07)' }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#16133a', marginBottom: 8 }}>📋 {a.title}</div>
                {a.course && <div style={{ fontSize: 13, color: '#7c7a9a', marginBottom: 6 }}>📚 {a.course.title}</div>}
                {a.dueDate && <div style={{ fontSize: 13, color: '#7c7a9a', marginBottom: 12 }}>📅 الموعد النهائي: {new Date(a.dueDate).toLocaleDateString('ar-EG')}</div>}
                <div style={{ fontSize: 13, color: '#6c63ff', fontWeight: 600 }}>📥 {a.submissions?.length || 0} حل مُسلَّم</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 16, padding: 60, textAlign: 'center', border: '1px solid #ebebf5', color: '#7c7a9a' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>لا توجد واجبات بعد</div>
            <div style={{ fontSize: 13, marginTop: 8 }}>الواجبات تُضاف من خلال الدروس</div>
          </div>
        )
      )}
    </div>
  );
}
