'use client';

import React from 'react';
import { Plus } from 'lucide-react';

interface CoursesHeaderProps {
  onAddNew: () => void;
}

export default function CoursesHeader({ onAddNew }: CoursesHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: 'var(--text-main)',
            marginBottom: 8,
          }}
        >
          إدارة الكورسات والمناهج الدراسية
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
          تحكم في الكورسات المتاحة على المنصة، رفع المحتوى المشفر ضد السرقة، وضبط الأسعار والخصومات.
        </p>
      </div>
      <button
        onClick={onAddNew}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#6C22F9',
          color: '#fff',
          border: 'none',
          padding: '12px 24px',
          borderRadius: 12,
          fontWeight: 800,
          fontSize: 15,
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(108, 34, 249, 0.35)',
          fontFamily: 'Tajawal, sans-serif',
        }}
      >
        <Plus size={18} /> إضافة كورس جديد
      </button>
    </div>
  );
}
