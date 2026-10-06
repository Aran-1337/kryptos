'use client';

import React from 'react';
import { WhyBetterData } from '../types/cms.types';

interface FeaturesEditorProps {
  whyBetter: WhyBetterData;
  onTitleChange: (title: string) => void;
  onFeatureChange: (index: number, field: 'title' | 'desc', val: string) => void;
}

export default function FeaturesEditor({
  whyBetter,
  onTitleChange,
  onFeatureChange,
}: FeaturesEditorProps) {
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
        تعديل عنوان ونصوص كروت &quot;إيه اللي بيميزنا عن الباقيين؟&quot;
      </h3>

      <div
        style={{
          marginBottom: 24,
          paddingBottom: 20,
          borderBottom: '1px solid var(--border)',
        }}
      >
        <label
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 700,
            color: 'var(--text-muted)',
            marginBottom: 6,
          }}
        >
          عنوان القسم الرئيسي
        </label>
        <input
          type="text"
          value={whyBetter.title}
          onChange={e => onTitleChange(e.target.value)}
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
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        {whyBetter.features.map((feat, idx) => (
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
              كارت الميزة #{idx + 1}
            </span>

            <div style={{ marginBottom: 10 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  marginBottom: 4,
                }}
              >
                عنوان الكارت
              </label>
              <input
                type="text"
                value={feat.title}
                onChange={e => onFeatureChange(idx, 'title', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text-main)',
                  fontWeight: 800,
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
                  fontSize: 12,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  marginBottom: 4,
                }}
              >
                الوصف المكتوب
              </label>
              <textarea
                rows={2}
                value={feat.desc}
                onChange={e => onFeatureChange(idx, 'desc', e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: 8,
                  border: '1px solid var(--border)',
                  background: 'var(--surface)',
                  color: 'var(--text-main)',
                  fontSize: 13,
                  outline: 'none',
                  fontFamily: 'Tajawal, sans-serif',
                  resize: 'vertical',
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
