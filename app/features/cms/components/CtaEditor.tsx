'use client';

import React from 'react';
import { CtaData } from '../types/cms.types';

interface CtaEditorProps {
  cta: CtaData;
  onChange: (field: keyof CtaData, value: string) => void;
}

export default function CtaEditor({ cta, onChange }: CtaEditorProps) {
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
        تعديل نصوص بنر التسجيل والدعوة السفلي (CTA Banner)
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
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
            عنوان البنر الرئيسي
          </label>
          <input
            type="text"
            value={cta.title}
            onChange={e => onChange('title', e.target.value)}
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
            الوصف الفرعي للبنر
          </label>
          <textarea
            rows={3}
            value={cta.subtitle}
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
            نص زرار الاشتراك والتسجيل
          </label>
          <input
            type="text"
            value={cta.buttonText}
            onChange={e => onChange('buttonText', e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: 10,
              border: '1px solid var(--border)',
              background: 'var(--bg)',
              color: '#6C22F9',
              fontWeight: 900,
              fontSize: 15,
              outline: 'none',
              fontFamily: 'Tajawal, sans-serif',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>
    </div>
  );
}
