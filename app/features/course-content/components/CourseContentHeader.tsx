'use client';

import React from 'react';
import Link from 'next/link';
import { Plus, ArrowRight } from 'lucide-react';

interface CourseContentHeaderProps {
  onAddSection: () => void;
}

export default function CourseContentHeader({
  onAddSection,
}: CourseContentHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      <div>
        <Link
          href="/admin/courses"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: '#6C22F9',
            fontSize: 13,
            fontWeight: 800,
            textDecoration: 'none',
            marginBottom: 8,
          }}
        >
          <ArrowRight size={16} /> العودة لقائمة الكورسات
        </Link>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 900,
            color: 'var(--text-main)',
            margin: 0,
          }}
        >
          إدارة محتوى الكورس وتجهيز اللينكات المشفّرة
        </h1>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: 14,
            margin: '4px 0 0',
          }}
        >
          رفع الدرجات بالفصول، إضافة روابط الفيديوهات المخصصة المحمية ضد السرقة والتحميل.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={onAddSection}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'linear-gradient(135deg, #6C22F9, #4f46e5)',
            color: '#fff',
            border: 'none',
            padding: '12px 20px',
            borderRadius: 12,
            fontWeight: 800,
            fontSize: 14,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(108,34,249,0.3)',
            fontFamily: 'Tajawal, sans-serif',
          }}
        >
          <Plus size={18} /> إضافة باب / فصل جديد
        </button>
      </div>
    </div>
  );
}
