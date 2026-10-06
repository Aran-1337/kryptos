'use client';

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { FaqItem } from '../types/cms.types';

interface FaqsEditorProps {
  faqs: FaqItem[];
  onAddFaq: () => void;
  onDeleteFaq: (index: number) => void;
  onFaqChange: (index: number, field: 'q' | 'a', val: string) => void;
}

export default function FaqsEditor({
  faqs,
  onAddFaq,
  onDeleteFaq,
  onFaqChange,
}: FaqsEditorProps) {
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 900,
            color: 'var(--text-main)',
            margin: 0,
          }}
        >
          إدارة الأسئلة الشائعة والإجابات (FAQ)
        </h3>
        <button
          onClick={onAddFaq}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#6C22F9',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: 10,
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'Tajawal, sans-serif',
          }}
        >
          <Plus size={16} /> إضافة سؤال جديد
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {faqs.map((faq, idx) => (
          <div
            key={faq.id || idx}
            style={{
              background: 'var(--bg)',
              padding: 20,
              borderRadius: 16,
              border: '1px solid var(--border)',
              position: 'relative',
            }}
          >
            <button
              onClick={() => onDeleteFaq(idx)}
              style={{
                position: 'absolute',
                top: 16,
                left: 16,
                background: 'none',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
              }}
              title="حذف هذا السؤال"
            >
              <Trash2 size={18} />
            </button>

            <div style={{ marginBottom: 12 }}>
              <label
                style={{
                  display: 'block',
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  marginBottom: 4,
                }}
              >
                السؤال المطروح
              </label>
              <input
                type="text"
                value={faq.q}
                onChange={e => onFaqChange(idx, 'q', e.target.value)}
                style={{
                  width: '90%',
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
                  fontSize: 13,
                  fontWeight: 700,
                  color: 'var(--text-muted)',
                  marginBottom: 4,
                }}
              >
                الإجابة المفصلة
              </label>
              <textarea
                rows={3}
                value={faq.a}
                onChange={e => onFaqChange(idx, 'a', e.target.value)}
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
