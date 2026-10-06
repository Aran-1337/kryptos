'use client';

import React from 'react';
import { Save } from 'lucide-react';

interface CmsHeaderProps {
  isSaved: boolean;
  onSave: () => void;
}

export default function CmsHeader({ isSaved, onSave }: CmsHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 28,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: 'var(--text-main)',
            margin: '0 0 6px',
          }}
        >
          التحكم الكامل في نصوص الهيرو والصفحة الرئيسية (CMS) ⚙️
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 14, margin: 0 }}>
          تحديد جملة الهيرو الملونة بالبنفسجي، العنوان، الوصف، الإحصائيات التلقائية، والمميزات بنقرة زر.
        </p>
      </div>

      <button
        onClick={onSave}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: '#10b981',
          color: '#fff',
          border: 'none',
          padding: '12px 24px',
          borderRadius: 12,
          fontWeight: 900,
          fontSize: 14,
          cursor: 'pointer',
          boxShadow: '0 4px 14px rgba(16,185,129,0.35)',
        }}
      >
        <Save size={18} /> {isSaved ? 'تم الحفظ وتحديث المنصة ✅' : 'حفظ التعديلات فوراً'}
      </button>
    </div>
  );
}
