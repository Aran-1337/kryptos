'use client';
import React from 'react';
import { Crown, Trophy, Shield } from 'lucide-react';
import { StudentLeaderboardItem } from '../types/leaderboard.types';

interface LeaderboardStatsProps {
  topStudent?: StudentLeaderboardItem;
  totalCount: number;
  autoRank: boolean;
  onToggleAutoRank: () => void;
}

export default function LeaderboardStats({
  topStudent,
  totalCount,
  autoRank,
  onToggleAutoRank,
}: LeaderboardStatsProps) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
      <div style={{ background: 'var(--surface)', padding: '20px 24px', borderRadius: 20, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>المركز الأول الحالى 👑</span>
          <Crown size={20} color="#f59e0b" />
        </div>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: 'var(--text-main)' }}>{topStudent?.name || '-'}</p>
        <span style={{ fontSize: 12, color: '#f59e0b', fontWeight: 700 }}>
          {topStudent?.score} {topStudent?.points ? `(${topStudent.points} pt)` : ''}
        </span>
      </div>

      <div style={{ background: 'var(--surface)', padding: '20px 24px', borderRadius: 20, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>إجمالي الطلاب المكرمين</span>
          <Trophy size={20} color="#6C22F9" />
        </div>
        <p style={{ margin: 0, fontSize: 22, fontWeight: 900, color: '#6C22F9' }}>{totalCount} طالب</p>
      </div>

      <div style={{ background: 'var(--surface)', padding: '20px 24px', borderRadius: 20, border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 700 }}>آلية الترتيب والنقاط التلقائية ⚡️</span>
          <Shield size={20} color={autoRank ? '#22c55e' : '#94a3b8'} />
        </div>
        <button
          type="button"
          onClick={onToggleAutoRank}
          style={{
            background: autoRank ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.15)',
            color: autoRank ? '#22c55e' : '#64748b',
            border: 'none', borderRadius: 10, padding: '6px 14px',
            fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif'
          }}
        >
          {autoRank ? 'مفعل (امتحانات + دقائق مشاهدة + تسليمات 🎯)' : 'يدوي (تحديد الأدمن)'}
        </button>
      </div>
    </div>
  );
}
