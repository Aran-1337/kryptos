'use client';
import { OrdersList } from '@/app/features/orders';
import { Receipt } from 'lucide-react';

export default function StudentOrdersPage() {
  return (
    <div
      style={{
        direction: 'rtl',
        fontFamily: 'Tajawal, sans-serif',
        maxWidth: 1200,
        margin: '0 auto',
        padding: '8px 4px 40px',
      }}
    >
      {/* Page Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: '#eef2ff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Receipt size={20} />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: 0 }}>
            طلباتي وسجل المشتريات
          </h1>
        </div>
        <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
          متابعة حالة طلبات الكورسات والكتب، وتفاصيل الدفع والفواتير الخاصة بحسابك.
        </p>
      </div>

      {/* Orders List Feature */}
      <OrdersList />
    </div>
  );
}
