'use client';
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { StudentLeaderboardItem } from '../types/leaderboard.types';
import { getRankBadgeColors } from '../utils/leaderboard.utils';

interface LeaderboardTableProps {
  students: StudentLeaderboardItem[];
  onToggleVisibility: (id: string) => void;
  onTogglePin: (id: string) => void;
  onEdit: (st: StudentLeaderboardItem) => void;
  onDelete: (id: string, name: string) => void;
}

export default function LeaderboardTable({
  students,
  onToggleVisibility,
  onTogglePin,
  onEdit,
  onDelete,
}: LeaderboardTableProps) {
  return (
    <div style={{ background: 'var(--surface)', borderRadius: 20, border: '1px solid var(--border)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
          <thead>
            <tr style={{ background: 'var(--bg)', color: 'var(--text-muted)', fontSize: 13, borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px', fontWeight: 700 }}>الترتيب</th>
              <th style={{ padding: '16px', fontWeight: 700 }}>اسم الطالب</th>
              <th style={{ padding: '16px', fontWeight: 700 }}>المرحلة</th>
              <th style={{ padding: '16px', fontWeight: 700 }}>المحافظة</th>
              <th style={{ padding: '16px', fontWeight: 700 }}>النقاط</th>
              <th style={{ padding: '16px', fontWeight: 700 }}>النسبة</th>
              <th style={{ padding: '16px', fontWeight: 700 }}>الشارة</th>
              <th style={{ padding: '16px', fontWeight: 700 }}>الظهور</th>
              <th style={{ padding: '16px', fontWeight: 700 }}>إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {students.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)', fontSize: 13.5 }}>
                  لا يوجد طلاب مطابقين للبحث.
                </td>
              </tr>
            ) : (
              students.map((st, idx) => {
                const badgeColors = getRankBadgeColors(idx);
                return (
                  <tr key={st.id} style={{ borderBottom: '1px solid var(--border)', background: st.isPinned ? 'rgba(108,34,249,0.03)' : 'transparent' }}>
                    <td style={{ padding: '16px' }}>
                      <span style={{
                        width: 32, height: 32, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13,
                        background: badgeColors.bg,
                        color: badgeColors.color
                      }}>
                        #{idx + 1}
                      </span>
                    </td>
                    <td style={{ padding: '16px', fontWeight: 800, color: 'var(--text-main)', fontSize: 14 }}>
                      {st.name} {st.isPinned && <span title="مثبت في القمة">📌</span>}
                    </td>
                    <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>{st.grade}</td>
                    <td style={{ padding: '16px', fontSize: 13, color: 'var(--text-muted)' }}>{st.governorate}</td>
                    <td style={{ padding: '16px', fontWeight: 900, color: '#6C22F9', fontSize: 14 }}>{st.points} pt</td>
                    <td style={{ padding: '16px', fontWeight: 900, color: '#22c55e', fontSize: 14 }}>{st.score}</td>
                    <td style={{ padding: '16px', fontSize: 12, fontWeight: 700, color: 'var(--text-main)' }}>
                      <span style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '4px 10px', borderRadius: 8 }}>
                        {st.badge}
                      </span>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <button
                        type="button"
                        onClick={() => onToggleVisibility(st.id)}
                        style={{
                          background: st.isVisible ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                          color: st.isVisible ? '#22c55e' : '#ef4444',
                          border: 'none', borderRadius: 8, padding: '6px 12px',
                          fontSize: 12, fontWeight: 800, cursor: 'pointer', fontFamily: 'Tajawal, sans-serif'
                        }}
                      >
                        {st.isVisible ? 'ظاهر' : 'مخفي'}
                      </button>
                    </td>
                    <td style={{ padding: '16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button
                          type="button"
                          onClick={() => onTogglePin(st.id)}
                          title={st.isPinned ? 'إلغاء التثبيت' : 'تثبيت بالقمة'}
                          style={{ background: st.isPinned ? 'rgba(245,158,11,0.2)' : 'var(--bg)', color: '#f59e0b', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 10px', cursor: 'pointer' }}
                        >
                          📌
                        </button>
                        <button
                          type="button"
                          onClick={() => onEdit(st)}
                          title="تعديل"
                          style={{ background: 'rgba(108,34,249,0.1)', color: '#6C22F9', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer' }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(st.id, st.name)}
                          title="حذف"
                          style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', borderRadius: 8, padding: '7px 10px', cursor: 'pointer' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
