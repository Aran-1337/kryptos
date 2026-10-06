'use client';

import React from 'react';
import { CmsTab } from '../types/cms.types';

interface CmsTabsProps {
  activeTab: CmsTab;
  onTabChange: (tab: CmsTab) => void;
}

const TABS: { id: CmsTab; label: string }[] = [
  { id: 'hero', label: '✨ عنوان ووصف الهيرو (Hero Title & Highlight)' },
  { id: 'stats', label: '📊 الإحصائيات التلقائية (Stats)' },
  { id: 'features', label: '⚡️ مميزات المنصة (Why Better)' },
  { id: 'faqs', label: '❓ الأسئلة الشائعة (FAQ)' },
  { id: 'cta', label: '🚀 بنر التسجيل والدعوة (CTA)' },
];

export default function CmsTabs({ activeTab, onTabChange }: CmsTabsProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 8,
        marginBottom: 28,
        borderBottom: '1px solid var(--border)',
        paddingBottom: 16,
        flexWrap: 'wrap',
      }}
    >
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              border: isActive ? '1px solid #6C22F9' : '1px solid var(--border)',
              fontWeight: 800,
              fontSize: 14,
              cursor: 'pointer',
              background: isActive ? '#6C22F9' : 'var(--surface)',
              color: isActive ? '#fff' : 'var(--text-main)',
              fontFamily: 'Tajawal, sans-serif',
              transition: 'all 0.15s ease',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
