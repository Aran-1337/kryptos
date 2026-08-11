'use client';
import { useEffect, useState } from 'react';
import { getOrders } from '../../lib/adminApi';
import StatsCard from '../components/StatsCard';

interface Order {
  _id: string; totalAmount: number; status: string; createdAt: string;
  user?: { name: string; email: string };
  items?: { course?: { title: string } }[];
}

export default function EarningsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders({ status: 'completed' }).then(r => setOrders(r.data?.data?.orders || r.data?.orders || [])).finally(() => setLoading(false));
  }, []);

  const total = orders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const today = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).reduce((s, o) => s + o.totalAmount, 0);
  const thisMonth = orders.filter(o => {
    const d = new Date(o.createdAt);
    const n = new Date();
    return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear();
  }).reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: '#16133a', marginBottom: 24 }}>الأرباح</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 20, marginBottom: 32 }}>
        <StatsCard icon="💰" label="إجمالي الأرباح" value={`${total.toLocaleString('ar-EG')} ج.م`} color="#10b981" />
        <StatsCard icon="📅" label="أرباح اليوم" value={`${today.toLocaleString('ar-EG')} ج.م`} color="#6c63ff" />
        <StatsCard icon="🗓️" label="أرباح الشهر" value={`${thisMonth.toLocaleString('ar-EG')} ج.م`} color="#f59e0b" />
        <StatsCard icon="🧾" label="عدد الطلبات" value={orders.length} color="#ef4444" />
      </div>

      {loading ? <div style={{ color: '#7c7a9a', padding: 40, textAlign: 'center' }}>جاري التحميل...</div> : (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #ebebf5', overflow: 'hidden', boxShadow: '0 1px 4px rgba(80,70,200,.07)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #ebebf5', fontWeight: 700, fontSize: 15, color: '#16133a' }}>سجل المدفوعات</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f9f9fd', borderBottom: '1px solid #ebebf5' }}>
                {['الطالب', 'الكورس', 'المبلغ', 'التاريخ', 'الحالة'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'right', color: '#7c7a9a', fontWeight: 600, fontSize: 13 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length ? orders.map(o => (
                <tr key={o._id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#16133a' }}>{o.user?.name || '—'}</td>
                  <td style={{ padding: '12px 16px', color: '#7c7a9a' }}>{o.items?.[0]?.course?.title || '—'}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#10b981' }}>{o.totalAmount?.toLocaleString('ar-EG')} ج.م</td>
                  <td style={{ padding: '12px 16px', color: '#7c7a9a' }}>{new Date(o.createdAt).toLocaleDateString('ar-EG')}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: '#d1fae5', color: '#065f46' }}>مكتمل</span>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} style={{ padding: 40, textAlign: 'center', color: '#7c7a9a' }}>لا توجد مدفوعات بعد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
