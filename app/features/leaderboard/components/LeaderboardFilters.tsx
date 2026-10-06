'use client';
import React from 'react';
import { Search } from 'lucide-react';
import { AcademicGrade } from '@/app/utils/academicGrades';

interface LeaderboardFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  selectedGrade: string;
  onSelectGrade: (grade: string) => void;
  activeGrades: AcademicGrade[];
}

export default function LeaderboardFilters({
  search,
  setSearch,
  selectedGrade,
  onSelectGrade,
  activeGrades,
}: LeaderboardFiltersProps) {
  return (
    <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', padding: 20, marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 260px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '50%', right: 14, transform: 'translateY(-50%)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن اسم طالب أو محافظة..."
            style={{
              width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '10px 42px 10px 14px', color: 'var(--text-main)',
              fontSize: 14, fontFamily: 'Tajawal, sans-serif', outline: 'none', boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Grade filter tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[
            { key: 'all', label: 'الكل' },
            ...activeGrades.map(g => ({ key: g.name, label: g.name }))
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectGrade(tab.key)}
              style={{
                padding: '8px 16px', borderRadius: 10, border: 'none',
                fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif',
                background: selectedGrade === tab.key ? '#6C22F9' : 'var(--bg)',
                color: selectedGrade === tab.key ? '#fff' : 'var(--text-muted)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
