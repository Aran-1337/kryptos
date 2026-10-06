'use client';

import React from 'react';
import { HeroHeaderData } from '../types/cms.types';

interface HeroEditorProps {
  heroHeader: HeroHeaderData;
  onChange: (field: keyof HeroHeaderData, value: string) => void;
}

export default function HeroEditor({ heroHeader, onChange }: HeroEditorProps) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        padding: 28,
        borderRadius: 20,
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <h3
        style={{
          fontSize: 18,
          fontWeight: 900,
          color: 'var(--text-main)',
          marginBottom: 20,
        }}
      >
        التحكم في نصوص واجهة الهيرو وتحديد الكلمة الملونة بالبنفسجي
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div>
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text-muted)',
              marginBottom: 6,
            }}
          >
            السطر الأول من العنوان الرئيسي (اللون الداكن/العادي)
          </label>
          <input
            type="text"
            value={heroHeader.titleLine1}
            onChange={e => onChange('titleLine1', e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text-main)',
              fontWeight: 900,
              fontSize: 16,
              outline: 'none',
              fontFamily: 'Tajawal, sans-serif',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div
          style={{
            background: 'rgba(108,34,249,0.06)',
            padding: 16,
            borderRadius: 14,
            border: '1px dashed #6C22F9',
          }}
        >
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 800,
              color: '#6C22F9',
              marginBottom: 6,
            }}
          >
            الكلمة أو الجملة الملونة بالبنفسجي المميز (Purple Gradient Highlight) 🎨
          </label>
          <input
            type="text"
            value={heroHeader.titleHighlight}
            onChange={e => onChange('titleHighlight', e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: '2px solid #6C22F9',
              background: 'var(--surface)',
              color: '#6C22F9',
              fontWeight: 900,
              fontSize: 16,
              outline: 'none',
              fontFamily: 'Tajawal, sans-serif',
              boxSizing: 'border-box',
            }}
          />
          <span
            style={{
              fontSize: 12,
              color: 'var(--text-muted)',
              marginTop: 6,
              display: 'block',
            }}
          >
            أي نص تكتبه هنا يظهر فوراً باللون البنفسجي الساطع المتدرج في السطر الثاني من الهيرو!
          </span>
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text-muted)',
              marginBottom: 6,
            }}
          >
            نص البادج الترحيبي أعلى الهيرو (Hero Badge)
          </label>
          <input
            type="text"
            value={heroHeader.badge}
            onChange={e => onChange('badge', e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text-main)',
              fontWeight: 700,
              fontSize: 14,
              outline: 'none',
              fontFamily: 'Tajawal, sans-serif',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text-muted)',
              marginBottom: 6,
            }}
          >
            الوصف الفرعي للهيرو (Hero Subtitle / Description)
          </label>
          <textarea
            rows={3}
            value={heroHeader.subtitle}
            onChange={e => onChange('subtitle', e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: 'var(--text-main)',
              fontSize: 14,
              outline: 'none',
              fontFamily: 'Tajawal, sans-serif',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>
    </div>
  );
}
