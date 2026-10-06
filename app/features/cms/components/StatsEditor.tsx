'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { HeroStatItem } from '../types/cms.types';

interface StatsEditorProps {
  heroStats: HeroStatItem[];
  onStatChange: (index: number, field: 'value' | 'label', val: string) => void;
}

export default function StatsEditor({ heroStats, onStatChange }: StatsEditorProps) {
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
      <div
        style={{
          background: 'rgba(16,185,129,0.1)',
          padding: 16,
          borderRadius: 14,
          border: '1px solid rgba(16,185,129,0.3)',
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <RefreshCw size={20} color="#10b981" />
        <p
          style={{
            margin: 0,
            fontSize: 13.5,
            color: 'var(--text-main)',
            fontWeight: 700,
          }}
        >
          💡 الأرقام أدناه تُحسب وتتحدث أوتوماتيكياً حسب تقييمات الطلاب الحقيقية،
          عدد ساعات الكورسات المرفوعة، وعدد الطلاب المسجلين بالمنصة.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 20,
        }}
      >
        {heroStats.map((stat, idx) => (
          <div
            key={idx}
            style={{
              background: 'var(--bg)',
              padding: 20,
              borderRadius: 16,
              border: '1px solid var(--border)',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: '#6C22F9',
                display: 'block',
                marginBottom: 10,
              }}
            >
              الرقم الإحصائي #{idx + 1}
            </span>

            <div style={{ marginBottom: 12 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  marginBottom: 4,
                }}
              >
                القيمة والرقم (أوتوماتيكي أو يدوي)
              </label>
              <input
                type="text"
                value={stat.value}
                onChange={e => onStatChange(idx, 'value', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text-main)',
                  fontWeight: 800,
                  fontSize: 15,
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
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  marginBottom: 4,
                }}
              >
                النص والوصف (مثال: متوسط تقييم الطلبة)
              </label>
              <input
                type="text"
                value={stat.label}
                onChange={e => onStatChange(idx, 'label', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'Tajawal, sans-serif',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
