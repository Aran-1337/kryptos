'use client';
import React from 'react';
import { GraduationCap, Edit2, Trash2 } from 'lucide-react';
import { Quest } from '../types/quest.types';

interface QuestsListProps {
  quests: Quest[];
  onEdit: (q: Quest) => void;
  onDelete: (id: string) => void;
}

export default function QuestsList({
  quests,
  onEdit,
  onDelete,
}: QuestsListProps) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>
          🎯 قائمة التحديات والجوائز المتاحة للطلاب ({quests.length})
        </h3>
        <span style={{ fontSize: 12.5, color: 'var(--text-muted)', fontWeight: 700 }}>
          تحديات مخصصة لكل سنة دراسية لتناسب المنهج ومستوى الطلاب
        </span>
      </div>

      {quests.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)' }}>
          لا توجد أي تحديات لهذه المرحلة بعد.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20 }}>
          {quests.map(q => (
            <div
              key={q.id}
              style={{
                background: 'var(--surface)',
                borderRadius: 20,
                border: '1px solid var(--border)',
                padding: 24,
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ fontSize: 32 }}>{q.icon || '🏆'}</span>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <span
                      style={{
                        background: q.grade === 'all' || !q.grade ? 'rgba(59,130,246,0.12)' : 'rgba(108,34,249,0.12)',
                        color: q.grade === 'all' || !q.grade ? '#2563eb' : '#6C22F9',
                        padding: '4px 10px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <GraduationCap size={13} />
                      {q.grade === 'all' || !q.grade ? 'كافة المراحل 🌐' : q.grade}
                    </span>
                    <span
                      style={{
                        background: q.rewardType === 'money' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                        color: q.rewardType === 'money' ? '#10b981' : '#d97706',
                        padding: '4px 12px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 800,
                      }}
                    >
                      {q.rewardType === 'money' ? `💰 مكافأة مالية (${q.rewardAmount} ج.م)` : '🎁 هدية ملموسة شحن'}
                    </span>
                  </div>
                </div>

                <h3 style={{ fontSize: 16, fontWeight: 900, color: 'var(--text-main)', margin: '0 0 8px', lineHeight: 1.5 }}>
                  {q.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '0 0 16px', lineHeight: 1.6 }}>
                  {q.description}
                </p>

                <div
                  style={{
                    background: 'var(--bg)',
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid var(--border)',
                    fontSize: 12.5,
                    fontWeight: 800,
                    color: '#6C22F9',
                    display: 'inline-block',
                    marginBottom: 16,
                  }}
                >
                  ⚡️ المكافأة: +{q.pointsReward || 500} نقطة XP +{' '}
                  {q.rewardType === 'money' ? `${q.rewardAmount} ج.م بمحفظة الطالب` : q.rewardGiftName}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
                <button
                  type="button"
                  onClick={() => onEdit(q)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    background: 'var(--bg)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-main)',
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  <Edit2 size={14} /> تعديل التحدي
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(q.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    background: 'rgba(239,68,68,0.12)',
                    border: 'none',
                    color: '#ef4444',
                    padding: '8px 14px',
                    borderRadius: 8,
                    fontSize: 12.5,
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  <Trash2 size={14} /> حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
