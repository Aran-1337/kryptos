'use client';
import React from 'react';
import { AcademicGrade } from '@/app/utils/academicGrades';
import { Quest } from '../types/quest.types';

interface GradeTabsProps {
  selectedGradeTab: string;
  onSelectGradeTab: (tab: string) => void;
  availableGrades: AcademicGrade[];
  quests: Quest[];
}

export default function GradeTabs({
  selectedGradeTab,
  onSelectGradeTab,
  availableGrades,
  quests,
}: GradeTabsProps) {
  const allCount = quests.length;
  const generalCount = quests.filter(q => !q.grade || q.grade === 'all').length;

  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20, alignItems: 'center' }}>
      <button
        type="button"
        onClick={() => onSelectGradeTab('all')}
        style={{
          padding: '9px 18px',
          borderRadius: 12,
          border: selectedGradeTab === 'all' ? '2px solid #6C22F9' : '1px solid var(--border)',
          background: selectedGradeTab === 'all' ? 'rgba(108,34,249,0.12)' : 'var(--surface)',
          color: selectedGradeTab === 'all' ? '#6C22F9' : 'var(--text-main)',
          fontWeight: 800,
          fontSize: 13.5,
          cursor: 'pointer',
          transition: 'all 0.2s',
          fontFamily: 'Tajawal, sans-serif',
        }}
      >
        🎯 كافة التحديات ({allCount})
      </button>

      <button
        type="button"
        onClick={() => onSelectGradeTab('general')}
        style={{
          padding: '9px 18px',
          borderRadius: 12,
          border: selectedGradeTab === 'general' ? '2px solid #6C22F9' : '1px solid var(--border)',
          background: selectedGradeTab === 'general' ? 'rgba(108,34,249,0.12)' : 'var(--surface)',
          color: selectedGradeTab === 'general' ? '#6C22F9' : 'var(--text-main)',
          fontWeight: 800,
          fontSize: 13.5,
          cursor: 'pointer',
          transition: 'all 0.2s',
          fontFamily: 'Tajawal, sans-serif',
        }}
      >
        🌐 عام (كافة المراحل) ({generalCount})
      </button>

      {availableGrades.map(g => {
        const count = quests.filter(q => q.grade === g.name).length;
        const isSelected = selectedGradeTab === g.name;
        return (
          <button
            key={g.id}
            type="button"
            onClick={() => onSelectGradeTab(g.name)}
            style={{
              padding: '9px 18px',
              borderRadius: 12,
              border: isSelected ? '2px solid #6C22F9' : '1px solid var(--border)',
              background: isSelected ? 'rgba(108,34,249,0.12)' : 'var(--surface)',
              color: isSelected ? '#6C22F9' : 'var(--text-main)',
              fontWeight: 800,
              fontSize: 13.5,
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            🎓 {g.name} ({count})
          </button>
        );
      })}
    </div>
  );
}
