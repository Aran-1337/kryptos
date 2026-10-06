'use client';
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BookOrder } from '../types/book.types';
import { getWhatsAppMessageUrl } from '../utils/book.utils';

interface BookOrdersTabProps {
  orders: BookOrder[];
  onOpenTrackModal: (order: BookOrder) => void;
}

export default function BookOrdersTab({
  orders,
  onOpenTrackModal,
}: BookOrdersTabProps) {
  return (
    <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
        <thead>
          <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '16px 20px', fontWeight: 800 }}>رقم الطلب / الطالب</th>
            <th style={{ padding: '16px 20px', fontWeight: 800 }}>العنوان والمحافظة</th>
            <th style={{ padding: '16px 20px', fontWeight: 800 }}>المذكرة المطلوبة</th>
            <th style={{ padding: '16px 20px', fontWeight: 800 }}>الإجمالي</th>
            <th style={{ padding: '16px 20px', fontWeight: 800 }}>الحالة</th>
            <th style={{ padding: '16px 20px', fontWeight: 800, textAlign: 'left' }}>إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(ord => (
            <tr key={ord.id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '16px 20px' }}>
                <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: 14 }}>{ord.studentName}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{ord.id} • {ord.phone}</div>
              </td>
              <td style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#6C22F9' }}>{ord.governorate}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ord.address}</div>
              </td>
              <td style={{ padding: '16px 20px' }}>
                <div style={{ fontSize: 13.5, fontWeight: 800, color: 'var(--text-main)' }}>{ord.bookTitle}</div>
                <span style={{ fontSize: 11, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>{ord.copyType}</span>
              </td>
              <td style={{ padding: '16px 20px', fontSize: 15, fontWeight: 900, color: '#10b981' }}>
                {ord.total} ج.م
              </td>
              <td style={{ padding: '16px 20px' }}>
                <span style={{
                  padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800,
                  background: ord.status === 'delivered' ? 'rgba(16,185,129,0.15)' : ord.status === 'shipped' ? 'rgba(59,130,246,0.15)' : 'rgba(245,158,11,0.15)',
                  color: ord.status === 'delivered' ? '#10b981' : ord.status === 'shipped' ? '#3b82f6' : '#d97706'
                }}>
                  {ord.status === 'delivered' ? 'تم التوصيل ✅' : ord.status === 'shipped' ? 'تم الشحن 🚚' : 'قيد التحضير 📦'}
                </span>
              </td>
              <td style={{ padding: '16px 20px', textAlign: 'left' }}>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => onOpenTrackModal(ord)}
                    style={{ background: 'rgba(108,34,249,0.1)', color: '#6C22F9', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800, cursor: 'pointer' }}
                  >
                    تحديث الحالة
                  </button>
                  <a
                    href={getWhatsAppMessageUrl(ord)}
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: '#25D366', color: '#fff', padding: '6px 10px', borderRadius: 8, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 800 }}
                  >
                    <MessageCircle size={14} /> واتساب
                  </a>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
