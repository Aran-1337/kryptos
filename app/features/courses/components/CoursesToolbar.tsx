'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface CoursesToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function CoursesToolbar({
  searchQuery,
  onSearchChange,
}: CoursesToolbarProps) {
  return (
    <div
      style={{
        padding: 20,
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        gap: 16,
        alignItems: 'center',
      }}
    >
      <div style={{ position: 'relative', flex: 1, maxWidth: 400 }}>
        <Search
          size={18}
          color="var(--text-muted)"
          style={{
            position: 'absolute',
            right: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
          }}
        />
        <input
          type="text"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="ابحث عن كورس..."
          style={{
            width: '100%',
            padding: '10px 42px 10px 14px',
            borderRadius: 10,
            border: '1px solid var(--border)',
            background: 'var(--bg)',
            color: 'var(--text-main)',
            outline: 'none',
            fontSize: 14,
            fontFamily: 'Tajawal, sans-serif',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  );
}
