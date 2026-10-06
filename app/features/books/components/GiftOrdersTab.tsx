'use client';
import React from 'react';
import { GiftOrder } from '../types/book.types';

interface GiftOrdersTabProps {
  giftOrders: GiftOrder[];
  onUpdateStatus: (id: string, status: string) => void;
}

export default function GiftOrdersTab({
  giftOrders,
  onUpdateStatus,
}: GiftOrdersTabProps) {
  return (
    <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
        <thead>
          <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
            <th style={{ padding: '16px 20px', fontWeight: 800 }}>الطالب والعنوان</th>
            <th style={{ padding: '16px 20px', fontWeight: 800 }}>هدية التحدي المستحقة</th>
            <th style={{ padding: '16px 20px', fontWeight: 800 }}>حالة الشحن</th>
            <th style={{ padding: '16px 20px', fontWeight: 800, textAlign: 'left' }}>إجراءات الأدمن</th>
          </tr>
        </thead>
        <tbody>
          {giftOrders.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>
                لا توجد طلبات جوائز ملموسة حالياً.
              </td>
            </tr>
          ) : (
            giftOrders.map(g => (
              <tr key={g.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: 900, color: 'var(--text-main)', fontSize: 14 }}>{g.studentName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{g.governorate} - {g.address} ({g.phone})</div>
                </td>
                <td style={{ padding: '16px 20px', fontSize: 13.5, fontWeight: 800, color: '#6C22F9' }}>
                  <div>{g.giftName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>التحدي: {g.questTitle}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800,
                    background: g.status === 'تم التسليم' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                    color: g.status === 'تم التسليم' ? '#10b981' : '#d97706'
                  }}>
                    {g.status}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'left' }}>
                  <select
                    value={g.status}
                    onChange={e => onUpdateStatus(g.id, e.target.value)}
                    style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-main)', fontSize: 12, fontWeight: 800, fontFamily: 'Tajawal, sans-serif' }}
                  >
                    <option value="قيد الشحن">قيد الشحن 🚚</option>
                    <option value="تم التسليم">تم التسليم ✅</option>
                    <option value="ملغي">ملغي ❌</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
