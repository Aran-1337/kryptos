'use client';
import React from 'react';
import { Book } from '../types/book.types';

interface InventoryTabProps {
  books: Book[];
}

export default function InventoryTab({ books }: InventoryTabProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
      {books.map(b => (
        <div key={b.id} style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 24, boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ background: 'rgba(108,34,249,0.12)', color: '#6C22F9', padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 800 }}>
              {b.type}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700 }}>المبيعات: {b.salesCount} نسخة</span>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 12px', lineHeight: 1.5 }}>{b.title}</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
            <div>
              <span style={{ fontSize: 18, fontWeight: 900, color: '#10b981' }}>{b.price} ج.م</span>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'line-through', marginRight: 6 }}>{b.originalPrice} ج.م</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 800, color: b.stock > 10 ? '#10b981' : '#ef4444' }}>
              المخزون: {b.stock} قطعة
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
