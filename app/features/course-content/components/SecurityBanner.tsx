'use client';

import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function SecurityBanner() {
  return (
    <div
      style={{
        background: 'rgba(16,185,129,0.12)',
        border: '1px solid rgba(16,185,129,0.25)',
        padding: 20,
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        color: 'var(--text-main)',
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: '#10b981',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <ShieldCheck size={24} />
      </div>
      <div>
        <h4
          style={{
            margin: '0 0 4px',
            fontSize: 15,
            fontWeight: 800,
            color: '#10b981',
          }}
        >
          حماية المحتوى ضد التنزيل والسرقة مفعلة 🛡️
        </h4>
        <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
          يتم تشفير لينكات الفيديوهات (Bunny.net HLS / Vimeo Private) وطباعة
          العلامة المائية المائية المتحركة برقم اسم الطالب فوق الفيديو
          أوتوماتيكياً لمنع تسجيل الشاشة.
        </p>
      </div>
    </div>
  );
}
