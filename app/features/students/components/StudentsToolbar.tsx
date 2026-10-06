'use client';

import React from 'react';
import { Search } from 'lucide-react';
import { GradeFilter } from '../types/student.types';

interface StudentsToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGrade: GradeFilter;
  onGradeChange: (grade: GradeFilter) => void;
}

export default function StudentsToolbar({
  searchQuery,
  onSearchChange,
  selectedGrade,
  onGradeChange,
}: StudentsToolbarProps) {
  return (
    <div
      style={{
        padding: 20,
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          position: 'relative',
          flex: 1,
          minWidth: 250,
          maxWidth: 400,
        }}
      >
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
          placeholder="ابحث بالاسم أو الإيميل..."
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

      <select
        value={selectedGrade}
        onChange={e => onGradeChange(e.target.value as GradeFilter)}
        style={{
          padding: '10px 16px',
          borderRadius: 10,
          border: '1px solid var(--border)',
          outline: 'none',
          fontSize: 14,
          fontFamily: 'Tajawal, sans-serif',
          color: 'var(--text-main)',
          background: 'var(--bg)',
          cursor: 'pointer',
        }}
      >
        <option value="all">كل المراحل الدراسية</option>
        <option value="grade1">أولى ثانوي</option>
        <option value="grade2">ثانية ثانوي</option>
        <option value="foundation">تأسيس</option>
      </select>
    </div>
  );
}
